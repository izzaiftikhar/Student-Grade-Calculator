# Student Grade Calculator

Calculates a student's total marks, percentage, letter grade and pass/fail result from subject marks.
Available as a Python command-line program and as a web app.

## Live demo
Add your deployed link here after deploying.

## Features
- Add or remove any number of subjects
- Total marks, percentage and letter grade
- Per-subject grade with a progress bar
- Pass/fail result
- Input validation, responsive layout, dark mode

## Grade scale
| Percentage | Grade |
|-----------|-------|
| 90+ | A+ |
| 80-89 | A |
| 70-79 | B |
| 60-69 | C |
| 50-59 | D |
| Below 50 | F |

Pass requires at least 50% overall and in every subject.

## Project structure
```
Student-Grade-Calculator/
├── index.html
├── css/style.css
├── js/script.js
├── python/student_grade_calculator.py
├── README.md
└── .gitignore
```

## Run locally
**Web version:** open `index.html` in your browser.

**Python version:**
```
python python/student_grade_calculator.py
```

## Tech
HTML, CSS, JavaScript (web) and Python (CLI).