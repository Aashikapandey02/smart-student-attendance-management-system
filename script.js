// ==================== LOGIN ====================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const role = document.getElementById("role").value;
        const loginMessage = document.getElementById("loginMessage");

        if (username === "" || password === "" || role === "") {
            loginMessage.textContent = "Please fill all fields.";
            loginMessage.style.color = "#c0392b";
            return;
        }

        // Admin login
        const adminPassword =
             localStorage.getItem("adminPassword") || "admin123";

              if (
                role === "admin" &&
                 username === "admin" &&
             password === adminPassword
                 ) {
                    localStorage.setItem("loggedInUser", "admin");
                  localStorage.setItem("userRole", "admin");
                 window.location.href = "admin.html";
               return;
}

        // Student login
        if (role === "student") {
            const students =
                JSON.parse(localStorage.getItem("students")) || [];

            const student = students.find(function(student) {
                return (
                    student.studentId === username &&
                    student.password === password
                );
            });

            if (student) {
                localStorage.setItem("loggedInUser", student.studentId);
                localStorage.setItem("userRole", "student");

                window.location.href = "student.html";
                return;
            }
        }

        // Teacher login will be added later
        loginMessage.textContent = "Invalid username, password or role.";
        loginMessage.style.color = "#c0392b";
    });
}


// ==================== STUDENT REGISTRATION ====================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("studentName").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const semester = document.getElementById("semester").value;
        const section = document.getElementById("section").value;
        const gmail = document.getElementById("gmail").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;
        const registerMessage =
            document.getElementById("registerMessage");

        if (
            name === "" ||
            studentId === "" ||
            semester === "" ||
            section === "" ||
            gmail === "" ||
            phone === "" ||
            password === "" ||
            confirmPassword === ""
        ) {
            registerMessage.textContent = "Please fill all fields.";
            registerMessage.style.color = "#c0392b";
            return;
        }

        if (password !== confirmPassword) {
            registerMessage.textContent = "Passwords do not match.";
            registerMessage.style.color = "#c0392b";
            return;
        }

        let students =
            JSON.parse(localStorage.getItem("students")) || [];

        // Check duplicate Student ID
        const studentExists = students.some(function(student) {
            return student.studentId.toLowerCase() === studentId.toLowerCase();
        });

        if (studentExists) {
            registerMessage.textContent = "Student ID already exists.";
            registerMessage.style.color = "#c0392b";
            return;
        }

        const newStudent = {
            id: Date.now(),
            name: name,
            studentId: studentId,
            semester: semester,
            section: section,
            gmail: gmail,
            phone: phone,
            password: password
        };

        students.push(newStudent);

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

        registerMessage.textContent =
            "Registration successful. You can now login.";

        registerMessage.style.color = "#2e7d32";

        registerForm.reset();
    });
}


// ==================== SAMPLE STUDENTS ====================

// Create sample students only when no student data exists

function createSampleStudents() {
    const students = localStorage.getItem("students");

    if (students === null) {
        const sampleStudents = [
            {
                id: 1,
                name: "Aashika Pandey",
                studentId: "BCS001",
                semester: "4th",
                section: "A",
                gmail: "aashika@gmail.com",
                phone: "9800000001",
                password: "student123"
            },
            {
                id: 2,
                name: "Riya Sharma",
                studentId: "BCS002",
                semester: "4th",
                section: "A",
                gmail: "riya@gmail.com",
                phone: "9800000002",
                password: "student123"
            },
            {
                id: 3,
                name: "Sita Thapa",
                studentId: "BCS003",
                semester: "4th",
                section: "A",
                gmail: "sita@gmail.com",
                phone: "9800000003",
                password: "student123"
            },
            {
                id: 4,
                name: "Anisha KC",
                studentId: "BCS004",
                semester: "4th",
                section: "A",
                gmail: "anisha@gmail.com",
                phone: "9800000004",
                password: "student123"
            },
            {
                id: 5,
                name: "Pratiksha Rai",
                studentId: "BCS005",
                semester: "4th",
                section: "A",
                gmail: "pratiksha@gmail.com",
                phone: "9800000005",
                password: "student123"
            }
        ];

        localStorage.setItem(
            "students",
            JSON.stringify(sampleStudents)
        );
    }
}

createSampleStudents();


// ==================== STUDENTS ====================

const studentTableBody =
    document.getElementById("studentTableBody");

const studentSearch =
    document.getElementById("studentSearch");

const semesterFilter =
    document.getElementById("semesterFilter");

const sectionFilter =
    document.getElementById("sectionFilter");

const adminStudentForm =
    document.getElementById("adminStudentForm");


// Show student form

function showStudentForm() {
    const studentForm =
        document.getElementById("studentForm");

    if (studentForm) {
        studentForm.style.display = "block";
    }
}


// Hide student form

function hideStudentForm() {
    const studentForm =
        document.getElementById("studentForm");

    if (studentForm) {
        studentForm.style.display = "none";
    }

    if (adminStudentForm) {
        adminStudentForm.reset();
        delete adminStudentForm.dataset.editId;
    }

    const studentFormMessage =
        document.getElementById("studentFormMessage");

    if (studentFormMessage) {
        studentFormMessage.textContent = "";
    }
}


// Display students

function displayStudents() {
    if (!studentTableBody) {
        return;
    }

    const students =
        JSON.parse(localStorage.getItem("students")) || [];

    const searchText = studentSearch
        ? studentSearch.value.toLowerCase().trim()
        : "";

    const selectedSemester = semesterFilter
        ? semesterFilter.value
        : "";

    const selectedSection = sectionFilter
        ? sectionFilter.value
        : "";

    studentTableBody.innerHTML = "";

    const filteredStudents = students.filter(function(student) {

        const matchesSearch =
            student.name.toLowerCase().includes(searchText) ||
            student.studentId.toLowerCase().includes(searchText) ||
            student.gmail.toLowerCase().includes(searchText);

        const matchesSemester =
            selectedSemester === "" ||
            student.semester === selectedSemester;

        const matchesSection =
            selectedSection === "" ||
            student.section === selectedSection;

        return (
            matchesSearch &&
            matchesSemester &&
            matchesSection
        );
    });

    if (filteredStudents.length === 0) {
        studentTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center;">
                    No students found.
                </td>
            </tr>
        `;
        return;
    }

    filteredStudents.forEach(function(student, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.studentId}</td>
            <td>${student.name}</td>
            <td>${student.semester}</td>
            <td>${student.section}</td>
            <td>${student.gmail}</td>
            <td>${student.phone}</td>
            <td>
                <button class="edit-button"
                    onclick="editStudent(${student.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-button"
                    onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        studentTableBody.appendChild(row);
    });
}


// ==================== ADD / EDIT STUDENT ====================

if (adminStudentForm) {

    adminStudentForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name =
            document.getElementById("adminStudentName").value.trim();

        const studentId =
            document.getElementById("adminStudentId").value.trim();

        const semester =
            document.getElementById("adminSemester").value;

        const section =
            document.getElementById("adminSection").value;

        const gmail =
            document.getElementById("adminGmail").value.trim();

        const phone =
            document.getElementById("adminPhone").value.trim();

        const studentFormMessage =
            document.getElementById("studentFormMessage");

        if (
            name === "" ||
            studentId === "" ||
            semester === "" ||
            section === "" ||
            gmail === "" ||
            phone === ""
        ) {
            studentFormMessage.textContent =
                "Please fill all fields.";

            studentFormMessage.style.color = "#c0392b";
            return;
        }

        let students =
            JSON.parse(localStorage.getItem("students")) || [];

        const editId =
            adminStudentForm.dataset.editId;


        // ==================== EDIT STUDENT ====================

        if (editId) {

            const studentIndex =
                students.findIndex(function(student) {
                    return student.id === Number(editId);
                });

            if (studentIndex === -1) {
                return;
            }

            // Check Student ID against other students
            const duplicateId =
                students.some(function(student) {
                    return (
                        student.studentId.toLowerCase() ===
                        studentId.toLowerCase() &&
                        student.id !== Number(editId)
                    );
                });

            if (duplicateId) {
                studentFormMessage.textContent =
                    "Another student already has this Student ID.";

                studentFormMessage.style.color = "#c0392b";
                return;
            }

            students[studentIndex].name = name;
            students[studentIndex].studentId = studentId;
            students[studentIndex].semester = semester;
            students[studentIndex].section = section;
            students[studentIndex].gmail = gmail;
            students[studentIndex].phone = phone;

            localStorage.setItem(
                "students",
                JSON.stringify(students)
            );

            studentFormMessage.textContent =
                "Student updated successfully.";

            studentFormMessage.style.color = "#2e7d32";

            delete adminStudentForm.dataset.editId;

            adminStudentForm.reset();

            displayStudents();

            return;
        }


        // ==================== ADD NEW STUDENT ====================

        const studentExists =
            students.some(function(student) {
                return (
                    student.studentId.toLowerCase() ===
                    studentId.toLowerCase()
                );
            });

        if (studentExists) {
            studentFormMessage.textContent =
                "Student ID already exists.";

            studentFormMessage.style.color = "#c0392b";
            return;
        }

        const newStudent = {
            id: Date.now(),
            name: name,
            studentId: studentId,
            semester: semester,
            section: section,
            gmail: gmail,
            phone: phone,
            password: ""
        };

        students.push(newStudent);

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

        studentFormMessage.textContent =
            "Student added successfully.";

        studentFormMessage.style.color = "#2e7d32";

        adminStudentForm.reset();

        displayStudents();
    });
}


// ==================== DELETE STUDENT ====================

function deleteStudent(studentId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) {
        return;
    }

    let students =
        JSON.parse(localStorage.getItem("students")) || [];

    students = students.filter(function(student) {
        return student.id !== studentId;
    });

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    displayStudents();
}


// ==================== EDIT STUDENT ====================

function editStudent(studentId) {

    const students =
        JSON.parse(localStorage.getItem("students")) || [];

    const student =
        students.find(function(student) {
            return student.id === studentId;
        });

    if (!student) {
        return;
    }

    showStudentForm();

    document.getElementById("adminStudentName").value =
        student.name;

    document.getElementById("adminStudentId").value =
        student.studentId;

    document.getElementById("adminSemester").value =
        student.semester;

    document.getElementById("adminSection").value =
        student.section;

    document.getElementById("adminGmail").value =
        student.gmail;

    document.getElementById("adminPhone").value =
        student.phone;

    const studentFormMessage =
        document.getElementById("studentFormMessage");

    studentFormMessage.textContent =
        "Edit the information and save again.";

    studentFormMessage.style.color = "#2f66d0";

    adminStudentForm.dataset.editId =
        studentId;
}


// ==================== STUDENT SEARCH ====================

if (studentSearch) {
    studentSearch.addEventListener(
        "input",
        displayStudents
    );
}


// ==================== SEMESTER FILTER ====================

if (semesterFilter) {
    semesterFilter.addEventListener(
        "change",
        displayStudents
    );
}


// ==================== SECTION FILTER ====================

if (sectionFilter) {
    sectionFilter.addEventListener(
        "change",
        displayStudents
    );
}


// ==================== LOAD STUDENTS ====================

if (studentTableBody) {
    displayStudents();
}

// ==================== TEACHERS ====================

const teacherTableBody =
    document.getElementById("teacherTableBody");

const teacherSearch =
    document.getElementById("teacherSearch");

const adminTeacherForm =
    document.getElementById("adminTeacherForm");


// ==================== SAMPLE TEACHERS ====================

function createSampleTeachers() {
    const teachers = localStorage.getItem("teachers");

    if (teachers === null) {
        const sampleTeachers = [
            {
                id: 1,
                teacherId: "T001",
                name: "Mr. Sharma",
                subject: "DBMS",
                gmail: "sharma@gmail.com",
                phone: "9800000011",
                password: "teacher123"
            },
            {
                id: 2,
                teacherId: "T002",
                name: "Ms. Thapa",
                subject: "Java Programming",
                gmail: "thapa@gmail.com",
                phone: "9800000012",
                password: "teacher123"
            },
            {
                id: 3,
                teacherId: "T003",
                name: "Mr. Neupane",
                subject: "Software Engineering",
                gmail: "neupane@gmail.com",
                phone: "9800000013",
                password: "teacher123"
            },
            {
                id: 4,
                teacherId: "T004",
                name: "Ms. KC",
                subject: "Operating System",
                gmail: "kc@gmail.com",
                phone: "9800000014",
                password: "teacher123"
            },
            {
                id: 5,
                teacherId: "T005",
                name: "Mr. Rai",
                subject: "Web Technology",
                gmail: "rai@gmail.com",
                phone: "9800000015",
                password: "teacher123"
            }
        ];

        localStorage.setItem(
            "teachers",
            JSON.stringify(sampleTeachers)
        );
    }
}

createSampleTeachers();


// ==================== SHOW TEACHER FORM ====================

function showTeacherForm() {
    const teacherForm =
        document.getElementById("teacherForm");

    if (teacherForm) {
        teacherForm.style.display = "block";
    }
}


// ==================== HIDE TEACHER FORM ====================

function hideTeacherForm() {
    const teacherForm =
        document.getElementById("teacherForm");

    if (teacherForm) {
        teacherForm.style.display = "none";
    }

    if (adminTeacherForm) {
        adminTeacherForm.reset();
        delete adminTeacherForm.dataset.editId;
    }

    const teacherFormMessage =
        document.getElementById("teacherFormMessage");

    if (teacherFormMessage) {
        teacherFormMessage.textContent = "";
    }
}


// ==================== DISPLAY TEACHERS ====================

function displayTeachers() {
    if (!teacherTableBody) {
        return;
    }

    const teachers =
        JSON.parse(localStorage.getItem("teachers")) || [];

    const searchText = teacherSearch
        ? teacherSearch.value.toLowerCase().trim()
        : "";

    teacherTableBody.innerHTML = "";

    const filteredTeachers =
        teachers.filter(function(teacher) {

            return (
                teacher.teacherId.toLowerCase().includes(searchText) ||
                teacher.name.toLowerCase().includes(searchText) ||
                teacher.subject.toLowerCase().includes(searchText) ||
                teacher.gmail.toLowerCase().includes(searchText)
            );
        });

    if (filteredTeachers.length === 0) {
        teacherTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                    No teachers found.
                </td>
            </tr>
        `;
        return;
    }

    filteredTeachers.forEach(function(teacher, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${teacher.teacherId}</td>
            <td>${teacher.name}</td>
            <td>${teacher.subject}</td>
            <td>${teacher.gmail}</td>
            <td>${teacher.phone}</td>
            <td>
                <button class="edit-button"
                    onclick="editTeacher(${teacher.id})">
                    <i class="fas fa-edit"></i>
                </button>

                <button class="delete-button"
                    onclick="deleteTeacher(${teacher.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        teacherTableBody.appendChild(row);
    });
}


// ==================== ADD / EDIT TEACHER ====================

if (adminTeacherForm) {

    adminTeacherForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const teacherId =
            document.getElementById("teacherId").value.trim();

        const teacherName =
            document.getElementById("teacherName").value.trim();

        const teacherSubject =
            document.getElementById("teacherSubject").value;

        const teacherGmail =
            document.getElementById("teacherGmail").value.trim();

        const teacherPhone =
            document.getElementById("teacherPhone").value.trim();

        const teacherPassword =
            document.getElementById("teacherPassword").value;

        const teacherFormMessage =
            document.getElementById("teacherFormMessage");

        if (
            teacherId === "" ||
            teacherName === "" ||
            teacherSubject === "" ||
            teacherGmail === "" ||
            teacherPhone === "" ||
            teacherPassword === ""
        ) {
            teacherFormMessage.textContent =
                "Please fill all fields.";

            teacherFormMessage.style.color = "#c0392b";
            return;
        }

        let teachers =
            JSON.parse(localStorage.getItem("teachers")) || [];

        const editId =
            adminTeacherForm.dataset.editId;


        // ==================== EDIT TEACHER ====================

        if (editId) {

            const teacherIndex =
                teachers.findIndex(function(teacher) {
                    return teacher.id === Number(editId);
                });

            if (teacherIndex === -1) {
                return;
            }

            // Check duplicate Teacher ID
            const duplicateId =
                teachers.some(function(teacher) {
                    return (
                        teacher.teacherId.toLowerCase() ===
                        teacherId.toLowerCase() &&
                        teacher.id !== Number(editId)
                    );
                });

            if (duplicateId) {
                teacherFormMessage.textContent =
                    "Another teacher already has this Teacher ID.";

                teacherFormMessage.style.color = "#c0392b";
                return;
            }

            teachers[teacherIndex].teacherId =
                teacherId;

            teachers[teacherIndex].name =
                teacherName;

            teachers[teacherIndex].subject =
                teacherSubject;

            teachers[teacherIndex].gmail =
                teacherGmail;

            teachers[teacherIndex].phone =
                teacherPhone;

            teachers[teacherIndex].password =
                teacherPassword;

            localStorage.setItem(
                "teachers",
                JSON.stringify(teachers)
            );

            teacherFormMessage.textContent =
                "Teacher updated successfully.";

            teacherFormMessage.style.color = "#2e7d32";

            delete adminTeacherForm.dataset.editId;

            adminTeacherForm.reset();

            displayTeachers();

            return;
        }


        // ==================== ADD NEW TEACHER ====================

        const teacherExists =
            teachers.some(function(teacher) {
                return (
                    teacher.teacherId.toLowerCase() ===
                    teacherId.toLowerCase()
                );
            });

        if (teacherExists) {
            teacherFormMessage.textContent =
                "Teacher ID already exists.";

            teacherFormMessage.style.color = "#c0392b";
            return;
        }

        const newTeacher = {
            id: Date.now(),
            teacherId: teacherId,
            name: teacherName,
            subject: teacherSubject,
            gmail: teacherGmail,
            phone: teacherPhone,
            password: teacherPassword
        };

        teachers.push(newTeacher);

        localStorage.setItem(
            "teachers",
            JSON.stringify(teachers)
        );

        teacherFormMessage.textContent =
            "Teacher added successfully.";

        teacherFormMessage.style.color = "#2e7d32";

        adminTeacherForm.reset();

        displayTeachers();
    });
}


// ==================== DELETE TEACHER ====================

function deleteTeacher(teacherId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this teacher?");

    if (!confirmDelete) {
        return;
    }

    let teachers =
        JSON.parse(localStorage.getItem("teachers")) || [];

    teachers = teachers.filter(function(teacher) {
        return teacher.id !== teacherId;
    });

    localStorage.setItem(
        "teachers",
        JSON.stringify(teachers)
    );

    displayTeachers();
}


// ==================== EDIT TEACHER ====================

function editTeacher(teacherId) {

    const teachers =
        JSON.parse(localStorage.getItem("teachers")) || [];

    const teacher =
        teachers.find(function(teacher) {
            return teacher.id === teacherId;
        });

    if (!teacher) {
        return;
    }

    showTeacherForm();

    document.getElementById("teacherId").value =
        teacher.teacherId;

    document.getElementById("teacherName").value =
        teacher.name;

    document.getElementById("teacherSubject").value =
        teacher.subject;

    document.getElementById("teacherGmail").value =
        teacher.gmail;

    document.getElementById("teacherPhone").value =
        teacher.phone;

    document.getElementById("teacherPassword").value =
        teacher.password;

    const teacherFormMessage =
        document.getElementById("teacherFormMessage");

    teacherFormMessage.textContent =
        "Edit the information and save again.";

    teacherFormMessage.style.color = "#2f66d0";

    adminTeacherForm.dataset.editId =
        teacherId;
}


// ==================== TEACHER SEARCH ====================

if (teacherSearch) {
    teacherSearch.addEventListener(
        "input",
        displayTeachers
    );
}


// ==================== LOAD TEACHERS ====================

if (teacherTableBody) {
    displayTeachers();
}

 // ==================== SUBJECTS ====================

const subjectTableBody =
    document.getElementById("subjectTableBody");

const subjectSearch =
    document.getElementById("subjectSearch");

const adminSubjectForm =
    document.getElementById("adminSubjectForm");


// ==================== SAMPLE SUBJECTS ====================

function createSampleSubjects() {
    const subjects = localStorage.getItem("subjects");

    if (subjects === null) {
        const sampleSubjects = [
            {
                id: 1,
                code: "DBMS",
                name: "Database Management System",
                teacher: "Mr. Sharma",
                semester: "4th",
                section: "A"
            },
            {
                id: 2,
                code: "JAVA",
                name: "Java Programming",
                teacher: "Ms. Thapa",
                semester: "4th",
                section: "A"
            },
            {
                id: 3,
                code: "SE",
                name: "Software Engineering",
                teacher: "Mr. Neupane",
                semester: "4th",
                section: "A"
            },
            {
                id: 4,
                code: "OS",
                name: "Operating System",
                teacher: "Ms. KC",
                semester: "4th",
                section: "A"
            },
            {
                id: 5,
                code: "WEB",
                name: "Web Technology",
                teacher: "Mr. Rai",
                semester: "4th",
                section: "A"
            }
        ];

        localStorage.setItem(
            "subjects",
            JSON.stringify(sampleSubjects)
        );
    }
}

createSampleSubjects();


// ==================== SHOW SUBJECT FORM ====================

function showSubjectForm() {
    const subjectForm =
        document.getElementById("subjectForm");

    if (subjectForm) {
        subjectForm.style.display = "block";
    }
}


// ==================== HIDE SUBJECT FORM ====================

function hideSubjectForm() {
    const subjectForm =
        document.getElementById("subjectForm");

    if (subjectForm) {
        subjectForm.style.display = "none";
    }

    if (adminSubjectForm) {
        adminSubjectForm.reset();
        delete adminSubjectForm.dataset.editId;
    }

    const subjectFormMessage =
        document.getElementById("subjectFormMessage");

    if (subjectFormMessage) {
        subjectFormMessage.textContent = "";
    }
}


// ==================== DISPLAY SUBJECTS ====================

function displaySubjects() {
    if (!subjectTableBody) {
        return;
    }

    const subjects =
        JSON.parse(localStorage.getItem("subjects")) || [];

    const searchText = subjectSearch
        ? subjectSearch.value.toLowerCase().trim()
        : "";

    subjectTableBody.innerHTML = "";

    const filteredSubjects =
        subjects.filter(function(subject) {

            return (
                subject.code.toLowerCase().includes(searchText) ||
                subject.name.toLowerCase().includes(searchText) ||
                subject.teacher.toLowerCase().includes(searchText)
            );
        });

    if (filteredSubjects.length === 0) {
        subjectTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                    No subjects found.
                </td>
            </tr>
        `;
        return;
    }

    filteredSubjects.forEach(function(subject, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${subject.code}</td>
            <td>${subject.name}</td>
            <td>${subject.teacher}</td>
            <td>${subject.semester}</td>
            <td>${subject.section}</td>
            <td>
                <button class="edit-button"
                    onclick="editSubject(${subject.id})">
                    <i class="fas fa-edit"></i>
                </button>

                <button class="delete-button"
                    onclick="deleteSubject(${subject.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        subjectTableBody.appendChild(row);
    });
}


// ==================== ADD / EDIT SUBJECT ====================

if (adminSubjectForm) {

    adminSubjectForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const subjectCode =
            document.getElementById("subjectCode").value.trim();

        const subjectName =
            document.getElementById("subjectName").value.trim();

        const subjectTeacher =
            document.getElementById("subjectTeacher").value;

        const subjectSemester =
            document.getElementById("subjectSemester").value;

        const subjectSection =
            document.getElementById("subjectSection").value;

        const subjectFormMessage =
            document.getElementById("subjectFormMessage");

        if (
            subjectCode === "" ||
            subjectName === "" ||
            subjectTeacher === "" ||
            subjectSemester === "" ||
            subjectSection === ""
        ) {
            subjectFormMessage.textContent =
                "Please fill all fields.";

            subjectFormMessage.style.color = "#c0392b";
            return;
        }

        let subjects =
            JSON.parse(localStorage.getItem("subjects")) || [];

        const editId =
            adminSubjectForm.dataset.editId;


        // ==================== EDIT SUBJECT ====================

        if (editId) {

            const subjectIndex =
                subjects.findIndex(function(subject) {
                    return subject.id === Number(editId);
                });

            if (subjectIndex === -1) {
                return;
            }

            // Check duplicate subject code
            const duplicateCode =
                subjects.some(function(subject) {
                    return (
                        subject.code.toLowerCase() ===
                        subjectCode.toLowerCase() &&
                        subject.id !== Number(editId)
                    );
                });

            if (duplicateCode) {
                subjectFormMessage.textContent =
                    "Another subject already has this code.";

                subjectFormMessage.style.color = "#c0392b";
                return;
            }

            subjects[subjectIndex].code =
                subjectCode;

            subjects[subjectIndex].name =
                subjectName;

            subjects[subjectIndex].teacher =
                subjectTeacher;

            subjects[subjectIndex].semester =
                subjectSemester;

            subjects[subjectIndex].section =
                subjectSection;

            localStorage.setItem(
                "subjects",
                JSON.stringify(subjects)
            );

            subjectFormMessage.textContent =
                "Subject updated successfully.";

            subjectFormMessage.style.color = "#2e7d32";

            delete adminSubjectForm.dataset.editId;

            adminSubjectForm.reset();

            displaySubjects();

            return;
        }


        // ==================== ADD NEW SUBJECT ====================

        const subjectExists =
            subjects.some(function(subject) {
                return (
                    subject.code.toLowerCase() ===
                    subjectCode.toLowerCase()
                );
            });

        if (subjectExists) {
            subjectFormMessage.textContent =
                "Subject code already exists.";

            subjectFormMessage.style.color = "#c0392b";
            return;
        }

        const newSubject = {
            id: Date.now(),
            code: subjectCode,
            name: subjectName,
            teacher: subjectTeacher,
            semester: subjectSemester,
            section: subjectSection
        };

        subjects.push(newSubject);

        localStorage.setItem(
            "subjects",
            JSON.stringify(subjects)
        );

        subjectFormMessage.textContent =
            "Subject added successfully.";

        subjectFormMessage.style.color = "#2e7d32";

        adminSubjectForm.reset();

        displaySubjects();
    });
}


// ==================== DELETE SUBJECT ====================

function deleteSubject(subjectId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this subject?");

    if (!confirmDelete) {
        return;
    }

    let subjects =
        JSON.parse(localStorage.getItem("subjects")) || [];

    subjects = subjects.filter(function(subject) {
        return subject.id !== subjectId;
    });

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

    displaySubjects();
}


// ==================== EDIT SUBJECT ====================

function editSubject(subjectId) {

    const subjects =
        JSON.parse(localStorage.getItem("subjects")) || [];

    const subject =
        subjects.find(function(subject) {
            return subject.id === subjectId;
        });

    if (!subject) {
        return;
    }

    showSubjectForm();

    document.getElementById("subjectCode").value =
        subject.code;

    document.getElementById("subjectName").value =
        subject.name;

    document.getElementById("subjectTeacher").value =
        subject.teacher;

    document.getElementById("subjectSemester").value =
        subject.semester;

    document.getElementById("subjectSection").value =
        subject.section;

    const subjectFormMessage =
        document.getElementById("subjectFormMessage");

    subjectFormMessage.textContent =
        "Edit the information and save again.";

    subjectFormMessage.style.color = "#2f66d0";

    adminSubjectForm.dataset.editId =
        subjectId;
}


// ==================== SUBJECT SEARCH ====================

if (subjectSearch) {
    subjectSearch.addEventListener(
        "input",
        displaySubjects
    );
}


// ==================== LOAD SUBJECTS ====================

if (subjectTableBody) {
    displaySubjects();
}

// ==================== CLASSES ====================

const classTableBody =
    document.getElementById("classTableBody");

const classSearch =
    document.getElementById("classSearch");

const classSemesterFilter =
    document.getElementById("classSemesterFilter");

const classSectionFilter =
    document.getElementById("classSectionFilter");

const adminClassForm =
    document.getElementById("adminClassForm");


// ==================== SAMPLE CLASSES ====================

function createSampleClasses() {
    const classes = localStorage.getItem("classes");

    if (classes === null) {
        const sampleClasses = [
            {
                id: 1,
                subject: "DBMS",
                teacher: "Mr. Sharma",
                semester: "4th",
                section: "A",
                period: "1st Period - 6:55 AM",
                room: "Room 101"
            },
            {
                id: 2,
                subject: "Java Programming",
                teacher: "Ms. Thapa",
                semester: "4th",
                section: "A",
                period: "2nd Period - 7:50 AM",
                room: "Room 101"
            },
            {
                id: 3,
                subject: "Software Engineering",
                teacher: "Mr. Neupane",
                semester: "4th",
                section: "A",
                period: "3rd Period - 9:10 AM",
                room: "Room 101"
            },
            {
                id: 4,
                subject: "Operating System",
                teacher: "Ms. KC",
                semester: "4th",
                section: "A",
                period: "4th Period - 10:05 AM",
                room: "Room 101"
            },
            {
                id: 5,
                subject: "Web Technology",
                teacher: "Mr. Rai",
                semester: "4th",
                section: "A",
                period: "5th Period",
                room: "Room 101"
            }
        ];

        localStorage.setItem(
            "classes",
            JSON.stringify(sampleClasses)
        );
    }
}

createSampleClasses();


// ==================== SHOW CLASS FORM ====================

function showClassForm() {
    const classForm =
        document.getElementById("classForm");

    if (classForm) {
        classForm.style.display = "block";
    }
}


// ==================== HIDE CLASS FORM ====================

function hideClassForm() {
    const classForm =
        document.getElementById("classForm");

    if (classForm) {
        classForm.style.display = "none";
    }

    if (adminClassForm) {
        adminClassForm.reset();
        delete adminClassForm.dataset.editId;
    }

    const classFormMessage =
        document.getElementById("classFormMessage");

    if (classFormMessage) {
        classFormMessage.textContent = "";
    }
}


// ==================== DISPLAY CLASSES ====================

function displayClasses() {
    if (!classTableBody) {
        return;
    }

    const classes =
        JSON.parse(localStorage.getItem("classes")) || [];

    const searchText = classSearch
        ? classSearch.value.toLowerCase().trim()
        : "";

    const selectedSemester =
        classSemesterFilter
            ? classSemesterFilter.value
            : "";

    const selectedSection =
        classSectionFilter
            ? classSectionFilter.value
            : "";

    classTableBody.innerHTML = "";

    const filteredClasses =
        classes.filter(function(classItem) {

            const matchesSearch =
                classItem.subject.toLowerCase().includes(searchText) ||
                classItem.teacher.toLowerCase().includes(searchText) ||
                classItem.period.toLowerCase().includes(searchText) ||
                classItem.room.toLowerCase().includes(searchText);

            const matchesSemester =
                selectedSemester === "" ||
                classItem.semester === selectedSemester;

            const matchesSection =
                selectedSection === "" ||
                classItem.section === selectedSection;

            return (
                matchesSearch &&
                matchesSemester &&
                matchesSection
            );
        });

    if (filteredClasses.length === 0) {
        classTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center;">
                    No classes found.
                </td>
            </tr>
        `;
        return;
    }

    filteredClasses.forEach(function(classItem, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${classItem.subject}</td>
            <td>${classItem.teacher}</td>
            <td>${classItem.semester}</td>
            <td>${classItem.section}</td>
            <td>${classItem.period}</td>
            <td>${classItem.room}</td>
            <td>
                <button class="edit-button"
                    onclick="editClass(${classItem.id})">
                    <i class="fas fa-edit"></i>
                </button>

                <button class="delete-button"
                    onclick="deleteClass(${classItem.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        classTableBody.appendChild(row);
    });
}


// ==================== ADD / EDIT CLASS ====================

if (adminClassForm) {

    adminClassForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const classSubject =
            document.getElementById("classSubject").value;

        const classTeacher =
            document.getElementById("classTeacher").value;

        const classSemester =
            document.getElementById("classSemester").value;

        const classSection =
            document.getElementById("classSection").value;

        const classPeriod =
            document.getElementById("classPeriod").value;

        const classRoom =
            document.getElementById("classRoom").value.trim();

        const classFormMessage =
            document.getElementById("classFormMessage");

        if (
            classSubject === "" ||
            classTeacher === "" ||
            classSemester === "" ||
            classSection === "" ||
            classPeriod === "" ||
            classRoom === ""
        ) {
            classFormMessage.textContent =
                "Please fill all fields.";

            classFormMessage.style.color = "#c0392b";
            return;
        }

        let classes =
            JSON.parse(localStorage.getItem("classes")) || [];

        const editId =
            adminClassForm.dataset.editId;


        // ==================== EDIT CLASS ====================

        if (editId) {

            const classIndex =
                classes.findIndex(function(classItem) {
                    return classItem.id === Number(editId);
                });

            if (classIndex === -1) {
                return;
            }

            // Check duplicate class
            const duplicateClass =
                classes.some(function(classItem) {
                    return (
                        classItem.subject === classSubject &&
                        classItem.teacher === classTeacher &&
                        classItem.semester === classSemester &&
                        classItem.section === classSection &&
                        classItem.period === classPeriod &&
                        classItem.id !== Number(editId)
                    );
                });

            if (duplicateClass) {
                classFormMessage.textContent =
                    "This class already exists.";

                classFormMessage.style.color = "#c0392b";
                return;
            }

            classes[classIndex].subject =
                classSubject;

            classes[classIndex].teacher =
                classTeacher;

            classes[classIndex].semester =
                classSemester;

            classes[classIndex].section =
                classSection;

            classes[classIndex].period =
                classPeriod;

            classes[classIndex].room =
                classRoom;

            localStorage.setItem(
                "classes",
                JSON.stringify(classes)
            );

            classFormMessage.textContent =
                "Class updated successfully.";

            classFormMessage.style.color = "#2e7d32";

            delete adminClassForm.dataset.editId;

            adminClassForm.reset();

            displayClasses();

            return;
        }


        // ==================== ADD NEW CLASS ====================

        const classExists =
            classes.some(function(classItem) {
                return (
                    classItem.subject === classSubject &&
                    classItem.teacher === classTeacher &&
                    classItem.semester === classSemester &&
                    classItem.section === classSection &&
                    classItem.period === classPeriod
                );
            });

        if (classExists) {
            classFormMessage.textContent =
                "This class already exists.";

            classFormMessage.style.color = "#c0392b";
            return;
        }

        const newClass = {
            id: Date.now(),
            subject: classSubject,
            teacher: classTeacher,
            semester: classSemester,
            section: classSection,
            period: classPeriod,
            room: classRoom
        };

        classes.push(newClass);

        localStorage.setItem(
            "classes",
            JSON.stringify(classes)
        );

        classFormMessage.textContent =
            "Class added successfully.";

        classFormMessage.style.color = "#2e7d32";

        adminClassForm.reset();

        displayClasses();
    });
}


// ==================== DELETE CLASS ====================

function deleteClass(classId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this class?");

    if (!confirmDelete) {
        return;
    }

    let classes =
        JSON.parse(localStorage.getItem("classes")) || [];

    classes = classes.filter(function(classItem) {
        return classItem.id !== classId;
    });

    localStorage.setItem(
        "classes",
        JSON.stringify(classes)
    );

    displayClasses();
}


// ==================== EDIT CLASS ====================

function editClass(classId) {

    const classes =
        JSON.parse(localStorage.getItem("classes")) || [];

    const classItem =
        classes.find(function(classItem) {
            return classItem.id === classId;
        });

    if (!classItem) {
        return;
    }

    showClassForm();

    document.getElementById("classSubject").value =
        classItem.subject;

    document.getElementById("classTeacher").value =
        classItem.teacher;

    document.getElementById("classSemester").value =
        classItem.semester;

    document.getElementById("classSection").value =
        classItem.section;

    document.getElementById("classPeriod").value =
        classItem.period;

    document.getElementById("classRoom").value =
        classItem.room;

    const classFormMessage =
        document.getElementById("classFormMessage");

    classFormMessage.textContent =
        "Edit the information and save again.";

    classFormMessage.style.color = "#2f66d0";

    adminClassForm.dataset.editId =
        classId;
}


// ==================== CLASS SEARCH ====================

if (classSearch) {
    classSearch.addEventListener(
        "input",
        displayClasses
    );
}


// ==================== SEMESTER FILTER ====================

if (classSemesterFilter) {
    classSemesterFilter.addEventListener(
        "change",
        displayClasses
    );
}


// ==================== SECTION FILTER ====================

if (classSectionFilter) {
    classSectionFilter.addEventListener(
        "change",
        displayClasses
    );
}


// ==================== LOAD CLASSES ====================

if (classTableBody) {
    displayClasses();
}

// ==================== ATTENDANCE ====================

const attendanceDate =
    document.getElementById("attendanceDate");

const attendanceSubject =
    document.getElementById("attendanceSubject");

const attendanceSemester =
    document.getElementById("attendanceSemester");

const attendanceSection =
    document.getElementById("attendanceSection");

const attendancePeriod =
    document.getElementById("attendancePeriod");

const attendanceTeacher =
    document.getElementById("attendanceTeacher");

const attendanceTableBody =
    document.getElementById("attendanceTableBody");

const attendanceListCard =
    document.getElementById("attendanceListCard");

const presentCount =
    document.getElementById("presentCount");

const attendanceMessage =
    document.getElementById("attendanceMessage");

const attendanceHistoryBody =
    document.getElementById("attendanceHistoryBody");


// ==================== ATTENDANCE DATA ====================

let currentAttendance = [];


// ==================== SET TODAY'S DATE ====================

if (attendanceDate) {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    attendanceDate.value =
        `${year}-${month}-${day}`;
}


// ==================== LOAD STUDENTS FOR ATTENDANCE ====================

function loadAttendanceStudents() {

    if (!attendanceTableBody) {
        return;
    }

    const selectedSubject =
        attendanceSubject.value;

    const selectedSemester =
        attendanceSemester.value;

    const selectedSection =
        attendanceSection.value;

    const selectedPeriod =
        attendancePeriod.value;

    const selectedTeacher =
        attendanceTeacher.value;


    if (
        selectedSubject === "" ||
        selectedSemester === "" ||
        selectedSection === "" ||
        selectedPeriod === "" ||
        selectedTeacher === "" ||
        attendanceDate.value === ""
    ) {
        attendanceMessage.textContent =
            "Please select all attendance details.";

        attendanceMessage.style.color = "#c0392b";
        return;
    }


    const students =
        JSON.parse(localStorage.getItem("students")) || [];


    const filteredStudents =
        students.filter(function(student) {

            return (
                student.semester === selectedSemester &&
                student.section === selectedSection
            );
        });


    if (filteredStudents.length === 0) {

        attendanceTableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center;">
                    No students found for this semester and section.
                </td>
            </tr>
        `;

        if (attendanceListCard) {
            attendanceListCard.style.display = "block";
        }

        return;
    }


    // Create attendance list

    currentAttendance = [];

    filteredStudents.forEach(function(student) {

        currentAttendance.push({
            studentId: student.studentId,
            name: student.name,
            status: "present"
        });
    });


    displayAttendanceStudents();

    attendanceMessage.textContent =
        "Students loaded successfully.";

    attendanceMessage.style.color = "#2e7d32";
}


// ==================== DISPLAY ATTENDANCE STUDENTS ====================

function displayAttendanceStudents() {

    if (!attendanceTableBody) {
        return;
    }

    attendanceTableBody.innerHTML = "";


    currentAttendance.forEach(function(student, index) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.studentId}</td>
            <td>${student.name}</td>
            <td>
                <button
                    class="attendance-present ${student.status === "present" ? "active" : ""}"
                    onclick="setAttendance(this, 'present', ${index})">
                    Present
                </button>

                <button
                    class="attendance-absent ${student.status === "absent" ? "active" : ""}"
                    onclick="setAttendance(this, 'absent', ${index})">
                    Absent
                </button>
            </td>
        `;

        attendanceTableBody.appendChild(row);
    });


    updatePresentCount();


    if (attendanceListCard) {
        attendanceListCard.style.display = "block";
    }
}


// ==================== SET PRESENT / ABSENT ====================

function setAttendance(button, status, studentIndex) {

    if (!currentAttendance[studentIndex]) {
        return;
    }


    currentAttendance[studentIndex].status =
        status;


    const row =
        button.closest("tr");


    const buttons =
        row.querySelectorAll("button");


    buttons.forEach(function(button) {
        button.classList.remove("active");
    });


    button.classList.add("active");


    updatePresentCount();
}


// ==================== UPDATE PRESENT COUNT ====================

function updatePresentCount() {

    if (!presentCount) {
        return;
    }


    const totalStudents =
        currentAttendance.length;


    const totalPresent =
        currentAttendance.filter(function(student) {
            return student.status === "present";
        }).length;


    presentCount.textContent =
        totalPresent + " / " + totalStudents;
}


// ==================== SAVE ATTENDANCE ====================

function saveAttendance() {

    if (currentAttendance.length === 0) {

        attendanceMessage.textContent =
            "Please load students first.";

        attendanceMessage.style.color = "#c0392b";
        return;
    }


    const date =
        attendanceDate.value;

    const subject =
        attendanceSubject.value;

    const semester =
        attendanceSemester.value;

    const section =
        attendanceSection.value;

    const period =
        attendancePeriod.value;

    const teacher =
        attendanceTeacher.value;


    if (
        date === "" ||
        subject === "" ||
        semester === "" ||
        section === "" ||
        period === "" ||
        teacher === ""
    ) {
        attendanceMessage.textContent =
            "Please select all attendance details.";

        attendanceMessage.style.color = "#c0392b";
        return;
    }


    let attendanceRecords =
        JSON.parse(localStorage.getItem("attendanceRecords")) || [];


    // Check whether attendance is already saved

    const recordExists =
        attendanceRecords.some(function(record) {

            return (
                record.date === date &&
                record.subject === subject &&
                record.semester === semester &&
                record.section === section &&
                record.period === period
            );
        });


    if (recordExists) {

        attendanceMessage.textContent =
            "Attendance for this class is already saved.";

        attendanceMessage.style.color = "#c0392b";
        return;
    }


    // Create new attendance record

    const newRecord = {

        id: Date.now(),

        date: date,

        subject: subject,

        semester: semester,

        section: section,

        period: period,

        teacher: teacher,

        students: currentAttendance.map(function(student) {

            return {
                studentId: student.studentId,
                name: student.name,
                status: student.status
            };

        })
    };


    attendanceRecords.push(newRecord);


    localStorage.setItem(
        "attendanceRecords",
        JSON.stringify(attendanceRecords)
    );


    attendanceMessage.textContent =
        "Attendance saved successfully.";

    attendanceMessage.style.color = "#2e7d32";


    displayAttendanceHistory();
}


// ==================== DISPLAY ATTENDANCE HISTORY ====================

function displayAttendanceHistory() {

    if (!attendanceHistoryBody) {
        return;
    }


    const attendanceRecords =
        JSON.parse(localStorage.getItem("attendanceRecords")) || [];


    attendanceHistoryBody.innerHTML = "";


    if (attendanceRecords.length === 0) {

        attendanceHistoryBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    No attendance history found.
                </td>
            </tr>
        `;

        return;
    }


    // Show latest records first

    const reversedRecords =
        [...attendanceRecords].reverse();


    reversedRecords.forEach(function(record, index) {

        const totalStudents =
            record.students.length;


        const totalPresent =
            record.students.filter(function(student) {
                return student.status === "present";
            }).length;


        const totalAbsent =
            totalStudents - totalPresent;


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.subject}</td>
            <td>${record.period}</td>
            <td>${totalPresent}</td>
            <td>${totalAbsent}</td>
            <td>${record.teacher}</td>
        `;


        attendanceHistoryBody.appendChild(row);
    });
}


// ==================== LOAD ATTENDANCE HISTORY ====================

if (attendanceHistoryBody) {
    displayAttendanceHistory();
}

// ==================== REPORTS ====================

const reportTableBody =
    document.getElementById("reportTableBody");

const reportSearch =
    document.getElementById("reportSearch");

const reportSemester =
    document.getElementById("reportSemester");

const reportSection =
    document.getElementById("reportSection");

const reportSubject =
    document.getElementById("reportSubject");

const subjectReportBody =
    document.getElementById("subjectReportBody");

const lowAttendanceBody =
    document.getElementById("lowAttendanceBody");


// ==================== GET ATTENDANCE RECORDS ====================

function getAttendanceRecords() {
    return JSON.parse(
        localStorage.getItem("attendanceRecords")
    ) || [];
}


// ==================== CALCULATE STUDENT ATTENDANCE ====================

function calculateStudentAttendance(studentId, subject) {

    const records =
        getAttendanceRecords();

    let totalClasses = 0;
    let presentClasses = 0;

    records.forEach(function(record) {

        if (
            record.subject === subject ||
            subject === ""
        ) {

            const student =
                record.students.find(function(student) {
                    return student.studentId === studentId;
                });

            if (student) {

                totalClasses++;

                if (student.status === "present") {
                    presentClasses++;
                }
            }
        }
    });


    const absentClasses =
        totalClasses - presentClasses;


    let percentage = 0;

    if (totalClasses > 0) {
        percentage =
            (presentClasses / totalClasses) * 100;
    }


    percentage =
        Math.round(percentage * 100) / 100;


    let status = "NG";

    if (percentage >= 80) {
        status = "Eligible";
    }


    return {
        totalClasses: totalClasses,
        presentClasses: presentClasses,
        absentClasses: absentClasses,
        percentage: percentage,
        status: status
    };
}


// ==================== DISPLAY STUDENT REPORT ====================

function displayStudentReports() {

    if (!reportTableBody) {
        return;
    }


    const students =
        JSON.parse(localStorage.getItem("students")) || [];


    const searchText =
        reportSearch
            ? reportSearch.value.toLowerCase().trim()
            : "";


    const selectedSemester =
        reportSemester
            ? reportSemester.value
            : "";


    const selectedSection =
        reportSection
            ? reportSection.value
            : "";


    const selectedSubject =
        reportSubject
            ? reportSubject.value
            : "";


    reportTableBody.innerHTML = "";


    const filteredStudents =
        students.filter(function(student) {

            const matchesSearch =
                student.studentId.toLowerCase().includes(searchText) ||
                student.name.toLowerCase().includes(searchText);


            const matchesSemester =
                selectedSemester === "" ||
                student.semester === selectedSemester;


            const matchesSection =
                selectedSection === "" ||
                student.section === selectedSection;


            return (
                matchesSearch &&
                matchesSemester &&
                matchesSection
            );
        });


    if (filteredStudents.length === 0) {

        reportTableBody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align: center;">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }


    filteredStudents.forEach(function(student, index) {

        const attendance =
            calculateStudentAttendance(
                student.studentId,
                selectedSubject
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.studentId}</td>
            <td>${student.name}</td>
            <td>${student.semester}</td>
            <td>${student.section}</td>
            <td>${attendance.totalClasses}</td>
            <td>${attendance.presentClasses}</td>
            <td>${attendance.absentClasses}</td>
            <td>${attendance.percentage}%</td>
            <td>
                <span class="${attendance.status === "Eligible"
                    ? "status-eligible"
                    : "status-ng"}">
                    ${attendance.status}
                </span>
            </td>
            <td>
                <button class="view-button"
                    onclick="viewStudentReport('${student.studentId}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;


        reportTableBody.appendChild(row);
    });
}


// ==================== GENERATE REPORT ====================

function filterReports() {
    displayStudentReports();
    displaySubjectReports();
    displayLowAttendance();
}


// ==================== SEARCH REPORT ====================

if (reportSearch) {
    reportSearch.addEventListener(
        "input",
        displayStudentReports
    );
}


// ==================== SUBJECT REPORT ====================

function displaySubjectReports() {

    if (!subjectReportBody) {
        return;
    }


    const students =
        JSON.parse(localStorage.getItem("students")) || [];


    const subjects =
        JSON.parse(localStorage.getItem("subjects")) || [];


    const selectedSemester =
        reportSemester
            ? reportSemester.value
            : "";


    const selectedSection =
        reportSection
            ? reportSection.value
            : "";


    const selectedSubject =
        reportSubject
            ? reportSubject.value
            : "";


    subjectReportBody.innerHTML = "";


    let filteredSubjects =
        subjects;


    if (selectedSubject !== "") {

        filteredSubjects =
            subjects.filter(function(subject) {
                return (
                    subject.name === selectedSubject ||
                    subject.code === selectedSubject
                );
            });
    }


    filteredSubjects.forEach(function(subject, index) {

        let totalClasses = 0;
        let totalPresent = 0;
        let totalAbsent = 0;


        students.forEach(function(student) {

            if (
                selectedSemester !== "" &&
                student.semester !== selectedSemester
            ) {
                return;
            }


            if (
                selectedSection !== "" &&
                student.section !== selectedSection
            ) {
                return;
            }


            const attendance =
                calculateStudentAttendance(
                    student.studentId,
                    subject.name
                );


            totalClasses +=
                attendance.totalClasses;

            totalPresent +=
                attendance.presentClasses;

            totalAbsent +=
                attendance.absentClasses;
        });


        let percentage = 0;


        if (totalClasses > 0) {
            percentage =
                (totalPresent / totalClasses) * 100;
        }


        percentage =
            Math.round(percentage * 100) / 100;


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${subject.code}</td>
            <td>${subject.name}</td>
            <td>${totalClasses}</td>
            <td>${totalPresent}</td>
            <td>${totalAbsent}</td>
            <td>${percentage}%</td>
        `;


        subjectReportBody.appendChild(row);
    });


    if (filteredSubjects.length === 0) {

        subjectReportBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                    No subject data found.
                </td>
            </tr>
        `;
    }
}


// ==================== LOW ATTENDANCE STUDENTS ====================

function displayLowAttendance() {

    if (!lowAttendanceBody) {
        return;
    }


    const students =
        JSON.parse(localStorage.getItem("students")) || [];


    const subjects =
        JSON.parse(localStorage.getItem("subjects")) || [];


    const selectedSemester =
        reportSemester
            ? reportSemester.value
            : "";


    const selectedSection =
        reportSection
            ? reportSection.value
            : "";


    const selectedSubject =
        reportSubject
            ? reportSubject.value
            : "";


    lowAttendanceBody.innerHTML = "";


    let count = 0;


    students.forEach(function(student) {

        if (
            selectedSemester !== "" &&
            student.semester !== selectedSemester
        ) {
            return;
        }


        if (
            selectedSection !== "" &&
            student.section !== selectedSection
        ) {
            return;
        }


        subjects.forEach(function(subject) {

            if (
                selectedSubject !== "" &&
                subject.name !== selectedSubject &&
                subject.code !== selectedSubject
            ) {
                return;
            }


            const attendance =
                calculateStudentAttendance(
                    student.studentId,
                    subject.name
                );


            if (
                attendance.totalClasses > 0 &&
                attendance.percentage < 80
            ) {

                count++;


                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td>${count}</td>
                    <td>${student.studentId}</td>
                    <td>${student.name}</td>
                    <td>${subject.name}</td>
                    <td>${attendance.totalClasses}</td>
                    <td>${attendance.presentClasses}</td>
                    <td>${attendance.absentClasses}</td>
                    <td>${attendance.percentage}%</td>
                    <td>
                        <span class="status-ng">
                            NG
                        </span>
                    </td>
                `;


                lowAttendanceBody.appendChild(row);
            }
        });
    });


    if (count === 0) {

        lowAttendanceBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center;">
                    No students below 80%.
                </td>
            </tr>
        `;
    }
}


// ==================== VIEW STUDENT REPORT ====================

function viewStudentReport(studentId) {

    const students =
        JSON.parse(localStorage.getItem("students")) || [];


    const student =
        students.find(function(student) {
            return student.studentId === studentId;
        });


    if (!student) {
        return;
    }


    const records =
        getAttendanceRecords();


    let message =
        "Student: " + student.name + "\n";

    message +=
        "Student ID: " + student.studentId + "\n\n";


    const subjects =
        JSON.parse(localStorage.getItem("subjects")) || [];


    subjects.forEach(function(subject) {

        const attendance =
            calculateStudentAttendance(
                student.studentId,
                subject.name
            );


        message +=
            subject.name + ": " +
            attendance.percentage + "% - " +
            attendance.status + "\n";
    });


    alert(message);
}


// ==================== LOAD REPORTS ====================

if (reportTableBody) {
    displayStudentReports();
}

if (subjectReportBody) {
    displaySubjectReports();
}

if (lowAttendanceBody) {
    displayLowAttendance();
}

// ==================== PROFILE ====================

const adminProfileForm =
    document.getElementById("adminProfileForm");

const changePasswordForm =
    document.getElementById("changePasswordForm");


// ==================== DEFAULT ADMIN PROFILE ====================

function createAdminProfile() {

    const profile =
        localStorage.getItem("adminProfile");

    if (profile === null) {

        const defaultProfile = {
            name: "Admin",
            username: "admin",
            gmail: "admin@gmail.com",
            phone: ""
        };

        localStorage.setItem(
            "adminProfile",
            JSON.stringify(defaultProfile)
        );
    }
}

createAdminProfile();


// ==================== DISPLAY ADMIN PROFILE ====================

function displayAdminProfile() {

    if (!adminProfileForm) {
        return;
    }

    const profile =
        JSON.parse(
            localStorage.getItem("adminProfile")
        );

    if (!profile) {
        return;
    }

    document.getElementById("adminName").value =
        profile.name;

    document.getElementById("adminUsername").value =
        profile.username;

    document.getElementById("adminGmailProfile").value =
        profile.gmail;

    document.getElementById("adminPhoneProfile").value =
        profile.phone;
}


// ==================== SAVE ADMIN PROFILE ====================

if (adminProfileForm) {

    adminProfileForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("adminName").value.trim();

        const username =
            document.getElementById("adminUsername").value.trim();

        const gmail =
            document.getElementById("adminGmailProfile").value.trim();

        const phone =
            document.getElementById("adminPhoneProfile").value.trim();

        const profileMessage =
            document.getElementById("profileMessage");


        if (
            name === "" ||
            username === "" ||
            gmail === ""
        ) {

            profileMessage.textContent =
                "Please fill all required fields.";

            profileMessage.style.color = "#c0392b";

            return;
        }


        const profile = {
            name: name,
            username: username,
            gmail: gmail,
            phone: phone
        };


        localStorage.setItem(
            "adminProfile",
            JSON.stringify(profile)
        );


        profileMessage.textContent =
            "Profile updated successfully.";

        profileMessage.style.color = "#2e7d32";
    });
}


// ==================== CHANGE PASSWORD ====================

if (changePasswordForm) {

    changePasswordForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const currentPassword =
            document.getElementById("currentPassword").value;

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmNewPassword =
            document.getElementById("confirmNewPassword").value;

        const passwordMessage =
            document.getElementById("passwordMessage");


        if (
            currentPassword === "" ||
            newPassword === "" ||
            confirmNewPassword === ""
        ) {

            passwordMessage.textContent =
                "Please fill all password fields.";

            passwordMessage.style.color = "#c0392b";

            return;
        }


        const savedPassword =
            localStorage.getItem("adminPassword") ||
            "admin123";


        if (currentPassword !== savedPassword) {

            passwordMessage.textContent =
                "Current password is incorrect.";

            passwordMessage.style.color = "#c0392b";

            return;
        }


        if (newPassword.length < 6) {

            passwordMessage.textContent =
                "New password must be at least 6 characters.";

            passwordMessage.style.color = "#c0392b";

            return;
        }


        if (newPassword !== confirmNewPassword) {

            passwordMessage.textContent =
                "New passwords do not match.";

            passwordMessage.style.color = "#c0392b";

            return;
        }


        localStorage.setItem(
            "adminPassword",
            newPassword
        );


        passwordMessage.textContent =
            "Password changed successfully.";

        passwordMessage.style.color = "#2e7d32";


        changePasswordForm.reset();
    });
}


// ==================== LOAD PROFILE ====================

if (adminProfileForm) {
    displayAdminProfile();
}

// ==================== TEACHER DASHBOARD ====================

// Get logged-in teacher

function getLoggedInTeacher() {

    const teacherId =
        localStorage.getItem("loggedInUser");

    if (!teacherId) {
        return null;
    }

    const teachers =
        JSON.parse(localStorage.getItem("teachers")) || [];

    const teacher =
        teachers.find(function(teacher) {
            return teacher.teacherId === teacherId;
        });

    return teacher || null;
}


// ==================== DISPLAY TEACHER INFORMATION ====================

function displayTeacherDashboard() {

    const teacher =
        getLoggedInTeacher();

    if (!teacher) {
        return;
    }


    const teacherNameDisplay =
        document.getElementById("teacherNameDisplay");

    const teacherWelcomeName =
        document.getElementById("teacherWelcomeName");

    const teacherSubjectDisplay =
        document.getElementById("teacherSubjectDisplay");


    if (teacherNameDisplay) {
        teacherNameDisplay.textContent =
            teacher.name;
    }


    if (teacherWelcomeName) {
        teacherWelcomeName.textContent =
            teacher.name;
    }


    if (teacherSubjectDisplay) {
        teacherSubjectDisplay.textContent =
            teacher.subject;
    }
}


// ==================== TEACHER CLASSES ====================

function getTeacherClasses() {

    const teacher =
        getLoggedInTeacher();

    if (!teacher) {
        return [];
    }


    const classes =
        JSON.parse(localStorage.getItem("classes")) || [];


    return classes.filter(function(classItem) {

        return classItem.teacher === teacher.name;
    });
}


// ==================== TEACHER STUDENTS ====================

function getTeacherStudents() {

    const teacherClasses =
        getTeacherClasses();


    const students =
        JSON.parse(localStorage.getItem("students")) || [];


    let teacherStudents = [];


    teacherClasses.forEach(function(classItem) {

        const classStudents =
            students.filter(function(student) {

                return (
                    student.semester === classItem.semester &&
                    student.section === classItem.section
                );
            });


        classStudents.forEach(function(student) {

            const alreadyAdded =
                teacherStudents.some(function(existingStudent) {

                    return (
                        existingStudent.studentId ===
                        student.studentId
                    );
                });


            if (!alreadyAdded) {
                teacherStudents.push(student);
            }
        });
    });


    return teacherStudents;
}


// ==================== ATTENDANCE RECORDS ====================

function getTeacherAttendanceRecords() {

    const teacher =
        getLoggedInTeacher();

    if (!teacher) {
        return [];
    }


    const records =
        JSON.parse(
            localStorage.getItem("attendanceRecords")
        ) || [];


    return records.filter(function(record) {

        return record.teacher === teacher.name;
    });
}


// ==================== DISPLAY DASHBOARD STATISTICS ====================

function displayTeacherDashboardStats() {

    const teacherClasses =
        getTeacherClasses();


    const teacherStudents =
        getTeacherStudents();


    const attendanceRecords =
        getTeacherAttendanceRecords();


    const teacherClassCount =
        document.getElementById("teacherClassCount");

    const teacherStudentCount =
        document.getElementById("teacherStudentCount");

    const teacherAttendanceCount =
        document.getElementById("teacherAttendanceCount");

    const teacherSubjectCount =
        document.getElementById("teacherSubjectCount");


    if (teacherClassCount) {
        teacherClassCount.textContent =
            teacherClasses.length;
    }


    if (teacherStudentCount) {
        teacherStudentCount.textContent =
            teacherStudents.length;
    }


    if (teacherAttendanceCount) {
        teacherAttendanceCount.textContent =
            attendanceRecords.length;
    }


    if (teacherSubjectCount) {

        const teacher =
            getLoggedInTeacher();

        if (teacher) {
            teacherSubjectCount.textContent = "1";
        } else {
            teacherSubjectCount.textContent = "0";
        }
    }
}


// ==================== DISPLAY TODAY'S CLASSES ====================

function displayTeacherDashboardClasses() {

    const tableBody =
        document.getElementById("teacherClassTableBody");

    if (!tableBody) {
        return;
    }


    const teacherClasses =
        getTeacherClasses();


    tableBody.innerHTML = "";


    if (teacherClasses.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    No classes assigned.
                </td>
            </tr>
        `;

        return;
    }


    teacherClasses.forEach(function(classItem, index) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${classItem.subject}</td>
            <td>${classItem.semester}</td>
            <td>${classItem.section}</td>
            <td>${classItem.period}</td>
            <td>${classItem.room}</td>
        `;


        tableBody.appendChild(row);
    });
}


// ==================== DISPLAY RECENT ATTENDANCE ====================

function displayTeacherRecentAttendance() {

    const tableBody =
        document.getElementById(
            "teacherAttendanceHistoryBody"
        );


    if (!tableBody) {
        return;
    }


    const attendanceRecords =
        getTeacherAttendanceRecords();


    tableBody.innerHTML = "";


    if (attendanceRecords.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    No attendance taken yet.
                </td>
            </tr>
        `;

        return;
    }


    const recentRecords =
        [...attendanceRecords].reverse().slice(0, 5);


    recentRecords.forEach(function(record) {

        const totalStudents =
            record.students.length;


        const totalPresent =
            record.students.filter(function(student) {

                return student.status === "present";

            }).length;


        const totalAbsent =
            totalStudents - totalPresent;


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.subject}</td>
            <td>${record.semester}</td>
            <td>${record.section}</td>
            <td>${totalPresent}</td>
            <td>${totalAbsent}</td>
        `;


        tableBody.appendChild(row);
    });
}


// ==================== TEACHER LOGOUT ====================

function teacherLogout() {

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");

    window.location.href = "index.html";
}


// ==================== LOAD TEACHER DASHBOARD ====================

if (
    document.getElementById("teacherClassTableBody") ||
    document.getElementById("teacherNameDisplay")
) {

    displayTeacherDashboard();

    displayTeacherDashboardStats();

    displayTeacherDashboardClasses();

    displayTeacherRecentAttendance();
}

// ==================== TEACHER MY CLASSES ====================

const teacherClassesTableBody =
    document.getElementById("teacherClassesTableBody");

const teacherClassSearch =
    document.getElementById("teacherClassSearch");

const teacherClassSemester =
    document.getElementById("teacherClassSemester");

const teacherClassSection =
    document.getElementById("teacherClassSection");


// ==================== DISPLAY MY CLASSES ====================

function displayMyClasses() {

    if (!teacherClassesTableBody) {
        return;
    }


    const teacher =
        getLoggedInTeacher();


    if (!teacher) {
        return;
    }


    const classes =
        JSON.parse(localStorage.getItem("classes")) || [];


    const searchText =
        teacherClassSearch
            ? teacherClassSearch.value.toLowerCase().trim()
            : "";


    const selectedSemester =
        teacherClassSemester
            ? teacherClassSemester.value
            : "";


    const selectedSection =
        teacherClassSection
            ? teacherClassSection.value
            : "";


    const teacherClasses =
        classes.filter(function(classItem) {

            const isMyClass =
                classItem.teacher === teacher.name;


            const matchesSearch =
                classItem.subject.toLowerCase().includes(searchText) ||
                classItem.semester.toLowerCase().includes(searchText) ||
                classItem.section.toLowerCase().includes(searchText) ||
                classItem.period.toLowerCase().includes(searchText) ||
                classItem.room.toLowerCase().includes(searchText);


            const matchesSemester =
                selectedSemester === "" ||
                classItem.semester === selectedSemester;


            const matchesSection =
                selectedSection === "" ||
                classItem.section === selectedSection;


            return (
                isMyClass &&
                matchesSearch &&
                matchesSemester &&
                matchesSection
            );
        });


    teacherClassesTableBody.innerHTML = "";


    if (teacherClasses.length === 0) {

        teacherClassesTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    No classes found.
                </td>
            </tr>
        `;

        return;
    }


    teacherClasses.forEach(function(classItem, index) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${classItem.subject}</td>
            <td>${classItem.semester}</td>
            <td>${classItem.section}</td>
            <td>${classItem.period}</td>
            <td>${classItem.room}</td>
        `;


        teacherClassesTableBody.appendChild(row);
    });
}


// ==================== CLASS SEARCH ====================

if (teacherClassSearch) {

    teacherClassSearch.addEventListener(
        "input",
        displayMyClasses
    );
}


// ==================== CLASS SEMESTER FILTER ====================

if (teacherClassSemester) {

    teacherClassSemester.addEventListener(
        "change",
        displayMyClasses
    );
}


// ==================== CLASS SECTION FILTER ====================

if (teacherClassSection) {

    teacherClassSection.addEventListener(
        "change",
        displayMyClasses
    );
}


// ==================== LOAD MY CLASSES ====================

if (teacherClassesTableBody) {
    displayMyClasses();
}

// ==================== TEACHER TAKE ATTENDANCE ====================

const teacherAttendanceDate =
    document.getElementById("teacherAttendanceDate");

const teacherAttendanceSubject =
    document.getElementById("teacherAttendanceSubject");

const teacherAttendanceSemester =
    document.getElementById("teacherAttendanceSemester");

const teacherAttendanceSection =
    document.getElementById("teacherAttendanceSection");

const teacherAttendancePeriod =
    document.getElementById("teacherAttendancePeriod");

const teacherAttendanceRoom =
    document.getElementById("teacherAttendanceRoom");

const teacherAttendanceTableBody =
    document.getElementById("teacherAttendanceTableBody");

const teacherAttendanceListCard =
    document.getElementById("teacherAttendanceListCard");

const teacherPresentCount =
    document.getElementById("teacherPresentCount");

const teacherAttendanceMessage =
    document.getElementById("teacherAttendanceMessage");

const teacherSaveMessage =
    document.getElementById("teacherSaveMessage");


// ==================== CURRENT ATTENDANCE ====================

let teacherCurrentAttendance = [];


// ==================== SET TODAY'S DATE ====================

if (teacherAttendanceDate) {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");


    teacherAttendanceDate.value =
        `${year}-${month}-${day}`;
}


// ==================== LOAD TEACHER CLASS OPTIONS ====================

function loadTeacherClassOptions() {

    const teacher =
        getLoggedInTeacher();

    if (!teacher) {
        return;
    }


    const classes =
        JSON.parse(localStorage.getItem("classes")) || [];


    const teacherClasses =
        classes.filter(function(classItem) {

            return classItem.teacher === teacher.name;
        });


    if (teacherAttendanceSubject) {

        teacherAttendanceSubject.innerHTML = `
            <option value="">
                Select subject
            </option>
        `;

        teacherClasses.forEach(function(classItem) {

            const option =
                document.createElement("option");

            option.value =
                classItem.subject;

            option.textContent =
                classItem.subject;

            teacherAttendanceSubject.appendChild(option);
        });
    }


    if (teacherAttendanceSemester) {

        teacherAttendanceSemester.innerHTML = `
            <option value="">
                Select semester
            </option>
        `;

        const semesters = [];


        teacherClasses.forEach(function(classItem) {

            if (!semesters.includes(classItem.semester)) {

                semesters.push(classItem.semester);
            }
        });


        semesters.forEach(function(semester) {

            const option =
                document.createElement("option");

            option.value =
                semester;

            option.textContent =
                semester + " Semester";

            teacherAttendanceSemester.appendChild(option);
        });
    }


    if (teacherAttendanceSection) {

        teacherAttendanceSection.innerHTML = `
            <option value="">
                Select section
            </option>
        `;

        const sections = [];


        teacherClasses.forEach(function(classItem) {

            if (!sections.includes(classItem.section)) {

                sections.push(classItem.section);
            }
        });


        sections.forEach(function(section) {

            const option =
                document.createElement("option");

            option.value =
                section;

            option.textContent =
                "Section " + section;

            teacherAttendanceSection.appendChild(option);
        });
    }


    if (teacherAttendanceRoom) {

        teacherAttendanceRoom.innerHTML = `
            <option value="">
                Select room
            </option>
        `;

        const rooms = [];


        teacherClasses.forEach(function(classItem) {

            if (!rooms.includes(classItem.room)) {

                rooms.push(classItem.room);
            }
        });


        rooms.forEach(function(room) {

            const option =
                document.createElement("option");

            option.value =
                room;

            option.textContent =
                room;

            teacherAttendanceRoom.appendChild(option);
        });
    }
}


// ==================== LOAD STUDENTS ====================

function loadTeacherAttendanceStudents() {

    if (!teacherAttendanceTableBody) {
        return;
    }


    const subject =
        teacherAttendanceSubject.value;

    const semester =
        teacherAttendanceSemester.value;

    const section =
        teacherAttendanceSection.value;

    const period =
        teacherAttendancePeriod.value;

    const room =
        teacherAttendanceRoom.value;

    const date =
        teacherAttendanceDate.value;


    if (
        subject === "" ||
        semester === "" ||
        section === "" ||
        period === "" ||
        room === "" ||
        date === ""
    ) {

        teacherAttendanceMessage.textContent =
            "Please select all attendance details.";

        teacherAttendanceMessage.style.color =
            "#c0392b";

        return;
    }


    const teacher =
        getLoggedInTeacher();


    if (!teacher) {

        teacherAttendanceMessage.textContent =
            "Teacher information not found.";

        teacherAttendanceMessage.style.color =
            "#c0392b";

        return;
    }


    const classes =
        JSON.parse(localStorage.getItem("classes")) || [];


    const validClass =
        classes.find(function(classItem) {

            return (
                classItem.teacher === teacher.name &&
                classItem.subject === subject &&
                classItem.semester === semester &&
                classItem.section === section &&
                classItem.period === period &&
                classItem.room === room
            );
        });


    if (!validClass) {

        teacherAttendanceMessage.textContent =
            "This class is not assigned to you.";

        teacherAttendanceMessage.style.color =
            "#c0392b";

        return;
    }


    const students =
        JSON.parse(localStorage.getItem("students")) || [];


    const classStudents =
        students.filter(function(student) {

            return (
                student.semester === semester &&
                student.section === section
            );
        });


    if (classStudents.length === 0) {

        teacherAttendanceMessage.textContent =
            "No students found for this class.";

        teacherAttendanceMessage.style.color =
            "#c0392b";

        return;
    }


    // Check duplicate attendance

    const records =
        JSON.parse(
            localStorage.getItem("attendanceRecords")
        ) || [];


    const alreadySaved =
        records.some(function(record) {

            return (
                record.date === date &&
                record.subject === subject &&
                record.semester === semester &&
                record.section === section &&
                record.period === period
            );
        });


    if (alreadySaved) {

        teacherAttendanceMessage.textContent =
            "Attendance for this class is already saved.";

        teacherAttendanceMessage.style.color =
            "#c0392b";

        return;
    }


    teacherCurrentAttendance = [];


    classStudents.forEach(function(student) {

        teacherCurrentAttendance.push({

            studentId: student.studentId,

            name: student.name,

            status: "present"

        });
    });


    displayTeacherAttendanceStudents();


    teacherAttendanceMessage.textContent =
        "Students loaded successfully.";

    teacherAttendanceMessage.style.color =
        "#2e7d32";
}


// ==================== DISPLAY STUDENTS ====================

function displayTeacherAttendanceStudents() {

    if (!teacherAttendanceTableBody) {
        return;
    }


    teacherAttendanceTableBody.innerHTML = "";


    teacherCurrentAttendance.forEach(
        function(student, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>${index + 1}</td>

                <td>${student.studentId}</td>

                <td>${student.name}</td>

                <td>

                    <button
                        class="attendance-present ${
                            student.status === "present"
                                ? "active"
                                : ""
                        }"
                        onclick="setTeacherAttendance(
                            ${index},
                            'present',
                            this
                        )">
                        Present
                    </button>

                    <button
                        class="attendance-absent ${
                            student.status === "absent"
                                ? "active"
                                : ""
                        }"
                        onclick="setTeacherAttendance(
                            ${index},
                            'absent',
                            this
                        )">
                        Absent
                    </button>

                </td>
            `;


            teacherAttendanceTableBody.appendChild(row);
        }
    );


    updateTeacherPresentCount();


    if (teacherAttendanceListCard) {

        teacherAttendanceListCard.style.display =
            "block";
    }
}


// ==================== SET ATTENDANCE ====================

function setTeacherAttendance(
    studentIndex,
    status,
    button
) {

    if (!teacherCurrentAttendance[studentIndex]) {
        return;
    }


    teacherCurrentAttendance[studentIndex].status =
        status;


    const row =
        button.closest("tr");


    const buttons =
        row.querySelectorAll("button");


    buttons.forEach(function(button) {

        button.classList.remove("active");

    });


    button.classList.add("active");


    updateTeacherPresentCount();
}


// ==================== UPDATE PRESENT COUNT ====================

function updateTeacherPresentCount() {

    if (!teacherPresentCount) {
        return;
    }


    const total =
        teacherCurrentAttendance.length;


    const present =
        teacherCurrentAttendance.filter(
            function(student) {

                return student.status === "present";

            }
        ).length;


    teacherPresentCount.textContent =
        present + " / " + total;
}


// ==================== SAVE TEACHER ATTENDANCE ====================

function saveTeacherAttendance() {

    if (teacherCurrentAttendance.length === 0) {

        teacherSaveMessage.textContent =
            "Please load students first.";

        teacherSaveMessage.style.color =
            "#c0392b";

        return;
    }


    const teacher =
        getLoggedInTeacher();


    if (!teacher) {
        return;
    }


    const date =
        teacherAttendanceDate.value;

    const subject =
        teacherAttendanceSubject.value;

    const semester =
        teacherAttendanceSemester.value;

    const section =
        teacherAttendanceSection.value;

    const period =
        teacherAttendancePeriod.value;


    let records =
        JSON.parse(
            localStorage.getItem("attendanceRecords")
        ) || [];


    const alreadySaved =
        records.some(function(record) {

            return (
                record.date === date &&
                record.subject === subject &&
                record.semester === semester &&
                record.section === section &&
                record.period === period
            );
        });


    if (alreadySaved) {

        teacherSaveMessage.textContent = "Attendance has already been saved.";

        teacherSaveMessage.style.color = "#c0392b";

        return;
    }


    const newRecord = {

        id: Date.now(),

        date: date,

        subject: subject,

        semester: semester,

        section: section,

        period: period,

        teacher: teacher.name,

        students:
            teacherCurrentAttendance.map(
                function(student) {

                    return {
                        studentId: student.studentId,
                        name: student.name,
                        status: student.status
                    };

                }
            )
    };


    records.push(newRecord);


    localStorage.setItem(
        "attendanceRecords",
        JSON.stringify(records)
    );


    teacherSaveMessage.textContent = "Attendance saved successfully.";

    teacherSaveMessage.style.color = "#2e7d32";


    teacherCurrentAttendance = [];

    teacherAttendanceTableBody.innerHTML = "";


    if (teacherAttendanceListCard) {

        teacherAttendanceListCard.style.display = "none";
    }


    updateTeacherPresentCount();
}


// ==================== LOAD TEACHER ATTENDANCE PAGE ====================

if (teacherAttendanceSubject) {

    loadTeacherClassOptions();
}

// ==================== TEACHER ATTENDANCE HISTORY ====================

const teacherHistoryTableBody =
    document.getElementById("teacherHistoryTableBody");

const teacherHistorySearch =
    document.getElementById("teacherHistorySearch");

const teacherHistorySubject =
    document.getElementById("teacherHistorySubject");

const teacherHistorySemester =
    document.getElementById("teacherHistorySemester");

const teacherHistorySection =
    document.getElementById("teacherHistorySection");


// ==================== LOAD HISTORY SUBJECTS ====================

function loadTeacherHistorySubjects() {

    if (!teacherHistorySubject) {
        return;
    }


    const teacher =
        getLoggedInTeacher();

    if (!teacher) {
        return;
    }


    const records =
        getTeacherAttendanceRecords();


    const subjects = [];


    records.forEach(function(record) {

        if (!subjects.includes(record.subject)) {

            subjects.push(record.subject);
        }
    });


    subjects.forEach(function(subject) {

        const option =
            document.createElement("option");

        option.value = subject;
        option.textContent = subject;

        teacherHistorySubject.appendChild(option);
    });
}


// ==================== DISPLAY ATTENDANCE HISTORY ====================

function displayTeacherHistory() {

    if (!teacherHistoryTableBody) {
        return;
    }


    const records =
        getTeacherAttendanceRecords();


    const searchText =
        teacherHistorySearch
            ? teacherHistorySearch.value.toLowerCase().trim()
            : "";


    const selectedSubject =
        teacherHistorySubject
            ? teacherHistorySubject.value
            : "";


    const selectedSemester =
        teacherHistorySemester
            ? teacherHistorySemester.value
            : "";


    const selectedSection =
        teacherHistorySection
            ? teacherHistorySection.value
            : "";


    const filteredRecords =
        records.filter(function(record) {

            const matchesSearch =
                record.date.toLowerCase().includes(searchText) ||
                record.subject.toLowerCase().includes(searchText) ||
                record.period.toLowerCase().includes(searchText);


            const matchesSubject =
                selectedSubject === "" ||
                record.subject === selectedSubject;


            const matchesSemester =
                selectedSemester === "" ||
                record.semester === selectedSemester;


            const matchesSection =
                selectedSection === "" ||
                record.section === selectedSection;


            return (
                matchesSearch &&
                matchesSubject &&
                matchesSemester &&
                matchesSection
            );
        });


    teacherHistoryTableBody.innerHTML = "";


    if (filteredRecords.length === 0) {

        teacherHistoryTableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center;">
                    No attendance history found.
                </td>
            </tr>
        `;

        return;
    }


    const reversedRecords =
        [...filteredRecords].reverse();


    reversedRecords.forEach(function(record, index) {

        const totalStudents =
            record.students.length;


        const totalPresent =
            record.students.filter(function(student) {

                return student.status === "present";

            }).length;


        const totalAbsent =
            totalStudents - totalPresent;


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${record.date}</td>
            <td>${record.subject}</td>
            <td>${record.semester}</td>
            <td>${record.section}</td>
            <td>${record.period}</td>
            <td>${totalPresent}</td>
            <td>${totalAbsent}</td>
            <td>
                <button
                    class="teacher-history-action"
                    onclick="viewTeacherAttendance(${record.id})">

                    <i class="fas fa-eye"></i>

                </button>
            </td>
        `;


        teacherHistoryTableBody.appendChild(row);
    });
}


// ==================== VIEW ATTENDANCE ====================

function viewTeacherAttendance(recordId) {

    const records =
        getTeacherAttendanceRecords();


    const record =
        records.find(function(record) {

            return record.id === recordId;
        });


    if (!record) {
        return;
    }


    let message =
        "Date: " + record.date + "\n";

    message +=
        "Subject: " + record.subject + "\n";

    message +=
        "Semester: " + record.semester + "\n";

    message +=
        "Section: " + record.section + "\n";

    message +=
        "Period: " + record.period + "\n\n";


    record.students.forEach(function(student, index) {

        message +=
            (index + 1) + ". " +
            student.studentId + " - " +
            student.name + " - " +
            student.status.toUpperCase() + "\n";
    });


    alert(message);
}


// ==================== HISTORY SEARCH ====================

if (teacherHistorySearch) {

    teacherHistorySearch.addEventListener(
        "input",
        displayTeacherHistory
    );
}


// ==================== HISTORY SUBJECT FILTER ====================

if (teacherHistorySubject) {

    teacherHistorySubject.addEventListener(
        "change",
        displayTeacherHistory
    );
}


// ==================== HISTORY SEMESTER FILTER ====================

if (teacherHistorySemester) {

    teacherHistorySemester.addEventListener(
        "change",
        displayTeacherHistory
    );
}


// ==================== HISTORY SECTION FILTER ====================

if (teacherHistorySection) {

    teacherHistorySection.addEventListener(
        "change",
        displayTeacherHistory
    );
}


// ==================== LOAD TEACHER HISTORY ====================

if (teacherHistoryTableBody) {

    loadTeacherHistorySubjects();

    displayTeacherHistory();
}

// ==================== TEACHER STUDENTS ====================

const teacherStudentTableBody =
    document.getElementById("teacherStudentsTableBody");

const teacherStudentSearch =
    document.getElementById("teacherStudentSearch");

const teacherStudentSemester =
    document.getElementById("teacherStudentSemester");

const teacherStudentSection =
    document.getElementById("teacherStudentSection");

const teacherStudentTotal =
    document.getElementById("teacherStudentTotal");

function displayTeacherStudents() {
    if (!teacherStudentTableBody) {
        return;
    }

    const students =
        getTeacherStudents();

    const searchText =
        teacherStudentSearch ?
        teacherStudentSearch.value.toLowerCase().trim() :
        "";

    const semester =
        teacherStudentSemester ?
        teacherStudentSemester.value :
        "";

    const section =
        teacherStudentSection ?
        teacherStudentSection.value :
        "";

    const filteredStudents =
        students.filter(function(student) {
            const matchesSearch =
                student.studentId.toLowerCase().includes(searchText) ||
                student.name.toLowerCase().includes(searchText);

            const matchesSemester =
                semester === "" ||
                student.semester === semester;

            const matchesSection =
                section === "" ||
                student.section === section;

            return (
                matchesSearch &&
                matchesSemester &&
                matchesSection
            );
        });

    teacherStudentTableBody.innerHTML = "";

    if (teacherStudentTotal) {
        teacherStudentTotal.textContent =
            filteredStudents.length + " Students";
    }

    if (filteredStudents.length === 0) {
        teacherStudentTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }

    filteredStudents.forEach(function(student, index) {
        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.studentId}</td>
            <td>${student.name}</td>
            <td>${student.semester}</td>
            <td>${student.section}</td>
            <td>${student.gmail}</td>
            <td>${student.phone}</td>
        `;

        teacherStudentTableBody.appendChild(row);
    });
}

if (teacherStudentSearch) {
    teacherStudentSearch.addEventListener(
        "input",
        displayTeacherStudents
    );
}

if (teacherStudentSemester) {
    teacherStudentSemester.addEventListener(
        "change",
        displayTeacherStudents
    );
}

if (teacherStudentSection) {
    teacherStudentSection.addEventListener(
        "change",
        displayTeacherStudents
    );
}

if (teacherStudentTableBody) {
    const teacher =
        getLoggedInTeacher();

    if (teacher) {
        const teacherNameDisplay =
            document.getElementById("teacherNameDisplay");

        if (teacherNameDisplay) {
            teacherNameDisplay.textContent =
                teacher.name;
        }
    }

    displayTeacherStudents();
}

// ==================== TEACHER PROFILE ====================

const teacherProfileForm =
    document.getElementById("teacherProfileForm");

const teacherPasswordForm =
    document.getElementById("teacherPasswordForm");

function displayTeacherProfile() {
    const teacher =
        getLoggedInTeacher();

    if (!teacher) {
        return;
    }

    const teacherNameDisplay =
        document.getElementById("teacherNameDisplay");

    const teacherProfileName =
        document.getElementById("teacherProfileName");

    const teacherProfileId =
        document.getElementById("teacherProfileId");

    const teacherProfileSubject =
        document.getElementById("teacherProfileSubject");

    const teacherProfileGmail =
        document.getElementById("teacherProfileGmail");

    const teacherProfilePhone =
        document.getElementById("teacherProfilePhone");

    const teacherProfileNameInput =
        document.getElementById("teacherProfileNameInput");

    const teacherProfileGmailInput =
        document.getElementById("teacherProfileGmailInput");

    const teacherProfilePhoneInput =
        document.getElementById("teacherProfilePhoneInput");

    if (teacherNameDisplay) {
        teacherNameDisplay.textContent =
            teacher.name;
    }

    if (teacherProfileName) {
        teacherProfileName.textContent =
            teacher.name;
    }

    if (teacherProfileId) {
        teacherProfileId.textContent =
            teacher.teacherId;
    }

    if (teacherProfileSubject) {
        teacherProfileSubject.textContent =
            teacher.subject;
    }

    if (teacherProfileGmail) {
        teacherProfileGmail.textContent =
            teacher.gmail;
    }

    if (teacherProfilePhone) {
        teacherProfilePhone.textContent =
            teacher.phone;
    }

    if (teacherProfileNameInput) {
        teacherProfileNameInput.value =
            teacher.name;
    }

    if (teacherProfileGmailInput) {
        teacherProfileGmailInput.value =
            teacher.gmail;
    }

    if (teacherProfilePhoneInput) {
        teacherProfilePhoneInput.value =
            teacher.phone;
    }
}

if (teacherProfileForm) {
    teacherProfileForm.addEventListener(
        "submit",
        function(event) {
            event.preventDefault();

            const teacher =
                getLoggedInTeacher();

            if (!teacher) {
                return;
            }

            const name =
                document.getElementById(
                    "teacherProfileNameInput"
                ).value.trim();

            const gmail =
                document.getElementById(
                    "teacherProfileGmailInput"
                ).value.trim();

            const phone =
                document.getElementById(
                    "teacherProfilePhoneInput"
                ).value.trim();

            const message =
                document.getElementById(
                    "teacherProfileMessage"
                );

            if (name === "" || gmail === "") {
                message.textContent =
                    "Please fill all required fields.";

                message.style.color = "#c0392b";
                return;
            }

            const teachers =
                JSON.parse(
                    localStorage.getItem("teachers")
                ) || [];

            const teacherIndex =
                teachers.findIndex(function(item) {
                    return (
                        item.teacherId ===
                        teacher.teacherId
                    );
                });

            if (teacherIndex === -1) {
                return;
            }

            teachers[teacherIndex].name =
                name;

            teachers[teacherIndex].gmail =
                gmail;

            teachers[teacherIndex].phone =
                phone;

            localStorage.setItem(
                "teachers",
                JSON.stringify(teachers)
            );

            message.textContent =
                "Profile updated successfully.";

            message.style.color = "#2e7d32";

            displayTeacherProfile();
        }
    );
}

if (teacherPasswordForm) {
    teacherPasswordForm.addEventListener(
        "submit",
        function(event) {
            event.preventDefault();

            const teacher =
                getLoggedInTeacher();

            if (!teacher) {
                return;
            }

            const currentPassword =
                document.getElementById(
                    "teacherCurrentPassword"
                ).value;

            const newPassword =
                document.getElementById(
                    "teacherNewPassword"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "teacherConfirmPassword"
                ).value;

            const message =
                document.getElementById(
                    "teacherPasswordMessage"
                );

            if (
                currentPassword === "" ||
                newPassword === "" ||
                confirmPassword === ""
            ) {
                message.textContent =
                    "Please fill all password fields.";

                message.style.color = "#c0392b";
                return;
            }

            if (
                currentPassword !==
                teacher.password
            ) {
                message.textContent =
                    "Current password is incorrect.";

                message.style.color = "#c0392b";
                return;
            }

            if (newPassword.length < 6) {
                message.textContent =
                    "New password must be at least 6 characters.";

                message.style.color = "#c0392b";
                return;
            }

            if (
                newPassword !==
                confirmPassword
            ) {
                message.textContent =
                    "New passwords do not match.";

                message.style.color = "#c0392b";
                return;
            }

            const teachers =
                JSON.parse(
                    localStorage.getItem("teachers")
                ) || [];

            const teacherIndex =
                teachers.findIndex(function(item) {
                    return (
                        item.teacherId ===
                        teacher.teacherId
                    );
                });

            if (teacherIndex === -1) {
                return;
            }

            teachers[teacherIndex].password =
                newPassword;

            localStorage.setItem(
                "teachers",
                JSON.stringify(teachers)
            );

            message.textContent =
                "Password changed successfully.";

            message.style.color = "#2e7d32";

            teacherPasswordForm.reset();
        }
    );
}

if (
    teacherProfileForm ||
    teacherPasswordForm
) {
    displayTeacherProfile();
}

// ==================== STUDENT ATTENDANCE ====================

function displayMyAttendance() {
    const tableBody =
        document.getElementById(
            "myAttendanceTableBody"
        );

    if (!tableBody) {
        return;
    }

    const student =
        getLoggedInStudent();

    if (!student) {
        return;
    }

    const records =
        getStudentAttendanceRecords();

    const attendanceStudentName =
        document.getElementById(
            "attendanceStudentName"
        );

    const attendanceStudentId =
        document.getElementById(
            "attendanceStudentId"
        );

    const attendanceStudentSemester =
        document.getElementById(
            "attendanceStudentSemester"
        );

    const attendanceStudentSection =
        document.getElementById(
            "attendanceStudentSection"
        );

    if (attendanceStudentName) {
        attendanceStudentName.textContent =
            student.name;
    }

    if (attendanceStudentId) {
        attendanceStudentId.textContent =
            student.studentId;
    }

    if (attendanceStudentSemester) {
        attendanceStudentSemester.textContent =
            student.semester;
    }

    if (attendanceStudentSection) {
        attendanceStudentSection.textContent =
            student.section;
    }

    let totalClasses = 0;
    let totalPresent = 0;

    const subjects = [];

    records.forEach(function(record) {

        if (!subjects.includes(record.subject)) {
            subjects.push(record.subject);
        }

        const studentRecord =
            record.students.find(function(item) {
                return (
                    item.studentId ===
                    student.studentId
                );
            });

        if (studentRecord) {
            totalClasses++;

            if (
                studentRecord.status ===
                "present"
            ) {
                totalPresent++;
            }
        }
    });

    const totalAbsent =
        totalClasses - totalPresent;

    let overallPercentage = 0;

    if (totalClasses > 0) {
        overallPercentage =
            (totalPresent / totalClasses) * 100;
    }

    document.getElementById(
        "myAttendanceTotal"
    ).textContent = totalClasses;

    document.getElementById(
        "myAttendancePresent"
    ).textContent = totalPresent;

    document.getElementById(
        "myAttendanceAbsent"
    ).textContent = totalAbsent;

    document.getElementById(
        "myAttendancePercentage"
    ).textContent =
        overallPercentage.toFixed(1) + "%";

    tableBody.innerHTML = "";

    if (subjects.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                    No attendance data available.
                </td>
            </tr>
        `;

        return;
    }

    subjects.forEach(function(subject, index) {

        const subjectRecords =
            records.filter(function(record) {
                return record.subject === subject;
            });

        let subjectTotal = 0;
        let subjectPresent = 0;

        subjectRecords.forEach(function(record) {

            const studentRecord =
                record.students.find(function(item) {
                    return (
                        item.studentId ===
                        student.studentId
                    );
                });

            if (studentRecord) {
                subjectTotal++;

                if (
                    studentRecord.status ===
                    "present"
                ) {
                    subjectPresent++;
                }
            }
        });

        const subjectAbsent =
            subjectTotal - subjectPresent;

        let subjectPercentage = 0;

        if (subjectTotal > 0) {
            subjectPercentage =
                (subjectPresent / subjectTotal) * 100;
        }

        const status =
            subjectPercentage >= 80 ?
            "Eligible" :
            "NG";

        const statusClass =
            subjectPercentage >= 80 ?
            "status-eligible" :
            "status-ng";

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${subject}</td>
            <td>${subjectTotal}</td>
            <td>${subjectPresent}</td>
            <td>${subjectAbsent}</td>
            <td>${subjectPercentage.toFixed(1)}%</td>
            <td>
                <span class="${statusClass}">
                    ${status}
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

if (
    document.getElementById(
        "myAttendanceTableBody"
    )
) {
    displayMyAttendance();
}

// ==================== STUDENT ATTENDANCE HISTORY ====================

const studentHistoryTableBody =
    document.getElementById(
        "studentHistoryTableBody"
    );

const studentHistorySearch =
    document.getElementById(
        "studentHistorySearch"
    );

const studentHistorySubject =
    document.getElementById(
        "studentHistorySubject"
    );

const studentHistoryStatus =
    document.getElementById(
        "studentHistoryStatus"
    );

const studentHistoryTotal =
    document.getElementById(
        "studentHistoryTotal"
    );

function loadStudentHistorySubjects() {
    if (!studentHistorySubject) {
        return;
    }

    const records =
        getStudentAttendanceRecords();

    const subjects = [];

    records.forEach(function(record) {
        if (!subjects.includes(record.subject)) {
            subjects.push(record.subject);
        }
    });

    studentHistorySubject.innerHTML =
        '<option value="">All Subjects</option>';

    subjects.forEach(function(subject) {
        const option =
            document.createElement("option");

        option.value = subject;
        option.textContent = subject;

        studentHistorySubject.appendChild(option);
    });
}

function displayStudentHistory() {
    if (!studentHistoryTableBody) {
        return;
    }

    const student =
        getLoggedInStudent();

    if (!student) {
        return;
    }

    const records =
        getStudentAttendanceRecords();

    const searchText =
        studentHistorySearch.value
            .toLowerCase()
            .trim();

    const selectedSubject =
        studentHistorySubject.value;

    const selectedStatus =
        studentHistoryStatus.value;

    const history = [];

    records.forEach(function(record) {

        const studentRecord =
            record.students.find(function(item) {
                return (
                    item.studentId ===
                    student.studentId
                );
            });

        if (!studentRecord) {
            return;
        }

        history.push({
            date: record.date,
            subject: record.subject,
            period: record.period,
            teacher: record.teacher,
            status: studentRecord.status
        });
    });

    const filteredHistory =
        history.filter(function(record) {

            const matchesSearch =
                record.date
                    .toLowerCase()
                    .includes(searchText) ||
                record.subject
                    .toLowerCase()
                    .includes(searchText);

            const matchesSubject =
                selectedSubject === "" ||
                record.subject === selectedSubject;

            const matchesStatus =
                selectedStatus === "" ||
                record.status === selectedStatus;

            return (
                matchesSearch &&
                matchesSubject &&
                matchesStatus
            );
        });

    filteredHistory.sort(function(a, b) {
        return b.date.localeCompare(a.date);
    });

    studentHistoryTableBody.innerHTML = "";

    if (studentHistoryTotal) {
        studentHistoryTotal.textContent =
            filteredHistory.length + " Records";
    }

    if (filteredHistory.length === 0) {
        studentHistoryTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    No attendance records found.
                </td>
            </tr>
        `;

        return;
    }

    filteredHistory.forEach(function(record, index) {

        const statusText =
            record.status === "present" ?
            "Present" :
            "Absent";

        const statusClass =
            record.status === "present" ?
            "student-history-present" :
            "student-history-absent";

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${record.date}</td>
            <td>${record.subject}</td>
            <td>${record.period}</td>
            <td>${record.teacher}</td>
            <td>
                <span class="${statusClass}">
                    ${statusText}
                </span>
            </td>
        `;

        studentHistoryTableBody.appendChild(row);
    });
}

if (studentHistorySearch) {
    studentHistorySearch.addEventListener(
        "input",
        displayStudentHistory
    );
}

if (studentHistorySubject) {
    studentHistorySubject.addEventListener(
        "change",
        displayStudentHistory
    );
}

if (studentHistoryStatus) {
    studentHistoryStatus.addEventListener(
        "change",
        displayStudentHistory
    );
}

if (studentHistoryTableBody) {
    const student =
        getLoggedInStudent();

    if (student) {
        const studentNameDisplay =
            document.getElementById(
                "studentNameDisplay"
            );

        if (studentNameDisplay) {
            studentNameDisplay.textContent =
                student.name;
        }
    }

    loadStudentHistorySubjects();
    displayStudentHistory();
}

// ==================== STUDENT PROFILE ====================

const studentProfileForm =
    document.getElementById("studentProfileForm");

const studentPasswordForm =
    document.getElementById("studentPasswordForm");

function displayStudentProfile() {
    const student =
        getLoggedInStudent();

    if (!student) {
        return;
    }

    const studentNameDisplay =
        document.getElementById(
            "studentNameDisplay"
        );

    const studentProfileName =
        document.getElementById(
            "studentProfileName"
        );

    const studentProfileId =
        document.getElementById(
            "studentProfileId"
        );

    const studentProfileSemester =
        document.getElementById(
            "studentProfileSemester"
        );

    const studentProfileSection =
        document.getElementById(
            "studentProfileSection"
        );

    const studentProfileGmail =
        document.getElementById(
            "studentProfileGmail"
        );

    const studentProfilePhone =
        document.getElementById(
            "studentProfilePhone"
        );

    const nameInput =
        document.getElementById(
            "studentProfileNameInput"
        );

    const gmailInput =
        document.getElementById(
            "studentProfileGmailInput"
        );

    const phoneInput =
        document.getElementById(
            "studentProfilePhoneInput"
        );

    if (studentNameDisplay) {
        studentNameDisplay.textContent =
            student.name;
    }

    if (studentProfileName) {
        studentProfileName.textContent =
            student.name;
    }

    if (studentProfileId) {
        studentProfileId.textContent =
            student.studentId;
    }

    if (studentProfileSemester) {
        studentProfileSemester.textContent =
            student.semester;
    }

    if (studentProfileSection) {
        studentProfileSection.textContent =
            student.section;
    }

    if (studentProfileGmail) {
        studentProfileGmail.textContent =
            student.gmail;
    }

    if (studentProfilePhone) {
        studentProfilePhone.textContent =
            student.phone;
    }

    if (nameInput) {
        nameInput.value =
            student.name;
    }

    if (gmailInput) {
        gmailInput.value =
            student.gmail;
    }

    if (phoneInput) {
        phoneInput.value =
            student.phone;
    }
}

if (studentProfileForm) {
    studentProfileForm.addEventListener(
        "submit",
        function(event) {
            event.preventDefault();

            const student =
                getLoggedInStudent();

            if (!student) {
                return;
            }

            const name =
                document.getElementById(
                    "studentProfileNameInput"
                ).value.trim();

            const gmail =
                document.getElementById(
                    "studentProfileGmailInput"
                ).value.trim();

            const phone =
                document.getElementById(
                    "studentProfilePhoneInput"
                ).value.trim();

            const message =
                document.getElementById(
                    "studentProfileMessage"
                );

            if (name === "" || gmail === "") {
                message.textContent =
                    "Please fill all required fields.";

                message.style.color =
                    "#c0392b";

                return;
            }

            const students =
                JSON.parse(
                    localStorage.getItem("students")
                ) || [];

            const studentIndex =
                students.findIndex(function(item) {
                    return (
                        item.studentId ===
                        student.studentId
                    );
                });

            if (studentIndex === -1) {
                return;
            }

            students[studentIndex].name =
                name;

            students[studentIndex].gmail =
                gmail;

            students[studentIndex].phone =
                phone;

            localStorage.setItem(
                "students",
                JSON.stringify(students)
            );

            message.textContent =
                "Profile updated successfully.";

            message.style.color =
                "#2e7d32";

            displayStudentProfile();
        }
    );
}

if (studentPasswordForm) {
    studentPasswordForm.addEventListener(
        "submit",
        function(event) {
            event.preventDefault();

            const student =
                getLoggedInStudent();

            if (!student) {
                return;
            }

            const currentPassword =
                document.getElementById(
                    "studentCurrentPassword"
                ).value;

            const newPassword =
                document.getElementById(
                    "studentNewPassword"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "studentConfirmPassword"
                ).value;

            const message =
                document.getElementById(
                    "studentPasswordMessage"
                );

            if (
                currentPassword === "" ||
                newPassword === "" ||
                confirmPassword === ""
            ) {
                message.textContent =
                    "Please fill all password fields.";

                message.style.color =
                    "#c0392b";

                return;
            }

            if (
                currentPassword !==
                student.password
            ) {
                message.textContent =
                    "Current password is incorrect.";

                message.style.color =
                    "#c0392b";

                return;
            }

            if (newPassword.length < 6) {
                message.textContent =
                    "New password must be at least 6 characters.";

                message.style.color =
                    "#c0392b";

                return;
            }

            if (
                newPassword !==
                confirmPassword
            ) {
                message.textContent =
                    "New passwords do not match.";

                message.style.color =
                    "#c0392b";

                return;
            }

            const students =
                JSON.parse(
                    localStorage.getItem("students")
                ) || [];

            const studentIndex =
                students.findIndex(function(item) {
                    return (
                        item.studentId ===
                        student.studentId
                    );
                });

            if (studentIndex === -1) {
                return;
            }

            students[studentIndex].password =
                newPassword;

            localStorage.setItem(
                "students",
                JSON.stringify(students)
            );

            message.textContent =
                "Password changed successfully.";

            message.style.color =
                "#2e7d32";

            studentPasswordForm.reset();
        }
    );
}

if (
    studentProfileForm ||
    studentPasswordForm
) {
    displayStudentProfile();
}
