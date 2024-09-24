let charts = {}; // Store charts by their IDs
let timeoutId; // Variable to hold timeout ID

  // Function to create a Line Chart configuration
  function getDisconnectedChartConfig(mean = 36, stdDev = 10) {
    const numPoints = 76;
    const gridData = generateBellCurveData(numPoints, mean, stdDev);
    const labels = [];

    function generateBellCurveData(numPoints, mean, stdDev, scale = 100) {
      const data = [];
      for (let i = 0; i < numPoints; i++) {
          const x = i - mean;
          let y = Math.exp(-0.5 * Math.pow(x / stdDev, 2));
          y *= scale;  // Scale the y values
          data.push(y);
      }
      return data;
  }
    // Generate labels for every 10 minutes between 6 AM to 6 PM
    for (let i = 6; i <= 18; i++) {
        for (let j = 0; j < 60; j += 10) {
            const hour = i % 12 === 0 ? 12 : i % 12;
            const suffix = i < 12 ? 'AM' : 'PM';
            const minute = j === 0 ? '00' : j;
            labels.push(`${hour} ${suffix}`);
        }
    }

    // Display only at specific intervals (6AM, 9AM, etc.)
    const displayLabels = labels.map((label, index) => {
        const displayTimes = [0, 18, 36, 54, 72]; // Display at 3-hour intervals
        return displayTimes.includes(index) ? label : '';
    });

    const peakIndex = gridData.indexOf(Math.max(...gridData));
    const rightHalfData = gridData.map((value, i) => (i > peakIndex ? value : null));
    const verticalLineData = gridData.map((value, i) => (i === peakIndex ? value : (i === peakIndex + 1 ? 0 : null)));

    const totalDuration = 2000;
    const delayBetweenPoints = totalDuration / gridData.length;

    // Define the chart configuration
    return {
        type: 'line',
        data: {
            labels: displayLabels,
            datasets: [
                {
                    label: 'Active Curve',
                    data: gridData.map((value, i) => (i <= peakIndex ? value : null)),
                    borderColor: 'orange',
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 0,
                    tension: 0.5
                },
                {
                    label: 'Offline Drop',
                    data: verticalLineData,
                    borderColor: 'orange',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                },
                {
                    label: 'Potential Energy',
                    data: rightHalfData,
                    borderColor: 'orange',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                x: {
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.xStarted) {
                            return 0;
                        }
                        ctx.xStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                },
                y: {
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.yStarted) {
                            return 0;
                        }
                        ctx.yStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                },
                onComplete() {
                    setTimeout(() => {
                        // showConversation('conversation-disconnected');
                    }, 1000);
                }
            },
            scales: {
                x: {
                    type: 'category',
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0,
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    display: true,
                    min: 0,
                    max: 100,
                    grid: {
                        display: false
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                }
            }
        }
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
        const canvas = document.getElementById(chartId);
        const ctx = canvas.getContext('2d');
    
        // Destroy previous chart if it exists
        if (charts[chartId]) {
            charts[chartId].destroy();
        }
    
        // Handle the background color gradient inside the canvas context
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(255, 165, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
    
        // Assign the generated gradient to the chart dataset
        config.data.datasets[0].backgroundColor = gradient;
    
        // Create and store the chart
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
      createChart('systemDisconnectedChart', getDisconnectedChartConfig()); 

      const conversationDiv = document.getElementById('conversation-disconnected');
      if (conversationDiv.style.display === 'block') {
          conversationDiv.style.display = 'none';
      }      
      setTimeout(() => {
          showConversation('conversation-disconnected');
      }, 3000);
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
  createChart('systemDisconnectedChart', getDisconnectedChartConfig()); // Create default chart
  setTimeout(() => {
    showConversation('conversation-disconnected');
}, 3000);
});

    // Observe canvas visibility for the disconnected text
    const canvasElement = document.getElementById('systemDisconnectedChart');
    const disconnectedText = document.getElementById('disconnectedText');
    observeCanvasVisibility(canvasElement, disconnectedText);