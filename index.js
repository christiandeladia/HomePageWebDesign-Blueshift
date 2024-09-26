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
    function setupAllSectionImageHover() {
        const images = document.querySelectorAll('#defaultDesign, #homes, #offices, #hospitality, #manufacturer');
        document.querySelectorAll('#designBtn').forEach(button => {
            const targetId = button.getAttribute('data-target');
            
            button.addEventListener('mouseenter', () => {
                images.forEach(img => img.classList.toggle('active', img.id === targetId));
            });
            
            button.addEventListener('mouseleave', () => {
                images.forEach(img => img.classList.toggle('active', img.id === 'defaultDesign'));
            });
        });
    }
    setupAllSectionImageHover();
    


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




});
