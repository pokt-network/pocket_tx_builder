# Pocket SDK UI

A web-based UI for interacting with Cosmos SDK applications, specifically designed for Pocket Network.

## Tech Stack

- **Frontend**: SolidJS + TailwindCSS
- **Backend**: FastAPI (Python 3.11+)
- **Auth**: Supabase with Google OAuth
- **Binary**: Backend runs a local binary called `pocketd` via subprocess

## Project Structure

```
pocket_tx_builder/
├── frontend/           # SolidJS frontend
├── backend/            # FastAPI backend
│   └── app/            # Python application code
└── docker-compose.yml  # Docker setup for local development
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- Python 3.11+
- Docker and Docker Compose (optional)
- `pocketd` binary available in your PATH

### Environment Setup

1. Clone the repository
2. Set up backend environment:
   ```bash
   cd backend
   cp .env.example .env  # Edit with your actual secrets
   pip install -r requirements.txt
   ```
3. Set up frontend environment:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

#### Without Docker

1. Start the backend:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at http://localhost:5173

#### With Docker

```bash
docker-compose up
```

Then access the application at http://localhost:5173

## Features

- **Account Management**: Query and manage Pocket Network accounts
- **Service Management**: Configure and query services
- **Full Node Management**: Set up and manage full nodes
- **Validator Management**: Stake and manage validators
- **Supplier & RelayMiner Management**: Configure suppliers and relay miners
- **Network Switching**: Switch between Alpha, Beta, and MainNet environments

## Authentication

The application uses Supabase for authentication with Google OAuth. For local development, you can use the "Skip login for demo" option.

## API Endpoints

- `POST /run`: Execute pocketd commands
  - Request body: `{ "command": ["query", "account", "..."], "network": "alpha" }`
  - Returns: `{ "stdout": "...", "stderr": "...", "exit_code": 0 }`

- `POST /run-mock`: Test endpoint that doesn't require authentication (for development)

## Environment Variables

### Backend (.env file)

- `ALPHA_SECRET`: Secret for Alpha network
- `BETA_SECRET`: Secret for Beta network
- `MAINNET_SECRET`: Secret for MainNet
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon key
- `SUPABASE_JWT_SECRET`: Your Supabase JWT secret

### Frontend (.env file)

- `VITE_API_URL`: URL of the backend API
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_KEY`: Your Supabase anon key
