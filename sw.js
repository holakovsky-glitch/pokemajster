const CACHE='pokemajster-v2';
const FILES=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
});

self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      if(e.request.url.includes('/images/')||e.request.url.includes('/icons/')||e.request.url.includes('/data/')){
        caches.open(CACHE).then(c=>c.put(e.request,res.clone()));
      }
      return res;
    })).catch(()=>caches.match('./index.html'))
  );
});