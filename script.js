// ============================================
// أقوى نظام إدارة مدرسة متكامل - JavaScript
// النسخة الذهبية 5.0 - مع إصلاح تسجيل الدخول
// ============================================

// ===== الثوابت =====
const USERS_KEY = 'school_users_gold';
const DATA_KEY = 'school_data_gold';
const SETTINGS_KEY = 'school_settings';

// ===== إصلاح مشكلة تسجيل الدخول =====
// حذف المستخدمين القديمين وإعادة تهيئتهم
localStorage.removeItem(USERS_KEY);
localStorage.removeItem('current_user');

function initUsers() {
    const users = [
        { id: 1, username: 'admin', password: '123456', role: 'مدير النظام', fullName: 'مدير المدرسة' },
        { id: 2, username: 'teacher1', password: '123456', role: 'معلم', fullName: 'أحمد المعلم' },
        { id: 3, username: 'accountant', password: '123456', role: 'محاسب', fullName: 'خالد المحاسب' }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    console.log('✅ تم تهيئة المستخدمين:', users);
}

// ===== دالة تسجيل الدخول المعدلة =====
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    console.log('🔑 محاولة دخول:', username, password);
    
    // التأكد من وجود المستخدمين
    if (!localStorage.getItem(USERS_KEY)) {
        initUsers();
    }
    
    const users = getUsers();
    console.log('📋 المستخدمين الموجودين:', users);
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('current_user', JSON.stringify(user));
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('currentUser').textContent = user.fullName || user.username;
        document.getElementById('currentRole').textContent = user.role || 'مستخدم';
        initApp();
        showToast('مرحباً بك ' + user.fullName, 'success');
        console.log('✅ تم تسجيل الدخول بنجاح:', user);
    } else {
        showToast('❌ اسم المستخدم أو كلمة المرور غير صحيحة!', 'error');
        console.log('❌ فشل تسجيل الدخول - المستخدم غير موجود');
    }
});

// ===== دخول سريع (تجاوز) =====
function forceLogin() {
    const user = { id: 1, username: 'admin', password: '123456', role: 'مدير النظام', fullName: 'مدير المدرسة' };
    localStorage.setItem('current_user', JSON.stringify(user));
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('currentUser').textContent = user.fullName;
    document.getElementById('currentRole').textContent = user.role;
    initApp();
    showToast('✅ تم الدخول السريع', 'success');
    console.log('✅ دخول سريع:', user);
}

// ===== تهيئة البيانات مع عينات كبيرة =====
function initData() {
    if (!localStorage.getItem(DATA_KEY)) {
        const data = {
            students: generateSampleStudents(),
            teachers: generateSampleTeachers(),
            classes: generateSampleClasses(),
            subjects: generateSampleSubjects(),
            timetable: generateSampleTimetable(),
            attendance: generateSampleAttendance(),
            grades: generateSampleGrades(),
            exams: generateSampleExams(),
            fees: generateSampleFees(),
            library: generateSampleBooks(),
            events: generateSampleEvents(),
            messages: generateSampleMessages()
        };
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
        console.log('✅ تم تهيئة البيانات');
    }
}

// ===== توليد بيانات عينة =====
function generateSampleStudents() {
    const names = ['أحمد محمد', 'سارة علي', 'خالد عبدالله', 'نورة سعد', 'محمد إبراهيم', 'فاطمة حسن', 'عبدالله عمر', 'منى خالد', 'يوسف ناصر', 'ريم أحمد', 'علي صالح', 'هدى سعيد', 'حسن محمد', 'أمل خالد', 'سعيد راشد'];
    const classes = ['1أ', '1ب', '2أ', '2ب', '3أ', '3ب', '4أ', '4ب', '5أ', '5ب', '6أ', '6ب'];
    const genders = ['ذكر', 'أنثى'];
    const statuses = ['نشط', 'نشط', 'نشط', 'نشط', 'منتقل', 'متخرج'];
    const students = [];
    for (let i = 0; i < 50; i++) {
        students.push({
            id: i + 1,
            name: names[i % names.length] + (i > names.length ? ' ' + (i % 10 + 1) : ''),
            class: classes[i % classes.length],
            age: 10 + (i % 8),
            gender: genders[i % 2],
            phone: '05' + String(10000000 + i).padStart(8, '0'),
            address: ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة'][i % 5],
            parent: 'وليّ ' + names[i % names.length],
            status: statuses[i % statuses.length]
        });
    }
    return students;
}

function generateSampleTeachers() {
    const names = ['د. ناصر الفهد', 'أ. منى السعيد', 'أ. خالد الحارثي', 'د. سارة المطيري', 'أ. محمد العتيبي', 'أ. نورة الشمري', 'د. عبدالله الزهراني'];
    const subjects = ['الرياضيات', 'اللغة العربية', 'العلوم', 'اللغة الإنجليزية', 'التاريخ', 'الجغرافيا', 'التربية الإسلامية'];
    const teachers = [];
    for (let i = 0; i < 7; i++) {
        teachers.push({
            id: i + 1,
            name: names[i],
            subject: subjects[i],
            specialization: subjects[i] + ' - تخصص',
            phone: '05' + String(50000000 + i).padStart(8, '0'),
            email: 'teacher' + (i + 1) + '@school.com',
            salary: 6000 + (i * 500),
            hireDate: '2020-0' + (i + 1) + '-01'
        });
    }
    return teachers;
}

function generateSampleClasses() {
    const classes = [];
    const names = ['1أ', '1ب', '2أ', '2ب', '3أ', '3ب', '4أ', '4ب', '5أ', '5ب', '6أ', '6ب'];
    const stages = ['ابتدائي', 'ابتدائي', 'ابتدائي', 'ابتدائي', 'ابتدائي', 'ابتدائي', 'ابتدائي', 'ابتدائي', 'ابتدائي', 'ابتدائي', 'ابتدائي', 'ابتدائي'];
    const supervisors = ['أ. خالد', 'أ. نورة', 'أ. سعيد', 'أ. منى', 'أ. فهد', 'أ. ليلى', 'أ. عمر', 'أ. سارة', 'أ. ناصر', 'أ. هدى', 'أ. راشد', 'أ. أمل'];
    for (let i = 0; i < 12; i++) {
        classes.push({
            id: i + 1,
            name: names[i],
            stage: stages[i],
            supervisor: supervisors[i],
            room: 'غرفة ' + (101 + i),
            capacity: 25 + (i % 5) * 5
        });
    }
    return classes;
}

function generateSampleSubjects() {
    const subjects = [];
    const names = ['الرياضيات', 'اللغة العربية', 'العلوم', 'اللغة الإنجليزية', 'التاريخ', 'الجغرافيا', 'التربية الإسلامية'];
    for (let i = 0; i < 7; i++) {
        subjects.push({
            id: i + 1,
            name: names[i],
            teacherId: (i % 7) + 1,
            classId: (i % 12) + 1,
            hours: 4 + (i % 3),
            maxScore: 100
        });
    }
    return subjects;
}

function generateSampleTimetable() {
    const timetable = [];
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    const periods = [1, 2, 3, 4, 5, 6];
    const subjectIds = [1, 2, 3, 4, 5, 6, 7];
    let id = 1;
    for (let c = 1; c <= 6; c++) {
        for (let d of days) {
            for (let p of periods) {
                timetable.push({
                    id: id++,
                    classId: c,
                    day: d,
                    period: p,
                    subjectId: subjectIds[(c + p + id) % 7]
                });
            }
        }
    }
    return timetable;
}

function generateSampleAttendance() {
    const attendance = [];
    const statuses = ['حاضر', 'حاضر', 'حاضر', 'غائب', 'حاضر', 'حاضر', 'متأخر', 'حاضر'];
    let id = 1;
    const today = new Date();
    for (let d = 0; d < 30; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - d);
        const dateStr = date.toISOString().split('T')[0];
        for (let s = 1; s <= 30; s++) {
            attendance.push({
                id: id++,
                studentId: s,
                date: dateStr,
                status: statuses[(s + d) % statuses.length]
            });
        }
    }
    return attendance;
}

function generateSampleGrades() {
    const grades = [];
    let id = 1;
    for (let s = 1; s <= 30; s++) {
        for (let sub = 1; sub <= 5; sub++) {
            grades.push({
                id: id++,
                studentId: s,
                subjectId: sub,
                score: 50 + Math.floor(Math.random() * 50),
                note: ''
            });
        }
    }
    return grades;
}

function generateSampleExams() {
    const exams = [];
    const names = ['الامتحان النصفي', 'الامتحان النهائي', 'امتحان الشهر الأول', 'امتحان الشهر الثاني', 'امتحان تجريبي'];
    for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() + (i + 1) * 5);
        exams.push({
            id: i + 1,
            name: names[i % names.length] + ' ' + (Math.floor(i / names.length) + 1),
            subjectId: (i % 7) + 1,
            classId: (i % 12) + 1,
            date: date.toISOString().split('T')[0],
            time: '10:00',
            maxScore: 100
        });
    }
    return exams;
}

function generateSampleFees() {
    const fees = [];
    const types = ['رسوم دراسية', 'رسوم كتب', 'رسوم نشاط', 'رسوم مواصلات'];
    const statuses = ['مدفوع', 'غير مدفوع', 'جزئي'];
    let id = 1;
    for (let s = 1; s <= 30; s++) {
        for (let t = 0; t < 3; t++) {
            const date = new Date();
            date.setMonth(date.getMonth() - t);
            fees.push({
                id: id++,
                studentId: s,
                type: types[t % types.length],
                amount: 200 + (t * 100) + Math.floor(Math.random() * 100),
                date: date.toISOString().split('T')[0],
                status: statuses[(s + t) % statuses.length]
            });
        }
    }
    return fees;
}

function generateSampleBooks() {
    const books = [];
    const titles = ['الرياضيات المتقدمة', 'قواعد اللغة العربية', 'العلوم الطبيعية', 'English Grammar', 'تاريخ الإسلام', 'الجغرافيا البشرية', 'التربية الإسلامية', 'الفيزياء', 'الكيمياء', 'الأحياء'];
    const authors = ['د. أحمد', 'أ. محمد', 'د. خالد', 'أ. سارة', 'د. نورة', 'أ. عبدالله', 'د. منى', 'أ. سعيد', 'د. ريم', 'أ. يوسف'];
    for (let i = 0; i < 20; i++) {
        books.push({
            id: i + 1,
            title: titles[i % titles.length] + (i > titles.length ? ' - المستوى ' + (i % 3 + 1) : ''),
            author: authors[i % authors.length],
            category: ['تعليمية', 'علمية', 'أدبية', 'دينية', 'تاريخية'][i % 5],
            copies: 3 + (i % 5),
            available: 1 + (i % 4)
        });
    }
    return books;
}

function generateSampleEvents() {
    const events = [];
    const titles = ['يوم الرياضة', 'معرض العلوم', 'حفل التخرج', 'رحلة مدرسية', 'مسابقة القراءة', 'يوم الأم', 'العلم الوطني', 'معرض الفنون'];
    for (let i = 0; i < 8; i++) {
        const date = new Date();
        date.setDate(date.getDate() + (i + 1) * 7);
        events.push({
            id: i + 1,
            title: titles[i],
            date: date.toISOString().split('T')[0],
            location: ['قاعة المدرسة', 'الملعب', 'قاعة الاحتفالات', 'مدينة الرياض'][i % 4],
            description: 'وصف الفعالية ' + titles[i] + ' - فعالية مميزة لجميع الطلاب'
        });
    }
    return events;
}

function generateSampleMessages() {
    const messages = [];
    const subjects = ['إعلان مهم', 'موعد الامتحان', 'فعالية جديدة', 'تذكير', 'تهنئة'];
    for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setHours(date.getHours() - (i + 1) * 2);
        messages.push({
            id: i + 1,
            from: 'إدارة المدرسة',
            to: 'all',
            subject: subjects[i % subjects.length] + ' ' + (i + 1),
            body: 'هذا هو محتوى الرسالة رقم ' + (i + 1) + '. رسالة مهمة لجميع الطلاب والمعلمين.',
            date: date.toISOString(),
            read: i % 2 === 0
        });
    }
    return messages;
}

// ===== دوال مساعدة =====
function getData() {
    return JSON.parse(localStorage.getItem(DATA_KEY)) || {};
}

function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function getSettings() {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { schoolName: 'مدرسة المستقبل', address: '', phone: '' };
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function generateId(arr) {
    if (!arr || arr.length === 0) return 1;
    return Math.max(...arr.map(item => item.id || 0)) + 1;
}

function getNextId(key) {
    const data = getData();
    return generateId(data[key]);
}

// ===== Toast notifications =====
function showToast(message, type = 'success') {
    const colors = {
        success: 'linear-gradient(to right, #22c55e, #16a34a)',
        error: 'linear-gradient(to right, #ef4444, #dc2626)',
        warning: 'linear-gradient(to right, #f59e0b, #d97706)',
        info: 'linear-gradient(to right, #3b82f6, #2563eb)'
    };
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 3500,
            gravity: 'top',
            position: 'left',
            style: { background: colors[type] || colors.success, borderRadius: '12px', padding: '14px 24px', fontFamily: 'Segoe UI, sans-serif' },
            className: 'toast-custom'
        }).showToast();
    } else {
        alert(message);
    }
}

// ===== تسجيل الخروج =====
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('current_user');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
    showToast('تم تسجيل الخروج', 'info');
});

// ===== تبديل الشريط الجانبي =====
document.getElementById('toggleSidebar')?.addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('open');
});

// ===== التنقل بين الصفحات =====
document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const pageId = this.dataset.page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById('page-' + pageId);
        if (targetPage) targetPage.classList.add('active');
        
        const renderMap = {
            'dashboard': updateDashboard,
            'students': renderStudents,
            'teachers': renderTeachers,
            'classes': renderClasses,
            'subjects': renderSubjects,
            'timetable': renderTimetable,
            'attendance': loadAttendanceStudents,
            'grades': loadGradeData,
            'exams': renderExams,
            'fees': renderFees,
            'library': renderLibrary,
            'events': renderEvents,
            'messages': renderMessages,
            'reports': () => {},
            'settings': updateSettingsStats
        };
        if (renderMap[pageId]) renderMap[pageId]();
        
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
        }
    });
});

// ===== تهيئة التطبيق =====
function initApp() {
    initUsers();
    initData();
    populateAllSelects();
    updateDashboard();
    renderStudents();
    renderTeachers();
    renderClasses();
    renderSubjects();
    renderTimetable();
    loadAttendanceStudents();
    loadGradeData();
    renderExams();
    renderFees();
    renderLibrary();
    renderEvents();
    renderMessages();
    updateSettingsStats();
    setupGlobalSearch();
    updateDateDisplay();
    updateNotifications();
    loadSchoolInfo();
}

// ===== تحديث التاريخ =====
function updateDateDisplay() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const el = document.getElementById('currentDate');
    if (el) el.textContent = now.toLocaleDateString('ar-SA', options);
}

// ===== الإشعارات =====
function updateNotifications() {
    const data = getData();
    const unreadMessages = data.messages?.filter(m => !m.read)?.length || 0;
    const badge = document.getElementById('notificationBadge');
    if (badge) badge.textContent = unreadMessages;
}

function showNotifications() {
    const data = getData();
    const unread = data.messages?.filter(m => !m.read) || [];
    if (unread.length === 0) {
        showToast('📭 لا توجد إشعارات جديدة', 'info');
        return;
    }
    const msg = unread.map(m => '📩 ' + m.subject + ' - من: ' + m.from).join('\n');
    alert('📬 الإشعارات غير المقروءة:\n\n' + msg);
    data.messages.forEach(m => m.read = true);
    saveData(data);
    updateNotifications();
}

// ===== البحث العام =====
function setupGlobalSearch() {
    document.getElementById('globalSearch')?.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (!query) {
            document.querySelectorAll('.page').forEach(p => p.style.display = '');
            return;
        }
        const data = getData();
        const results = [];
        data.students?.forEach(s => {
            if (s.name?.toLowerCase().includes(query) || s.class?.toLowerCase().includes(query) || s.phone?.includes(query)) {
                results.push({ type: '👨‍🎓 طالب', name: s.name, detail: s.class });
            }
        });
        data.teachers?.forEach(t => {
            if (t.name?.toLowerCase().includes(query) || t.subject?.toLowerCase().includes(query) || t.email?.toLowerCase().includes(query)) {
                results.push({ type: '👨‍🏫 معلم', name: t.name, detail: t.subject });
            }
        });
        data.books?.forEach(b => {
            if (b.title?.toLowerCase().includes(query) || b.author?.toLowerCase().includes(query)) {
                results.push({ type: '📚 كتاب', name: b.title, detail: b.author });
            }
        });
        if (results.length === 0) {
            showToast('🔍 لا توجد نتائج', 'warning');
        } else {
            const msg = results.slice(0, 10).map(r => `${r.type}: ${r.name} (${r.detail})`).join('\n');
            alert('🔍 نتائج البحث عن "' + query + '":\n\n' + msg + (results.length > 10 ? '\n\n... و ' + (results.length - 10) + ' نتيجة أخرى' : ''));
        }
    });
}

// ===== تصدير البيانات =====
function exportCSV(type) {
    const data = getData();
    let rows = [], headers = [];
    if (type === 'students' && data.students) {
        headers = ['الاسم', 'الفصل', 'العمر', 'الجنس', 'الهاتف', 'العنوان', 'ولي الأمر', 'الحالة'];
        rows = data.students.map(s => [s.name, s.class, s.age, s.gender, s.phone, s.address, s.parent, s.status]);
    } else if (type === 'teachers' && data.teachers) {
        headers = ['الاسم', 'المادة', 'التخصص', 'الهاتف', 'البريد', 'الراتب', 'تاريخ التعيين'];
        rows = data.teachers.map(t => [t.name, t.subject, t.specialization, t.phone, t.email, t.salary, t.hireDate]);
    }
    if (rows.length === 0) {
        showToast('⚠️ لا توجد بيانات', 'warning');
        return;
    }
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell || ''}"`).join(',') + '\n';
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✅ تم التصدير');
}

function exportAllData() {
    const data = getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✅ تم تصدير جميع البيانات');
}

// ===== المودالات =====
function closeModal(id) {
    document.getElementById(id)?.classList.remove('show');
}

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('show');
    });
});

// ===== دوال التقارير =====
function exportAttendanceReport() {
    showToast('📄 جاري إنشاء تقرير الحضور...', 'info');
    generateReport('attendance');
    document.querySelector('[data-page="reports"]')?.click();
}

function exportGradesReport() {
    showToast('📄 جاري إنشاء تقرير الدرجات...', 'info');
    generateReport('grades');
    document.querySelector('[data-page="reports"]')?.click();
}

function exportFeesReport() {
    showToast('📄 جاري إنشاء تقرير المصروفات...', 'info');
    generateReport('fees');
    document.querySelector('[data-page="reports"]')?.click();
}

function exportLibraryReport() {
    showToast('📄 جاري إنشاء تقرير المكتبة...', 'info');
    generateReport('library');
    document.querySelector('[data-page="reports"]')?.click();
}

// ===== ملء القوائم =====
function populateAllSelects() {
    const data = getData();
    
    const classSelects = ['sClass', 'subClass', 'attendanceClass', 'gradeClass', 'filterClass', 'ttClass', 'exClass', 'timetableClass'];
    classSelects.forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        const currentValue = sel.value;
        sel.innerHTML = '<option value="">اختر الفصل</option>';
        data.classes?.forEach(c => {
            sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
        });
        if (currentValue) sel.value = currentValue;
    });
    
    const teacherSelect = document.getElementById('subTeacher');
    if (teacherSelect) {
        teacherSelect.innerHTML = '<option value="">اختر المعلم</option>';
        data.teachers?.forEach(t => {
            teacherSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });
    }
    
    const studentSelects = ['gStudent', 'fStudent'];
    studentSelects.forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = '<option value="">اختر الطالب</option>';
        data.students?.forEach(s => {
            sel.innerHTML += `<option value="${s.id}">${s.name} (${s.class})</option>`;
        });
    });
    
    const subjectSelects = ['gSubject', 'ttSubject', 'exSubject'];
    subjectSelects.forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = '<option value="">اختر المادة</option>';
        data.subjects?.forEach(s => {
            const teacher = data.teachers?.find(t => t.id === s.teacherId);
            sel.innerHTML += `<option value="${s.id}">${s.name} (${teacher?.name || ''})</option>`;
        });
    });
    
    const statusSelect = document.getElementById('filterStatus');
    if (statusSelect) {
        const current = statusSelect.value;
        statusSelect.innerHTML = '<option value="">جميع الحالات</option><option value="نشط">نشط</option><option value="منتقل">منتقل</option><option value="متخرج">متخرج</option>';
        if (current) statusSelect.value = current;
    }
}

// ============================================
// لوحة التحكم
// ============================================
let classChartInstance = null;
let gradeChartInstance = null;
let attendanceChartInstance = null;

function updateDashboard() {
    const data = getData();
    const students = data.students || [];
    const teachers = data.teachers || [];
    const classes = data.classes || [];
    const subjects = data.subjects || [];
    const attendance = data.attendance || [];
    const grades = data.grades || [];
    
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'حاضر').length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    const avg = grades.length > 0 ? Math.round(grades.reduce((s, g) => s + (g.score || 0), 0) / grades.length) : 0;
    
    const stats = [
        { icon: 'blue', label: 'الطلاب', value: students.length },
        { icon: 'green', label: 'المعلمون', value: teachers.length },
        { icon: 'orange', label: 'الفصول', value: classes.length },
        { icon: 'purple', label: 'المواد', value: subjects.length },
        { icon: 'red', label: 'نسبة الحضور', value: rate + '%' },
        { icon: 'teal', label: 'المعدل العام', value: avg }
    ];
    
    const grid = document.getElementById('statsGrid');
    if (grid) {
        grid.innerHTML = stats.map(s => `
            <div class="stat-card">
                <div class="icon ${s.icon}">${s.icon === 'blue' ? '👨‍🎓' : s.icon === 'green' ? '👨‍🏫' : s.icon === 'orange' ? '🏫' : s.icon === 'purple' ? '📚' : s.icon === 'red' ? '✅' : '⭐'}</div>
                <div class="info"><span>${s.value}</span><small>${s.label}</small></div>
            </div>
        `).join('');
    }
    
    drawCharts();
    renderTopStudents();
}

function drawCharts() {
    const data = getData();
    
    const classCount = {};
    data.students?.forEach(s => {
        classCount[s.class] = (classCount[s.class] || 0) + 1;
    });
    const labels = Object.keys(classCount);
    const values = Object.values(classCount);
    
    const ctx1 = document.getElementById('classChart')?.getContext('2d');
    if (ctx1) {
        if (classChartInstance) classChartInstance.destroy();
        classChartInstance = new Chart(ctx1, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'عدد الطلاب', data: values, backgroundColor: '#4f46e5', borderRadius: 6 }] },
            options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
    }
    
    const ranges = { '0-49': 0, '50-69': 0, '70-89': 0, '90-100': 0 };
    data.grades?.forEach(g => {
        if (g.score < 50) ranges['0-49']++;
        else if (g.score < 70) ranges['50-69']++;
        else if (g.score < 90) ranges['70-89']++;
        else ranges['90-100']++;
    });
    const ctx2 = document.getElementById('gradeChart')?.getContext('2d');
    if (ctx2) {
        if (gradeChartInstance) gradeChartInstance.destroy();
        gradeChartInstance = new Chart(ctx2, {
            type: 'doughnut',
            data: { labels: Object.keys(ranges), datasets: [{ data: Object.values(ranges), backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'] }] },
            options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }
        });
    }
    
    const attendance = data.attendance || [];
    const days = [];
    const presentCount = [];
    const absentCount = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        days.push(d.toLocaleDateString('ar-SA', { weekday: 'short' }));
        const present = attendance.filter(a => a.date === dateStr && a.status === 'حاضر').length;
        const absent = attendance.filter(a => a.date === dateStr && a.status === 'غائب').length;
        presentCount.push(present);
        absentCount.push(absent);
    }
    const ctx3 = document.getElementById('attendanceChart')?.getContext('2d');
    if (ctx3) {
        if (attendanceChartInstance) attendanceChartInstance.destroy();
        attendanceChartInstance = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    { label: '✅ حاضر', data: presentCount, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.3 },
                    { label: '❌ غائب', data: absentCount, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.3 }
                ]
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
    }
}

function renderTopStudents() {
    const data = getData();
    const container = document.getElementById('topStudentsList');
    if (!container) return;
    
    const students = data.students || [];
    const grades = data.grades || [];
    const avgScores = students.map(s => {
        const studentGrades = grades.filter(g => g.studentId === s.id);
        const avg = studentGrades.length > 0 ? Math.round(studentGrades.reduce((sum, g) => sum + g.score, 0) / studentGrades.length) : 0;
        return { ...s, avg };
    });
    const top = avgScores.sort((a, b) => b.avg - a.avg).slice(0, 5);
    
    container.innerHTML = top.map((s, i) => `
        <div class="top-student-item">
            <span class="rank">#${i + 1}</span>
            <span class="name">${s.name}</span>
            <span class="score">${s.avg}</span>
        </div>
    `).join('');
}

// ============================================
// إدارة الطلاب
// ============================================
function renderStudents() {
    const data = getData();
    const classFilter = document.getElementById('filterClass')?.value;
    const statusFilter = document.getElementById('filterStatus')?.value;
    let students = data.students || [];
    if (classFilter) students = students.filter(s => s.class == classFilter);
    if (statusFilter) students = students.filter(s => s.status === statusFilter);
    
    const tbody = document.getElementById('studentsList');
    if (!tbody) return;
    tbody.innerHTML = students.map((s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${s.name}</strong></td>
            <td>${s.class}</td>
            <td>${s.age}</td>
            <td>${s.gender}</td>
            <td>${s.phone || '-'}</td>
            <td>${s.address || '-'}</td>
            <td>${s.parent || '-'}</td>
            <td><span class="status-${s.status === 'نشط' ? 'present' : 'absent'}">${s.status}</span></td>
            <td class="actions">
                <button class="edit" onclick="editStudent(${s.id})"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="deleteStudent(${s.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    
    const count = document.getElementById('studentCount');
    if (count) count.textContent = students.length + ' طالب';
}

function showStudentModal(data = null) {
    const modal = document.getElementById('studentModal');
    if (!modal) return;
    modal.classList.add('show');
    document.getElementById('studentModalTitle').textContent = data ? 'تعديل طالب' : 'إضافة طالب';
    populateAllSelects();
    if (data) {
        document.getElementById('studentEditId').value = data.id;
        document.getElementById('sName').value = data.name;
        document.getElementById('sClass').value = data.class;
        document.getElementById('sAge').value = data.age;
        document.getElementById('sGender').value = data.gender;
        document.getElementById('sPhone').value = data.phone || '';
        document.getElementById('sAddress').value = data.address || '';
        document.getElementById('sParent').value = data.parent || '';
        document.getElementById('sStatus').value = data.status || 'نشط';
    } else {
        document.getElementById('studentForm').reset();
        document.getElementById('studentEditId').value = '';
    }
}

document.getElementById('studentForm')?.addEventListener('submit', function(e) {
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
        parent: document.getElementById('sParent').value,
        status: document.getElementById('sStatus').value
    };
    if (id) {
        const index = (data.students || []).findIndex(s => s.id === id);
        if (index !== -1) data.students[index] = { ...data.students[index], ...studentData };
    } else {
        studentData.id = getNextId('students');
        if (!data.students) data.students = [];
        data.students.push(studentData);
    }
    saveData(data);
    closeModal('studentModal');
    renderStudents();
    updateDashboard();
    populateAllSelects();
    showToast('✅ تم حفظ الطالب');
});

function editStudent(id) {
    const data = getData();
    const student = (data.students || []).find(s => s.id === id);
    if (student) showStudentModal(student);
}

function deleteStudent(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا الطالب؟')) return;
    const data = getData();
    data.students = (data.students || []).filter(s => s.id !== id);
    saveData(data);
    renderStudents();
    updateDashboard();
    populateAllSelects();
    showToast('🗑️ تم الحذف');
}

// ============================================
// إدارة المعلمين
// ============================================
function renderTeachers() {
    const data = getData();
    const tbody = document.getElementById('teachersList');
    if (!tbody) return;
    tbody.innerHTML = (data.teachers || []).map((t, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${t.name}</strong></td>
            <td>${t.subject}</td>
            <td>${t.specialization || '-'}</td>
            <td>${t.phone || '-'}</td>
            <td>${t.email || '-'}</td>
            <td>${t.salary ? t.salary + ' ر.س' : '-'}</td>
            <td>${t.hireDate || '-'}</td>
            <td class="actions">
                <button class="edit" onclick="editTeacher(${t.id})"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="deleteTeacher(${t.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    const count = document.getElementById('teacherCount');
    if (count) count.textContent = (data.teachers || []).length + ' معلم';
}

function showTeacherModal(data = null) {
    const modal = document.getElementById('teacherModal');
    if (!modal) return;
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
        document.getElementById('tHireDate').value = data.hireDate || '';
    } else {
        document.getElementById('teacherForm').reset();
        document.getElementById('teacherEditId').value = '';
    }
}

document.getElementById('teacherForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('teacherEditId').value);
    const teacherData = {
        name: document.getElementById('tName').value,
        subject: document.getElementById('tSubject').value,
        specialization: document.getElementById('tSpecialization').value,
        phone: document.getElementById('tPhone').value,
        email: document.getElementById('tEmail').value,
        salary: parseFloat(document.getElementById('tSalary').value) || 0,
        hireDate: document.getElementById('tHireDate').value
    };
    if (id) {
        const index = (data.teachers || []).findIndex(t => t.id === id);
        if (index !== -1) data.teachers[index] = { ...data.teachers[index], ...teacherData };
    } else {
        teacherData.id = getNextId('teachers');
        if (!data.teachers) data.teachers = [];
        data.teachers.push(teacherData);
    }
    saveData(data);
    closeModal('teacherModal');
    renderTeachers();
    updateDashboard();
    populateAllSelects();
    showToast('✅ تم حفظ المعلم');
});

function editTeacher(id) {
    const data = getData();
    const teacher = (data.teachers || []).find(t => t.id === id);
    if (teacher) showTeacherModal(teacher);
}

function deleteTeacher(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المعلم؟')) return;
    const data = getData();
    data.teachers = (data.teachers || []).filter(t => t.id !== id);
    saveData(data);
    renderTeachers();
    updateDashboard();
    populateAllSelects();
    showToast('🗑️ تم الحذف');
}

// ============================================
// إدارة الفصول
// ============================================
function renderClasses() {
    const data = getData();
    const tbody = document.getElementById('classesList');
    if (!tbody) return;
    tbody.innerHTML = (data.classes || []).map((c, i) => {
        const studentCount = (data.students || []).filter(s => s.class == c.id).length;
        return `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${c.name}</strong></td>
                <td>${c.stage}</td>
                <td>${studentCount}</td>
                <td>${c.supervisor || '-'}</td>
                <td>${c.room || '-'}</td>
                <td>${c.capacity || '-'}</td>
                <td class="actions">
                    <button class="edit" onclick="editClass(${c.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteClass(${c.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
    const count = document.getElementById('classCount');
    if (count) count.textContent = (data.classes || []).length + ' فصل';
}

function showClassModal(data = null) {
    const modal = document.getElementById('classModal');
    if (!modal) return;
    modal.classList.add('show');
    if (data) {
        document.getElementById('classEditId').value = data.id;
        document.getElementById('cName').value = data.name;
        document.getElementById('cStage').value = data.stage;
        document.getElementById('cSupervisor').value = data.supervisor || '';
        document.getElementById('cRoom').value = data.room || '';
        document.getElementById('cCapacity').value = data.capacity || '';
    } else {
        document.getElementById('classForm').reset();
        document.getElementById('classEditId').value = '';
    }
}

document.getElementById('classForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('classEditId').value);
    const classData = {
        name: document.getElementById('cName').value,
        stage: document.getElementById('cStage').value,
        supervisor: document.getElementById('cSupervisor').value,
        room: document.getElementById('cRoom').value,
        capacity: parseInt(document.getElementById('cCapacity').value) || 0
    };
    if (id) {
        const index = (data.classes || []).findIndex(c => c.id === id);
        if (index !== -1) data.classes[index] = { ...data.classes[index], ...classData };
    } else {
        classData.id = getNextId('classes');
        if (!data.classes) data.classes = [];
        data.classes.push(classData);
    }
    saveData(data);
    closeModal('classModal');
    renderClasses();
    updateDashboard();
    populateAllSelects();
    showToast('✅ تم حفظ الفصل');
});

function editClass(id) {
    const data = getData();
    const cls = (data.classes || []).find(c => c.id === id);
    if (cls) showClassModal(cls);
}

function deleteClass(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا الفصل؟')) return;
    const data = getData();
    data.classes = (data.classes || []).filter(c => c.id !== id);
    saveData(data);
    renderClasses();
    updateDashboard();
    populateAllSelects();
    showToast('🗑️ تم الحذف');
}

// ============================================
// إدارة المواد
// ============================================
function renderSubjects() {
    const data = getData();
    const tbody = document.getElementById('subjectsList');
    if (!tbody) return;
    tbody.innerHTML = (data.subjects || []).map((s, i) => {
        const teacher = (data.teachers || []).find(t => t.id === s.teacherId);
        const cls = (data.classes || []).find(c => c.id === s.classId);
        return `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${s.name}</strong></td>
                <td>${teacher ? teacher.name : '-'}</td>
                <td>${cls ? cls.name : '-'}</td>
                <td>${s.hours || 0}</td>
                <td>${s.maxScore || 100}</td>
                <td class="actions">
                    <button class="edit" onclick="editSubject(${s.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteSubject(${s.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
    const count = document.getElementById('subjectCount');
    if (count) count.textContent = (data.subjects || []).length + ' مادة';
}

function showSubjectModal(data = null) {
    const modal = document.getElementById('subjectModal');
    if (!modal) return;
    modal.classList.add('show');
    populateAllSelects();
    if (data) {
        document.getElementById('subjectEditId').value = data.id;
        document.getElementById('subName').value = data.name;
        document.getElementById('subTeacher').value = data.teacherId;
        document.getElementById('subClass').value = data.classId;
        document.getElementById('subHours').value = data.hours || 0;
        document.getElementById('subMaxScore').value = data.maxScore || 100;
    } else {
        document.getElementById('subjectForm').reset();
        document.getElementById('subjectEditId').value = '';
    }
}

document.getElementById('subjectForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('subjectEditId').value);
    const subjectData = {
        name: document.getElementById('subName').value,
        teacherId: parseInt(document.getElementById('subTeacher').value),
        classId: parseInt(document.getElementById('subClass').value),
        hours: parseInt(document.getElementById('subHours').value) || 0,
        maxScore: parseInt(document.getElementById('subMaxScore').value) || 100
    };
    if (id) {
        const index = (data.subjects || []).findIndex(s => s.id === id);
        if (index !== -1) data.subjects[index] = { ...data.subjects[index], ...subjectData };
    } else {
        subjectData.id = getNextId('subjects');
        if (!data.subjects) data.subjects = [];
        data.subjects.push(subjectData);
    }
    saveData(data);
    closeModal('subjectModal');
    renderSubjects();
    updateDashboard();
    populateAllSelects();
    showToast('✅ تم حفظ المادة');
});

function editSubject(id) {
    const data = getData();
    const subject = (data.subjects || []).find(s => s.id === id);
    if (subject) showSubjectModal(subject);
}

function deleteSubject(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذه المادة؟')) return;
    const data = getData();
    data.subjects = (data.subjects || []).filter(s => s.id !== id);
    saveData(data);
    renderSubjects();
    updateDashboard();
    populateAllSelects();
    showToast('🗑️ تم الحذف');
}

// ============================================
// جدول الحصص
// ============================================
function renderTimetable() {
    const data = getData();
    const classId = parseInt(document.getElementById('timetableClass')?.value);
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    const periods = [1, 2, 3, 4, 5, 6];
    const tbody = document.getElementById('timetableList');
    if (!tbody) return;
    
    let timetable = data.timetable || [];
    if (classId) timetable = timetable.filter(t => t.classId === classId);
    
    tbody.innerHTML = days.map(day => {
        const daySlots = periods.map(p => {
            const slot = timetable.find(t => t.day === day && t.period === p);
            if (slot) {
                const subject = (data.subjects || []).find(s => s.id === slot.subjectId);
                return subject ? subject.name : '-';
            }
            return '-';
        });
        return `<tr><td><strong>${day}</strong></td>${daySlots.map(s => `<td>${s}</td>`).join('')}</tr>`;
    }).join('');
}

function showTimetableModal(data = null) {
    const modal = document.getElementById('timetableModal');
    if (!modal) return;
    modal.classList.add('show');
    populateAllSelects();
    if (data) {
        document.getElementById('timetableEditId').value = data.id;
        document.getElementById('ttClass').value = data.classId;
        document.getElementById('ttDay').value = data.day;
        document.getElementById('ttPeriod').value = data.period;
        document.getElementById('ttSubject').value = data.subjectId;
    } else {
        document.getElementById('timetableForm').reset();
        document.getElementById('timetableEditId').value = '';
    }
}

document.getElementById('timetableForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('timetableEditId').value);
    const timetableData = {
        classId: parseInt(document.getElementById('ttClass').value),
        day: document.getElementById('ttDay').value,
        period: parseInt(document.getElementById('ttPeriod').value),
        subjectId: parseInt(document.getElementById('ttSubject').value)
    };
    if (id) {
        const index = (data.timetable || []).findIndex(t => t.id === id);
        if (index !== -1) data.timetable[index] = { ...data.timetable[index], ...timetableData };
    } else {
        const exists = (data.timetable || []).some(t => t.classId === timetableData.classId && t.day === timetableData.day && t.period === timetableData.period);
        if (exists) {
            showToast('⚠️ هذه الحصة موجودة مسبقاً!', 'error');
            return;
        }
        timetableData.id = getNextId('timetable');
        if (!data.timetable) data.timetable = [];
        data.timetable.push(timetableData);
    }
    saveData(data);
    closeModal('timetableModal');
    renderTimetable();
    showToast('✅ تم حفظ الحصة');
});

// ============================================
// الحضور
// ============================================
function loadAttendanceStudents() {
    const data = getData();
    const classId = parseInt(document.getElementById('attendanceClass')?.value);
    const dateInput = document.getElementById('attendanceDate');
    if (!dateInput) return;
    if (!dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    const date = dateInput.value;
    let students = data.students || [];
    if (classId) students = students.filter(s => s.class == classId);
    
    const tbody = document.getElementById('attendanceList');
    if (!tbody) return;
    tbody.innerHTML = students.map((s, i) => {
        const existing = (data.attendance || []).find(a => a.studentId === s.id && a.date === date);
        const status = existing ? existing.status : 'غائب';
        return `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${s.name}</strong></td>
                <td><span class="status-${status === 'حاضر' ? 'present' : status === 'متأخر' ? 'late' : 'absent'}">${status === 'حاضر' ? '✅ حاضر' : status === 'متأخر' ? '⏰ متأخر' : '❌ غائب'}</span></td>
                <td>
                    <select onchange="updateAttendance(${s.id}, this.value)" style="padding:6px 10px;border-radius:8px;border:2px solid #e2e8f0;">
                        <option value="حاضر" ${status === 'حاضر' ? 'selected' : ''}>✅ حاضر</option>
                        <option value="غائب" ${status === 'غائب' ? 'selected' : ''}>❌ غائب</option>
                        <option value="متأخر" ${status === 'متأخر' ? 'selected' : ''}>⏰ متأخر</option>
                    </select>
                </td>
            </tr>
        `;
    }).join('');
    
    const present = (data.attendance || []).filter(a => a.date === date && a.status === 'حاضر').length;
    const absent = (data.attendance || []).filter(a => a.date === date && a.status === 'غائب').length;
    const late = (data.attendance || []).filter(a => a.date === date && a.status === 'متأخر').length;
    const total = students.length;
    const summary = document.getElementById('attendanceSummary');
    if (summary) {
        summary.innerHTML = `
            <h4>📊 ملخص الحضور - ${date}</h4>
            <div class="summary-stats">
                <span>👨‍🎓 الإجمالي: ${total}</span>
                <span style="color:#22c55e;">✅ حاضر: ${present}</span>
                <span style="color:#ef4444;">❌ غائب: ${absent}</span>
                <span style="color:#f59e0b;">⏰ متأخر: ${late}</span>
                <span>📈 نسبة الحضور: ${total > 0 ? Math.round((present / total) * 100) : 0}%</span>
            </div>
        `;
    }
}

function updateAttendance(studentId, status) {
    const data = getData();
    const date = document.getElementById('attendanceDate').value;
    const existing = (data.attendance || []).find(a => a.studentId === studentId && a.date === date);
    if (existing) {
        existing.status = status;
    } else {
        if (!data.attendance) data.attendance = [];
        data.attendance.push({ id: getNextId('attendance'), studentId, date, status });
    }
    saveData(data);
    loadAttendanceStudents();
    updateDashboard();
}

function saveAttendance() {
    showToast('✅ تم حفظ سجل الحضور');
    loadAttendanceStudents();
}

// ============================================
// الدرجات
// ============================================
function loadGradeData() {
    const data = getData();
    const classId = parseInt(document.getElementById('gradeClass')?.value);
    const subjectId = parseInt(document.getElementById('gradeSubject')?.value);
    populateAllSelects();
    
    let grades = data.grades || [];
    if (subjectId) grades = grades.filter(g => g.subjectId === subjectId);
    if (classId) {
        const classStudents = (data.students || []).filter(s => s.class == classId).map(s => s.id);
        grades = grades.filter(g => classStudents.includes(g.studentId));
    }
    
    const tbody = document.getElementById('gradesList');
    if (!tbody) return;
    tbody.innerHTML = grades.map((g, i) => {
        const student = (data.students || []).find(s => s.id === g.studentId);
        const subject = (data.subjects || []).find(s => s.id === g.subjectId);
        const grade = getGradeLetter(g.score);
        return `
            <tr>
                <td>${i + 1}</td>
                <td>${student ? student.name : '-'}</td>
                <td>${subject ? subject.name : '-'}</td>
                <td><strong>${g.score}</strong></td>
                <td><span style="color:${grade.color};font-weight:700;">${grade.letter}</span></td>
                <td>${g.note || '-'}</td>
                <td class="actions">
                    <button class="edit" onclick="editGrade(${g.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteGrade(${g.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
    
    const avg = grades.length > 0 ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0;
    const summary = document.getElementById('gradesSummary');
    if (summary) {
        summary.innerHTML = `
            <h4>📊 ملخص الدرجات</h4>
            <div class="summary-stats">
                <span>📝 عدد الدرجات: ${grades.length}</span>
                <span>📈 المعدل: ${avg}</span>
                <span>🏆 الأعلى: ${grades.length > 0 ? Math.max(...grades.map(g => g.score)) : 0}</span>
                <span>📉 الأدنى: ${grades.length > 0 ? Math.min(...grades.map(g => g.score)) : 0}</span>
            </div>
        `;
    }
}

function getGradeLetter(score) {
    if (score >= 90) return { letter: 'A', color: '#22c55e' };
    if (score >= 80) return { letter: 'B', color: '#3b82f6' };
    if (score >= 70) return { letter: 'C', color: '#f59e0b' };
    if (score >= 60) return { letter: 'D', color: '#f97316' };
    return { letter: 'F', color: '#ef4444' };
}

function showGradeModal(data = null) {
    const modal = document.getElementById('gradeModal');
    if (!modal) return;
    modal.classList.add('show');
    populateAllSelects();
    if (data) {
        document.getElementById('gradeEditId').value = data.id;
        document.getElementById('gStudent').value = data.studentId;
        document.getElementById('gSubject').value = data.subjectId;
        document.getElementById('gScore').value = data.score;
        document.getElementById('gNote').value = data.note || '';
    } else {
        document.getElementById('gradeForm').reset();
        document.getElementById('gradeEditId').value = '';
    }
}

document.getElementById('gradeForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('gradeEditId').value);
    const gradeData = {
        studentId: parseInt(document.getElementById('gStudent').value),
        subjectId: parseInt(document.getElementById('gSubject').value),
        score: parseFloat(document.getElementById('gScore').value),
        note: document.getElementById('gNote').value
    };
    if (id) {
        const index = (data.grades || []).findIndex(g => g.id === id);
        if (index !== -1) data.grades[index] = { ...data.grades[index], ...gradeData };
    } else {
        gradeData.id = getNextId('grades');
        if (!data.grades) data.grades = [];
        data.grades.push(gradeData);
    }
    saveData(data);
    closeModal('gradeModal');
    loadGradeData();
    updateDashboard();
    populateAllSelects();
    showToast('✅ تم حفظ الدرجة');
});

function editGrade(id) {
    const data = getData();
    const grade = (data.grades || []).find(g => g.id === id);
    if (grade) showGradeModal(grade);
}

function deleteGrade(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذه الدرجة؟')) return;
    const data = getData();
    data.grades = (data.grades || []).filter(g => g.id !== id);
    saveData(data);
    loadGradeData();
    updateDashboard();
    showToast('🗑️ تم الحذف');
}

// ============================================
// الامتحانات
// ============================================
function renderExams() {
    const data = getData();
    const tbody = document.getElementById('examsList');
    if (!tbody) return;
    tbody.innerHTML = (data.exams || []).map((e, i) => {
        const subject = (data.subjects || []).find(s => s.id === e.subjectId);
        const cls = (data.classes || []).find(c => c.id === e.classId);
        return `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${e.name}</strong></td>
                <td>${subject ? subject.name : '-'}</td>
                <td>${cls ? cls.name : '-'}</td>
                <td>${e.date || '-'}</td>
                <td>${e.time || '-'}</td>
                <td>${e.maxScore || 100}</td>
                <td class="actions">
                    <button class="edit" onclick="editExam(${e.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteExam(${e.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function showExamModal(data = null) {
    const modal = document.getElementById('examModal');
    if (!modal) return;
    modal.classList.add('show');
    populateAllSelects();
    if (data) {
        document.getElementById('examEditId').value = data.id;
        document.getElementById('exName').value = data.name;
        document.getElementById('exSubject').value = data.subjectId;
        document.getElementById('exClass').value = data.classId;
        document.getElementById('exDate').value = data.date || '';
        document.getElementById('exTime').value = data.time || '';
        document.getElementById('exMaxScore').value = data.maxScore || 100;
    } else {
        document.getElementById('examForm').reset();
        document.getElementById('examEditId').value = '';
    }
}

document.getElementById('examForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('examEditId').value);
    const examData = {
        name: document.getElementById('exName').value,
        subjectId: parseInt(document.getElementById('exSubject').value),
        classId: parseInt(document.getElementById('exClass').value),
        date: document.getElementById('exDate').value,
        time: document.getElementById('exTime').value,
        maxScore: parseInt(document.getElementById('exMaxScore').value) || 100
    };
    if (id) {
        const index = (data.exams || []).findIndex(e => e.id === id);
        if (index !== -1) data.exams[index] = { ...data.exams[index], ...examData };
    } else {
        examData.id = getNextId('exams');
        if (!data.exams) data.exams = [];
        data.exams.push(examData);
    }
    saveData(data);
    closeModal('examModal');
    renderExams();
    showToast('✅ تم حفظ الامتحان');
});

function editExam(id) {
    const data = getData();
    const exam = (data.exams || []).find(e => e.id === id);
    if (exam) showExamModal(exam);
}

function deleteExam(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا الامتحان؟')) return;
    const data = getData();
    data.exams = (data.exams || []).filter(e => e.id !== id);
    saveData(data);
    renderExams();
    showToast('🗑️ تم الحذف');
}

// ============================================
// المصروفات
// ============================================
function renderFees() {
    const data = getData();
    const tbody = document.getElementById('feesList');
    if (!tbody) return;
    tbody.innerHTML = (data.fees || []).map((f, i) => {
        const student = (data.students || []).find(s => s.id === f.studentId);
        return `
            <tr>
                <td>${i + 1}</td>
                <td>${student ? student.name : '-'}</td>
                <td>${f.type}</td>
                <td><strong>${f.amount} ر.س</strong></td>
                <td>${f.date || '-'}</td>
                <td><span class="status-${f.status === 'مدفوع' ? 'present' : 'absent'}">${f.status}</span></td>
                <td class="actions">
                    <button class="edit" onclick="editFee(${f.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteFee(${f.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
    
    const fees = data.fees || [];
    const total = fees.reduce((s, f) => s + (f.amount || 0), 0);
    const paid = fees.filter(f => f.status === 'مدفوع').reduce((s, f) => s + (f.amount || 0), 0);
    const summary = document.getElementById('feesSummary');
    if (summary) {
        summary.innerHTML = `
            <h4>💰 ملخص المصروفات</h4>
            <div class="summary-stats">
                <span>💵 الإجمالي: ${total} ر.س</span>
                <span style="color:#22c55e;">✅ المدفوع: ${paid} ر.س</span>
                <span style="color:#ef4444;">❌ غير المدفوع: ${total - paid} ر.س</span>
                <span>📊 عدد السجلات: ${fees.length}</span>
            </div>
        `;
    }
}

function showFeeModal(data = null) {
    const modal = document.getElementById('feeModal');
    if (!modal) return;
    modal.classList.add('show');
    populateAllSelects();
    if (data) {
        document.getElementById('feeEditId').value = data.id;
        document.getElementById('fStudent').value = data.studentId;
        document.getElementById('fType').value = data.type;
        document.getElementById('fAmount').value = data.amount;
        document.getElementById('fDate').value = data.date || '';
        document.getElementById('fStatus').value = data.status || 'غير مدفوع';
    } else {
        document.getElementById('feeForm').reset();
        document.getElementById('feeEditId').value = '';
        document.getElementById('fDate').value = new Date().toISOString().split('T')[0];
    }
}

document.getElementById('feeForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('feeEditId').value);
    const feeData = {
        studentId: parseInt(document.getElementById('fStudent').value),
        type: document.getElementById('fType').value,
        amount: parseFloat(document.getElementById('fAmount').value),
        date: document.getElementById('fDate').value,
        status: document.getElementById('fStatus').value
    };
    if (id) {
        const index = (data.fees || []).findIndex(f => f.id === id);
        if (index !== -1) data.fees[index] = { ...data.fees[index], ...feeData };
    } else {
        feeData.id = getNextId('fees');
        if (!data.fees) data.fees = [];
        data.fees.push(feeData);
    }
    saveData(data);
    closeModal('feeModal');
    renderFees();
    showToast('✅ تم حفظ المصروف');
});

function editFee(id) {
    const data = getData();
    const fee = (data.fees || []).find(f => f.id === id);
    if (fee) showFeeModal(fee);
}

function deleteFee(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المصروف؟')) return;
    const data = getData();
    data.fees = (data.fees || []).filter(f => f.id !== id);
    saveData(data);
    renderFees();
    showToast('🗑️ تم الحذف');
}

// ============================================
// المكتبة
// ============================================
function renderLibrary() {
    const data = getData();
    const tbody = document.getElementById('libraryList');
    if (!tbody) return;
    tbody.innerHTML = (data.library || []).map((b, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${b.title}</strong></td>
            <td>${b.author}</td>
            <td>${b.category || '-'}</td>
            <td>${b.copies || 0}</td>
            <td>${b.available || 0}</td>
            <td class="actions">
                <button class="edit" onclick="editBook(${b.id})"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="deleteBook(${b.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function showBookModal(data = null) {
    const modal = document.getElementById('bookModal');
    if (!modal) return;
    modal.classList.add('show');
    if (data) {
        document.getElementById('bookEditId').value = data.id;
        document.getElementById('bTitle').value = data.title;
        document.getElementById('bAuthor').value = data.author;
        document.getElementById('bCategory').value = data.category || '';
        document.getElementById('bCopies').value = data.copies || 1;
        document.getElementById('bAvailable').value = data.available || 1;
    } else {
        document.getElementById('bookForm').reset();
        document.getElementById('bookEditId').value = '';
    }
}

document.getElementById('bookForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('bookEditId').value);
    const bookData = {
        title: document.getElementById('bTitle').value,
        author: document.getElementById('bAuthor').value,
        category: document.getElementById('bCategory').value,
        copies: parseInt(document.getElementById('bCopies').value) || 1,
        available: parseInt(document.getElementById('bAvailable').value) || 1
    };
    if (id) {
        const index = (data.library || []).findIndex(b => b.id === id);
        if (index !== -1) data.library[index] = { ...data.library[index], ...bookData };
    } else {
        bookData.id = getNextId('library');
        if (!data.library) data.library = [];
        data.library.push(bookData);
    }
    saveData(data);
    closeModal('bookModal');
    renderLibrary();
    showToast('✅ تم حفظ الكتاب');
});

function editBook(id) {
    const data = getData();
    const book = (data.library || []).find(b => b.id === id);
    if (book) showBookModal(book);
}

function deleteBook(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا الكتاب؟')) return;
    const data = getData();
    data.library = (data.library || []).filter(b => b.id !== id);
    saveData(data);
    renderLibrary();
    showToast('🗑️ تم الحذف');
}

// ============================================
// الفعاليات
// ============================================
function renderEvents() {
    const data = getData();
    const container = document.getElementById('eventsList');
    if (!container) return;
    container.innerHTML = (data.events || []).map(e => `
        <div class="event-card">
            <div class="date">📅 ${e.date || 'تاريخ غير محدد'}</div>
            <h4>${e.title}</h4>
            <p>📍 ${e.location || 'المكان غير محدد'}</p>
            <p style="font-size:13px;color:#64748b;">${e.description || ''}</p>
            <div style="margin-top:10px;">
                <button class="edit" onclick="editEvent(${e.id})" style="padding:4px 12px;border:none;border-radius:6px;background:#dbeafe;color:#2563eb;cursor:pointer;"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="deleteEvent(${e.id})" style="padding:4px 12px;border:none;border-radius:6px;background:#fee2e2;color:#dc2626;cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function showEventModal(data = null) {
    const modal = document.getElementById('eventModal');
    if (!modal) return;
    modal.classList.add('show');
    if (data) {
        document.getElementById('eventEditId').value = data.id;
        document.getElementById('eTitle').value = data.title;
        document.getElementById('eDate').value = data.date || '';
        document.getElementById('eLocation').value = data.location || '';
        document.getElementById('eDesc').value = data.description || '';
    } else {
        document.getElementById('eventForm').reset();
        document.getElementById('eventEditId').value = '';
    }
}

document.getElementById('eventForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const id = parseInt(document.getElementById('eventEditId').value);
    const eventData = {
        title: document.getElementById('eTitle').value,
        date: document.getElementById('eDate').value,
        location: document.getElementById('eLocation').value,
        description: document.getElementById('eDesc').value
    };
    if (id) {
        const index = (data.events || []).findIndex(e => e.id === id);
        if (index !== -1) data.events[index] = { ...data.events[index], ...eventData };
    } else {
        eventData.id = getNextId('events');
        if (!data.events) data.events = [];
        data.events.push(eventData);
    }
    saveData(data);
    closeModal('eventModal');
    renderEvents();
    showToast('✅ تم حفظ الفعالية');
});

function editEvent(id) {
    const data = getData();
    const event = (data.events || []).find(e => e.id === id);
    if (event) showEventModal(event);
}

function deleteEvent(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذه الفعالية؟')) return;
    const data = getData();
    data.events = (data.events || []).filter(e => e.id !== id);
    saveData(data);
    renderEvents();
    showToast('🗑️ تم الحذف');
}

// ============================================
// الرسائل
// ============================================
function renderMessages() {
    const data = getData();
    const container = document.getElementById('messagesList');
    if (!container) return;
    container.innerHTML = (data.messages || []).map(m => `
        <div class="message-item" style="${m.read ? 'border-right-color:#94a3b8;' : ''}">
            <div class="subject">${m.subject} ${!m.read ? '🔴' : ''}</div>
            <div class="body">${m.body}</div>
            <div class="meta">📤 من: ${m.from} | 📅 ${new Date(m.date).toLocaleString('ar-SA')} | إلى: ${m.to === 'all' ? 'الجميع' : m.to}</div>
        </div>
    `).join('');
}

function showMessageModal() {
    const modal = document.getElementById('messageModal');
    if (!modal) return;
    modal.classList.add('show');
    document.getElementById('messageForm').reset();
}

document.getElementById('messageForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const messageData = {
        id: getNextId('messages'),
        from: 'إدارة المدرسة',
        to: document.getElementById('mRecipient').value,
        subject: document.getElementById('mSubject').value,
        body: document.getElementById('mBody').value,
        date: new Date().toISOString(),
        read: false
    };
    if (!data.messages) data.messages = [];
    data.messages.unshift(messageData);
    saveData(data);
    closeModal('messageModal');
    renderMessages();
    updateNotifications();
    showToast('✅ تم إرسال الرسالة');
});

// ============================================
// التقارير
// ============================================
function generateReport(type) {
    const data = getData();
    const output = document.getElementById('reportOutput');
    if (!output) return;
    let html = '';
    
    switch(type) {
        case 'students':
            const classCount = {};
            (data.students || []).forEach(s => {
                classCount[s.class] = (classCount[s.class] || 0) + 1;
            });
            html = `
                <h3>📊 تقرير الطلاب</h3>
                <p>إجمالي الطلاب: <strong>${(data.students || []).length}</strong></p>
                <div style="margin:15px 0;">
                    ${Object.entries(classCount).map(([cls, count]) => 
                        `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0;">
                            <span>${cls}</span>
                            <span><strong>${count}</strong> طالب</span>
                        </div>`
                    ).join('')}
                </div>
                <p>نشط: ${(data.students || []).filter(s => s.status === 'نشط').length} | غير نشط: ${(data.students || []).filter(s => s.status !== 'نشط').length}</p>
            `;
            break;
        case 'attendance':
            const total = (data.attendance || []).length;
            const present = (data.attendance || []).filter(a => a.status === 'حاضر').length;
            const absent = (data.attendance || []).filter(a => a.status === 'غائب').length;
            const late = (data.attendance || []).filter(a => a.status === 'متأخر').length;
            html = `
                <h3>📊 تقرير الحضور</h3>
                <p>إجمالي السجلات: <strong>${total}</strong></p>
                <div style="margin:15px 0;">
                    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0;">
                        <span>✅ حاضر</span>
                        <span><strong>${present}</strong> (${total > 0 ? Math.round((present/total)*100) : 0}%)</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0;">
                        <span>❌ غائب</span>
                        <span><strong>${absent}</strong> (${total > 0 ? Math.round((absent/total)*100) : 0}%)</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:6px 0;">
                        <span>⏰ متأخر</span>
                        <span><strong>${late}</strong> (${total > 0 ? Math.round((late/total)*100) : 0}%)</span>
                    </div>
                </div>
            `;
            break;
        case 'grades':
            const grades = data.grades || [];
            const avg = grades.length > 0 ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0;
            const passed = grades.filter(g => g.score >= 60).length;
            html = `
                <h3>📊 تقرير الدرجات</h3>
                <p>إجمالي الدرجات: <strong>${grades.length}</strong></p>
                <p>المعدل العام: <strong>${avg}</strong></p>
                <p>نسبة النجاح: <strong>${grades.length > 0 ? Math.round((passed/grades.length)*100) : 0}%</strong></p>
                <div style="margin:15px 0;">
                    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0;">
                        <span>🟢 ممتاز (90-100)</span>
                        <span>${grades.filter(g => g.score >= 90).length}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0;">
                        <span>🔵 جيد جداً (80-89)</span>
                        <span>${grades.filter(g => g.score >= 80 && g.score < 90).length}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0;">
                        <span>🟡 جيد (70-79)</span>
                        <span>${grades.filter(g => g.score >= 70 && g.score < 80).length}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0;">
                        <span>🟠 مقبول (60-69)</span>
                        <span>${grades.filter(g => g.score >= 60 && g.score < 70).length}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:6px 0;">
                        <span>🔴 راسب (أقل من 60)</span>
                        <span>${grades.filter(g => g.score < 60).length}</span>
                    </div>
                </div>
            `;
            break;
        case 'teachers':
            const teachers = data.teachers || [];
            const totalSalary = teachers.reduce((s, t) => s + (t.salary || 0), 0);
            html = `
                <h3>📊 تقرير المعلمين</h3>
                <p>إجمالي المعلمين: <strong>${teachers.length}</strong></p>
                <p>إجمالي الرواتب: <strong>${totalSalary} ر.س</strong></p>
                <p>متوسط الراتب: <strong>${teachers.length > 0 ? Math.round(totalSalary / teachers.length) : 0} ر.س</strong></p>
                <div style="margin:15px 0;">
                    ${teachers.map(t => `
                        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0;">
                            <span>${t.name}</span>
                            <span>${t.subject} | ${t.salary || 0} ر.س</span>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        case 'fees':
            const fees = data.fees || [];
            const totalFees = fees.reduce((s, f) => s + (f.amount || 0), 0);
            const paidFees = fees.filter(f => f.status === 'مدفوع').reduce((s, f) => s + (f.amount || 0), 0);
            html = `
                <h3>📊 تقرير المصروفات</h3>
                <p>إجمالي المصروفات: <strong>${totalFees} ر.س</strong></p>
                <p>المدفوع: <strong style="color:#22c55e;">${paidFees} ر.س</strong></p>
                <p>غير المدفوع: <strong style="color:#ef4444;">${totalFees - paidFees} ر.س</strong></p>
                <p>عدد السجلات: <strong>${fees.length}</strong></p>
            `;
            break;
        case 'library':
            const books = data.library || [];
            const totalCopies = books.reduce((s, b) => s + (b.copies || 0), 0);
            const totalAvailable = books.reduce((s, b) => s + (b.available || 0), 0);
            html = `
                <h3>📊 تقرير المكتبة</h3>
                <p>إجمالي الكتب: <strong>${books.length}</strong></p>
                <p>إجمالي النسخ: <strong>${totalCopies}</strong></p>
                <p>النسخ المتاحة: <strong style="color:#22c55e;">${totalAvailable}</strong></p>
                <p>النسخ المستعارة: <strong style="color:#f59e0b;">${totalCopies - totalAvailable}</strong></p>
            `;
            break;
        case 'exams':
            const exams = data.exams || [];
            html = `
                <h3>📊 تقرير الامتحانات</h3>
                <p>إجمالي الامتحانات: <strong>${exams.length}</strong></p>
                <div style="margin:15px 0;">
                    ${exams.map(e => `
                        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0;">
                            <span>${e.name}</span>
                            <span>${e.date || 'تاريخ غير محدد'}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        case 'full':
            html = `
                <h3>📊 التقرير الشامل للمدرسة</h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0;">
                    <div style="background:#f1f5f9;padding:16px;border-radius:12px;">
                        <h4>👨‍🎓 الطلاب</h4>
                        <p>الإجمالي: ${(data.students || []).length}</p>
                        <p>نشط: ${(data.students || []).filter(s => s.status === 'نشط').length}</p>
                    </div>
                    <div style="background:#f1f5f9;padding:16px;border-radius:12px;">
                        <h4>👨‍🏫 المعلمون</h4>
                        <p>الإجمالي: ${(data.teachers || []).length}</p>
                        <p>المتوسط: ${(data.teachers || []).length > 0 ? Math.round((data.teachers || []).reduce((s,t) => s + (t.salary||0), 0) / (data.teachers || []).length) : 0} ر.س</p>
                    </div>
                    <div style="background:#f1f5f9;padding:16px;border-radius:12px;">
                        <h4>📚 المواد</h4>
                        <p>الإجمالي: ${(data.subjects || []).length}</p>
                    </div>
                    <div style="background:#f1f5f9;padding:16px;border-radius:12px;">
                        <h4>💰 المصروفات</h4>
                        <p>الإجمالي: ${(data.fees || []).reduce((s,f) => s + (f.amount||0), 0)} ر.س</p>
                    </div>
                </div>
                <p style="color:#64748b;">📅 تم إنشاء التقرير: ${new Date().toLocaleString('ar-SA')}</p>
            `;
            break;
        default:
            html = '<p style="color:#64748b;">اختر تقريراً من القائمة أعلاه</p>';
    }
    output.innerHTML = html;
    showToast('✅ تم إنشاء التقرير');
}

// ============================================
// الإعدادات
// ============================================
function updateSettingsStats() {
    const data = getData();
    const total = (data.students?.length || 0) + (data.teachers?.length || 0) + (data.classes?.length || 0) + 
                  (data.subjects?.length || 0) + (data.attendance?.length || 0) + (data.grades?.length || 0) +
                  (data.exams?.length || 0) + (data.fees?.length || 0) + (data.library?.length || 0) +
                  (data.events?.length || 0) + (data.messages?.length || 0);
    document.getElementById('statsRecords').textContent = total;
    const size = new Blob([JSON.stringify(data)]).size;
    document.getElementById('statsSize').textContent = (size / 1024).toFixed(1) + ' KB';
    document.getElementById('statsLastUpdate').textContent = new Date().toLocaleString('ar-SA');
}

function loadSchoolInfo() {
    const settings = getSettings();
    document.getElementById('schoolName').value = settings.schoolName || '';
    document.getElementById('schoolAddress').value = settings.address || '';
    document.getElementById('schoolPhone').value = settings.phone || '';
}

document.getElementById('schoolInfoForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const settings = {
        schoolName: document.getElementById('schoolName').value,
        address: document.getElementById('schoolAddress').value,
        phone: document.getElementById('schoolPhone').value
    };
    saveSettings(settings);
    showToast('✅ تم حفظ معلومات المدرسة');
});

document.getElementById('changePasswordForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const old = document.getElementById('oldPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const users = getUsers();
    const current = JSON.parse(localStorage.getItem('current_user'));
    const user = users.find(u => u.id === current.id);
    if (user && user.password === old) {
        user.password = newPass;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        showToast('✅ تم تغيير كلمة المرور');
        this.reset();
    } else {
        showToast('❌ كلمة المرور القديمة غير صحيحة!', 'error');
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
                showToast('✅ تم استعادة البيانات');
                setTimeout(() => location.reload(), 1000);
            } catch(err) {
                showToast('❌ ملف غير صالح!', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function resetAllData() {
    if (!confirm('⚠️ تحذير: سيتم حذف كل البيانات! هل أنت متأكد؟')) return;
    if (!confirm('⚠️ تأكيد نهائي: حذف كل شيء؟')) return;
    localStorage.removeItem(DATA_KEY);
    initData();
    showToast('✅ تم إعادة تهيئة البيانات');
    setTimeout(() => location.reload(), 1000);
}

// ============================================
// تشغيل التطبيق
// ============================================
console.log('🏫 نظام إدارة المدرسة المتكامل - النسخة الذهبية 5.0');
console.log('📊 تم التحميل بنجاح!');
console.log('👤 المستخدم الافتراضي: admin / 123456');
console.log('📁 جميع البيانات مخزنة في localStorage');

// التحقق من وجود مستخدم مسجل دخول
const currentUserLogged = localStorage.getItem('current_user');
if (currentUserLogged) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    const user = JSON.parse(currentUserLogged);
    document.getElementById('currentUser').textContent = user.fullName || user.username;
    document.getElementById('currentRole').textContent = user.role || 'مستخدم';
    initApp();
    console.log('✅ مستخدم مسجل: ' + user.username);
} else {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
    console.log('🔑 انتظر تسجيل الدخول...');
}