from datetime import datetime


class StreakManager:
    POINTS_PER_SESSION = 50
    POINTS_COMPLETE_BONUS = 30
    POINTS_NEEDS_WORK = -10
    POINTS_PENDING = 0

    def calculate_points(self, final_status: str, confidence: float) -> int:
        base = self.POINTS_PER_SESSION
        if final_status == "COMPLETE":
            base += self.POINTS_COMPLETE_BONUS
        elif final_status == "NEEDS WORK":
            base += self.POINTS_NEEDS_WORK
        elif final_status == "PENDING":
            base += self.POINTS_PENDING
        base += int(confidence / 5)
        return max(base, 0)

    def update_streak(self, last_date, current_streak: int) -> int:
        now = datetime.utcnow()
        if last_date is None:
            return 1
        delta = (now.date() - last_date.date()).days
        if delta == 0:
            return max(current_streak, 1)
        elif delta == 1:
            return current_streak + 1
        else:
            return 1