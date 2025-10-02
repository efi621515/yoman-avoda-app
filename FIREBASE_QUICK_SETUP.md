# 🔥 הגדרת Firebase מהירה

## 🎯 הבעיה:
הנתונים לא מסתנכרנים בין המחשב לפון כי Firebase לא מוגדר.

## 🛠️ הפתרון המהיר:

### **1. לך ל-Firebase Console:**
👉 [https://console.firebase.google.com/](https://console.firebase.google.com/)

### **2. צור פרויקט חדש:**
- שם: `yoman-avoda-sync`
- לחץ "Create project"

### **3. הפעל Firestore:**
- לך ל-"Firestore Database"
- לחץ "Create database"
- בחר "Start in test mode"
- בחר מיקום: `europe-west1`
- לחץ "Done"

### **4. קבל את המפתחות:**
- לך ל-"Project Settings" (⚙️)
- בחר "General" tab
- גלול למטה ל-"Your apps"
- לחץ "Web" (</>) icon
- שם: `yoman-avoda-web`
- לחץ "Register app"
- **העתק את הקוד שנוצר!**

### **5. עדכן את הקוד:**
החלף את הערכים ב-`index.html` בשורה 7802:

```javascript
const firebaseConfig = {
    apiKey: "המפתח שלך כאן",
    authDomain: "yoman-avoda-sync.firebaseapp.com",
    projectId: "yoman-avoda-sync",
    storageBucket: "yoman-avoda-sync.appspot.com",
    messagingSenderId: "המספר שלך",
    appId: "המזהה שלך"
};
```

### **6. הגדר כללי אבטחה:**
- לך ל-"Firestore Database" → "Rules"
- החלף את הכללים:

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

### **7. בדיקה:**
1. שמור את הקובץ
2. העלה ל-Netlify
3. פתח את האפליקציה בפון
4. לך להגדרות → סנכרון
5. לחץ "סנכרן עכשיו"

## ✅ אחרי ההגדרה:
- הנתונים יסתנכרנו אוטומטית
- כל מכשיר יראה את הנתונים של האחר
- הסנכרון יעבוד בזמן אמת

## 🆘 אם יש בעיה:
1. בדוק שהמפתחות נכונים
2. בדוק שהכללים נשמרו
3. בדוק שהפרויקט פעיל
4. בדוק בקונסולה של הדפדפן
