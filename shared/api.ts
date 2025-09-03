/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string;
  responsibilities: string;
  deadline: string;
  createdAt: string;
}

export interface JobInput {
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string;
  responsibilities: string;
  deadline: string;
}

export interface JobFilters {
  title?: string;
  location?: string;
  jobType?: JobType;
  minSalary?: number;
  maxSalary?: number;
}
