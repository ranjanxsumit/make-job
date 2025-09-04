import Layout from "@/components/layout/Layout";
import { useForm, Controller } from "react-hook-form";
import { JobInput, JobType } from "@shared/api";
import { useNavigate } from "react-router-dom";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function CreateJobPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<JobInput>();

  const onSubmit = async (data: JobInput) => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        salaryMin: Number(data.salaryMin),
        salaryMax: Number(data.salaryMax),
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      alert("Failed to create job: " + JSON.stringify(err));
      return;
    }
    navigate("/");
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Create Job</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              <Controller
                control={control}
                name="location"
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Preferred Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && <span className="text-xs text-red-600">Required</span>}
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Job Type</span>
              <Controller
                control={control}
                name="jobType"
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {(["Full-time", "Part-time", "Contract", "Internship"] as JobType[]).map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.jobType && <span className="text-xs text-red-600">Required</span>}
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Salary Min (₹)</span>
              <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("salaryMin", { required: true, valueAsNumber: true })} />
              {errors.salaryMin && <span className="text-xs text-red-600">Required</span>}
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Salary Max (₹)</span>
              <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("salaryMax", { required: true, valueAsNumber: true })} />
              {errors.salaryMax && <span className="text-xs text-red-600">Required</span>}
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-sm font-medium">Job Description</span>
            <textarea rows={4} className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("description", { required: true })} />
            {errors.description && <span className="text-xs text-red-600">Required</span>}
          </label>

          <label className="space-y-1 block">
            <span className="text-sm font-medium">Requirements</span>
            <textarea rows={3} className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("requirements", { required: true })} />
            {errors.requirements && <span className="text-xs text-red-600">Required</span>}
          </label>

          <label className="space-y-1 block">
            <span className="text-sm font-medium">Responsibilities</span>
            <textarea rows={3} className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("responsibilities", { required: true })} />
            {errors.responsibilities && <span className="text-xs text-red-600">Required</span>}
          </label>

          <label className="space-y-1 block max-w-xs">
            <span className="text-sm font-medium">Application Deadline</span>
            <input type="date" className="w-full rounded-md border border-gray-200 px-3 py-2" {...register("deadline", { required: true })} />
            {errors.deadline && <span className="text-xs text-red-600">Required</span>}
          </label>

          <button
            disabled={isSubmitting}
            className="rounded-md bg-primary text-primary-foreground px-5 py-2 font-semibold disabled:opacity-50"
            type="submit"
          >
            {isSubmitting ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
