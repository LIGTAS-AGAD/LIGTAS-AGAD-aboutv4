document.addEventListener('DOMContentLoaded', function() {
            
            // --- Interactive Gallery & AUTOPLAY Logic ---
            const galleryWrapper = document.getElementById("gallery-wrapper");
            const mainImg = document.getElementById("main-img");
            const mainTitle = document.getElementById("main-title");
            const mainDesc = document.getElementById("main-desc");
            const thumbs = document.querySelectorAll(".thumb");
            const thumbContainer = document.getElementById("thumbnail-container");
            const slideLeft = document.getElementById("slide-left");
            const slideRight = document.getElementById("slide-right");
            
            // Overlay controls on the main image
            const overlayPrev = document.getElementById("overlay-prev");
            const overlayNext = document.getElementById("overlay-next");
            
            // Toggle Logic
            const autoplayToggle = document.getElementById("autoplay-toggle");
            const autoplayStatus = document.getElementById("autoplay-status");
            
            // Fullscreen Logic
            const fullscreenBtn = document.getElementById("fullscreen-btn");
            
            let currentIndex = 0;
            const thumbsArray = Array.from(thumbs);
            let autoplayInterval;
            let isPlaying = autoplayToggle.checked;

            // Function to update the main image and active thumbnail
            function updateGallery(index) {
                document.querySelector(".thumb.active").classList.remove("active");
                thumbsArray[index].classList.add("active");

                mainImg.style.opacity = 0;
                setTimeout(() => {
                    mainImg.src = thumbsArray[index].src;
                    mainTitle.textContent = thumbsArray[index].getAttribute("data-title");
                    mainDesc.textContent = thumbsArray[index].getAttribute("data-desc");
                    mainImg.style.opacity = 1;
                }, 150);

                // Safely scroll thumbnail container without causing the whole page to jump
                const thumb = thumbsArray[index];
                const scrollTarget = thumb.offsetLeft - (thumbContainer.clientWidth / 2) + (thumb.clientWidth / 2);
                
                thumbContainer.scrollTo({
                    left: scrollTarget,
                    behavior: 'smooth'
                });
            }

            // Functions to advance/rewind the main image
            function nextImage() {
                currentIndex = (currentIndex + 1) % thumbsArray.length;
                updateGallery(currentIndex);
            }
            
            function prevImage() {
                currentIndex = (currentIndex - 1 + thumbsArray.length) % thumbsArray.length;
                updateGallery(currentIndex);
            }

            // Link overlay arrows to navigation
            overlayPrev.addEventListener("click", function(e) {
                e.stopPropagation(); // Avoid triggering the zoom lightbox
                prevImage();
                resetAutoplay();
            });

            overlayNext.addEventListener("click", function(e) {
                e.stopPropagation(); // Avoid triggering the zoom lightbox
                nextImage();
                resetAutoplay();
            });

            // Start Autoplay
            function startAutoplay() {
                if (isPlaying) {
                    autoplayInterval = setInterval(nextImage, 4000); // 4 seconds
                }
            }

            // Reset Autoplay (called when user interacts if it's currently playing)
            function resetAutoplay() {
                if (isPlaying) {
                    clearInterval(autoplayInterval);
                    startAutoplay();
                }
            }

            // Autoplay Enable/Disable Toggle Listener
            autoplayToggle.addEventListener("change", function() {
                isPlaying = this.checked;
                if (isPlaying) {
                    autoplayStatus.textContent = "Autoplay: ON";
                    nextImage(); // Optional: Skip to next instantly to show it turned on
                    startAutoplay();
                } else {
                    autoplayStatus.textContent = "Autoplay: OFF";
                    clearInterval(autoplayInterval);
                }
            });

            // Native Browser Full Screen Activation
            fullscreenBtn.addEventListener("click", function(e) {
                e.stopPropagation(); // Prevents the zoom modal from triggering underneath
                if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                    if (galleryWrapper.requestFullscreen) {
                        galleryWrapper.requestFullscreen();
                    } else if (galleryWrapper.webkitRequestFullscreen) { /* Safari fallback */
                        galleryWrapper.webkitRequestFullscreen();
                    } else if (galleryWrapper.msRequestFullscreen) { /* IE11 fallback */
                        galleryWrapper.msRequestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            });

            // Manual Thumbnail Click
            thumbsArray.forEach((thumb, index) => {
                thumb.addEventListener("click", function() {
                    currentIndex = index;
                    updateGallery(currentIndex);
                    resetAutoplay(); // Reset timer on manual click if playing
                });
            });

            // Arrow Scrolling for Thumbnails
            const scrollAmount = 300; 
            slideLeft.addEventListener("click", () => {
                thumbContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
                resetAutoplay();
            });
            slideRight.addEventListener("click", () => {
                thumbContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
                resetAutoplay();
            });

            // Initialize Autoplay on Load
            startAutoplay();


            // --- Lightbox/Zoom Functionality (Gallery AND Static Photos) ---
            const modal = document.getElementById("imageModal");
            const zoomedImg = document.getElementById("zoomedImage");
            const closeBtn = document.querySelector(".close-modal");
            const staticPhotos = document.querySelectorAll(".static-photo");

            // Event listener for the Main Gallery Image
            mainImg.addEventListener("click", function() {
                // If we are already in full screen gallery mode, don't trigger the modal overlay
                if (document.fullscreenElement || document.webkitFullscreenElement) return;

                modal.style.display = "block";
                zoomedImg.src = this.src;
                clearInterval(autoplayInterval); // Pause autoplay while zoomed in
            });

            // Event listener for the Static Team/Partner Photos
            staticPhotos.forEach(photo => {
                photo.addEventListener("click", function() {
                    modal.style.display = "block";
                    zoomedImg.src = this.src;
                    clearInterval(autoplayInterval); // Pause autoplay to avoid distraction behind modal
                });
            });

            // Close Modal Logic
            closeBtn.addEventListener("click", function() {
                modal.style.display = "none";
                if (isPlaying) startAutoplay(); // Resume autoplay when closed if it was toggled ON
            });

            // Close Modal when clicking outside the image
            modal.addEventListener("click", function(event) {
                if (event.target !== zoomedImg) {
                    modal.style.display = "none";
                    if (isPlaying) startAutoplay(); // Resume autoplay when closed if it was toggled ON
                }
            });

            // --- Accordion Functionality ---
            const accordions = document.querySelectorAll(".accordion");
            accordions.forEach(acc => {
                acc.addEventListener("click", function() {
                    this.classList.toggle("active");
                    const panel = this.nextElementSibling;
                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                });
            });

        });