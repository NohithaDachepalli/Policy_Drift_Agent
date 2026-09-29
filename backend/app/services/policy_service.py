from typing import List, Dict, Any, Optional
from app.models.database import db

class PolicyService:
    def list_policies(self) -> List[Dict[str, Any]]:
        return db.get_all_policies()

    def get_policy(self, policy_id: str) -> Optional[Dict[str, Any]]:
        return db.get_policy_by_id(policy_id)

    def compare_processes(self, expected_process: List[str], actual_process: List[str]) -> Dict[str, Any]:
        """
        Identifies step omissions, modifications, or deviations between SOP and actual execution.
        """
        deviations = []
        has_deviation = False
        deviation_type = "None"

        # Check for length differences or step text differences
        if len(expected_process) != len(actual_process):
            has_deviation = True
            deviation_type = "Step Modification"

        for exp in expected_process:
            # check if expected step appears in actual process
            matched = any(exp.lower() in act.lower() for act in actual_process)
            if not matched:
                has_deviation = True
                deviations.append(f"Omitted or substituted step: '{exp}'")

        for act in actual_process:
            if "waiv" in act.lower() or "substitut" in act.lower() or "skip" in act.lower() or "alternat" in act.lower():
                has_deviation = True
                deviations.append(f"Operational exception noted: '{act}'")

        if has_deviation:
            if any("waiv" in d.lower() or "alternat" in d.lower() for d in deviations):
                deviation_type = "Alternative Verification"
            elif any("skip" in d.lower() or "omit" in d.lower() for d in deviations):
                deviation_type = "Step Omission"
            else:
                deviation_type = "Sequence Modification"

        return {
            "has_deviation": has_deviation,
            "deviation_type": deviation_type if has_deviation else "None",
            "detected_deviations": deviations if deviations else ["No process deviation detected. Fully compliant with written SOP."]
        }

policy_service = PolicyService()
