from typing import List, Dict, Any
from app.models.database import db
from app.services.hindsight_service import hindsight_service

class InsightService:
    async def get_dashboard_overview(self) -> Dict[str, Any]:
        """
        Dynamically calculates dashboard overview metrics from actual Hindsight Cloud memory bank records.
        Does NOT rely on fake local case arrays.
        """
        policies = db.get_all_policies()
        insights = db.get_all_insights()

        memories = await hindsight_service.get_all_memories()
        
        total_cases = len(memories)
        policies_tracked = len(policies)
        
        exceptions_detected = sum(
            1 for c in memories if c.get("deviation") or c.get("deviation_type", "None") != "None"
        )
        
        successful_exceptions = sum(
            1 for c in memories 
            if (c.get("deviation") or c.get("deviation_type", "None") != "None") and c.get("outcome") == "Successful"
        )

        success_rate = (
            round((successful_exceptions / exceptions_detected) * 100.0, 1) 
            if exceptions_detected > 0 else 0.0
        )

        recent_activities = []
        for case in memories[:5]:
            recent_activities.append({
                "case_id": case.get("case_id"),
                "title": case.get("title"),
                "policy_id": case.get("policy_id"),
                "risk_level": case.get("risk_level"),
                "human_decision": case.get("human_decision"),
                "outcome": case.get("outcome"),
                "timestamp": case.get("timestamp")
            })

        return {
            "hindsight_configured": hindsight_service.is_configured,
            "total_cases": total_cases,
            "policies_tracked": policies_tracked,
            "exceptions_detected": exceptions_detected,
            "policy_drift_patterns": len(insights) if total_cases > 0 else 0,
            "successful_exception_rate": success_rate,
            "recent_learning_activities": recent_activities
        }

    def get_learning_insights(self) -> List[Dict[str, Any]]:
        return db.get_all_insights()

insight_service = InsightService()
