const CACHE_NAME = "music-player-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  // Add your song files here
  "/song/bangla/আজ কবিতা অন্য কারো.m4a",
  "/song/bangla/আমি তোমারই.m4a",
  "/song/bangla/বৃষ্টি ভেজা রাত.m4a",
  "/song/bangla/চোখের জল.m4a",
  "/song/english/Shape of You.m4a",
  "/song/english/Blinding Lights.m4a",
  "/song/english/Watermelon Sugar.m4a",
  "/song/hindi/Channa Mereya.m4a",
  "/song/hindi/Kesariya.m4a",
  "/song/hindi/Naatu Naatu.m4a",
  "/song/hindi/Shiv Tandav.m4a",
  // Add cover images
  "/cover/cover1.jpg",
  "/cover/cover2.jpg",
  "/cover/cover3.jpg",
  "/cover/cover4.jpg",
  "/cover/cover5.jpg",
  "/cover/cover6.jpg",
  "/cover/cover7.jpg",
  "/cover/cover8.jpg",
  "/cover/cover9.jpg",
  "/cover/cover10.jpg",
  "/cover/cover11.jpg",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log("Cache failed:", error);
      })
  );
});

// Fetch event - serve from cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline music
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Background sync triggered");
    // Handle background sync for music playback
  }
});

// Push notifications for music events
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
      actions: [
        {
          action: "play",
          title: "Play",
          icon: "/icons/play-icon.png",
        },
        {
          action: "pause",
          title: "Pause",
          icon: "/icons/pause-icon.png",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "play") {
    // Handle play action
    event.waitUntil(clients.openWindow("/?action=play"));
  } else if (event.action === "pause") {
    // Handle pause action
    event.waitUntil(clients.openWindow("/?action=pause"));
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});
