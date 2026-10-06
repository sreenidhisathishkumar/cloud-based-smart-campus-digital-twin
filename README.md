# Northridge Twin — Smart Campus Digital Twin

Cloud-Based Digital Twin for Smart Campus Monitoring using Agile CI/CD.

Built sprint by sprint. The UI is fully usable **locally**. AWS is **not deployed**.

## What works now (Sprints 1–6, local)

1. Campus visualization and building details
2. Facility inventory, filters, and local status updates
3. Issue reporting (with local image preview), tracking, timeline, events
4. Admin dashboard (demo login), assign/update status, analytics
5. Cloud status page, SAM placeholder, CloudWatch/SNS stubs (not live)
6. Vitest suite, production build, `buildspec.yml`, GitHub Actions CI

## Run

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173

## Test / build

```bash
npm test
npm run build
```

## Admin demo (local only)

- Open **Admin dashboard**
- Email: `admin@northridge.edu`
- PIN: `campus-admin`

This is not Cognito and not production security.

## AWS

Fill `.env.example` into `.env.local` only when you have real values. `infra/template.yaml` is a SAM **placeholder**. `buildspec.yml` will test and build in CodeBuild once you create a pipeline; that pipeline is **not** created by this repo.
