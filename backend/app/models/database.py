import threading
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.demo.seed_data import get_initial_policies, get_initial_insights

class DatabaseStore:
    """
    In-memory store for written SOP policy definitions and policy drift insight schemas.
    NOTE: All operational case memories, historical experiences, retention, and recall
    are strictly managed by Hindsight Cloud (via HindsightService).
    """
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(DatabaseStore, cls).__new__(cls)
                cls._instance._init_db()
        return cls._instance

    def _init_db(self):
        self.policies: Dict[str, Dict[str, Any]] = {p["id"]: p for p in get_initial_policies()}
        self.insights: List[Dict[str, Any]] = get_initial_insights()

    def reset_to_seed(self):
        with self._lock:
            self._init_db()

    def get_all_policies(self) -> List[Dict[str, Any]]:
        return list(self.policies.values())

    def get_policy_by_id(self, policy_id: str) -> Optional[Dict[str, Any]]:
        return self.policies.get(policy_id)

    def get_all_insights(self) -> List[Dict[str, Any]]:
        return self.insights

    def add_insight(self, insight: Dict[str, Any]):
        with self._lock:
            self.insights.append(insight)

db = DatabaseStore()
