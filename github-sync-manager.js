// GitHub Sync Manager - סנכרון עם GitHub API
class GitHubSyncManager {
    constructor() {
        this.githubToken = null;
        this.repoOwner = 'efi621515';
        this.repoName = 'yoman-avoda-app';
        this.dataPath = 'data/work-diary-data.json';
        this.baseUrl = 'https://api.github.com';
        this.isInitialized = false;
    }

    // אתחול GitHub API
    async initialize() {
        console.log('🔧 מאתחל GitHub Sync Manager...');
        
        // בדיקה אם יש token
        this.githubToken = localStorage.getItem('github_token');
        if (!this.githubToken) {
            console.warn('⚠️ GitHub token לא נמצא - נדרש להגדיר');
            return false;
        }

        // בדיקת חיבור ל-GitHub
        try {
            const response = await fetch(`${this.baseUrl}/user`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const user = await response.json();
                console.log('✅ GitHub API מחובר:', user.login);
                this.isInitialized = true;
                return true;
            } else {
                console.error('❌ שגיאה בחיבור ל-GitHub:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ שגיאה בחיבור ל-GitHub:', error);
            return false;
        }
    }

    // העלאת נתונים ל-GitHub
    async uploadData(data) {
        if (!this.isInitialized) {
            console.warn('⚠️ GitHub לא מאותחל - סנכרון עם localStorage');
            return false;
        }

        try {
            console.log('📤 מעלה נתונים ל-GitHub...');
            
            // קבלת SHA של הקובץ הקיים
            let sha = null;
            try {
                const getResponse = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/contents/${this.dataPath}`, {
                    headers: {
                        'Authorization': `token ${this.githubToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (getResponse.ok) {
                    const fileData = await getResponse.json();
                    sha = fileData.sha;
                    console.log('📁 קובץ קיים נמצא, SHA:', sha);
                }
            } catch (error) {
                console.log('📁 קובץ חדש - יוצר...');
            }

            // הכנת הנתונים
            const content = JSON.stringify(data, null, 2);
            const encodedContent = btoa(unescape(encodeURIComponent(content)));

            // העלאת הקובץ
            const uploadResponse = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/contents/${this.dataPath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Update work diary data - ${new Date().toISOString()}`,
                    content: encodedContent,
                    sha: sha
                })
            });

            if (uploadResponse.ok) {
                const result = await uploadResponse.json();
                console.log('✅ נתונים הועלו ל-GitHub בהצלחה');
                console.log('🔗 קובץ זמין ב:', result.content.html_url);
                return true;
            } else {
                const error = await uploadResponse.json();
                console.error('❌ שגיאה בהעלאת נתונים ל-GitHub:', error);
                return false;
            }
        } catch (error) {
            console.error('❌ שגיאה בהעלאת נתונים ל-GitHub:', error);
            return false;
        }
    }

    // הורדת נתונים מ-GitHub
    async downloadData() {
        if (!this.isInitialized) {
            console.warn('⚠️ GitHub לא מאותחל - דילוג על הורדה');
            return null;
        }

        try {
            console.log('📥 מוריד נתונים מ-GitHub...');
            
            const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/contents/${this.dataPath}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const fileData = await response.json();
                const content = JSON.parse(atob(fileData.content));
                console.log('✅ נתונים הורדו מ-GitHub בהצלחה');
                return content;
            } else if (response.status === 404) {
                console.log('📁 קובץ לא קיים ב-GitHub - מחזיר null');
                return null;
            } else {
                const error = await response.json();
                console.error('❌ שגיאה בהורדת נתונים מ-GitHub:', error);
                return null;
            }
        } catch (error) {
            console.error('❌ שגיאה בהורדת נתונים מ-GitHub:', error);
            return null;
        }
    }

    // הגדרת GitHub token
    setToken(token) {
        this.githubToken = token;
        localStorage.setItem('github_token', token);
        console.log('✅ GitHub token נשמר');
    }

    // בדיקת סטטוס
    getStatus() {
        if (!this.isInitialized) {
            return '❌ GitHub לא מאותחל';
        }
        return '✅ GitHub מחובר';
    }
}

// יצירת instance גלובלי
window.githubSyncManager = new GitHubSyncManager();
