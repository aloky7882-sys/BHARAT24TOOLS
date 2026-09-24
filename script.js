// ===============================
// BHARAT24TOOLS - script.js
// ADVANCED AI LEVEL
// ===============================

// --- Mobile Menu ---
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");
if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => menu.classList.toggle("active"));
}

// --- Tool Search ---
const search = document.getElementById("search");
if (search) {
    search.addEventListener("keyup", function () {
        const value = this.value.toLowerCase().trim();
        document.querySelectorAll(".card").forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(value) ? "" : "none";
        });
    });
}

// --- Voice Search ---
const voiceSearchBtn = document.getElementById("voiceSearchBtn");
if (voiceSearchBtn && 'webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';
    voiceSearchBtn.addEventListener("click", () => {
        recognition.start();
        voiceSearchBtn.classList.add("listening");
    });
    recognition.onresult = (event) => {
        search.value = event.results[0][0].transcript;
        search.dispatchEvent(new Event('keyup'));
        voiceSearchBtn.classList.remove("listening");
    };
    recognition.onerror = () => voiceSearchBtn.classList.remove("listening");
    recognition.onend = () => voiceSearchBtn.classList.remove("listening");
} else if (voiceSearchBtn) {
    voiceSearchBtn.addEventListener("click", () => alert("Voice search is not supported in your browser."));
}

// --- Dark/Light Mode Toggle ---
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });
}

// --- Back to Top ---
const backToTop = document.getElementById("backToTop");
if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 400);
    });
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// --- Animated Counters ---
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '+';
            let count = 0;
            const increment = target / 50;
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    counter.innerText = Math.ceil(count) + suffix;
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            updateCount();
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// --- Fade Animation on Scroll ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll(".card,.feature-box,.category-box").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all .6s ease";
    observer.observe(el);
});

// --- Navbar Shadow on Scroll ---
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        navbar.style.boxShadow = window.scrollY > 20 ? "0 8px 25px rgba(0,0,0,.18)" : "0 8px 20px rgba(0,0,0,.12)";
    }
});

// --- Online Visitor Counter (Simulated) ---
function updateOnlineCount() {
    const el = document.getElementById("onlineCount");
    if (el) {
        const base = 1;
        const random = Math.floor(Math.random() * 50) + 10;
        el.innerText = base + random;
    }
}
updateOnlineCount();
setInterval(updateOnlineCount, 5000);

// --- Favorites ---
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}
function saveFavorites(arr) {
    localStorage.setItem('favorites', JSON.stringify(arr));
}
function updateFavButtons() {
    const favs = getFavorites();
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const card = btn.closest('.card');
        if (!card) return;
        const toolName = card.getAttribute('data-tool-name');
        if (favs.includes(toolName)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fa-solid fa-star"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="fa-regular fa-star"></i>';
        }
    });
}
document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.card');
        if (!card) return;
        const toolName = card.getAttribute('data-tool-name');
        let favs = getFavorites();
        if (favs.includes(toolName)) {
            favs = favs.filter(f => f !== toolName);
        } else {
            favs.push(toolName);
        }
        saveFavorites(favs);
        updateFavButtons();
    });
});
updateFavButtons();

// --- Recent Tools Tracking ---
function trackRecentTool(toolName, url) {
    let recent = JSON.parse(localStorage.getItem('recentTools') || '[]');
    recent = recent.filter(r => r.name !== toolName);
    recent.unshift({ name: toolName, url: url, time: Date.now() });
    recent = recent.slice(0, 6);
    localStorage.setItem('recentTools', JSON.stringify(recent));
    renderRecentTools();
}

function renderRecentTools() {
    const list = document.getElementById('recentToolsList');
    const section = document.getElementById('recentToolsSection');
    if (!list || !section) return;
    const recent = JSON.parse(localStorage.getItem('recentTools') || '[]');
    if (recent.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';
    list.innerHTML = '';
    recent.forEach(item => {
        const div = document.createElement('div');
        div.className = 'recent-tool-item';
        div.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> ${item.name}`;
        div.addEventListener('click', () => window.location.href = item.url);
        list.appendChild(div);
    });
}

// Track clicks on tool buttons
document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.card');
        if (card) {
            const toolName = card.getAttribute('data-tool-name');
            const url = this.getAttribute('href');
            if (toolName && url) trackRecentTool(toolName, url);
        }
    });
});
renderRecentTools();

// --- Share Popup ---
const sharePopup = document.getElementById("sharePopup");
const shareClose = document.getElementById("shareClose");
let currentShareUrl = "";
let currentShareTitle = "";

document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        currentShareTitle = this.getAttribute('data-tool') || "Bharat24Tools";
        const card = this.closest('.card');
        const link = card ? card.querySelector('.tool-btn') : null;
        const path = link ? link.getAttribute('href') : '';
        currentShareUrl = `https://aloky7882-sys.github.io/BHARAT24TOOLS/${path}`;
        const shareText = `Check out this free tool: ${currentShareTitle} on Bharat24Tools!`;

        document.getElementById("shareWhatsapp").href = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentShareUrl)}`;
        document.getElementById("shareFacebook").href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`;
        document.getElementById("shareTwitter").href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentShareUrl)}`;

        sharePopup.classList.add("open");
    });
});

if (shareClose) shareClose.addEventListener("click", () => sharePopup.classList.remove("open"));
if (sharePopup) sharePopup.addEventListener("click", (e) => { if (e.target === sharePopup) sharePopup.classList.remove("open"); });

const shareCopy = document.getElementById("shareCopy");
if (shareCopy) {
    shareCopy.addEventListener("click", () => {
        navigator.clipboard.writeText(currentShareUrl).then(() => {
            shareCopy.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => { shareCopy.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Link'; }, 1500);
        });
    });
}

// --- Newsletter ---
const newsletterBtn = document.getElementById("newsletterBtn");
if (newsletterBtn) {
    newsletterBtn.addEventListener("click", () => {
        const email = document.getElementById("newsletterEmail").value;
        if (email && email.includes("@")) {
            alert("✅ Thank you for subscribing!");
            document.getElementById("newsletterEmail").value = "";
        } else {
            alert("❌ Please enter a valid email address.");
        }
    });
}

// --- AI Chatbot ---
const chatbotToggle = document.getElementById("chatbotToggle");
const chatbotWindow = document.getElementById("chatbotWindow");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotSend = document.getElementById("chatbotSend");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotBody = document.getElementById("chatbotBody");

if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener("click", () => chatbotWindow.classList.toggle("open"));
    chatbotClose.addEventListener("click", () => chatbotWindow.classList.remove("open"));
    chatbotSend.addEventListener("click", sendChatMessage);
    chatbotInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendChatMessage(); });
}

function sendChatMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    const userMsg = document.createElement("div");
    userMsg.className = "user-message";
    userMsg.textContent = message;
    chatbotBody.appendChild(userMsg);
    chatbotInput.value = "";
    setTimeout(() => {
        const botMsg = document.createElement("div");
        botMsg.className = "bot-message";
        botMsg.textContent = getBotReply(message.toLowerCase());
        chatbotBody.appendChild(botMsg);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }, 600);
}

function getBotReply(msg) {
    if (msg.includes("image") || msg.includes("photo") || msg.includes("compress")) return "📸 Image Compressor tool use karo! Ye JPG, PNG, WEBP images ko compress karta hai.";
    if (msg.includes("pdf")) return "📄 PDF ke liye humare paas JPG to PDF, PDF to JPG, Merge PDF tools hain.";
    if (msg.includes("qr")) return "📱 QR Code Generator se QR bana sakte ho.";
    if (msg.includes("calculator") || msg.includes("emi") || msg.includes("gst")) return "🧮 EMI, GST, Age, Scientific Calculator available hain.";
    if (msg.includes("password")) return "🔐 Password Generator se strong password banao.";
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("namaste")) return "Namaste! 🙏 Main Bharat AI hoon. Kaun sa tool use karna chahte ho?";
    if (msg.includes("free") || msg.includes("price")) return "💯 Bharat24Tools bilkul free hai! No signup, no watermark.";
    return "🤔 Mujhe samajh nahi aaya. Aap pooch sakte ho jaise 'image compress kaise karein?'";
}

// --- Category Click to Filter ---
document.querySelectorAll('.category-box').forEach(box => {
    box.addEventListener('click', () => {
        const cat = box.getAttribute('data-cat');
        const tab = document.querySelector(`.filter-tab[data-filter="${cat}"]`);
        if (tab) tab.click();
        document.querySelector('.tool-wrapper').scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Category Filter Tabs ---
(function () {
    var tabs = document.querySelectorAll('.filter-tab');
    var categories = document.querySelectorAll('.tool-category');
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var filter = tab.getAttribute('data-filter');
            tabs.forEach(function (t) {
                t.classList.remove('active');
                t.style.background = '#fff';
                t.style.color = '#4b5563';
                t.style.border = '1px solid #d5d9e0';
                t.style.fontWeight = '500';
            });
            tab.classList.add('active');
            tab.style.background = '#1a73e8';
            tab.style.color = '#fff';
            tab.style.border = 'none';
            tab.style.fontWeight = '600';
            categories.forEach(function (cat) {
                if (filter === 'all' || cat.getAttribute('data-category') === filter) {
                    cat.style.display = '';
                } else {
                    cat.style.display = 'none';
                }
            });
        });
    });
})();

// --- PWA Service Worker ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    });
}