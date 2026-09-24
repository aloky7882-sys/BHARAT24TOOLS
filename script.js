// ===============================
// BHARAT24TOOLS - script.js
// Next Level + Advanced AI + Chatbot
// ===============================

// Mobile Menu
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");

if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
}

// Tool Search
const search = document.getElementById("search");

if (search) {
    search.addEventListener("keyup", function () {
        const value = this.value.toLowerCase().trim();
        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            if (text.includes(value)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
}

// Voice Search
const voiceSearch = document.getElementById("voiceSearch");

if (voiceSearch && 'webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    voiceSearch.addEventListener("click", () => {
        recognition.start();
        voiceSearch.style.color = "#a855f7";
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        search.value = transcript;
        search.dispatchEvent(new Event('keyup'));
        voiceSearch.style.color = "#0d6efd";
    };

    recognition.onerror = () => { voiceSearch.style.color = "#0d6efd"; };
    recognition.onend = () => { voiceSearch.style.color = "#0d6efd"; };
} else if (voiceSearch) {
    voiceSearch.addEventListener("click", () => {
        alert("Voice search is not supported in this browser. Please use Chrome or Edge.");
    });
}

// Category Filter Tabs
(function () {
    var tabs = document.querySelectorAll('.filter-tab');
    var categories = document.querySelectorAll('.tool-category');
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var filter = tab.getAttribute('data-filter');
            tabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
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

// Smooth Button Click Effect
document.querySelectorAll(".card .tool-btn").forEach(button => {
    button.addEventListener("click", function () {
        this.style.transform = "scale(.95)";
        setTimeout(() => { this.style.transform = "scale(1)"; }, 150);
    });
});

// Fade Animation on Scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll(".card, .feature-box, .category-box").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all .6s ease";
    observer.observe(el);
});

// Navbar Shadow on Scroll
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        if (window.scrollY > 20) {
            navbar.style.boxShadow = "0 8px 25px rgba(0,0,0,.18)";
        } else {
            navbar.style.boxShadow = "0 8px 20px rgba(0,0,0,.12)";
        }
    }
});

// Dark / Light Mode Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;

if (themeToggle) {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        if (themeIcon) themeIcon.className = "fa-solid fa-sun";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            if (themeIcon) themeIcon.className = "fa-solid fa-sun";
        } else {
            localStorage.setItem("theme", "light");
            if (themeIcon) themeIcon.className = "fa-solid fa-moon";
        }
    });
}

// Back to Top Button
const backToTop = document.getElementById("backToTop");

if (backToTop) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ================= AI CHATBOT LOGIC =================
(function () {
    const toggle = document.getElementById("chatbotToggle");
    const windowEl = document.getElementById("chatbotWindow");
    const closeBtn = document.getElementById("chatbotClose");
    const messagesEl = document.getElementById("chatbotMessages");
    const inputEl = document.getElementById("chatbotInput");
    const sendBtn = document.getElementById("chatbotSend");

    if (!toggle || !windowEl) return;

    const tools = [
        { name: "Image Compressor", link: "image-compressor.html", keywords: ["compress", "image compress", "photo compress", "image size", "jpg compress", "png compress", "webp compress"], desc: "JPG, PNG, और WebP images को बिना quality loss के compress करें।" },
        { name: "Image Resizer", link: "image-resizer.html", keywords: ["resize", "image resize", "photo resize", "dimension", "width height"], desc: "Images को custom dimensions में resize करें।" },
        { name: "Image Cropper", link: "image-cropper.html", keywords: ["crop", "image crop", "photo crop", "cut image"], desc: "Live preview के साथ images को crop करें।" },
        { name: "JPG to PNG", link: "jpg-to-png.html", keywords: ["jpg to png", "jpeg to png", "convert jpg"], desc: "JPG images को PNG format में convert करें।" },
        { name: "PNG to JPG", link: "png-to-jpg.html", keywords: ["png to jpg", "png to jpeg", "convert png"], desc: "PNG images को JPG format में convert करें।" },
        { name: "Image to Excel", link: "image-to-excel.html", keywords: ["image to excel", "photo to excel", "img2excel"], desc: "Images को Excel spreadsheet में embed करें।" },
        { name: "Image to Word", link: "image-to-word.html", keywords: ["image to word", "photo to word", "img2word", "picture to word"], desc: "Images को Word document में embed करें।" },
        { name: "JPG to PDF", link: "jpg-to-pdf-dragdrop.html", keywords: ["jpg to pdf", "jpeg to pdf", "image to pdf", "photo to pdf"], desc: "JPG images को PDF document में convert करें।" },
        { name: "PDF to JPG", link: "pdf-to-jpg-dragdrop.html", keywords: ["pdf to jpg", "pdf to jpeg", "pdf to image", "pdf to photo"], desc: "PDF pages को high-quality JPG images में convert करें।" },
        { name: "Excel to PDF", link: "excel-to-pdf-dragdrop.html", keywords: ["excel to pdf", "xlsx to pdf", "xls to pdf", "spreadsheet to pdf"], desc: "Excel spreadsheets को PDF में convert करें।" },
        { name: "Merge PDF", link: "merge-pdf-dragdrop.html", keywords: ["merge pdf", "combine pdf", "join pdf", "pdf merge"], desc: "Multiple PDF files को एक में combine करें।" },
        { name: "Split PDF", link: "split-pdf-dragdrop.html", keywords: ["split pdf", "pdf split", "extract pdf", "separate pdf"], desc: "PDF pages को extract या split करें।" },
        { name: "Word to PDF", link: "word-to-pdf.html", keywords: ["word to pdf", "docx to pdf", "doc to pdf"], desc: "Word (.docx) documents को PDF में convert करें।" },
        { name: "Images to PDF", link: "images-to-pdf.html", keywords: ["images to pdf", "photos to pdf", "multiple images to pdf"], desc: "Multiple images को single PDF में combine करें।" },
        { name: "Excel to Image", link: "excel-to-image.html", keywords: ["excel to image", "xlsx to image", "spreadsheet to image", "excel to png"], desc: "Excel को PNG, JPG, या WebP images में convert करें।" },
        { name: "Word to Image", link: "word-to-image.html", keywords: ["word to image", "docx to image", "document to image"], desc: "Word documents को high-quality images में convert करें।" },
        { name: "CSS Gradient Generator", link: "css-gradient-generator.html", keywords: ["gradient", "css gradient", "gradient generator", "background gradient"], desc: "Multi-color gradients बनाएं और CSS copy करें।" },
        { name: "QR Code with Logo", link: "qr-code-logo.html", keywords: ["qr code with logo", "qr logo", "custom qr", "branded qr"], desc: "Logo embedded QR code बनाएं।" },
        { name: "Text Diff Checker", link: "text-diff-checker.html", keywords: ["diff", "text diff", "compare text", "difference checker"], desc: "दो texts को compare करें और difference देखें।" },
        { name: "Unit Converter", link: "unit-converter.html", keywords: ["unit converter", "convert units", "length weight temperature", "measurement"], desc: "Length, weight, temperature, speed और data storage convert करें।" },
        { name: "JSON Formatter", link: "json-formatter.html", keywords: ["json", "json formatter", "json validator", "json minify"], desc: "JSON format, validate और minify करें।" },
        { name: "Color Palette Generator", link: "color-palette-generator.html", keywords: ["color palette", "palette generator", "color scheme", "color combination"], desc: "Complementary, analogous और triadic color palettes generate करें।" },
        { name: "Favicon Generator", link: "favicon-generator.html", keywords: ["favicon", "favicon generator", "website icon", "site icon"], desc: "एक image से सभी favicon sizes बनाएं।" },
        { name: "Base64 Encoder/Decoder", link: "base64-tool.html", keywords: ["base64", "base64 encode", "base64 decode", "encoder decoder"], desc: "Text या files को Base64 में convert करें।" },
        { name: "Meme Generator", link: "meme-generator.html", keywords: ["meme", "meme generator", "funny image", "meme maker"], desc: "Image पर top और bottom text जोड़कर meme बनाएं।" },
        { name: "Image to Text (OCR)", link: "image-to-text.html", keywords: ["ocr", "image to text", "extract text", "photo to text"], desc: "Image से text extract करें AI के साथ।" },
        { name: "Voice to Text", link: "voice-to-text.html", keywords: ["voice to text", "speech to text", "audio to text", "dictation"], desc: "बोलकर text लिखें, Hindi और English support।" },
        { name: "Text to Voice", link: "text-to-voice.html", keywords: ["text to voice", "text to speech", "tts", "read aloud"], desc: "किसी भी text को natural speech में convert करें।" },
        { name: "Background Remover", link: "background-remover.html", keywords: ["background remover", "remove bg", "bg remove", "photo background"], desc: "AI से photo का background हटाएं।" },
        { name: "Text Tone Checker", link: "text-tone-checker.html", keywords: ["text tone", "tone checker", "rude message", "message tone"], desc: "Check करें कि message rude तो नहीं लग रहा।" },
        { name: "QR Code Generator", link: "qr-generator.html", keywords: ["qr code", "qr generator", "qr", "barcode"], desc: "Links, text और बहुत कुछ के लिए QR codes बनाएं।" },
        { name: "Password Generator", link: "password-generator.html", keywords: ["password", "password generator", "strong password", "secure password"], desc: "Strong और secure passwords generate करें।" },
        { name: "Word Counter", link: "word-counter.html", keywords: ["word counter", "count words", "character count", "word count"], desc: "Words, characters और paragraphs count करें।" },
        { name: "Age Calculator", link: "age-calculator.html", keywords: ["age calculator", "age", "birthday", "date of birth"], desc: "अपनी exact age seconds में calculate करें।" },
        { name: "EMI Calculator", link: "emi-calculator.html", keywords: ["emi", "emi calculator", "loan emi", "loan calculator"], desc: "Monthly loan EMI instantly calculate करें।" },
        { name: "Scientific Calculator", link: "scientific-calculator.html", keywords: ["scientific calculator", "calculator", "math calculator", "advanced calculator"], desc: "Advanced mathematical calculations करें।" },
        { name: "GST Calculator", link: "gst-calculator.html", keywords: ["gst", "gst calculator", "tax calculator", "gst add remove"], desc: "GST को add या remove करें किसी भी amount से।" }
    ];

    function getBotReply(userMsg) {
        const msg = userMsg.toLowerCase().trim();

        if (/(hi|hello|hey|namaste|hii|hlo|namaskar)/i.test(msg)) {
            return "नमस्ते! 🙏 मैं Bharat24 AI हूँ। आप किस tool की तलाश में हैं? जैसे <b>image compress</b>, <b>pdf to jpg</b>, <b>emi calculator</b> आदि।";
        }

        if (/(thank|thanks|shukriya|dhanyawad)/i.test(msg)) {
            return "आपका स्वागत है! 😊 और कुछ चाहिए तो बताइए।";
        }

        if (/(bye|goodbye|alvida)/i.test(msg)) {
            return "अलविदा! 👋 Bharat24Tools को बार-बार visit करते रहें।";
        }

        if (/(free|paisa|money|charge|price|cost)/i.test(msg)) {
            return "बिल्कुल free! 💯 सभी tools 100% free हैं — कोई signup नहीं, कोई watermark नहीं, कोई hidden charge नहीं।";
        }

        if (/(safe|secure|privacy|data|upload|server)/i.test(msg)) {
            return "आपकी privacy हमारी priority है। 🔒 सभी files आपके browser में ही process होती हैं, किसी server पर upload नहीं होतीं।";
        }

        if (/(kitne|how many|total|count).*(tool|tools)/i.test(msg) || /(tools? list|list of tools|all tools)/i.test(msg)) {
            return `Bharat24Tools में <b>${tools.length}+ tools</b> हैं, जो 4 categories में बंटे हैं:<br>🖼 Image Tools<br>📄 PDF Tools<br>🎨 Design Tools<br>🧰 Utility Tools<br><br>किस category का tool चाहिए?`;
        }

        let bestMatch = null;
        let bestScore = 0;

        tools.forEach(tool => {
            let score = 0;
            if (msg.includes(tool.name.toLowerCase())) score += 10;
            tool.keywords.forEach(kw => {
                if (msg.includes(kw)) score += 5;
            });
            tool.keywords.forEach(kw => {
                const words = kw.split(" ");
                words.forEach(w => {
                    if (w.length > 3 && msg.includes(w)) score += 1;
                });
            });

            if (score > bestScore) {
                bestScore = score;
                bestMatch = tool;
            }
        });

        if (bestMatch && bestScore >= 3) {
            return `✅ <b>${bestMatch.name}</b> मिल गया!<br><br>${bestMatch.desc}<br><br>👉 <a href="${bestMatch.link}">Open ${bestMatch.name} →</a>`;
        }

        if (bestMatch && bestScore > 0) {
            return `क्या आप <b>${bestMatch.name}</b> की बात कर रहे हैं?<br><br>👉 <a href="${bestMatch.link}">Open ${bestMatch.name} →</a>`;
        }

        if (/(image|photo|pic|picture)/i.test(msg)) {
            return "🖼 Image Tools के लिए ये tools उपलब्ध हैं:<br>• Image Compressor<br>• Image Resizer<br>• Image Cropper<br>• JPG to PNG<br>• PNG to JPG<br>• Image to Excel<br>• Image to Word<br><br>कौन सा चाहिए?";
        }
        if (/(pdf)/i.test(msg)) {
            return "📄 PDF Tools:<br>• JPG to PDF<br>• PDF to JPG<br>• Excel to PDF<br>• Merge PDF<br>• Split PDF<br>• Word to PDF<br>• Images to PDF<br><br>कौन सा चाहिए?";
        }
        if (/(calculat|ganit|math|hisab)/i.test(msg)) {
            return "🧮 Calculators:<br>• EMI Calculator<br>• Age Calculator<br>• GST Calculator<br>• Scientific Calculator<br><br>कौन सा चाहिए?";
        }

        return "माफ़ कीजिए, मुझे समझ नहीं आया। 🤔<br><br>आप इनमें से कुछ try कर सकते हैं:<br>• 'image compress karo'<br>• 'pdf to jpg'<br>• 'emi calculator'<br>• 'all tools'<br>• 'free hai kya?'";
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `chat-message ${sender}-message`;
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble";
        bubble.innerHTML = text;
        msgDiv.appendChild(bubble);
        messagesEl.appendChild(msgDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement("div");
        typing.className = "chat-message bot-message";
        typing.id = "typingIndicator";
        typing.innerHTML = `<div class="chat-bubble">Typing...</div>`;
        messagesEl.appendChild(typing);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTyping() {
        const t = document.getElementById("typingIndicator");
        if (t) t.remove();
    }

    function sendMessage() {
        const text = inputEl.value.trim();
        if (!text) return;

        addMessage(text, "user");
        inputEl.value = "";
        showTyping();

        setTimeout(() => {
            removeTyping();
            const reply = getBotReply(text);
            addMessage(reply, "bot");
        }, 700);
    }

    toggle.addEventListener("click", () => {
        windowEl.classList.toggle("show");
        if (windowEl.classList.contains("show")) {
            inputEl.focus();
        }
    });

    closeBtn.addEventListener("click", () => {
        windowEl.classList.remove("show");
    });

    sendBtn.addEventListener("click", sendMessage);

    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });
})();