"""
Command execution API endpoints.
"""

import json

from fastapi import APIRouter, Depends

from ..auth import verify_token
from ..models import CommandRequest, CommandResponse
from ..pocket import run_pocket_command

router = APIRouter(tags=["command"])


@router.post("/run", response_model=CommandResponse)
async def run_command(request: CommandRequest, user=Depends(verify_token)):
    """Execute a raw pocket command."""
    result = run_pocket_command(request.command, request.network)
    return result


@router.post("/run-mock", response_model=CommandResponse)
async def run_mock_command(request: CommandRequest):
    """Mock endpoint for testing without authentication."""
    command_str = " ".join(request.command)
    if "query account" in command_str:
        stdout = json.dumps(
            {"address": "pocket1abcdef123456789", "balance": "1000000", "nonce": 5},
            indent=2,
        )
        stderr = ""
        exit_code = 0
    elif "query validator" in command_str:
        stdout = json.dumps(
            {
                "address": "pocket1validator123456789",
                "status": "staked",
                "stake_amount": "15000000",
                "service_url": "https://validator.example.com",
            },
            indent=2,
        )
        stderr = ""
        exit_code = 0
    elif "query supplier" in command_str:
        stdout = json.dumps(
            {
                "address": "pocket1supplier123456789",
                "status": "staked",
                "stake_amount": "10000000",
                "service_url": "https://supplier.example.com",
            },
            indent=2,
        )
        stderr = ""
        exit_code = 0
    else:
        stdout = json.dumps(
            {"txhash": "ABCDEF1234567890", "code": 0, "log": "success"}, indent=2
        )
        stderr = ""
        exit_code = 0
    return {
        "stdout": stdout,
        "stderr": stderr,
        "exit_code": exit_code,
        "txhash": json.loads(stdout).get("txhash") if "txhash" in stdout else None,
    }
