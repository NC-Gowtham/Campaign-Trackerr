# Campaign Tracker (Simple)
**Stack**: React (frontend) + Node.js + Express (backend) + MongoDB Atlas

## What this project does
- Secure user signup and login (JWT & bcrypt).
- Add, list, update status (Active / Paused / Completed), delete campaigns.
- Each user only sees their own campaigns.
- Search/filter campaigns by name or client.
- A dashboard summary of campaign statuses.

## Run locally (requirements)
- Node.js (v14+)
- npm
- A MongoDB Atlas account (free tier)

### Backend
1.  Navigate to the `backend` folder: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file (or just edit `server.js`) and add your MongoDB Atlas connection string to the `MONGO_URI` variable.
4.  Start the server: `npm start`

Backend will run on http://localhost:5000

### Frontend
1.  Navigate to the `frontend` folder: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the app: `npm start`

Frontend runs on http://localhost:3000 and is proxy-configured to talk to the backend.

## API Endpoints
- `POST /api/signup` – body `{username, password}`
- `POST /api/login` – body `{username, password}`
- `GET /api/campaigns` – (Protected) list all campaigns for the logged-in user.
- `POST /api/campaigns` – (Protected) add campaign `{name, client, startDate, status}`.
- `PUT /api/campaigns/:id` – (Protected) update campaign status.
- `DELETE /api/campaigns/:id` – (Protected) delete a campaign.

## Short thought process (2–3 lines)
Built a minimal, easy-to-run system that demonstrates a full MERN stack, REST APIs, and a clean React UI. Focused on security (hashing, JWT, protected routes) and proper database integration with MongoDB Atlas to meet the task requirements.
