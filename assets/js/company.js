
     //Customer Reivew Section-------------------------------------
     var scrollRightBtn = document.getElementById('customerReviewRightBtn');
     var scrollLeftBtn = document.getElementById('customerReviewLeftBtn');
     var rowContainer = document.getElementById('customerReviewRow');
     var divCard = $('#customerReviewDivCard'); // jQuery selector
 
    $(scrollLeftBtn).hide();

     if (!('ontouchstart' in window)) {
         $(scrollRightBtn).show();
        //  $(scrollLeftBtn).show();
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

     // Select all timeline items
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
