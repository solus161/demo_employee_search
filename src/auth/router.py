from fastapi import APIRouter, Depends,  HTTPException, status
from .utils import authenticate

router = APIRouter(
    prefix="/api/v1", tags = ['Authentication'])

@router.get('/login', status_code=status.HTTP_200_OK)
async def login(user = Depends(authenticate)):
    """
    Could implement token generation here for OAuth2 or JWT.
    """
    if user:
        return {"message": "Login successful"}
    raise HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Invalid credentials")