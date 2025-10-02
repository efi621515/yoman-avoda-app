// שרת מקומי לבדיקת PWA
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// הגשת קבצים סטטיים
app.use(express.static('.'));

// Route עבור Service Worker
app.get('/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'sw.js'));
});

// Route עבור Manifest
app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, 'manifest.json'));
});

// Route עבור אייקונים
app.get('/assets/icon-:size.png', (req, res) => {
    const size = req.params.size;
    res.sendFile(path.join(__dirname, `assets/icon-${size}.png`));
});

// Route ראשי
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`🚀 שרת PWA פועל על http://localhost:${PORT}`);
    console.log(`📱 פתח את הדפדפן וגש לכתובת זו כדי לבדוק את ה-PWA`);
    console.log(`🔧 לבדיקת PWA: פתח Developer Tools > Application > Manifest`);
});

// טיפול בשגיאות
app.use((err, req, res, next) => {
    console.error('❌ שגיאת שרת:', err);
    res.status(500).send('שגיאת שרת');
});

