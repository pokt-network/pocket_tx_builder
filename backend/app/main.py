from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import subprocess
import os
import json
from dotenv import load_dotenv
import httpx
from jose import jwt

# Load environment variables
load_dotenv()

app = FastAPI(title="Pocket SDK API")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Environment secrets
NETWORK_SECRETS = {
    "alpha": os.getenv("ALPHA_SECRET", "alpha_default_secret"),
    "beta": os.getenv("BETA_SECRET", "beta_default_secret"),
    "mainnet": os.getenv("MAINNET_SECRET", "mainnet_default_secret"),
}

# Supabase public key for JWT verification
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

# Models
class CommandRequest(BaseModel):
    command: List[str]
    network: str = "alpha"

class CommandResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int

# Auth middleware
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        # In a production environment, you would validate the JWT with Supabase's public key
        # For demo purposes, we'll just check if the token exists
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # In a real implementation, you would verify the token with Supabase
        # payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
        # return payload
        
        # For demo, we'll just return a mock user
        return {"sub": "demo-user", "email": "user@example.com"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to Pocket SDK API"}

@app.post("/run", response_model=CommandResponse)
async def run_command(request: CommandRequest, user: Dict = Depends(verify_token)):
    # Get the secret for the specified network
    network_secret = NETWORK_SECRETS.get(request.network)
    if not network_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid network: {request.network}"
        )
    
    # Prepare the command with the pocketd binary
    cmd = ["pocketd"] + request.command
    
    try:
        # Run the command
        process = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            env={**os.environ, "NETWORK_SECRET": network_secret}
        )
        
        return {
            "stdout": process.stdout,
            "stderr": process.stderr,
            "exit_code": process.returncode
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing command: {str(e)}"
        )

# For demo/testing purposes
@app.post("/run-mock", response_model=CommandResponse)
async def run_mock_command(request: CommandRequest):
    """Mock endpoint for testing without authentication"""
    # Simulate different responses based on the command
    command_str = " ".join(request.command)
    
    if "query account" in command_str:
        stdout = json.dumps({
            "address": "pocket1abcdef123456789",
            "balance": "1000000",
            "nonce": 5
        }, indent=2)
        stderr = ""
        exit_code = 0
    elif "query validator" in command_str:
        stdout = json.dumps({
            "address": "pocket1validator123456789",
            "status": "staked",
            "stake_amount": "15000000",
            "service_url": "https://validator.example.com"
        }, indent=2)
        stderr = ""
        exit_code = 0
    elif "query supplier" in command_str:
        stdout = json.dumps({
            "address": "pocket1supplier123456789",
            "status": "staked",
            "stake_amount": "10000000",
            "service_urls": ["https://supplier1.example.com", "https://supplier2.example.com"]
        }, indent=2)
        stderr = ""
        exit_code = 0
    else:
        stdout = "Command executed successfully"
        stderr = ""
        exit_code = 0
    
    return {
        "stdout": stdout,
        "stderr": stderr,
        "exit_code": exit_code
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
