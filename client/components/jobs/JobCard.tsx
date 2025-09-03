import * as React from "react";
import { Job } from "@shared/api";

export function JobCard({ job }: { job: Job }) {
  const company = (job.company || "").toLowerCase();

  // remote CDN fallbacks for known companies
  const remoteLogo = company.includes("amazon")
    ? "https://cdn.builder.io/api/v1/image/assets%2Fce419d39d09941f3b17bd7113cc09698%2F203f7263590c47daaf2e44d63769ec74?format=webp&width=128"
    : company.includes("tesla")
    ? "https://cdn.builder.io/api/v1/image/assets%2Fce419d39d09941f3b17bd7113cc09698%2Fa7d4321c9b8046c58b4913ace3075e88?format=webp&width=128"
    : company.includes("microsoft")
    ? "https://cdn.builder.io/api/v1/image/assets%2Fce419d39d09941f3b17bd7113cc09698%2F1e0f5be7cf9146e0a98f8c0f6b2a77f9?format=webp&width=128"
    : undefined;

  // If you want to provide an HD logo, paste it at: /public/logos/<slug>.png
  // e.g. public/logos/amazon.png -> accessible at /logos/amazon.png
  // Normalize company name to a slug that matches filenames placed in /public/logos
  const normalizeCompany = (s: string) =>
    s
      .toLowerCase()
      // remove common legal suffixes
      .replace(/\b(inc|inc\.|ltd|llc|co|company|corporation|corp)\b/g, "")
      // remove punctuation
      .replace(/[.,()'"&]/g, "")
      // replace any non-alphanumeric (except - and _) with dash
      .replace(/[^a-z0-9-_\s]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const companySlug = normalizeCompany(company || "");
  // build ordered list of candidates: explicit brand mapping, exact local slug, brand local aliases, remote CDN, placeholder
  const localCandidates: string[] = [];

  // explicit mapping helps catch variations and typos (ensures tesla -> /logos/tesla.png)
  const explicitMap: Record<string, string> = {
    tesla: "/logos/tesla.png",
    amazon: "/logos/amazon.png",
    swiggy: "/logos/swiggy.png",
  };

  // add explicit matches first
  for (const key of Object.keys(explicitMap)) {
    if (company.includes(key) && !localCandidates.includes(explicitMap[key])) {
      localCandidates.push(explicitMap[key]);
    }
  }

  // then add exact slug match (prefer SVGs then PNGs if present in public/logos)
  if (companySlug) {
    localCandidates.push(`/logos/${companySlug}.svg`);
    localCandidates.push(`/logos/${companySlug}.png`);
  }

  // add broader aliases for known brands so variations still hit canonical logo
  if (company.includes("tesla")) {
    if (!localCandidates.includes(`/logos/tesla.svg`)) localCandidates.push(`/logos/tesla.svg`);
    if (!localCandidates.includes(`/logos/tesla.png`)) localCandidates.push(`/logos/tesla.png`);
  }
  if (company.includes("amazon")) {
    if (!localCandidates.includes(`/logos/amazon.svg`)) localCandidates.push(`/logos/amazon.svg`);
    if (!localCandidates.includes(`/logos/amazon.png`)) localCandidates.push(`/logos/amazon.png`);
  }
  if (company.includes("swiggy")) {
    if (!localCandidates.includes(`/logos/swiggy.svg`)) localCandidates.push(`/logos/swiggy.svg`);
    if (!localCandidates.includes(`/logos/swiggy.png`)) localCandidates.push(`/logos/swiggy.png`);
  }

  // Ensure local logos use a small cache-bust param to avoid stale 404s from old builds
  const candidates = localCandidates.map((c) => (c.startsWith("/logos/") ? `${c}?v=1` : c));
  if (remoteLogo) candidates.push(remoteLogo);
  candidates.push("/placeholder.svg");

  const [candidateIndex, setCandidateIndex] = React.useState(0);
  const logoSrc = candidates[candidateIndex];

  // Debugging aid: logs which logo candidate is currently used (visible in browser console)
  React.useEffect(() => {
    // only log in development to avoid noise in production
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("JobCard logo debug:", { company, companySlug, candidates, candidateIndex, logoSrc });
    }
  }, [company, companySlug, candidates, candidateIndex, logoSrc]);

  return (
    <div className="job-card relative w-[316px] h-[360px] rounded-[12px] bg-[#FFFFFF] shadow-[0_0_14px_rgba(211,211,211,0.15)]">
      <div className="absolute right-4 top-4 rounded-[10px] bg-[#AFD8FF] text-black text-[14px] font-medium px-2.5 py-1.5">24h Ago</div>

      <div className="absolute left-4 top-4 h-[82px] w-[82px] rounded-[14px] bg-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
        <div className="h-[66px] w-[66px] rounded-full bg-black ring-4 ring-white overflow-hidden">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={job.company}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => {
                // Log failing src in dev to help diagnose missing logos (e.g. Tesla)
                if (process.env.NODE_ENV !== "production") {
                  // eslint-disable-next-line no-console
                  console.debug("JobCard: image failed to load:", logoSrc);
                }
                setCandidateIndex((i) => Math.min(i + 1, candidates.length - 1));
              }}
            />
          ) : (
            <div className="h-full w-full rounded-full bg-gray-200" />
          )}
        </div>
      </div>

      <h3 className="absolute left-4 top-[116px] text-[20px] font-bold text-black pr-4">{job.title}</h3>

      <div className="absolute left-4 top-[160px] flex items-center gap-4 text-[14px] text-[#5A5A5A]">
        <div className="flex items-center gap-2">
          <img src="/logos/experience.svg" alt="experience" className="h-4 w-4" />
          <span>1–3 yr Exp</span>
        </div>

        <div className="flex items-center gap-2">
          <img src="/logos/Onsite.svg" alt="onsite" className="h-4 w-4" />
          <span>Onsite</span>
        </div>

        <div className="flex items-center gap-2">
          <img src="/logos/sallaryy.svg" alt="salary" className="h-4 w-4" />
          <span>
            {job.salaryMin != null && job.salaryMax != null ? `${(job.salaryMin / 100000).toFixed(0)}LPA` : "12LPA"}
          </span>
        </div>
      </div>

      <div
        className="absolute left-4 top-[201px] right-4 bottom-20 max-w-[300px] overflow-auto pr-1 text-[#555555]"
        style={{ fontFamily: '"Satoshi Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial', fontStyle: "normal" }}
      >
        <ul className="list-disc list-inside space-y-2 text-[14px] font-medium leading-normal">
          <li>
            {job.description || "A user-friendly interface lets you browse stunning photos and videos. Filter destinations based on interests and travel style, and create personalized."}
          </li>
          {job.requirements ? <li>{job.requirements}</li> : null}
        </ul>
      </div>

      <a
        href="#apply"
        className="absolute left-4 bottom-4 inline-flex h-12 w-[284px] items-center justify-center rounded-[10px] bg-[#00AAFF] text-white text-[16px] font-bold shadow-[0_0_14px_rgba(92,92,92,0.15)]"
      >
        Apply Now
      </a>
    </div>
  );
}
