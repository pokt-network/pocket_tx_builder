"""
Account-related API endpoints.
"""

import json

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from ..auth import verify_token
from ..config import POCKET_HOME
from ..models import (
    AccountResponse,
    CommandResponse,
    CreateAccountRequest,
    FundAccountRequest,
)
from ..pocket import import_hex_key, key_exists, run_pocket_command
from ..utils import generate_random_key_name

router = APIRouter(prefix="/account", tags=["account"])


@router.post("/import-hex", response_model=CommandResponse)
async def import_account_hex(
    name: str = Body(...), hex_key: str = Body(...), network: str = Body("alpha")
):
    """Import a private key from hex for an account."""
    success = import_hex_key(name, hex_key, network)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to import hex key")
    return {
        "stdout": f"Imported key {name}",
        "stderr": "",
        "exit_code": 0,
        "txhash": None,
    }


@router.post("/create-mock", response_model=AccountResponse)
async def create_account_mock(request: CreateAccountRequest):
    """Create a new account (wallet) in the Pocket network without authentication."""
    key_name = request.key_name or generate_random_key_name()
    cmd = ["keys", "add", key_name, "--output", "json"]
    result = run_pocket_command(cmd, request.network)
    if result["exit_code"] != 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create account: {result['stderr']}",
        )
    try:
        account_data = json.loads(result["stdout"])
        return {
            "address": account_data.get("address", ""),
            "name": key_name,
            "mnemonic": account_data.get("mnemonic", ""),
            "message": "Account created successfully",
        }
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse account data: {result['stdout']}",
        )


@router.get("/export-hex/{name}")
async def export_account_hex(name: str, network: str = "alpha"):
    """
    Export the private key for a given account name as an unarmored hex string.
    WARNING: This is unsafe and for demo/dev only!
    """
    cmd = [
        "keys",
        "export",
        name,
        "--unsafe",
        "--unarmored-hex",
        f"--home={POCKET_HOME}",
    ]
    result = run_pocket_command(cmd, network, requires_confirmation=True)
    if result["exit_code"] != 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export private key: {result['stderr']}",
        )
    hex_key = result["stdout"].strip().replace("\n", "")
    return JSONResponse(content={"hex": hex_key})


@router.post("/create", response_model=AccountResponse)
async def create_account(request: CreateAccountRequest, user=Depends(verify_token)):
    """Create a new account (wallet) in the Pocket network."""
    key_name = request.key_name or generate_random_key_name()
    cmd = ["keys", "add", key_name, "--output", "json"]
    result = run_pocket_command(cmd, request.network)
    if result["exit_code"] != 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create account: {result['stderr']}",
        )
    try:
        account_data = json.loads(result["stdout"])
        return {
            "address": account_data.get("address", ""),
            "name": key_name,
            "mnemonic": account_data.get("mnemonic", ""),
            "message": "Account created successfully",
        }
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse account data: {result['stdout']}",
        )


@router.post("/fund", response_model=CommandResponse)
async def fund_account(request: FundAccountRequest, user=Depends(verify_token)):
    """Fund an account with tokens."""
    cmd = [
        "tx",
        "bank",
        "send",
        request.from_account,
        request.address,
        request.amount,
        "--yes",
    ]
    result = run_pocket_command(cmd, request.network)
    if result["exit_code"] != 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fund account: {result['stderr']}",
        )
    return result


@router.get("/{address}", response_model=CommandResponse)
async def get_account(address: str, network: str = "alpha", user=Depends(verify_token)):
    """Get account information."""
    cmd = ["query", "account", address]
    return run_pocket_command(cmd, network)
