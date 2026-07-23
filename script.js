// ============================================
// نظام إدارة المدرسة المتكامل - JavaScript
// ============================================

// ===== إدارة المستخدمين =====
const USERS_KEY = 'school_users';
const DATA_KEY = 'school_data';

// المستخدم الافتراضي
function initUsers() {
    if (!localStorage.getItem(USERS_KEY)) {
        const users = [
            { id: 1, username: 'admin', password: '123456', role: 'admin' },
            { id: 2, username: 'teacher', password: '123456', role: 'teacher' }
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
}

// ===== تهيئة البيانات =====
function initData() {
    if (!localStorage.getItem(DATA_KEY)) {
        const data = {
            students: [
                { id: 1, name: 'أحمد محمد', class: '3ب', age: 15, gender: 'ذكر', phone: '0555123456', address: 'الرياض', status: 'نشط' },
                { id: 2, name: 'سارة علي', class: '3ب', age: 14, gender: 'أنثى', phone: '0555789012', address: 'جدة', status: 'نشط' },
                { id: 3, name: 'خالد عبدالله', class: '2أ', age: 13, gender: 'ذكر', phone: '0555345678', address: 'الدمام', status: 'نشط' }
            ],
            teachers: [
                { id: 1, name: 'د. ناصر الفهد', subject: 'الرياضيات', specialization: 'رياضيات تطبيقية', phone: '0555987654', email: 'nasser@school.com', salary: 8000 },
                { id: 2, name: 'أ. منى السعيد', subject: 'اللغة العربية', specialization: 'اللغة العربية', phone: '0555876543', email: 'mona@school.com', salary: 7500 }
            ],
            classes: [
                { id: 1, name: '3ب', stage: 'متوسط', supervisor: 'أ. خالد' },
                { id: 2, name: '2أ', stage: 'متوسط', supervisor: 'أ. نورة' }
            ],
            subjects: [
                { id: 1, name: 'الرياضيات', teacherId: 1, classId: 1, hours: 5 },
                { id: 2, name: 'اللغة العربية', teacherId: 2, classId: 1, hours: 4 }
            ],
            attendance: [
                { id: 1, studentId: 1, date: '2026-07-23', status: 'حاضر' },
                { id: 2, studentId: 2, date: '2026-07-23', status: 'غائب' }
            ],
            grades: [
                { id: 1, studentId: 1, subjectId: 1, score: 85 },
                { id: 2, studentId: 2, subjectId: 1, score: 92 }
            ]
        };
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
    }
}

// ===== دوال مساعدة =====
function getData() {
    return JSON.parse(localStorage.getItem(DATA_KEY));
}

function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY));
}

function generateId(arr) {
    if (arr.length === 0) return 1;
    return Math.max(...arr.map(item => item.id)) + 1;
}

function getNextId(key) {
    const data = getData();
    return generateId(data[key]);
}

// ===== تسجيل الدخول =====
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('current_user', JSON.stringify(user));
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('currentUser').textContent = user.username;
        initApp();
    } else {
        alert('❌ اسم المستخدم أو كلمة المرور غير صحيحة!');
    }
});

// ===== تسجيل الخروج =====
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('current_user');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
});

// ===== التنقل بين الصفحات =====
document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const pageId = this.dataset.page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-' + pageId).classList.add('active');
        if (pageId === 'dashboard') updateDashboard();
        if (pageId === 'students') renderStudents();
        if (pageId === 'teachers') renderTeachers();
        if (pageId === 'classes') renderClasses();
        if (pageId === 'subjects') renderSubjects();
        if (pageId === 'attendance') loadAttendanceData();
        if (pageId === 'grades') loadGradeData();
        if (pageId === 'settings') updateSettingsStats();
    });
});

// ===== تهيئة التطبيق =====
function initApp() {
    initUsers();
    initData();
    populateSelects();
    updateDashboard();
    renderStudents();
    renderTeachers();
    renderClasses();
    renderSubjects();
    loadAttendanceData();
    loadGradeData();
    updateSettingsStats();
    setupGlobalSearch();
}

// ===== تحديث لوحة التحكم =====
function updateDashboard() {
    const data = getData();
    document.getElementById('statStudents').textContent = data.students.length;
    document.getElementById('statTeachers').textContent = data.teachers.length;
    document.getElementById('statClasses').textContent = data.classes.length;
    document.getElementById('statSubjects').textContent = data.subjects.length;
    
    // نسبة الحضور
    const total = data.attendance.length;
    const present = data.attendance.filter(a => a.status === 'حاضر').length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    document.getElementById('statAttendance').textContent = rate + '%';
    
    // المعدل العام
    const grades = data.grades;
    const avg = grades.length > 0 ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0;
    document.getElementById('statAvgGrade').textContent = avg;
    
    // الرسوم البيانية
    drawCharts();
}

// ===== الرسوم البيانية =====
let classChartInstance = null;
let gradeChartInstance = null;

function drawCharts() {
    const data = getData();
    
    // توزيع الطلاب حسب الفصل
    const classCount = {};
    data.students.forEach(s => {
        classCount[s.class] = (classCount[s.class] || 0) + 1;
    });
    const labels = Object.keys(classCount);
    const values = Object.values(classCount);
    
    const ctx1 = document.getElementById('classChart').getContext('2d');
    if (classChartInstance) classChartInstance.destroy();
    classChartInstance = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'عدد الطلاب', data: values, backgroundColor: '#667eea', borderRadius: 5 }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
    
    // توزيع الدرجات
    const gradeRanges = { '0-49': 0, '50-69': 0, '70-89': 0, '90-100': 0 };
    data.grades.forEach(g => {
        if (g.score < 50) gradeRanges['0-49']++;
        else if (g.score < 70) gradeRanges['50-69']++;
        else if (g.score < 90) gradeRanges['70-89']++;
        else gradeRanges['90-100']++;
    });
    const ctx2 = document.getElementById('gradeChart').getContext('2d');
    if (gradeChartInstance) gradeChartInstance.destroy();
    gradeChartInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: Object.keys(gradeRanges),
            datasets: [{ data: Object.values(gradeRanges), backgroundColor: ['#e74c3c', '#f39c12', '#3498db', '#2ecc71'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
}

// ===== ملء القوائم المنسدلة =====
function populateSelects() {
    const data = getData();
    
    // الفصول
    const classSelects = ['sClass', 'cStage', 'subClass', 'attendanceClass', 'gradeClass', 'filterClass'];
    classSelects.forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        const currentValue = sel.value;
        sel.innerHTML = id === 'cStage' ? 
            '<option value="ابتدائي">ابتدائي</option><option value="متوسط">متوسط</option><option value="ثانوي">ثانوي</option>' :
            '<option value="">اختر الفصل</option>';
        if (id !== 'cStage' && id !== 'filterClass') {
            data.classes.forEach(c => {
                sel.innerHTML += `<option value="${c.name}">${c.name}</option>`;
            });
        }
        if (id === 'filterClass') {
            sel.innerHTML = '<option value="">جميع الفصول</option>';
            data.classes.forEach(c => {
                sel.innerHTML += `<option value="${c.name}">${c.name}</option>`;
            });
        }
        if (currentValue) sel.value = currentValue;
    });
    
    // المعلمين
    const teacherSelect = document.getElementById('subTeacher');
    if (teacherSelect) {
        teacherSelect.innerHTML = '<option value="">اختر المعلم</option>';
        data.teachers.forEach(t => {
            teacherSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });
    }
    
    // الطلاب للدرجات
    const studentSelect = document.getElementById('gStudent');
    if (studentSelect) {
        studentSelect.innerHTML = '<option value="">اختر الطالب</option>';
        data.students.forEach(s => {
            studentSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.class})</option>`;
        });
    }
    
    // المواد للدرجات
    const subjectSelect = document.getElementById('gSubject');
    if (subjectSelect) {
        subjectSelect.innerHTML = '<option value="">اختر المادة</option>';
        data.subjects.forEach(s => {
            const teacher = data.teachers.find(t => t.id === s.teacherId);
            subjectSelect.innerHTML += `<option value="${s.id}">${s.name} (${teacher ? teacher.name : ''})</option>`;
        });
    }
}

// ============================================
// إدارة الطلاب
// ============================================
function renderStudents() {
    const data = getData();
    const filter = document.getElementById('filterClass').value;
    let students = data.students;
    if (filter) students = students.filter(s => s.class === filter);
    
    const tbody = document.getElementById('studentsList');
    tbody.innerHTML = students.map((s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${s.name}</strong></td>
            <td>${s.class}</td>
            <td>${s.age}</td>
            <td>${s.gender}</td>
            <td>${s.phone || '-'}</td>
            <td>${s.address || '-'}</td>
            <td><span class="status-${s.status === 'نشط' ? 'present' : 'absent'}">${s.status}</span></td>
            <td class="actions">
                <button class="edit" onclick="editStudent(${s.id})"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="deleteStudent(${s.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function showStudentModal(data = null) {
    const modal = document.getElementById('studentModal');
    modal.classList.add('show');
    document.getElementById('studentModalTitle').textContent = data ? 'تعديل طالب' : 'إضافة طالب';
    
    if (data) {
        document.getElementById('studentEditId').value = data.id;
        document.getElementById('sName').value = data.name;
        document.getElementById('sClass').value = data.class;
        document.getElementById('sAge').value = data.age;
        document.getElementById('sGender').value = data.gender;
        document.getElementById('sPhone').value = data.phone || '';
        document.getElementById('sAddress').value = data.address || '';
        document.getElementById('sStatus').value = data.status || 'نشط';
    } else {
        document.getElementById('studentForm').reset();
        document.getElementById('studentEditId').value = '';
    }
}

document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('studentEditId').value);
    const studentData = {
        name: document.getElementById('sName').value,
        class: document.getElementById('sClass').value,
        age: parseInt(document.getElementById('sAge').value),
        gender: document.getElementById('sGender').value,
        phone: document.getElementById('sPhone').value,
        address: document.getElementById('sAddress').value,
        status: document.getElementById('sStatus').value
    };
    
    if (id) {
        // تعديل
        const index = data.students.findIndex(s => s.id === id);
        if (index !== -1) {
            data.students[index] = { ...data.students[index], ...studentData };
        }
    } else {
        // إضافة
        studentData.id = getNextId('students');
        data.students.push(studentData);
    }
    saveData(data);
    closeModal('studentModal');
    renderStudents();
    updateDashboard();
    populateSelects();
    alert('✅ تم حفظ البيانات بنجاح!');
});

function editStudent(id) {
    const data = getData();
    const student = data.students.find(s => s.id === id);
    if (student) showStudentModal(student);
}

function deleteStudent(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا الطالب؟')) return;
    const data = getData();
    data.students = data.students.filter(s => s.id !== id);
    saveData(data);
    renderStudents();
    updateDashboard();
    populateSelects();
}

// ============================================
// إدارة المعلمين
// ============================================
function renderTeachers() {
    const data = getData();
    const tbody = document.getElementById('teachersList');
    tbody.innerHTML = data.teachers.map((t, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${t.name}</strong></td>
            <td>${t.subject}</td>
            <td>${t.specialization || '-'}</td>
            <td>${t.phone || '-'}</td>
            <td>${t.email || '-'}</td>
            <td>${t.salary ? t.salary + ' ر.س' : '-'}</td>
            <td class="actions">
                <button class="edit" onclick="editTeacher(${t.id})"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="deleteTeacher(${t.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function showTeacherModal(data = null) {
    const modal = document.getElementById('teacherModal');
    modal.classList.add('show');
    document.getElementById('teacherModalTitle').textContent = data ? 'تعديل معلم' : 'إضافة معلم';
    
    if (data) {
        document.getElementById('teacherEditId').value = data.id;
        document.getElementById('tName').value = data.name;
        document.getElementById('tSubject').value = data.subject;
        document.getElementById('tSpecialization').value = data.specialization || '';
        document.getElementById('tPhone').value = data.phone || '';
        document.getElementById('tEmail').value = data.email || '';
        document.getElementById('tSalary').value = data.salary || '';
    } else {
        document.getElementById('teacherForm').reset();
        document.getElementById('teacherEditId').value = '';
    }
}

document.getElementById('teacherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('teacherEditId').value);
    const teacherData = {
        name: document.getElementById('tName').value,
        subject: document.getElementById('tSubject').value,
        specialization: document.getElementById('tSpecialization').value,
        phone: document.getElementById('tPhone').value,
        email: document.getElementById('tEmail').value,
        salary: parseFloat(document.getElementById('tSalary').value) || 0
    };
    
    if (id) {
        const index = data.teachers.findIndex(t => t.id === id);
        if (index !== -1) data.teachers[index] = { ...data.teachers[index], ...teacherData };
    } else {
        teacherData.id = getNextId('teachers');
        data.teachers.push(teacherData);
    }
    saveData(data);
    closeModal('teacherModal');
    renderTeachers();
    updateDashboard();
    populateSelects();
    alert('✅ تم حفظ البيانات بنجاح!');
});

function editTeacher(id) {
    const data = getData();
    const teacher = data.teachers.find(t => t.id === id);
    if (teacher) showTeacherModal(teacher);
}

function deleteTeacher(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المعلم؟')) return;
    const data = getData();
    data.teachers = data.teachers.filter(t => t.id !== id);
    saveData(data);
    renderTeachers();
    updateDashboard();
    populateSelects();
}

// ============================================
// إدارة الفصول
// ============================================
function renderClasses() {
    const data = getData();
    const tbody = document.getElementById('classesList');
    tbody.innerHTML = data.classes.map((c, i) => {
        const studentCount = data.students.filter(s => s.class === c.name).length;
        return `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${c.name}</strong></td>
                <td>${c.stage}</td>
                <td>${studentCount}</td>
                <td>${c.supervisor || '-'}</td>
                <td class="actions">
                    <button class="edit" onclick="editClass(${c.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteClass(${c.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function showClassModal(data = null) {
    const modal = document.getElementById('classModal');
    modal.classList.add('show');
    if (data) {
        document.getElementById('classEditId').value = data.id;
        document.getElementById('cName').value = data.name;
        document.getElementById('cStage').value = data.stage;
        document.getElementById('cSupervisor').value = data.supervisor || '';
    } else {
        document.getElementById('classForm').reset();
        document.getElementById('classEditId').value = '';
    }
}

document.getElementById('classForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('classEditId').value);
    const classData = {
        name: document.getElementById('cName').value,
        stage: document.getElementById('cStage').value,
        supervisor: document.getElementById('cSupervisor').value
    };
    
    if (id) {
        const index = data.classes.findIndex(c => c.id === id);
        if (index !== -1) data.classes[index] = { ...data.classes[index], ...classData };
    } else {
        classData.id = getNextId('classes');
        data.classes.push(classData);
    }
    saveData(data);
    closeModal('classModal');
    renderClasses();
    updateDashboard();
    populateSelects();
    alert('✅ تم حفظ الفصل بنجاح!');
});

function editClass(id) {
    const data = getData();
    const cls = data.classes.find(c => c.id === id);
    if (cls) showClassModal(cls);
}

function deleteClass(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا الفصل؟')) return;
    const data = getData();
    data.classes = data.classes.filter(c => c.id !== id);
    saveData(data);
    renderClasses();
    updateDashboard();
    populateSelects();
}

// ============================================
// إدارة المواد
// ============================================
function renderSubjects() {
    const data = getData();
    const tbody = document.getElementById('subjectsList');
    tbody.innerHTML = data.subjects.map((s, i) => {
        const teacher = data.teachers.find(t => t.id === s.teacherId);
        const cls = data.classes.find(c => c.id === s.classId);
        return `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${s.name}</strong></td>
                <td>${teacher ? teacher.name : '-'}</td>
                <td>${cls ? cls.name : '-'}</td>
                <td>${s.hours}</td>
                <td class="actions">
                    <button class="edit" onclick="editSubject(${s.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteSubject(${s.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function showSubjectModal(data = null) {
    const modal = document.getElementById('subjectModal');
    modal.classList.add('show');
    populateSelects();
    if (data) {
        document.getElementById('subjectEditId').value = data.id;
        document.getElementById('subName').value = data.name;
        document.getElementById('subTeacher').value = data.teacherId;
        document.getElementById('subClass').value = data.classId;
        document.getElementById('subHours').value = data.hours;
    } else {
        document.getElementById('subjectForm').reset();
        document.getElementById('subjectEditId').value = '';
    }
}

document.getElementById('subjectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('subjectEditId').value);
    const subjectData = {
        name: document.getElementById('subName').value,
        teacherId: parseInt(document.getElementById('subTeacher').value),
        classId: parseInt(document.getElementById('subClass').value),
        hours: parseInt(document.getElementById('subHours').value)
    };
    
    if (id) {
        const index = data.subjects.findIndex(s => s.id === id);
        if (index !== -1) data.subjects[index] = { ...data.subjects[index], ...subjectData };
    } else {
        subjectData.id = getNextId('subjects');
        data.subjects.push(subjectData);
    }
    saveData(data);
    closeModal('subjectModal');
    renderSubjects();
    updateDashboard();
    populateSelects();
    alert('✅ تم حفظ المادة بنجاح!');
});

function editSubject(id) {
    const data = getData();
    const subject = data.subjects.find(s => s.id === id);
    if (subject) showSubjectModal(subject);
}

function deleteSubject(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذه المادة؟')) return;
    const data = getData();
    data.subjects = data.subjects.filter(s => s.id !== id);
    saveData(data);
    renderSubjects();
    updateDashboard();
    populateSelects();
}

// ============================================
// إدارة الحضور
// ============================================
function loadAttendanceData() {
    const data = getData();
    const classSelect = document.getElementById('attendanceClass');
    const dateInput = document.getElementById('attendanceDate');
    if (!dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    populateSelects();
    loadAttendanceStudents();
}

function loadAttendanceStudents() {
    const data = getData();
    const className = document.getElementById('attendanceClass').value;
    const date = document.getElementById('attendanceDate').value;
    let students = data.students;
    if (className) students = students.filter(s => s.class === className);
    
    const tbody = document.getElementById('attendanceList');
    tbody.innerHTML = students.map((s, i) => {
        const existing = data.attendance.find(a => a.studentId === s.id && a.date === date);
        const status = existing ? existing.status : 'غائب';
        return `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${s.name}</strong></td>
                <td><span class="status-${status === 'حاضر' ? 'present' : 'absent'}">${status === 'حاضر' ? '✅ حاضر' : '❌ غائب'}</span></td>
                <td><span class="status-${status === 'غائب' ? 'present' : 'absent'}">${status === 'غائب' ? '✅ غائب' : '❌ حاضر'}</span></td>
                <td>
                    <select onchange="updateAttendance(${s.id}, this.value)" style="padding:5px;border-radius:5px;">
                        <option value="حاضر" ${status === 'حاضر' ? 'selected' : ''}>✅ حاضر</option>
                        <option value="غائب" ${status === 'غائب' ? 'selected' : ''}>❌ غائب</option>
                        <option value="متأخر" ${status === 'متأخر' ? 'selected' : ''}>⏰ متأخر</option>
                    </select>
                </td>
            </tr>
        `;
    }).join('');
    
    // الملخص
    const present = data.attendance.filter(a => a.date === date && a.status === 'حاضر').length;
    const absent = data.attendance.filter(a => a.date === date && a.status === 'غائب').length;
    const late = data.attendance.filter(a => a.date === date && a.status === 'متأخر').length;
    const total = students.length;
    document.getElementById('attendanceSummary').innerHTML = `
        <h4>📊 ملخص الحضور - ${date}</h4>
        <div style="display:flex;gap:20px;flex-wrap:wrap;margin-top:10px;">
            <span>👨‍🎓 إجمالي الطلاب: ${total}</span>
            <span style="color:#2ecc71;">✅ حاضر: ${present}</span>
            <span style="color:#e74c3c;">❌ غائب: ${absent}</span>
            <span style="color:#f39c12;">⏰ متأخر: ${late}</span>
            <span>📈 نسبة الحضور: ${total > 0 ? Math.round((present / total) * 100) : 0}%</span>
        </div>
    `;
}

function updateAttendance(studentId, status) {
    const data = getData();
    const date = document.getElementById('attendanceDate').value;
    const existing = data.attendance.find(a => a.studentId === studentId && a.date === date);
    if (existing) {
        existing.status = status;
    } else {
        data.attendance.push({ id: getNextId('attendance'), studentId, date, status });
    }
    saveData(data);
    loadAttendanceStudents();
    updateDashboard();
}

function saveAttendance() {
    alert('✅ تم حفظ سجل الحضور بنجاح!');
    loadAttendanceStudents();
}

// ============================================
// إدارة الدرجات
// ============================================
function loadGradeData() {
    const data = getData();
    const classId = document.getElementById('gradeClass').value;
    const subjectId = document.getElementById('gradeSubject').value;
    populateSelects();
    
    let grades = data.grades;
    if (subjectId) grades = grades.filter(g => g.subjectId === parseInt(subjectId));
    if (classId) {
        const classStudents = data.students.filter(s => s.class === classId).map(s => s.id);
        grades = grades.filter(g => classStudents.includes(g.studentId));
    }
    
    const tbody = document.getElementById('gradesList');
    tbody.innerHTML = grades.map((g, i) => {
        const student = data.students.find(s => s.id === g.studentId);
        const subject = data.subjects.find(s => s.id === g.subjectId);
        const grade = getGradeLetter(g.score);
        return `
            <tr>
                <td>${i + 1}</td>
                <td>${student ? student.name : '-'}</td>
                <td>${subject ? subject.name : '-'}</td>
                <td><strong>${g.score}</strong></td>
                <td><span style="color:${grade.color}">${grade.letter}</span></td>
                <td class="actions">
                    <button class="edit" onclick="editGrade(${g.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteGrade(${g.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function getGradeLetter(score) {
    if (score >= 90) return { letter: 'A', color: '#2ecc71' };
    if (score >= 80) return { letter: 'B', color: '#3498db' };
    if (score >= 70) return { letter: 'C', color: '#f39c12' };
    if (score >= 60) return { letter: 'D', color: '#e67e22' };
    return { letter: 'F', color: '#e74c3c' };
}

function showGradeModal(data = null) {
    const modal = document.getElementById('gradeModal');
    modal.classList.add('show');
    populateSelects();
    if (data) {
        document.getElementById('gradeEditId').value = data.id;
        document.getElementById('gStudent').value = data.studentId;
        document.getElementById('gSubject').value = data.subjectId;
        document.getElementById('gScore').value = data.score;
    } else {
        document.getElementById('gradeForm').reset();
        document.getElementById('gradeEditId').value = '';
    }
}

document.getElementById('gradeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('gradeEditId').value);
    const gradeData = {
        studentId: parseInt(document.getElementById('gStudent').value),
        subjectId: parseInt(document.getElementById('gSubject').value),
        score: parseFloat(document.getElementById('gScore').value)
    };
    
    if (id) {
        const index = data.grades.findIndex(g => g.id === id);
        if (index !== -1) data.grades[index] = { ...data.grades[index], ...gradeData };
    } else {
        gradeData.id = getNextId('grades');
        data.grades.push(gradeData);
    }
    saveData(data);
    closeModal('gradeModal');
    loadGradeData();
    updateDashboard();
    populateSelects();
    alert('✅ تم حفظ الدرجة بنجاح!');
});

function editGrade(id) {
    const data = getData();
    const grade = data.grades.find(g => g.id === id);
    if (grade) showGradeModal(grade);
}

function deleteGrade(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذه الدرجة؟')) return;
    const data = getData();
    data.grades = data.grades.filter(g => g.id !== id);
    saveData(data);
    loadGradeData();
    updateDashboard();
}

// ============================================
// التقارير
// ============================================
function generateReport(type) {
    const data = getData();
    const output = document.getElementById('reportOutput');
    let html = '';
    
    switch(type) {
        case 'students':
            const classCount = {};
            data.students.forEach(s => {
                classCount[s.class] = (classCount[s.class] || 0) + 1;
            });
            html = `
                <h3>📊 تقرير الطلاب</h3>
                <p>إجمالي الطلاب: <strong>${data.students.length}</strong></p>
                <div style="margin:15px 0;">
                    ${Object.entries(classCount).map(([cls, count]) => 
                        `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;">
                            <span>${cls}</span>
                            <span><strong>${count}</strong> طالب</span>
                        </div>`
                    ).join('')}
                </div>
                <p>الحالة: ${data.students.filter(s => s.status === 'نشط').length} نشط، ${data.students.filter(s => s.status !== 'نشط').length} غير نشط</p>
            `;
            break;
        case 'attendance':
            const total = data.attendance.length;
            const present = data.attendance.filter(a => a.status === 'حاضر').length;
            const absent = data.attendance.filter(a => a.status === 'غائب').length;
            const late = data.attendance.filter(a => a.status === 'متأخر').length;
            html = `
                <h3>📊 تقرير الحضور</h3>
                <p>إجمالي سجلات الحضور: <strong>${total}</strong></p>
                <div style="margin:15px 0;">
                    <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;">
                        <span>✅ حاضر</span>
                        <span><strong>${present}</strong> (${total > 0 ? Math.round((present/total)*100) : 0}%)</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;">
                        <span>❌ غائب</span>
                        <span><strong>${absent}</strong> (${total > 0 ? Math.round((absent/total)*100) : 0}%)</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:5px 0;">
                        <span>⏰ متأخر</span>
                        <span><strong>${late}</strong> (${total > 0 ? Math.round((late/total)*100) : 0}%)</span>
                    </div>
                </div>
            `;
            break;
        case 'grades':
            const avg = data.grades.length > 0 ? Math.round(data.grades.reduce((s, g) => s + g.score, 0) / data.grades.length) : 0;
            const passed = data.grades.filter(g => g.score >= 60).length;
            html = `
                <h3>📊 تقرير الدرجات</h3>
                <p>إجمالي الدرجات: <strong>${data.grades.length}</strong></p>
                <p>المعدل العام: <strong>${avg}</strong></p>
                <p>النجاح: <strong>${passed}</strong> (${data.grades.length > 0 ? Math.round((passed/data.grades.length)*100) : 0}%)</p>
                <div style="margin:15px 0;">
                    <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;">
                        <span>🟢 ممتاز (90-100)</span>
                        <span>${data.grades.filter(g => g.score >= 90).length}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;">
                        <span>🔵 جيد جداً (80-89)</span>
                        <span>${data.grades.filter(g => g.score >= 80 && g.score < 90).length}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;">
                        <span>🟡 جيد (70-79)</span>
                        <span>${data.grades.filter(g => g.score >= 70 && g.score < 80).length}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;">
                        <span>🟠 مقبول (60-69)</span>
                        <span>${data.grades.filter(g => g.score >= 60 && g.score < 70).length}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:5px 0;">
                        <span>🔴 راسب (أقل من 60)</span>
                        <span>${data.grades.filter(g => g.score < 60).length}</span>
                    </div>
                </div>
            `;
            break;
        case 'teachers':
            html = `
                <h3>📊 تقرير المعلمين</h3>
                <p>إجمالي المعلمين: <strong>${data.teachers.length}</strong></p>
                <div style="margin:15px 0;">
                    ${data.teachers.map(t => `
                        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;">
                            <span>${t.name}</span>
                            <span>${t.subject} ${t.salary ? '| ' + t.salary + ' ر.س' : ''}</span>
                        </div>
                    `).join('')}
                </div>
                <p>متوسط الراتب: ${data.teachers.length > 0 ? Math.round(data.teachers.reduce((s, t) => s + (t.salary || 0), 0) / data.teachers.length) : 0} ر.س</p>
            `;
            break;
    }
    output.innerHTML = html;
}

// ============================================
// البحث العام
// ============================================
function setupGlobalSearch() {
    document.getElementById('globalSearch').addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (!query) {
            document.querySelectorAll('.page').forEach(p => p.style.display = '');
            return;
        }
        
        const data = getData();
        const results = [];
        
        // بحث في الطلاب
        data.students.forEach(s => {
            if (s.name.includes(query) || s.class.includes(query) || s.phone.includes(query)) {
                results.push({ type: 'طالب', name: s.name, detail: s.class });
            }
        });
        
        // بحث في المعلمين
        data.teachers.forEach(t => {
            if (t.name.includes(query) || t.subject.includes(query) || t.email.includes(query)) {
                results.push({ type: 'معلم', name: t.name, detail: t.subject });
            }
        });
        
        // عرض النتائج
        if (results.length === 0) {
            alert('🔍 لا توجد نتائج للبحث عن: ' + query);
        } else {
            const msg = results.map(r => `${r.type}: ${r.name} (${r.detail})`).join('\n');
            alert('🔍 نتائج البحث عن "' + query + '":\n\n' + msg);
        }
    });
}

// ============================================
// تصدير البيانات
// ============================================
function exportCSV(type) {
    const data = getData();
    let rows = [];
    let headers = [];
    
    if (type === 'students') {
        headers = ['الاسم', 'الفصل', 'العمر', 'الجنس', 'الهاتف', 'العنوان', 'الحالة'];
        rows = data.students.map(s => [s.name, s.class, s.age, s.gender, s.phone, s.address, s.status]);
    } else if (type === 'teachers') {
        headers = ['الاسم', 'المادة', 'التخصص', 'الهاتف', 'البريد', 'الراتب'];
        rows = data.teachers.map(t => [t.name, t.subject, t.specialization, t.phone, t.email, t.salary]);
    }
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell || ''}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportAllData() {
    const data = getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school_data_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================
// الإعدادات
// ============================================
function updateSettingsStats() {
    const data = getData();
    const total = data.students.length + data.teachers.length + data.classes.length + 
                  data.subjects.length + data.attendance.length + data.grades.length;
    document.getElementById('statsRecords').textContent = total;
    
    const size = new Blob([JSON.stringify(data)]).size;
    document.getElementById('statsSize').textContent = (size / 1024).toFixed(1) + ' KB';
}

document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const old = document.getElementById('oldPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const users = getUsers();
    const current = JSON.parse(localStorage.getItem('current_user'));
    const user = users.find(u => u.id === current.id);
    
    if (user && user.password === old) {
        user.password = newPass;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        alert('✅ تم تغيير كلمة المرور بنجاح!');
        this.reset();
    } else {
        alert('❌ كلمة المرور القديمة غير صحيحة!');
    }
});

function backupData() {
    exportAllData();
}

function restoreData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                localStorage.setItem(DATA_KEY, JSON.stringify(data));
                alert('✅ تم استعادة البيانات بنجاح!');
                location.reload();
            } catch(err) {
                alert('❌ ملف غير صالح!');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function resetAllData() {
    if (!confirm('⚠️ تحذير: سيتم حذف كل البيانات نهائياً! هل أنت متأكد؟')) return;
    if (!confirm('⚠️ تأكيد نهائي: هل تريد حذف كل شيء؟')) return;
    localStorage.removeItem(DATA_KEY);
    initData();
    alert('✅ تم حذف كل البيانات وإعادة التهيئة!');
    location.reload();
}

// ============================================
// دوال عامة
// ============================================
function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}

// إغلاق المودال عند الضغط خارجها
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('show');
    });
});

// ===== تشغيل التطبيق =====
// التحقق من وجود مستخدم مسجل دخول
const currentUser = localStorage.getItem('current_user');
if (currentUser) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    const user = JSON.parse(currentUser);
    document.getElementById('currentUser').textContent = user.username;
    initApp();
} else {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
}

console.log('🏫 نظام إدارة المدرسة المتكامل - تم التحميل بنجاح!');
console.log('📊 البيانات مخزنة في localStorage');
console.log('👤 المستخدم الافتراضي: admin / 123456');