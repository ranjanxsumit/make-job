import { pool } from "./db";

export async function ensureSeed() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query("SELECT COUNT(*)::int AS c FROM jobs");
    const count = rows[0]?.c as number;
    if (count && count >= 6) return;
    // User-provided sample dataset
    const jobs = [
      { title: 'Full Stack Developer', company_name: 'Amazon', location: 'Onsite', job_type: 'Full-time', salary_range: '12LPA', salary_min: 1200000, salary_max: 1200000, description: 'A user-friendly interface lets you browse stunning photos and videos. Filter destinations based on interests and travel style, and create personalized', requirements: 'React, Node.js, TypeScript, PostgreSQL, AWS', responsibilities: 'Develop and maintain web applications, collaborate with cross-functional teams', application_deadline: '2024-12-31' },
      { title: 'Node Js Developer', company_name: 'Tesla', location: 'Onsite', job_type: 'Full-time', salary_range: '12LPA', salary_min: 1200000, salary_max: 1200000, description: 'A user-friendly interface lets you browse stunning photos and videos. Filter destinations based on interests and travel style, and create personalized', requirements: 'Node.js, Express, MongoDB, AWS, Docker', responsibilities: 'Build scalable backend services, optimize database performance', application_deadline: '2024-12-31' },
      { title: 'UX/UI Designer', company_name: 'Company', location: 'Onsite', job_type: 'Full-time', salary_range: '12LPA', salary_min: 1200000, salary_max: 1200000, description: 'A user-friendly interface lets you browse stunning photos and videos. Filter destinations based on interests and travel style, and create personalized', requirements: 'Figma, Adobe Creative Suite, Prototyping, User Research', responsibilities: 'Design user interfaces and experiences, conduct user research', application_deadline: '2024-12-31' },
      { title: 'Full Stack Developer', company_name: 'Microsoft', location: 'Onsite', job_type: 'Full-time', salary_range: '12LPA', salary_min: 1200000, salary_max: 1200000, description: 'A user-friendly interface lets you browse stunning photos and videos. Filter destinations based on interests and travel style, and create personalized', requirements: 'React, .NET, Azure, SQL Server, C#', responsibilities: 'Develop enterprise applications, maintain legacy systems', application_deadline: '2024-12-31' },
    ] as any[];
    const colRows = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='jobs'`);
    const cols = new Set(colRows.rows.map((r: any) => r.column_name));
    for (const j of jobs) {
      const companyCols = cols.has("company_name") && cols.has("company") ? ["company","company_name"] : [cols.has("company_name") ? "company_name" : "company"];
      const deadlineCol = cols.has("application_deadline") ? "application_deadline" : "deadline";
  const baseCols = ["title", ...companyCols, "location", "job_type", "description", "requirements", "responsibilities", deadlineCol];
  if (cols.has("salary_range")) baseCols.splice(5, 0, "salary_range");
  // include numeric salary_min / salary_max if the schema has them so filters work
  const hasSalaryMin = cols.has("salary_min") && cols.has("salary_max");
  if (hasSalaryMin) baseCols.splice(5, 0, "salary_min", "salary_max");
      const params = baseCols.map((_, i) => `$${i+1}`).join(",");
  const values: any[] = [j.title];
      if (companyCols.length === 2) { values.push(j.company_name, j.company_name); } else { values.push(j.company_name); }
  values.push(j.location, j.job_type);
  if (hasSalaryMin) values.push(j.salary_min, j.salary_max);
  if (cols.has("salary_range")) values.push(j.salary_range);
  values.push(j.description, j.requirements, j.responsibilities, j.application_deadline);
      await client.query(`INSERT INTO jobs (${baseCols.join(",")}) VALUES (${params})`, values);
    }
    console.log(`Seeded ${jobs.length} jobs`);
  } finally {
    client.release();
  }
}
