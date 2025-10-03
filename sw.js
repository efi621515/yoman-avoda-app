// Service Worker for יומן עבודה PWA
const CACHE_NAME = 'work-diary-v3.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// התקנה - שמירת קבצים ב-cache
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: מתקין...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: מוחק cache ישן:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return caches.open(CACHE_NAME);
    }).then(cache => {
      console.log('✅ Service Worker: שמירת קבצים ב-cache');
      return cache.addAll(urlsToCache);
    })
    .catch(error => {
      console.error('❌ Service Worker: שגיאה בשמירת cache:', error);
    })
  );
});

// הפעלה - ניקוי cache ישן
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: מופעל');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: מוחק cache ישן:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// בקשת קבצים - מחזיר מ-cache או מהרשת
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // אם הקובץ נמצא ב-cache, מחזיר אותו
        if (response) {
          console.log('📁 Service Worker: מחזיר מ-cache:', event.request.url);
          return response;
        }
        
        // אחרת, מביא מהרשת ושומר ב-cache
        console.log('🌐 Service Worker: מביא מהרשת:', event.request.url);
        return fetch(event.request).then(response => {
          // בדיקה שהתגובה תקינה
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // שמירה ב-cache (רק אם זה לא chrome-extension)
          if (!event.request.url.startsWith('chrome-extension://')) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          
          return response;
        });
      })
      .catch(error => {
        console.error('❌ Service Worker: שגיאה בטעינת קובץ:', error);
        // במקרה של שגיאה, מחזיר דף שגיאה או fallback
        return new Response('שגיאה בטעינת הקובץ', {
          status: 404,
          statusText: 'Not Found'
        });
      })
  );
});

// הודעות מהאפליקציה
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// עדכון זמין
self.addEventListener('updatefound', () => {
  console.log('🔄 Service Worker: עדכון זמין');
});

console.log('✅ Service Worker: נטען בהצלחה');

