// ==========================================
// Bharat24Tools - Service Worker (PWA)
// Advanced Offline Support + Cache Management
// ==========================================

const CACHE_NAME = "bharat24tools-v3";
const RUNTIME_CACHE = "bharat24tools-runtime-v3";

// Core files to cache on install
const CORE_ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./favicon.svg",
    "./manifest.json",
    "./ai-text-summarizer.html"
];

// Tool pages to cache on first visit (runtime caching)
const TOOL_PAGES = [
    "./image-compressor.html",
    "./image-resizer.html",
    "./image-cropper.html",
    "./jpg-to-png.html",
    "./png-to-jpg.html",
    "./image-to-excel.html",
    "./image-to-word.html",
    "./jpg-to-pdf-dragdrop.html",
    "./pdf-to-jpg-dragdrop.html",
    "./excel-to-pdf-dragdrop.html",
    "./merge-pdf-dragdrop.html",
    "./split-pdf-dragdrop.html",
    "./word-to-pdf.html",
    "./images-to-pdf.html",
    "./excel-to-image.html",
    "./word-to-image.html",
    "./css-gradient-generator.html",
    "./qr-code-logo.html",
    "./text-diff-checker.html",
    "./unit-converter.html",
    "./json-formatter.html",
    "./color-palette-generator.html",
    "./favicon-generator.html",
    "./base64-tool.html",
    "./meme-generator.html",
    "./image-to-text.html",
    "./voice-to-text.html",
    "./text-to-voice.html",
    "./background-remover.html",
    "./text-tone-checker.html",
    "./qr-generator.html",
    "./password-generator.html",
    "./word-counter.html",
    "./age-calculator.html",
    "./emi-calculator.html",
    "./scientific-calculator.html",
    "./gst-calculator.html",
    "./about.html",
    "./contact.html",
    "./privacy-policy.html",
    "./terms.html",
    "./cookies.html"
];

// Install event - cache core assets
self.addEventListener("install", (event) => {
    console.log("[SW] Installing Bharat24Tools SW v3...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_ASSETS).catch((err) => {
                console.warn("[SW] Some core assets failed to cache:", err);
            });
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    console.log("[SW] Activating Bharat24Tools SW v3...");
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== RUNTIME_CACHE) {
                        console.log("[SW] Deleting old cache:", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
    // Only handle GET requests
    if (event.request.method !== "GET") return;

    // Skip Chrome extensions and cross-origin
    const url = new URL(event.request.url);
    if (!url.protocol.startsWith("http")) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Serve from cache, and update in background
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(RUNTIME_CACHE).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                        });
                    }
                }).catch(() => {});
                return cachedResponse;
            }

            // Not in cache - fetch from network
            return fetch(event.request)
                .then((response) => {
                    // Cache valid responses
                    if (response && response.status === 200 && response.type === "basic") {
                        const responseClone = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Offline fallback
                    if (event.request.destination === "document") {
                        return caches.match("./index.html");
                    }
                });
        })
    );
});

// Listen for messages from the page
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});