const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const USERS_FILE = path.join(__dirname, 'users.json');

app.use(express.json());
// تشغيل الملفات الثابتة من مجلد public تلقائياً
app.use(express.static(path.join(__dirname, 'public')));

// دالة مساعدة لقراءة البيانات من ملف الـ JSON
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
};

// دالة مساعدة لحفظ حساب جديد
const saveUser = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// مسار تسجيل حساب جديد (للتجربة)
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'البيانات غير مكتملة.' });
    }

    const users = readUsers();
    const userExists = users.find(u => u.email === email);

    if (userExists) {
        return res.status(400).json({ message: 'هذا الحساب مسجل بالفعل!' });
    }

    users.push({ email, password });
    saveUser(users);
    res.status(201).json({ message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' });
});

// مسار تسجيل الدخول والتحقق
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        return res.status(200).json({ message: 'تم تسجيل الدخول بنجاح!' });
    } else {
        return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
    }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`الموقع يعمل الآن بنجاح.`);
});
