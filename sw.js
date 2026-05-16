const CACHE='poke-v1';let c=0;
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(ch=>ch.addAll(['./','./index.html','./manifest.json'])) )});
self.addEventListener('fetch',e=>{
 if(e.request.url.includes('/Images/')||e.request.url.includes('/Icons/')){
  e.respondWith(caches.open(CACHE).then(ch=>ch.match(e.request).then(r=>r||fetch(e.request).then(n=>{ch.put(e.request,n.clone());c++;self.clients.matchAll().then(cs=>cs.forEach(cl=>cl.postMessage({type:'p',c})));return n}))))
 }else{e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))}
});