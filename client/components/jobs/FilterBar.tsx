import { useMemo } from "react";
import { Slider } from "@/components/ui/slider";

export interface Filters {
  title?: string;
  location?: string;
  jobType?: "Full-time" | "Part-time" | "Contract" | "Internship";
  salary: [number, number];
  salaryActive?: boolean;
}

export function FilterBar({ value, onChange }: { value: Filters; onChange: (f: Partial<Filters>) => void }) {
  const [min, max] = value.salary;
  const display = useMemo(() => `₹${min}k - ₹${max}k`, [min, max]);

  return (
    <div className="p-4 md:p-5 flex flex-col gap-4 md:flex-row md:items-center md:gap-6 w-full">
      <div className="flex items-center gap-3 flex-1">
        <svg viewBox="0 0 20 20" className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 13L19 19M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14Z" />
        </svg>
        <input
          placeholder="Search by Job Title, Role"
          className="w-full outline-none placeholder:text-gray-500"
          value={value.title ?? ""}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <div className="h-px bg-gray-100 md:h-10 md:w-px" />
      <div className="flex items-center gap-3 flex-1">
        <img src="/logos/Location.svg" alt="Location" className="h-5 w-5" />
        <select
          className="w-full outline-none text-gray-700 rounded-xl"
          value={value.location ?? ""}
          onChange={(e) => onChange({ ...value, location: e.target.value })}
        >
          <option value="">Preferred Location</option>
          <option>Bangalore</option>
          <option>Chennai</option>
          <option>Hyderabad</option>
          <option>Delhi</option>
          <option>Mumbai</option>
        </select>
      </div>
      <div className="h-px bg-gray-100 md:h-10 md:w-px" />
      <div className="flex items-center gap-3 flex-1">
        <img src="/logos/job-type.svg" alt="Job type" className="h-5 w-5" />
        <select
          className="w-full outline-none text-gray-700 rounded-xl"
          value={value.jobType ?? ""}
          onChange={(e) => onChange({ ...value, jobType: e.target.value as Filters["jobType"] })}
        >
          <option value="">Job type</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
      </div>
      <div className="h-px bg-gray-100 md:h-10 md:w-px" />
  <div className="flex flex-col gap-2 md:gap-4 w-full md:w-auto md:ml-auto">
        <div className="flex items-baseline justify-between w-full md:w-64">
          <div
            style={{
              color: "#222222",
              fontFamily: "\"Satoshi Variable\"",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
          >
            Salary Per Month
          </div>
          <div className="shrink-0 text-right"
            style={{
              color: "#222222",
              fontFamily: "\"Satoshi Variable\"",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
          >
            {display}
          </div>
        </div>

        <div className="w-full md:w-64">
          <Slider
            value={[min, max]}
            min={10}
            max={200}
            step={5}
            thumbLeft="/logos/Ellipse%201.svg"
            thumbRight="/logos/Ellipse%202.svg"
            onValueChange={(v) => onChange({ ...value, salary: [v[0], v[1]], salaryActive: true })}
          />
        </div>
      </div>
    </div>
  );
}
