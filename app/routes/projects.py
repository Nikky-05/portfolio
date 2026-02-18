"""
Projects route - serves portfolio project data.
Fetches projects from SQLite and formats them for the frontend.
"""

from fastapi import APIRouter, HTTPException
from typing import List

from app.models.schemas import ProjectOut
from app.database.connection import get_db

router = APIRouter(prefix="/api", tags=["Projects"])


@router.get("/projects", response_model=List[ProjectOut])
async def get_projects():
    """Fetch all portfolio projects."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM projects ORDER BY id")
        rows = cursor.fetchall()

    projects = []
    for row in rows:
        projects.append(ProjectOut(
            id=row["id"],
            title=row["title"],
            description=row["description"],
            features=row["features"].split("|"),
            tech_stack=row["tech_stack"].split("|"),
            architecture=row["architecture"],
            github_url=row["github_url"],
            live_url=row["live_url"],
            image_url=row["image_url"],
        ))

    return projects


@router.get("/projects/{project_id}", response_model=ProjectOut)
async def get_project(project_id: int):
    """Fetch a single project by ID."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
        row = cursor.fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Project not found")

    return ProjectOut(
        id=row["id"],
        title=row["title"],
        description=row["description"],
        features=row["features"].split("|"),
        tech_stack=row["tech_stack"].split("|"),
        architecture=row["architecture"],
        github_url=row["github_url"],
        live_url=row["live_url"],
        image_url=row["image_url"],
    )
