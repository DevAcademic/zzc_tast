(function() {
    'use strict';

    // ============================================================
    //  F12  
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
            (e.ctrlKey && (e.key === 'S' || e.key === 's')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c'))) {
            e.preventDefault();
            showToast('warning', '    ');
            return false;
        }
    });

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showToast('warning', '');
        return false;
    });

    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // ============================================================
    //   
    // ============================================================
    (function detectDevTools() {
        // ملاحظة: تم تعطيل إجراء "مسح الصفحة والتحويل لصفحة فارغة" لأنه كان
        // يسبب طرد المستخدم من لوحة الإدارة عند أي تغيير بسيط في أبعاد
        // النافذة (فتح لوحة الإدارة، ظهور لوحة مفاتيح الجوال، تغيير حجم
        // المتصفح...). أصبح الآن لا يفعل أي شيء تخريبي بالصفحة.
        var threshold = 250;

        function checkDevTools() {
            // تم تعطيل هذا الفحص بالكامل لأنه كان يسبب مشاكل حقيقية
            // (طرد المستخدمين من لوحة الإدارة). إذا رغبت بإعادة تفعيله
            // مستقبلاً يفضل ربطه بتحذير بسيط فقط بدون مسح الصفحة.
        }
    })();

    // ============================================================
    //  console.log  
    // ============================================================
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.log = function() {};
        console.warn = function() {};
        console.info = function() {};
        console.error = function() {};
    }

    // ============================================================
    //    -   
    // ============================================================
    var ADMIN_EMAILS = [
        'sajadsarmd200@gmail.com'
    ];

    // ============================================================
    //  Supabase
    // ============================================================
    var SUPABASE_URL = 'https://mgcljgrkxhyjjmxqjkti.supabase.co';
    var SUPABASE_ANON_KEY = 'sb_publishable_TE4fMQARKZb0XcjhAnEJhA_ws6AUxoi';
    var supabaseClient = null;

    if (window.supabase) {
        if (!window._supabaseClient) {
            window._supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }
        supabaseClient = window._supabaseClient;
    }

    // ============================================================
    //  
    // ============================================================
    var currentUser = null;
    var data = { sections: [] };
    var isDarkMode = false;
    var isAdminLoggedIn = false;
    var pendingChanges = 0;
    var activeTeacher = null;
    var activeTeacherIndex = null;
    var activeSectionIndex = null;
    var currentFilter = 'all';
    var userDeviceId = getDeviceId();

    // ============================================================
    //  
    // ============================================================
    var defaultSections = [
        { id: 'first-intermediate', name: ' ', teachers: [] },
        { id: 'second-intermediate', name: ' ', teachers: [] },
        { id: 'third-intermediate', name: ' ', teachers: [] },
        { id: 'fourth-scientific', name: ' ', teachers: [] },
        { id: 'fourth-literary', name: ' ', teachers: [] },
        { id: 'fifth-scientific', name: ' ', teachers: [] },
        { id: 'fifth-literary', name: ' ', teachers: [] },
        { id: 'sixth-scientific', name: ' ', teachers: [] },
        { id: 'sixth-literary', name: ' ', teachers: [] }
    ];

    // ============================================================
    //  DOM
    // ============================================================
    var loadingScreen = document.getElementById('loadingScreen');
    var app = document.getElementById('app');
    var navbar = document.getElementById('navbar');
    var bottomNav = document.getElementById('bottomNav');
    var teachersGridContainer = document.getElementById('teachersGridContainer');
    var teachersGridContainer2 = document.getElementById('teachersGridContainer2');
    var sectionFilter = document.getElementById('sectionFilter');
    var sectionFilter2 = document.getElementById('sectionFilter2');
    var teachersCount = document.getElementById('teachersCount');
    var teachersCount2 = document.getElementById('teachersCount2');
    var searchInput = document.getElementById('searchInput');
    var searchBtn = document.getElementById('searchBtn');
    var videoPlayer = document.getElementById('videoPlayer');
    var closePlayer = document.getElementById('closePlayer');
    var videoWrapper = document.getElementById('videoWrapper');
    var themeToggle = document.getElementById('themeToggle');
    var toastContainer = document.getElementById('toastContainer');
    var userNameDisplay = document.getElementById('userNameDisplay');
    var userAvatar = document.getElementById('userAvatar');

    // ============================================================
    //  ADMIN
    // ============================================================
    var adminPanel = document.getElementById('adminPanel');
    var adminOverlay = document.getElementById('adminOverlay');
    var adminClose = document.getElementById('adminClose');
    var tabBtns = document.querySelectorAll('.admin-tabs .tab-btn');
    var publishBtn = document.getElementById('publishBtn');
    var pendingChangesSpan = document.getElementById('pendingChanges');

    // ============================================================
    // 
    // ============================================================
    var addSectionForm = document.getElementById('addSectionForm');
    var addTeacherForm = document.getElementById('addTeacherForm');
    var addLectureForm = document.getElementById('addLectureForm');

    // ============================================================
    //  
    // ============================================================
    var teachersModal = document.getElementById('teachersModal');
    var closeTeachersModal = document.getElementById('closeTeachersModal');
    var teachersList = document.getElementById('teachersList');
    var semestersModal = document.getElementById('semestersModal');
    var closeSemestersModal = document.getElementById('closeSemestersModal');
    var semestersList = document.getElementById('semestersList');
    var modalTeacherTitle = document.getElementById('modalTeacherTitle');
    var lecturesModal = document.getElementById('lecturesModal');
    var closeLecturesModal = document.getElementById('closeLecturesModal');
    var lecturesList = document.getElementById('lecturesList');
    var modalSemesterTitle = document.getElementById('modalSemesterTitle');

    // ============================================================
    //  
    // ============================================================
    var accountName = document.getElementById('accountName');
    var accountEmail = document.getElementById('accountEmail');
    var accountAvatar = document.getElementById('accountAvatar');
    var accountRegistered = document.getElementById('accountRegistered');
    var accountCourses = document.getElementById('accountCourses');
    var accountCodes = document.getElementById('accountCodes');
    var accountProgress = document.getElementById('accountProgress');
    var accountLectures = document.getElementById('accountLectures');
    var logoutAccountBtn = document.getElementById('logoutAccountBtn');
    var adminPanelBtn = document.getElementById('adminPanelBtn');
    var deleteAccountBtn = document.getElementById('deleteAccountBtn');
    var coursesBadge = document.getElementById('coursesBadge');
    var coursesBadgeMobile = document.getElementById('coursesBadgeMobile');

    // ============================================================
    //  
    // ============================================================
    var deleteAccountModal = document.getElementById('deleteAccountModal');
    var closeDeleteModal = document.getElementById('closeDeleteModal');
    var deletePasswordInput = document.getElementById('deletePasswordInput');
    var deleteAccountMessage = document.getElementById('deleteAccountMessage');

    // ============================================================
    // DEVICE ID
    // ============================================================
    function getDeviceId() {
        var deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'DEV_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }

    // ============================================================
    // TOAST
    // ============================================================
    function showToast(type, message, duration) {
        duration = duration || 4000;
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        var icons = { success: '', error: '', warning: '', info: '' };
        toast.innerHTML = '<span>' + (icons[type] || '') + ' ' + message + '</span><button class="toast-close" onclick="this.parentElement.remove()"></button>';
        toastContainer.appendChild(toast);
        setTimeout(function() {
            toast.style.animation = 'slideOut 0.4s ease forwards';
            setTimeout(function() { toast.remove(); }, 400);
        }, duration);
    }

    // ============================================================
    //    
    // ============================================================
    async function checkIsAdmin(email) {
        if (!email) return false;

        if (ADMIN_EMAILS.includes(email)) {
            console.log('   :', email);
            return true;
        }

        if (supabaseClient) {
            try {
                var result = await supabaseClient
                    .from('admins')
                    .select('email')
                    .eq('email', email)
                    .maybeSingle();
                if (result.data) {
                    console.log('   Supabase:', email);
                    return true;
                }
            } catch (e) {
                console.warn('    Supabase:', e);
            }
        }

        return false;
    }

    // ============================================================
    //   
    // ============================================================
    function hasAccessToTeacher(teacher) {
        if (!teacher || !teacher.codes) return false;
        if (!currentUser) return false;
        var hasAccess = teacher.codes.some(function(c) { return c.used && c.userEmail === currentUser.email && !c.locked; });
        return hasAccess;
    }

    // ============================================================
    //   
    // ============================================================
    async function verifyCode(teacher, code) {
        if (!teacher.codes || teacher.codes.length === 0) {
            return { valid: false, message: '    ' };
        }

        if (!currentUser) {
            return { valid: false, message: '      ' };
        }

        var codeData = teacher.codes.find(function(c) { return c.code === code; });
        if (!codeData) {
            return { valid: false, message: '   ' };
        }

        if (codeData.locked === true) {
            return { valid: false, message: '      ' };
        }

        if (codeData.used) {
            if (codeData.userEmail === currentUser.email) {
                return { valid: true, message: '    ' };
            } else {
                var usedAt = codeData.usedAt ? new Date(codeData.usedAt).toLocaleString('ar') : '  ';
                return {
                    valid: false,
                    message: '       \n   : ' + usedAt
                };
            }
        }

        codeData.used = true;
        codeData.deviceId = userDeviceId;
        codeData.userId = currentUser.id;
        codeData.userEmail = currentUser.email;
        codeData.usedAt = new Date().toISOString();
        saveData();

        var syncResult = await syncCodeWithSupabase(teacher, codeData);
        if (!syncResult.success) {
            codeData.used = false;
            codeData.userId = null;
            codeData.userEmail = null;
            codeData.usedAt = null;
            saveData();
            return { valid: false, message: '      ' };
        }

        await addCodeToUserCodes(currentUser.id, codeData.code);
        updateUserCodesStorage();
        renderAllData();
        renderMyCourses();
        renderAccount();
        updateBadge();

        return { valid: true, message: '    -     ' };
    }

    // ============================================================
    //    Supabase
    // ============================================================
    async function syncCodeWithSupabase(teacher, codeData) {
        if (!currentUser || !supabaseClient) {
            return { success: false, error: 'No authenticated user or Supabase unavailable' };
        }
        try {
            var record = {
                code: codeData.code,
                teacher_name: teacher.name,
                user_id: currentUser.id,
                user_email: currentUser.email,
                device_id: userDeviceId,
                used: true,
                locked: codeData.locked || false,
                used_at: codeData.usedAt || new Date().toISOString(),
            };

            var result = await supabaseClient.from('teacher_codes').upsert(record, { onConflict: 'code' });
            if (result.error) {
                console.warn('     Supabase:', result.error.message || result.error);
                return { success: false, error: result.error };
            }

            var updateResult = await supabaseClient.from('codes').update({
                is_used: true,
                user_id: currentUser.id,
                user_email: currentUser.email,
                device_id: userDeviceId,
                used_at: new Date().toISOString()
            }).eq('code', codeData.code);

            if (updateResult.error) {
                console.warn('      codes:', updateResult.error);
            }

            console.log('     Supabase:', codeData.code);
            return { success: true };
        } catch (error) {
            console.warn('    :', error);
            return { success: false, error: error };
        }
    }

    // ============================================================
    //    
    // ============================================================
    async function addCodeToUserCodes(userId, code) {
        if (!supabaseClient) return;
        try {
            var codeResult = await supabaseClient
                .from('codes').select('id').eq('code', code).single();
            if (codeResult.error) {
                console.warn('      :', codeResult.error);
                return;
            }

            var existingResult = await supabaseClient
                .from('user_codes').select('id').eq('user_id', userId).eq('code_id', codeResult.data.id).maybeSingle();
            if (existingResult.data) {
                console.log('    ');
                return;
            }

            var insertResult = await supabaseClient.from('user_codes').insert({
                user_id: userId,
                code_id: codeResult.data.id,
                used_at: new Date().toISOString()
            });
            if (insertResult.error) {
                console.warn('     user_codes:', insertResult.error);
            } else {
                console.log('      :', code);
            }
        } catch (error) {
            console.warn('    :', error);
        }
    }

    // ============================================================
    //      
    // ============================================================
    function updateUserCodesStorage() {
        if (!currentUser) return;
        var userCodes = [];
        data.sections.forEach(function(section) {
            section.teachers.forEach(function(teacher) {
                if (teacher.codes) {
                    teacher.codes.forEach(function(code) {
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
    //      
    // ============================================================
    function restoreUserCodesFromStorage() {
        if (!currentUser) return;
        var stored = localStorage.getItem('userCodes_' + currentUser.email);
        if (!stored) return;
        try {
            var userCodes = JSON.parse(stored);
            userCodes.forEach(function(savedCode) {
                data.sections.forEach(function(section) {
                    section.teachers.forEach(function(teacher) {
                        if (teacher.codes) {
                            var codeData = teacher.codes.find(function(c) { return c.code === savedCode.code; });
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
            console.warn('      ');
        }
    }

    // ============================================================
    //     Supabase
    // ============================================================
    async function loadUserCodesFromSupabase() {
        if (!currentUser || !supabaseClient) return;
        restoreUserCodesFromStorage();
        try {
            var codesResult = await supabaseClient
                .from('user_codes').select('code_id').eq('user_id', currentUser.id);
            if (codesResult.error) {
                console.warn('   :', codesResult.error);
                return;
            }
            if (!codesResult.data || codesResult.data.length === 0) return;
            var codeIds = codesResult.data.map(function(uc) { return uc.code_id; });
            var detailsResult = await supabaseClient
                .from('codes').select('*').in('id', codeIds);
            if (detailsResult.error) {
                console.warn('    :', detailsResult.error);
                return;
            }

            var restoredCount = 0;
            detailsResult.data.forEach(function(codeRecord) {
                data.sections.forEach(function(section) {
                    section.teachers.forEach(function(teacher) {
                        if (!teacher.codes) teacher.codes = [];
                        var localCode = teacher.codes.find(function(c) { return c.code === codeRecord.code; });
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
                console.log('  ', restoredCount, '  Supabase');
                showToast('success', '   ' + restoredCount + '  ');
            }
        } catch (error) {
            console.warn('    :', error);
        }
    }

    // ============================================================
    //  
    // ============================================================
    function getCodesStatus(teacher) {
        if (!teacher.codes) return { total: 0, used: 0, available: 0, locked: 0 };
        var total = teacher.codes.length;
        var used = teacher.codes.filter(function(c) { return c.used; }).length;
        var locked = teacher.codes.filter(function(c) { return c.locked; }).length;
        return { total: total, used: used, available: total - used, locked: locked };
    }

    // ============================================================
    //  
    // ============================================================
    function normalizeDataStructure(courseData) {
        if (!courseData || !Array.isArray(courseData.sections)) {
            courseData.sections = [];
        }
        courseData.sections.forEach(function(section) {
            if (!Array.isArray(section.teachers)) { section.teachers = []; }
            section.teachers.forEach(function(teacher) {
                if (!Array.isArray(teacher.codes)) { teacher.codes = []; }
                if (!Array.isArray(teacher.semesters)) { teacher.semesters = []; }
                teacher.codes.forEach(function(c) {
                    if (c.used === undefined) c.used = false;
                    if (c.locked === undefined) c.locked = false;
                    if (!('deviceId' in c)) c.deviceId = null;
                    if (!('usedAt' in c)) c.usedAt = null;
                    if (!('userId' in c)) c.userId = null;
                    if (!('userEmail' in c)) c.userEmail = null;
                });
                teacher.semesters.forEach(function(semester) {
                    if (!Array.isArray(semester.lectures)) { semester.lectures = []; }
                    semester.lectures.forEach(function(lecture) {
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
                var remoteData = await getSupabaseAcademyData();
                if (remoteData && remoteData.sections && Array.isArray(remoteData.sections)) {
                    data = remoteData;
                    normalizeDataStructure(data);
                    localStorage.setItem('academyData', JSON.stringify(data));
                    console.log('     Supabase');
                    return;
                }
            }
            var savedData = localStorage.getItem('academyData');
            if (savedData) {
                try {
                    var parsed = JSON.parse(savedData);
                    if (parsed && parsed.sections && Array.isArray(parsed.sections)) {
                        data = parsed;
                        normalizeDataStructure(data);
                        console.log('     localStorage');
                        return;
                    }
                } catch (e) { console.warn('  localStorage '); }
            }
            data = { sections: JSON.parse(JSON.stringify(defaultSections)) };
            normalizeDataStructure(data);
            localStorage.setItem('academyData', JSON.stringify(data));
            showToast('info', '    ');
        } catch (error) {
            console.warn('   :', error.message);
        }
    }

    function saveData() {
        try {
            localStorage.setItem('academyData', JSON.stringify(data));
            console.log('    ');
        } catch (error) {
            console.error('    :', error);
            showToast('error', '    ');
        }
    }

    async function getSupabaseAcademyData() {
        if (!supabaseClient) return null;
        try {
            var result = await supabaseClient
                .from('academy_data').select('content').eq('id', 'main').maybeSingle();
            if (result.error) { console.warn('Supabase academy data lookup failed:', result.error.message || result.error); return null; }
            return result.data?.content || null;
        } catch (error) { console.warn('Supabase academy data exception:', error); return null; }
    }

    async function saveSupabaseAcademyData() {
        if (!supabaseClient) return { success: false, error: 'Supabase  ' };
        try {
            var record = { id: 'main', content: data, updated_at: new Date().toISOString() };
            var result = await supabaseClient.from('academy_data').upsert(record, { onConflict: 'id' });
            if (result.error) { console.warn('Supabase academy data save failed:', result.error.message || result.error); return { success: false,
                    error: result.error }; }
            localStorage.setItem('academyData', JSON.stringify(data));
            return { success: true };
        } catch (error) { console.warn('Supabase academy data save exception:', error); return { success: false,
                error: error }; }
    }

    // ============================================================
    //    
    // ============================================================
    function getAllTeachers() {
        var teachers = [];
        data.sections.forEach(function(section, sectionIndex) {
            section.teachers.forEach(function(teacher, teacherIndex) {
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
        var section = data.sections.find(function(s) { return s.id === sectionId; });
        if (!section) return [];
        return section.teachers.map(function(teacher, index) {
            return {
                ...teacher,
                _sectionIndex: data.sections.indexOf(section),
                _teacherIndex: index,
                _sectionName: section.name,
                _sectionId: section.id
            };
        });
    }

    function getFilteredTeachers() {
        if (currentFilter === 'all') {
            return getAllTeachers();
        }
        return getTeachersBySection(currentFilter);
    }

    // ============================================================
    //   
    // ============================================================
    function buildFilterButtons(container, countContainer) {
        if (!container) return;

        var html = '<button class="filter-btn active" data-section="all" onclick="setFilter(\'all\')">' +
            '<span class="btn-icon"></span> ' +
            '<span class="btn-count">' + getAllTeachers().length + '</span>' +
            '</button>';

        data.sections.forEach(function(section) {
            var teacherCount = section.teachers ? section.teachers.length : 0;
            var isActive = currentFilter === section.id;
            html += '<button class="filter-btn ' + (isActive ? 'active' : '') + '" data-section="' + section.id + '" onclick="setFilter(\'' + section.id + '\')">' +
                '<span class="btn-icon"></span> ' + section.name +
                '<span class="btn-count">' + teacherCount + '</span>' +
                '</button>';
        });

        container.innerHTML = html;

        if (countContainer) {
            var filtered = getFilteredTeachers();
            countContainer.textContent = filtered.length;
        }
    }

    // ============================================================
    //  
    // ============================================================
    window.setFilter = function(sectionId) {
        currentFilter = sectionId;
        renderAllData();
        document.querySelectorAll('.filter-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.section === sectionId);
        });
    };

    // ============================================================
    //  
    // ============================================================
    function renderTeachers(teachers, container) {
        if (!container) return;

        if (!teachers || teachers.length === 0) {
            container.innerHTML =
                '<div class="empty-teachers">' +
                '<span class="empty-icon"></span>' +
                '<h3>  </h3>' +
                '<p>' + (currentFilter === 'all' ? '     ' : '     ') + '</p>' +
                '</div>';
            return;
        }

        var html = '<div class="teachers-grid">';

        teachers.forEach(function(teacher) {
            var hasAccess = hasAccessToTeacher(teacher);
            var imageUrl = teacher.image || '';
            var emoji = teacher.emoji || '';
            var name = teacher.name || '';
            var subject = teacher.subject || '';
            var semestersCount = Array.isArray(teacher.semesters) ? teacher.semesters.length : 0;
            var sectionName = teacher._sectionName || '';

            html +=
                '<div class="teacher-card" onclick="openTeacher(' + teacher._sectionIndex + ', ' + teacher._teacherIndex + ')">' +
                '<div class="teacher-section-badge">' + sectionName + '</div>' +
                '<div class="teacher-card-image">' +
                (imageUrl ? '<img src="' + imageUrl + '" alt="' + name + '" onerror="this.style.display=\'none\'; this.parentElement.querySelector(\'.teacher-emoji\').style.display=\'block\';">' : '') +
                '<span class="teacher-emoji" style="' + (imageUrl ? 'display:none;' : 'display:block;') + '">' + emoji + '</span>' +
                '</div>' +
                '<div class="teacher-card-info">' +
                '<h3>' + name + '</h3>' +
                (subject ? '<div class="teacher-subject">' + subject + '</div>' : '') +
                '<div class="teacher-stats"> ' + semestersCount + ' </div>' +
                '</div>' +
                '<div class="teacher-card-overlay">' +
                '<i class="fas fa-chevron-left"></i>' +
                '<span></span>' +
                '</div>' +
                '</div>';
        });

        html += '</div>';
        container.innerHTML = html;
    }

    function renderAllData() {
        var filteredTeachers = getFilteredTeachers();

        if (teachersCount) teachersCount.textContent = filteredTeachers.length;
        if (teachersCount2) teachersCount2.textContent = filteredTeachers.length;

        renderTeachers(filteredTeachers, teachersGridContainer);
        renderTeachers(filteredTeachers, teachersGridContainer2);

        buildFilterButtons(sectionFilter, teachersCount);
        buildFilterButtons(sectionFilter2, teachersCount2);

        //   
        var totalTeachers = getAllTeachers().length;
        var totalTeachersEl = document.getElementById('totalTeachers');
        if (totalTeachersEl) totalTeachersEl.textContent = totalTeachers;

        var totalCourses = 0;
        var uniqueStudents = new Set();
        data.sections.forEach(function(section) {
            section.teachers.forEach(function(teacher) {
                totalCourses += teacher.semesters ? teacher.semesters.length : 0;
                if (teacher.codes) {
                    teacher.codes.forEach(function(c) {
                        if (c.used && c.userEmail) {
                            uniqueStudents.add(c.userEmail);
                        }
                    });
                }
            });
        });
        var totalCoursesEl = document.getElementById('totalCourses');
        if (totalCoursesEl) totalCoursesEl.textContent = totalCourses;
        var totalStudentsEl = document.getElementById('totalStudents');
        if (totalStudentsEl) totalStudentsEl.textContent = uniqueStudents.size;

        //    
        var adminTotalTeachers = document.getElementById('adminTotalTeachers');
        if (adminTotalTeachers) adminTotalTeachers.textContent = totalTeachers;
        var adminTotalSections = document.getElementById('adminTotalSections');
        if (adminTotalSections) adminTotalSections.textContent = data.sections.length;
        var totalLectures = 0;
        data.sections.forEach(function(section) {
            section.teachers.forEach(function(teacher) {
                if (teacher.semesters) {
                    teacher.semesters.forEach(function(semester) {
                        totalLectures += semester.lectures ? semester.lectures.length : 0;
                    });
                }
            });
        });
        var adminTotalLectures = document.getElementById('adminTotalLectures');
        if (adminTotalLectures) adminTotalLectures.textContent = totalLectures;
        var adminTotalStudents = document.getElementById('adminTotalStudents');
        if (adminTotalStudents) adminTotalStudents.textContent = uniqueStudents.size;
    }

    // ============================================================
    //  
    // ============================================================
    function extractVideoUrl(url) {
        if (!url) return '';

        if (url.includes('dyntube.com') || url.includes('videos.dyntube.com')) {
            var embedUrl = url;
            if (url.includes('/iframes/')) {
                var videoId = url.split('/iframes/')[1]?.split('?')[0] || '';
                if (videoId) embedUrl = 'https://dyntube.com/embed/' + videoId;
            } else if (url.includes('/video/')) {
                var videoId = url.split('/video/')[1]?.split('?')[0] || '';
                if (videoId) embedUrl = 'https://dyntube.com/embed/' + videoId;
            } else if (url.includes('/watch/')) {
                var videoId = url.split('/watch/')[1]?.split('?')[0] || '';
                if (videoId) embedUrl = 'https://dyntube.com/embed/' + videoId;
            } else if (!url.includes('/embed/')) {
                var videoId = url.split('/').pop()?.split('?')[0] || '';
                if (videoId && videoId.length > 5) embedUrl = 'https://dyntube.com/embed/' + videoId;
            }
            var separator = embedUrl.includes('?') ? '&' : '?';
            embedUrl = embedUrl + separator + 'autoplay=1&controls=1&loop=0&muted=0';
            return embedUrl;
        }

        if (url.includes('player.mediadelivery.net/play/') || url.includes('player.mediadelivery.net/embed/') || url
            .includes('mediadelivery.net')) {
            return url;
        }

        if (url.includes('<iframe')) {
            var match = url.match(/src=["']([^"']+)["']/);
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
            showToast('error', '    ');
            return;
        }

        var videoUrl = extractVideoUrl(url);

        if (isDynTubeUrl(videoUrl)) {
            if (!videoUrl.includes('/embed/')) {
                var videoId = videoUrl.split('/').pop()?.split('?')[0] || '';
                if (videoId && videoId.length > 5) {
                    videoUrl = 'https://dyntube.com/embed/' + videoId;
                }
            }
            var separator = videoUrl.includes('?') ? '&' : '?';
            videoUrl = videoUrl + separator + 'autoplay=1&controls=1&loop=0&muted=0';

            videoWrapper.innerHTML =
                '<iframe src="' + videoUrl + '" loading="lazy" style="border:0;position:absolute;top:0;left:0;height:100%;width:100%;" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>';

            videoPlayer.classList.add('active');
            document.body.style.overflow = 'hidden';
            showToast('info', ' : ' + (title || '') + ' (DynTube)');
            return;
        }

        if (videoUrl.includes('mediadelivery')) {
            if (!videoUrl.includes('autoplay')) {
                var separator = videoUrl.includes('?') ? '&' : '?';
                videoUrl = videoUrl + separator + 'autoplay=true&loop=false&muted=false&preload=true&responsive=true&controls=true';
            }
            videoUrl = videoUrl.replace(/&?muted=true/g, '');
            videoUrl = videoUrl.replace(/&?muted=false/g, '');

            videoWrapper.innerHTML =
                '<iframe src="' + videoUrl + '" loading="lazy" style="border:0;position:absolute;top:0;left:0;height:100%;width:100%;" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>';

            videoPlayer.classList.add('active');
            document.body.style.overflow = 'hidden';
            showToast('info', ' : ' + (title || ''));
            return;
        }

        var videoId = extractYouTubeId(videoUrl);
        if (videoId) {
            var embedUrl = getYouTubeEmbedUrl(videoId);
            videoWrapper.innerHTML =
                '<iframe src="' + embedUrl + '" style="border:0;position:absolute;top:0;left:0;height:100%;width:100%;" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;fullscreen" allowfullscreen></iframe>';

            videoPlayer.classList.add('active');
            document.body.style.overflow = 'hidden';
            showToast('info', ' : ' + (title || ''));
            return;
        }

        if (videoUrl.match(/\.(mp4|webm|ogg|m3u8)(\?.*)?$/i)) {
            videoWrapper.innerHTML =
                '<video controls autoplay style="position:absolute;top:0;left:0;height:100%;width:100%;background:#000;" controlslist="nodownload" playsinline><source src="' + videoUrl + '" type="video/mp4">    </video>';

            setTimeout(function() {
                var video = videoWrapper.querySelector('video');
                if (video) {
                    video.volume = 1.0;
                    video.muted = false;
                }
            }, 500);

            videoPlayer.classList.add('active');
            document.body.style.overflow = 'hidden';
            showToast('info', ' : ' + (title || ''));
            return;
        }

        showToast('error', '    .   mediadelivery  YouTube  DynTube');
    };

    function closeVideoPlayer() {
        if (videoWrapper) videoWrapper.innerHTML = '';
        if (videoPlayer) videoPlayer.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function extractYouTubeId(url) {
        if (!url) return null;
        var patterns = [
            /(?:youtube\.com\/watch\?v=)([^&]+)/,
            /(?:youtu\.be\/)([^?]+)/,
            /(?:youtube\.com\/embed\/)([^?]+)/
        ];
        for (var i = 0; i < patterns.length; i++) {
            var match = url.match(patterns[i]);
            if (match) return match[1];
        }
        return null;
    }

    function getYouTubeEmbedUrl(videoId) {
        return 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1';
    }

    // ============================================================
    //  
    // ============================================================
    window.openTeacher = function(sectionIndex, teacherIndex) {
        var section = data.sections[sectionIndex];
        if (!section) return;
        var teacher = section.teachers[teacherIndex];
        if (!teacher) return;

        activeTeacher = teacher;
        activeTeacherIndex = teacherIndex;
        activeSectionIndex = sectionIndex;

        var hasAccess = hasAccessToTeacher(teacher);
        modalTeacherTitle.textContent = ' ' + teacher.name + ' (' + section.name + ')';

        var semesters = Array.isArray(teacher.semesters) ? teacher.semesters : [];
        var html = '';

        semesters.forEach(function(semester, idx) {
            var lectures = Array.isArray(semester.lectures) ? semester.lectures : [];
            var hasFreeLecture = lectures.some(function(l) { return l.isFree === true; });
            var isLocked = !hasAccess && !hasFreeLecture;

            html +=
                '<div class="semester-item ' + (isLocked ? 'locked' : '') + '" onclick="' + (isLocked ? '' : 'openLectures(' + sectionIndex + ', ' + teacherIndex + ', ' + idx + ')') + '">' +
                '<div>' +
                '<div class="semester-number">  ' + semester.number + '</div>' +
                '<div class="semester-desc">' + (semester.description || '') + ' (' + semester.lectures.length + ' )</div>' +
                '</div>' +
                '<div class="semester-status">' +
                (isLocked ? ' ' : (hasAccess ? ' ' : ' ')) +
                '<i class="fas fa-chevron-left"></i>' +
                '</div>' +
                '</div>';
        });

        var isActivated = hasAccessToTeacher(teacher);
        html +=
            '<div class="codes-info">' +
            '<div class="access-status ' + (isActivated ? 'active' : 'inactive') + '">' +
            (isActivated ? '   -   ' : '    -   ') +
            '</div>' +
            (!isActivated ?
                '<div class="code-box-mini" style="margin-top:0.8rem;background:var(--bg);padding:0.8rem;border-radius:var(--radius-sm);">' +
                '<p style="font-size:0.85rem;margin-bottom:0.3rem;">      </p>' +
                '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;">' +
                '<input type="password" id="codeInputTeacher" placeholder=" ..." maxlength="20" style="flex:1;min-width:120px;padding:0.5rem 0.8rem;border:2px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text);font-size:0.9rem;outline:none;text-align:center;letter-spacing:2px;font-weight:700;font-family:monospace;" />' +
                '<button onclick="activateCodeFromTeacher()" style="padding:0.5rem 1.2rem;background:var(--primary-gradient);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;"></button>' +
                '</div>' +
                '<div id="codeMessageTeacher" style="margin-top:0.3rem;font-size:0.85rem;"></div>' +
                '</div>' : '') +
            '</div>';

        semestersList.innerHTML = html;
        semestersModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.activateCodeFromTeacher = async function() {
        var codeInput = document.getElementById('codeInputTeacher');
        var codeMessage = document.getElementById('codeMessageTeacher');
        var code = codeInput.value.trim().toUpperCase();

        if (!code) {
            codeMessage.innerHTML = '   ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        if (!activeTeacher) {
            codeMessage.innerHTML = '    ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        if (!currentUser) {
            codeMessage.innerHTML = '    ';
            codeMessage.style.color = '#ef4444';
            showToast('error', '    ');
            return;
        }

        var result = await verifyCode(activeTeacher, code);
        codeMessage.innerHTML = result.message;
        codeMessage.style.color = result.valid ? '#22c55e' : '#ef4444';

        if (result.valid) {
            showToast('success', '   !');
            renderAllData();
            renderMyCourses();
            renderAccount();
            updateBadge();
            updateUserCodesStorage();

            setTimeout(function() {
                if (activeSectionIndex !== null && activeTeacherIndex !== null) {
                    openTeacher(activeSectionIndex, activeTeacherIndex);
                }
            }, 1500);
        } else {
            showToast('error', ' ' + result.message);
        }
    };

    window.openLectures = function(sectionIndex, teacherIndex, semesterIndex) {
        var section = data.sections[sectionIndex];
        if (!section) return;
        var teacher = section.teachers[teacherIndex];
        if (!teacher) return;
        var semester = teacher.semesters[semesterIndex];
        if (!semester) return;

        var hasAccess = hasAccessToTeacher(teacher);
        modalSemesterTitle.textContent = '  ' + semester.number + ' - ' + teacher.name;

        var html = '';
        var lectures = Array.isArray(semester.lectures) ? semester.lectures : [];

        lectures.forEach(function(lecture) {
            var isFree = lecture.isFree === true;
            var canWatch = isFree || hasAccess;
            var videoUrl = lecture.youtubeUrl || '';
            var isMediaDelivery = videoUrl.includes('mediadelivery');
            var isDynTube = videoUrl.includes('dyntube.com') || videoUrl.includes('videos.dyntube.com');
            var videoIcon = isMediaDelivery ? 'fa-video' : (isDynTube ? 'fa-film' : 'fa-play-circle');

            html +=
                '<div class="lecture-item ' + (canWatch ? '' : 'locked') + '" onclick="' + (canWatch ? 'playVideo(\'' + videoUrl + '\', \'' + lecture.title + '\')' : '') + '">' +
                '<div class="lecture-number">#' + lecture.number + '</div>' +
                '<div class="lecture-title">' + lecture.title + '</div>' +
                '<div class="lecture-status">' +
                (isFree ? '<span class="free-badge"> </span>' : '') +
                (isMediaDelivery ? '<span style="font-size:0.6rem;color:var(--primary);margin-left:0.3rem;"></span>' : '') +
                (isDynTube ? '<span style="font-size:0.6rem;color:var(--secondary);margin-left:0.3rem;"></span>' : '') +
                (canWatch ? '<i class="fas ' + videoIcon + '" style="color:var(--primary);"></i>' : '<i class="fas fa-lock" style="color:#ef4444;"></i>') +
                '</div>' +
                '</div>';
        });

        lecturesList.innerHTML = html;
        lecturesModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // ============================================================
    // 
    // ============================================================
    function getMyCourses() {
        if (!currentUser) return [];
        var courses = [];

        data.sections.forEach(function(section) {
            section.teachers.forEach(function(teacher, teacherIndex) {
                if (teacher.codes) {
                    var hasAccess = teacher.codes.some(function(c) { return c.used && c.userEmail === currentUser.email && !c
                        .locked; });
                    if (hasAccess) {
                        var totalLectures = 0;
                        var completedLectures = 0;
                        if (teacher.semesters) {
                            teacher.semesters.forEach(function(semester) {
                                if (semester.lectures) {
                                    semester.lectures.forEach(function(lecture) {
                                        totalLectures++;
                                        if (lecture.isFree || hasAccess) {
                                            completedLectures++;
                                        }
                                    });
                                }
                            });
                        }
                        var progress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) :
                            0;

                        courses.push({
                            teacherName: teacher.name,
                            teacherEmoji: teacher.emoji || '',
                            teacherImage: teacher.image || '',
                            sectionName: section.name,
                            sectionIndex: data.sections.indexOf(section),
                            teacherIndex: teacherIndex,
                            codes: teacher.codes.filter(function(c) { return c.used && c.userEmail === currentUser
                                    .email; }),
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
        var container = document.getElementById('myCoursesContainer');
        var countSpan = document.getElementById('myCoursesCount');
        if (!container) return;

        var courses = getMyCourses();
        if (countSpan) countSpan.textContent = courses.length + ' ';

        if (courses.length === 0) {
            container.innerHTML =
                '<div class="empty-courses">' +
                '<span class="empty-icon"></span>' +
                '<h3>     </h3>' +
                '<p>      </p>' +
                '<button class="btn-primary" onclick="navigateTo(\'teachers\')">' +
                '<i class="fas fa-search"></i>  ' +
                '</button>' +
                '</div>';
            return;
        }

        var totalLectures = 0;
        var completedLectures = 0;
        courses.forEach(function(course) {
            totalLectures += course.totalLectures || 0;
            completedLectures += course.completedLectures || 0;
        });
        var overallProgress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

        var progressFill = document.getElementById('overallProgress');
        var progressPercentage = document.getElementById('progressPercentage');
        if (progressFill) progressFill.style.width = overallProgress + '%';
        if (progressPercentage) progressPercentage.textContent = overallProgress + '%';

        var html = '<div class="my-courses-grid">';
        courses.forEach(function(course) {
            var progress = course.progress || 0;
            html +=
                '<div class="course-card-mini" onclick="openTeacher(' + course.sectionIndex + ', ' + course.teacherIndex + ')">' +
                '<div class="course-avatar">' +
                (course.teacherImage ? '<img src="' + course.teacherImage + '" />' : course.teacherEmoji) +
                '</div>' +
                '<div class="course-name">' + course.teacherName + '</div>' +
                '<div class="course-meta">' + course.sectionName + ' | ' + course.codes.length + ' </div>' +
                '<div class="course-badge"> </div>' +
                '<div class="course-progress">' +
                '<div class="mini-bar">' +
                '<div class="mini-fill" style="width:' + progress + '%;"></div>' +
                '</div>' +
                '<span class="mini-label">' + progress + '% </span>' +
                '</div>' +
                '</div>';
        });
        html += '</div>';
        container.innerHTML = html;
    }

    // ============================================================
    //  
    // ============================================================
    function renderAccount() {
        if (!currentUser) {
            accountName.textContent = ' ';
            accountEmail.textContent = '  ';
            accountAvatar.textContent = '';
            accountRegistered.textContent = '--';
            accountCourses.textContent = '0';
            accountCodes.textContent = '0';
            accountProgress.textContent = '0%';
            accountLectures.textContent = '0';
            if (adminPanelBtn) adminPanelBtn.style.display = 'none';
            return;
        }

        var name = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '';
        accountName.textContent = name;
        accountEmail.textContent = currentUser.email;
        accountAvatar.textContent = name.charAt(0).toUpperCase();

        var registered = currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString('ar') : ' ';
        accountRegistered.textContent = ' : ' + registered;

        var courses = getMyCourses();
        accountCourses.textContent = courses.length;

        var codesCount = 0;
        var totalLectures = 0;
        var completedLectures = 0;
        data.sections.forEach(function(section) {
            section.teachers.forEach(function(teacher) {
                if (teacher.codes) {
                    codesCount += teacher.codes.filter(function(c) { return c.used && c.userEmail === currentUser
                            .email; }).length;
                }
                if (teacher.semesters) {
                    teacher.semesters.forEach(function(semester) {
                        if (semester.lectures) {
                            semester.lectures.forEach(function(lecture) {
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
        var progress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
        accountProgress.textContent = progress + '%';

        // =====       =====
        checkIsAdmin(currentUser.email).then(function(isAdmin) {
            if (adminPanelBtn) {
                adminPanelBtn.style.display = isAdmin ? 'flex' : 'none';
                if (isAdmin) {
                    console.log('   !   ');
                }
            }
        });
    }

    function updateBadge() {
        var courses = getMyCourses();
        if (courses.length > 0) {
            if (coursesBadge) { coursesBadge.style.display = 'inline';
                coursesBadge.textContent = courses.length; }
            if (coursesBadgeMobile) { coursesBadgeMobile.style.display = 'inline';
                coursesBadgeMobile.textContent = courses.length; }
        } else {
            if (coursesBadge) coursesBadge.style.display = 'none';
            if (coursesBadgeMobile) coursesBadgeMobile.style.display = 'none';
        }
    }

    // ============================================================
    //  
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
            if (deleteAccountModal) deleteAccountModal.classList.remove('active');
            renderMyCourses();
            renderAccount();
            updateBadge();
            renderAllData();
            showToast('success', '    ');
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 800);
        } catch (error) {
            console.warn('SignOut exception:', error);
            showToast('error', '     ');
        }
    }

    // ============================================================
    //  
    // ============================================================
    window.confirmDeleteAccount = async function() {
        var password = deletePasswordInput.value;

        if (!password) {
            deleteAccountMessage.innerHTML = '    ';
            deleteAccountMessage.style.color = '#f59e0b';
            return;
        }

        if (!supabaseClient) {
            deleteAccountMessage.innerHTML = '   ';
            deleteAccountMessage.style.color = '#ef4444';
            return;
        }

        try {
            var signInResult = await supabaseClient.auth.signInWithPassword({
                email: currentUser.email,
                password: password
            });

            if (signInResult.error) {
                deleteAccountMessage.innerHTML = '    ';
                deleteAccountMessage.style.color = '#ef4444';
                return;
            }

            var deleteUserResult = await supabaseClient
                .from('users')
                .delete()
                .eq('email', currentUser.email);

            if (deleteUserResult.error) {
                console.warn('      users:', deleteUserResult.error);
            }

            var deleteAdminResult = await supabaseClient
                .from('admins')
                .delete()
                .eq('email', currentUser.email);

            if (deleteAdminResult.error) {
                console.warn('      admins:', deleteAdminResult.error);
            }

            var userCodesResult = await supabaseClient
                .from('user_codes')
                .delete()
                .eq('user_id', currentUser.id);

            if (userCodesResult.error) {
                console.warn('    :', userCodesResult.error);
            }

            var teacherCodesResult = await supabaseClient
                .from('teacher_codes')
                .delete()
                .eq('user_id', currentUser.id);

            if (teacherCodesResult.error) {
                console.warn('     teacher_codes:', teacherCodesResult.error);
            }

            try {
                await supabaseClient.auth.admin.deleteUser(currentUser.id);
            } catch (authError) {
                console.warn('     Auth:', authError);
                await supabaseClient.auth.signOut();
            }

            localStorage.removeItem('devAcademicUser');
            localStorage.removeItem('academyData');
            localStorage.removeItem('userCodes_' + currentUser.email);
            localStorage.removeItem('deviceId');

            showToast('success', '    ');
            deleteAccountMessage.innerHTML = '      ...';
            deleteAccountMessage.style.color = '#22c55e';

            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Delete account error:', error);
            deleteAccountMessage.innerHTML = '  : ' + error.message;
            deleteAccountMessage.style.color = '#ef4444';
        }
    };

    // ============================================================
    //   
    // ============================================================
    function updateUI() {
        if (currentUser) {
            var name = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '';
            userNameDisplay.textContent = name;
            userAvatar.textContent = name.charAt(0).toUpperCase();
        } else {
            userNameDisplay.textContent = ' ';
            userAvatar.textContent = '';
        }
    }

    // ============================================================
    //   
    // ============================================================
    window.navigateTo = function(page) {
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        document.querySelectorAll('.page-content').forEach(function(p) { p.style.display = 'none'; });
        var targetPage = document.getElementById('page-' + page);
        if (targetPage) targetPage.style.display = 'block';

        document.querySelectorAll('.nav-links li').forEach(function(l) { l.classList.remove('active'); });
        var navLink = document.querySelector('.nav-links li a[onclick*="' + page + '"]');
        if (navLink) navLink.closest('li')?.classList.add('active');

        document.querySelectorAll('.bottom-nav .nav-item').forEach(function(item) {
            item.classList.toggle('active', item.dataset.page === page);
        });

        var hero = document.getElementById('hero');
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
    //  
    // ============================================================
    document.querySelectorAll('[data-page]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.dataset.page);
        });
    });

    document.querySelectorAll('.bottom-nav .nav-item').forEach(function(item) {
        item.addEventListener('click', function() {
            navigateTo(this.dataset.page);
        });
    });

    // ============================================================
    //   
    // ============================================================
    var userProfileBtn = document.getElementById('userProfileBtn');
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', function() {
            if (!currentUser) {
                window.location.href = 'index.html';
                return;
            }
            navigateTo('account');
        });
    }

    // ============================================================
    //   -  
    // ============================================================
    if (logoutAccountBtn) {
        logoutAccountBtn.addEventListener('click', signOut);
    }

    // ============================================================
    //   -  
    // ============================================================
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (!currentUser) {
                showToast('warning', '    ');
                return;
            }
            deleteAccountModal.classList.add('active');
            deletePasswordInput.value = '';
            deleteAccountMessage.innerHTML = '';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeDeleteModal) {
        closeDeleteModal.addEventListener('click', function() {
            deleteAccountModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            deletePasswordInput.value = '';
            deleteAccountMessage.innerHTML = '';
        });
    }

    if (deleteAccountModal) {
        deleteAccountModal.addEventListener('click', function(e) {
            if (e.target === this) {
                deleteAccountModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                deletePasswordInput.value = '';
                deleteAccountMessage.innerHTML = '';
            }
        });
    }

    // ============================================================
    //  
    // ============================================================
    if (adminPanelBtn) {
        adminPanelBtn.addEventListener('click', function() {
            if (!currentUser) {
                showToast('warning', '    ');
                return;
            }
            checkIsAdmin(currentUser.email).then(function(isAdmin) {
                if (isAdmin) {
                    openAdminPanel();
                } else {
                    showToast('error', '       ');
                }
            });
        });
    }

    if (adminClose) {
        adminClose.addEventListener('click', function() {
            closeAdminPanel();
        });
    }

    if (adminOverlay) {
        adminOverlay.addEventListener('click', function() {
            closeAdminPanel();
        });
    }

    // ============================================================
    //      ()
    // ============================================================
    function openAdminPanel() {
        var panel = document.getElementById('adminPanel');
        var overlay = document.getElementById('adminOverlay');
        if (panel) panel.classList.add('open');
        if (overlay) overlay.classList.add('show');

        if (typeof updateAllAdminSelects === 'function') updateAllAdminSelects();
        if (typeof updatePendingChanges === 'function') updatePendingChanges();
        if (typeof loadAdminsList === 'function') loadAdminsList();
        if (typeof renderUsersTable === 'function') renderUsersTable();
        if (typeof renderSectionsList === 'function') renderSectionsList();
        if (typeof renderTeachersListAdmin === 'function') renderTeachersListAdmin();
        if (typeof filterStudents === 'function') filterStudents();

        showAdminTab('dashboard');

        showToast('success', '     ');
    }

    function closeAdminPanel() {
        var panel = document.getElementById('adminPanel');
        var overlay = document.getElementById('adminOverlay');
        if (panel) panel.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    }

    // ============================================================
    //    ()
    // ============================================================
    function showAdminTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(function(tab) {
            tab.classList.remove('active');
        });

        var targetTab = document.getElementById('tab-' + tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        document.querySelectorAll('.admin-tabs .tab-btn').forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            }
        });
    }

    // ============================================================
    //   ()
    // ============================================================
    document.querySelectorAll('.admin-tabs .tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var tabId = this.dataset.tab;
            showAdminTab(tabId);

            if (tabId === 'codes' || tabId === 'manage-codes') {
                if (typeof updateAllAdminSelects === 'function') updateAllAdminSelects();
                if (typeof updateCodesManagement === 'function') updateCodesManagement();
            }
            if (tabId === 'sections') {
                if (typeof updateAllAdminSelects === 'function') updateAllAdminSelects();
                if (typeof renderSectionsList === 'function') renderSectionsList();
            }
            if (tabId === 'teachers') {
                if (typeof updateAllAdminSelects === 'function') updateAllAdminSelects();
                if (typeof renderTeachersListAdmin === 'function') renderTeachersListAdmin();
            }
            if (tabId === 'students') {
                if (typeof updateAllAdminSelects === 'function') updateAllAdminSelects();
                if (typeof filterStudents === 'function') filterStudents();
            }
            if (tabId === 'users') {
                if (typeof renderUsersTable === 'function') renderUsersTable();
            }
            if (tabId === 'admins') {
                if (typeof loadAdminsList === 'function') loadAdminsList();
            }
            if (tabId === 'settings') {
                var savedBanner = localStorage.getItem('bannerImage');
                if (savedBanner) {
                    var img = document.getElementById('bannerImage');
                    var placeholder = document.getElementById('bannerPlaceholder');
                    if (img) { img.src = savedBanner;
                        img.style.display = 'block'; }
                    if (placeholder) placeholder.style.display = 'none';
                    var urlInput = document.getElementById('bannerUrlInput');
                    if (urlInput) urlInput.value = savedBanner;
                }
                var darkModeToggle = document.getElementById('darkModeToggle');
                if (darkModeToggle) darkModeToggle.checked = isDarkMode;
            }
            if (tabId === 'dashboard') {
                if (typeof renderAllData === 'function') renderAllData();
            }
        });
    });

    // ============================================================
    //  
    // ============================================================
    function toggleTheme() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('devAcademicTheme', isDarkMode ? 'dark' : 'light');
        showToast('info', isDarkMode ? '    ' : '    ');

        var darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) darkModeToggle.checked = isDarkMode;
    }

    window.toggleTheme = toggleTheme;

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // ============================================================
    // 
    // ============================================================
    function applyFilters() {
        var term = searchInput.value.trim().toLowerCase();
        if (term === '') {
            renderAllData();
            return;
        }

        var allTeachers = getAllTeachers();
        var filtered = allTeachers.filter(function(t) {
            return t.name.toLowerCase().includes(term) ||
                (t.subject && t.subject.toLowerCase().includes(term)) ||
                (t.description && t.description.toLowerCase().includes(term)) ||
                (t._sectionName && t._sectionName.toLowerCase().includes(term));
        });

        renderTeachers(filtered, teachersGridContainer);
        renderTeachers(filtered, teachersGridContainer2);
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', applyFilters);
    }
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') applyFilters();
        });
    }

    // ============================================================
    //   
    // ============================================================
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (closeTeachersModal) {
        closeTeachersModal.addEventListener('click', function() { closeModal(teachersModal); });
    }
    if (closeSemestersModal) {
        closeSemestersModal.addEventListener('click', function() { closeModal(semestersModal); });
    }
    if (closeLecturesModal) {
        closeLecturesModal.addEventListener('click', function() { closeModal(lecturesModal); });
    }

    if (teachersModal) {
        teachersModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal(this);
        });
    }
    if (semestersModal) {
        semestersModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal(this);
        });
    }
    if (lecturesModal) {
        lecturesModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal(this);
        });
    }

    // ============================================================
    //  
    // ============================================================
    if (closePlayer) {
        closePlayer.addEventListener('click', closeVideoPlayer);
    }
    if (videoPlayer) {
        videoPlayer.addEventListener('click', function(e) {
            if (e.target === this) closeVideoPlayer();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (videoPlayer && videoPlayer.classList.contains('active')) closeVideoPlayer();
            if (teachersModal && teachersModal.classList.contains('active')) closeModal(teachersModal);
            if (semestersModal && semestersModal.classList.contains('active')) closeModal(semestersModal);
            if (lecturesModal && lecturesModal.classList.contains('active')) closeModal(lecturesModal);
            if (deleteAccountModal && deleteAccountModal.classList.contains('active')) {
                deleteAccountModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            if (adminPanel && adminPanel.classList.contains('open')) closeAdminPanel();
        }
    });

    // ============================================================
    //       
    // ============================================================

    function updateAllAdminSelects() {
        updateBasicSelects();
        updateTeacherSelects();
        updateSemesterSelects();
        updateCodeSelects();
        updateCodesManagement();
        updateEditTeacherData();
        updateStudentFilters();
    }

    function updateBasicSelects() {
        var selectIds = [
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

        selectIds.forEach(function(id) {
            var select = document.getElementById(id);
            if (!select) return;
            var currentValue = select.value;
            var options = '<option value="">...</option>';
            if (id === 'studentSectionFilter' || id === 'studentTeacherFilter') {
                options = '<option value="all"></option>';
                data.sections.forEach(function(s, i) {
                    options += '<option value="' + i + '">' + s.name + '</option>';
                });
            } else {
                data.sections.forEach(function(s, i) {
                    options += '<option value="' + i + '">' + s.name + '</option>';
                });
            }
            select.innerHTML = options;
            if (currentValue && data.sections[parseInt(currentValue)]) {
                select.value = currentValue;
            }
            if (currentValue === 'all' && (id === 'studentSectionFilter' || id === 'studentTeacherFilter')) {
                select.value = 'all';
            }
        });
    }

    function updateTeacherSelects() {
        var teacherSelects = [
            { selectId: 'lectureTeacher', sectionId: 'lectureSection' },
            { selectId: 'codeTeacherSelect', sectionId: 'codeSection' },
            { selectId: 'editTeacherSelect', sectionId: 'editTeacherSection' },
            { selectId: 'editLectureTeacher', sectionId: 'editLectureSection' },
            { selectId: 'deleteTeacherSelect', sectionId: 'deleteTeacherSection' },
            { selectId: 'deleteSemesterTeacher', sectionId: 'deleteSemesterSection' },
            { selectId: 'deleteLectureTeacher', sectionId: 'deleteLectureSection' }
        ];

        teacherSelects.forEach(function(item) {
            var select = document.getElementById(item.selectId);
            var sectionSelect = document.getElementById(item.sectionId);
            if (!select || !sectionSelect) return;

            var sectionIndex = parseInt(sectionSelect.value);
            var currentValue = select.value;
            var options = '<option value="">...</option>';

            if (!isNaN(sectionIndex) && sectionIndex >= 0 && data.sections[sectionIndex]) {
                data.sections[sectionIndex].teachers.forEach(function(t, i) {
                    options += '<option value="' + i + '">' + t.name + '</option>';
                });
            }

            select.innerHTML = options;
            if (currentValue && !isNaN(sectionIndex) && sectionIndex >= 0 &&
                data.sections[sectionIndex]?.teachers[parseInt(currentValue)]) {
                select.value = currentValue;
            }
        });
    }

    function updateSemesterSelects() {
        var semesterSelects = [
            { selectId: 'lectureSemester', teacherId: 'lectureTeacher', sectionId: 'lectureSection' },
            { selectId: 'deleteSemesterSelect', teacherId: 'deleteSemesterTeacher', sectionId: 'deleteSemesterSection' },
            { selectId: 'deleteLectureSemester', teacherId: 'deleteLectureTeacher', sectionId: 'deleteLectureSection' },
            { selectId: 'editLectureSemester', teacherId: 'editLectureTeacher', sectionId: 'editLectureSection' }
        ];

        semesterSelects.forEach(function(item) {
            var select = document.getElementById(item.selectId);
            var teacherSelect = document.getElementById(item.teacherId);
            var sectionSelect = document.getElementById(item.sectionId);
            if (!select || !teacherSelect || !sectionSelect) return;

            var sectionIndex = parseInt(sectionSelect.value);
            var teacherIndex = parseInt(teacherSelect.value);
            var currentValue = select.value;

            var options = '<option value="">...</option>';
            if (!isNaN(sectionIndex) && sectionIndex >= 0 &&
                !isNaN(teacherIndex) && teacherIndex >= 0 &&
                data.sections[sectionIndex]?.teachers[teacherIndex]) {
                var teacher = data.sections[sectionIndex].teachers[teacherIndex];
                if (teacher.semesters) {
                    teacher.semesters.forEach(function(s, i) {
                        options += '<option value="' + i + '"> ' + s.number + ' - ' + (s.description || '') +
                            '</option>';
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

        updateLectureSelects();
    }

    function updateLectureSelects() {
        var lectureSelects = [
            { selectId: 'editLectureSelect', semesterId: 'editLectureSemester', sectionId: 'editLectureSection',
                teacherId: 'editLectureTeacher' },
            { selectId: 'deleteLectureSelect', semesterId: 'deleteLectureSemester', sectionId: 'deleteLectureSection',
                teacherId: 'deleteLectureTeacher' }
        ];

        lectureSelects.forEach(function(item) {
            var select = document.getElementById(item.selectId);
            var semesterSelect = document.getElementById(item.semesterId);
            var sectionSelect = document.getElementById(item.sectionId);
            var teacherSelect = document.getElementById(item.teacherId);
            if (!select || !semesterSelect || !sectionSelect || !teacherSelect) return;

            var sectionIndex = parseInt(sectionSelect.value);
            var teacherIndex = parseInt(teacherSelect.value);
            var semesterIndex = parseInt(semesterSelect.value);
            var currentValue = select.value;

            var options = '<option value="">...</option>';
            if (!isNaN(sectionIndex) && sectionIndex >= 0 &&
                !isNaN(teacherIndex) && teacherIndex >= 0 &&
                !isNaN(semesterIndex) && semesterIndex >= 0 &&
                data.sections[sectionIndex]?.teachers[teacherIndex]?.semesters[semesterIndex]?.lectures) {
                var lectures = data.sections[sectionIndex].teachers[teacherIndex].semesters[semesterIndex].lectures;
                lectures.forEach(function(l, i) {
                    options += '<option value="' + i + '">#' + l.number + ' - ' + l.title + '</option>';
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

    function updateCodeSelects() {
        var sectionSelect = document.getElementById('codeSection');
        var teacherSelect = document.getElementById('codeTeacherSelect');
        if (!sectionSelect || !teacherSelect) return;

        var sectionIndex = parseInt(sectionSelect.value);
        var currentValue = teacherSelect.value;
        var options = '<option value="">...</option>';

        if (!isNaN(sectionIndex) && sectionIndex >= 0 && data.sections[sectionIndex]) {
            data.sections[sectionIndex].teachers.forEach(function(t, i) {
                options += '<option value="' + i + '">' + t.name + '</option>';
            });
        }

        teacherSelect.innerHTML = options;
        if (currentValue && !isNaN(sectionIndex) && sectionIndex >= 0 &&
            data.sections[sectionIndex]?.teachers[parseInt(currentValue)]) {
            teacherSelect.value = currentValue;
        }
    }

    function updateEditTeacherData() {
        var sectionSelect = document.getElementById('editTeacherSection');
        var teacherSelect = document.getElementById('editTeacherSelect');

        if (!sectionSelect || !teacherSelect) return;

        var sectionIndex = parseInt(sectionSelect.value);
        var teacherIndex = parseInt(teacherSelect.value);

        if (isNaN(sectionIndex) || sectionIndex < 0 || isNaN(teacherIndex) || teacherIndex < 0 ||
            !data.sections[sectionIndex]?.teachers[teacherIndex]) {
            var nameInput = document.getElementById('editTeacherName');
            var subjectInput = document.getElementById('editTeacherSubject');
            var descInput = document.getElementById('editTeacherDesc');
            var imageInput = document.getElementById('editTeacherImage');
            if (nameInput) nameInput.value = '';
            if (subjectInput) subjectInput.value = '';
            if (descInput) descInput.value = '';
            if (imageInput) imageInput.value = '';
            return;
        }

        var teacher = data.sections[sectionIndex].teachers[teacherIndex];
        var nameInput = document.getElementById('editTeacherName');
        var subjectInput = document.getElementById('editTeacherSubject');
        var descInput = document.getElementById('editTeacherDesc');
        var imageInput = document.getElementById('editTeacherImage');
        if (nameInput) nameInput.value = teacher.name || '';
        if (subjectInput) subjectInput.value = teacher.subject || '';
        if (descInput) descInput.value = teacher.description || '';
        if (imageInput) imageInput.value = teacher.image || '';
        var msg = document.getElementById('editTeacherMessage');
        if (msg) msg.innerHTML = '';
    }

    function updateStudentFilters() {
        var sectionFilter = document.getElementById('studentSectionFilter');
        var teacherFilter = document.getElementById('studentTeacherFilter');
        if (!sectionFilter || !teacherFilter) return;

        var sectionIndex = parseInt(sectionFilter.value);
        var currentTeacherValue = teacherFilter.value;

        var options = '<option value="all"> </option>';
        if (!isNaN(sectionIndex) && sectionIndex >= 0 && data.sections[sectionIndex]) {
            data.sections[sectionIndex].teachers.forEach(function(t, i) {
                options += '<option value="' + i + '">' + t.name + '</option>';
            });
        }

        teacherFilter.innerHTML = options;
        if (currentTeacherValue !== 'all' && !isNaN(sectionIndex) && sectionIndex >= 0 &&
            data.sections[sectionIndex]?.teachers[parseInt(currentTeacherValue)]) {
            teacherFilter.value = currentTeacherValue;
        }
    }

    function updatePendingChanges() {
        if (pendingChangesSpan) pendingChangesSpan.textContent = pendingChanges;
    }

    function addChange() {
        pendingChanges++;
        updatePendingChanges();
    }

    // ============================================================
    //      ()
    // ============================================================

    // =====   =====
    window.addSection = function() {
        var nameInput = document.getElementById('sectionName');
        var name = nameInput.value.trim();

        if (!name) {
            showToast('warning', '    ');
            return;
        }

        var newSection = {
            id: 'sec-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
            name: name,
            teachers: []
        };

        data.sections.push(newSection);
        saveData();
        renderAllData();
        updateAllAdminSelects();
        addChange();
        nameInput.value = '';
        showToast('success', '    "' + name + '" ');
        renderSectionsList();
    };

    // =====   =====
    window.addTeacher = function() {
        var sectionSelect = document.getElementById('teacherSection');
        var sectionIndex = parseInt(sectionSelect?.value);

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            showToast('warning', '   ');
            return;
        }

        var nameInput = document.getElementById('teacherName');
        var emojiInput = document.getElementById('teacherEmoji');
        var subjectInput = document.getElementById('teacherSubject');
        var imageInput = document.getElementById('teacherImage');

        var name = nameInput.value.trim();
        var emoji = emojiInput.value.trim() || '';
        var subject = subjectInput.value.trim();
        var image = imageInput.value.trim();

        if (!name) {
            showToast('warning', '    ');
            return;
        }

        var newTeacher = {
            name: name,
            emoji: emoji,
            subject: subject || '',
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
        nameInput.value = '';
        if (imageInput) imageInput.value = '';
        showToast('success', '    "' + name + '" ');
        renderTeachersListAdmin();
    };

    // =====   =====
    window.addLecture = function() {
        var sectionSelect = document.getElementById('lectureSection');
        var teacherSelect = document.getElementById('lectureTeacher');
        var semesterSelect = document.getElementById('lectureSemester');

        var sectionIndex = parseInt(sectionSelect?.value);
        var teacherIndex = parseInt(teacherSelect?.value);
        var semesterIndex = parseInt(semesterSelect?.value);
        var numberInput = document.getElementById('lectureNumber');
        var titleInput = document.getElementById('lectureTitle');
        var urlInput = document.getElementById('lectureUrl');
        var freeSelect = document.getElementById('lectureFree');

        var number = parseInt(numberInput.value);
        var title = titleInput.value.trim();
        var youtubeUrl = urlInput.value.trim();
        var isFree = freeSelect.value === 'true';

        if (isNaN(sectionIndex) || sectionIndex < 0 || isNaN(teacherIndex) || teacherIndex < 0 ||
            isNaN(semesterIndex) || semesterIndex < 0 || !number || !title || !youtubeUrl) {
            showToast('warning', '     ');
            return;
        }

        var isValidUrl = youtubeUrl.includes('mediadelivery') ||
            youtubeUrl.includes('youtube') ||
            youtubeUrl.includes('youtu.be') ||
            youtubeUrl.includes('player.') ||
            youtubeUrl.includes('dyntube.com') ||
            youtubeUrl.includes('videos.dyntube.com') ||
            youtubeUrl.includes('dyntube') ||
            youtubeUrl.match(/\.(mp4|webm|ogg|m3u8)(\?.*)?$/i);

        if (!isValidUrl) {
            showToast('warning', '    .   mediadelivery  YouTube  DynTube');
            return;
        }

        var teacher = data.sections[sectionIndex].teachers[teacherIndex];
        if (!teacher.semesters) teacher.semesters = [];
        if (!teacher.semesters[semesterIndex]) {
            teacher.semesters[semesterIndex] = { number: semesterIndex + 1, description: '', lectures: [] };
        }

        var newLecture = { number: number, title: title, youtubeUrl: youtubeUrl, isFree: isFree };
        teacher.semesters[semesterIndex].lectures.push(newLecture);
        saveData();
        renderAllData();
        updateAllAdminSelects();
        addChange();
        titleInput.value = '';
        urlInput.value = '';
        numberInput.value = '';
        showToast('success', '    "' + title + '" ');
    };

    // ============================================================
    //  
    // ============================================================
    window.addManualCode = function() {
        var sectionSelect = document.getElementById('codeSection');
        var teacherSelect = document.getElementById('codeTeacherSelect');
        var codeInput = document.getElementById('manualCodeInput');
        var codeMessage = document.getElementById('manualCodeMessage');

        var sectionIndex = parseInt(sectionSelect?.value);
        var teacherIndex = parseInt(teacherSelect?.value);
        var code = codeInput?.value.trim().toUpperCase();

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            codeMessage.innerHTML = '    ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        if (isNaN(teacherIndex) || teacherIndex < 0) {
            codeMessage.innerHTML = '    ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        if (!code) {
            codeMessage.innerHTML = '   ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        if (code.length < 4) {
            codeMessage.innerHTML = '   ';
            codeMessage.style.color = '#f59e0b';
            return;
        }

        var teacher = data.sections[sectionIndex].teachers[teacherIndex];
        if (!teacher) {
            codeMessage.innerHTML = '   ';
            codeMessage.style.color = '#ef4444';
            return;
        }

        if (!teacher.codes) teacher.codes = [];
        var exists = teacher.codes.some(function(c) { return c.code === code; });
        if (exists) {
            codeMessage.innerHTML = '    ';
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
        codeMessage.innerHTML = '   : ' + code;
        codeMessage.style.color = '#22c55e';
        showToast('success', '   : ' + code);
        updateAllAdminSelects();
    };

    window.generateCodes = function(count) {
        count = count || 5;
        var sectionSelect = document.getElementById('codeSection');
        var teacherSelect = document.getElementById('codeTeacherSelect');
        var sectionIndex = parseInt(sectionSelect?.value);
        var teacherIndex = parseInt(teacherSelect?.value);

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            showToast('warning', '    ');
            return;
        }

        if (isNaN(teacherIndex) || teacherIndex < 0) {
            showToast('warning', '    ');
            return;
        }

        var teacher = data.sections[sectionIndex].teachers[teacherIndex];
        if (!teacher) { showToast('error', '   '); return; }

        if (!teacher.codes) teacher.codes = [];
        var newCodes = [];

        for (var i = 0; i < count; i++) {
            var prefix = teacher.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            var random = '';
            for (var j = 0; j < 8; j++) {
                random += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            var newCode = prefix + '-' + random;
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
        showToast('success', '   ' + newCodes.length + '  ');
        updateAllAdminSelects();
    };

    function updateCodesManagement() {
        var sectionSelect = document.getElementById('codeSection');
        var teacherSelect = document.getElementById('codeTeacherSelect');
        var container = document.getElementById('codesListContainer');

        var sectionIndex = parseInt(sectionSelect?.value);
        var teacherIndex = parseInt(teacherSelect?.value);

        if (isNaN(sectionIndex) || sectionIndex < 0) {
            container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:1rem 0;">  </p>';
            return;
        }

        if (isNaN(teacherIndex) || teacherIndex < 0) {
            container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:1rem 0;">  </p>';
            return;
        }

        var teacher = data.sections[sectionIndex]?.teachers[teacherIndex];
        if (!teacher) {
            container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:1rem 0;">  </p>';
            return;
        }

        var status = getCodesStatus(teacher);
        var html =
            '<div class="codes-stats">' +
            '<span> : ' + status.total + '</span>' +
            '<span> : ' + status.used + '</span>' +
            '<span> : ' + status.available + '</span>' +
            '<span> : ' + status.locked + '</span>' +
            '</div>' +
            '<div class="codes-table-wrapper">' +
            '<table class="codes-table">' +
            '<thead><tr><th>#</th><th></th><th></th><th> </th><th></th></tr></thead>' +
            '<tbody>';

        if (teacher.codes && teacher.codes.length > 0) {
            teacher.codes.forEach(function(c, index) {
                var isUsed = c.used;
                var isLocked = c.locked || false;
                var isMyCode = c.userEmail === currentUser?.email;
                var statusText = '',
                    statusColor = '#22c55e',
                    usedAtDisplay = '';

                if (isLocked) { statusText = ' ';
                    statusColor = '#f59e0b'; } else if (isUsed) {
                    statusText = isMyCode ? ' ' : ' ';
       