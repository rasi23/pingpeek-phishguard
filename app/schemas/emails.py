from pydantic import BaseModel
from typing import Dict, Any, List

class Rule(BaseModel):
    id: str
    name: str
    description: str
    severity: str

class EmailAnalysisResponse(BaseModel):
    verdict: str
    confidence: float
    triggered_rules: List[Rule]
    threat_data: Dict[str, Any]
    email_metadata: Dict[str, str]

class EmailAnalysisRequest(BaseModel):
    raw_email: str