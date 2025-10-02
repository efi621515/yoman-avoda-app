// Real Sync Manager - מערכת סנכרון אמיתית
class RealSyncManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.syncInProgress = false;
        this.lastSyncTime = null;
        this.deviceId = this.getDeviceId();
        this.firebaseConfig = null;
        this.db = null;
        this.setupEventListeners();
    }

    // יצירת מזהה מכשיר ייחודי
    getDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }

    // הגדרת Firebase
    async setupFirebase() {
        try {
            // Firebase configuration - החלף עם ההגדרות שלך
            const firebaseConfig = {
                apiKey: "your-api-key-here",
                authDomain: "your-project.firebaseapp.com",
                projectId: "your-project-id",
                storageBucket: "your-project.appspot.com",
                messagingSenderId: "123456789",
                appId: "your-app-id"
            };

            // Dynamic import of Firebase
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getFirestore, collection, doc, setDoc, getDoc, addDoc, query, orderBy, limit, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

            const app = initializeApp(firebaseConfig);
            this.db = getFirestore(app);
            
            console.log('✅ Firebase הוגדר בהצלחה');
            return true;
        } catch (error) {
            console.error('❌ שגיאה בהגדרת Firebase:', error);
            return false;
        }
    }

    setupEventListeners() {
        // בדיקת חיבור לאינטרנט
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showSyncStatus('🟢 מחובר לאינטרנט');
            this.autoSync();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showSyncStatus('🔴 לא מחובר לאינטרנט');
        });

        // סנכרון אוטומטי כל 5 דקות
        setInterval(() => {
            if (this.isOnline && !this.syncInProgress) {
                this.autoSync();
            }
        }, 5 * 60 * 1000);
    }

    // סנכרון אוטומטי
    async autoSync() {
        if (!this.isOnline || this.syncInProgress) return;
        
        try {
            await this.syncData();
            this.lastSyncTime = new Date();
            this.showSyncStatus('✅ סנכרון אוטומטי הושלם');
        } catch (error) {
            console.error('❌ שגיאה בסנכרון אוטומטי:', error);
        }
    }

    // סנכרון ידני
    async manualSync() {
        if (!this.isOnline) {
            alert('❌ אין חיבור לאינטרנט. בדוק את החיבור ונסה שוב.');
            return;
        }

        if (this.syncInProgress) {
            alert('⏳ סנכרון כבר בתהליך...');
            return;
        }

        try {
            this.syncInProgress = true;
            this.showSyncStatus('🔄 מסנכרן...');
            
            // הגדרת Firebase אם לא הוגדר
            if (!this.db) {
                const firebaseReady = await this.setupFirebase();
                if (!firebaseReady) {
                    throw new Error('לא ניתן להתחבר ל-Firebase');
                }
            }
            
            await this.syncData();
            
            this.lastSyncTime = new Date();
            this.showSyncStatus('✅ סנכרון הושלם בהצלחה!');
            
        } catch (error) {
            console.error('❌ שגיאה בסנכרון:', error);
            this.showSyncStatus('❌ שגיאה בסנכרון');
            alert('❌ שגיאה בסנכרון: ' + error.message);
        } finally {
            this.syncInProgress = false;
        }
    }

    // סנכרון הנתונים האמיתי
    async syncData() {
        if (!this.db) {
            throw new Error('Firebase לא הוגדר');
        }

        try {
            // 1. העלאת נתונים מקומיים לענן
            await this.uploadLocalData();
            
            // 2. הורדת נתונים מהענן למכשיר
            await this.downloadCloudData();
            
            console.log('🔄 סנכרון הושלם בהצלחה');
        } catch (error) {
            console.error('❌ שגיאה בסנכרון:', error);
            throw error;
        }
    }

    // העלאת נתונים מקומיים לענן
    async uploadLocalData() {
        console.log('📤 מעלה נתונים לענן...');
        
        // איסוף כל הנתונים המקומיים
        const localData = {
            documents: JSON.parse(localStorage.getItem('documents') || '[]'),
            deliveryNotes: JSON.parse(localStorage.getItem('deliveryNotes') || '[]'),
            invoices: JSON.parse(localStorage.getItem('invoices') || '[]'),
            quotes: JSON.parse(localStorage.getItem('quotes') || '[]'),
            customers: JSON.parse(localStorage.getItem('customers') || '[]'),
            operators: JSON.parse(localStorage.getItem('operators') || '[]'),
            settings: JSON.parse(localStorage.getItem('settings') || '{}'),
            userSettings: JSON.parse(localStorage.getItem('userSettings') || '{}'),
            companySettings: JSON.parse(localStorage.getItem('companySettings') || '{}'),
            lastModified: new Date().toISOString(),
            deviceId: this.deviceId
        };

        // שמירה ב-Firebase
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        await setDoc(doc(this.db, 'sync', this.deviceId), localData);
        
        console.log('✅ נתונים הועלו לענן');
    }

    // הורדת נתונים מהענן למכשיר
    async downloadCloudData() {
        console.log('📥 מוריד נתונים מהענן...');
        
        try {
            const { collection, query, orderBy, limit, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            // קבלת כל המכשירים
            const syncRef = collection(this.db, 'sync');
            const q = query(syncRef, orderBy('lastModified', 'desc'), limit(10));
            const snapshot = await getDocs(q);
            
            let latestData = null;
            let latestTime = null;
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (!latestTime || data.lastModified > latestTime) {
                    latestData = data;
                    latestTime = data.lastModified;
                }
            });
            
            if (latestData && latestData.deviceId !== this.deviceId) {
                // עדכון הנתונים המקומיים עם הנתונים מהענן
                if (latestData.documents) localStorage.setItem('documents', JSON.stringify(latestData.documents));
                if (latestData.deliveryNotes) localStorage.setItem('deliveryNotes', JSON.stringify(latestData.deliveryNotes));
                if (latestData.invoices) localStorage.setItem('invoices', JSON.stringify(latestData.invoices));
                if (latestData.quotes) localStorage.setItem('quotes', JSON.stringify(latestData.quotes));
                if (latestData.customers) localStorage.setItem('customers', JSON.stringify(latestData.customers));
                if (latestData.operators) localStorage.setItem('operators', JSON.stringify(latestData.operators));
                if (latestData.settings) localStorage.setItem('settings', JSON.stringify(latestData.settings));
                if (latestData.userSettings) localStorage.setItem('userSettings', JSON.stringify(latestData.userSettings));
                if (latestData.companySettings) localStorage.setItem('companySettings', JSON.stringify(latestData.companySettings));
                
                console.log('✅ נתונים הורדו מהענן');
                
                // רענון הדף כדי להציג את הנתונים החדשים
                if (typeof loadData === 'function') {
                    loadData();
                }
            } else {
                console.log('ℹ️ אין נתונים חדשים להורדה');
            }
            
        } catch (error) {
            console.error('❌ שגיאה בהורדת נתונים:', error);
            throw error;
        }
    }

    // הצגת סטטוס סנכרון
    showSyncStatus(message) {
        const statusElement = document.getElementById('sync-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.style.display = 'block';
            
            // הסתרת ההודעה אחרי 3 שניות
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 3000);
        }
        
        console.log('📡 סטטוס סנכרון:', message);
    }

    // קבלת זמן הסנכרון האחרון
    getLastSyncTime() {
        return this.lastSyncTime ? 
            this.lastSyncTime.toLocaleString('he-IL') : 
            'לא בוצע סנכרון';
    }

    // בדיקת סטטוס החיבור
    getConnectionStatus() {
        return this.isOnline ? '🟢 מחובר' : '🔴 לא מחובר';
    }

    // קבלת מזהה המכשיר
    getDeviceId() {
        return this.deviceId;
    }
}

// יצירת מופע גלובלי
const realSyncManager = new RealSyncManager();

// פונקציות גלובליות
window.manualSync = () => realSyncManager.manualSync();
window.getSyncStatus = () => realSyncManager.getLastSyncTime();
window.getConnectionStatus = () => realSyncManager.getConnectionStatus();
window.getDeviceId = () => realSyncManager.getDeviceId();

