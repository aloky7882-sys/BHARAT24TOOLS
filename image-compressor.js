/**
 * Bharat24Tools — Advanced Image Compressor (standalone)
 * Auto cleanup + 20MB limit + multiple file support
 */
(function () {
    const MAX_SIZE = 20 * 1024 * 1024;
    const activeUrls = new Set();

    function trackUrl(url) { activeUrls.add(url); return url; }
    function revokeUrl(url) { if (url && activeUrls.has(url)) { try { URL.revokeObjectURL(url); } catch(e){} activeUrls.delete(url); } }
    function revokeAllUrls() { activeUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch(e){} }); activeUrls.clear(); }

    window.addEventListener('beforeunload', revokeAllUrls);
    window.addEventListener('pagehide', revokeAllUrls);

    document.addEventListener('DOMContentLoaded', function () {
        const dropArea = document.getElementById("drop-area");
        const fileInput = document.getElementById("fileElem");
        const selectBtn = document.getElementById("selectBtn");
        const previewArea = document.getElementById("previewArea");
        const status = document.getElementById("status");

        if (!dropArea || !fileInput || !previewArea) return;

        if (selectBtn) {
            selectBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                fileInput.click();
            });
        }

        fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

        dropArea.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropArea.classList.add("dragover");
        });
        dropArea.addEventListener("dragleave", () => dropArea.classList.remove("dragover"));
        dropArea.addEventListener("drop", (e) => {
            e.preventDefault();
            dropArea.classList.remove("dragover");
            handleFiles(e.dataTransfer.files);
        });

        async function handleFiles(files) {
            revokeAllUrls();
            previewArea.innerHTML = "";

            const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));

            if (imageFiles.length === 0) {
                status.innerText = "❌ Please select at least one image file.";
                status.style.color = "#dc3545";
                return;
            }

            const tooBig = imageFiles.filter(f => f.size > MAX_SIZE);
            if (tooBig.length > 0) {
                status.innerText = `❌ ${tooBig.length} file(s) exceed 20MB limit.`;
                status.style.color = "#dc3545";
                return;
            }

            status.innerText = "Compressing " + imageFiles.length + " image(s)...";
            status.style.color = "#0d6efd";

            for (const file of imageFiles) {
                const options = {
                    maxSizeMB: 0.8,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                };

                try {
                    if (typeof imageCompression === "undefined") {
                        status.innerText = "❌ Compression library not loaded.";
                        status.style.color = "#dc3545";
                        return;
                    }

                    const compressedFile = await imageCompression(file, options);

                    const originalURL = trackUrl(URL.createObjectURL(file));
                    const compressedURL = trackUrl(URL.createObjectURL(compressedFile));

                    const card = document.createElement("div");
                    card.className = "preview-card";

                    card.innerHTML = `
                        <img src="${originalURL}" alt="Preview">
                        <div class="info">
                            <p><b>Original:</b> ${(file.size/1024).toFixed(1)} KB</p>
                            <p><b>Compressed:</b> ${(compressedFile.size/1024).toFixed(1)} KB</p>
                            <p><b>Saved:</b> ${Math.max(0, (100-(compressedFile.size/file.size*100))).toFixed(0)}%</p>
                        </div>
                        <button class="download-btn">Download</button>
                    `;

                    card.querySelector(".download-btn").onclick = () => {
                        const a = document.createElement("a");
                        a.href = compressedURL;
                        a.download = "compressed-" + file.name;
                        a.click();
                    };

                    previewArea.appendChild(card);
                } catch (err) {
                    console.error(err);
                    status.innerText = "❌ Something went wrong compressing " + file.name;
                    status.style.color = "#dc3545";
                }
            }

            if (previewArea.children.length > 0) {
                status.innerText = "🎉 Done! " + previewArea.children.length + " image(s) compressed.";
                status.style.color = "#198754";
            }
        }
    });
})();