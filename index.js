document.addEventListener('DOMContentLoaded', function () {
    let swiper;

    const allBtn = document.getElementById('allBtn');
    const homesBtn = document.getElementById('homesBtn');
    const commercialBtn = document.getElementById('commercialBtn');
    const allContent = document.getElementById('allContent');
    const homesContent = document.getElementById('homesContent');
    const commercialContent = document.getElementById('commercialContent');

    const cards = document.querySelectorAll('.card');

    // Function to show the selected section and update button states-------------------------------------
    function showSection(sectionToShow) {
        [allContent, homesContent, commercialContent].forEach(section => section.style.display = 'none');
        [allBtn, homesBtn, commercialBtn].forEach(btn => btn.classList.remove('active'));
        resetAllDesignBtn();

        sectionToShow.style.display = 'block';
        sectionToShow.scrollIntoView({ behavior: 'smooth' });
        
        if (sectionToShow === allContent) {
            allBtn.classList.add('active');
            showDefaultImage('section1');
            console.log('Active: All Button');
            showChart('systemDisconnectedChart');
            filterCards('All');
            resetSwiper();
        } else if (sectionToShow === homesContent) {
            homesBtn.classList.add('active');
            showDefaultImage('section2');
            console.log('Active: Homes Button');
            showChart('homeSystemDisconnectedChart');
            filterCards('Homes');
            resetSwiper();
        } else if (sectionToShow === commercialContent) {
            commercialBtn.classList.add('active');
            showDefaultImage('section3');
            console.log('Active: Commercial Button');
            showChart('commercialSystemDisconnectedChart');
            filterCards('Commercial');
            resetSwiper();
        }
    }

    // Function to reset all buttons images in main sections
    function resetAllDesignBtn() {
        [allContent, homesContent, commercialContent].forEach(section => {
            const buttons = section.querySelectorAll('.designBtn');
            buttons.forEach(button => button.classList.remove('active'));

            const images = section.querySelectorAll('.img-fluid');
            images.forEach(image => image.classList.remove('active'));
        });
    }

    // Function to show the default image for the current section
    function showDefaultImage(sectionClass) {
        const defaultImage = document.querySelector(`.${sectionClass} .defaultDesign`);
        if (defaultImage) {
            defaultImage.classList.add('active');
        }
    }
    
    function filterCards(category) {
        let visibleCount = 0;

        cards.forEach(card => {
            const badge = card.querySelector('.badge');
            if (badge) {
                const badgeText = badge.textContent.trim();
                if (category === 'All' || badgeText === category) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            }
        });

        if (swiper) {
            swiper.update();
        }

        // Hide or show navigation buttons based on the visible count
        const nextButton = document.querySelector(".swiper-button-next");
        const prevButton = document.querySelector(".swiper-button-prev");
        if (visibleCount <= 3) {
            nextButton.style.display = 'none';
            prevButton.style.display = 'none';
        } else {
            nextButton.style.display = '';
            prevButton.style.display = '';
        }
    }

    allBtn.addEventListener('click', () => showSection(allContent));
    homesBtn.addEventListener('click', () => showSection(homesContent));
    commercialBtn.addEventListener('click', () => showSection(commercialContent));

    // showSection(allContent);
    filterCards('All');
    initSwiper();

    


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

    document.querySelectorAll('h3[data-number]').forEach(numElement => {
        observer.observe(numElement);
    });



    // variables in SOLAR 101 SECTION-------------------------------------
    function initSwiper() {
        swiper = new Swiper(".slide-content", {
            slidesPerView: 3,
            spaceBetween: 25,
            loop: false, // Set loop to false for filtering
            centerSlide: true,
            fade: true,
            grabCursor: true,
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
    }

    function resetSwiper() {
        if (swiper) {
            swiper.slideTo(0); // Reset the Swiper to the first slide
            swiper.update(); // Update the Swiper to refresh its state
        }
    }




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
                image.style.opacity = 0;
                image.style.transition = 'opacity 1s';
            
                image.classList.add('active');
            
                setTimeout(() => {
                    image.style.opacity = 1;
                }, 10);
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

                        // Fade out all images except the target one
                const allImages = document.querySelectorAll(`.${section} .img-fluid`);
                allImages.forEach(img => {
                    img.style.transition = 'opacity 0.8s linear'; // Ensure smooth transition
                    img.style.opacity = '0'; // Fade out
                });
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
                            defaultImage.classList.add('active');
                            
                            defaultImage.style.transition = 'opacity 1s'; // Ensure smooth transition
                            defaultImage.style.opacity = '1'; // Reset opacity to fully visible
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
    
    // document.querySelector('.navbar-toggler').addEventListener('click', function() {
    //     document.getElementById('sideNavbar').classList.toggle('show');
    // });
    


    // navigation bar-------------------------------------
    const mainNav = document.getElementById('mainNav');
    const productsNav = document.getElementById('productsNav');
    const productsDisplay = document.getElementById('productsDisplay');
    const navLinks = mainNav.querySelectorAll('a');
    const resourcesNav = document.getElementById('resourcesNav');
    const resourcesDisplay = document.getElementById('resourcesDisplay');
    
    const isMobile = () => window.innerWidth <= 991; // Adjust the width as needed for your mobile breakpoint
    
    const handleProductsDisplay = (show) => {
        if (!isMobile()) {
            productsDisplay.style.display = show ? 'block' : 'none';
        } else {
            productsDisplay.style.display = 'none'; // Ensure it's hidden on mobile
        }
    };
    
    const handleResourcesDisplay = (show) => {
        if (!isMobile()) {
            resourcesDisplay.style.display = show ? 'block' : 'none';
        } else {
            resourcesDisplay.style.display = 'none'; // Ensure it's hidden on mobile
        }
    };
    
    productsNav.addEventListener('mouseover', () => handleProductsDisplay(true));
    navLinks.forEach(link => {
        if (link !== productsNav) {
            link.addEventListener('mouseover', () => handleProductsDisplay(false));
        }
    });
    productsDisplay.addEventListener('mouseover', () => handleProductsDisplay(true));
    productsDisplay.addEventListener('mouseout', () => handleProductsDisplay(false));
    
    resourcesNav.addEventListener('mouseover', () => handleResourcesDisplay(true));
    navLinks.forEach(link => {
        if (link !== resourcesNav) { 
            link.addEventListener('mouseover', () => handleResourcesDisplay(false));
        }
    });
    resourcesDisplay.addEventListener('mouseover', () => handleResourcesDisplay(true));
    resourcesDisplay.addEventListener('mouseout', () => handleResourcesDisplay(false));
    
    // Optional: Add a resize event listener to hide displays on window resize
    window.addEventListener('resize', () => {
        handleProductsDisplay(false);
        handleResourcesDisplay(false);
    });
    

    //sidenavbar-------------------------------------
    const navbarToggler = document.querySelector('.navbar-toggler');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay'); // Reference to the overlay
    
    navbarToggler.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active'); // Toggle overlay visibility
    
        // Disable scrolling when sidebar is active
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden'; // Disable scroll
        } else {
            document.body.style.overflow = ''; // Enable scroll
        }
    });
    
    // Optional: Close sidebar when clicking on the overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Enable scroll
    });
    
    
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(event) {
            const dropdownMenu = this.nextElementSibling;
    
            // Toggle the current dropdown
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            } else {
                // Close any open dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.style.display = 'none';
                });
                dropdownMenu.style.display = 'block';
            }
    
            // Prevent default anchor behavior
            event.preventDefault();
        });
    });
    

});
