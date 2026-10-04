# Full Stack Open Phonebook

This repository contains my full-stack phonebook application for exercise 21, **“Your own pipeline,”** in the CI/CD section of the University of Helsinki’s [Full Stack Open](https://fullstackopen.com/en/) course.

The exercise is to build a CI/CD pipeline for an application. This repository brings the phonebook frontend and backend together: the backend is at the repository root, and the React frontend is in `frontend/`.

This is the companion application repository for the exercise; link to it from the repository submitted to the course submission system.

## Application

- **Frontend:** React and Vite
- **Backend:** Node.js and Express
- **Database:** MongoDB with Mongoose

The API supports creating, listing, updating, and deleting phonebook entries. The frontend uses the API to manage contacts.

The live application is available at [Phonebook](https://fso-phonebook-ci-cd.onrender.com/).

## Repository layout

```text
.
├── frontend/         # React application and Vite configuration
├── models/           # Mongoose models
├── requests/         # Example API requests
├── index.js          # Express server and API routes
├── mongo.js          # MongoDB command-line utility
└── package.json      # Backend scripts and dependencies
```

## Run locally

You need Node.js and access to a MongoDB database.

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

## CI/CD exercise

The goal of this repository is to use the phonebook app to build and document a CI/CD pipeline: automated checks should run when changes are submitted, and successful changes can proceed through deployment.

The available local checks are:

```bash
# From the repository root
npm run lint

# From frontend/
npm run lint
npm run build
```

There is currently no workflow configuration in this repository, so automated CI/CD should not be assumed to be active. Add and maintain the pipeline configuration alongside the code, and update this section to describe its triggers, checks, and deployment process once configured.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/persons` | List phonebook entries |
| `GET` | `/api/persons/:id` | Get one entry |
| `POST` | `/api/persons` | Create an entry |
| `PUT` | `/api/persons/:id` | Update an entry |
| `DELETE` | `/api/persons/:id` | Delete an entry |
| `GET` | `/info` | Show the entry count and current time |

Create and update requests use JSON with a `name` and `number`, for example:

```json
{
  "name": "Ada Lovelace",
  "number": "12-123456"
}
```

Names are required and must be at least three characters. Phone numbers are required and must contain a two- or three-digit prefix, a hyphen, and digits; the complete number must be at least eight characters long.
