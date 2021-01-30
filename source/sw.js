const CACHE_NAME = "static2";
const STATIC_FILES = ["/", "/blog/", "/links/", "/about/", "/contact/", "/privacyPolicy/", "/offline/", "/imgs/screw.svg", "/style.css"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_FILES);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) return response;
      else {
        return fetch(event.request)
          .then(function (res) {
            return caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request.url, res.clone());
              return res;
            });
          })
          .catch(function (err) {
            return caches.open(CACHE_NAME).then(function (cache) {
              return cache.match("/offline/");
            });
          });
      }
    })
  );
});
