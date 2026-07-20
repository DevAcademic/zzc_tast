(function() {
    'use strict';

    // ============================================================
    //  F12  
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
            (e.ctrlKey && (e.key === 'S' || e.key === 's')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c'))) {
            e.preventDefault();
            showToast('warning', '    ');
            return false;
        }
    });

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showToast('warning', '    ');
        return false;
    });

    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // ============================================================
    //      
    // ============================================================
    (function detectDevTools() {
        let devtoolsOpen = false;
        const threshold = 160;

        function checkDevTools() {
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;

            if (widthDiff > threshold || heightDiff > threshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    document.body.innerHTML = `
                        <div style="text-align:center;padding:50px;font-size:24px;color:#ef4444;font-family:'Cairo',sans-serif;">
                                  
                        </div>
                    `;
                    document.body.style.background = '#f8fafc';
                    setTimeout(function() {
                        window.location.href = 'about:blank';
                    }, 1000);
                }
            } else {
                devtoolsOpen = false;
            }
        }

        setInterval(checkDevTools, 500);

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(checkDevTools, 200);
        });
    })();

    // ============================================================
    //  console.log  
    // ============================================================
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.log = function() {};
        console.warn = function() {};
        console.info = function() {};
        console.error = function() {};
    }

    // ============================================================
    //  Supabase
    // ============================================================
    const SUPABASE_URL = 'https://mgcljgrkxhyjjmxqjkti.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_TE4fMQARKZb0XcjhAnEJhA_ws6AUxoi';
    let supabaseClient = null;

    if (window.supabase) {
        if (!window._supabaseClient) {
            window._supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }
        supabaseClient = window._supabaseClient;
    }

    // ============================================================
    //  
    // ============================================================
    let currentUser = null;
    let data = { sections: [] };
    let isDarkMode = false;
    let isAdminLoggedIn = false;
    let pendingChanges = 0;
    let activeTeacher = null;
    let activeTeacherIndex = null;
    let activeSectionIndex = null;
    let currentFilter = 'all';
    let userDeviceId = getDeviceId();

    // ============================================================
    //  
    // ============================================================
    const defaultSections = [
        { id: 'first-intermediate', name: ' ', teachers: [] },
        { id: 'second-intermediate', name: ' ', teachers: [] },
        { id: 'third-intermediate', name: ' ', teachers: [] },
        { id: 'fourth-scientific', name: ' ', teachers: [] },
        { id: 'fourth-literary', name: ' ', teachers: [] },
        { id: 'fifth-scientific', name: ' ', teachers: [] },
        { id: 'fifth-literary', name: ' ', teachers: [] },
        { id: 'sixth-scientific', name: ' ', teachers: [] },
        { id: 'sixth-literary', name: ' ', teachers: [] }
    ];

    // ============================================================
    //  DOM
    // ============================================================
    const loadingScreen = document.getElementById('loadingScreen');
    const app = document.getElementById('app');
    const navbar = document.getElementById('navbar');
    const bottomNav = document.getElementById('bottomNav');
    const teachersContainer = document.getElementById('teachersContainer');
    const teachersGridContainer = document.getElementById('teachersGridContainer');
    const teachersGridContainer2 = document.getElementById('teachersGridContainer2');
    const sectionFilter = document.getElementById('sectionFilter');
    const sectionFilter2 = document.getElementById('sectionFilter2');
    const teachersCount = document.getElementById('teachersCount');
    const teachersCount2 = document.getElementById('teachersCount2');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const videoPlayer = document.getElementById('videoPlayer');
    const closePlayer = document.getElementById('closePlayer');
    const videoWrapper = document.getElementById('videoWrapper');
    const themeToggle = document.getElementById('themeToggle');
    const toastContainer = document.getElementById('toastContainer');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userAvatar = document.getElementById('userAvatar');

    // ============================================================
    //  ADMIN
    // ============================================================
    const adminPanel = document.getElementById('adminPanel');
    const adminOverlay = document.getElementById('adminOverlay');
    const adminClose = document.getElementById('adminClose');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const publishBtn = document.getElementById('publishBtn');
    const pendingChangesSpan = document.getElementById('pendingChanges');

    // ============================================================
    // 
    // ============================================================
    const addSectionForm = document.getElementById('addSectionForm');
    const addTeacherForm = document.getElementById('addTeacherForm');
    const addLectureForm = document.getElementById('addLectureForm');

    // ============================================================
    //  
    // ============================================================
    const teachersModal = document.getElementById('teachersModal');
    const closeTeachersModal = document.getElementById('closeTeachersModal');
    const teachersList = document.getElementById('teachersList');
    const semestersModal = document.getElementById('semestersModal');
    const closeSemestersModal = document.getElementById('closeSemestersModal');
    const semestersList = document.getElementById('semestersList');
    const modalTeacherTitle = document.getElementById('modalTeacherTitle');
    const lecturesModal = document.getElementById('lecturesModal');
    const closeLecturesModal = document.getElementById('closeLecturesModal');
    const lecturesList = document.getElementById('lecturesList');
    const modalSemesterTitle = document.getElementById('modalSemesterTitle');

    // ============================================================
    //  
    // ============================================================
    const accountName = document.getElementById('accountName');
    const accountEmail = document.getElementById('accountEmail');
    const accountAvatar = document.getElementById('accountAvatar');
    const accountRegistered = document.getElementById('accountRegistered');
    const accountCourses = document.getElementById('accountCourses');
    const accountCodes = document.getElementById('accountCodes');
    const accountProgress = document.getElementById('accountProgress');
    const accountLectures = document.getElementById('accountLectures');
    const logoutAccountBtn = document.getElementById('logoutAccountBtn');
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const coursesBadge = document.getElementById('coursesBadge');
    const coursesBadgeMobile = document.getElementById('coursesBadgeMobile');

    // ============================================================
    //  
    // ============================================================
    const deleteAccountModal = document.getElementById('deleteAccountModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const deletePasswordInput = document.getElementById('deletePasswordInput');
    const deleteAccountMessage = document.getElementById('deleteAccountMessage');

    // ============================================================
    // DEVICE ID
    // ============================================================
    function getDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'DEV_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }

    // ============================================================
    // TOAST
    // ============================================================
    function showToast(type, message, duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { success: '', error: '', warning: '', info: '' };
        toast.innerHTML = `
            <span>${icons[type] || ''} ${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()"></button>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.4s ease forwards';
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    // ============================================================
    //   
    // ============================================================
    function hasAccessToTeacher(teacher) {
        if (!teacher || !teacher.codes) return false;
        if (!currentUser) return false;
        const hasAccess = teacher.codes.some(c => c.used && c.userEmail === currentUser.email && !c.locked);
        return hasAccess;
    }

    // ============================================================
    //   
    // ============================================================
    async function isUserAdmin(email) {
        if (!supabaseClient || !email) return false;
        try {
            const { data, error } = await supabaseClient
                .from('admins')
                .select('email')
                .eq('email', email)
                .maybeSingle();
            if (error) {
                console.warn('     :', error);
                return false;
            }
            return !!data;
        } catch (e) {
            console.warn('     :', e);
            return false;
        }
    }

    // ============================================================
    //   
    // ============================================================
    async function verifyCode(teacher, code) {
        if (!teacher.codes || teacher.codes.length === 0) {
            return { valid: false, message: '    ' };
        }

        if (!currentUser) {
            return { valid: false, message: '      ' };
        }

        const codeData = teacher.codes.find(c => c.code === code);
        if (!codeData) {
            return { valid: false, message: '   ' };
        }

        if (codeData.locked === true) {
            return { valid: false, message: '      ' };
        }

        if (codeData.used) {
            if (codeData.userEmail === currentUser.email) {
                return { valid: true, message: '    ' };
            } else {
                const usedAt = codeData.usedAt ? new Date(codeData.usedAt).toLocaleString('ar') : '  ';
                return {
                    valid: false,
                    message: `       \n   : ${usedAt}`
                };
            }
        }

        codeData.used = true;
        codeData.deviceId = userDeviceId;
        codeData.userId = currentUser.id;
        codeData.userEmail = currentUser.email;
        codeData.usedAt = new Date().toISOString();
        saveData();

        const syncResult = await syncCodeWithSupabase(teacher, codeData);
        if (!syncResult.success) {
            codeData.used = false;
            codeData.userId = null;
            codeData.userEmail = null;
            codeData.usedAt = null;
            saveData();
            return { valid: false, message: '      ' };
        }

        await addCodeToUserCodes(currentUser.id, codeData.code);
        updateUserCodesStorage();
        renderAllData();
        renderMyCourses();
        renderAccount();
        updateBadge();

        return { valid: true, message: '    -     ' };
    }

    // ============================================================
    //    Supabase
    // ============================================================
    async function syncCodeWithSupabase(teacher, codeData) {
        if (!currentUser || !supabaseClient) {
            return { success: false, error: 'No authenticated user or Supabase unavailable' };
        }
        try {
            const record = {
                code: codeData.code,
                teacher_name: teacher.name,
                user_id: currentUser.id,
                user_email: currentUser.email,
                device_id: userDeviceId,
                used: true,
                locked: codeData.locked || false,
                used_at: codeData.usedAt || new Date().toISOString(),
            };

            const { error } = await supabaseClient.from('teacher_codes').upsert(record, { onConflict: 'code' });
            if (error) {
                console.warn('     Supabase:', error.message || error);
                return { success: false, error };
            }

            const { error: updateError } = await supabaseClient.from('codes').update({
                is_used: true,
                user_id: currentUser.id,
                user_email: currentUser.email,
                device_id: userDeviceId,
                used_at: new Date().toISOString()
            }).eq('code', codeData.code);

            if (updateError) {
                console.warn('      codes:', updateError);
            }

            console.log('     Supabase:', codeData.code);
            return { success: true };
        } catch (error) {
            console.warn('    :', error);
            return { success: false, error };
        }
    }

    // ============================================================
    //    
    // ============================================================
    async function addCodeToUserCodes(userId, code) {
        if (!supabaseClient) return;
        try {
            const { data: codeRecord, error: codeError } = await supabaseClient
                .from('codes').select('id').eq('code', code).single();
            if (codeError) {
                console.warn('      :', codeError);
                return;
            }

            const { data: existing, error: checkError } = await supabaseClient
                .from('user_codes').select('id').eq('user_id', userId).eq('code_id', codeRecord.id).maybeSingle();
            if (existing) {
                console.log('    ');
                return;
            }

            const { error } = await supabaseClient.from('user_codes').insert({
                user_id: userId,
                code_id: codeRecord.id,
                used_at: new Date().toISOString()
            });
            if (error) {
                console.warn('     user_codes:', error);
            } else {
                console.log('      :', code);
            }
        } catch (error) {
            console.warn('    :', error);
        }
    }

    // ============================================================
    //      
    // ============================================================
    function updateUserCodesStorage() {
        if (!currentUser) return;
        const userCodes = [];
        data.sections.forEach(section => {
            section.teachers.forEach(teacher => {
                if (teacher.codes) {
                    teacher.codes.forEach(code => {
                        if (code.used && code.userEmail === currentUser.email) {
                            userCodes.push({
                                code: code.code,
                                teacherName: teacher.name,
                                sectionName: section.name,
                                usedAt: code.usedAt
                            });
                        }
                    });
                }
            });
        });
        localStorage.setItem('userCodes_' + currentUser.email, JSON.stringify(userCodes));
    }

    // ============================================================
    //      
    // ============================================================
    function restoreUserCodesFromStorage() {
        if (!currentUser) return;
        const stored = localStorage.getItem('userCodes_' + currentUser.email);
        if (!stored) return;
        try {
            const userCodes = JSON.parse(stored);
            userCodes.forEach(savedCode => {
                data.sections.forEach(section => {
                    section.teachers.forEach(teacher => {
                        if (teacher.codes) {
                            const codeData = teacher.codes.find(c => c.code === savedCode.code);
                            if (codeData && !codeData.used) {
                                codeData.used = true;
                                codeData.userId = currentUser.id;
                                codeData.userEmail = currentUser.email;
                                codeData.deviceId = userDeviceId;
                                codeData.usedAt = savedCode.usedAt || new Date().toISOString();
                            }
                        }
                    });
                });
            });
            saveData();
        } catch (e) {
            console.warn('      ');
        }
    }

    // ============================================================
    //     Supabase
    // ============================================================
    async function loadUserCodesFromSupabase() {
        if (!currentUser || !supabaseClient) return;
        restoreUserCodesFromStorage();
        try {
            const { data: userCodes, error: codesError } = await supabaseClient
                .from('user_codes').select('code_id').eq('user_id', currentUser.id);
            if (codesError) {
                console.warn('   :', codesError);
                return;
            }
            if (!userCodes || userCodes.length === 0) return;
            const codeIds = userCodes.map(uc => uc.code_id);
            const { data: codesData, error: codesDataError } = await supabaseClient
                .from('codes').select('*').in('id', codeIds);
            if (codesDataError) {
                console.warn('    :', codesDataError);
                return;
            }

            let restoredCount = 0;
            codesData.forEach(codeRecord => {
                data.sections.forEach(section => {
                    section.teachers.forEach(teacher => {
                        if (!teacher.codes) teacher.codes = [];
                        const localCode = teacher.codes.find(c => c.code === codeRecord.code);
                        if (localCode) {
                            if (!localCode.used) {
                                localCode.used = true;
                                localCode.userId = currentUser.id;
                                localCode.userEmail = currentUser.email;
                                localCode.deviceId = codeRecord.device_id || userDeviceId;
                                localCode.usedAt = codeRecord.used_at || new Date().toISOString();
                                localCode.locked = codeRecord.is_locked || false;
                                restoredCount++;
                            }
                        }
                    });
                });
            });

            if (restoredCount > 0) {
                saveData();
                updateUserCodesStorage();
                renderAllData();
                renderMyCourses();
                renderAccount();
                updateBadge();
                console.log('  ', restoredCount, '  Supabase');
                showToast('success', `   ${restoredCount}  `);
            }
        } catch (error) {
            console.warn('    :', error);
        }
    }

    // ============================================================
    //  
    // ============================================================
    function getCodesStatus(teacher) {
        if (!teacher.codes) return { total: 0, used: 0, available: 0, locked: 0 };
        const total = teacher.codes.length;
        const used = teacher.codes.filter(c => c.used).length;
        const locked = teacher.codes.filter(c => c.locked).length;
        return { total, used, available: total - used, locked };
    }

    // ============================================================
    //  
    // ============================================================
    function normalizeDataStructure(courseData) {
        if (!courseData || !Array.isArray(courseData.sections)) {
            courseData.sections = [];
        }
        courseData.sections.forEach(section => {
            if (!Array.isArray(section.teachers)) { section.teachers = []; }
            section.teachers.forEach(teacher => {
                if (!Array.isArray(teacher.codes)) { teacher.codes = []; }
                if (!Array.isArray(teacher.semesters)) { teacher.semesters = []; }
                teacher.codes.forEach(c => {
                    if (c.used === undefined) c.used = false;
                    if (c.locked === undefined) c.locked = false;
                    if (!('deviceId' in c)) c.deviceId = null;
                    if (!('usedAt' in c)) c.usedAt = null;
                    if (!('userId' in c)) c.userId = null;
                    if (!('userEmail' in c)) c.userEmail = null;
                });
                teacher.semesters.forEach(semester => {
                    if (!Array.isArray(semester.lectures)) { semester.lectures = []; }
                    semester.lectures.forEach(lecture => {
                        if (lecture.isFree === undefined) lecture.isFree = false;
                        if (!('youtubeUrl' in lecture)) lecture.youtubeUrl = '';
                        if (!('title' in lecture)) lecture.title = '';
                        if (lecture.number === undefined) lecture.number = 0;
                    });
                });
            });
        });
    }

    async function loadData() {
        try {
            if (supabaseClient) {
                const remoteData = await getSupabaseAcademyData();
                if (remoteData && remoteData.sections && Array.isArray(remoteData.sections)) {
                    data = remoteData;
                    normalizeDataStructure(data);
                    localStorage.setItem('academyData', JSON.stringify(data));
                    console.log('     Supabase');
                    return;
                }
            }
            const savedData = localStorage.getItem('academyData');
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    if (parsed && parsed.sections && Array.isArray(parsed.sections)) {
                        data = parsed;
                        normalizeDataStructure(data);
                        console.log('     localStorage');
                        return;
                    }
                } catch (e) { console.warn('  localStorage '); }
            }
            data = { sections: JSON.parse(JSON.stringify(defaultSections)) };
            normalizeDataStructure(data);
            localStorage.setItem('academyData', JSON.stringify(data));
            showToast('info', '    ');
        } catch (error) {
            console.warn('   :', error.message);
        }
    }

    function saveData() {
        try {
            localStorage.setItem('academyData', JSON.stringify(data));
            console.log('    ');
        } catch (error) {
            console.error('    :', error);
            showToast('error', '    ');
        }
    }

    async function getSupabaseAcademyData() {
        if (!supabaseClient) return null;
        try {
            const { data, error } = await supabaseClient
                .from('academy_data').select('content').eq('id', 'main').maybeSingle();
            if (error) { console.warn('Supabase academy data lookup failed:', error.message || error); return null; }
            return data?.content || null;
        } catch (error) { console.warn('Supabase academy data exception:', error); return null; }
    }

    async function saveSupabaseAcademyData() {
        if (!supabaseClient) return { success: false, error: 'Supabase  ' };
        try {
            const record = { id: 'main', content: data, updated_at: new Date().toISOString() };
            const { error } = await supabaseClient.from('academy_data').upsert(record, { onConflict: 'id' });
            if (error) { console.warn('Supabase academy data save failed:', error.message || error); return { success: false,
                    error }; }
            localStorage.setItem('academyData', JSON.stringify(data));
            return { success: true };
        } catch (error) { console.warn('Supabase academy data save exception:', error); return { success: false,
                error }; }
    }

    // ============================================================
    //    
    // ============================================================
    function getAllTeachers() {
        const teachers = [];
        data.sections.forEach((section, sectionIndex) => {
            section.teachers.forEach((teacher, teacherIndex) => {
                teachers.push({
                    ...teacher,
                    _sectionIndex: sectionIndex,
                    _teacherIndex: teacherIndex,
                    _sectionName: section.name,
                    _sectionId: section.id
                });
            });
        });
        return teachers;
    }

    function getTeachersBySection(sectionId) {
        const section = data.sections.find(s => s.id === sectionId);
        if (!section) return [];
        return section.teachers.map((teacher, index) => ({
            ...teacher,
            _sectionIndex: data.sections.indexOf(section),
            _teacherIndex: index,
            _sectionName: section.name,
            _sectionId: section.id
        }));
    }

    function getFilteredTeachers() {
        if (currentFilter === 'all') {
            return getAllTeachers();
        }
        return getTeachersBySection(currentFilter);
    }

    // ============================================================
    //   
    // ============================================================
    function buildFilterButtons(container, countContainer) {
        if (!container) return;

        let html = `<button class="filter-btn active" data-section="all" onclick="setFilter('all')">
            <span class="btn-icon"></span> 
            <span class="btn-count">${getAllTeachers().length}</span>
        </button>`;

        data.sections.forEach(section => {
            const teacherCount = section.teachers ? section.teachers.length : 0;
            const isActive = currentFilter === section.id;
            html += `<button class="filter-btn ${isActive ? 'active' : ''}" data-section="${section.id}" onclick="setFilter('${section.id}')">
                <span class="btn-icon"></span> ${section.name}
                <span class="btn-count">${teacherCount}</span>
            </button>`;
        });

        container.innerHTML = html;

        if (countContainer) {
            const filtered = getFilteredTeachers();
            countContainer.textContent = filtered.length;
        }
    }

    // ============================================================
    //  
    // ============================================================
    window.setFilter = function(sectionId) {
        currentFilter = sectionId;
        renderAllData();
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === sectionId);
        });
    };

    // ============================================================
    //  
    // ============================================================
    function renderTeachers(teachers, container) {
        if (!container) return;

        if (!teachers || teachers.length === 0) {
            container.innerHTML = `
                <div class="empty-teachers">
                    <span class="empty-icon"></span>
                    <h3>  </h3>
                    <p>${currentFilter === 'all' ? '     ' : '     '}</p>
                </div>
            `;
            return;
        }

        let html = `<div class="teachers-grid">`;

        teachers.forEach((teacher) => {
            const hasAccess = hasAccessToTeacher(teacher);
            const imageUrl = teacher.image || '';
            const emoji = teacher.emoji || '';
            const name = teacher.name || '';
            const subject = teacher.subject || '';
            const semestersCount = Array.isArray(teacher.semesters) ? teacher.semesters.length : 0;
            const sectionName = teacher._sectionName || '';

            html += `
                <div class="teacher-card" onclick="openTeacher(${teacher._sectionIndex}, ${teacher._teacherIndex})">
                    <div class="teacher-section-badge">${sectionName}</div>
                    <div class="teacher-card-image">
                        ${imageUrl ? `<img src="${imageUrl}" alt="${name}" onerror="this.style.display='none'; this.parentElement.querySelector('.teacher-emoji').style.display='block';">` : ''}
                        <span class="teacher-emoji" style="${imageUrl ? 'display:none;' : 'display:block;'}">${emoji}</span>
                        ${hasAccess ? '<div class="teacher-badge"></div>' : ''}
                    </div>
                    <div class="teacher-card-info">
                        <h3>${name}</h3>
                        ${subject ? `<div class="teacher-subject">${subject}</div>` : ''}
                        <div class="teacher-stats"> ${semestersCount} </div>
                    </div>
                    <div class="teacher-card-overlay">
                        <i class="fas fa-chevron-left"></i>
                        <span></span>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    function renderAllData() {
        const filteredTeachers = getFilteredTeachers();

        if (teachersCount) teachersCount.textContent = filteredTeachers.length;
        if (teachersCount2) teachersCount2.textContent = filteredTeachers.length;

        renderTeachers(filteredTeachers, teachersGridContainer);
        renderTeachers(filteredTeachers, teachersGridContainer2);

        buildFilterButtons(sectionFilter, teachersCount);
        buildFilterButtons(sectionFilter2, teachersCount2);

        //   
        const totalTeachers = getAllTeachers().length;
        document.getElementById('totalTeachers').textContent = totalTeachers;

        let totalCourses = 0;
        let totalStudents = 0;
        const uniqueStudents = new Set();
        data.sections.forEach(section => {
            section.teachers.forEach(teacher => {
                totalCourses += teacher.semesters ? teacher.semesters.length : 0;
                if (teacher.codes) {
                    teacher.codes.forEach(c => {
                        if (c.used && c.userEmail) {
                            uniqueStudents.add(c.userEmail);
                        }
                    });
                }
            });
        });
        document.getElementById('totalCourses').textContent = totalCourses;
        document.getElementById('totalStudents').textContent = uniqueStudents.size;

        //    
        document.getElementById('adminTotalTeachers').textContent = totalTeachers;
        document.getElementById('adminTotalSections').textContent = data.sections.length;
        let totalLectures = 0;
        data.sections.forEach(section => {
            section.teachers.forEach(teacher => {
                if (teacher.semesters) {
                    teacher.semesters.forEach(semester => {
                        totalLectures += semester.lectures ? semester.lectures.length : 0;
                    });
                }
            });
        });
        document.getElementById('adminTotalLectures').textContent = totalLectures;
        document.getElementById('adminTotalStudents').textContent = uniqueStudents.size;
    }

    // ============================================================
    //  
    // ============================================================
    function extractVideoUrl(url) {
        if (!url) return '';

        //  DynTube
        if (url.includes('dyntube.com') || url.includes('videos.dyntube.com')) {
            let embedUrl = url;
            if (url.includes('/iframes/')) {
                const videoId = url.split('/iframes/')[1]?.split('?')[0] || '';
                if (videoId) embedUrl = `https://dyntube.com/embed/${videoId}`;
            } else if (url.includes('/video/')) {
                const videoId = url.split('/video/')[1]?.split('?')[0] || '';
                if (videoId) embedUrl = `https://dyntube.com/embed/${videoId}`;
            } else if (url.includes('/watch/')) {
                const videoId = url.split('/watch/')[1]?.split('?')[0] || '';
                if (videoId) embedUrl = `https://dyntube.com/embed/${videoId}`;
            } else if (!url.includes('/embed/')) {
                const videoId = url.split('/').pop()?.split('?')[0] || '';
                if (videoId && videoId.length > 5) embedUrl = `https://dyntube.com/embed/${videoId}`;
            }
            const separator = embedUrl.includes('?') ? '&' : '?';
            embedUrl = embedUrl + separator + 'autoplay=1&controls=1&loop=0&muted=0';
            return embedUrl;
        }

        //  mediadelivery
        if (url.includes('player.mediadelivery.net/play/') || url.includes('player.mediadelivery.net/embed/') || url
            .includes('mediadelivery.net')) {
            return url;
        }

        //  iframe
        if (url.includes('<iframe')) {
            const match = url.match(/src=["']([^"']+)["']/);
            if (match) return match[1];
        }

        return url;
    }

    function isDynTubeUrl(url) {
        if (!url) return false;
        return url.includes('dyntube.com') || url.includes('videos.dyntube.com') || url.includes('dyntube');
    }

    window.playVideo = function(url, title) {
        if (!url) {
            showToast('error', '    ');
            return;
        }

        let videoUrl = extractVideoUrl(url);

        if (isDynTubeUrl(videoUrl)) {
            if (!videoUrl.includes('/embed/')) {
                const videoId = videoUrl.split('/').pop()?.split('?')[0] || '';
                if (videoId && videoId.length > 5) {
                    videoUrl = `https://dyntube.com/embed/${videoId}`;
                }
            }
            const separator = videoUrl.includes('?') ? '&' : '?';
            videoUrl = videoUrl + separator + 'autoplay=1&controls=1&loop=0&muted=0';

            videoWrapper.innerHTML = `
                <iframe src="${videoUrl}" 
                        loading="lazy" 
                        style="border:0;position:absolute;top:0;left:0;height:100%;width:100%;" 
                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
                        allowfullscreen="true"
                        webkitallowfullscreen="true"
                        mozallowfullscreen="true">
                </iframe>
            `;

            videoPlayer.classList.add('active');
            document.body.style.overflow = 'hidden';
            showToast('info', ` : ${title || ''} (DynTube)`);
            return;
        }

        if (videoUrl.includes('mediadelivery')) {
            if (!videoUrl.includes('autoplay')) {
                const separator = videoUrl.includes('?') ? '&' : '?';
                videoUrl = videoUrl + separator + 'autoplay=true&loop=false&muted=false&preload=true&responsive=true&controls=true';
            }
            videoUrl = videoUrl.replace(/&?muted=true/g, '');
            videoUrl = videoUrl.replace(/&?muted=false/g, '');

            videoWrapper.innerHTML = `
                <iframe src="${videoUrl}" 
                        loading="lazy" 
                        style="border:0;position:absolute;top:0;left:0;height:100%;width:100%;" 
                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
                        allowfullscreen="true"
                        webkitallowfullscreen="true"
                        mozallowfullscreen="true">
                </iframe>
            `;

            videoPlayer.classList.add('active');
            document.body.style.overflow = 'hidden';
            showToast('info', ` : ${title || ''}`);
            return;
        }

        //  YouTube
        const videoId = extractYouTubeId(videoUrl);
        if (videoId) {
            const embedUrl = getYouTubeEmbedUrl(videoId);
            videoWrapper.innerHTML = `
                <iframe src="${embedUrl}" 
                        style="border:0;position:absolute;top:0;left:0;height:100%;width:100%;" 
                        allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;fullscreen"
                        allowfullscreen>
                </iframe>
            `;

            videoPlayer.classList.add('active');
            document.body.style.overflow = 'hidden';
            showToast('info', ` : ${title || ''}`);
            return;
        }

        //    
        if (videoUrl.match(/\.(mp4|webm|ogg|m3u8)(\?.*)?$/i)) {
            videoWrapper.innerHTML = `
                <video controls autoplay 
                       style="position:absolute;top:0;left:0;height:100%;width:100%;background:#000;"
                       controlslist="nodownload"
                       playsinline>
                    <source src="${videoUrl}" type="video/mp4">
                        
                </video>
            `;

            setTimeout(() => {
                const video = videoWrapper.querySelector('video');
                if (video) {
                    video.volume = 1.0;
                    video.muted = false;
                }
            }, 500);

            videoPlayer.classList.add('active');
            document.body.style.overflow = 'hidden';
            showToast('info', ` : ${title || ''}`);
            return;
        }

        showToast('error', '    .   mediadelivery  YouTube  DynTube');
    };

    function closeVideoPlayer() {
        if (videoWrapper) videoWrapper.innerHTML = '';
        if (videoPlayer) videoPlayer.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function extractYouTubeId(url) {
        if (!url) return null;
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([^&]+)/,
            /(?:youtu\.be\/)([^?]+)/,
            /(?:youtube\.com\/embed\/)([^?]+)/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }

    function getYouTubeEmbedUrl(videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }

    // ============================================================
    //  
    // ============================================================
    window.openTeacher = function(sectionIndex, teacherIndex) {
        const section = data.sections[sectionIndex];
        if (!section) return;
        const teacher = section.teachers[teacherIndex];
        if (!teacher) return;

        activeTeacher = teacher;
        activeTeacherIndex = teacherIndex;
        activeSectionIndex = sectionIndex;

        const hasAccess = hasAccessToTeacher(teacher);
        modalTeacherTitle.textContent = ` ${teacher.name} (${section.name})`;

        const semesters = Array.isArray(teacher.semesters) ? teacher.semesters : [];
        let html = '';

        semesters.forEach((semester, idx) => {
            const lectures = Array.isArray(semester.lectures) ? semester.lectures : [];
            const hasFreeLecture = lectures.some(l => l.isFree === true);
            const isLocked = !hasAccess && !hasFreeLecture;

            html += `
                <div class="semester-item ${isLocked ? 'locked' : ''}" 
                     onclick="${isLocked ? '' : `openLectures(${sectionIndex}, ${teacherIndex}, ${idx})`}">
                    <div>
                        <div class="semester-number">  ${semester.number}</div>
                        <div class="semester-desc">${semester.description || ''} (${semester.lectures.length} )</div>
                    </div>
                    <div class="semester-status">
                        ${isLocked ? ' ' : (hasAccess ? ' ' : ' ')}
                        <i class="fas fa-chevron-left"></i>
                    </div>
                </div>
            `;
        });

        const isActivated = hasAccessToTeacher(teacher);
        html += `
            <div class="codes-info">
                <div class="access-status ${isActivated ? 'active' : 'inactive'}">
                    ${isActivated ? '   -   ' : '    -   '}
                </div>
                ${!isActivated ? `
                    <div class="code-box-mini" style="margin-top:0.8rem;background:var(--bg);padding:0.8rem;border-radius:var(--radius-sm);">
                        <p style="font-size:0.85rem;margin-bottom:0.3rem;">      </p>
                        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                            <input type="password" id="codeInputTeacher" placeholder=" ..." maxlength="20" style="flex:1;min-width:120px;padding:0.5rem 0.8rem;border:2px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text);font-size:0.9rem;outline:none;text-align:center;letter-spacing:2px;font-weight:700;font-family:monospace;" />
                            <button onclick="activateCodeFromTeacher()" style="padding:0.5rem 1.2rem;background:var(--primary-gradient);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;"></button>
                        </div>
                        <div id="codeMessageTeacher" style="margin-top:0.3rem;font-size:0.85rem;"></div>
                    </div>
                ` : ''}
            </div>
        `;

        semestersList.innerHTML = html;
        semestersModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.activateCodeFromTeacher = async function() {
        const codeInput = document.getElementById('codeInputTeacher');
        const codeMessage = document.getElementById('codeMessageTeacher');
        const code = codeInput.value.trim().toUpperCase();

        if (!code) {
            codeMessage.innerHTML = '   ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        if (!activeTeacher) {
            codeMessage.innerHTML = '    ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        if (!currentUser) {
            codeMessage.innerHTML = '    ';
            codeMessage.style.color = '#ef4444';
            showToast('error', '    ');
            return;
        }

        const result = await verifyCode(activeTeacher, code);
        codeMessage.innerHTML = result.message;
        codeMessage.style.color = result.valid ? '#22c55e' : '#ef4444';

        if (result.valid) {
            showToast('success', '   !');
            renderAllData();
            renderMyCourses();
            renderAccount();
            updateBadge();
            updateUserCodesStorage();

            setTimeout(() => {
                if (activeSectionIndex !== null && activeTeacherIndex !== null) {
                    openTeacher(activeSectionIndex, activeTeacherIndex);
                }
            }, 1500);
        } else {
            showToast('error', ' ' + result.message);
        }
    };

    window.openLectures = function(sectionIndex, teacherIndex, semesterIndex) {
        const section = data.sections[sectionIndex];
        if (!section) return;
        const teacher = section.teachers[teacherIndex];
        if (!teacher) return;
        const semester = teacher.semesters[semesterIndex];
        if (!semester) return;

        const hasAccess = hasAccessToTeacher(teacher);
        modalSemesterTitle.textContent = `  ${semester.number} - ${teacher.name}`;

        let html = '';
        const lectures = Array.isArray(semester.lectures) ? semester.lectures : [];

        lectures.forEach((lecture) => {
            const isFree = lecture.isFree === true;
            const canWatch = isFree || hasAccess;
            const videoUrl = lecture.youtubeUrl || '';
            const isMediaDelivery = videoUrl.includes('mediadelivery');
            const isDynTube = videoUrl.includes('dyntube.com') || videoUrl.includes('videos.dyntube.com');
            const videoIcon = isMediaDelivery ? 'fa-video' : (isDynTube ? 'fa-film' : 'fa-play-circle');

            html += `
                <div class="lecture-item ${canWatch ? '' : 'locked'}" 
                     onclick="${canWatch ? `playVideo('${videoUrl}', '${lecture.title}')` : ''}">
                    <div class="lecture-number">#${lecture.number}</div>
                    <div class="lecture-title">${lecture.title}</div>
                    <div class="lecture-status">
                        ${isFree ? '<span class="free-badge"> </span>' : ''}
                        ${isMediaDelivery ? '<span style="font-size:0.6rem;color:var(--primary);margin-left:0.3rem;"></span>' : ''}
                        ${isDynTube ? '<span style="font-size:0.6rem;color:var(--secondary);margin-left:0.3rem;"></span>' : ''}
                        ${canWatch ? `<i class="fas ${videoIcon}" style="color:var(--primary);"></i>` : '<i class="fas fa-lock" style="color:#ef4444;"></i>'}
                    </div>
                </div>
            `;
        });

        lecturesList.innerHTML = html;
        lecturesModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // ============================================================
    // 
    // ============================================================
    function getMyCourses() {
        if (!currentUser) return [];
        const courses = [];

        data.sections.forEach(section => {
            section.teachers.forEach((teacher, teacherIndex) => {
                if (teacher.codes) {
                    const hasAccess = teacher.codes.some(c => c.used && c.userEmail === currentUser.email && !c
                    .locked);
                    if (hasAccess) {
                        let totalLectures = 0;
                        let completedLectures = 0;
                        if (teacher.semesters) {
                            teacher.semesters.forEach(semester => {
                                if (semester.lectures) {
                                    semester.lectures.forEach(lecture => {
                                        totalLectures++;
                                        //           
                                        if (lecture.isFree || hasAccess) {
                                            completedLectures++;
                                        }
                                    });
                                }
                            });
                        }
                        const progress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) :
                            0;

                        courses.push({
                            teacherName: teacher.name,
                            teacherEmoji: teacher.emoji || '',
                            teacherImage: teacher.image || '',
                            sectionName: section.name,
                            sectionIndex: data.sections.indexOf(section),
                            teacherIndex: teacherIndex,
                            codes: teacher.codes.filter(c => c.used && c.userEmail === currentUser.email),
                            totalLectures: totalLectures,
                            completedLectures: completedLectures,
                            progress: progress
                        });
                    }
                }
            });
        });

        return courses;
    }

    function renderMyCourses() {
        const container = document.getElementById('myCoursesContainer');
        const countSpan = document.getElementById('myCoursesCount');
        if (!container) return;

        const courses = getMyCourses();
        if (countSpan) countSpan.textContent = courses.length + ' ';

        if (courses.length === 0) {
            container.innerHTML = `
                <div class="empty-courses">
                    <span class="empty-icon"></span>
                    <h3>     </h3>
                    <p>      </p>
                    <button class="btn-primary" onclick="navigateTo('teachers')">
                        <i class="fas fa-search"></i>  
                    </button>
                </div>
            `;
            return;
        }

        //   
        let totalLectures = 0;
        let completedLectures = 0;
        courses.forEach(course => {
            totalLectures += course.totalLectures || 0;
            completedLectures += course.completedLectures || 0;
        });
        const overallProgress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

        const progressFill = document.getElementById('overallProgress');
        const progressPercentage = document.getElementById('progressPercentage');
        if (progressFill) progressFill.style.width = overallProgress + '%';
        if (progressPercentage) progressPercentage.textContent = overallProgress + '%';

        let html = '<div class="my-courses-grid">';
        courses.forEach(course => {
            const progress = course.progress || 0;
            html += `
                <div class="course-card-mini" onclick="openTeacher(${course.sectionIndex}, ${course.teacherIndex})">
                    <div class="course-avatar">
                        ${course.teacherImage ? `<img src="${course.teacherImage}" />` : course.teacherEmoji}
                    </div>
                    <div class="course-name">${course.teacherName}</div>
                    <div class="course-meta">${course.sectionName} | ${course.codes.length} </div>
                    <div class="course-badge"> </div>
                    <div class="course-progress">
                        <div class="mini-bar">
                            <div class="mini-fill" style="width:${progress}%;"></div>
                        </div>
                        <span class="mini-label">${progress}% </span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    // ============================================================
    //  
    // ============================================================
    function renderAccount() {
        if (!currentUser) {
            accountName.textContent = ' ';
            accountEmail.textContent = '  ';
            accountAvatar.textContent = '';
            accountRegistered.textContent = '--';
            accountCourses.textContent = '0';
            accountCodes.textContent = '0';
            accountProgress.textContent = '0%';
            accountLectures.textContent = '0';
            adminPanelBtn.style.display = 'none';
            return;
        }

        const name = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '';
        accountName.textContent = name;
        accountEmail.textContent = currentUser.email;
        accountAvatar.textContent = name.charAt(0).toUpperCase();

        const registered = currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString('ar') : ' ';
        accountRegistered.textContent = ' : ' + registered;

        const courses = getMyCourses();
        accountCourses.textContent = courses.length;

        let codesCount = 0;
        let totalLectures = 0;
        let completedLectures = 0;
        data.sections.forEach(section => {
            section.teachers.forEach(teacher => {
                if (teacher.codes) {
                    codesCount += teacher.codes.filter(c => c.used && c.userEmail === currentUser.email).length;
                }
                if (teacher.semesters) {
                    teacher.semesters.forEach(semester => {
                        if (semester.lectures) {
                            semester.lectures.forEach(lecture => {
                                totalLectures++;
                                if (lecture.isFree || hasAccessToTeacher(teacher)) {
                                    completedLectures++;
                                }
                            });
                        }
                    });
                }
            });
        });
        accountCodes.textContent = codesCount;
        accountLectures.textContent = completedLectures;
        const progress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
        accountProgress.textContent = progress + '%';

        isUserAdmin(currentUser.email).then(isAdmin => {
            if (isAdmin) {
                adminPanelBtn.style.display = 'flex';
                console.log('   !   ');
            } else {
                adminPanelBtn.style.display = 'none';
                console.log('     ');
            }
        });
    }

    function updateBadge() {
        const courses = getMyCourses();
        if (courses.length > 0) {
            coursesBadge.style.display = 'inline';
            coursesBadge.textContent = courses.length;
            coursesBadgeMobile.style.display = 'inline';
            coursesBadgeMobile.textContent = courses.length;
        } else {
            coursesBadge.style.display = 'none';
            coursesBadgeMobile.style.display = 'none';
        }
    }

    // ============================================================
    //  
    // ============================================================
    async function signOut() {
        try {
            localStorage.removeItem('devAcademicUser');
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
            currentUser = null;
            activeTeacher = null;
            activeTeacherIndex = null;
            activeSectionIndex = null;
            updateUI();
            if (adminPanel) adminPanel.classList.remove('open');
            if (adminOverlay) adminOverlay.classList.remove('show');
            if (semestersModal) semestersModal.classList.remove('active');
            if (lecturesModal) lecturesModal.classList.remove('active');
            if (teachersModal) teachersModal.classList.remove('active');
            renderMyCourses();
            renderAccount();
            updateBadge();
            renderAllData();
            showToast('success', '    ');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        } catch (error) {
            console.warn('SignOut exception:', error);
            showToast('error', '     ');
        }
    }

    // ============================================================
    //   
    // ============================================================
    function updateUI() {
        if (currentUser) {
            const name = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '';
            userNameDisplay.textContent = name;
            userAvatar.textContent = name.charAt(0).toUpperCase();
        } else {
            userNameDisplay.textContent = ' ';
            userAvatar.textContent = '';
        }
    }

    // ============================================================
    //   
    // ============================================================
    window.navigateTo = function(page) {
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        document.querySelectorAll('.page-content').forEach(p => p.style.display = 'none');
        const targetPage = document.getElementById('page-' + page);
        if (targetPage) targetPage.style.display = 'block';

        document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
        document.querySelector(`.nav-links li a[onclick*="${page}"]`)?.closest('li')?.classList.add('active');

        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        const hero = document.getElementById('hero');
        if (hero) {
            hero.style.display = page === 'home' ? 'flex' : 'none';
        }

        if (page === 'my-courses') {
            renderMyCourses();
            updateBadge();
        }
        if (page === 'account') {
            renderAccount();
        }
        if (page === 'teachers' || page === 'home') {
            renderAllData();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ============================================================
    //  
    // ============================================================
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.dataset.page);
        });
    });

    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', function() {
            navigateTo(this.dataset.page);
        });
    });

    // ============================================================
    //   
    // ============================================================
    document.getElementById('userProfileBtn')?.addEventListener('click', function() {
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }
        navigateTo('account');
    });

    // ============================================================
    //  
    // ============================================================
    logoutAccountBtn?.addEventListener('click', signOut);

    // ============================================================
    //  
    // ============================================================
    deleteAccountBtn?.addEventListener('click', function() {
        if (!currentUser) {
            showToast('warning', '    ');
            return;
        }
        deleteAccountModal.classList.add('active');
        deletePasswordInput.value = '';
        deleteAccountMessage.innerHTML = '';
        document.body.style.overflow = 'hidden';
    });

    closeDeleteModal?.addEventListener('click', closeDeleteAccountModal);
    deleteAccountModal?.addEventListener('click', function(e) {
        if (e.target === this) closeDeleteAccountModal();
    });

    function closeDeleteAccountModal() {
        deleteAccountModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        deletePasswordInput.value = '';
        deleteAccountMessage.innerHTML = '';
    }

    window.confirmDeleteAccount = async function() {
        const password = deletePasswordInput.value;

        if (!password) {
            deleteAccountMessage.innerHTML = '    ';
            deleteAccountMessage.style.color = '#f59e0b';
            return;
        }

        if (!supabaseClient) {
            deleteAccountMessage.innerHTML = '   ';
            deleteAccountMessage.style.color = '#ef4444';
            return;
        }

        try {
            //    
            const { error: signInError } = await supabaseClient.auth.signInWithPassword({
                email: currentUser.email,
                password: password
            });

            if (signInError) {
                deleteAccountMessage.innerHTML = '    ';
                deleteAccountMessage.style.color = '#ef4444';
                return;
            }

            //  
            const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(currentUser.id);

            if (deleteError) {
                //    API
                const { error: deleteUserError } = await supabaseClient
                    .from('users')
                    .delete()
                    .eq('id', currentUser.id);

                if (deleteUserError) {
                    deleteAccountMessage.innerHTML = '   : ' + deleteUserError.message;
                    deleteAccountMessage.style.color = '#ef4444';
                    return;
                }
            }

            //   
            localStorage.removeItem('devAcademicUser');
            localStorage.removeItem('academyData');
            localStorage.removeItem('userCodes_' + currentUser.email);

            showToast('success', '    ');
            deleteAccountMessage.innerHTML = '      ...';
            deleteAccountMessage.style.color = '#22c55e';

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Delete account error:', error);
            deleteAccountMessage.innerHTML = '  : ' + error.message;
            deleteAccountMessage.style.color = '#ef4444';
        }
    };

    // ============================================================
    //  
    // ============================================================
    adminPanelBtn?.addEventListener('click', function() {
        if (!currentUser) {
            showToast('warning', '    ');
            return;
        }
        isUserAdmin(currentUser.email).then(isAdmin => {
            if (isAdmin) {
                adminPanel.classList.add('open');
                adminOverlay.classList.add('show');
                updateAllAdminSelects();
                updatePendingChanges();
                loadAdminsList();
                renderUsersTable();
                showToast('success', '     ');
            } else {
                showToast('error', '       ');
            }
        });
    });

    adminClose?.addEventListener('click', closeAdminPanel);
    adminOverlay?.addEventListener('click', closeAdminPanel);

    function closeAdminPanel() {
        adminPanel.classList.remove('open');
        adminOverlay.classList.remove('show');
    }

    // ============================================================
    //  
    // ============================================================
    function toggleTheme() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('devAcademicTheme', isDarkMode ? 'dark' : 'light');
        showToast('info', isDarkMode ? '    ' : '    ');

        //     
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) darkModeToggle.checked = isDarkMode;
    }

    window.toggleTheme = toggleTheme;

    themeToggle.addEventListener('click', toggleTheme);

    // ============================================================
    // 
    // ============================================================
    function applyFilters() {
        const term = searchInput.value.trim().toLowerCase();
        if (term === '') {
            renderAllData();
            return;
        }

        const allTeachers = getAllTeachers();
        const filtered = allTeachers.filter(t =>
            t.name.toLowerCase().includes(term) ||
            (t.subject && t.subject.toLowerCase().includes(term)) ||
            (t.description && t.description.toLowerCase().includes(term)) ||
            (t._sectionName && t._sectionName.toLowerCase().includes(term))
        );

        renderTeachers(filtered, teachersGridContainer);
        renderTeachers(filtered, teachersGridContainer2);
    }

    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') applyFilters();
    });

    // ============================================================
    //   
    // ============================================================
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeTeachersModal?.addEventListener('click', () => closeModal(teachersModal));
    closeSemestersModal?.addEventListener('click', () => closeModal(semestersModal));
    closeLecturesModal?.addEventListener('click', () => closeModal(lecturesModal));

    teachersModal?.addEventListener('click', function(e) {
        if (e.target === this) closeModal(this);
    });
    semestersModal?.addEventListener('click', function(e) {
        if (e.target === this) closeModal(this);
    });
    lecturesModal?.addEventListener('click', function(e) {
        if (e.target === this) closeModal(this);
    });

    // ============================================================
    //  
    // ============================================================
    closePlayer.addEventListener('click', closeVideoPlayer);
    videoPlayer.addEventListener('click', function(e) {
        if (e.target === this) closeVideoPlayer();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (videoPlayer.classList.contains('active')) closeVideoPlayer();
            if (teachersModal.classList.contains('active')) closeModal(teachersModal);
            if (semestersModal.classList.contains('active')) closeModal(semestersModal);
            if (lecturesModal.classList.contains('active')) closeModal(lecturesModal);
            if (deleteAccountModal.classList.contains('active')) closeDeleteAccountModal();
            if (adminPanel.classList.contains('open')) closeAdminPanel();
        }
    });

    // ============================================================
    //       
    // ============================================================

    // =====     =====
    function updateAllAdminSelects() {
        updateBasicSelects();
        updateTeacherSelects();
        updateSemesterSelects();
        updateCodeSelects();
        updateCodesManagement();
        updateEditTeacherData();
    }

    // =====    =====
    function updateBasicSelects() {
        const selectIds = [
            'teacherSection', 'lectureSection',
            'codeSection', 'editTeacherSection', 'editLectureSection',
            'deleteTeacherSection', 'deleteSemesterSection',
            'deleteLectureSection', 'codeTeacherSelect',
            'lectureTeacher', 'lectureSemester',
            'studentSectionFilter', 'studentTeacherFilter',
            'editLectureTeacher', 'editLectureSemester', 'editLectureSelect',
            'deleteSemesterTeacher', 'deleteSemesterSelect',
            'deleteLectureTeacher', 'deleteLectureSemester', 'deleteLectureSelect'
        ];

        selectIds.forEach(id => {
            const select = document.getElementById(id);
            if (!select) return;
            const currentValue = select.value;
            let options = '<option value="">...</option>';
            data.sections.forEach((s, i) => {
                options += `<option value="${i}">${s.name}</option>`;
            });
            //     ""
            if (id === 'studentSectionFilter' || id === 'studentTeacherFilter') {
                options = '<option value="all"></option>';
                data.sections.forEach((s, i) => {
                    options += `<option value="${i}">${s.name}</option>`;
                });
            }
            select.innerHTML = options;
            if (currentValue && data.sections[parseInt(currentValue)]) {
                select.value = currentValue;
            }
            //    'all' 
            if (currentValue === 'all' && (id === 'studentSectionFilter' || id === 'studentTeacherFilter')) {
                select.value = 'all';
            }
        });

        //      
        updateStudentFilters();
    }

    // =====    =====
    function updateTeacherSelects() {
        const teacherSelects = [
            { selectId: 'lectureTeacher', sectionId: 'lectureSection' },
            { selectId: 'codeTeacherSelect', sectionId: 'codeSection' },
            { selectId: 'editTeacherSelect', sectionId: 'editTeacherSection' },
            { selectId: 'editLectureTeacher', sectionId: 'editLectureSection' },
            { selectId: 'deleteTeacherSelect', sectionId: 'deleteTeacherSection' },
            { selectId: 'deleteSemesterTeacher', sectionId: 'deleteSemesterSection' },
            { selectId: 'deleteLectureTeacher', sectionId: 'deleteLectureSection' }
        ];

        teacherSelects.forEach(({ selectId, sectionId }) => {
            const select = document.getElementById(selectId);
            const sectionSelect = document.getElementById(sectionId);
            if (!select || !sectionSelect) return;

            const sectionIndex = parseInt(sectionSelect.value);
            const currentValue = select.value;
            let options = '<option value="">...</option>';

            if (!isNaN(sectionIndex) && sectionIndex >= 0 && data.sections[sectionIndex]) {
                data.sections[sectionIndex].teachers.forEach((t, i) => {
                    options += `<option value="${i}">${t.name}</option>`;
                });
            }

            select.innerHTML = options;
            if (currentValue && !isNaN(sectionIndex) && sectionIndex >= 0 &&
                data.sections[sectionIndex]?.teachers[parseInt(currentValue)]) {
                select.value = currentValue;
            }
        });
    }

    // =====    =====
    function updateSemesterSelects() {
        const semesterSelects = [
            { selectId: 'lectureSemester', teacherId: 'lectureTeacher', sectionId: 'lectureSection' },
            { selectId: 'deleteSemesterSelect', teacherId: 'deleteSemesterTeacher', sectionId: 'deleteSemesterSection' },
            { selectId: 'deleteLectureSemester', teacherId: 'deleteLectureTeacher', sectionId: 'deleteLectureSection' },
            { selectId: 'editLectureSemester', teacherId: 'editLectureTeacher', sectionId: 'editLectureSection' }
        ];

        semesterSelects.forEach(({ selectId, teacherId, sectionId }) => {
            const select = document.getElementById(selectId);
            const teacherSelect = document.getElementById(teacherId);
            const sectionSelect = document.getElementById(sectionId);
            if (!select || !teacherSelect || !sectionSelect) return;

            const sectionIndex = parseInt(sectionSelect.value);
            const teacherIndex = parseInt(teacherSelect.value);
            const currentValue = select.value;

            let options = '<option value="">...</option>';
            if (!isNaN(sectionIndex) && sectionIndex >= 0 &&
                !isNaN(teacherIndex) && teacherIndex >= 0 &&
                data.sections[sectionIndex]?.teachers[teacherIndex]) {
                const teacher = data.sections[sectionIndex].teachers[teacherIndex];
                if (teacher.semesters) {
                    teacher.semesters.forEach((s, i) => {
                        options += `<option value="${i}"> ${s.number} - ${s.description || ''}</option>`;
                    });
                }
            }

            select.innerHTML = options;
            if (currentValue && !isNaN(sectionIndex) && sectionIndex >= 0 &&
                !isNaN(teacherIndex) && teacherIndex >= 0 &&
                data.sections[sectionIndex]?.teachers[teacherIndex]?.semesters[parseInt(currentValue)]) {
                select.value = currentValue;
            }
        });

        //   
        updateLectureSelects();
    }

    // =====    =====
    function updateLectureSelects() {
        const lectureSelects = [
            { selectId: 'editLectureSelect', semesterId: 'editLectureSemester', sectionId: 'editLectureSection',
                teacherId: 'editLectureTeacher' },
            { selectId: 'deleteLectureSelect', semesterId: 'deleteLectureSemester', sectionId: 'deleteLectureSection',
                teacherId: 'deleteLectureTeacher' }
        ];

        lectureSelects.forEach(({ selectId, semesterId, sectionId, teacherId }) => {
            const select = document.getElementById(selectId);
            const semesterSelect = document.getElementById(semesterId);
            const sectionSelect = document.getElementById(sectionId);
            const teacherSelect = document.getElementById(teacherId);
            if (!select || !semesterSelect || !sectionSelect || !teacherSelect) return;

            const sectionIndex = parseInt(sectionSelect.value);
            const teacherIndex = parseInt(teacherSelect.value);
            const semesterIndex = parseInt(semesterSelect.value);
            const currentValue = select.value;

            let options = '<option value="">...</option>';
            if (!isNaN(sectionIndex) && sectionIndex >= 0 &&
                !isNaN(teacherIndex) && teacherIndex >= 0 &&
                !isNaN(semesterIndex) && semesterIndex >= 0 &&
                data.sections[sectionIndex]?.teachers[teacherIndex]?.semesters[semesterIndex]?.lectures) {
                const lectures = data.sections[sectionIndex].teachers[teacherIndex].semesters[semesterIndex].lectures;
                lectures.forEach((l, i) => {
                    options += `<option value="${i}">#${l.number} - ${l.title}</option>`;
                });
            }

            select.innerHTML = options;
            if (currentValue && !isNaN(sectionIndex) && sectionIndex >= 0 &&
                !isNaN(teacherIndex) && teacherIndex >= 0 &&
                !isNaN(semesterIndex) && semesterIndex >= 0 &&
                data.sections[sectionIndex]?.teachers[teacherIndex]?.semesters[semesterIndex]?.lectures[parseInt(
                    currentValue)]) {
                select.value = currentValue;
            }
        });
    }

    // =====    =====
    function updateCodeSelects() {
        const sectionSelect = document.getElementById('codeSection');
        const teacherSelect = document.getElementById('codeTeacherSelect');
        if (!sectionSelect || !teacherSelect) return;

        const sectionIndex = parseInt(sectionSelect.value);
        const currentValue = teacherSelect.value;
        let options = '<option value="">...</option>';

        if (!isNaN(sectionIndex) && sectionIndex >= 0 && data.sections[sectionIndex]) {
            data.sections[sectionIndex].teachers.forEach((t, i) => {
                options += `<option value="${i}">${t.name}</option>`;
            });
        }

        teacherSelect.innerHTML = options;
        if (currentValue && !isNaN(sectionIndex) && sectionIndex >= 0 &&
            data.sections[sectionIndex]?.teachers[parseInt(currentValue)]) {
            teacherSelect.value = currentValue;
        }
    }

    // =====     =====
    function updateEditTeacherData() {
        const sectionSelect = document.getElementById('editTeacherSection');
        const teacherSelect = document.getElementById('editTeacherSelect');

        if (!sectionSelect || !teacherSelect) return;

        const sectionIndex = parseInt(sectionSelect.value);
        const teacherIndex = parseInt(teacherSelect.value);

        if (isNaN(sectionIndex) || sectionIndex < 0 || isNaN(teacherIndex) || teacherIndex < 0 ||
            !data.sections[sectionIndex]?.teachers[teacherIndex]) {
            document.getElementById('editTeacherName').value = '';
            document.getElementById('editTeacherSubject').value = '';
            document.getElementById('editTeacherDesc').value = '';
            document.getElementById('editTeacherImage').value = '';
            return;
        }

        const teacher = data.sections[sectionIndex].teachers[teacherIndex];
        document.getElementById('editTeacherName').value = teacher.name || '';
        document.getElementById('editTeacherSubject').value = teacher.subject || '';
        document.getElementById('editTeacherDesc').value = teacher.description || '';
        document.getElementById('editTeacherImage').value = teacher.image || '';
        document.getElementById('editTeacherMessage').innerHTML = '';
    }

    // =====    =====
    function updateStudentFilters() {
        const sectionFilter = document.getElementById('studentSectionFilter');
        const teacherFilter = document.getElementById('studentTeacherFilter');
        if (!sectionFilter || !teacherFilter) return;

        const sectionIndex = parseInt(sectionFilter.value);
        const currentTeacherValue = teacherFilter.value;

        let options = '<option value="all"> </option>';
        if (!isNaN(sectionIndex) && sectionIndex >= 0 && data.sections[sectionIndex]) {
            data.sections[sectionIndex].teachers.forEach((t, i) => {
                options += `<option value="${i}">${t.name}</option>`;
            });
        }

        teacherFilter.innerHTML = options;
        if (currentTeacherValue !== 'all' && !isNaN(sectionIndex) && sectionIndex >= 0 &&
            data.sections[sectionIndex]?.teachers[parseInt(currentTeacherValue)]) {
            teacherFilter.value = currentTeacherValue;
        }
    }

    // =====    =====
    function updatePendingChanges() {
        if (pendingChangesSpan) pendingChangesSpan.textContent = pendingChanges;
    }

    // =====   =====
    function addChange() {
        pendingChanges++;
        updatePendingChanges();
    }

    // ============================================================
    //  
    // ============================================================
    addSectionForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('sectionName').value.trim();

        if (!name) {
            showToast('warning', '    ');
            return;
        }

        const newSection = {
            id: 'sec-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
            name: name,
            teachers: []
        };

        data.sections.push(newSection);
        saveData();
        renderAllData();
        updateAllAdminSelects();
        addChange();
        document.getElementById('sectionName').value = '';
        showToast('success', `    "${name}" `);
        renderSectionsList();
    });

    // =====    =====
    function renderSectionsList() {
        const container = document.getElementById('sectionsList');
        if (!container) return;

        if (data.sections.length === 0) {
            container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:0.5rem 0;">  </p>';
            return;
        }

        let html = '<div style="margin-top:0.5rem;">';
        data.sections.forEach((section, index) => {
            const teacherCount = section.teachers ? section.teachers.length : 0;
            html += `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:0.3rem 0.6rem;border-bottom:1px solid var(--border);">
                    <span><strong>${section.name}</strong> (${teacherCount} )</span>
                    <button onclick="deleteSection(${index})" class="btn-small btn-danger" style="padding:0.1rem 0.5rem;"></button>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    window.deleteSection = function(index) {
        if (!confirm(`       "${data.sections[index].name}"`)) return;
        data.sections.splice(index, 1);
        saveData();
        renderAllData();
        updateAllAdminSelects();
        addChange();
        renderSectionsList();
        showToast('success', '    ');
    };

    // ============================================================
    //  
    // ============================================================
    addTeacherForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const sectionSelect = document.getElementById('teacherSection');
        const sectionIndex = parseInt(sectionSelect?.value);

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            showToast('warning', '   ');
            return;
        }

        const name = document.getElementById('teacherName').value.trim();
        const emoji = document.getElementById('teacherEmoji').value.trim() || '';
        const subject = document.getElementById('teacherSubject').value.trim();
        const image = document.getElementById('teacherImage').value.trim();

        if (!name) {
            showToast('warning', '    ');
            return;
        }

        const newTeacher = {
            name,
            emoji,
            subject: subject || '',
            description: '',
            image: image || '',
            codes: [],
            semesters: []
        };

        data.sections[sectionIndex].teachers.push(newTeacher);
        saveData();
        renderAllData();
        updateAllAdminSelects();
        addChange();
        document.getElementById('teacherName').value = '';
        document.getElementById('teacherImage').value = '';
        showToast('success', `    "${name}" `);
        renderTeachersListAdmin();
    });

    // =====    =====
    function renderTeachersListAdmin() {
        const container = document.getElementById('teachersListAdmin');
        if (!container) return;

        let html = '';
        data.sections.forEach((section, si) => {
            if (section.teachers.length === 0) return;
            section.teachers.forEach((teacher, ti) => {
                html += `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:0.3rem 0.6rem;border-bottom:1px solid var(--border);">
                        <span><strong>${teacher.name}</strong> - ${section.name}</span>
                        <button onclick="deleteTeacher(${si}, ${ti})" class="btn-small btn-danger" style="padding:0.1rem 0.5rem;"></button>
                    </div>
                `;
            });
        });

        if (!html) {
            html = '<p style="color:var(--text-light);text-align:center;padding:0.5rem 0;">  </p>';
        }
        container.innerHTML = html;
    }

    window.deleteTeacher = function(sectionIndex, teacherIndex) {
        const teacher = data.sections[sectionIndex]?.teachers[teacherIndex];
        if (!teacher) return;
        if (!confirm(`       "${teacher.name}"`)) return;
        data.sections[sectionIndex].teachers.splice(teacherIndex, 1);
        saveData();
        renderAllData();
        updateAllAdminSelects();
        addChange();
        renderTeachersListAdmin();
        showToast('success', '    ');
    };

    // ============================================================
    //  
    // ============================================================
    addLectureForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const sectionSelect = document.getElementById('lectureSection');
        const teacherSelect = document.getElementById('lectureTeacher');
        const semesterSelect = document.getElementById('lectureSemester');

        const sectionIndex = parseInt(sectionSelect?.value);
        const teacherIndex = parseInt(teacherSelect?.value);
        const semesterIndex = parseInt(semesterSelect?.value);
        const number = parseInt(document.getElementById('lectureNumber').value);
        const title = document.getElementById('lectureTitle').value.trim();
        const youtubeUrl = document.getElementById('lectureUrl').value.trim();
        const isFree = document.getElementById('lectureFree').value === 'true';

        if (isNaN(sectionIndex) || sectionIndex < 0 || isNaN(teacherIndex) || teacherIndex < 0 ||
            isNaN(semesterIndex) || semesterIndex < 0 || !number || !title || !youtubeUrl) {
            showToast('warning', '     ');
            return;
        }

        const isValidUrl = youtubeUrl.includes('mediadelivery') ||
            youtubeUrl.includes('youtube') ||
            youtubeUrl.includes('youtu.be') ||
            youtubeUrl.includes('player.') ||
            youtubeUrl.includes('dyntube.com') ||
            youtubeUrl.includes('videos.dyntube.com') ||
            youtubeUrl.includes('dyntube') ||
            youtubeUrl.match(/\.(mp4|webm|ogg|m3u8)(\?.*)?$/i);

        if (!isValidUrl) {
            showToast('warning', '    .   mediadelivery  YouTube  DynTube');
            return;
        }

        const teacher = data.sections[sectionIndex].teachers[teacherIndex];
        if (!teacher.semesters) teacher.semesters = [];
        if (!teacher.semesters[semesterIndex]) {
            teacher.semesters[semesterIndex] = { number: semesterIndex + 1, description: '', lectures: [] };
        }

        const newLecture = { number, title, youtubeUrl, isFree };
        teacher.semesters[semesterIndex].lectures.push(newLecture);
        saveData();
        renderAllData();
        updateAllAdminSelects();
        addChange();
        document.getElementById('lectureTitle').value = '';
        document.getElementById('lectureUrl').value = '';
        document.getElementById('lectureNumber').value = '';
        showToast('success', `    "${title}" `);
    });

    // ============================================================
    //  
    // ============================================================
    window.addManualCode = function() {
        const sectionSelect = document.getElementById('codeSection');
        const teacherSelect = document.getElementById('codeTeacherSelect');
        const codeInput = document.getElementById('manualCodeInput');
        const codeMessage = document.getElementById('manualCodeMessage');

        const sectionIndex = parseInt(sectionSelect?.value);
        const teacherIndex = parseInt(teacherSelect?.value);
        const code = codeInput?.value.trim().toUpperCase();

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            codeMessage.innerHTML = '    ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        if (isNaN(teacherIndex) || teacherIndex < 0) {
            codeMessage.innerHTML = '    ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        if (!code) {
            codeMessage.innerHTML = '   ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        if (code.length < 4) {
            codeMessage.innerHTML = '   ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        const teacher = data.sections[sectionIndex].teachers[teacherIndex];
        if (!teacher) {
            codeMessage.innerHTML = '   ';
            codeMessage.style.color = '#ef4444';
            return;
        }

        if (!teacher.codes) teacher.codes = [];
        const exists = teacher.codes.some(c => c.code === code);
        if (exists) {
            codeMessage.innerHTML = '    ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        teacher.codes.push({
            code: code,
            used: false,
            locked: false,
            deviceId: null,
            userId: null,
            userEmail: null,
            usedAt: null
        });

        saveData();
        addChange();
        updateCodesManagement();
        if (codeInput) codeInput.value = '';
        codeMessage.innerHTML = `   : ${code}`;
        codeMessage.style.color = '#22c55e';
        showToast('success', `   : ${code}`);
        updateAllAdminSelects();
    };

    window.generateCodes = function(count = 5) {
        const sectionSelect = document.getElementById('codeSection');
        const teacherSelect = document.getElementById('codeTeacherSelect');
        const sectionIndex = parseInt(sectionSelect?.value);
        const teacherIndex = parseInt(teacherSelect?.value);

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            showToast('warning', '    ');
            return;
        }

        if (isNaN(teacherIndex) || teacherIndex < 0) {
            showToast('warning', '    ');
            return;
        }

        const teacher = data.sections[sectionIndex].teachers[teacherIndex];
        if (!teacher) { showToast('error', '   '); return; }

        if (!teacher.codes) teacher.codes = [];
        const newCodes = [];

        for (let i = 0; i < count; i++) {
            const prefix = teacher.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let random = '';
            for (let j = 0; j < 8; j++) {
                random += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            const newCode = `${prefix}-${random}`;
            teacher.codes.push({
                code: newCode,
                used: false,
                locked: false,
                deviceId: null,
                userId: null,
                userEmail: null,
                usedAt: null
            });
            newCodes.push(newCode);
        }

        saveData();
        addChange();
        updateCodesManagement();
        showToast('success', `   ${newCodes.length}  `);
        updateAllAdminSelects();
    };

    function updateCodesManagement() {
        const sectionSelect = document.getElementById('codeSection');
        const teacherSelect = document.getElementById('codeTeacherSelect');
        const container = document.getElementById('codesListContainer');

        const sectionIndex = parseInt(sectionSelect?.value);
        const teacherIndex = parseInt(teacherSelect?.value);

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:1rem 0;">  </p>';
            return;
        }

        if (isNaN(teacherIndex) || teacherIndex < 0) {
            container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:1rem 0;">  </p>';
            return;
        }

        const teacher = data.sections[sectionIndex]?.teachers[teacherIndex];
        if (!teacher) {
            container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:1rem 0;">  </p>';
            return;
        }

        const status = getCodesStatus(teacher);
        let html = `
            <div class="codes-stats">
                <span> : ${status.total}</span>
                <span> : ${status.used}</span>
                <span> : ${status.available}</span>
                <span> : ${status.locked}</span>
            </div>
            <div class="codes-table-wrapper">
                <table class="codes-table">
                    <thead><tr><th>#</th><th></th><th></th><th> </th><th></th></tr></thead>
                    <tbody>
        `;

        if (teacher.codes && teacher.codes.length > 0) {
            teacher.codes.forEach((c, index) => {
                const isUsed = c.used;
                const isLocked = c.locked || false;
                const isMyCode = c.userEmail === currentUser?.email;
                let statusText = '',
                    statusColor = '#22c55e',
                    usedAtDisplay = '';

                if (isLocked) { statusText = ' ';
                    statusColor = '#f59e0b'; } else if (isUsed) {
                    statusText = isMyCode ? ' ' : ' ';
                    statusColor = isMyCode ? '#22c55e' : '#ef4444';
                    usedAtDisplay = c.usedAt ? new Date(c.usedAt).toLocaleString('ar') : ' ';
                } else { statusText = ' ';
                    statusColor = '#22c55e'; }

                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><code style="font-weight:700;color:${statusColor};">${c.code}</code></td>
                        <td><span style="color:${statusColor};">${statusText}</span></td>
                        <td style="font-size:0.7rem;color:var(--text-light);">${usedAtDisplay}</td>
                        <td>
                            <button onclick="toggleCodeLock('${sectionIndex}', '${teacherIndex}', '${c.code}')" style="background:${isLocked ? '#22c55e' : '#f59e0b'};color:white;border:none;border-radius:4px;padding:0.15rem 0.5rem;cursor:pointer;font-size:0.7rem;">
                                ${isLocked ? ' ' : ' '}
                            </button>
                            ${!isUsed && !isLocked ? `<button onclick="deleteCodeAction('${sectionIndex}', '${teacherIndex}', '${c.code}')" style="background:#ef4444;color:white;border:none;border-radius:4px;padding:0.15rem 0.5rem;cursor:pointer;font-size:0.7rem;"></button>` : ''}
                        </td>
                    </tr>
                `;
            });
        } else {
            html += `<tr><td colspan="5" style="text-align:center;color:var(--text-light);padding:1rem 0;">  </td></tr>`;
        }

        html += `</tbody></table></div>`;
        container.innerHTML = html;
    }

    window.toggleCodeLock = function(sectionIndex, teacherIndex, code) {
        const teacher = data.sections[sectionIndex]?.teachers[teacherIndex];
        if (!teacher) { showToast('error', '   '); return; }

        const codeData = teacher.codes.find(c => c.code === code);
        if (!codeData) { showToast('error', '   '); return; }

        codeData.locked = !codeData.locked;
        saveData();
        addChange();
        updateCodesManagement();
        showToast('success', `  ${codeData.locked ? '' : ''}  ${code}`);
    };

    window.deleteCodeAction = function(sectionIndex, teacherIndex, code) {
        if (!confirm(`      : ${code}`)) return;

        const teacher = data.sections[sectionIndex]?.teachers[teacherIndex];
        if (!teacher) { showToast('error', '   '); return; }

        const index = teacher.codes.findIndex(c => c.code === code);
        if (index === -1) { showToast('error', '   '); return; }

        if (teacher.codes[index].used) {
            showToast('warning', '     ');
            return;
        }

        teacher.codes.splice(index, 1);
        saveData();
        addChange();
        updateCodesManagement();
        showToast('success', `   : ${code}`);
    };

    // ============================================================
    //  
    // ============================================================
    document.getElementById('editTeacherSection')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('editTeacherSelect')?.addEventListener('change', function() {
        updateEditTeacherData();
    });

    document.getElementById('editTeacherForm')?.addEventListener('submit', function(e) {
        e.preventDefault();

        const sectionSelect = document.getElementById('editTeacherSection');
        const teacherSelect = document.getElementById('editTeacherSelect');
        const messageEl = document.getElementById('editTeacherMessage');

        const sectionIndex = parseInt(sectionSelect?.value);
        const teacherIndex = parseInt(teacherSelect?.value);

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            messageEl.innerHTML = '   ';
            messageEl.style.color = '#f59e0b';
            return;
        }

        if (isNaN(teacherIndex) || teacherIndex < 0) {
            messageEl.innerHTML = '   ';
            messageEl.style.color = '#f59e0b';
            return;
        }

        const teacher = data.sections[sectionIndex].teachers[teacherIndex];
        if (!teacher) {
            messageEl.innerHTML = '   ';
            messageEl.style.color = '#ef4444';
            return;
        }

        const newName = document.getElementById('editTeacherName').value.trim();
        const newSubject = document.getElementById('editTeacherSubject').value.trim();
        const newDesc = document.getElementById('editTeacherDesc').value.trim();
        const newImage = document.getElementById('editTeacherImage').value.trim();

        if (!newName) {
            messageEl.innerHTML = '    ';
            messageEl.style.color = '#f59e0b';
            return;
        }

        teacher.name = newName;
        teacher.subject = newSubject || '';
        teacher.description = newDesc || '';
        teacher.image = newImage || '';

        saveData();
        renderAllData();
        updateAllAdminSelects();
        addChange();

        messageEl.innerHTML = `     "${newName}" !`;
        messageEl.style.color = '#22c55e';
        showToast('success', `     "${newName}"`);
        renderTeachersListAdmin();
    });

    // ============================================================
    //     
    // ============================================================
    window.deleteSelectedTeacherFromTab = function() {
        const sectionSelect = document.getElementById('deleteTeacherSection');
        const teacherSelect = document.getElementById('deleteTeacherSelect');
        const sectionIndex = parseInt(sectionSelect?.value);
        const teacherIndex = parseInt(teacherSelect?.value);

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            showToast('warning', '   ');
            return;
        }

        if (isNaN(teacherIndex) || teacherIndex < 0) {
            showToast('warning', '   ');
            return;
        }

        const teacher = data.sections[sectionIndex].teachers[teacherIndex];
        if (!teacher) { showToast('error', '   '); return; }

        if (!confirm(`       "${teacher.name}"`)) return;

        data.sections[sectionIndex].teachers.splice(teacherIndex, 1);
        saveData();
        renderAllData();
        updateAllAdminSelects();
        addChange();

        const msg = document.getElementById('deleteTeacherMessage');
        if (msg) { msg.innerHTML = `    "${teacher.name}" `;
            msg.style.color = '#22c55e'; }
        showToast('success', `    "${teacher.name}"`);
        renderTeachersListAdmin();
    };

    // ============================================================
    //  
    // ============================================================
    window.deleteSelectedSemesterFromTab = function() {
        const sectionSelect = document.getElementById('deleteSemesterSection');
        const teacherSelect = document.getElementById('deleteSemesterTeacher');
        const semesterSelect = document.getElementById('deleteSemesterSelect');

        const sectionIndex = parseInt(sectionSelect?.value);
        const teacherIndex = parseInt(teacherSelect?.value);
        const semesterIndex = parseInt(semesterSelect?.value);

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            showToast('warning', '   ');
            return;
        }

        if (isNaN(teacherIndex) || teacherIndex < 0) {
            showToast('warning', '   ');
            return;
        }

        if (isNaN(semesterIndex) || semesterIndex < 0) {
            showToast('warning', '   ');
            return;
        }

        const semester = data.sections[sectionIndex].teachers[teacherIndex]?.semesters[semesterIndex];
        if (!semester) { showToast('error', '   '); return; }

        if (!confirm(`       ${semester.number}`)) return;

        data.sections[sectionIndex].teachers[teacherIndex].semesters.splice(semesterIndex, 1);
        saveData();
        renderAllData();
        updateAllAdminSelects();
        addChange();

        const msg = document.getElementById('deleteSemesterMessage');
        if (msg) { msg.innerHTML = `    ${semester.number} `;
            msg.style.color = '#22c55e'; }
        showToast('success', `    ${semester.number}`);
        updateAllAdminSelects();
    };

    // ============================================================
    //  
    // ============================================================
    window.deleteSelectedLectureFromTab = function() {
        const sectionSelect = document.getElementById('deleteLectureSection');
        const teacherSelect = document.getElementById('deleteLectureTeacher');
        const semesterSelect = document.getElementById('deleteLectureSemester');
        const lectureSelect = document.getElementById('deleteLectureSelect');

        const sectionIndex = parseInt(sectionSelect?.value);
        const teacherIndex = parseInt(teacherSelect?.value);
        const semesterIndex = parseInt(semesterSelect?.value);
        const lectureIndex = parseInt(lectureSelect?.value);

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            showToast('warning', '   ');
            return;
        }

        if (isNaN(teacherIndex) || teacherIndex < 0) {
            showToast('warning', '   ');
            return;
        }

        if (isNaN(semesterIndex) || semesterIndex < 0) {
            showToast('warning', '   ');
            return;
        }

        if (isNaN(lectureIndex) || lectureIndex < 0) {
            showToast('warning', '   ');
            return;
        }

        const lecture = data.sections[sectionIndex].teachers[teacherIndex]?.semesters[semesterIndex]?.lectures[lectureIndex];
        if (!lecture) { showToast('error', '   '); return; }

        if (!confirm(`       "${lecture.title}"`)) return;

        data.sections[sectionIndex].teachers[teacherIndex].semesters[semesterIndex].lectures.splice(lectureIndex, 1);
        saveData();
        renderAllData();
        updateAllAdminSelects();
        addChange();

        const msg = document.getElementById('deleteLectureMessage');
        if (msg) { msg.innerHTML = `    "${lecture.title}" `;
            msg.style.color = '#22c55e'; }
        showToast('success', `    "${lecture.title}"`);
        updateAllAdminSelects();
    };

    // ============================================================
    //  
    // ============================================================
    window.addNewAdmin = async function() {
        const emailInput = document.getElementById('adminEmailInput');
        const messageEl = document.getElementById('addAdminMessage');
        const email = emailInput.value.trim();

        if (!email) {
            messageEl.innerHTML = '    ';
            messageEl.style.color = '#f59e0b';
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            messageEl.innerHTML = '    ';
            messageEl.style.color = '#f59e0b';
            return;
        }

        if (!supabaseClient) {
            messageEl.innerHTML = ' Supabase  ';
            messageEl.style.color = '#ef4444';
            return;
        }

        try {
            let { data: userData, error: userError } = await supabaseClient
                .from('users')
                .select('id, email')
                .eq('email', email)
                .maybeSingle();

            if (!userData) {
                messageEl.innerHTML = `
                      <strong>${email}</strong>  .
                    <br><br>
                    <button onclick="fixUserAndAddAdmin('${email}')" style="background:var(--primary);color:white;border:none;padding:0.4rem 1rem;border-radius:8px;cursor:pointer;font-weight:600;">
                        <i class="fas fa-sync"></i>  
                    </button>
                `;
                messageEl.style.color = '#f59e0b';
                return;
            }

            const { data: existingAdmin, error: checkError } = await supabaseClient
                .from('admins')
                .select('email')
                .eq('email', email)
                .maybeSingle();

            if (existingAdmin) {
                messageEl.innerHTML = '    ';
                messageEl.style.color = '#f59e0b';
                return;
            }

            const { error: insertError } = await supabaseClient
                .from('admins')
                .insert({ uid: userData.id, email: email, role: 'admin' });

            if (insertError) {
                messageEl.innerHTML = '   : ' + insertError.message;
                messageEl.style.color = '#ef4444';
                return;
            }

            messageEl.innerHTML = `   : ${email} !`;
            messageEl.style.color = '#22c55e';
            emailInput.value = '';
            showToast('success', `   : ${email}`);
            loadAdminsList();

        } catch (error) {
            messageEl.innerHTML = '  : ' + error.message;
            messageEl.style.color = '#ef4444';
            console.error('Error adding admin:', error);
        }
    };

    async function loadAdminsList() {
        const container = document.getElementById('adminsListContainer');
        if (!container) return;

        if (!supabaseClient) {
            container.innerHTML = '<p style="color:var(--text-light);text-align:center;"> Supabase  </p>';
            return;
        }

        try {
            const { data: admins, error } = await supabaseClient
                .from('admins')
                .select('email, uid, created_at')
                .order('created_at', { ascending: true });

            if (error) {
                container.innerHTML = '<p style="color:var(--text-light);text-align:center;">   </p>';
                return;
            }

            if (!admins || admins.length === 0) {
                container.innerHTML = '<p style="color:var(--text-light);text-align:center;">    </p>';
                return;
            }

            let html = `
                <div style="overflow-x:auto;">
                    <table class="admins-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th> </th>
                                <th> </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            admins.forEach((admin, index) => {
                const isCurrentUser = admin.email === currentUser?.email;
                const createdAt = admin.created_at ? new Date(admin.created_at).toLocaleDateString('ar') : ' ';

                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${admin.email} ${isCurrentUser ? ' ()' : ''}</td>
                        <td style="color:var(--text-light);font-size:0.7rem;">${createdAt}</td>
                        <td>
                            ${!isCurrentUser ? `<button onclick="deleteAdmin('${admin.email}')" class="btn-delete-admin"> </button>` : '<span style="color:var(--text-light);font-size:0.7rem;">   </span>'}
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            container.innerHTML = html;

        } catch (error) {
            container.innerHTML = '<p style="color:var(--text-light);text-align:center;">   </p>';
            console.error('Error loading admins:', error);
        }
    }

    window.deleteAdmin = async function(email) {
        if (!confirm(`      : ${email}`)) return;

        if (!supabaseClient) {
            showToast('error', ' Supabase  ');
            return;
        }

        try {
            const { error } = await supabaseClient
                .from('admins')
                .delete()
                .eq('email', email);

            if (error) {
                showToast('error', '   : ' + error.message);
                return;
            }

            showToast('success', `   : ${email}`);
            loadAdminsList();

        } catch (error) {
            showToast('error', '  : ' + error.message);
            console.error('Error deleting admin:', error);
        }
    };

    // ============================================================
    //   
    // ============================================================
    function renderUsersTable() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        const usersMap = new Map();

        data.sections.forEach(section => {
            section.teachers.forEach(teacher => {
                if (teacher.codes) {
                    teacher.codes.forEach(c => {
                        if (c.used && c.userEmail) {
                            if (!usersMap.has(c.userEmail)) {
                                usersMap.set(c.userEmail, {
                                    email: c.userEmail,
                                    userId: c.userId || ' ',
                                    courses: [],
                                    registeredAt: c.usedAt || new Date().toISOString(),
                                    progress: 0
                                });
                            }
                            if (!usersMap.get(c.userEmail).courses.includes(teacher.name)) {
                                usersMap.get(c.userEmail).courses.push(teacher.name);
                            }
                        }
                    });
                }
            });
        });

        if (usersMap.size === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-light);padding:1rem 0;">   </td></tr>';
            return;
        }

        let html = '';
        let index = 1;
        usersMap.forEach((user, email) => {
            const isAdmin = email === currentUser?.email && isAdminLoggedIn;
            const courseCount = user.courses.length;
            const progress = user.progress || 0;

            html += `
                <tr>
                    <td>${index++}</td>
                    <td>${email}</td>
                    <td>${user.courses.join(' ')}</td>
                    <td>${courseCount}</td>
                    <td>${progress}%</td>
                    <td>${new Date(user.registeredAt).toLocaleDateString('ar')}</td>
                    <td><span class="badge ${isAdmin ? 'admin' : 'user'}">${isAdmin ? '' : ''}</span></td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    // ============================================================
    //  
    // ============================================================
    window.filterStudents = function() {
        const sectionFilter = document.getElementById('studentSectionFilter');
        const teacherFilter = document.getElementById('studentTeacherFilter');
        const tbody = document.getElementById('studentsTableBody');

        const sectionIndex = parseInt(sectionFilter?.value);
        const teacherIndex = parseInt(teacherFilter?.value);

        const usersMap = new Map();

        data.sections.forEach((section, si) => {
            //  
            if (!isNaN(sectionIndex) && sectionIndex >= 0 && si !== sectionIndex) return;

            section.teachers.forEach((teacher, ti) => {
                //  
                if (!isNaN(teacherIndex) && teacherIndex >= 0 && ti !== teacherIndex) return;

                if (teacher.codes) {
                    teacher.codes.forEach(c => {
                        if (c.used && c.userEmail) {
                            if (!usersMap.has(c.userEmail)) {
                                let totalLectures = 0;
                                let completedLectures = 0;
                                if (teacher.semesters) {
                                    teacher.semesters.forEach(semester => {
                                        if (semester.lectures) {
                                            semester.lectures.forEach(lecture => {
                                                totalLectures++;
                                                if (lecture.isFree || c.used) {
                                                    completedLectures++;
                                                }
                                            });
                                        }
                                    });
                                }
                                const progress = totalLectures > 0 ? Math.round((completedLectures /
                                    totalLectures) * 100) : 0;

                                usersMap.set(c.userEmail, {
                                    email: c.userEmail,
                                    sectionName: section.name,
                                    teacherName: teacher.name,
                                    totalLectures: totalLectures,
                                    completedLectures: completedLectures,
                                    progress: progress,
                                    registeredAt: c.usedAt || new Date().toISOString()
                                });
                            }
                        }
                    });
                }
            });
        });

        if (usersMap.size === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-light);padding:2rem 0;"><i class="fas fa-users" style="font-size:2rem;display:block;margin-bottom:0.5rem;"></i>   </td></tr>';
            return;
        }

        let html = '';
        let index = 1;
        usersMap.forEach((user) => {
            html += `
                <tr>
                    <td>${index++}</td>
                    <td>${user.email}</td>
                    <td>${user.sectionName}</td>
                    <td>${user.teacherName}</td>
                    <td>${user.totalLectures}</td>
                    <td>${user.completedLectures}</td>
                    <td class="progress-cell">
                        <div class="mini-bar">
                            <div class="mini-fill" style="width:${user.progress}%;"></div>
                        </div>
                        <span class="mini-label">${user.progress}%</span>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    };

    // ============================================================
    //  -  
    // ============================================================
    window.updateBanner = function() {
        const urlInput = document.getElementById('bannerUrlInput');
        const message = document.getElementById('bannerMessage');
        const url = urlInput.value.trim();

        if (!url) {
            message.innerHTML = '    ';
            message.style.color = '#f59e0b';
            return;
        }

        try {
            new URL(url);
        } catch (e) {
            message.innerHTML = '   ';
            message.style.color = '#f59e0b';
            return;
        }

        localStorage.setItem('bannerImage', url);
        document.getElementById('bannerImage').src = url;
        document.getElementById('bannerImage').style.display = 'block';
        document.getElementById('bannerPlaceholder').style.display = 'none';
        message.innerHTML = '     ';
        message.style.color = '#22c55e';
        showToast('success', '    ');
    };

    // ============================================================
    //  -  
    // ============================================================
    window.clearCache = function() {
        if (!confirm('      ')) return;

        try {
            localStorage.removeItem('academyData');
            localStorage.removeItem('devAcademicUser');
            localStorage.removeItem('devAcademicTheme');
            localStorage.removeItem('bannerImage');
            document.cookie.split(';').forEach(c => {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() +
                ';path=/');
            });
            showToast('success', '    ');
            setTimeout(() => { window.location.reload(); }, 800);
        } catch (error) {
            showToast('error', '   ');
        }
    };

    // ============================================================
    //  -  
    // ============================================================
    window.exportData = function() {
        try {
            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dev_academy_data_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('success', '    ');
        } catch (error) {
            showToast('error', '   ');
        }
    };

    // ============================================================
    //  -   
    // ============================================================
    window.deleteAllData = function() {
        if (!confirm(' !       .   ')) return;
        if (!confirm('  :       ')) return;

        try {
            localStorage.removeItem('academyData');
            localStorage.removeItem('devAcademicUser');
            localStorage.removeItem('devAcademicTheme');
            localStorage.removeItem('bannerImage');
            localStorage.removeItem('deviceId');
            data = { sections: JSON.parse(JSON.stringify(defaultSections)) };
            normalizeDataStructure(data);
            saveData();
            renderAllData();
            updateAllAdminSelects();
            showToast('success', '    ');
            setTimeout(() => { window.location.reload(); }, 800);
        } catch (error) {
            showToast('error', '   ');
        }
    };

    // ============================================================
    // 
    // ============================================================
    publishBtn?.addEventListener('click', async function() {
        if (pendingChanges === 0) {
            showToast('info', '    ');
            return;
        }

        if (!supabaseClient) {
            showToast('error', ' Supabase  ');
            return;
        }

        const isAdmin = await isUserAdmin(currentUser?.email);
        if (!(isAdminLoggedIn || isAdmin)) {
            showToast('error', '    ');
            return;
        }

        const result = await saveSupabaseAcademyData();
        if (!result.success) {
            showToast('error', '  : ' + (result.error?.message || '  '));
            return;
        }

        pendingChanges = 0;
        updatePendingChanges();
        showToast('success', '    ');

        const msg = document.getElementById('publishMessage');
        if (msg) { msg.textContent = '    ';
            msg.style.color = '#22c55e'; }
        setTimeout(() => { if (msg) msg.textContent = ''; }, 5000);
    });

    // ============================================================
    //  
    // ============================================================
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById('tab-' + this.dataset.tab).classList.add('active');

            if (this.dataset.tab === 'manage-codes' || this.dataset.tab === 'codes') {
                updateAllAdminSelects();
                updateCodesManagement();
            }
            if (this.dataset.tab === 'sections') {
                updateAllAdminSelects();
                renderSectionsList();
            }
            if (this.dataset.tab === 'teachers') {
                updateAllAdminSelects();
                renderTeachersListAdmin();
            }
            if (this.dataset.tab === 'students') {
                updateAllAdminSelects();
                filterStudents();
            }
            if (this.dataset.tab === 'users') {
                renderUsersTable();
            }
            if (this.dataset.tab === 'admins') {
                loadAdminsList();
            }
            if (this.dataset.tab === 'edit-teacher') {
                updateAllAdminSelects();
            }
            if (this.dataset.tab === 'settings') {
                //   
                const savedBanner = localStorage.getItem('bannerImage');
                if (savedBanner) {
                    document.getElementById('bannerImage').src = savedBanner;
                    document.getElementById('bannerImage').style.display = 'block';
                    document.getElementById('bannerPlaceholder').style.display = 'none';
                    document.getElementById('bannerUrlInput').value = savedBanner;
                }
                //    
                const darkModeToggle = document.getElementById('darkModeToggle');
                if (darkModeToggle) darkModeToggle.checked = isDarkMode;
            }
        });
    });

    // ============================================================
    //   
    // ============================================================
    document.getElementById('teacherSection')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('lectureSection')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('codeSection')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('editTeacherSection')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('editLectureSection')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('deleteTeacherSection')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('deleteSemesterSection')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('deleteLectureSection')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('lectureTeacher')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('codeTeacherSelect')?.addEventListener('change', function() {
        updateCodesManagement();
    });

    document.getElementById('editTeacherSelect')?.addEventListener('change', function() {
        updateEditTeacherData();
    });

    document.getElementById('editLectureTeacher')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('deleteSemesterTeacher')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('deleteLectureTeacher')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('lectureSemester')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('editLectureSemester')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('deleteSemesterSelect')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('deleteLectureSemester')?.addEventListener('change', function() {
        updateAllAdminSelects();
    });

    document.getElementById('studentSectionFilter')?.addEventListener('change', function() {
        updateAllAdminSelects();
        filterStudents();
    });

    document.getElementById('studentTeacherFilter')?.addEventListener('change', function() {
        filterStudents();
    });

    // ============================================================
    //  
    // ============================================================
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // ============================================================
    // 
    // ============================================================
    const savedTheme = localStorage.getItem('devAcademicTheme');
    if (savedTheme === 'dark') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    //   
    const savedBanner = localStorage.getItem('bannerImage');
    if (savedBanner) {
        document.getElementById('bannerImage').src = savedBanner;
        document.getElementById('bannerImage').style.display = 'block';
        document.getElementById('bannerPlaceholder').style.display = 'none';
        document.getElementById('bannerUrlInput').value = savedBanner;
    }

    async function init() {
        if (supabaseClient) {
            try {
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (session?.user) {
                    currentUser = session.user;
                    localStorage.setItem('devAcademicUser', JSON.stringify({
                        email: currentUser.email,
                        name: currentUser.user_metadata?.full_name || ''
                    }));
                    updateUI();
                    await loadUserCodesFromSupabase();
                    renderAllData();
                    renderMyCourses();
                    renderAccount();
                    updateBadge();

                    loadingScreen.classList.add('hidden');
                    app.style.display = 'block';
                    navbar.style.display = 'flex';
                    bottomNav.style.display = 'flex';

                    navigateTo('home');
                    showToast('success', '  ');
                    console.log(' :', currentUser.email);
                } else {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.warn('Session check error:', error);
                window.location.href = 'index.html';
            }
        } else {
            window.location.href = 'index.html';
        }

        if (supabaseClient && currentUser) {
            try {
                const channel = supabaseClient
                    .channel('public:academy_data')
                    .on('postgres_changes', {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'academy_data',
                        filter: 'id=eq.main'
                    }, (payload) => {
                        if (!payload?.new?.content) return;
                        try {
                            const remoteData = payload.new.content;
                            if (JSON.stringify(remoteData) !== JSON.stringify(data)) {
                                data = remoteData;
                                normalizeDataStructure(data);
                                saveData();
                                renderAllData();
                                renderMyCourses();
                                renderAccount();
                                updateBadge();
                                showToast('info', '    ');
                            }
                        } catch (err) { console.warn('Realtime parse error:', err); }
                    })
                    .subscribe();
                console.log('    Supabase');
            } catch (error) {
                console.warn('Supabase realtime subscription failed:', error);
            }
        }

        renderUsersTable();
        updateAllAdminSelects();
        loadAdminsList();
        renderSectionsList();
        renderTeachersListAdmin();
        filterStudents();
        console.log('   -     ');
        console.log('    ');
        console.log('   mediadelivery  YouTube  DynTube ');
        console.log('       RPC');
    }

    loadData().then(init).catch((error) => {
        console.error('Initialization failed:', error);
        window.location.href = 'index.html';
    });

})();