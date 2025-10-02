# 🔥 מדריך הגדרת Firebase לסנכרון

## 📋 שלבי ההגדרה:

### **1. יצירת פרויקט Firebase:**
1. לך ל-[Firebase Console](https://console.firebase.google.com)
2. לחץ "Create a project"
3. בחר שם לפרויקט: `yoman-avoda-sync`
4. הפעל Google Analytics (אופציונלי)
5. לחץ "Create project"

### **2. הגדרת Firestore:**
1. בחר "Firestore Database" מהתפריט
2. לחץ "Create database"
3. בחר "Start in test mode" (לפיתוח)
4. בחר מיקום: `europe-west1` (אירופה)
5. לחץ "Done"

### **3. קבלת מפתחות API:**
1. לך ל-"Project Settings" (⚙️)
2. בחר "General" tab
3. גלול למטה ל-"Your apps"
4. לחץ "Web" (</>) icon
5. בחר שם לאפליקציה: `yoman-avoda-web`
6. לחץ "Register app"
7. העתק את הקוד שנוצר

### **4. עדכון הקוד:**
החלף את הערכים ב-`index.html`:

```javascript
const firebaseConfig = {
    apiKey: "המפתח שלך כאן",
    authDomain: "yoman-avoda-sync.firebaseapp.com",
    projectId: "yoman-avoda-sync",
    storageBucket: "yoman-avoda-sync.appspot.com",
    messagingSenderId: "123456789",
    appId: "המזהה שלך כאן"
};
```

### **5. הגדרת כללי אבטחה:**
1. לך ל-"Firestore Database" → "Rules"
2. החלף את הכללים:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sync/{deviceId} {
      allow read, write: if true; // רק לפיתוח!
    }
  }
}
```

### **6. בדיקת החיבור:**
1. פתח את האפליקציה
2. לך להגדרות → הגדרות סנכרון
3. לחץ "סנכרן עכשיו"
4. בדוק בקונסולה שהחיבור עובד

## 🔒 אבטחה מתקדמת (לאחר הפיתוח):

### **כללי אבטחה מחמירים:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sync/{deviceId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **הגדרת Authentication:**
1. לך ל-"Authentication" → "Sign-in method"
2. הפעל "Email/Password"
3. הוסף משתמשים ידנית

## 📱 בדיקת הסנכרון:

### **במחשב:**
1. פתח את האפליקציה
2. צור תעודת משלוח
3. לחץ "סנכרן נתונים"

### **בנייד:**
1. פתח את האפליקציה
2. לחץ "סנכרן נתונים"
3. בדוק שהתעודה הופיעה

## 🚨 פתרון בעיות:

### **שגיאת חיבור:**
- בדוק שהמפתחות נכונים
- בדוק שהכללים מאפשרים כתיבה
- בדוק חיבור לאינטרנט

### **נתונים לא מסתנכרנים:**
- בדוק שהמכשירים שונים
- בדוק שהזמן נכון
- בדוק בקונסולה לשגיאות

## 📊 מעקב אחר הסנכרון:

### **Firebase Console:**
1. לך ל-"Firestore Database"
2. בחר "sync" collection
3. ראה את כל המכשירים
4. בדוק את זמן העדכון האחרון

### **קונסולת הדפדפן:**
- פתח Developer Tools (F12)
- בחר "Console" tab
- חפש הודעות סנכרון
- בדוק שגיאות

## 🎯 טיפים:

1. **תמיד בדוק** שהחיבור עובד לפני פריסה
2. **שמור גיבוי** של הנתונים המקומיים
3. **בדוק סנכרון** בין מכשירים שונים
4. **עדכן כללים** לפני פריסה לייצור

## 📞 תמיכה:
- **Firebase Docs:** [firebase.google.com/docs](https://firebase.google.com/docs)
- **Firestore Guide:** [firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore)
- **JavaScript SDK:** [firebase.google.com/docs/web/setup](https://firebase.google.com/docs/web/setup)

