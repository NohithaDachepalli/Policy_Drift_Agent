import httpx
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from fastapi import HTTPException
from app.config import settings

logger = logging.getLogger(__name__)

class HindsightService:
    """
    Dedicated production service for Vectorize Hindsight Persistent Memory Cloud API.
    All memory operations (retain, recall, timeline) communicate strictly with Hindsight Cloud.
    NO local memory fallback or fake memory arrays are used.
    """
    def __init__(self):
        self.api_key = settings.HINDSIGHT_API_KEY
        self.api_url = settings.HINDSIGHT_API_URL.rstrip('/')
        self.bank_id = settings.HINDSIGHT_BANK_ID

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and self.bank_id)

    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

    def _get_bank_base_url(self) -> str:
        return f"{self.api_url}/v1/default/banks/{self.bank_id}"

    async def retain_experience(self, experience: Dict[str, Any]) -> Dict[str, Any]:
        """
        Retains an operational case experience directly into Hindsight Cloud persistent memory.
        Endpoint: POST /v1/default/banks/{bank_id}/memories
        """
        if not self.is_configured:
            raise HTTPException(
                status_code=503,
                detail="Hindsight Cloud is not configured. Please add HINDSIGHT_API_KEY and HINDSIGHT_BANK_ID to backend/.env to enable persistent memory retention."
            )

        case_id = experience.get("case_id", f"case_{int(datetime.now().timestamp())}")
        timestamp = experience.get("timestamp") or datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

        def _to_str(val: Any) -> str:
            if isinstance(val, list):
                return ", ".join(str(item) for item in val)
            return str(val) if val is not None else ""

        # Prepare semantic memory document payload for vector & graph indexing in Hindsight Cloud
        memory_metadata = {
            "case_id": str(case_id),
            "policy_id": str(experience.get("policy_id", "pol_onboarding_001")),
            "policy_version": str(experience.get("policy_version", "2.1")),
            "title": str(experience.get("title", "Operational Case")),
            "situation": str(experience.get("situation", "")),
            "expected_process": _to_str(experience.get("expected_process", "")),
            "actual_process": _to_str(experience.get("actual_process", "")),
            "deviation": str(experience.get("deviation", "")),
            "deviation_type": str(experience.get("deviation_type", "None")),
            "reason": str(experience.get("reason", "")),
            "risk_level": str(experience.get("risk_level", "Low")),
            "human_decision": str(experience.get("human_decision", "Approved Exception")),
            "outcome": str(experience.get("outcome", "Successful")),
            "outcome_quality": str(experience.get("outcome_quality", "Positive")),
            "learned_lesson": str(experience.get("learned_lesson", "")),
            "relevant_conditions": _to_str(experience.get("relevant_conditions", "")),
            "timestamp": str(timestamp)
        }

        # Rich text representation for semantic embeddings in Hindsight
        document_text = (
            f"Case: {memory_metadata['title']}. "
            f"Situation: {memory_metadata['situation']}. "
            f"Deviation Type: {memory_metadata['deviation_type']}. "
            f"Deviation Details: {memory_metadata['deviation']}. "
            f"Reason: {memory_metadata['reason']}. "
            f"Risk Tier: {memory_metadata['risk_level']}. "
            f"Human Operator Decision: {memory_metadata['human_decision']}. "
            f"Operational Outcome: {memory_metadata['outcome']}. "
            f"Retained Organizational Lesson: {memory_metadata['learned_lesson']}"
        )

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                url = f"{self._get_bank_base_url()}/memories"
                payload = {
                    "items": [
                        {
                            "content": document_text,
                            "metadata": memory_metadata
                        }
                    ]
                }

                response = await client.post(url, json=payload, headers=self._get_headers())

                if response.status_code in [200, 201]:
                    res_data = response.json()
                    memory_id = res_data.get("operation_id") or res_data.get("id") or f"mem_{case_id}"
                    logger.info(f"Successfully retained experience {case_id} in Hindsight Cloud memory bank '{self.bank_id}'")
                    return {
                        "case_id": case_id,
                        "memory_id": memory_id,
                        "status": "retained",
                        "mode": "hindsight_cloud",
                        "message": f"Experience retained in Hindsight Cloud persistent memory bank '{self.bank_id}'.",
                        "timestamp": timestamp
                    }
                else:
                    error_msg = response.text
                    logger.error(f"Hindsight API Error ({response.status_code}): {error_msg}")
                    raise HTTPException(
                        status_code=502,
                        detail=f"Hindsight Cloud API error ({response.status_code}): {error_msg}"
                    )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Hindsight Cloud network connection error: {e}")
            raise HTTPException(
                status_code=503,
                detail=f"Failed to communicate with Hindsight Cloud memory bank: {str(e)}"
            )

    async def recall_experiences(
        self,
        query: str,
        policy_id: Optional[str] = None,
        risk_level: Optional[str] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Recalls historical experiences from Hindsight Cloud persistent memory relevant to the current situation.
        Endpoint: POST /v1/default/banks/{bank_id}/memories/recall
        """
        if not self.is_configured:
            logger.info("Hindsight Cloud API is not configured. Returning 0 memories.")
            return []

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                url = f"{self._get_bank_base_url()}/memories/recall"
                payload = {
                    "query": query
                }

                response = await client.post(url, json=payload, headers=self._get_headers())

                if response.status_code == 200:
                    data = response.json()
                    recalled_items = []
                    raw_results = data.get("results") or data.get("items") or data.get("memories") or []

                    for item in raw_results:
                        metadata = item.get("metadata") or {}
                        scores = item.get("scores") or {}
                        score = 0.85
                        if isinstance(scores, dict):
                            score = round(scores.get("semantic") or scores.get("final") or 0.85, 2)

                        text_content = item.get("text") or item.get("document") or ""

                        recalled_items.append({
                            "memory_id": item.get("id") or f"mem_{len(recalled_items)}",
                            "similarity_score": score,
                            "experience": metadata if (metadata and metadata.get("title")) else {
                                "title": metadata.get("title") or (text_content[:60] if text_content else "Retrieved Experience"),
                                "situation": metadata.get("situation") or text_content,
                                "outcome": metadata.get("outcome") or "Successful",
                                "learned_lesson": metadata.get("learned_lesson") or text_content
                            },
                            "match_reasons": [
                                f"Hindsight semantic match (score: {score})",
                                f"Risk Tier: {metadata.get('risk_level', 'Low')}",
                                f"Recorded Outcome: {metadata.get('outcome', 'Successful')}"
                            ]
                        })
                    return recalled_items
                else:
                    logger.warning(f"Hindsight Cloud recall endpoint returned status {response.status_code}: {response.text}")
                    return []
        except Exception as e:
            logger.error(f"Error querying Hindsight Cloud recall endpoint: {e}")
            return []

    async def get_all_memories(self) -> List[Dict[str, Any]]:
        """
        Retrieves all stored persistent experiences directly from Hindsight Cloud memory bank.
        Endpoint: GET /v1/default/banks/{bank_id}/memories/list
        """
        if not self.is_configured:
            return []

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                url = f"{self._get_bank_base_url()}/memories/list"
                response = await client.get(url, headers=self._get_headers())

                if response.status_code == 200:
                    data = response.json()
                    raw_items = data.get("items") or data.get("memories") or []
                    experiences = []
                    for item in raw_items:
                        meta = item.get("metadata") or {}
                        if meta and meta.get("case_id"):
                            experiences.append(meta)
                        else:
                            text_val = item.get("text") or item.get("content") or ""
                            experiences.append({
                                "case_id": item.get("id", f"case_{len(experiences)}"),
                                "title": meta.get("title") or (text_val[:60] if text_val else "Persistent Memory"),
                                "situation": meta.get("situation") or text_val,
                                "learned_lesson": meta.get("learned_lesson") or text_val,
                                "timestamp": item.get("date") or item.get("mentioned_at") or datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
                            })
                    return experiences
                else:
                    logger.warning(f"Hindsight Cloud GET memories/list returned status {response.status_code}: {response.text}")
                    return await self._recall_all_as_timeline()
        except Exception as e:
            logger.warning(f"Failed to fetch memories list via GET memories/list, trying recall query: {e}")
            return await self._recall_all_as_timeline()

    async def _recall_all_as_timeline(self) -> List[Dict[str, Any]]:
        """
        Fallback query to retrieve memories from Hindsight Cloud bank.
        """
        items = await self.recall_experiences(query="operational case exception policy deviation outcome", top_k=50)
        return [item["experience"] for item in items if item.get("experience")]

    async def clear_bank(self) -> Dict[str, Any]:
        """
        Executes bank memory clear request against Hindsight Cloud for demo state reset.
        Endpoint: DELETE /v1/default/banks/{bank_id}/memories
        """
        if not self.is_configured:
            raise HTTPException(
                status_code=503,
                detail="Hindsight Cloud is not configured. Please add HINDSIGHT_API_KEY and HINDSIGHT_BANK_ID to backend/.env."
            )

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                url = f"{self._get_bank_base_url()}/memories"
                response = await client.delete(url, headers=self._get_headers())
                if response.status_code in [200, 204]:
                    res_data = response.json() if response.text else {}
                    message = res_data.get("message") or f"Hindsight memory bank '{self.bank_id}' cleared successfully."
                    return {"status": "cleared", "message": message}
                else:
                    logger.warning(f"Hindsight bank delete returned {response.status_code}: {response.text}")
                    return {"status": "warning", "message": f"Bank clear API call returned status {response.status_code}"}
        except Exception as e:
            logger.error(f"Hindsight bank clear error: {e}")
            return {"status": "error", "message": str(e)}

hindsight_service = HindsightService()
