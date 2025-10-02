# 🔥 הוראות הגדרת Firebase לסנכרון

## 🎯 הבעיה
האפליקציה לא מסתנכרנת בין מכשירים כי Firebase לא מוגדר.

## 🛠️ הפתרון

### שלב 1: יצירת פרויקט Firebase
1. **לך ל-** [Firebase Console](https://console.firebase.google.com/)
2. **לחץ על "Create a project"**
3. **תן שם לפרויקט** (למשל: "yoman-avoda-app")
4. **בחר "Enable Google Analytics"** (אופציונלי)
5. **לחץ "Create project"**

### שלב 2: הגדרת Firestore
1. **בפרויקט החדש, לך ל-"Firestore Database"**
2. **לחץ "Create database"**
3. **בחר "Start in test mode"**
4. **בחר מיקום** (למשל: "us-central1")
5. **לחץ "Done"**

### שלב 3: קבלת הגדרות הפרויקט
1. **לך ל-"Project Settings"** (⚙️)
2. **לך לטאב "General"**
3. **גלול למטה ל-"Your apps"**
4. **לחץ על אייקון Web (</>)**
5. **תן שם לאפליקציה** (למשל: "yoman-avoda-web")
6. **לחץ "Register app"**

### שלב 4: העתקת ההגדרות
1. **העתק את הקוד שמופיע**
2. **החלף את התוכן ב-`firebase-config.js`**

### שלב 5: עדכון הקובץ
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...", // העתק מה-Firebase
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

### שלב 6: הרשאות Firestore
1. **לך ל-"Firestore Database"**
2. **לך לטאב "Rules"**
3. **החלף את הכללים:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
4. **לחץ "Publish"**

## ✅ בדיקה
1. **עדכן את האפליקציה ב-Netlify**
2. **פתח את האפליקציה בפון**
3. **בדוק אם הנתונים מסתנכרנים**

## 🚨 חשוב!
- **הגדרות Firebase חיוניות לסנכרון**
- **בלי זה, הנתונים נשארים מקומיים**
- **אחרי ההגדרה, הכל יעבוד אוטומטית**

## 📞 עזרה
אם יש בעיות, שלח לי את השגיאות מהקונסול!

