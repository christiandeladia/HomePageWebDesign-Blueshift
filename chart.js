
document.addEventListener('DOMContentLoaded', function () {

  let timeoutId = null;

  function updateConversation(conversationId, buttonId, canvasId) {
      const disconnectedText = document.getElementById('disconnectedText');
      const stringPerformanceText = document.getElementById('stringPerformanceText');

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
      stringPerformanceText.style.display = 'none';

      // Clear any previous timeout to avoid delayed text appearing on the wrong chart
      if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
      }

      // Show the selected canvas if provided
      if (canvasId) {
          const canvasElement = document.getElementById(canvasId);
          canvasElement.style.display = 'block';

          // Show disconnected text only for systemDisconnectedChart and observe visibility
          if (canvasId === 'systemDisconnectedChart') {
              observeCanvasVisibility(canvasElement, disconnectedText);
              console.log('Disconnected text displayed for button:', buttonId);
          } else if(canvasId === 'stringPerformanceChart'){
            observeCanvasVisibility(canvasElement, stringPerformanceText);
            console.log('String Performance text displayed for button:', buttonId);
          } else {
              // Hide the disconnected text for other charts
              disconnectedText.style.display = 'none';
              stringPerformanceText.style.display = 'none';
              console.log('Disconnected text not displayed for button:', buttonId, canvasId);
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
      // delayConversationMessages(conversationToShow);
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
  
  function observeCanvasVisibility(canvasElement, disconnectedText) {
    disconnectedText.style.display = 'none'; // Initially hide the text

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target === canvasElement) {
                timeoutId = setTimeout(() => {
                    disconnectedText.style.display = 'flex';
                    // canvasElement.style.filter = 'grayscale(100%)';
                }, 3000);

                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    });

    observer.observe(canvasElement); // Only observe the specified canvas
  }

  // Event listeners for buttons
  document.getElementById('disconnected').addEventListener('click', function () {
      updateConversation('conversation-disconnected', 'disconnected', 'systemDisconnectedChart');
  });
  document.getElementById('derating').addEventListener('click', function () {
      updateConversation('conversation-derating', 'derating', 'systemDeratingChart');
  });
  document.getElementById('string-performance').addEventListener('click', function () {
      updateConversation('conversation-string-performance', 'string-performance', 'stringPerformanceChart');
  });

  // Set "Disconnected" as the default conversation when the page loads
  updateConversation('conversation-disconnected', 'disconnected', 'systemDisconnectedChart');






  
  // disconnected
  function createChartDisconnected() {
    const ctx = document.getElementById('systemDisconnectedChart').getContext('2d');
    let chartInitialized = false;
    let chart;
  
    // Function to generate a bell curve (normal distribution) data
    function generateBellCurveData(numPoints, mean, stdDev) {
      const data = [];
      for (let i = 0; i < numPoints; i++) {
        const x = i - mean;
        const y = Math.exp(-0.5 * Math.pow(x / stdDev, 2));
        data.push(y * 90); // Scale the data as needed for power output
      }
      return data;
    }
  
    const numPoints = 5;  // Number of data points (5 points for 6am, 9am, 12pm, 3pm, 6pm)
    const mean = 1;  // Mean centered at 9am (1 in this 5-point range)
    const stdDev = 0.5;  // Standard deviation to ensure 6am/12pm are low and 9am is high
  
    // Generate bell curve data, peaking at 9am
    const gridData = generateBellCurveData(numPoints, mean, stdDev);
  
    const gradientGrid = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradientGrid.addColorStop(0.05, "rgba(0, 0, 255, 0.5)");
    gradientGrid.addColorStop(0.95, "rgba(0, 0, 255, 0.2)");
  
    const totalDuration = 2500;
    const delayBetweenPoints = totalDuration / gridData.length;
  
    const animation = {
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
        if (chart) {
          chart.data.datasets[0].backgroundColor = 'rgba(128, 128, 128, 0.4)';  // Grey background
          chart.data.datasets[0].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
          chart.update();
        }
        // Trigger the conversation animation after chart animation completes
        const conversationElement = document.getElementById('conversation-disconnected');
        delayConversationMessages(conversationElement);
      }
    };
  
    // Function to create time labels with 3-hour intervals from 6 AM to 6 PM
    const labelsPerHour = ['6am', '9am', '12pm', '3pm', '6pm'];
  
    function initializeChart() {
      if (!chartInitialized) {
        chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labelsPerHour,  // Use formatted labels with 3-hour intervals
            datasets: [
              {
                label: 'Solar Output',
                data: gridData,
                backgroundColor: gradientGrid,
                borderColor: 'blue',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.5,
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
            animation: animation,
            scales: {
              x: {
                display: true,
                grid: {
                  display: false
                },
                title: {
                  display: false,
                  text: 'Time (Hours)',
                  color: 'black',
                  font: {
                    size: 14,
                    weight: 'bold'
                  }
                },
                ticks: {
                  autoSkip: false,
                  maxRotation: 0,
                  minRotation: 0,
                }
              },
              y: {
                display: true,
                min: 0,
                max: Math.max(...gridData) + 10,  // Adjust max value based on data
                grid: {
                  display: false
                },
                title: {
                  display: false,
                  text: 'Power Output (kW)',
                  color: 'black',
                  font: {
                    size: 14,
                    weight: 'bold'
                  }
                },
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: true, // Enable tooltips
                mode: 'index', // Show all items in the dataset at the nearest X position
                intersect: false, // Show the tooltip even when not exactly over a point
                callbacks: {
                  label: function (context) {
                    var label = context.dataset.label || '';
    
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += new Number(context.parsed.y.toFixed(2)) + '%';
                    }
                    return label;
                  }
                }
              }
            }
          }
        });
        chartInitialized = true;
      }
    }
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!chartInitialized) {
            initializeChart();
          }
          // Ensure chart update happens only after initialization
          chart.update();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
  
    const chartContainer = document.querySelector('.canvas-container');
    observer.observe(chartContainer);
  }


// Derating
function createChartDerating() {
  const ctx = document.getElementById('systemDeratingChart').getContext('2d');
  let chartInitialized = false;

  // Generate grid data for every 5 minutes from 6am to 6pm
  // const gridData = [
  //   20, 25, 30, 35, 40, 
  //   45, 50, 55, 60, 65, 
  //   100, 105, 110, 100, 90, 
  //   80, 70, 70, 70, 70, 
  //   70, 70, 70, 70, 70,
  //   70, 67, 64, 61, 58,
  //   55, 52, 49, 46, 43,
  //   40, 37, 34, 31, 28
  // ];
  // const gridData = Array.from({ length: 144 }, (_, i) => Math.random() * (60 - 40) + 40);

  function generateBellCurveData(numPoints, mean, stdDev, min, max) {
    const data = [];
    const scale = (max - min) / 2;
    const shift = min + scale;

    for (let i = 0; i < numPoints; i++) {
        const x = (i - mean) / stdDev;
        const y = Math.exp(-0.5 * Math.pow(x, 2));
        data.push(Math.max(min, Math.min(max, y * scale + shift))); // Scale and shift the data
    }
    return data;
}

// Parameters
const numPoints = 16;  // Number of data points
const mean = 9;       // Mean centered around the middle of the array
const stdDev = 4;      // Standard deviation to control the spread
const min = 10;        // Minimum value
const max = 140;        // Maximum value

// Generate bell curve data
const bellCurveData = generateBellCurveData(numPoints, mean, stdDev, min, max);

// Append sudden drop and decreasing values
const dropData = [
    70, 70, 70, 70, 70,
    70, 70, 70, 70, 70,
    70, 70, 67, 64, 61,
    58, 55, 52, 49, 46,
    43, 40, 37, 34
];

// Combine data
const gridData = bellCurveData.concat(dropData);

  const gradientGrid = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradientGrid.addColorStop(0.05, "rgba(0, 172, 14, 0.8)");
  gradientGrid.addColorStop(0.95, "rgba(0, 172, 14, 0.2)");
  const totalDuration = 2500;
  const delayBetweenPoints = totalDuration / gridData.length;

  const animation = {
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
      // Trigger the conversation animation after chart animation completes
      const conversationElement = document.getElementById('conversation-derating');
      delayConversationMessages(conversationElement);
    }
  };

  if (!chartInitialized) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: gridData.length }, (_, i) => {
          const startHour = 6; // 6am
          const totalTicks = gridData.length;
          const hoursRange = 12; // Total hours from 6am to 6pm
          const interval = hoursRange / (totalTicks - 1); // Calculate hour increment based on number of ticks
          const tickHour = startHour + Math.floor(i * interval);
        
          // Format hours correctly
          if (tickHour === 12) return '12pm'; // Handle 12 PM case
          if (tickHour === 0) return '12am'; // Handle 12 AM case
          return tickHour < 12 ? `${tickHour}am` : `${tickHour - 12}pm`;
        }),
        datasets: [
          {
            label: 'Grid',
            data: gridData,
            backgroundColor: gradientGrid,
            borderColor: 'green',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.3,
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
        animation: animation,
        scales: {
          x: {
            display: true,
            grid: {
              display: false
            },
            title: {
              display: false,
              text: "",
              color: 'black',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              autoSkip: false, // Prevent auto skipping to control labels manually
              maxRotation: 0,
              minRotation: 0,
              callback: function(value, index, values) {
                const startHour = 6; // 6am
                const endHour = 18;  // 6pm
                const totalTicks = 40; // Total number of ticks
                const interval = 3; // 3 hours interval
                const ticksPerInterval = totalTicks / ((endHour - startHour) / interval); // Number of ticks per interval
            
                const tickHour = startHour + Math.floor(index / ticksPerInterval) * interval;
                
                if (index === gridData.length - 1) {
                  return '6pm'; // Explicitly set 6pm for the last tick
                }
                if (index % ticksPerInterval === 0 && tickHour <= endHour) {
                  return `${tickHour % 12 || 12}${tickHour >= 12 ? 'pm' : 'am'}`;
                }
                return ''; // Hide all other ticks
              }
            }
          },
          y: {
            display: true,
            min: 0,
            max: Math.max(...gridData) + 10,  // Adjust max value based on data
            grid: {
              display: false
            },
            title: {
              display: false,
              color: 'black',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true, // Enable tooltips
            mode: 'index', // Show all items in the dataset at the nearest X position
            intersect: false, // Show the tooltip even when not exactly over a point
            callbacks: {
              label: function (context) {
                var label = context.dataset.label || '';

                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Number(context.parsed.y.toFixed(2)) + '%';
                }
                return label;
              }
            }
          }
        }
      }
    });
    chartInitialized = true;
  }
}


//string performance
function createChartStringPerformance() {
  const ctx = document.getElementById('stringPerformanceChart').getContext('2d');
  let chartInitialized = false;

  const gridData30 = [
    0, 40, 29, 38, 4, 
    40, 10, 30, 20, 70, 
    2, 40, 15, 25, 38, 
    30, 5, 60, 27, 43, 
    20, 45, 29, 28, 4, 
    52, 10, 20, 20, 70, 
    2, 40, 15, 25, 38, 
    30, 5, 60, 27, 43,
    ];
    
    const gridData50 = [
      60, 55, 110, 77, 93, 
      57, 90, 65, 75, 78, 
      90, 60, 80, 70, 120,  
      50, 95, 79, 88, 54,
      80, 55, 110, 77, 93, 
      52, 90, 65, 75, 102, 
      88, 60, 80, 70, 120,  
      50, 95, 79, 88, 54,
    ];
    
    const gridData90 = [
      100, 145, 129, 138, 104, 
      152, 110, 130, 120, 170, 
      102, 140, 115, 125, 138, 
      130, 105, 160, 127, 143,
      100, 145, 129, 138, 104, 
      152, 110, 130, 120, 170, 
      150, 0, null, null, null, 
      null, null, null, null, null
    ];


  const totalDuration = 2500;
  const delayBetweenPoints = totalDuration / gridData90.length;
  const gradientGrid = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradientGrid.addColorStop(0.05, "rgba(205, 205, 0, 0.2)");
  gradientGrid.addColorStop(0.95, "rgba(205, 205, 0, 0.2)");


  const animation = {
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
      if (chartInstance) {
        chartInstance.data.datasets[2].backgroundColor = 'rgba(128, 128, 128, 0.4)';  // Grey background
        chartInstance.data.datasets[2].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
        chartInstance.update();

        document.getElementById('stringPerformanceText');
        stringPerformanceText.innerText = '3rd panel set down';
      }
      // Trigger the conversation animation after chart animation completes
      setTimeout(() => {
        const conversationElement = document.getElementById('conversation-string-performance');
        delayConversationMessages(conversationElement);
      }, 1000);
    }
  };

  if (!chartInitialized) {
    chartInstance =  new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: gridData90.length }, (_, i) => {
          const startHour = 6; // 6am
          const totalTicks = gridData90.length;
          const hoursRange = 12; // Total hours from 6am to 6pm
          const interval = hoursRange / (totalTicks - 1); // Calculate hour increment based on number of ticks
          const tickHour = startHour + Math.floor(i * interval);
        
          // Format hours correctly
          if (tickHour === 12) return '12pm'; // Handle 12 PM case
          if (tickHour === 0) return '12am'; // Handle 12 AM case
          return tickHour < 12 ? `${tickHour}am` : `${tickHour - 12}pm`;
        }),
        datasets: [
          {
            label: '1st set of panels',
            data: gridData30,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.3,
          },
          {
            label: '2nd set of panels',
            data: gridData50,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.3,
          },
          {
            label: '3rd set of panels',
            data: gridData90,
            backgroundColor: gradientGrid,
            borderColor: 'rgba(205, 205, 0, 1)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.3,
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
        animation: animation,
        scales: {
          x: {
            display: true,
            grid: {
              display: false
            },
            title: {
              display: false,
              text: '',
              color: 'black',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              autoSkip: false, // Prevent auto skipping to control labels manually
              maxRotation: 0,
              minRotation: 0,
              callback: function(value, index, values) {
                const startHour = 6; // 6am
                const endHour = 18;  // 6pm
                const totalTicks = gridData90.length; // Total number of ticks based on data length
                const interval = 3; // 3 hours interval
                const hoursRange = endHour - startHour; // Total number of hours from start to end
                const ticksPerInterval = totalTicks / (hoursRange / interval); // Number of ticks per interval
            
                const tickHour = startHour + Math.floor(index / ticksPerInterval) * interval;
            
                if (index === totalTicks - 1) {
                  return '6pm'; // Explicitly set 6pm for the last tick
                }
                if (index % ticksPerInterval === 0 && tickHour <= endHour) {
                  return `${tickHour % 12 || 12}${tickHour >= 12 ? 'pm' : 'am'}`;
                }
                return ''; // Hide all other ticks
              }
            }
          },
          y: {
            display: true,
            min: 0,
            max: Math.max(...gridData90) + 10,  // Adjust max value based on data
            grid: {
              display: false
            },
            title: {
              display: false,
              text: '',
              color: 'black',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            enabled: true, // Enable tooltips
            mode: 'index', // Show all items in the dataset at the nearest X position
            intersect: false, // Show the tooltip even when not exactly over a point
            callbacks: {
              label: function (context) {
                var label = context.dataset.label || '';

                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Number(context.parsed.y.toFixed(2)) + '%';
                }
                return label;
              }
            }
          }
        }
      }
    });
    chartInitialized = true;
  }
}


});