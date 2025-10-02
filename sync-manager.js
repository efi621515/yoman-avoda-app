// Sync Manager - מערכת סנכרון נתונים
class SyncManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.syncInProgress = false;
        this.lastSyncTime = null;
        this.setupEventListeners();
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

    // סנכרון הנתונים
    async syncData() {
        // כאן תהיה הלוגיקה של הסנכרון
        // כרגע זה רק סימולציה
        
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('🔄 מסנכרן נתונים...');
                resolve();
            }, 2000);
        });
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
}

// יצירת מופע גלובלי
const syncManager = new SyncManager();

// פונקציות גלובליות
window.manualSync = () => syncManager.manualSync();
window.getSyncStatus = () => syncManager.getLastSyncTime();
window.getConnectionStatus = () => syncManager.getConnectionStatus();

