# Full Stack Open Phonebook

This repository contains the full-stack phonebook application for exercise 21, **“Your own pipeline,”** in the CI/CD section [(part 11)](https://fullstackopen.com/en/part11) of the University of Helsinki’s [Full Stack Open](https://fullstackopen.com/en/) course.

The exercise involves building a CI/CD pipeline for an application. This repository brings the phonebook frontend and backend together: the backend is at the repository root, and the React frontend is in `frontend/`.

## Application

- **Frontend:** React and Vite
- **Backend:** Node.js and Express
- **Database:** MongoDB with Mongoose

The API supports creating, listing, updating, and deleting phonebook entries. The frontend uses the API to manage contacts.

The live application is available at [Phonebook](https://fso-phonebook-ci-cd.onrender.com/).

## Repository Layout

```text
.
├── .github/workflows/   # CI/CD pipeline and periodic health check
├── frontend/            # React application and Vite configuration
├── models/              # Mongoose models
├── requests/            # Example API requests
├── tests/               # Backend tests
├── app.js               # Express app and API routes
├── index.js             # Starts the server
├── mongo.js             # MongoDB command-line utility
└── package.json         # Backend scripts and dependencies
```

## Run Locally

You need Node.js 20 or newer (the pipeline uses Node 24) and access to a MongoDB database.

1. Install backend dependencies from the repository root:

   ```bash
   npm install
   ```

2. Create a `.env` file in the repository root:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
   PORT=3001
   ```

   Set `MONGODB_URI` to a connection string for a database you can access. Do not commit credentials or the `.env` file.

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Start the backend and frontend in separate terminals:

   ```bash
   # Repository root
   npm run dev
   ```

   ```bash
   # frontend/
   npm run dev
   ```

   The backend listens on port `3001` by default. Vite serves the frontend and proxies `/api` requests to `http://localhost:3001`.

## CI/CD Pipeline

The pipeline is defined in `.github/workflows/pipeline.yml`.

**On pull requests to `main`:** four checks run in parallel: backend lint, frontend lint, backend tests, and the frontend build. Nothing is deployed.

**On pushes to `main`** (merged pull requests): after the checks pass, the app is deployed to Render through a deploy hook, then a patch version tag is created.

- Adding `#skip` to a commit message skips the deploy and the tagging.
- `main` is protected by a ruleset that requires all four checks to pass before merging.
- Discord notifications report failed builds and successful deployments.
- A scheduled workflow (`.github/workflows/health_check.yml`) pings `/health` once a day.

The workflows use these repository secrets: `RENDER_DEPLOY_HOOK` and `DISCORD_WEBHOOK`. Render's auto-deploy is turned off, so only the pipeline can deploy.

Here are some local checks, from the repository root:

```bash
npm run lint        # backend lint
npm run lint:ui     # frontend lint
npm test            # backend tests (no database needed)
npm run build:ui    # frontend production build
```

To run the production setup locally, build the frontend and let the backend serve it:

```bash
npm run build:ui
npm start
```

The app is then served at `http://localhost:3001`.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/persons` | List phonebook entries |
| `GET` | `/api/persons/:id` | Get one entry |
| `POST` | `/api/persons` | Create an entry |
| `PUT` | `/api/persons/:id` | Update an entry |
| `DELETE` | `/api/persons/:id` | Delete an entry |
| `GET` | `/info` | Show the entry count and current time |
| `GET` | `/health` | Health check, returns `ok` |

Create and update requests use JSON with a `name` and `number`, for example:

```json
{
  "name": "Ada Lovelace",
  "number": "12-123456"
}
```

Names are required and must be at least three characters. Phone numbers are required and must contain a two- or three-digit prefix, a hyphen, and digits; the complete number must be at least eight characters long.
