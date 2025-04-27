"""
Service-related API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status

from ..auth import verify_token
from ..models import CommandResponse, ServiceRequest
from ..pocket import run_pocket_command

router = APIRouter(prefix="/service", tags=["service"])


@router.post("/create", response_model=CommandResponse)
async def create_service(request: ServiceRequest, user=Depends(verify_token)):
    """Create a new service on the Pocket network."""
    cmd = [
        "tx",
        "service",
        "add-service",
        request.service_id,
        request.service_name,
        str(request.compute_units),
        "--from",
        request.from_account,
        "--yes",
    ]
    result = run_pocket_command(cmd, request.network)
    if result["exit_code"] != 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create service: {result['stderr']}",
        )
    return result


@router.get("/{service_id}", response_model=CommandResponse)
async def get_service(
    service_id: str, network: str = "alpha", user=Depends(verify_token)
):
    """Get service information."""
    cmd = ["query", "service", "show-service", service_id]
    return run_pocket_command(cmd, network)
