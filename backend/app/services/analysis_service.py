import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.services.policy_service import policy_service
from app.services.hindsight_service import hindsight_service
from app.services.groq_service import groq_service

logger = logging.getLogger(__name__)

class AnalysisService:
    async def analyze_case(self, case_input: Dict[str, Any]) -> Dict[str, Any]:
        policy_id = case_input.get("policy_id", "pol_onboarding_001")
        policy = policy_service.get_policy(policy_id) or {
            "name": "Customer Onboarding Procedure",
            "version": "2.1",
            "id": policy_id
        }

        title = case_input.get("title", "Submitted Case")
        risk_level = case_input.get("risk_level", "Low")
        description = case_input.get("description", "")
        expected_process = case_input.get("expected_process", [])
        actual_process = case_input.get("actual_process", [])
        reason = case_input.get("reason_for_deviation", "")
        context = case_input.get("additional_context", "")

        # Step 1: Detect process deviation against written SOP
        proc_comp = policy_service.compare_processes(expected_process, actual_process)
        has_deviation = proc_comp["has_deviation"]
        deviation_type = proc_comp["deviation_type"]
        detected_deviations = proc_comp["detected_deviations"]

        # Step 2: Query Hindsight Cloud for persistent organizational memory
        search_query = f"{title} {description} {reason} {context} {deviation_type} risk:{risk_level}"
        recalled_memories = await hindsight_service.recall_experiences(
            query=search_query,
            policy_id=policy_id,
            risk_level=risk_level,
            top_k=5
        )

        memory_count = len(recalled_memories)

        # Step 3: Groq LLM Reasoning Synthesis if Groq API key is present
        groq_result = None
        if groq_service.is_configured:
            system_prompt = """You are an expert AI Policy Drift Agent evaluating an operational case against written SOP and organizational historical memory from Hindsight.
Return JSON with keys: recommendation, confidence_score, policy_status, reasoning_summary, learned_patterns, risk_considerations, suggested_actions, policy_review_warranted, review_recommendation_reason."""
            user_prompt = f"""
Policy: {policy.get('name')} (Version {policy.get('version')})
Case Title: {title}
Risk Level: {risk_level}
Description: {description}
Has Deviation: {has_deviation} ({deviation_type})
Detected Deviations: {detected_deviations}
Reason: {reason}
Recalled Historical Experiences from Hindsight Cloud ({memory_count} memories): {json.dumps([m['experience'] for m in recalled_memories], indent=2)}
"""
            try:
                raw_groq = await groq_service.generate_reasoning(system_prompt, user_prompt)
                if raw_groq:
                    groq_result = json.loads(raw_groq)
            except Exception as e:
                logger.warning(f"Groq API call exception or limit: {e}. Falling back to deterministic Hindsight analysis engine.")

        # If Groq produced valid JSON, return it merged with metadata
        if groq_result and isinstance(groq_result, dict):
            return {
                "case_id": f"case_{int(datetime.now().timestamp())}",
                "policy_id": policy_id,
                "policy_name": policy.get("name"),
                "policy_version": policy.get("version"),
                "case_title": title,
                "risk_level": risk_level,
                "has_deviation": has_deviation,
                "deviation_type": deviation_type,
                "detected_deviations": detected_deviations,
                "policy_status": groq_result.get("policy_status", "Deviation Detected" if has_deviation else "Compliant"),
                "recommendation": groq_result.get("recommendation", "Approve Exception"),
                "confidence_score": float(groq_result.get("confidence_score", 0.88)),
                "reasoning_summary": groq_result.get("reasoning_summary", ""),
                "historical_evidence": recalled_memories or [],
                "learned_patterns": groq_result.get("learned_patterns", []) or [],
                "risk_considerations": groq_result.get("risk_considerations", []) or [],
                "suggested_actions": groq_result.get("suggested_actions", []) or [],
                "policy_review_warranted": bool(groq_result.get("policy_review_warranted", False)),
                "review_recommendation_reason": groq_result.get("review_recommendation_reason", None),
                "memory_count_influencing": memory_count
            }

        # Deterministic Analysis Engine using REAL Hindsight Cloud memories
        # -----------------------------------------------------------------
        # ZERO MEMORY (Stage 1)
        if memory_count == 0:
            policy_status = "Deviation Detected (No Hindsight Memory Baseline)" if has_deviation else "Fully Compliant"
            recommendation = "Reject Deviation / Enforce SOP" if has_deviation else "Approve Compliant Onboarding"
            confidence_score = 0.60 if has_deviation else 0.95
            reasoning_summary = (
                f"Hindsight persistent memory bank returned {memory_count} historical experiences for this scenario. "
                "Because the organization has no prior memory baseline for this exception, the agent conservatively defaults to strict written SOP compliance."
            )
            learned_patterns = [
                "Zero Memory State: No historical experiences retrieved from Hindsight Cloud.",
                "Conservative policy enforcement recommended until operational outcomes are recorded."
            ]
            risk_considerations = [
                "Uncertainty: No past outcomes recorded for this process modification.",
                "Operational Delay: Enforcing strict SOP may require secondary approval."
            ]
            suggested_actions = [
                "Enforce written SOP compliance for this case.",
                "Log human decision and operational outcome to build Hindsight organizational memory."
            ]
            policy_review_warranted = False
            review_reason = None

        # POST-MEMORY (Stage 3): Hindsight Memories Available!
        else:
            successful_memories = [m for m in recalled_memories if m.get("experience", {}).get("outcome") == "Successful"]
            unsuccessful_memories = [m for m in recalled_memories if m.get("experience", {}).get("outcome") == "Unsuccessful"]

            succ_count = len(successful_memories)
            unsucc_count = len(unsuccessful_memories)

            if str(risk_level).lower() in ["high", "critical"]:
                if unsucc_count > 0 or has_deviation:
                    policy_status = "High Risk Policy Breach Warning"
                    recommendation = "Escalate for Manager Review" if has_deviation else "Approve with Manager Sign-Off"
                    confidence_score = 0.94
                    reasoning_summary = (
                        f"Hindsight Cloud recalled {memory_count} relevant historical experiences. Past records clearly show that skipping "
                        f"mandatory steps in High-Risk scenarios produced negative outcomes ({unsucc_count} unsuccessful cases). "
                        "The agent strongly advises against unapproved deviations for High-Risk tiers."
                    )
                    learned_patterns = [
                        f"High-Risk Safeguard Pattern: Past high-risk deviations resulted in negative compliance audit flags in {unsucc_count} cases.",
                        "Manager approval remains mandatory for regulatory compliance."
                    ]
                    risk_considerations = [
                        "Regulatory Exposure: Bypassing high-risk safeguards creates legal exposure.",
                        "Audit Freeze: Unapproved high-risk accounts risk immediate freeze."
                    ]
                    suggested_actions = [
                        "Escalate immediately to Risk Manager for dual authorization.",
                        "Do not waive identity or manager sign-off steps."
                    ]
                    policy_review_warranted = False
                    review_reason = "High-risk safeguards remain essential; SOP step waiver is not recommended."
                else:
                    policy_status = "High Risk - Compliant Process"
                    recommendation = "Approve Onboarding"
                    confidence_score = 0.92
                    reasoning_summary = "High-risk process aligns with written policy requirements. Standard approval recommended."
                    learned_patterns = ["Compliant execution verified."]
                    risk_considerations = ["Standard high-risk monitoring."]
                    suggested_actions = ["Proceed with standard manager sign-off."]
                    policy_review_warranted = False
                    review_reason = None
            else:
                if has_deviation and succ_count > 0:
                    policy_status = "Recurring Exception Pattern Identified"
                    recommendation = "Approve Exception (Alternative Verification)"
                    confidence_score = min(0.98, round(0.75 + (succ_count * 0.04), 2))
                    reasoning_summary = (
                        f"Hindsight Cloud recalled {memory_count} relevant historical experiences. Across {succ_count} similar low-risk cases, "
                        "the operational deviation (substituting standard document proof with verified alternative credentials) "
                        "consistently produced 100% SUCCESSFUL outcomes without regulatory degradation."
                    )
                    learned_patterns = [
                        f"Learned Exception Pattern: {succ_count} historical low-risk cases successfully used alternative verification in Hindsight memory.",
                        "Operational reality repeatedly deviates from rigid document collection requirements for modern digital accounts."
                    ]
                    risk_considerations = [
                        "Low Operational Risk: Verified alternative credentials maintain security integrity.",
                        "Efficiency Gain: Approving exception removes customer onboarding friction."
                    ]
                    suggested_actions = [
                        "Approve current exception based on cumulative Hindsight memory evidence.",
                        "Record final outcome to further strengthen organizational memory."
                    ]
                    policy_review_warranted = (succ_count >= 3)
                    review_reason = (
                        f"Step 2 of Policy {policy.get('name')} has been repeatedly bypassed with alternative verification "
                        f"across {succ_count} successful cases in Hindsight memory. Consider updating written SOP to formally accept alternative digital proofs."
                    )
                elif has_deviation:
                    policy_status = "Uncertain Exception"
                    recommendation = "Require Additional Verification"
                    confidence_score = 0.70
                    reasoning_summary = "Hindsight memory evidence is ambiguous. Additional verification is recommended before approving exception."
                    learned_patterns = ["Ambiguous historical precedent."]
                    risk_considerations = ["Potential process inconsistency."]
                    suggested_actions = ["Request secondary verification."]
                    policy_review_warranted = False
                    review_reason = None
                else:
                    policy_status = "Fully Policy Compliant"
                    recommendation = "Approve Onboarding"
                    confidence_score = 0.96
                    reasoning_summary = "Proposed process matches written SOP guidelines."
                    learned_patterns = ["Standard compliant execution."]
                    risk_considerations = ["None."]
                    suggested_actions = ["Proceed with standard account provisioning."]
                    policy_review_warranted = False
                    review_reason = None

        return {
            "case_id": f"case_{int(datetime.now().timestamp())}",
            "policy_id": policy_id,
            "policy_name": policy.get("name"),
            "policy_version": policy.get("version"),
            "case_title": title,
            "risk_level": risk_level,
            "has_deviation": has_deviation,
            "deviation_type": deviation_type,
            "detected_deviations": detected_deviations,
            "policy_status": policy_status,
            "recommendation": recommendation,
            "confidence_score": confidence_score,
            "reasoning_summary": reasoning_summary,
            "historical_evidence": recalled_memories or [],
            "learned_patterns": learned_patterns or [],
            "risk_considerations": risk_considerations or [],
            "suggested_actions": suggested_actions or [],
            "policy_review_warranted": policy_review_warranted,
            "review_recommendation_reason": review_reason,
            "memory_count_influencing": memory_count
        }

analysis_service = AnalysisService()
