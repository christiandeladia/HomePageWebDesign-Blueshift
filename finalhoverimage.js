let autoChangeInterval; // Variable to hold the interval for automatic changes
    let isHovering = false; // Flag to track hover state

    // Function to hide all images
    function hideAllImages() {
        const images = document.querySelectorAll('.img-fluid');
        images.forEach(image => {
            image.classList.remove('active');
        });
    }

    // Function to deactivate all buttons
    function deactivateAllButtons() {
        const buttons = document.querySelectorAll('.designBtn');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
    }

    // Function to show selected image and activate the corresponding button
    function showImage(imageId) {
        hideAllImages();
        deactivateAllButtons();
        const image = document.getElementById(imageId);
        image.classList.add('active');

        // Find the button corresponding to the image and activate it
        const activeButton = document.querySelector(`.designBtn[data-target="${imageId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    // Image order excluding 'defaultDesign'
    let imageIndex = 0;
    const imageOrder = ['homes', 'offices', 'hospitality', 'manufacturer']; // Exclude 'defaultDesign'

    // Function to handle automatic image change
    function changeImageAutomatically() {
        if (!isHovering) { 
            imageIndex = (imageIndex + 1) % imageOrder.length;
            showImage(imageOrder[imageIndex]);
        }
    }

    // Function to check if the screen width is below or equal to 991px
    function isMobile() {
        return window.innerWidth <= 991;
    }

    // Function to set up event listeners for buttons based on screen size
    function setupButtonEventListeners() {
        const buttons = document.querySelectorAll('.designBtn');

        // Remove any previous event listeners by cloning the nodes (optional but safer)
        if (isMobile()) {
            buttons.forEach(button => {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
            });
        }

        buttons.forEach(button => {
            const targetImage = button.getAttribute('data-target');

            // Mobile behavior: handle click events
            if (isMobile()) {
                button.addEventListener('click', () => {
                    showImage(targetImage);
                });
            } else {
                // Desktop behavior: handle hover events
                button.addEventListener('mouseenter', () => {
                    isHovering = true;
                    clearInterval(autoChangeInterval);
                    showImage(targetImage);
                });

                button.addEventListener('mouseleave', () => {
                    isHovering = false;
                    clearInterval(autoChangeInterval);
                    autoChangeInterval = setInterval(changeImageAutomatically, 5000);
                    showImage('defaultDesign');
                });
            }
        });
    }

    // Initial setup of event listeners
    setupButtonEventListeners();

    // Listen for window resize events to dynamically update button behavior
    window.addEventListener('resize', () => {
        setupButtonEventListeners();
    });

    // Set automatic image change every 5 seconds
    autoChangeInterval = setInterval(changeImageAutomatically, 5000);

    // Initially display the 'defaultDesign' and start with the first image right after
    window.onload = function() {
        document.getElementById('defaultDesign').classList.add('active'); // Show 'defaultDesign' initially
        setTimeout(() => {
            showImage('homes'); // Show 'homes' after 1 second
        }, 1000);
    };
