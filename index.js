document.addEventListener('DOMContentLoaded', function () {
    const allBtn = document.getElementById('allBtn');
    const homesBtn = document.getElementById('homesBtn');
    const commercialBtn = document.getElementById('commercialBtn');
    const allContent = document.getElementById('allContent');
    const homesContent = document.getElementById('homesContent');
    const commercialContent = document.getElementById('commercialContent');

    // Function to show the selected section and update button states-------------------------------------
    function showSection(sectionToShow) {
        [allContent, homesContent, commercialContent].forEach(section => section.style.display = 'none');
        [allBtn, homesBtn, commercialBtn].forEach(btn => btn.classList.remove('active'));

        sectionToShow.style.display = 'block';
        if (sectionToShow === allContent) {
            allBtn.classList.add('active');
        } else if (sectionToShow === homesContent) {
            homesBtn.classList.add('active');
        } else if (sectionToShow === commercialContent) {
            commercialBtn.classList.add('active');
        }
    }
    allBtn.addEventListener('click', () => showSection(allContent));
    homesBtn.addEventListener('click', () => showSection(homesContent));
    commercialBtn.addEventListener('click', () => showSection(commercialContent));



    


    //Customer Reivew Section-------------------------------------
    var scrollRightBtn = document.getElementById('customerReviewRightBtn');
    var scrollLeftBtn = document.getElementById('customerReviewLeftBtn');
    var rowContainer = document.getElementById('customerReviewRow');
    var divCard = $('#customerReviewDivCard'); // jQuery selector

    if (!('ontouchstart' in window)) {
        $(scrollRightBtn).show();
        $(scrollLeftBtn).show();
    }

    // Listen for click events on the right button
    scrollRightBtn.addEventListener('click', function () {
        // Calculate the new scroll position
        var newScrollPosition = rowContainer.scrollLeft + divCard.width(); // Adjust to the div card width

        if (newScrollPosition + rowContainer.offsetWidth >= rowContainer.scrollWidth) {
        // If we're at the end, hide the right arrow
        $(scrollRightBtn).hide();
        }

        // Animate the scroll position
        $(rowContainer).animate({ scrollLeft: newScrollPosition }, 500, function () {
        // Show the left arrow in case it was hidden
        $(scrollLeftBtn).show();
        });
    });

    // Listen for click events on the left button
    scrollLeftBtn.addEventListener('click', function () {
        // Calculate the new scroll position
        var newScrollPosition = rowContainer.scrollLeft - divCard.width(); // Adjust to the div card width

        console.log(rowContainer.scrollLeft - divCard.width())

        if (rowContainer.scrollLeft - divCard.width() <= 0) {
        // If we're at the start, hide the left arrow
        $(scrollLeftBtn).hide();
        }

        // Animate the scroll position
        $(rowContainer).animate({ scrollLeft: newScrollPosition }, 500, function () {
        // After the animation completes, check the scroll position
        // Show the right arrow in case it was hidden
        $(scrollRightBtn).show();
        });
    });



    // Function to change image when hover in ALL SECTION-------------------------------------
    // function setupAllSectionImageHover() {
    //     const images = document.querySelectorAll('#defaultDesign, #homes, #offices, #hospitality, #manufacturer');
    //     document.querySelectorAll('#designBtn').forEach(button => {
    //         const targetId = button.getAttribute('data-target');
            
    //         button.addEventListener('mouseenter', () => {
    //             images.forEach(img => img.classList.toggle('active', img.id === targetId));
    //         });
            
    //         button.addEventListener('mouseleave', () => {
    //             images.forEach(img => img.classList.toggle('active', img.id === 'defaultDesign'));
    //         });
    //     });
    // }
    // setupAllSectionImageHover();
    


    // Function to animate numbers with Peso sign BLUESHIFT BY THE NUMBERS SECTION-------------------------------------
    function animateValue(element, start, end, duration, prefix = '') {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerText = prefix + Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.innerText = prefix + end.toLocaleString() + '+'; // Add the '+' sign after animation ends
            }
        };
        window.requestAnimationFrame(step);
    }

    // Intersection Observer to trigger the number animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const endValue = parseInt(element.getAttribute('data-number'), 10);
                const startValue = 0;
                const prefix = element.hasAttribute('data-prefix') ? element.getAttribute('data-prefix') : ''; // Check if a prefix is set
                animateValue(element, startValue, endValue, 2000, prefix);
                observer.unobserve(element); // Stop observing once the animation starts
            }
        });
    }, { threshold: 1 });

    // Select all elements with numbers to animate
    document.querySelectorAll('h3[data-number]').forEach(numElement => {
        observer.observe(numElement);
    });



    // variables in SOLAR 101 SECTION-------------------------------------
    var swiper = new Swiper(".slide-content", {
        slidesPerView: 3,
        spaceBetween: 25,
        loop: true,
        centerSlide: 'true',
        fade: 'true',
        grabCursor: 'true',
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },

        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            520: {
                slidesPerView: 2,
            },
            950: {
                slidesPerView: 3,
            },
        },
    });





    function setupSection(sectionClass, imageOrder) {
        let autoChangeInterval;
        let isHovering = false;
        let imageIndex = 0;
    
        function hideAllImages(section) {
            const images = document.querySelectorAll(`.${section} .img-fluid`);
            images.forEach(image => {
                image.classList.remove('active');
            });
        }
    
        function deactivateAllButtons(section) {
            const buttons = document.querySelectorAll(`.${section} .designBtn`);
            buttons.forEach(button => {
                button.classList.remove('active');
            });
        }
    
        function showImage(section, imageId) {
            hideAllImages(section);
            deactivateAllButtons(section);
            const image = document.getElementById(imageId);
            if (image) {
                image.classList.add('active');
            }
    
            const activeButton = document.querySelector(`.${section} .designBtn[data-target="${imageId}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    
        function changeImageAutomatically(section) {
            if (!isHovering) { 
                imageIndex = (imageIndex + 1) % imageOrder.length;
                showImage(section, imageOrder[imageIndex]);
            }
        }
    
        function isMobile() {
            return window.innerWidth <= 991;
        }
    
        function setupButtonEventListeners(section) {
            const buttons = document.querySelectorAll(`.${section} .designBtn`);
    
            if (isMobile()) {
                buttons.forEach(button => {
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                });
            }
    
            buttons.forEach(button => {
                const targetImage = button.getAttribute('data-target');
    
                if (isMobile()) {
                    button.addEventListener('click', () => {
                        showImage(section, targetImage);
                    });
                } else {
                    button.addEventListener('mouseenter', () => {
                        isHovering = true;
                        clearInterval(autoChangeInterval);
                        showImage(section, targetImage);
                    });
    
                    button.addEventListener('mouseleave', () => {
                        isHovering = false;
                        clearInterval(autoChangeInterval);
                        autoChangeInterval = setInterval(() => changeImageAutomatically(section), 5000);
                        
                        // Show the default design image
                        const defaultImage = document.querySelector(`.${section} .defaultDesign`);
                        if (defaultImage) {
                            hideAllImages(section); // Hide all other images first
                            defaultImage.classList.add('active'); // Show the default design
                        }
                        deactivateAllButtons(section);
    
                        console.log(section, 'defaultDesign');
                    });
                }
            });
        }
    
        setupButtonEventListeners(sectionClass);
    
        window.addEventListener('resize', () => {
            setupButtonEventListeners(sectionClass);
        });
    
        autoChangeInterval = setInterval(() => changeImageAutomatically(sectionClass), 5000);
        
        // Initialize the default design image
        const defaultImage = document.querySelector(`.${sectionClass} .defaultDesign`);
        if (defaultImage) {
            defaultImage.classList.add('active');
            setTimeout(() => {
                showImage(sectionClass, imageOrder[0]);
            }, 1000);
        }
    }
    
    // Initialize for each section with their specific image order
    setupSection('section3', ['homes3', 'offices3', 'hospitality3', 'manufacturer3', 'manufacturer33']);
    setupSection('section2', ['homes2', 'offices2']);
    setupSection('section1', ['homes', 'offices', 'hospitality', 'manufacturer']);
    



    
});
