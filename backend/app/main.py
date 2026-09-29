from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.config import settings
from app.routes import health, policies, cases, memory, insights, dashboard, demo

app = FastAPI(
    title="Policy Drift Agent API",
    description="Backend AI & Persistent Hindsight Memory API for Policy Drift Agent",
    version="1.0.0"
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(policies.router, prefix="/api", tags=["Policies"])
app.include_router(cases.router, prefix="/api", tags=["Cases"])
app.include_router(memory.router, prefix="/api", tags=["Memory"])
app.include_router(insights.router, prefix="/api", tags=["Insights"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(demo.router, prefix="/api", tags=["Demo Mode"])

@app.get("/")
def read_root():
    return {
        "message": "Policy Drift Agent API is running.",
        "mode": settings.APP_MODE,
        "is_hindsight_configured": settings.is_hindsight_configured,
        "is_groq_configured": settings.is_groq_configured,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
