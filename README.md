# EnggXR

EnggXR is a decision-support web app for engineering applicants and their families. The current MVP includes onboarding, personalized recommendations, college details, comparison, Student DNA, parent insights, ROI planning, scholarships, and persistent shortlists.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` if you want to customize ports or storage.
3. Start the web app and API together with `npm run dev`.
4. Open `http://127.0.0.1:4399`.

The API runs at `http://127.0.0.1:4400` and stores local development data in `data/enggxr.db`.

## Quality checks

- `npm run lint`
- `npm run build`

## Current data scope

College facts, scores, rankings, fees, outcomes, scholarships, and recommendation results are demonstration data. They must be replaced with sourced, regularly updated production data before public launch or real education decisions.

## API routes

- `GET /api/health`
- `GET /api/colleges`
- `GET /api/students/:id`
- `PUT /api/students/:id`
- `GET /api/recommendations/:studentId`
- `GET /api/shortlists/:studentId`
- `PUT /api/shortlists/:studentId/:collegeId`
- `DELETE /api/shortlists/:studentId/:collegeId`
