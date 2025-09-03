import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Job, JobFilters } from "@shared/api";
import { FilterBar } from "@/components/jobs/FilterBar";
import { JobCard } from "@/components/jobs/JobCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateJobForm from "@/components/jobs/CreateJobForm";

export default function JobsPage({ createOpen = false }: { createOpen?: boolean }) {
  const [filters, setFilters] = useState({ salary: [50, 80], salaryActive: false } as JobFilters & { salary: [number, number]; salaryActive: boolean });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(createOpen);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setOpen(createOpen);
  }, [createOpen]);

  

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.title) p.set("title", filters.title);
    if (filters.location) p.set("location", filters.location);
    if (filters.jobType) p.set("jobType", filters.jobType);
    if (filters.salary && filters.salaryActive) {
      p.set("minSalary", String(filters.salary[0] * 1000));
      p.set("maxSalary", String(filters.salary[1] * 1000));
    }
    return p.toString();
  }, [filters]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const url = `/api/jobs${params ? `?${params}` : ""}`;
      let data: Job[] = [];
      try {
        const res = await fetch(url, { method: "GET", credentials: "same-origin", headers: { Accept: "application/json" } });
        if (res.ok) data = (await res.json()) as Job[];
        if (data.length === 0 && !params) {
          await fetch("/api/seed", { method: "POST", credentials: "same-origin" });
          const res2 = await fetch(url, { method: "GET", credentials: "same-origin", headers: { Accept: "application/json" } });
          if (res2.ok) data = (await res2.json()) as Job[];
        }
      } catch (e) {
        // swallow preview wrapper fetch noise and fallback silently
      }
      setJobs(data);
      setLoading(false);
    };
    run();
  }, [params, refreshKey]);

  return (
    <Layout
      fullWidthSlot={
        <FilterBar
          value={{
            title: filters.title,
            location: filters.location,
            jobType: filters.jobType as any,
            salary: filters.salary,
            salaryActive: (filters as any).salaryActive,
          } as any}
          onChange={(f: any) => setFilters({ ...filters, ...f })}
        />
      }
    >
      <div className="space-y-6">
        {loading && <div className="text-center text-gray-500">Loading jobs…</div>}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {jobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="text-center text-gray-600">No jobs yet. Create one to get started.</div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[848px] max-w-[95vw] flex-shrink-0 rounded-[16px] bg-[#FFFFFF] shadow-[0_0_24px_0_rgba(169,169,169,0.25)]">
          <div className="px-6 pt-6">
            <h2 style={{ textAlign: "center", color: "#222", fontFamily: '"Satoshi Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial', fontSize: 24, fontStyle: "normal", fontWeight: 700, lineHeight: "normal" }}>
              Create Job Opening
            </h2>
          </div>
          <CreateJobForm onSuccess={() => { setOpen(false); setRefreshKey((k) => k + 1); }} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
