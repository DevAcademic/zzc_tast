// ============================================================
//                      الكود مشفر بالكامل
// ============================================================

var _0x1a2b = ['\x73\x74\x75\x64\x65\x6e\x74\x73', '\x75\x73\x65\x72\x73', '\x61\x74\x74\x65\x6e\x64\x61\x6e\x63\x65', '\x69\x64', '\x6e\x61\x6d\x65', '\x70\x68\x6f\x6e\x65', '\x67\x72\x61\x64\x65', '\x69\x73\x5f\x74\x65\x61\x63\x68\x65\x72', '\x63\x72\x65\x61\x74\x65\x64\x5f\x61\x74', '\x73\x74\x75\x64\x65\x6e\x74\x5f\x69\x64', '\x73\x74\x75\x64\x65\x6e\x74\x5f\x6e\x61\x6d\x65', '\x74\x65\x61\x63\x68\x65\x72\x5f\x69\x64', '\x74\x65\x61\x63\x68\x65\x72\x5f\x6e\x61\x6d\x65', '\x7a\x7a\x6e\x6e\x35\x35\x30\x30\x31\x31\x41\x6e\x40'];

// فك تشفير المفاتيح
function _0xdecrypt(_0xdata) {
    return atob(_0xdata);
}

// المفاتيح مشفرة
var _0xconfig = {
    url: _0xdecrypt('aHR0cHM6Ly9oZHRybmZwd3Z5dmFlemlhaXdlY2suc3VwYWJhc2UuY28='),
    key: _0xdecrypt('c2JfcHVibGlzaGFibGVfWFlpVWZpemRlOC1aMHlCanZaTnNCd3FfTFNYSzdW')
};

var _0xteacherCode = _0xdecrypt('enpubjU1MDAxMUFuQA==');

// إنشاء اتصال Supabase
var _0xdb = window.supabase.createClient(_0xconfig.url, _0xconfig.key);

// إخفاء المتغيرات
Object.defineProperty(window, '_0xdb', { get: function() { return null; }, set: function() {} });
Object.defineProperty(window, '_0xteacherCode', { get: function() { return null; }, set: function() {} });

// ============================================================
//                      دوال مساعدة مشفرة
// ============================================================

function _0xgen() {
    return Date['now']()['toString'](36) + Math['random']()['toString'](36)['substring'](2, 8);
}

function _0xisAr(_0xname) {
    return /^[\u0600-\u06FF\s]+$/['test'](_0xname) && _0xname['trim']()['split'](/\s+/)['length'] >= 2;
}

function _0xisPh(_0xphone) {
    return /^\d{10}$/['test'](_0xphone);
}

function _0xmsg(_0xel, _0xtext, _0xtype) {
    var _0xe = document['getElementById'](_0xel);
    if (_0xe) { _0xe['textContent'] = _0xtext; _0xe['className'] = 'message ' + (_0xtype || 'success'); }
}

function _0xclear(_0xel) {
    var _0xe = document['getElementById'](_0xel);
    if (_0xe) { _0xe['textContent'] = ''; _0xe['className'] = 'message'; }
}

function _0xshow(_0xscreen) {
    document['querySelectorAll']('.screen')['forEach'](function(s) { s['classList']['remove']('active'); });
    var _0xs = document['getElementById'](_0xscreen);
    if (_0xs) _0xs['classList']['add']('active');
}

// ============================================================
//                      تسجيل الدخول
// ============================================================

window['loginUser'] = async function() {
    var _0xph = document['getElementById']('loginPhone');
    if (!_0xph) return;
    var _0xp = _0xph['value']['trim']();
    if (!_0xisPh(_0xp)) { _0xmsg('loginMessage', '\u26a0\ufe0f 10 \u0623\u0631\u0642\u0627\u0645', 'error'); return; }
    try {
        var _0xr = await _0xdb['from']('users')['select']('*')['eq']('phone', _0xp);
        if (_0xr['error'] || !_0xr['data'] || _0xr['data']['length'] === 0) {
            _0xmsg('loginMessage', '\u274c \u063a\u064a\u0631 \u0645\u0633\u062c\u0644', 'error');
            return;
        }
        var _0xu = _0xr['data'][0];
        localStorage['setItem']('currentUser', JSON['stringify'](_0xu));
        _0xmsg('loginMessage', '\u2705 \u0646\u062c\u0627\u062d', 'success');
        setTimeout(function() {
            _0xu['is_teacher'] ? window['showTeacherDashboard']() : window['showStudentDashboard']();
        }, 800);
    } catch (_0xe) { _0xmsg('loginMessage', '\u274c \u062e\u0637\u0623', 'error'); }
};

// ============================================================
//                      تسجيل جديد
// ============================================================

window['registerUser'] = async function() {
    var _0xn = document['getElementById']('regName')['value']['trim']();
    var _0xp = document['getElementById']('regPhone')['value']['trim']();
    var _0xg = document['getElementById']('regGrade')['value'];
    var _0xps = document['getElementById']('regPassword')['value']['trim']();
    if (!_0xisAr(_0xn)) { _0xmsg('registerMessage', '\u26a0\ufe0f \u0627\u0633\u0645 \u0639\u0631\u0628\u064a', 'error'); return; }
    if (!_0xisPh(_0xp)) { _0xmsg('registerMessage', '\u26a0\ufe0f 10 \u0623\u0631\u0642\u0627\u0645', 'error'); return; }
    if (!_0xg) { _0xmsg('registerMessage', '\u26a0\ufe0f \u0627\u062e\u062a\u0631 \u0627\u0644\u0635\u0641', 'error'); return; }
    try {
        var _0xex = await _0xdb['from']('users')['select']('phone')['eq']('phone', _0xp);
        if (_0xex['data'] && _0xex['data']['length'] > 0) {
            _0xmsg('registerMessage', '\u26a0\ufe0f \u0645\u0633\u062c\u0644', 'error');
            return;
        }
        var _0xisT = (_0xps === _0xteacherCode);
        var _0xnu = { id: _0xgen(), name: _0xn, phone: _0xp, grade: _0xg, is_teacher: _0xisT, created_at: new Date()['toISOString']() };
        var _0xins = await _0xdb['from']('users')['insert']([_0xnu])['select']();
        if (_0xins['error']) { _0xmsg('registerMessage', '\u274c \u062e\u0637\u0623', 'error'); return; }
        var _0xsv = _0xins['data'][0];
        localStorage['setItem']('currentUser', JSON['stringify'](_0xsv));
        _0xmsg('registerMessage', _0xisT ? '\u2705 \u0645\u062f\u0631\u0633' : '\u2705 \u0646\u062c\u0627\u062d', 'success');
        setTimeout(function() { _0xisT ? window['showTeacherDashboard']() : window['showStudentDashboard'](); }, 1000);
    } catch (_0xe) { _0xmsg('registerMessage', '\u274c \u062e\u0637\u0623', 'error'); }
};

// ============================================================
//                      لوحة الطالب
// ============================================================

window['showStudentDashboard'] = async function() {
    var _0xu = JSON['parse'](localStorage['getItem']('currentUser'));
    if (!_0xu) { window['goToLogin'](); return; }
    var _0xn = document['getElementById']('studentNameDisplay');
    var _0xg = document['getElementById']('studentGradeDisplay');
    if (_0xn) _0xn['textContent'] = _0xu['name'];
    if (_0xg) _0xg['textContent'] = _0xu['grade'];
    try {
        var _0xa = await _0xdb['from']('attendance')['select']('id')['eq']('student_id', _0xu['id']);
        if (!_0xa['error']) { var _0xc = document['getElementById']('studentAbsences'); if (_0xc) _0xc['textContent'] = _0xa['data']['length']; }
    } catch (_0xe) {}
    var _0xqr = document['getElementById']('qrcode');
    if (_0xqr) {
        _0xqr['innerHTML'] = '';
        new QRCode(_0xqr, { text: _0xu['id'], width: 180, height: 180, colorDark: '#2C3E50', colorLight: '#FFFFFF', correctLevel: QRCode['CorrectLevel']['H'] });
    }
    _0xshow('studentDashboardScreen');
};

// ============================================================
//                      لوحة المدرس
// ============================================================

window['showTeacherDashboard'] = function() {
    var _0xu = JSON['parse'](localStorage['getItem']('currentUser'));
    if (!_0xu) { window['goToLogin'](); return; }
    var _0xn = document['getElementById']('teacherNameDisplay');
    if (_0xn) _0xn['textContent'] = _0xu['name'];
    _0xshow('teacherDashboardScreen');
    _0xclear('teacherMessage');
};

// ============================================================
//                      تسجيل الخروج
// ============================================================

window['logout'] = function() {
    window['stopQRScanner']();
    localStorage['removeItem']('currentUser');
    var _0xp = document['getElementById']('loginPhone');
    if (_0xp) _0xp['value'] = '';
    window['goToLogin']();
};

// ============================================================
//                      مسح QR
// ============================================================

var _0xqr = null;
var _0xactive = false;

window['startQRScanner'] = function() {
    var _0xc = document['getElementById']('scannerContainer');
    if (_0xc) _0xc['style']['display'] = 'block';
    _0xclear('teacherMessage');
    if (_0xactive) return;
    var _0xr = document['getElementById']('qr-reader');
    if (!_0xr) return;
    _0xr['innerHTML'] = '';
    _0xqr = new Html5Qrcode("qr-reader");
    _0xqr['start']({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } },
        async function(_0xd) {
            var _0xu = JSON['parse'](localStorage['getItem']('currentUser'));
            if (!_0xu) return;
            try {
                var _0xs = await _0xdb['from']('users')['select']('*')['eq']('id', _0xd)['eq']('is_teacher', false)['single']();
                if (_0xs['error'] || !_0xs['data']) {
                    _0xmsg('teacherMessage', '\u274c \u063a\u064a\u0631 \u0645\u0633\u062c\u0644', 'error');
                    window['stopQRScanner']();
                    return;
                }
                var _0xt = new Date()['toISOString']()['split']('T')[0];
                var _0xex = await _0xdb['from']('attendance')['select']('id')['eq']('student_id', _0xs['data']['id'])['gte']('created_at', _0xt);
                if (_0xex['data'] && _0xex['data']['length'] > 0) {
                    _0xmsg('teacherMessage', '\u2705 ' + _0xs['data']['name'] + ' \u062d\u0636\u0648\u0631', 'success');
                    window['stopQRScanner']();
                    return;
                }
                var _0xrec = { id: _0xgen(), student_id: _0xs['data']['id'], student_name: _0xs['data']['name'], grade: _0xs['data']['grade'], teacher_id: _0xu['id'], teacher_name: _0xu['name'], created_at: new Date()['toISOString']() };
                var _0xins = await _0xdb['from']('attendance')['insert']([_0xrec]);
                if (_0xins['error']) { _0xmsg('teacherMessage', '\u274c \u062e\u0637\u0623', 'error'); return; }
                _0xmsg('teacherMessage', '\u2705 ' + _0xs['data']['name'], 'success');
                window['stopQRScanner']();
            } catch (_0xe) { _0xmsg('teacherMessage', '\u274c \u062e\u0637\u0623', 'error'); }
        },
        function(_0xe) {}
    );
    _0xactive = true;
};

window['stopQRScanner'] = function() {
    if (_0xqr && _0xactive) {
        _0xqr['stop']()['then'](function() {
            _0xqr['clear']();
            _0xactive = false;
            var _0xc = document['getElementById']('scannerContainer');
            if (_0xc) _0xc['style']['display'] = 'none';
        })['catch'](function() {});
    }
};

// ============================================================
//                      إدارة الغيابات
// ============================================================

window['showAttendanceManagement'] = function() {
    _0xshow('attendanceManagementScreen');
    var _0xl = document['getElementById']('attendanceList');
    if (_0xl) _0xl['innerHTML'] = '';
    var _0xg = document['getElementById']('attendanceGrade');
    if (_0xg) _0xg['value'] = '';
};

window['loadAttendanceList'] = async function() {
    var _0xg = document['getElementById']('attendanceGrade');
    if (!_0xg) return;
    var _0g = _0xg['value'];
    var _0c = document['getElementById']('attendanceList');
    if (!_0c) return;
    if (!_0g) { _0c['innerHTML'] = ''; return; }
    try {
        var _0s = await _0xdb['from']('users')['select']('*')['eq']('grade', _0g)['eq']('is_teacher', false);
        if (_0s['error'] || !_0s['data'] || _0s['data']['length'] === 0) {
            _0c['innerHTML'] = '<p style="text-align:center;color:#95A5A6;padding:20px;">\u0644\u0627 \u064a\u0648\u062c\u062f \u0637\u0644\u0627\u0628</p>';
            return;
        }
        var _0a = await _0xdb['from']('attendance')['select']('student_id');
        var _0cnt = {};
        if (_0a['data']) { _0a['data']['forEach'](function(a) { _0cnt[a['student_id']] = (_0cnt[a['student_id']] || 0) + 1; }); }
        _0c['innerHTML'] = _0s['data']['map'](function(s) {
            var _0c2 = _0cnt[s['id']] || 0;
            return '<div class="student-row" onclick="window.showStudentAbsenceDetails(\'' + s['id'] + '\')"><span class="name">' + s['name'] + '</span><span class="absences-badge">' + _0c2 + ' \u063a\u064a\u0627\u0628</span></div>';
        })['join']('');
    } catch (_0e) { _0c['innerHTML'] = '<p style="text-align:center;color:red;padding:20px;">\u062e\u0637\u0623</p>'; }
};

// ============================================================
//                      تفاصيل غيابات الطالب
// ============================================================

window['showStudentAbsenceDetails'] = async function(_0sid) {
    try {
        var _0s = await _0xdb['from']('users')['select']('name')['eq']('id', _0sid)['single']();
        if (!_0s['data']) return;
        var _0n = document['getElementById']('absenceStudentName');
        if (_0n) _0n['textContent'] = _0s['data']['name'];
        var _0a = await _0xdb['from']('attendance')['select']('*')['eq']('student_id', _0sid)['order']('created_at', { ascending: false });
        var _0c = document['getElementById']('absenceDetailsList');
        if (!_0c) return;
        if (!_0a['data'] || _0a['data']['length'] === 0) {
            _0c['innerHTML'] = '<p style="text-align:center;color:#95A5A6;padding:20px;">\u0644\u0627 \u0648\u062c\u0648\u062f \ud83c\udf89</p>';
        } else {
            _0c['innerHTML'] = _0a['data']['map'](function(a) {
                var _0d = new Date(a['created_at']);
                return '<div class="absence-date-item"><div class="date">\ud83d\udcc5 ' + _0d['getDate']() + '/' + (_0d['getMonth']() + 1) + '/' + _0d['getFullYear']() + '</div><div class="time">\u23f0 ' + _0d['toLocaleTimeString']('ar-EG') + '</div></div>';
            })['join']('');
        }
        _0xshow('studentAbsenceDetailsScreen');
    } catch (_0e) {}
};

// ============================================================
//                      غيابات الطالب
// ============================================================

window['showStudentAbsences'] = async function() {
    var _0xu = JSON['parse'](localStorage['getItem']('currentUser'));
    if (!_0xu) return;
    try {
        var _0a = await _0xdb['from']('attendance')['select']('*')['eq']('student_id', _0xu['id'])['order']('created_at', { ascending: false });
        var _0c = document['getElementById']('studentAbsencesList');
        if (!_0c) return;
        if (!_0a['data'] || _0a['data']['length'] === 0) {
            _0c['innerHTML'] = '<div style="text-align:center;padding:40px 20px;color:#95A5A6;"><div style="font-size:3rem;margin-bottom:10px;">\ud83c\udf89</div><p>\u0644\u0627 \u0648\u062c\u0648\u062f</p><p style="font-size:0.85rem;">\u0645\u0645\u062a\u0627\u0632!</p></div>';
        } else {
            _0c['innerHTML'] = _0a['data']['map'](function(a) {
                var _0d = new Date(a['created_at']);
                return '<div class="absence-date-item"><div class="date">\ud83d\udcc5 ' + _0d['getDate']() + '/' + (_0d['getMonth']() + 1) + '/' + _0d['getFullYear']() + '</div><div class="time">\u23f0 ' + _0d['toLocaleTimeString']('ar-EG') + '</div></div>';
            })['join']('');
        }
        _0xshow('studentAbsencesScreen');
    } catch (_0e) {}
};

// ============================================================
//                      دوال العودة
// ============================================================

window['goToLogin'] = function() {
    _0xshow('loginScreen');
    _0xclear('loginMessage');
    var _0xp = document['getElementById']('loginPhone');
    if (_0xp) _0xp['value'] = '';
};

window['showRegister'] = function() {
    _0xshow('registerScreen');
    _0xclear('registerMessage');
    ['regName', 'regPhone', 'regGrade', 'regPassword']['forEach'](function(id) {
        var _0xe = document['getElementById'](id);
        if (_0xe) _0xe['value'] = '';
    });
};

window['goBackToAttendance'] = function() {
    window['showAttendanceManagement']();
    window['loadAttendanceList']();
};

window['goBackToStudent'] = function() {
    window['showStudentDashboard']();
};

window['goBackToTeacher'] = function() {
    window['showTeacherDashboard']();
};

// ============================================================
//                      بدء التطبيق
// ============================================================

window['goToLogin']();
console.log('\ud83d\udfec \u0645\u062d\u0645\u064a');