"""
Authentication and token verification logic for FastAPI routes.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt

from .config import SUPABASE_JWT_SECRET

security = HTTPBearer()


async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        # In production, validate the JWT with Supabase's public key
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # TODO: Implement real JWT verification with Supabase
        # payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
        # return payload
        # For demo, return mock user
        return {"sub": "demo-user", "email": "user@example.com"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
