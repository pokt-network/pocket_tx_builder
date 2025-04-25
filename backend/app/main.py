from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import subprocess
import os
import json
import string
import random
from dotenv import load_dotenv
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

# Pocket configuration
POCKET_HOME = os.getenv("POCKET_HOME", ".pocket")
POCKET_CHAIN = {
    "alpha": os.getenv("POCKET_CHAIN_ALPHA", "pocket-alpha"),
    "beta": os.getenv("POCKET_CHAIN_BETA", "pocket-beta"),
    "mainnet": os.getenv("POCKET_CHAIN_MAINNET", "pocket"),
}
POCKET_NODE_URL = {
    "alpha": os.getenv("POCKET_ALPHA_NODE_URL", "https://shannon-testnet-grove-rpc.alpha.poktroll.com"),
    "beta": os.getenv("POCKET_BETA_NODE_URL", "https://shannon-testnet-grove-rpc.beta.poktroll.com"),
    "mainnet": os.getenv("POCKET_MAINNET_NODE_URL", "https://shannon-grove-rpc.mainnet.poktroll.com"),
}
POCKET_KEYRING_BACKEND = os.getenv("POCKET_TEST_KEYRING_BACKEND", "test")

# Pocket binary path
POCKET_BIN_PATH = "/usr/local/bin/pocketd"

# Supabase public key for JWT verification
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

# Default funding amount
DEFAULT_FUNDING_AMOUNT = "1000000upokt"  # 1 POKT

# Models
class CommandRequest(BaseModel):
    command: List[str]
    network: str = "alpha"

class CommandResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
    txhash: Optional[str] = None

class CreateAccountRequest(BaseModel):
    network: str = "alpha"
    key_name: Optional[str] = None

class AccountResponse(BaseModel):
    address: str
    name: str
    mnemonic: str
    message: str

class FundAccountRequest(BaseModel):
    address: str
    amount: str = DEFAULT_FUNDING_AMOUNT
    network: str = "alpha"
    from_account: str = "faucet"  # Default to faucet account

class ServiceRequest(BaseModel):
    service_id: str
    service_name: str
    compute_units: int = 10
    from_account: str
    network: str = "alpha"

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

import logging
import platform
import stat

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper function to run pocket commands
def run_pocket_command(command: List[str], network: str = "alpha", requires_confirmation: bool = False):
    chain_id = POCKET_CHAIN.get(network, POCKET_CHAIN["alpha"])
    node_url = POCKET_NODE_URL.get(network, POCKET_NODE_URL["alpha"])
    network_secret = NETWORK_SECRETS.get(network, NETWORK_SECRETS["alpha"])
    
    # Log binary path and check if it exists
    logger.info(f"Using pocketd binary at: {POCKET_BIN_PATH}")
    if not os.path.exists(POCKET_BIN_PATH):
        logger.error(f"pocketd binary not found at {POCKET_BIN_PATH}")
        return {
            "stdout": "",
            "stderr": f"pocketd binary not found at {POCKET_BIN_PATH}",
            "exit_code": 1,
            "txhash": None
        }
    
    # Log file permissions and details
    file_stat = os.stat(POCKET_BIN_PATH)
    is_executable = bool(file_stat.st_mode & stat.S_IXUSR)
    logger.info(f"File permissions: {oct(file_stat.st_mode)}, Executable: {is_executable}")
    logger.info(f"System architecture: {platform.machine()}, OS: {platform.system()}")
    
    cmd = [POCKET_BIN_PATH] + command
    
    if "--node" not in command and "query" in command:
        cmd.extend(["--node", node_url])
    
    if "--chain-id" not in command and "tx" in command:
        cmd.extend(["--chain-id", chain_id])
    
    if "--keyring-backend" not in command and ("keys" in command or "tx" in command):
        cmd.extend(["--keyring-backend", POCKET_KEYRING_BACKEND])
    
    if "--home" not in command and ("keys" in command or "tx" in command):
        cmd.extend(["--home", POCKET_HOME])
    
    if "--output" not in command:
        cmd.extend(["--output", "json"])
    
    try:
        env = os.environ.copy()
        if network_secret:
            env["NETWORK_SECRET"] = network_secret
        
        # Log the command being executed
        logger.info(f"Executing command: {' '.join(cmd)}")
        
        if requires_confirmation:
            # Pipe 'yes\n' to stdin to confirm prompts
            result = subprocess.run(cmd, capture_output=True, text=True, env=env, input='yes\n')
        else:
            result = subprocess.run(cmd, capture_output=True, text=True, env=env)
        logger.info(f"Command exit code: {result.returncode}")
        
        # Try to parse the output as JSON if possible
        stdout = result.stdout
        txhash = None
        try:
            if stdout and stdout.strip():
                json_data = json.loads(stdout)
                stdout = json.dumps(json_data, indent=2)
                txhash = json_data.get("txhash")
        except json.JSONDecodeError:
            # If not valid JSON, use the raw output
            pass
        
        return {
            "stdout": stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode,
            "txhash": txhash
        }
    except Exception as e:
        logger.error(f"Error executing command: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return {
            "stdout": "",
            "stderr": str(e),
            "exit_code": 1,
            "txhash": None
        }

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to Pocket SDK API"}

@app.post("/run", response_model=CommandResponse)
async def run_command(request: CommandRequest, user: Dict = Depends(verify_token)):
    """Execute a raw pocket command"""
    result = run_pocket_command(request.command, request.network)
    return result

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
            "service_url": "https://supplier.example.com"
        }, indent=2)
        stderr = ""
        exit_code = 0
    else:
        stdout = json.dumps({
            "txhash": "ABCDEF1234567890",
            "code": 0,
            "log": "success"
        }, indent=2)
        stderr = ""
        exit_code = 0
    
    return {
        "stdout": stdout,
        "stderr": stderr,
        "exit_code": exit_code,
        "txhash": json.loads(stdout).get("txhash") if "txhash" in stdout else None
    }

@app.post("/account/create-mock", response_model=AccountResponse)
async def create_account_mock(request: CreateAccountRequest):
    """Create a new account (wallet) in the Pocket network without authentication"""
    # Generate a random key name if not provided
    key_name = request.key_name
    if not key_name:
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        key_name = f"user_{random_suffix}"
    
    # Run the command to create a new account
    cmd = ["keys", "add", key_name, "--output", "json"]
    result = run_pocket_command(cmd, request.network)
    
    if result["exit_code"] != 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create account: {result['stderr']}"
        )
    
    try:
        account_data = json.loads(result["stdout"])
        return {
            "address": account_data.get("address", ""),
            "name": key_name,
            "mnemonic": account_data.get("mnemonic", ""),
            "message": "Account created successfully"
        }
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse account data: {result['stdout']}"
        )

# Export private key in hex for a given account name (unsafe, unarmored-hex)
from fastapi.responses import JSONResponse

@app.get("/account/export-hex/{name}")
async def export_account_hex(name: str, network: str = "alpha"):
    """
    Export the private key for a given account name as an unarmored hex string.
    WARNING: This is unsafe and for demo/dev only!
    """
    cmd = [
        "keys", "export", name,
        "--unsafe", "--unarmored-hex",
        f"--home={POCKET_HOME}"
    ]
    result = run_pocket_command(cmd, network, requires_confirmation=True)
    if result["exit_code"] != 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export private key: {result['stderr']}"
        )
    # The stdout should be the hex string (with or without newline)
    hex_key = result["stdout"].strip().replace('\n', '')
    return JSONResponse(content={"hex": hex_key})

@app.post("/account/create", response_model=AccountResponse)
async def create_account(request: CreateAccountRequest, user: Dict = Depends(verify_token)):
    """Create a new account (wallet) in the Pocket network"""
    # Generate a random key name if not provided
    key_name = request.key_name
    if not key_name:
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        key_name = f"user_{random_suffix}"
    
    # Run the command to create a new account
    cmd = ["keys", "add", key_name, "--output", "json"]
    result = run_pocket_command(cmd, request.network)
    
    if result["exit_code"] != 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create account: {result['stderr']}"
        )
    
    try:
        account_data = json.loads(result["stdout"])
        return {
            "address": account_data.get("address", ""),
            "name": key_name,
            "mnemonic": account_data.get("mnemonic", ""),
            "message": "Account created successfully"
        }
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse account data: {result['stdout']}"
        )

@app.post("/account/fund", response_model=CommandResponse)
async def fund_account(request: FundAccountRequest, user: Dict = Depends(verify_token)):
    """Fund an account with tokens"""
    # Run the command to send tokens to the address
    cmd = [
        "tx", "bank", "send", 
        request.from_account, 
        request.address, 
        request.amount, 
        "--yes"
    ]
    
    result = run_pocket_command(cmd, request.network)
    
    if result["exit_code"] != 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fund account: {result['stderr']}"
        )
    
    return result

@app.post("/service/create", response_model=CommandResponse)
async def create_service(request: ServiceRequest, user: Dict = Depends(verify_token)):
    """Create a new service on the Pocket network"""
    # Run the command to create a new service
    cmd = [
        "tx", "service", "add-service",
        request.service_id,
        request.service_name,
        str(request.compute_units),
        "--from", request.from_account,
        "--yes"
    ]
    
    result = run_pocket_command(cmd, request.network)
    
    if result["exit_code"] != 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create service: {result['stderr']}"
        )
    
    return result

@app.get("/account/{address}", response_model=CommandResponse)
async def get_account(address: str, network: str = "alpha", user: Dict = Depends(verify_token)):
    """Get account information"""
    cmd = ["query", "account", address]
    return run_pocket_command(cmd, network)

@app.get("/service/{service_id}", response_model=CommandResponse)
async def get_service(service_id: str, network: str = "alpha", user: Dict = Depends(verify_token)):
    """Get service information"""
    cmd = ["query", "service", "show-service", service_id]
    return run_pocket_command(cmd, network)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
