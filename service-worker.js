// Önbelleğe alınacak dosyaların versiyonu
const CACHE_NAME = 'ses-analiz-cache-v1';
// Önbelleğe alınacak temel dosyalar
const urlsToCache = [
  'casus_program_arayuzu.html'
  // Gerçek bir uygulamada buraya CSS, diğer JS dosyaları ve resimler de eklenir.
  // Tailwind CDN'i kasıtlı olarak eklemiyoruz, çünkü o dış kaynak.
];

// 1. Install (Yükleme) Olayı: Cache'i aç ve dosyaları ekle
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache açıldı');
        // urlsToCache içindeki tüm dosyaları önbelleğe al
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch (Getirme) Olayı: Ağa gitmeden önce cache'i kontrol et
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Eğer istenen kaynak cache'te varsa, cache'ten döndür
        if (response) {
          return response;
        }
        // Cache'te yoksa, normal olarak network'ten (internetten) iste
        return fetch(event.request);
      }
    )
  );
});

// 3. Activate (Aktifleşme) Olayı: Eski cache'leri temizle
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Sadece bu isimdeki cache kalsın
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Eğer cache adı whitelist'te yoksa, o cache'i sil
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
