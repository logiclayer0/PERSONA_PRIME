class EyeContactAnalyzer:
    def __init__(self):
        self.state = "Unknown"

    def analyze(self, iris_y: float, nose_y: float):
        if abs(iris_y - nose_y) > 0.08:
            self.state = "Poor"
        else:
            self.state = "Good"
        return self.state