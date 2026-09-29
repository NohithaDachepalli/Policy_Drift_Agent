from typing import List, Dict, Any
from datetime import datetime, timedelta

def get_initial_policies() -> List[Dict[str, Any]]:
    return [
        {
            "id": "pol_onboarding_001",
            "name": "Customer Onboarding Procedure",
            "code": "SOP-FIN-021",
            "version": "2.1",
            "category": "Customer Operations",
            "description": "Standard operating procedure for verifying customer identity, validating compliance documents, performing risk screening, and creating live accounts.",
            "total_cases": 14,
            "deviations_count": 8,
            "recurring_exceptions_count": 3,
            "last_analyzed": "2026-09-28T14:30:00",
            "drift_status": "Review Suggested",
            "summary_notes": "Frequent operational deviation detected around Step 2 (Document Verification) for verified low-risk repeat customers, consistently yielding positive outcomes when alternative verification is performed.",
            "steps": [
                {
                    "step_number": 1,
                    "name": "Identity Verification",
                    "description": "Verify primary legal identity against official registry or government ID.",
                    "is_mandatory": True
                },
                {
                    "step_number": 2,
                    "name": "Document Verification",
                    "description": "Collect and validate proof of address and secondary utility bills.",
                    "is_mandatory": True
                },
                {
                    "step_number": 3,
                    "name": "Risk Screening & AML Check",
                    "description": "Run automated sanctions, PEP, and adverse media screening.",
                    "is_mandatory": True
                },
                {
                    "step_number": 4,
                    "name": "Manager Approval (High-Risk Cases)",
                    "description": "Mandatory sign-off from Risk Manager if customer risk tier is High or PEP flagged.",
                    "is_mandatory": True,
                    "required_condition": "Risk level is High or Critical"
                },
                {
                    "step_number": 5,
                    "name": "Account Provisioning",
                    "description": "Generate core system credentials and configure account permissions.",
                    "is_mandatory": True
                },
                {
                    "step_number": 6,
                    "name": "Confirmation Dispatch",
                    "description": "Send welcome package and formal onboarding confirmation.",
                    "is_mandatory": True
                }
            ]
        },
        {
            "id": "pol_expense_002",
            "name": "Corporate Expense & Reimbursement Policy",
            "code": "SOP-FIN-088",
            "version": "1.4",
            "category": "Finance & Accounting",
            "description": "Guidelines for business travel, client entertainment, and itemized receipt submission.",
            "total_cases": 9,
            "deviations_count": 3,
            "recurring_exceptions_count": 1,
            "last_analyzed": "2026-09-27T09:15:00",
            "drift_status": "Minor Drift",
            "summary_notes": "Occasional receipt waiver granted for micro-purchases under $25 during travel.",
            "steps": [
                {
                    "step_number": 1,
                    "name": "Pre-Approval Request",
                    "description": "Submit travel budget pre-approval for expenses over $500.",
                    "is_mandatory": True
                },
                {
                    "step_number": 2,
                    "name": "Itemized Receipt Collection",
                    "description": "Attach clear digital photos of line-item receipts.",
                    "is_mandatory": True
                },
                {
                    "step_number": 3,
                    "name": "Manager Review & Audit",
                    "description": "Line manager verifies expense policy compliance.",
                    "is_mandatory": True
                },
                {
                    "step_number": 4,
                    "name": "Finance Reimbursement",
                    "description": "Disburse funds to employee account.",
                    "is_mandatory": True
                }
            ]
        },
        {
            "id": "pol_access_003",
            "name": "Emergency Production System Access",
            "code": "SOP-SEC-104",
            "version": "3.0",
            "category": "Security & IT",
            "description": "Strict protocol for granting break-glass emergency administrative privileges to production servers.",
            "total_cases": 6,
            "deviations_count": 2,
            "recurring_exceptions_count": 1,
            "last_analyzed": "2026-09-26T18:00:00",
            "drift_status": "High Risk Drift",
            "summary_notes": "Emergency bypass attempted during off-hours outage without post-incident security log review.",
            "steps": [
                {
                    "step_number": 1,
                    "name": "Ticket Creation",
                    "description": "Log P1/P2 outage ticket in IT Service Management system.",
                    "is_mandatory": True
                },
                {
                    "step_number": 2,
                    "name": "SecOps Break-Glass Sign-Off",
                    "description": "Obtain two-factor authorization token from Security Operations officer.",
                    "is_mandatory": True
                },
                {
                    "step_number": 3,
                    "name": "Time-Bound Access Window",
                    "description": "Grant maximum 2-hour privileged access duration.",
                    "is_mandatory": True
                },
                {
                    "step_number": 4,
                    "name": "Post-Incident Audit",
                    "description": "Perform session video playback audit within 24 hours.",
                    "is_mandatory": True
                }
            ]
        }
    ]

def get_initial_historical_cases() -> List[Dict[str, Any]]:
    now = datetime.now()
    def date_str(days_ago: int):
        return (now - timedelta(days=days_ago)).strftime("%Y-%m-%dT%H:%M:%S")

    return [
        {
            "case_id": "case_hist_001",
            "policy_id": "pol_onboarding_001",
            "policy_version": "2.1",
            "title": "Low-Risk Enterprise Client - Utility Bill Delay",
            "situation": "Existing enterprise account expansion client with multi-year positive transaction history. Utility bill address document was temporarily unavailable due to landlord delay.",
            "expected_process": [
                "1. Identity Verification",
                "2. Document Verification (Collect Utility Bill)",
                "3. Risk Screening",
                "4. Account Provisioning",
                "5. Confirmation Dispatch"
            ],
            "actual_process": [
                "1. Identity Verification completed",
                "2. Secondary utility bill waived; accepted verified corporate tax registration link + bank reference",
                "3. Risk Screening completed (Low Risk)",
                "4. Account Provisioning completed",
                "5. Confirmation Dispatch sent"
            ],
            "deviation": "Waived standard utility bill requirement (Step 2) in favor of corporate tax registration and bank verification.",
            "deviation_type": "Alternative Verification",
            "reason": "Customer had immediate contract execution timeline and landlord delayed physical bill delivery.",
            "risk_level": "Low",
            "human_decision": "Approved Exception (Conditional Onboarding)",
            "outcome": "Successful",
            "outcome_quality": "Positive",
            "learned_lesson": "For low-risk repeat corporate clients, verified government tax registration + active bank reference provides sufficient address assurance without compliance degradation.",
            "relevant_conditions": ["Low Risk", "Existing Client Tier", "Alternative Verification Provided", "Contract Time-Sensitive"],
            "timestamp": date_str(45)
        },
        {
            "case_id": "case_hist_002",
            "policy_id": "pol_onboarding_001",
            "policy_version": "2.1",
            "title": "High-Risk Cross-Border Account - Skipped Manager Approval",
            "situation": "High-net-worth individual with foreign corporate structure. Sales rep rushed onboarding and skipped Manager Approval (Step 4) to hit monthly quota.",
            "expected_process": [
                "1. Identity Verification",
                "2. Document Verification",
                "3. Risk Screening (Flagged High Risk)",
                "4. Manager Approval (Mandatory Sign-off)",
                "5. Account Provisioning",
                "6. Confirmation Dispatch"
            ],
            "actual_process": [
                "1. Identity Verification completed",
                "2. Document Verification completed",
                "3. Risk Screening flagged High Risk / PEP association",
                "4. SKIPPED Manager Approval",
                "5. Account Provisioning activated directly",
                "6. Confirmation Dispatch sent"
            ],
            "deviation": "Completely bypassed mandatory Step 4 (Manager Approval) for a high-risk flagged customer.",
            "deviation_type": "Unauthorized Waiver",
            "reason": "Quarter-end sales volume pressure.",
            "risk_level": "High",
            "human_decision": "Overridden / Retroactive Escalation",
            "outcome": "Unsuccessful",
            "outcome_quality": "Negative",
            "learned_lesson": "Skipping Manager Approval on High-Risk or PEP cases leads to regulatory compliance audit flags and mandatory freeze.",
            "relevant_conditions": ["High Risk", "PEP Flagged", "Bypassed Approval", "Time Pressure"],
            "timestamp": date_str(30)
        },
        {
            "case_id": "case_hist_003",
            "policy_id": "pol_expense_002",
            "policy_version": "1.4",
            "title": "Emergency Client Travel - Missing $18 Taxi Receipt",
            "situation": "Field consultant submitted expense claim missing an $18 cash taxi receipt from overseas transit.",
            "expected_process": [
                "1. Pre-Approval Request",
                "2. Itemized Receipt Collection",
                "3. Manager Audit",
                "4. Reimbursement"
            ],
            "actual_process": [
                "1. Pre-approval verified",
                "2. $18 taxi receipt missing; employee signed missing receipt declaration affidavit",
                "3. Manager audit approved under $25 de-minimis threshold",
                "4. Reimbursement processed"
            ],
            "deviation": "Waived physical receipt requirement for micro-expense under $25 with signed declaration.",
            "deviation_type": "Omission",
            "reason": "Local taxi operator in emergency deployment area did not provide printed receipt.",
            "risk_level": "Low",
            "human_decision": "Approved Exception",
            "outcome": "Successful",
            "outcome_quality": "Positive",
            "learned_lesson": "Micro-expenses under $25 with signed affidavit are safe exceptions and reduce administrative overhead.",
            "relevant_conditions": ["Low Expense", "De-minimis", "Signed Affidavit"],
            "timestamp": date_str(15)
        }
    ]

def get_initial_insights() -> List[Dict[str, Any]]:
    return [
        {
            "id": "insight_pattern_001",
            "pattern_type": "Recurring Exception",
            "title": "Low-Risk Document Verification Alternative Pattern",
            "description": "Step 2 (Utility Bill collection) is repeatedly waived for verified low-risk repeat or funded customers who provide alternative digital registry proofs or bank references.",
            "policy_id": "pol_onboarding_001",
            "policy_name": "Customer Onboarding Procedure",
            "affected_step": "Step 2: Document Verification",
            "evidence_count": 3,
            "successful_cases": 3,
            "unsuccessful_cases": 0,
            "success_rate": 100.0,
            "risk_assessment": "Low Risk. Operations teams are consistently finding that modern digital companies and repeat clients lack traditional utility bills. Current SOP rigidity causes artificial customer friction.",
            "recommendation": "Update Policy SOP-FIN-021 Section 2 to formally authorize digital business registry QR check or institutional bank reference as valid Step 2 alternatives for Low-Risk tier.",
            "status": "Active Drift",
            "historical_case_ids": ["case_hist_001", "case_hist_003"],
            "timestamp": "2026-09-28T16:00:00"
        },
        {
            "id": "insight_pattern_002",
            "pattern_type": "Risky Deviation",
            "title": "High-Risk Manager Approval Bypass Warning",
            "description": "Step 4 (Manager Approval for High-Risk / PEP flagged accounts) was bypassed in a historical case due to end-of-quarter volume pressure, producing a negative regulatory compliance outcome.",
            "policy_id": "pol_onboarding_001",
            "policy_name": "Customer Onboarding Procedure",
            "affected_step": "Step 4: Manager Approval (High-Risk Cases)",
            "evidence_count": 1,
            "successful_cases": 0,
            "unsuccessful_cases": 1,
            "success_rate": 0.0,
            "risk_assessment": "High / Critical Risk. Deviations in high-risk categories consistently lead to compliance audit freezes and legal risks.",
            "recommendation": "Enforce strict system block preventing account activation without dual digital signature from Risk Manager whenever risk score is High/Critical. Do NOT loosen this SOP step.",
            "status": "Under Review",
            "historical_case_ids": ["case_hist_002"],
            "timestamp": "2026-09-27T11:20:00"
        }
    ]
