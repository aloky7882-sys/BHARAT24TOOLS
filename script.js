// ===============================
// BHARAT24TOOLS - FINAL script.js
// ALL TOOLS + ADVANCED FEATURES
// ===============================

// ===== Mobile Menu =====
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");

if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
}

// ===== Tool Search =====
const search = document.getElementById("search");
if (search) {
    search.addEventListener("keyup", function () {
        const value = this.value.toLowerCase().trim();
        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(value) ? "" : "none";
        });
    });
}

// ===== Voice Search =====
const voiceSearchBtn = document.getElementById("voiceSearchBtn");
if (voiceSearchBtn) {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        voiceSearchBtn.addEventListener("click", () => {
            recognition.start();
            voiceSearchBtn.classList.add("listening");
            showToast("🎤 Listening...");
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            search.value = transcript;
            search.dispatchEvent(new Event('keyup'));
            voiceSearchBtn.classList.remove("listening");
            showToast("🔍 Searching: " + transcript);
        };

        recognition.onerror = () => {
            voiceSearchBtn.classList.remove("listening");
            showToast("❌ Voice not recognized. Try again.");
        };

        recognition.onend = () => {
            voiceSearchBtn.classList.remove("listening");
        };
    } else {
        voiceSearchBtn.addEventListener("click", () => {
            showToast("❌ Voice search not supported. Use Chrome or Edge.");
        });
    }
}

// ===== Dark/Light Mode Toggle =====
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
            showToast("🌙 Dark Mode ON");
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            showToast("☀️ Light Mode ON");
        }
    });
}

// ===== Language Toggle =====
const langToggle = document.getElementById("langToggle");
let currentLang = localStorage.getItem('lang') || 'en';
if (langToggle) {
    langToggle.addEventListener("click", () => {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        localStorage.setItem('lang', currentLang);
        showToast(currentLang === 'hi' ? "🇮🇳 हिंदी भाषा चुनी गई" : "🇬🇧 English selected");
    });
}

// ===== Live Clock =====
const liveClock = document.getElementById("liveClock");
if (liveClock) {
    const updateClock = () => {
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' };
        liveClock.innerHTML = '<i class="fa-regular fa-clock"></i> ' + now.toLocaleTimeString('en-IN', options);
    };
    updateClock();
    setInterval(updateClock, 60000);
}

// ===== Back to Top =====
const backToTop = document.getElementById("backToTop");
if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 400);
        const scrollProgress = document.getElementById("scrollProgress");
        if (scrollProgress) {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollProgress.style.width = (scrollTop / scrollHeight) * 100 + "%";
        }
    });
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Animated Counters =====
const counters = document.querySelectorAll('.counter');
if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const increment = target / 50;
                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.innerText = Math.ceil(count) + (target >= 100 ? 'K+' : '+');
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target + (target >= 100 ? 'K+' : '+');
                    }
                };
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));
}

// ===== Typing Animation =====
const typedText = document.getElementById("typed-text");
if (typedText) {
    const words = ["Image Tools", "PDF Tools", "Calculators", "QR Codes", "Converters"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typedText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(() => { isDeleting = true; type(); }, 1500);
            return;
        }
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
        setTimeout(type, isDeleting ? 50 : 100);
    };
    type();
}

// ===== Custom Cursor =====
const customCursor = document.getElementById("customCursor");
if (customCursor && window.innerWidth > 900) {
    document.addEventListener("mousemove", (e) => {
        customCursor.style.left = e.clientX + "px";
        customCursor.style.top = e.clientY + "px";
    });
    document.querySelectorAll("a, button, .card, .category-box").forEach(el => {
        el.addEventListener("mouseenter", () => customCursor.classList.add("hover"));
        el.addEventListener("mouseleave", () => customCursor.classList.remove("hover"));
    });
}

// ===== Toast Notification =====
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// ===== Favorite Tools =====
document.querySelectorAll(".fav-btn").forEach(btn => {
    const card = btn.closest(".card");
    const toolName = card.getAttribute("data-tool");
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.includes(toolName)) {
        btn.classList.add("active");
        btn.innerHTML = '<i class="fa-solid fa-star"></i>';
    }
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favs.includes(toolName)) {
            favs = favs.filter(f => f !== toolName);
            btn.classList.remove("active");
            btn.innerHTML = '<i class="fa-regular fa-star"></i>';
            showToast("⭐ Removed from Favorites");
        } else {
            favs.push(toolName);
            btn.classList.add("active");
            btn.innerHTML = '<i class="fa-solid fa-star"></i>';
            showToast("⭐ Added to Favorites");
        }
        localStorage.setItem('favorites', JSON.stringify(favs));
    });
});

// ===== Recent Tools =====
document.querySelectorAll(".card .tool-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".card");
        const toolName = card.getAttribute("data-tool");
        let recent = JSON.parse(localStorage.getItem('recent') || '[]');
        recent = recent.filter(t => t !== toolName);
        recent.unshift(toolName);
        recent = recent.slice(0, 5);
        localStorage.setItem('recent', JSON.stringify(recent));
    });
});

// ===== Newsletter =====
const newsletterBtn = document.getElementById("newsletterBtn");
if (newsletterBtn) {
    newsletterBtn.addEventListener("click", () => {
        const email = document.getElementById("newsletterEmail").value;
        if (email && email.includes("@")) {
            showToast("✅ Thank you for subscribing!");
            document.getElementById("newsletterEmail").value = "";
        } else {
            showToast("❌ Please enter a valid email.");
        }
    });
}

// ===== AI Chatbot =====
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
    chatbotInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendChatMessage();
    });
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
    if (msg.includes("image") || msg.includes("photo") || msg.includes("compress")) {
        return "📸 Image Compressor use karo! Ye JPG, PNG, WEBP images ko compress karta hai bina quality khoye. 'Image Tools' section mein jaake 'Image Compressor' open karo.";
    }
    if (msg.includes("pdf")) {
        return "📄 PDF ke liye humare paas JPG to PDF, PDF to JPG, Merge PDF, Split PDF jaise tools hain. 'PDF Tools' section dekho!";
    }
    if (msg.includes("qr")) {
        return "📱 QR Code Generator se aap kisi bhi link ya text ka QR code bana sakte ho. 'QR Tools' section mein milega.";
    }
    if (msg.includes("calculator") || msg.includes("emi") || msg.includes("gst")) {
        return "🧮 Humare paas EMI Calculator, GST Calculator, Age Calculator, Scientific Calculator hain. 'Calculators' section check karo!";
    }
    if (msg.includes("password")) {
        return "🔐 Password Generator se strong password banao. 'Utility Tools' section mein milega.";
    }
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("namaste")) {
        return "Namaste! 🙏 Main Bharat AI hoon. Aap kaun sa tool use karna chahte ho?";
    }
    if (msg.includes("free") || msg.includes("price")) {
        return "💯 Bharat24Tools bilkul free hai! No signup, no watermark, no hidden charges.";
    }
    return "🤔 Mujhe samajh nahi aaya. Aap pooch sakte ho jaise 'image compress kaise karein?' ya 'pdf to jpg kaise karein?'";
}

// ===== Fade Animation on Scroll =====
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