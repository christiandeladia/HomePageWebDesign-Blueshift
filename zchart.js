let charts = {}; // Store charts by their IDs
let timeoutId; // Variable to hold timeout ID

  // Function to create a Line Chart configuration
  function getDisconnectedChartConfig() {
    return {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'System Disconnected Data',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                data: [12, 19, 3, 5, 2, 3] // Customize data as needed
            }]
        },
        options: {}
    };
  }

  // Function to create a Bar Chart configuration
  function getDeratingChartConfig() {
    return {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'System Derating Data',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                data: [15, 25, 35, 45, 55, 65] // Customize data as needed
            }]
        },
        options: {}
    };
  }

  // Function to create a Pie Chart configuration
  function getStringPerformanceChartConfig() {
    return {
        type: 'pie',
        data: {
            labels: ['Set 1', 'Set 2', 'Set 3'],
            datasets: [{
                label: 'String Performance Data',
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)', 
                    'rgba(54, 162, 235, 0.2)', 
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)', 
                    'rgba(54, 162, 235, 1)', 
                    'rgba(255, 99, 132, 1)'
                ],
                data: [50, 30, 20] // Customize data as needed
            }]
        },
        options: {}
    };
  }
    // Function to create and manage the chart instances
    function createChart(chartId, config) {
        if (charts[chartId]) {
            charts[chartId].destroy(); // Destroy if already exists
        }
        const ctx = document.getElementById(chartId).getContext('2d');
        charts[chartId] = new Chart(ctx, config);
    }

    // Show specific chart by ID
    function showChart(chartId) {
        document.querySelectorAll('canvas').forEach(canvas => canvas.style.display = 'none');
        document.getElementById(chartId).style.display = 'block';
        console.log(`Showing chart: ${chartId}`);
    }

    // Show conversation by ID and delay message display
    function showConversation(conversationId) {
        document.querySelectorAll('.conversation').forEach(conv => {
            conv.style.display = 'none'; // Hide all conversations first
            clearMessagesOpacity(conv); // Clear the opacity of messages
        });
        const conversationElement = document.getElementById(conversationId);
        conversationElement.style.display = 'block';
        delayConversationMessages(conversationElement);
        console.log(`Showing conversation: ${conversationId}`);
    }

    // Function to clear the opacity of messages in a conversation
    function clearMessagesOpacity(conversationElement) {
        const messages = conversationElement.querySelectorAll('.message');
        messages.forEach(message => {
            message.style.opacity = 0; // Reset opacity
        });
    }

    // Function to add delay to the display of conversation messages
    function delayConversationMessages(conversationElement) {
        const messages = conversationElement.querySelectorAll('.message');
        messages.forEach((message, index) => {
            setTimeout(() => {
                message.style.opacity = 1; // Fade in message
            }, index * 1500);
        });
    }

    // Update button active state
    function updateActiveButton(buttonId) {
        document.querySelectorAll('#AfterServiceBtnGroup .btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(buttonId).classList.add('active');
    }

    // Observe canvas visibility to manage the display of disconnected text
    function observeCanvasVisibility(canvasElement, disconnectedText) {
        disconnectedText.style.display = 'none'; // Initially hide the text

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target === canvasElement) {
                    timeoutId = setTimeout(() => {
                        disconnectedText.style.display = 'flex';
                        // Uncomment the following line if you want to apply a grayscale filter
                        // canvasElement.style.filter = 'grayscale(100%)';
                    }, 3000);

                    observer.unobserve(entry.target); // Stop observing once it's visible
                }
            });
        });

        observer.observe(canvasElement); // Only observe the specified canvas
    }



    // Event Listeners for Buttons
document.getElementById('disconnected').addEventListener('click', function () {
  showChart('systemDisconnectedChart');
  showConversation('conversation-disconnected');
  createChart('systemDisconnectedChart', getDisconnectedChartConfig()); // Create chart after showing
});

document.getElementById('derating').addEventListener('click', function () {
  showChart('systemDeratingChart');
  showConversation('conversation-derating');
  createChart('systemDeratingChart', getDeratingChartConfig()); // Create chart after showing
});

document.getElementById('string-performance').addEventListener('click', function () {
  showChart('stringPerformanceChart');
  showConversation('conversation-string-performance');
  createChart('stringPerformanceChart', getStringPerformanceChartConfig()); // Create chart after showing
});

// Set default view on page load
document.addEventListener('DOMContentLoaded', () => {
  showChart('systemDisconnectedChart'); // Show default chart
  showConversation('conversation-disconnected'); // Show default conversation
  createChart('systemDisconnectedChart', getDisconnectedChartConfig()); // Create default chart
});

    // Observe canvas visibility for the disconnected text
    const canvasElement = document.getElementById('systemDisconnectedChart');
    const disconnectedText = document.getElementById('disconnectedText');
    observeCanvasVisibility(canvasElement, disconnectedText);