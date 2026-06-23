// --- پارتیکلز ---
(function createParticles() {
    const container = document.getElementById('particles');
    const count = 25;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = (80 + Math.random() * 30) + '%';
        p.style.width = (2 + Math.random() * 3) + 'px';
        p.style.height = p.style.width;
        p.style.animationDuration = (8 + Math.random() * 14) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(p);
    }
})();

const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const togglePass = document.getElementById('togglePass');
const eyeIcon = document.getElementById('eyeIcon');
const form = document.getElementById('registerForm');
const submitBtn = document.getElementById('submitBtn');
const strengthLabel = document.getElementById('strengthLabel');
const segments = [
    document.getElementById('seg1'),
    document.getElementById('seg2'),
    document.getElementById('seg3'),
    document.getElementById('seg4')
];

// --- بخش مربوط به اعتبارسنجی ایمیل ---
function validateEmail(value) {
    const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!value.trim()) return { valid: false, msg: 'ایمیل الزامی است' };
    if (!regex.test(value)) return { valid: false, msg: 'فرمت ایمیل نامعتبر است (مثلاً name@domain.com)' };
    return { valid: true, msg: '' };
}

// --- چیز رمز عبور strenght ---
function getPasswordStrength(value) {
    if (!value) return { level: 0, label: '', cls: '' };

    let score = 0;
    const len = value.length;

    // طول
    if (len >= 6) score++;
    if (len >= 8) score++;
    if (len >= 10) score++;

    // تنوع کاراکترها
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^a-zA-Z0-9]/.test(value)) score++;

    // نرمال‌سازی به ۴ سطح
    if (score <= 2) return { level: 1, label: 'ضعیف', cls: 'weak' };
    if (score <= 4) return { level: 2, label: 'متوسط', cls: 'strong' };
    if (score <= 5) return { level: 3, label: 'قوی', cls: 'strong' };
    return { level: 4, label: 'عالی', cls: 'perfect' };
}

function validatePassword(value) {
    if (!value) return { valid: false, msg: 'رمز عبور الزامی است' };
    if (value.length < 6) return { valid: false, msg: 'رمز عبور باید حداقل ۶ کاراکتر باشد' };
    return { valid: true, msg: '' };
}

// --- نمایش خطا ---
function showError(id, msg) {
    const el = document.getElementById(id);
    el.querySelector('span').textContent = msg;
    el.classList.add('visible');
}

function hideError(id) {
    document.getElementById(id).classList.remove('visible');
}

// --- به‌روزرسانی نوار قدرت ---
function updateStrengthBar(strength) {
    strengthLabel.textContent = strength.label;
    strengthLabel.className = 'strength-label ' + strength.cls;

    segments.forEach((seg, i) => {
        seg.classList.remove('active', 'weak', 'strong', 'perfect');
        if (i < strength.level) {
            seg.classList.add('active', strength.cls);
        }
    });
}

function resetStrengthBar() {
    strengthLabel.textContent = '';
    strengthLabel.className = 'strength-label';
    segments.forEach(seg => {
        seg.classList.remove('active', 'weak', 'strong', 'perfect');
    });
}

emailInput.addEventListener('input', function() {
    const val = this.value;
    if (!val.trim()) {
        this.classList.remove('valid', 'invalid');
        hideError('emailError');
        return;
    }
    const result = validateEmail(val);
    if (result.valid) {
        this.classList.add('valid');
        this.classList.remove('invalid');
        hideError('emailError');
    } else {
        this.classList.add('invalid');
        this.classList.remove('valid');
        showError('emailError', result.msg);
    }
});

passInput.addEventListener('input', function() {
    const val = this.value;
    if (!val) {
        this.classList.remove('valid', 'invalid');
        hideError('passError');
        resetStrengthBar();
        return;
    }
    const strength = getPasswordStrength(val);
    updateStrengthBar(strength);

    const result = validatePassword(val);
    if (result.valid) {
        this.classList.add('valid');
        this.classList.remove('invalid');
        hideError('passError');
    } else {
        this.classList.add('invalid');
        this.classList.remove('valid');
        showError('passError', result.msg);
    }
});

// --- نمایش/مخفی رمز ---
let passVisible = false;
togglePass.addEventListener('click', function() {
    passVisible = !passVisible;
    passInput.type = passVisible ? 'text' : 'password';
    eyeIcon.innerHTML = passVisible
        ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
        : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
});

function showToast(msg, isError) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.textContent = msg;
    toast.classList.toggle('error-toast', !!isError);
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// --- سابمیت ---
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let hasError = false;

    // اعتبارسنجی ایمیل
    const emailResult = validateEmail(emailInput.value);
    if (!emailResult.valid) {
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
        showError('emailError', emailResult.msg);
        hasError = true;
    }

    // اعتبارسنجی رمز
    const passResult = validatePassword(passInput.value);
    if (!passResult.valid) {
        passInput.classList.add('invalid');
        passInput.classList.remove('valid');
        showError('passError', passResult.msg);
        hasError = true;
    }

    // اعتبارسنجی جنسیت
    const genderSelected = document.querySelector('input[name="gender"]:checked');
    if (!genderSelected) {
        showError('genderError', 'لطفاً جنسیت خود را انتخاب کنید');
        hasError = true;
    } else {
        hideError('genderError');
    }

    if (hasError) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        showToast('حساب کاربری با موفقیت ایجاد شد!', false);

        // ریست فرم
        form.reset();
        emailInput.classList.remove('valid', 'invalid');
        passInput.classList.remove('valid', 'invalid');
        resetStrengthBar();
        hideError('emailError');
        hideError('passError');
        hideError('genderError');
    }, 1800);
});

// --- پاک کردن خطای جنسیت هنگام انتخاب ---
document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', () => hideError('genderError'));
});
