document.addEventListener('DOMContentLoaded', function () {

    const allBtn = document.getElementById('allBtn');
    const homesBtn = document.getElementById('homesBtn');
    const commercialBtn = document.getElementById('commercialBtn');
    const toolbarAllBtn = document.getElementById('toolbar-allBtn');
    const toolbarHomesBtn = document.getElementById('toolbar-homesBtn');
    const toolbarCommercialBtn = document.getElementById('toolbar-commercialBtn');
    
    const allContent = document.getElementById('allContent');
    const homesContent = document.getElementById('homesContent');
    const commercialContent = document.getElementById('commercialContent');


    // Function to show the selected section and update button states-------------------------------------
    function showSection(sectionToShow) {
        [allContent, homesContent, commercialContent].forEach(section => section.style.display = 'none');
        [allBtn, homesBtn, commercialBtn, toolbarAllBtn, toolbarHomesBtn, toolbarCommercialBtn].forEach(btn => btn.classList.remove('active'));
        resetAllDesignBtn();

        sectionToShow.style.display = 'block';
        sectionToShow.scrollIntoView({ behavior: 'smooth' });

        if (sectionToShow === allContent) {
            allBtn.classList.add('active');
            toolbarAllBtn.classList.add('active');
            showDefaultImage('section1');
            console.log('Active: All Button');
            showChart('systemDisconnectedChart');
            // resetSwiper();
        } else if (sectionToShow === homesContent) {
            homesBtn.classList.add('active');
            toolbarHomesBtn.classList.add('active');
            showDefaultImage('section2');
            console.log('Active: Homes Button');
            showChart('homeSystemDisconnectedChart');
            // resetSwiper();
        } else if (sectionToShow === commercialContent) {
            commercialBtn.classList.add('active');
            toolbarCommercialBtn.classList.add('active');
            showDefaultImage('section3');
            console.log('Active: Commercial Button');
            showChart('commercialSystemDisconnectedChart');
            // resetSwiper();
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
    

    function initializeCardFilter() {
        const filterButtons = document.querySelectorAll(".filter-btn");
        const cards = document.querySelectorAll(".solarArticlesCard");
    
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                const category = button.getAttribute("data-category");
    
                let visibleCardCount = 0;
                cards.forEach(card => {
                    const badge = card.querySelector(".badge").textContent.trim();
    
                    if (category === "All" || badge === category) {
                        card.parentElement.style.display = "block";
                        visibleCardCount++;
                    } else {
                        card.parentElement.style.display = "none";
                    }
                });
    
                toggleFilterButtons(visibleCardCount);
            });
        });
    }

    function toggleFilterButtons(visibleCardCount) {
        const solar101LeftBtn = document.getElementById("solar101LeftBtn");
        const solar101RightBtn = document.getElementById("solar101RightBtn");
    
        if (visibleCardCount <= 3) {
            solar101LeftBtn.style.display = "none";
            solar101RightBtn.style.display = "none";
        } else {
            // solar101LeftBtn.style.display = "block";
            solar101RightBtn.style.display = "block";
        }
    }
    initializeCardFilter()

    allBtn.addEventListener('click', () => showSection(allContent));
    homesBtn.addEventListener('click', () => showSection(homesContent));
    commercialBtn.addEventListener('click', () => showSection(commercialContent));

    toolbarAllBtn.addEventListener('click', () => showSection(allContent));
    toolbarHomesBtn.addEventListener('click', () => showSection(homesContent));
    toolbarCommercialBtn.addEventListener('click', () => showSection(commercialContent));

    // showSection(allContent);

    
    //SOLAR 101 Section-------------------------------------
    var solarNextBtn = document.getElementById('solar101RightBtn');
    var solarPrevBtn = document.getElementById('solar101LeftBtn');
    var solarRowContainer = document.getElementById('solar101Row');
    var solarDivCard = $('#solar101DivCard'); // jQuery selector

    $(solarPrevBtn).hide();

    if (!('ontouchstart' in window)) {
        $(solarNextBtn).show();
        // $(solarPrevBtn).show();
    }

    // Listen for click events on the right button
    solarNextBtn.addEventListener('click', function () {
        // Calculate the new scroll position
        var newScrollPosition = solarRowContainer.scrollLeft + solarDivCard.width(); // Adjust to the div card width

        if (newScrollPosition + solarRowContainer.offsetWidth >= solarRowContainer.scrollWidth) {
        // If we're at the end, hide the right arrow
        $(solarNextBtn).hide();
        }

        // Animate the scroll position
        $(solarRowContainer).animate({ scrollLeft: newScrollPosition }, 500, function () {
        // Show the left arrow in case it was hidden
        $(solarPrevBtn).show();
        });
    });

    // Listen for click events on the left button
    solarPrevBtn.addEventListener('click', function () {
        // Calculate the new scroll position
        var newScrollPosition = solarRowContainer.scrollLeft - solarDivCard.width(); // Adjust to the div card width

        console.log(solarRowContainer.scrollLeft - solarDivCard.width())

        if (solarRowContainer.scrollLeft - solarDivCard.width() <= 0) {
        // If we're at the start, hide the left arrow
        $(solarPrevBtn).hide();
        }

        // Animate the scroll position
        $(solarRowContainer).animate({ scrollLeft: newScrollPosition }, 500, function () {
        // After the animation completes, check the scroll position
        // Show the right arrow in case it was hidden
        $(solarNextBtn).show();
        });
    });



    function setupSection(sectionClass, imageOrder) {
        let autoChangeInterval;
        let isHovering = false;
        let imageIndex = 0;
        let currentImage = null;
    
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
                        currentImage = targetImage;
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
                        const defaultImage = document.querySelector(`.${section} #${currentImage}`);
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
    

    // Navbar-------------------------------------
    const overlayBgIndex = document.getElementById('overlayBgIndex');
    const mainNav = document.getElementById('mainNav');
    const productsNav = document.getElementById('productsNav');
    const productsDisplay = document.getElementById('productsDisplay');
    const navLinks = mainNav.querySelectorAll('a');
    const resourcesNav = document.getElementById('resourcesNav');
    const resourcesDisplay = document.getElementById('resourcesDisplay');
    
    const isMobile = () => window.innerWidth <= 991;
    
    const showOverlay = (show) => {
        overlayBgIndex.style.display = show ? 'block' : 'none';
    };
    
    const handleProductsDisplay = (show) => {
        if (!isMobile()) {
            productsDisplay.style.display = show ? 'block' : 'none';
            showOverlay(show || resourcesDisplay.style.display === 'block');
        } else {
            // On mobile, show the overlay if the sidebar is active
            productsDisplay.style.display = 'none';
            showOverlay(sidebar.classList.contains('active'));
        }
    };
    
    const handleResourcesDisplay = (show) => {
        if (!isMobile()) {
            resourcesDisplay.style.display = show ? 'block' : 'none';
            showOverlay(show || productsDisplay.style.display === 'block');
        } else {
            resourcesDisplay.style.display = 'none';
            showOverlay(sidebar.classList.contains('active'));
        }
    };
    
    // Add event listeners
    productsNav.addEventListener('mouseover', () => handleProductsDisplay(true));
    productsDisplay.addEventListener('mouseover', () => handleProductsDisplay(true));
    productsDisplay.addEventListener('mouseout', () => handleProductsDisplay(false));
    
    resourcesNav.addEventListener('mouseover', () => handleResourcesDisplay(true));
    resourcesDisplay.addEventListener('mouseover', () => handleResourcesDisplay(true));
    resourcesDisplay.addEventListener('mouseout', () => handleResourcesDisplay(false));
    
    // Close when hovering over other links
    navLinks.forEach(link => {
        if (link !== productsNav) {
            link.addEventListener('mouseover', () => handleProductsDisplay(false));
        }
    });
    navLinks.forEach(link => {
        if (link !== resourcesNav) {
            link.addEventListener('mouseover', () => handleResourcesDisplay(false));
        }
    });
    
    // Optional: Add a resize event listener to hide displays on window resize
    window.addEventListener('resize', () => {
        handleProductsDisplay(false);
        handleResourcesDisplay(false);
    });
    
    // Sidebar-------------------------------------
    const navbarToggler = document.querySelector('.navbar-toggler');
    const sidebar = document.getElementById('sidebar');
    
    navbarToggler.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        overlayBgIndex.classList.toggle('active');
    
        // Disable scrolling when sidebar is active
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            showOverlay(true);
        } else {
            document.body.style.overflow = '';
            showOverlay(false);
        }
    });
    
    // Optional: Close sidebar when clicking on the overlay
    overlayBgIndex.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlayBgIndex.classList.remove('active');
        document.body.style.overflow = '';
        showOverlay(false);

        // Close dropdowns
        productsDisplay.style.display = 'none';
        resourcesDisplay.style.display = 'none';

        // Reset any open sidebar dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });

    });
    
    // Sidebar dropdown functionality
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
    
            event.preventDefault();
        });
    });
    

    // OUR PRODUCTS SECTION------------------------------------- 
    var copy = document.querySelector(".logos-slide").cloneNode(true);
    document.querySelector(".logo-slider").appendChild(copy);




    
    // Function to manage custom navbar visibility based on modal state and scroll position
    var designModals = document.querySelectorAll('.modal');
    const toolbar = document.getElementById('customizedClientToolBar');
    const navbar = document.getElementById('customizedClientNavBar');

    // Function to setup customized navbar display
    function setupCustomizedNavbar() {
        const toolbarPosition = toolbar.getBoundingClientRect().bottom + window.scrollY;
        const buffer = 25; // Adjust this value to your needs

        // If we've scrolled past the toolbar plus the buffer, show the navbar
        if (window.scrollY > toolbarPosition + buffer) {
            navbar.classList.add('show');
        } 
        // If we've scrolled up past the toolbar minus the buffer, hide the navbar
        else if (window.scrollY < toolbarPosition - buffer) {
            navbar.classList.remove('show');
        }
    }

    // Add event listeners for modals
    designModals.forEach(function(modal) {
        modal.addEventListener('show.bs.modal', function () {
            navbar.classList.remove('show'); // Hide the navbar when a modal is shown
        });

        modal.addEventListener('hide.bs.modal', function () {
            navbar.classList.add('show'); // Show the navbar when a modal is hidden
            setupCustomizedNavbar(); // Re-evaluate navbar visibility based on scroll position
        });
    });

    // Set up scroll event listener
    window.onscroll = function () {
        setupCustomizedNavbar();
    };




    
});



    // Modal Timeline Section
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Intersection Observer options
    const options = {
        root: null, // Use viewport as root
        threshold: 0.20, // Trigger when 75% of the element is visible
        rootMargin: '0px 0px -30% 0px' // Trigger when the element reaches slightly above the center
    };

    // Function to handle intersection
    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the highlighted class when the element reaches the desired viewport position
                entry.target.classList.add('highlighted');
            } else {
                // Remove the highlighted class when the element leaves the viewport position
                entry.target.classList.remove('highlighted');
            }
        });
    }

    // Create Intersection Observer
    const observer = new IntersectionObserver(handleIntersection, options);
    // Observe each timeline item
    timelineItems.forEach(item => observer.observe(item));
