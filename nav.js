
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