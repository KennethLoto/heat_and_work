const CACHE_NAME = "static_cache";

importScripts("/staticAssets.js");

async function preCache() {
  const cache = await caches.open(CACHE_NAME);

  // Try each asset individually and catch errors
  const results = await Promise.allSettled(
    STATIC_ASSETS.map((url) => cache.add(url))
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error("❌ Failed to cache:", STATIC_ASSETS[index], result.reason);
    }
  });
}

self.addEventListener("install", (event) => {
  console.log("[SW] installed");
  self.skipWaiting();
  event.waitUntil(preCache());
});

async function cleanupCache() {
  const keys = await caches.keys();
  const deletePromises = keys.map((key) => {
    if (key !== CACHE_NAME) {
      return caches.delete(key);
    }
  });
  return Promise.all(deletePromises);
}

self.addEventListener("activate", (event) => {
  console.log("[SW] activated");
  event.waitUntil(cleanupCache()); // <-- Fix here
});

async function fetchAssets(event) {
  try {
    const response = await fetch(event.request);
    return response;
  } catch (err) {
    const cache = await caches.open(CACHE_NAME);
    return cache.match(event.request);
  }
}

self.addEventListener("fetch", (event) => {
  console.log("[SW] fetched", event.request.url);
  event.respondWith(fetchAssets(event));
});
