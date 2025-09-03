import { RequestHandler } from "express";
import { pool } from "../db";
import { z } from "zod";
import fs from "fs";
import path from "path";

const jobInputSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  jobType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  salaryMin: z.number().int().nonnegative(),
  salaryMax: z.number().int().nonnegative(),
  description: z.string().min(1),
  requirements: z.string().min(1),
  responsibilities: z.string().min(1),
  deadline: z.string().refine((d) => !isNaN(Date.parse(d)), { message: "Invalid date" }),
});

export const listJobs: RequestHandler = async (req, res) => {
  const { title, location, jobType, minSalary, maxSalary } = req.query as Record<string, string | undefined>;

  const filters: string[] = [];
  const values: any[] = [];

  if (title) {
    values.push(`%${title}%`);
    filters.push(`title ILIKE $${values.length}`);
  }
  if (location) {
    values.push(`%${location}%`);
    filters.push(`location ILIKE $${values.length}`);
  }
  if (jobType) {
    values.push(jobType);
    filters.push(`job_type = $${values.length}`);
  }
  if (minSalary) {
    values.push(Number(minSalary));
    filters.push(`salary_min >= $${values.length}`);
  }
  if (maxSalary) {
    values.push(Number(maxSalary));
    filters.push(`salary_max <= $${values.length}`);
  }

  const meta = await ensureColumnInfo();
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const deadlineSel = meta.deadlineCol;

  // if numeric salary columns exist, use them directly; otherwise attempt to parse numeric values from salary_range
  let selectSalary = "salary_min as \"salaryMin\", salary_max as \"salaryMax\"";
  if (!meta.hasSalaryMin) {
    // derive numbers from salary_range like '12LPA' -> 1200000
    // use regexp to extract leading number and multiply by 100000
    selectSalary = `CASE WHEN salary_range ~ '^\\d+' THEN (CAST((regexp_match(salary_range, '^(\\\\d+)'))[1] AS integer) * 100000) ELSE NULL END as \"salaryMin\", CASE WHEN salary_range ~ '^\\d+' THEN (CAST((regexp_match(salary_range, '^(\\\\d+)'))[1] AS integer) * 100000) ELSE NULL END as \"salaryMax\"`;
  }

  const query = `SELECT id, title, COALESCE(company, company_name) as company, location, job_type as "jobType", ${selectSalary}, description, requirements, responsibilities, ${deadlineSel} as "deadline", created_at as "createdAt" FROM jobs ${where} ORDER BY created_at DESC`;

  const { rows } = await pool.query(query, values);
  // attach logo URL for each job
  const out = rows.map((r: any) => ({ ...r, logo: getLogoForCompany(r.company) }));
  res.json(out);
};

let columnCache: { companyCols: ("company"|"company_name")[]; deadlineCol: "deadline"|"application_deadline"; hasSalaryRange: boolean; hasSalaryMin: boolean } | null = null;
async function ensureColumnInfo() {
  if (columnCache) return columnCache;
  const { rows } = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='jobs'`);
  const names = rows.map((r: any) => r.column_name) as string[];
  const hasCompany = names.includes("company");
  const hasCompanyName = names.includes("company_name");
  const companyCols: ("company" | "company_name")[] = hasCompany && hasCompanyName
    ? ["company", "company_name"]
    : [hasCompanyName ? "company_name" : "company"];
  const deadlineCol = (names.includes("application_deadline") ? "application_deadline" : "deadline") as "deadline"|"application_deadline";
  const hasSalaryRange = names.includes("salary_range");
  const hasSalaryMin = names.includes("salary_min") && names.includes("salary_max");
  columnCache = { companyCols, deadlineCol, hasSalaryRange, hasSalaryMin };
  return columnCache;
}

export const createJob: RequestHandler = async (req, res) => {
  const parsed = jobInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  const j = parsed.data;
  const meta = await ensureColumnInfo();

  // build columns dynamically depending on which columns exist
  const baseCols = ["title", ...meta.companyCols, "location", "job_type"] as string[];
  const willHaveSalaryRange = meta.hasSalaryRange;
  const willHaveSalaryMin = meta.hasSalaryMin;
  if (willHaveSalaryRange) baseCols.push("salary_range");
  if (willHaveSalaryMin) baseCols.push("salary_min", "salary_max");
  baseCols.push("description", "requirements", "responsibilities", meta.deadlineCol);

  const params = baseCols.map((_, i) => `$${i+1}`).join(",");
  const values: any[] = [j.title];
  if (meta.companyCols.length === 2) { values.push(j.company, j.company); } else { values.push(j.company); }
  values.push(j.location, j.jobType);
  if (willHaveSalaryRange) values.push(`${Math.round(j.salaryMin/100000)}LPA`);
  if (willHaveSalaryMin) values.push(j.salaryMin, j.salaryMax);
  values.push(j.description, j.requirements, j.responsibilities, j.deadline);

  const insertSql = `INSERT INTO jobs (${baseCols.join(",")}) VALUES (${params}) RETURNING id, title, COALESCE(company, company_name) as company, location, job_type as "jobType", ${willHaveSalaryMin ? 'salary_min as "salaryMin", salary_max as "salaryMax",' : ''} description, requirements, responsibilities, ${meta.deadlineCol} as "deadline", created_at as "createdAt"`;
  const { rows } = await pool.query(insertSql, values);
  const job = rows[0];
  job.logo = getLogoForCompany(job.company);
  res.status(201).json(job);
};

// Helper: normalize a company name into a slug-like string
function normalizeCompanyName(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/\b(inc|inc\.|ltd|llc|co|company|corporation|corp|pvt|pvt\.|private)\b/g, "")
    .replace(/[.,()'"&]/g, "")
    .replace(/[^a-z0-9-_\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Helper: return a logo URL (local /logos/<slug>.png if exists, else known remote, else placeholder)
function getLogoForCompany(company: string): string {
  const slug = normalizeCompanyName(company || "");
  const localPath = `/logos/${slug}.png`;
  const diskPath = path.resolve(__dirname, "..", "..", "public", "logos", `${slug}.png`);
  try {
    if (fs.existsSync(diskPath)) return localPath;
  } catch (e) {
    // ignore
  }

  // remote fallbacks for known companies
  const lower = (company || "").toLowerCase();
  if (lower.includes("amazon")) return "https://cdn.builder.io/api/v1/image/assets%2Fce419d39d09941f3b17bd7113cc09698%2F203f7263590c47daaf2e44d63769ec74?format=webp&width=128";
  if (lower.includes("tesla")) return "https://cdn.builder.io/api/v1/image/assets%2Fce419d39d09941f3b17bd7113cc09698%2Fa7d4321c9b8046c58b4913ace3075e88?format=webp&width=128";
  if (lower.includes("microsoft")) return "https://cdn.builder.io/api/v1/image/assets%2Fce419d39d09941f3b17bd7113cc09698%2F1e0f5be7cf9146e0a98f8c0f6b2a77f9?format=webp&width=128";
  if (lower.includes("swiggy")) return "/logos/swiggy.png"; // prefer local name if available

  return "/placeholder.svg";
}
