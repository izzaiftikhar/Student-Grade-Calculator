from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_folder="public", static_url_path="")

# Grade scale: (minimum percentage, letter grade). Edit to match your rules.
GRADE_SCALE = [(90, "A+"), (80, "A"), (70, "B"), (60, "C"), (50, "D"), (0, "F")]
PASS_MARK = 50


def get_grade(percentage):
    for minimum, grade in GRADE_SCALE:
        if percentage >= minimum:
            return grade
    return "F"


def calculate_result(name, subjects):
    """Return the full result dict, or raise ValueError with a clear message."""
    if not name:
        raise ValueError("Enter the student's name.")
    if not subjects:
        raise ValueError("Add at least one subject.")

    results = []
    total_obtained = 0
    total_max = 0

    for i, item in enumerate(subjects, start=1):
        subject = str(item.get("subject", "")).strip() or f"Subject {i}"
        try:
            obtained = float(item.get("obtained"))
            maximum = float(item.get("max"))
        except (TypeError, ValueError):
            raise ValueError(f'Enter valid marks for "{subject}".')

        if maximum <= 0:
            raise ValueError(f'Maximum marks for "{subject}" must be greater than 0.')
        if obtained < 0 or obtained > maximum:
            raise ValueError(f'Marks for "{subject}" must be between 0 and {maximum:g}.')

        percentage = obtained / maximum * 100
        results.append({
            "subject": subject,
            "obtained": obtained,
            "max": maximum,
            "percentage": round(percentage, 2),
            "grade": get_grade(percentage),
        })
        total_obtained += obtained
        total_max += maximum

    overall = total_obtained / total_max * 100
    passed = overall >= PASS_MARK and all(r["percentage"] >= PASS_MARK for r in results)

    return {
        "name": name,
        "total_obtained": round(total_obtained, 2),
        "total_max": round(total_max, 2),
        "percentage": round(overall, 2),
        "grade": get_grade(overall),
        "passed": passed,
        "subjects": results,
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    subjects = data.get("subjects", [])

    try:
        result = calculate_result(name, subjects)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)