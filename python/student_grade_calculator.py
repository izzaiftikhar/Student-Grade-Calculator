# STUDENT GRADE CALCULATOR

students = []

# Calculate grade

def calculate_grade(percentage):

    if 90 <= percentage <= 100:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B"
    elif percentage >= 60:
        return "C"
    elif percentage >= 50:
        return "D"
    elif percentage >= 40:
        return "E"
    else:
        return "F"


# Calculate Result

def calculate_result(marks):

    total = sum(marks)
    number_of_subjects = len(marks)
    average = total / number_of_subjects
    maximum_marks = number_of_subjects * 100
    percentage = (total / maximum_marks) * 100
    grade = calculate_grade(percentage)
    return total, average, percentage, grade


# Add Student

def add_student():
    name = input("Enter your name:")

    python_marks = int(input("Enter python marks:"))
    html_marks = int(input("Enter HTML marks:"))
    sql_marks = int(input("Enter SQL marks:"))
    javascript_marks = int(input("Enter JAVASCRIPT marks:"))

    marks = {
        "Python": python_marks,
        "HTML": html_marks,
        "SQL": sql_marks,
        "JAVASCRIPT": javascript_marks
        }

    student = {
        "name": name,
        "marks": marks
        }

    students.append(student)

    print("\nStudent Added Successfully!")


# Display Students

def display_students():

    if not students:
        print("\nNo Student Displayed.")
        return
        
    for student in students:
        name = student["name"]
        marks = student["marks"]
    
        total, average, percentage, grade = calculate_result(marks.values())

        print("\n--- Student Result ---") 

        print("Name:", name) 
        print("Python:", marks["Python"]) 
        print("HTML:", marks["HTML"]) 
        print("SQL:", marks["SQL"]) 
        print("JAVASCRIPT:", marks["JAVASCRIPT"]) 

        print("Total:", total) 
        print("Average:", round(average, 2)) 
        print("Percentage:", round(percentage, 2), "%") 
        print("Grade:", grade) 


# Main Menu 

while True: 

    print("\n--- Student Grade Calculator ---")

    print("1. Add Student") 
    print("2. Display Students") 
    print("3. Exit") 
    
    choice = input("Enter your choice: ") 

    if choice == "1": 
        add_student() 
        
    elif choice == "2": 
        display_students() 
    
    elif choice == "3": 
        print("Goodbye!") 
        break 

    else: 
        print("Invalid choice. Please try again.")

        