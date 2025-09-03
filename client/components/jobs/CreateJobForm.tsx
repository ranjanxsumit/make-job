import { useForm } from "react-hook-form";
import { JobInput, JobType } from "@shared/api";

export default function CreateJobForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<JobInput>();

  const onSubmit = async (data: JobInput) => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        salaryMin: Number(data.salaryMin || 0),
        salaryMax: Number(data.salaryMax || 0),
      }),
    });
    if (res.ok) onSuccess();
    else alert("Failed to create job");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-1">
          <span className="text-sm font-medium">Job Title</span>
          <input className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("title", { required: true })} />
          {errors.title && <span className="text-xs text-red-600">Required</span>}
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Company Name</span>
          <input className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("company", { required: true })} />
          {errors.company && <span className="text-xs text-red-600">Required</span>}
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Location</span>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("location", { required: true })}>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
          </select>
          {errors.location && <span className="text-xs text-red-600">Required</span>}
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Job Type</span>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("jobType", { required: true })}>
            {(["Full-time", "Part-time", "Contract", "Internship"] as JobType[]).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.jobType && <span className="text-xs text-red-600">Required</span>}
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Salary Min (₹)</span>
          <input
            type="number"
            step={1}
            min={0}
            className="w-full rounded-md border border-gray-200 px-3 py-2"
            {...register("salaryMin", {
              valueAsNumber: true,
              required: "Salary min is required",
              min: { value: 0, message: "Salary must be ≥ 0" },
            })}
          />
          {errors.salaryMin && <span className="text-xs text-red-600">{(errors.salaryMin as any).message}</span>}
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Salary Max (₹)</span>
          <input
            type="number"
            step={1}
            min={0}
            className="w-full rounded-md border border-gray-200 px-3 py-2"
            {...register("salaryMax", {
              valueAsNumber: true,
              required: "Salary max is required",
              min: { value: 0, message: "Salary must be ≥ 0" },
              validate: (v) => {
                const minVal = getValues("salaryMin") as number | undefined;
                if (typeof minVal === "number" && !isNaN(minVal)) {
                  return v >= minVal || "Salary max must be >= salary min";
                }
                return true;
              },
            })}
          />
          {errors.salaryMax && <span className="text-xs text-red-600">{(errors.salaryMax as any).message}</span>}
        </label>
      </div>

      <label className="space-y-1 block">
        <span className="text-sm font-medium">Job Description</span>
        <textarea rows={4} className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("description", { required: true })} />
      </label>

      <label className="space-y-1 block">
        <span className="text-sm font-medium">Requirements</span>
        <textarea rows={3} className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("requirements", { required: true })} />
      </label>

      <label className="space-y-1 block">
        <span className="text-sm font-medium">Responsibilities</span>
        <textarea rows={3} className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("responsibilities", { required: true })} />
      </label>

      <label className="space-y-1 block max-w-xs">
        <span className="text-sm font-medium">Application Deadline</span>
        <input type="date" className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("deadline", { required: true })} />
      </label>

      <div className="flex justify-between">
        <button type="button" className="rounded-md border px-4 py-2">Save Draft</button>
        <button disabled={isSubmitting} className="rounded-md bg-primary text-primary-foreground px-5 py-2 font-semibold disabled:opacity-50" type="submit">
          {isSubmitting ? "Publishing…" : "Publish »"}
        </button>
      </div>
        </form>
      </div>
  );
}
