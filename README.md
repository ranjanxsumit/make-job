A full-stack application that allows an admin to create and manage job postings.
<img width="1440" height="1024" alt="make-job" src="https://github.com/user-attachments/assets/47bc53ab-2ae6-40ac-aeed-4fe562725029" />

<img width="1440" height="1024" alt="makejob" src="https://github.com/user-attachments/assets/8b84511e-6aeb-4095-a120-439b403d3928" />

## Tech Stack

- **PNPM**: Prefer pnpm
- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces
```

## Key Features
The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory
- 
### Express Server Integration

- **Development**: Single port (8080) for both frontend/backend
- **Hot reload**: Both client and server code
- **API endpoints**: Prefixed with `/api/`

## Development Commands

```bash
pnpm dev        # Start dev server (client + server)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
pnpm test          # Run Vitest tests

pnpm install --frozen-lockfile; pnpm run build  # Build command for render
pnpm run start                                  # Start Command

``` 
 Pages:

 2.  - Job List Page:
     - Display a list of job postings.
     - Filters: Job Title, Location, Job Type, Salary Range.
     - Job Creation Page:
     - Form to create a new job posting.
     - Use React Hook Form for form handling and validation.

2. Job Fields:
   - Job Title (Text Input)
   - Company Name (Text Input)
   - Location (Text Input)
   - Job Type (Dropdown: Full-time, Part-time, Contract, Internship)
   - Salary Range (Text Input)
   - Job Description (Textarea)
   - Requirements (Textarea)
   - Responsibilities (Textarea)
   - Application Deadline (Date Picker)

3. UI Components for Filters:
   - Job Title (Text Input)
   - Location (Text Input)
   - Job Type (Dropdown: Full-time, Part-time, Contract, Internship)
   - Salary Range (Range Slider)
