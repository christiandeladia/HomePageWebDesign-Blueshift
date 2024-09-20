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



    function updateConversation(conversationId, buttonId, canvasId) {
        const disconnectedText = document.getElementById('disconnectedText');
    
        // Helper function to hide all elements from a NodeList
        const hideElements = (elements) => elements.forEach(el => el.style.display = 'none');
    
        // Hide all conversations
        hideElements(document.querySelectorAll('.conversation'));
    
        // Show the selected conversation
        const conversationToShow = document.getElementById(conversationId);
        conversationToShow.style.display = 'block';
    
        // Hide all canvases and reset filter
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            canvas.style.display = 'none';
            canvas.style.filter = 'none';
        });
    
        // Always hide the disconnected text when switching
        disconnectedText.style.display = 'none';
    
        // Show the selected canvas if provided
        if (canvasId) {
            const canvasElement = document.getElementById(canvasId);
            canvasElement.style.display = 'block';
    
            // Show disconnected text only for systemDisconnectedChart and observe visibility
            if (canvasId === 'systemDisconnectedChart') {
                observeCanvasVisibility(canvasElement, disconnectedText);
                console.log('Disconnected text displayed for button:', buttonId);
            } else {
                // Hide the disconnected text for other charts
                disconnectedText.style.display = 'none';
                console.log('Disconnected text not displayed for button:', buttonId);
            }
        }
    
        // Update button active state
        document.querySelectorAll('#AfterServiceBtnGroup .btn')
            .forEach(btn => btn.classList.remove('active'));
        document.getElementById(buttonId).classList.add('active');
    
        // Initialize or update the chart based on canvasId
        const chartActions = {
            systemDisconnectedChart: createChartDisconnected,
            systemDeratingChart: createChartDerating,
            stringPerformanceChart: createChartStringPerformance
        };
        chartActions[canvasId]?.();
    
        // Delay the display of each conversation message
        delayConversationMessages(conversationToShow);
    }
    



    // Function to add delay to the display of conversation messages-------------------------------------
    function delayConversationMessages(conversationElement) {
        const messages = conversationElement.querySelectorAll('.message');
        messages.forEach((message, index) => {
            setTimeout(() => {
                message.style.opacity = 1;
            }, index * 1500);
        });
    }

    // Function to observe canvas visibility-------------------------------------
    function observeCanvasVisibility(canvasElement, disconnectedText) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        disconnectedText.style.display = 'block';
                        canvasElement.style.filter = 'grayscale(100%)';
                    }, 2500); // 4 seconds delay after becoming visible
                    observer.unobserve(entry.target); // Stop observing once animation starts
                }
            });
        });
        observer.observe(canvasElement);
    }
    // Event listeners for buttons
    document.getElementById('disconnected').addEventListener('click', function() {
        updateConversation('conversation-disconnected', 'disconnected', 'systemDisconnectedChart');
    });
    document.getElementById('derating').addEventListener('click', function() {
        updateConversation('conversation-derating', 'derating', 'systemDeratingChart');
    });
    document.getElementById('string-performance').addEventListener('click', function() {
        updateConversation('conversation-string-performance', 'string-performance', 'stringPerformanceChart');
    });
    // Set "Disconnected" as the default conversation when the page loads
    updateConversation('conversation-disconnected', 'disconnected', 'systemDisconnectedChart');



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



    // Function to update the active image based on the button's data-target attribute-------------------------------------
    function updateImage(targetId) {
        const imageIds = ['defaultDesign', 'homes', 'offices', 'hospitality', 'manufacturer'];
        const images = imageIds.map(id => document.getElementById(id));

        images.forEach(img => {
            img.classList.toggle('active', img.id === targetId);
        });
    }

    // Function to set up hover events on buttons
    function setupImageHover() {
        const buttons = document.querySelectorAll('#designBtn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                const targetId = button.getAttribute('data-target');
                updateImage(targetId);
            });
            
            button.addEventListener('mouseleave', () => {
                updateImage('defaultDesign'); // Show default image on leave
            });
        });
    }
    setupImageHover();




});
