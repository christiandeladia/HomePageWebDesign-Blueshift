// Disconnected
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

  const numPoints = 6;  // Number of data points (6 points for 6am, 9am, 12pm, 3pm, 6pm)
  const mean = 2;  // Mean centered at 12pm (2 in this 6-point range)
  const stdDev = 1;  // Standard deviation to ensure 6am/6pm are low and 12pm is high

  // Generate bell curve data, peaking at 12pm
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
    }
  };

  // Function to create time labels with 3-hour intervals from 6 AM to 6 PM
  const labelsPerHour = ['6am', '9am', '12pm', '3pm', '6pm'];

  function initializeChart() {
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
        interaction: {
          mode: null,
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
              display: true,
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
              display: true,
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
            enabled: false
          }
        }
      }
    });
  }

  function enableChartAnimation() {
    if (chart) {
      chart.options.animation = {
        duration: 1000 // Animation duration in milliseconds
      };
      chart.update(); // Update the chart to apply the new animation settings
    }
  }

  // Intersection Observer setup
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!chartInitialized) {
          initializeChart();
          chartInitialized = true;
        }
        enableChartAnimation(); // Trigger animation when in view
        observer.unobserve(entry.target); // Optionally stop observing once animated
      }
    });
  }, {
    threshold: 0.1 // Adjust the threshold as needed
  });

  // Start observing the chart container
  const chartContainer = document.querySelector('.canvas-container');
  observer.observe(chartContainer);
}
// Call the function to set up the chart
createChartDisconnected();


// Derating
function createChartDerating() {
  const ctx = document.getElementById('systemDeratingChart').getContext('2d');
  let chartInitialized = false;

  // Generate grid data for every 5 minutes from 6am to 6pm
  const gridData = [
    20, 65, 49, 58, 24, 
    72, 30, 50, 40, 90, 
    22, 60, 35, 45, 58, 
    50, 25, 80, 47, 63, 
    40, 40, 40, 40, 40,
    40, 40, 40, 40, 40,
    40, 40, 40, 40, 40,
    40, 40, 40, 40, 40
  ];
  // const gridData = Array.from({ length: 144 }, (_, i) => Math.random() * (60 - 40) + 40);

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
    }
  };

  if (!chartInitialized) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: gridData.length }, (_, i) => 'Day ' + (i + 1)),
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
        interaction: {
          mode: null,
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
              display: true,
              text: 'Time (Hours)',
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
              display: true,
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
            enabled: false
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
      150, 0, 0, 0, 0, 
      0, 0, 0, 0, 0
    ];

    // const gridData30 = [
    //   10, 31, 9, 41, 23, 
    //   20, 33, 11, 30, 41, 
    //   29, 28, 32, 31, 30, 
    //   29, 30, 37, 33, 29,
    //   30, 36, 28, 31, 29, 
    //   30, 31, 32, 30, 39, 
    //   28, 31, 35, 33, 29, 
    //   30, 40, 31, 30, 29
    // ];
    
    // const gridData50 = [
    //   50, 58, 52, 59, 61, 
    //   50, 57, 63, 68, 59, 
    //   62, 58, 60, 61, 59, 
    //   62, 65, 58, 61, 60,
    //   59, 57, 60, 65, 58, 
    //   67, 59, 62, 60, 63, 
    //   61, 55, 59, 62, 60, 
    //   58, 61, 60, 59, 62
    // ];
    
    // const gridData90 = [
    //   80, 82, 79, 77, 76, 
    //   81, 90, 78, 80, 82, 
    //   73, 79, 78, 80, 83, 
    //   76, 79, 80, 82, 77,
    //   78, 80, 81, 76, 79, 
    //   82, 79, 77, 85, 81, 
    //   0, 0, 0, 0, 0, 
    //   0, 0, 0, 0, 0
    // ];

  const totalDuration = 2500;
  const delayBetweenPoints = totalDuration / gridData90.length;
  const gradientGrid = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradientGrid.addColorStop(0.05, "rgba(205, 205, 0, 0.8)");
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
    }
  };

  if (!chartInitialized) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: gridData90.length }, (_, i) => 'Day ' + (i + 1)),
        datasets: [
          {
            label: '30%',
            data: gridData30,
            backgroundColor: gradientGrid,
            borderColor: 'rgba(205, 205, 0, 1)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.3,
          },
          {
            label: '50%',
            data: gridData50,
            backgroundColor: gradientGrid,
            borderColor: 'rgba(205, 205, 0, 1)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.3,
          },
          {
            label: '90%',
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
        interaction: {
          mode: null,
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
              display: true,
              text: 'Time (Hours)',
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
              display: true,
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
            enabled: false

          }
        }
      }
    });
    chartInitialized = true;
  }
}

