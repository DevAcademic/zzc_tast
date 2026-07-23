// ============================================
// ديف أكاديمي - JavaScript الكامل
// مع ربط Supabase
// ============================================

// ===== إعداد Supabase =====
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== الثوابت =====
const USERS_KEY = 'dive_users';
const CURRENT_USER_KEY = 'dive_current_user';

// ===== بيانات عينة (للاختبار بدون قاعدة بيانات) =====
const SAMPLE_DATA = {
    courses: [
        { id: 1, title: 'الرياضيات المتقدمة', description: 'شرح كامل لمنهج الرياضيات', category: 'رياضيات', level: 'متقدم', teacher: 'د. أحمد', students: 45, image: '📐' },
        { id: 2, title: 'اللغة العربية', description: 'قواعد اللغة العربية بسهولة', category: 'لغات', level: 'مبتدئ', teacher: 'أ. سارة', students: 38, image: '📖' },
        { id: 3, title: 'علوم الفيزياء', description: 'فيزياء ممتعة وسهلة', category: 'علوم', level: 'متوسط', teacher: 'د. خالد', students: 52, image: '🔬' },
        { id: 4, title: 'برمجة بايثون', description: 'تعلم البرمجة من الصفر', category: 'برمجة', level: 'مبتدئ', teacher: 'م. محمد', students: 67, image: '🐍' },
        { id: 5, title: 'الأحياء البشرية', description: 'علم الأحياء للإنسان', category: 'علوم', level: 'متوسط', teacher: 'د. نورة', students: 31, image: '🧬' },
        { id: 6, title: 'اللغة الإنجليزية', description: 'إنجليزي للمبتدئين', category: 'لغات', level: 'مبتدئ', teacher: 'أ. جون', students: 55, image: '🇬🇧' }
    ],
    teachers: [
        { id: 1, name: 'د. أحمد الفهد', subject: 'الرياضيات', email: 'ahmed@dive.com' },
        { id: 2, name: 'أ. سارة الناصر', subject: 'اللغة العربية', email: 'sara@dive.com' },
        { id: 3, name: 'د. خالد العتيبي', subject: 'الفيزياء', email: 'khalid@dive.com' },
        { id: 4, name: 'م. محمد اليحيى', subject: 'البرمجة', email: 'mohammed@dive.com' }
    ],
    exams: [
        { id: 1, title: 'الاختبار النصفي - رياضيات', course: 'الرياضيات المتقدمة', date: '2026-08-15', status: 'upcoming' },
        { id: 2, title: 'الاختبار النهائي - عربي', course: 'اللغة العربية', date: '2026-08-20', status: 'upcoming' },
        { id: 3, title: 'اختبار الفصل الأول - فيزياء', course: 'علوم الفيزياء', date: '2026-08-10', status: 'completed' }
    ],
    grades: [
        { id: 1, course: 'الرياضيات المتقدمة', exam: 'الاختبار النصفي', score: 85, grade: 'B+', date: '2026-07-20' },
        { id: 2, course: 'اللغة العربية', exam: 'الاختبار الشهري', score: 92, grade: 'A', date: '2026-07-25' }
    ],
    messages: [
        { id: 1, from: 'د. أحمد', subject: 'مراجعة الامتحان', body: 'سيتم مراجعة الامتحان يوم الخميس القادم', date: '2026-07-28' },
        { id: 2, from: 'إدارة المدرسة', subject: 'إعلان مهم', body: 'تم إضافة دورات جديدة', date: '2026-07-27' }
    ]
};

// ===== المستخدمون الافتراضيون =====
const DEFAULT_USERS = [
    { id: 1, name: 'مدير المدرسة', email: 'admin@dive.com', password: '123456', role: 'admin' },
    { id: 2, name: 'طالب تجريبي', email: 'student@dive.com', password: '123456', role: 'student' },
    { id: 3, name: 'معلم تجريبي', email: 'teacher@dive.com', password: '123456', role: 'teacher' }
];

// ===== تهيئة البيانات =====
function initData() {
    if (!localStorage.getItem('dive_data')) {
        localStorage.setItem('dive_data', JSON.stringify(SAMPLE_DATA));
    }
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
}

// ===== دوال مساعدة =====
function getData() {
    return JSON.parse(localStorage.getItem('dive_data')) || SAMPLE_DATA;
}

function saveData(data) {
    localStorage.setItem('dive_data', JSON.stringify(data));
}

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || DEFAULT_USERS;
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
}

function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function generateId() {
    return Date.now() + Math.random() * 1000;
}

// ============================================
// المصادقة (تسجيل الدخول والتسجيل)
// ============================================

function showRegister() {
    document.querySelector('.login-box').style.display = 'none';
    document.getElementById('registerBox').style.display = 'block';
}

function showLogin() {
    document.querySelector('.login-box').style.display = 'block';
    document.getElementById('registerBox').style.display = 'none';
}

// تسجيل الدخول
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    // محاولة تسجيل الدخول عبر Supabase
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            // إذا فشل Supabase، استخدم التخزين المحلي
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                setCurrentUser(user);
                enterApp(user);
                showToast('مرحباً بك ' + user.name);
                return;
            }
            showToast('❌ بريد إلكتروني أو كلمة مرور غير صحيحة', 'error');
        } else {
            // نجاح تسجيل الدخول عبر Supabase
            const user = {
                id: data.user.id,
                name: data.user.user_metadata?.name || 'مستخدم',
                email: data.user.email,
                role: data.user.user_metadata?.role || 'student'
            };
            setCurrentUser(user);
            enterApp(user);
            showToast('مرحباً بك ' + user.name);
        }
    } catch (error) {
        // فشل Supabase، استخدم التخزين المحلي
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            enterApp(user);
            showToast('مرحباً بك ' + user.name);
        } else {
            showToast('❌ بريد إلكتروني أو كلمة مرور غير صحيحة', 'error');
        }
    }
});

// التسجيل
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const role = document.getElementById('regRole').value;

    // محاولة التسجيل عبر Supabase
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    role: role
                }
            }
        });

        if (error) {
            // إذا فشل Supabase، استخدم التخزين المحلي
            const users = getUsers();
            if (users.find(u => u.email === email)) {
                showToast('❌ هذا البريد مسجل مسبقاً', 'error');
                return;
            }
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password,
                role: role
            };
            users.push(newUser);
            saveUsers(users);
            setCurrentUser(newUser);
            enterApp(newUser);
            showToast('✅ تم إنشاء الحساب بنجاح');
            return;
        }

        if (data.user) {
            const newUser = {
                id: data.user.id,
                name: name,
                email: email,
                role: role
            };
            setCurrentUser(newUser);
            enterApp(newUser);
            showToast('✅ تم إنشاء الحساب بنجاح');
        }
    } catch (error) {
        // فشل Supabase، استخدم التخزين المحلي
        const users = getUsers();
        if (users.find(u => u.email === email)) {
            showToast('❌ هذا البريد مسجل مسبقاً', 'error');
            return;
        }
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: role
        };
        users.push(newUser);
        saveUsers(users);
        setCurrentUser(newUser);
        enterApp(newUser);
        showToast('✅ تم إنشاء الحساب بنجاح');
    }
});

// ===== دخول التطبيق =====
function enterApp(user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('currentUser').textContent = user.name;
    document.getElementById('currentRole').textContent = 
        user.role === 'admin' ? 'مدير النظام' :
        user.role === 'teacher' ? 'معلم' : 'طالب';
    initApp();
}

// ===== تسجيل الخروج =====
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem(CURRENT_USER_KEY);
    supabase.auth.signOut();
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
    showToast('تم تسجيل الخروج', 'info');
});

// ============================================
// تهيئة التطبيق
// ============================================
function initApp() {
    initData();
    populateSelects();
    updateDashboard();
    renderCourses();
    renderMyCourses();
    renderTeachers();
    renderExams();
    renderGrades();
    renderMessages();
    updateDateDisplay();
    setupSearch();
    loadProfile();
}

// ===== تحديث التاريخ =====
function updateDateDisplay() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('ar-SA', options);
}

// ===== ملء القوائم =====
function populateSelects() {
    const data = getData();
    // ملء خيارات المرشحات للدورات
    // سيتم تنفيذها في الدوال المعنية
}

// ============================================
// لوحة التحكم
// ============================================
function updateDashboard() {
    const data = getData();
    const user = getCurrentUser();
    const isStudent = user?.role === 'student';

    // إحصائيات
    const stats = [
        { icon: 'blue', label: 'الدورات', value: data.courses?.length || 0 },
        { icon: 'green', label: 'المعلمون', value: data.teachers?.length || 0 },
        { icon: 'purple', label: 'الامتحانات', value: data.exams?.length || 0 },
        { icon: 'orange', label: 'المعدل', value: '85%' }
    ];

    if (isStudent) {
        stats.push({ icon: 'teal', label: 'معدلي', value: '87%' });
        stats.push({ icon: 'red', label: 'الدورات المسجلة', value: '3' });
    }

    document.getElementById('statsGrid').innerHTML = stats.map(s => `
        <div class="stat-card">
            <div class="icon ${s.icon}">${s.icon === 'blue' ? '📚' : s.icon === 'green' ? '👨‍🏫' : s.icon === 'purple' ? '📝' : s.icon === 'orange' ? '⭐' : s.icon === 'teal' ? '📊' : '🎯'}</div>
            <div class="info"><span>${s.value}</span><small>${s.label}</small></div>
        </div>
    `).join('');

    // المحاضرات القادمة
    const lectures = [
        { title: 'الرياضيات - الفصل الثالث', time: 'غداً 10:00 ص' },
        { title: 'اللغة العربية - النحو', time: 'غداً 12:00 م' },
        { title: 'الفيزياء - الكهرباء', time: 'بعد غد 9:00 ص' }
    ];
    document.getElementById('upcomingLectures').innerHTML = lectures.map(l => `
        <div class="lecture-item">
            <span>${l.title}</span>
            <span class="time">${l.time}</span>
        </div>
    `).join('');

    // الرسم البياني للأداء
    drawPerformanceChart();
}

function drawPerformanceChart() {
    const ctx = document.getElementById('performanceChart')?.getContext('2d');
    if (!ctx) return;
    
    // تدمير الرسم البياني السابق إن وجد
    if (window.performanceChartInstance) {
        window.performanceChartInstance.destroy();
    }

    window.performanceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4', 'الأسبوع 5', 'الأسبوع 6'],
            datasets: [{
                label: 'التقدم الدراسي',
                data: [65, 70, 75, 72, 80, 85],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#4f46e5',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { stepSize: 20 }
                }
            }
        }
    });
}

// ============================================
// عرض الدورات
// ============================================
function renderCourses() {
    const data = getData();
    const category = document.getElementById('filterCategory')?.value;
    const level = document.getElementById('filterLevel')?.value;

    let courses = data.courses || [];
    if (category) courses = courses.filter(c => c.category === category);
    if (level) courses = courses.filter(c => c.level === level);

    document.getElementById('coursesGrid').innerHTML = courses.map(c => `
        <div class="course-card" onclick="showCourseDetails(${c.id})">
            <div class="course-image">${c.image || '📚'}</div>
            <div class="course-body">
                <h3>${c.title}</h3>
                <p>${c.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-user"></i> ${c.teacher}</span>
                    <span><i class="fas fa-users"></i> ${c.students || 0}</span>
                    <span><i class="fas fa-tag"></i> ${c.level || 'عام'}</span>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('coursesCount').textContent = courses.length + ' دورة';
}

function renderMyCourses() {
    const data = getData();
    const myCourses = data.courses?.slice(0, 3) || [];
    document.getElementById('myCoursesGrid').innerHTML = myCourses.map(c => `
        <div class="course-card">
            <div class="course-image">${c.image || '📚'}</div>
            <div class="course-body">
                <h3>${c.title}</h3>
                <p>${c.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-user"></i> ${c.teacher}</span>
                    <span class="enroll-badge">مسجل</span>
                </div>
            </div>
        </div>
    `).join('');
}

function showCourseDetails(id) {
    const data = getData();
    const course = data.courses.find(c => c.id === id);
    if (!course) return;

    const modal = document.getElementById('courseModal');
    document.getElementById('courseModalTitle').textContent = course.title;
    document.getElementById('courseDetails').innerHTML = `
        <p><strong>الوصف:</strong> ${course.description}</p>
        <p><strong>المعلم:</strong> ${course.teacher}</p>
        <p><strong>التصنيف:</strong> ${course.category}</p>
        <p><strong>المستوى:</strong> ${course.level}</p>
        <p><strong>عدد الطلاب:</strong> ${course.students || 0}</p>
    `;
    document.getElementById('courseModal').dataset.courseId = id;
    modal.classList.add('show');
}

function enrollCourse() {
    const modal = document.getElementById('courseModal');
    const courseId = modal.dataset.courseId;
    showToast('✅ تم التسجيل في الدورة بنجاح', 'success');
    closeModal('courseModal');
}

// ============================================
// عرض المعلمين
// ============================================
function renderTeachers() {
    const data = getData();
    const teachers = data.teachers || [];
    document.getElementById('teachersGrid').innerHTML = teachers.map(t => `
        <div class="teacher-card">
            <div class="avatar">${t.name.charAt(0)}</div>
            <h4>${t.name}</h4>
            <p>${t.subject}</p>
            <p style="font-size:12px;color:#94a3b8;">${t.email}</p>
        </div>
    `).join('');
}

// ============================================
// عرض الامتحانات
// ============================================
function renderExams() {
    const data = getData();
    const exams = data.exams || [];
    document.getElementById('examsList').innerHTML = exams.map(e => `
        <div class="exam-item">
            <div class="exam-info">
                <h4>${e.title}</h4>
                <p>${e.course} | 📅 ${e.date}</p>
            </div>
            <span class="exam-status ${e.status}">${e.status === 'upcoming' ? 'قادم' : e.status === 'completed' ? 'منتهي' : 'جاري'}</span>
        </div>
    `).join('');
}

// ============================================
// عرض النتائج
// ============================================
function renderGrades() {
    const data = getData();
    const grades = data.grades || [];
    
    document.getElementById('gradesList').innerHTML = grades.map(g => `
        <tr>
            <td>${g.course}</td>
            <td>${g.exam}</td>
            <td><strong>${g.score}</strong></td>
            <td><span style="color:${g.score >= 80 ? '#22c55e' : g.score >= 60 ? '#f59e0b' : '#ef4444'};font-weight:700;">${g.grade}</span></td>
            <td>${g.date}</td>
        </tr>
    `).join('');

    // الملخص
    const avg = grades.length > 0 ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0;
    document.getElementById('gradesSummary').innerHTML = `
        <div style="display:flex;gap:20px;flex-wrap:wrap;padding:12px 0;">
            <span>📊 عدد النتائج: ${grades.length}</span>
            <span>📈 المعدل العام: <strong>${avg}%</strong></span>
            <span>🏆 أعلى درجة: ${grades.length > 0 ? Math.max(...grades.map(g => g.score)) : 0}</span>
        </div>
    `;
}

// ============================================
// عرض الرسائل
// ============================================
function renderMessages() {
    const data = getData();
    const messages = data.messages || [];
    document.getElementById('messagesList').innerHTML = messages.map(m => `
        <div class="message-item">
            <div class="subject">${m.subject}</div>
            <div class="body">${m.body}</div>
            <div class="meta">📤 من: ${m.from} | 📅 ${m.date}</div>
        </div>
    `).join('');
}

// ============================================
// البحث
// ============================================
function setupSearch() {
    document.getElementById('globalSearch').addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (!query) {
            document.querySelectorAll('.page').forEach(p => p.style.display = '');
            return;
        }

        const data = getData();
        const results = [];

        data.courses?.forEach(c => {
            if (c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)) {
                results.push({ type: '📚 دورة', name: c.title, detail: c.category });
            }
        });

        data.teachers?.forEach(t => {
            if (t.name.toLowerCase().includes(query) || t.subject.toLowerCase().includes(query)) {
                results.push({ type: '👨‍🏫 معلم', name: t.name, detail: t.subject });
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

// ============================================
// الإشعارات
// ============================================
function showNotifications() {
    const data = getData();
    const messages = data.messages || [];
    if (messages.length === 0) {
        showToast('📭 لا توجد إشعارات', 'info');
        return;
    }
    const msg = messages.map(m => '📩 ' + m.subject + ' - من: ' + m.from).join('\n');
    alert('📬 الإشعارات:\n\n' + msg);
}

// ============================================
// ملف المستخدم
// ============================================
function loadProfile() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('profileName').value = user.name || '';
        document.getElementById('profileEmail').value = user.email || '';
    }
}

document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('profileName').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const user = getCurrentUser();
    if (user) {
        user.name = name;
        user.email = email;
        setCurrentUser(user);
        // تحديث في قاعدة البيانات المحلية
        const users = getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx].name = name;
            users[idx].email = email;
            saveUsers(users);
        }
        document.getElementById('currentUser').textContent = name;
        showToast('✅ تم تحديث الملف الشخصي');
    }
});

// ============================================
// تغيير كلمة المرور
// ============================================
document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const oldPass = document.getElementById('oldPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const user = getCurrentUser();
    
    if (!user) {
        showToast('❌ يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    
    if (idx !== -1 && users[idx].password === oldPass) {
        users[idx].password = newPass;
        saveUsers(users);
        showToast('✅ تم تغيير كلمة المرور بنجاح');
        this.reset();
    } else {
        showToast('❌ كلمة المرور القديمة غير صحيحة', 'error');
    }
});

// ============================================
// إرسال رسالة
// ============================================
document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const recipient = document.getElementById('msgRecipient').value;
    const subject = document.getElementById('msgSubject').value;
    const body = document.getElementById('msgBody').value;

    const data = getData();
    if (!data.messages) data.messages = [];
    data.messages.unshift({
        id: Date.now(),
        from: getCurrentUser()?.name || 'مستخدم',
        to: recipient,
        subject: subject,
        body: body,
        date: new Date().toISOString().split('T')[0]
    });
    saveData(data);
    renderMessages();
    this.reset();
    showToast('✅ تم إرسال الرسالة');
});

// ============================================
// دوال المودال
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

// ============================================
// تشغيل التطبيق
// ============================================
initData();

// التحقق من وجود مستخدم مسجل
const savedUser = getCurrentUser();
if (savedUser) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('currentUser').textContent = savedUser.name;
    document.getElementById('currentRole').textContent = 
        savedUser.role === 'admin' ? 'مدير النظام' :
        savedUser.role === 'teacher' ? 'معلم' : 'طالب';
    initApp();
} else {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
}

console.log('🎓 ديف أكاديمي - منصة تعليمية متكاملة');
console.log('📚 جميع البيانات مخزنة في localStorage');
console.log('👤 المستخدم الافتراضي: admin@dive.com / 123456');