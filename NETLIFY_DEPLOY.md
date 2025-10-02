# 🚀 פריסת האפליקציה בנטפליי

## 📋 שלבי הפריסה

### **1. הכנת הקבצים:**
```bash
# יצירת תיקיית public
mkdir public

# העברת קבצים לתיקיית public
cp index.html public/
cp manifest.json public/
cp sw.js public/
cp assets/ public/ -r
```

### **2. יצירת אייקונים:**
1. פתח את `create_netlify_icons.html` בדפדפן
2. לחץ "צור אייקונים"
3. לחץ "הורד אייקונים"
4. שמור את הקבצים בתיקיית `public/assets/`

### **3. פריסה בנטפליי:**

#### **אופציה A: פריסה ידנית**
1. לך ל-[netlify.com](https://netlify.com)
2. התחבר/הרשם
3. לחץ "New site from Git"
4. בחר את הפרויקט שלך
5. הגדר:
   - **Build command:** `echo "No build needed"`
   - **Publish directory:** `public`
6. לחץ "Deploy site"

#### **אופציה B: פריסה עם drag & drop**
1. לך ל-[netlify.com](https://netlify.com)
2. גרור את תיקיית `public` לאזור הפריסה
3. המתן לסיום הפריסה

### **4. הגדרות PWA:**
- **Site name:** `yoman-avoda-app`
- **Custom domain:** (אופציונלי)
- **HTTPS:** אוטומטי

## 🔧 קבצים שנוצרו:

### **public/_redirects:**
```
/*    /index.html   200
/sw.js    /sw.js    200
/manifest.json    /manifest.json    200
/assets/*    /assets/*    200
```

### **netlify.toml:**
```toml
[build]
  publish = "."
  command = "echo 'No build command needed for static files'"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 📱 בדיקת PWA:
1. פתח את האתר במובייל
2. לחץ "Add to Home Screen"
3. בדוק שהאפליקציה עובדת offline

## 🎯 תכונות PWA:
- ✅ **Service Worker** - עבודה offline
- ✅ **Manifest** - התקנה כאפליקציה
- ✅ **Icons** - אייקונים לכל הגדלים
- ✅ **HTTPS** - אבטחה מלאה
- ✅ **Responsive** - עובד על כל המכשירים

## 🔄 עדכונים:
- כל push ל-Git יעדכן את האתר אוטומטית
- נטפליי יבנה מחדש את האתר
- השינויים יופיעו תוך דקות

## 📞 תמיכה:
- **נטפליי:** [docs.netlify.com](https://docs.netlify.com)
- **PWA:** [web.dev/pwa](https://web.dev/pwa)
- **Service Worker:** [MDN Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

