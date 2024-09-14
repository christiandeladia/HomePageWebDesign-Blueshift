document.addEventListener('DOMContentLoaded', function () {
    const allBtn = document.getElementById('allBtn');
    const homesBtn = document.getElementById('homesBtn');
    const commercialBtn = document.getElementById('commercialBtn');
    const allContent = document.getElementById('allContent');
    const homesContent = document.getElementById('homesContent');
    const commercialContent = document.getElementById('commercialContent');

    // Function to show the selected section and update button states
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

    // Function to handle displaying the conversation
    function updateConversation(conversationId, buttonId, canvasId) {
        // Hide all conversations
        const conversations = document.querySelectorAll('.conversation');
        conversations.forEach(function(conv) {
            conv.style.display = 'none';
        });

        // Show the selected conversation
        const conversationToShow = document.getElementById(conversationId);
        conversationToShow.style.display = 'block';

        // Hide all canvases
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(function(canvas) {
            canvas.style.display = 'none';
        });

        // Show the selected canvas
        if (canvasId) {
            document.getElementById(canvasId).style.display = 'block';
        }

        // Remove 'active' class from all buttons
        const buttons = document.querySelectorAll('#AfterServiceBtnGroup .btn');
        buttons.forEach(function(btn) {
            btn.classList.remove('active');
        });

        // Add 'active' class to the clicked button
        document.getElementById(buttonId).classList.add('active');

        // Initialize or update the chart based on canvasId
        switch (canvasId) {
            case 'systemDisconnectedChart':
                createChartDisconnected();
                break;
            case 'systemDeratingChart':
                createChartDerating();
                break;
            case 'stringPerformanceChart':
                createChartStringPerformance();
                break;
        }

        // Delay the display of each conversation message
        delayConversationMessages(conversationToShow);
    }

    // Function to add delay to the display of conversation messages
    function delayConversationMessages(conversationElement) {
        const messages = conversationElement.querySelectorAll('.message');
        messages.forEach((message, index) => {
            setTimeout(() => {
                message.style.opacity = 1;
            }, index * 1500);
        });
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
});
