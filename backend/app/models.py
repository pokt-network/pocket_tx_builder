"""
Pydantic models for request and response bodies.
"""

from typing import Dict, List, Optional

from pydantic import BaseModel

from .config import DEFAULT_FUNDING_AMOUNT


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
    from_account: str = "faucet"


class ServiceRequest(BaseModel):
    service_id: str
    service_name: str
    compute_units: int = 10
    from_account: str
    network: str = "alpha"
