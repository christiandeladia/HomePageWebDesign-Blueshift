let charts = {}; // Store charts by their IDs
let timeoutId; // Variable to hold timeout ID
let conversationTimeout;


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

        const totalDuration = 2500;
        const delayBetweenPoints = totalDuration / gridData.length;
        const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

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
                        type: 'number',
                        easing: 'linear',
                        duration: delayBetweenPoints,
                        from: NaN, // the point is initially skipped
                        delay(ctx) {
                            if (ctx.type !== 'data' || ctx.xStarted) {
                                return 0;
                            }
                            ctx.xStarted = true;
                            return ctx.index * delayBetweenPoints;
                        }
                    },
                    y: {
                        type: 'number',
                        easing: 'linear',
                        duration: delayBetweenPoints,
                        from: previousY,
                        delay(ctx) {
                            if (ctx.type !== 'data' || ctx.yStarted) {
                                return 0;
                            }
                            ctx.yStarted = true;
                            return ctx.index * delayBetweenPoints;
                        }
                    },
                    onProgress() {
                        const chartInstance = this;
                
                        // Use requestAnimationFrame to avoid UI flickering
                        requestAnimationFrame(() => {
                            // Safely update dataset colors after animation completes
                            setTimeout(() => {
                                const data = chartInstance.data;
                
                                data.datasets[0].backgroundColor = 'rgba(128, 128, 128, 0.4)';  // Grey background
                                data.datasets[0].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                                data.datasets[1].backgroundColor = 'rgba(128, 128, 128, 0.4)';  // Grey background
                                data.datasets[1].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                                data.datasets[2].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                
                                // Safely update the chart after all animations are done
                                chartInstance.update('none');
                            }, 1200);  // Small delay after the animation completes to ensure smoothness
                        });
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

    function getDeratingChartConfig(mean = 36, stdDev = 10) {
    const numPoints = 76;
    const gridData = generateBellCurveData(numPoints, mean, stdDev);
    const labels = [];

      function generateBellCurveData(numPoints, mean, stdDev, scale = 100) {
          const data = [];
          for (let i = 0; i < numPoints; i++) {
              const x = i - mean;
              let y = Math.exp(-0.5 * Math.pow(x / stdDev, 2));
              y *= scale;  // Scale the y values by 100
              data.push(y);
          }
          return data;
      }
      
      for (let i = 6; i <= 18; i++) {
          for (let j = 0; j < 60; j += 10) {
              const hour = i % 12 === 0 ? 12 : i % 12;
              const suffix = i < 12 ? 'AM' : 'PM';
              const minute = j === 0 ? '00' : j;
              labels.push(`${hour} ${suffix}`);
          }
      }
  
      // Filter to show only specific labels
      const displayLabels = labels.map((label, index) => {
          const displayTimes = [0, 18, 36, 54, 72];  // Indices for 3-hour intervals
          return displayTimes.includes(index) ? label : '';
      });
  
      
  
      const peakValue = Math.max(...gridData);
      const peakIndex = gridData.indexOf(peakValue);
  
      // Create the offline drop data
      const offlineDropData = new Array(numPoints).fill(null);
  for (let i = peakIndex + 1; i < numPoints; i++) {
      offlineDropData[i] = 70; // Set horizontal line from peak to 70
  }
  
      const rightHalfData = gridData.map((value, i) => (i > peakIndex ? value : null));
      
      const verticalLineData = new Array(numPoints).fill(null);
      verticalLineData[peakIndex] = peakValue;  // Start at the peak value
      for (let i = peakIndex + 1; i < numPoints; i++) {
          verticalLineData[i] = 70; // Set the rest to 70
      }
      
      const totalDuration = 3000;
      const delayBetweenPoints = totalDuration / gridData.length;
      const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
  
      
      return {
              type: 'line',
              data: {
                  labels: displayLabels,
                  datasets: [
                      {
                          label: 'Active Curve',
                          data: gridData.map((value, i) => (i <= peakIndex ? value : null)),
                          borderColor: 'green',
                          borderWidth: 2,
                          fill: true,
                          pointRadius: 0,
                          tension: 0.5,
                      },
                      {
                          label: 'Offline Drop',
                          data: offlineDropData,
                          borderColor: 'green',
                          borderWidth: 2,
                          pointRadius: 0,
                          fill: false
                      },
                      {
                        label: 'Offline Drop',
                        data: verticalLineData,
                        borderColor: 'green',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: true
                    },
                      {
                          label: 'Potential Energy',
                          data: rightHalfData,
                          borderColor: 'green',
                          borderDash: [5, 5],
                          borderWidth: 2,
                          pointRadius: 0,
                          fill: false,
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
                        type: 'number',
                        easing: 'linear',
                        duration: delayBetweenPoints,
                        from: NaN, // the point is initially skipped
                        delay(ctx) {
                            if (ctx.type !== 'data' || ctx.xStarted) {
                                return 0;
                            }
                            ctx.xStarted = true;
                            return ctx.index * delayBetweenPoints;
                        }
                    },
                    y: {
                        type: 'number',
                        easing: 'linear',
                        duration: delayBetweenPoints,
                        from: previousY,
                        delay(ctx) {
                            if (ctx.type !== 'data' || ctx.yStarted) {
                                return 0;
                            }
                            ctx.yStarted = true;
                            return ctx.index * delayBetweenPoints;
                        }
                    },
                    //         const conversationElement = document.getElementById('conversation-derating');
                    //         delayConversationMessages(conversationElement);   
                    //     }, 1000);
                    // }
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
                          display: false,
                          position: 'top'
                      },
                      tooltip: {
                          enabled: true,
                          mode: 'index',
                          intersect: false,
                      }
                  }
              }
          };

    }

    function getStringPerformanceChartConfig() {
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
            152, 110, 130, 120, 140, 
            120, 0, null, null, null, 
            null, null, null, null, null
        ];
    
    
        const totalDuration = 3000;
        const delayBetweenPoints = totalDuration / gridData90.length;
        const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    
    
        return {
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
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
            animation: {
                x: {
                    type: 'number',
                    easing: 'easeInOutQuad',
                    duration: delayBetweenPoints,
                    from: NaN, // the point is initially skipped
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.xStarted) {
                            return 0;
                        }
                        ctx.xStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                },
                y: {
                    type: 'number',
                    easing: 'easeInOutQuad',
                    duration: delayBetweenPoints,
                    from: previousY,
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.yStarted) {
                            return 0;
                        }
                        ctx.yStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                },
                onProgress() {
                        const chartInstance = this; // Reference to the current chart instance

                        requestAnimationFrame(() => {
                            // Safely update dataset colors after animation completes
                            setTimeout(() => {
                                const data = chartInstance.data; // Access chart data
                                data.datasets[2].backgroundColor = 'rgba(128, 128, 128, 0.4)';  // Grey background
                                data.datasets[2].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                                chartInstance.update('none');
                            }, 2500);  // Small delay after the animation completes to ensure smoothness
                        });
                                // document.getElementById('stringPerformanceText');
                        // stringPerformanceText.innerText = '3rd panel set down';
                    
                    // setTimeout(() => {
                    //     const conversationElement = document.getElementById('conversation-string-performance');
                    //     delayConversationMessages(conversationElement);
                    // }, 1000);
                    }
                },
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
                        return '6 PM'; // Explicitly set 6pm for the last tick
                    }
                    if (index % ticksPerInterval === 0 && tickHour <= endHour) {
                        return `${tickHour % 12 || 12}${tickHour >= 12 ? ' PM' : ' AM'}`;
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
        };


    }


    function getHomeDisconnectedChartConfig(mean = 36, stdDev = 10) {
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

        const totalDuration = 2500;
        const delayBetweenPoints = totalDuration / gridData.length;
        const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

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
                        type: 'number',
                        easing: 'linear',
                        duration: delayBetweenPoints,
                        from: NaN, // the point is initially skipped
                        delay(ctx) {
                            if (ctx.type !== 'data' || ctx.xStarted) {
                                return 0;
                            }
                            ctx.xStarted = true;
                            return ctx.index * delayBetweenPoints;
                        }
                    },
                    y: {
                        type: 'number',
                        easing: 'linear',
                        duration: delayBetweenPoints,
                        from: previousY,
                        delay(ctx) {
                            if (ctx.type !== 'data' || ctx.yStarted) {
                                return 0;
                            }
                            ctx.yStarted = true;
                            return ctx.index * delayBetweenPoints;
                        }
                    },
                    onProgress() {
                        const chartInstance = this;
                
                        // Use requestAnimationFrame to avoid UI flickering
                        requestAnimationFrame(() => {
                            // Safely update dataset colors after animation completes
                            setTimeout(() => {
                                const data = chartInstance.data;
                
                                data.datasets[0].backgroundColor = 'rgba(128, 128, 128, 0.4)';  // Grey background
                                data.datasets[0].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                                data.datasets[1].backgroundColor = 'rgba(128, 128, 128, 0.4)';  // Grey background
                                data.datasets[1].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                                data.datasets[2].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                
                                // Safely update the chart after all animations are done
                                chartInstance.update('none');
                            }, 1200);  // Small delay after the animation completes to ensure smoothness
                        });
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

    function getHomeDeratingChartConfig(mean = 36, stdDev = 10) {
        const numPoints = 76;
        const gridData = generateBellCurveData(numPoints, mean, stdDev);
        const labels = [];
    
          function generateBellCurveData(numPoints, mean, stdDev, scale = 100) {
              const data = [];
              for (let i = 0; i < numPoints; i++) {
                  const x = i - mean;
                  let y = Math.exp(-0.5 * Math.pow(x / stdDev, 2));
                  y *= scale;  // Scale the y values by 100
                  data.push(y);
              }
              return data;
          }
          
          for (let i = 6; i <= 18; i++) {
              for (let j = 0; j < 60; j += 10) {
                  const hour = i % 12 === 0 ? 12 : i % 12;
                  const suffix = i < 12 ? 'AM' : 'PM';
                  const minute = j === 0 ? '00' : j;
                  labels.push(`${hour} ${suffix}`);
              }
          }
      
          // Filter to show only specific labels
          const displayLabels = labels.map((label, index) => {
              const displayTimes = [0, 18, 36, 54, 72];  // Indices for 3-hour intervals
              return displayTimes.includes(index) ? label : '';
          });
      
          
      
          const peakValue = Math.max(...gridData);
          const peakIndex = gridData.indexOf(peakValue);
      
          // Create the offline drop data
          const offlineDropData = new Array(numPoints).fill(null);
      for (let i = peakIndex + 1; i < numPoints; i++) {
          offlineDropData[i] = 70; // Set horizontal line from peak to 70
      }
      
          const rightHalfData = gridData.map((value, i) => (i > peakIndex ? value : null));
          
          const verticalLineData = new Array(numPoints).fill(null);
          verticalLineData[peakIndex] = peakValue;  // Start at the peak value
          for (let i = peakIndex + 1; i < numPoints; i++) {
              verticalLineData[i] = 70; // Set the rest to 70
          }
          
          const totalDuration = 3000;
          const delayBetweenPoints = totalDuration / gridData.length;
          const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
      
          
          return {
                  type: 'line',
                  data: {
                      labels: displayLabels,
                      datasets: [
                          {
                              label: 'Active Curve',
                              data: gridData.map((value, i) => (i <= peakIndex ? value : null)),
                              borderColor: 'green',
                              borderWidth: 2,
                              fill: true,
                              pointRadius: 0,
                              tension: 0.5,
                          },
                          {
                              label: 'Offline Drop',
                              data: offlineDropData,
                              borderColor: 'green',
                              borderWidth: 2,
                              pointRadius: 0,
                              fill: false
                          },
                          {
                            label: 'Offline Drop',
                            data: verticalLineData,
                            borderColor: 'green',
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: true
                        },
                          {
                              label: 'Potential Energy',
                              data: rightHalfData,
                              borderColor: 'green',
                              borderDash: [5, 5],
                              borderWidth: 2,
                              pointRadius: 0,
                              fill: false,
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
                            type: 'number',
                            easing: 'linear',
                            duration: delayBetweenPoints,
                            from: NaN, // the point is initially skipped
                            delay(ctx) {
                                if (ctx.type !== 'data' || ctx.xStarted) {
                                    return 0;
                                }
                                ctx.xStarted = true;
                                return ctx.index * delayBetweenPoints;
                            }
                        },
                        y: {
                            type: 'number',
                            easing: 'linear',
                            duration: delayBetweenPoints,
                            from: previousY,
                            delay(ctx) {
                                if (ctx.type !== 'data' || ctx.yStarted) {
                                    return 0;
                                }
                                ctx.yStarted = true;
                                return ctx.index * delayBetweenPoints;
                            }
                        },
                        //         const conversationElement = document.getElementById('conversation-derating');
                        //         delayConversationMessages(conversationElement);   
                        //     }, 1000);
                        // }
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
                              display: false,
                              position: 'top'
                          },
                          tooltip: {
                              enabled: true,
                              mode: 'index',
                              intersect: false,
                          }
                      }
                  }
              };
    
    }

    function getHomeStringPerformanceChartConfig() {
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
            152, 110, 130, 120, 140, 
            120, 0, null, null, null, 
            null, null, null, null, null
        ];
    
    
        const totalDuration = 3000;
        const delayBetweenPoints = totalDuration / gridData90.length;
        const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    
    
        return {
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
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
            animation: {
                x: {
                    type: 'number',
                    easing: 'easeInOutQuad',
                    duration: delayBetweenPoints,
                    from: NaN, // the point is initially skipped
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.xStarted) {
                            return 0;
                        }
                        ctx.xStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                },
                y: {
                    type: 'number',
                    easing: 'easeInOutQuad',
                    duration: delayBetweenPoints,
                    from: previousY,
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.yStarted) {
                            return 0;
                        }
                        ctx.yStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                },
                onProgress() {
                        const chartInstance = this; // Reference to the current chart instance

                        requestAnimationFrame(() => {
                            // Safely update dataset colors after animation completes
                            setTimeout(() => {
                                const data = chartInstance.data; // Access chart data
                                data.datasets[2].backgroundColor = 'rgba(128, 128, 128, 0.4)';  // Grey background
                                data.datasets[2].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                                chartInstance.update('none');
                            }, 2500);  // Small delay after the animation completes to ensure smoothness
                        });
                                // document.getElementById('stringPerformanceText');
                        // stringPerformanceText.innerText = '3rd panel set down';
                    
                    // setTimeout(() => {
                    //     const conversationElement = document.getElementById('conversation-string-performance');
                    //     delayConversationMessages(conversationElement);
                    // }, 1000);
                    }
                },
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
                        return '6 PM'; // Explicitly set 6pm for the last tick
                    }
                    if (index % ticksPerInterval === 0 && tickHour <= endHour) {
                        return `${tickHour % 12 || 12}${tickHour >= 12 ? ' PM' : ' AM'}`;
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
        };


    }


    function getCommercialDisconnectedChartConfig(mean = 36, stdDev = 10) {
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

        const totalDuration = 2500;
        const delayBetweenPoints = totalDuration / gridData.length;
        const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

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
                        type: 'number',
                        easing: 'linear',
                        duration: delayBetweenPoints,
                        from: NaN, // the point is initially skipped
                        delay(ctx) {
                            if (ctx.type !== 'data' || ctx.xStarted) {
                                return 0;
                            }
                            ctx.xStarted = true;
                            return ctx.index * delayBetweenPoints;
                        }
                    },
                    y: {
                        type: 'number',
                        easing: 'linear',
                        duration: delayBetweenPoints,
                        from: previousY,
                        delay(ctx) {
                            if (ctx.type !== 'data' || ctx.yStarted) {
                                return 0;
                            }
                            ctx.yStarted = true;
                            return ctx.index * delayBetweenPoints;
                        }
                    },
                    onProgress() {
                        const chartInstance = this;
                
                        // Use requestAnimationFrame to avoid UI flickering
                        requestAnimationFrame(() => {
                            // Safely update dataset colors after animation completes
                            setTimeout(() => {
                                const data = chartInstance.data;
                
                                data.datasets[0].backgroundColor = 'rgba(128, 128, 128, 0.4)';  // Grey background
                                data.datasets[0].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                                data.datasets[1].backgroundColor = 'rgba(128, 128, 128, 0.4)';  // Grey background
                                data.datasets[1].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                                data.datasets[2].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                
                                // Safely update the chart after all animations are done
                                chartInstance.update('none');
                            }, 1200);  // Small delay after the animation completes to ensure smoothness
                        });
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

    function getCommercialDeratingChartConfig(mean = 36, stdDev = 10) {
        const numPoints = 76;
        const gridData = generateBellCurveData(numPoints, mean, stdDev);
        const labels = [];
    
          function generateBellCurveData(numPoints, mean, stdDev, scale = 100) {
              const data = [];
              for (let i = 0; i < numPoints; i++) {
                  const x = i - mean;
                  let y = Math.exp(-0.5 * Math.pow(x / stdDev, 2));
                  y *= scale;  // Scale the y values by 100
                  data.push(y);
              }
              return data;
          }
          
          for (let i = 6; i <= 18; i++) {
              for (let j = 0; j < 60; j += 10) {
                  const hour = i % 12 === 0 ? 12 : i % 12;
                  const suffix = i < 12 ? 'AM' : 'PM';
                  const minute = j === 0 ? '00' : j;
                  labels.push(`${hour} ${suffix}`);
              }
          }
      
          // Filter to show only specific labels
          const displayLabels = labels.map((label, index) => {
              const displayTimes = [0, 18, 36, 54, 72];  // Indices for 3-hour intervals
              return displayTimes.includes(index) ? label : '';
          });
      
          
      
          const peakValue = Math.max(...gridData);
          const peakIndex = gridData.indexOf(peakValue);
      
          // Create the offline drop data
          const offlineDropData = new Array(numPoints).fill(null);
      for (let i = peakIndex + 1; i < numPoints; i++) {
          offlineDropData[i] = 70; // Set horizontal line from peak to 70
      }
      
          const rightHalfData = gridData.map((value, i) => (i > peakIndex ? value : null));
          
          const verticalLineData = new Array(numPoints).fill(null);
          verticalLineData[peakIndex] = peakValue;  // Start at the peak value
          for (let i = peakIndex + 1; i < numPoints; i++) {
              verticalLineData[i] = 70; // Set the rest to 70
          }
          
          const totalDuration = 3000;
          const delayBetweenPoints = totalDuration / gridData.length;
          const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
      
          
          return {
                  type: 'line',
                  data: {
                      labels: displayLabels,
                      datasets: [
                          {
                              label: 'Active Curve',
                              data: gridData.map((value, i) => (i <= peakIndex ? value : null)),
                              borderColor: 'green',
                              borderWidth: 2,
                              fill: true,
                              pointRadius: 0,
                              tension: 0.5,
                          },
                          {
                              label: 'Offline Drop',
                              data: offlineDropData,
                              borderColor: 'green',
                              borderWidth: 2,
                              pointRadius: 0,
                              fill: false
                          },
                          {
                            label: 'Offline Drop',
                            data: verticalLineData,
                            borderColor: 'green',
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: true
                        },
                          {
                              label: 'Potential Energy',
                              data: rightHalfData,
                              borderColor: 'green',
                              borderDash: [5, 5],
                              borderWidth: 2,
                              pointRadius: 0,
                              fill: false,
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
                            type: 'number',
                            easing: 'linear',
                            duration: delayBetweenPoints,
                            from: NaN, // the point is initially skipped
                            delay(ctx) {
                                if (ctx.type !== 'data' || ctx.xStarted) {
                                    return 0;
                                }
                                ctx.xStarted = true;
                                return ctx.index * delayBetweenPoints;
                            }
                        },
                        y: {
                            type: 'number',
                            easing: 'linear',
                            duration: delayBetweenPoints,
                            from: previousY,
                            delay(ctx) {
                                if (ctx.type !== 'data' || ctx.yStarted) {
                                    return 0;
                                }
                                ctx.yStarted = true;
                                return ctx.index * delayBetweenPoints;
                            }
                        },
                        //         const conversationElement = document.getElementById('conversation-derating');
                        //         delayConversationMessages(conversationElement);   
                        //     }, 1000);
                        // }
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
                              display: false,
                              position: 'top'
                          },
                          tooltip: {
                              enabled: true,
                              mode: 'index',
                              intersect: false,
                          }
                      }
                  }
              };
    
    }

    function getCommercialStringPerformanceChartConfig() {
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
            152, 110, 130, 120, 140, 
            120, 0, null, null, null, 
            null, null, null, null, null
        ];
    
    
        const totalDuration = 3000;
        const delayBetweenPoints = totalDuration / gridData90.length;
        const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    
    
        return {
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
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
            animation: {
                x: {
                    type: 'number',
                    easing: 'easeInOutQuad',
                    duration: delayBetweenPoints,
                    from: NaN, // the point is initially skipped
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.xStarted) {
                            return 0;
                        }
                        ctx.xStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                },
                y: {
                    type: 'number',
                    easing: 'easeInOutQuad',
                    duration: delayBetweenPoints,
                    from: previousY,
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.yStarted) {
                            return 0;
                        }
                        ctx.yStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                },
                onProgress() {
                        const chartInstance = this; // Reference to the current chart instance

                        requestAnimationFrame(() => {
                            // Safely update dataset colors after animation completes
                            setTimeout(() => {
                                const data = chartInstance.data; // Access chart data
                                data.datasets[2].backgroundColor = 'rgba(128, 128, 128, 0.4)';  // Grey background
                                data.datasets[2].borderColor = 'rgba(128, 128, 128, 1)';  // Grey border
                                chartInstance.update('none');
                            }, 2500);  // Small delay after the animation completes to ensure smoothness
                        });
                                // document.getElementById('stringPerformanceText');
                        // stringPerformanceText.innerText = '3rd panel set down';
                    
                    // setTimeout(() => {
                    //     const conversationElement = document.getElementById('conversation-string-performance');
                    //     delayConversationMessages(conversationElement);
                    // }, 1000);
                    }
                },
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
                        return '6 PM'; // Explicitly set 6pm for the last tick
                    }
                    if (index % ticksPerInterval === 0 && tickHour <= endHour) {
                        return `${tickHour % 12 || 12}${tickHour >= 12 ? ' PM' : ' AM'}`;
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

        let gradient1, gradient2, gradient3;

        if (chartId === 'systemDisconnectedChart') {
            // Gradient for the first chart
            gradient1 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient1.addColorStop(0, 'rgba(255, 165, 0, 0.5)');
            gradient1.addColorStop(1, 'rgba(255, 165, 0, 0.1)');
            config.data.datasets[0].backgroundColor = gradient1;
            config.data.datasets[1].backgroundColor = gradient1;


        } 
        else if (chartId === 'systemDeratingChart') {
            // Gradient for the second chart
            gradient1 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient1.addColorStop(0, 'rgba(0, 172, 14, 0.8)');
            gradient1.addColorStop(1, 'rgba(0, 172, 14, 0.2)');
            config.data.datasets[0].backgroundColor = gradient1;
            config.data.datasets[1].backgroundColor = gradient1;
            config.data.datasets[2].backgroundColor = gradient1;

        } 
        else if (chartId === 'stringPerformanceChart') {
            // Gradient for the third chart
            gradient1 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient1.addColorStop(0, 'rgba(255, 99, 132, 0.2)');
            gradient1.addColorStop(1, 'rgba(255, 99, 132, 0.2)');
            gradient2 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient2.addColorStop(0, 'rgba(54, 162, 235, 0.2)');
            gradient2.addColorStop(1, 'rgba(54, 162, 235, 0.2)');
            gradient3 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient3.addColorStop(0, 'rgba(205, 205, 0, 0.2)');
            gradient3.addColorStop(1, 'rgba(205, 205, 0, 0.2)');

            config.data.datasets[0].backgroundColor = gradient1;
            config.data.datasets[1].backgroundColor = gradient2;
            config.data.datasets[2].backgroundColor = gradient3;
        }
        else if (chartId === 'homeSystemDisconnectedChart') {
            // Gradient for the first chart
            gradient1 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient1.addColorStop(0, 'rgba(255, 165, 0, 0.5)');
            gradient1.addColorStop(1, 'rgba(255, 165, 0, 0.1)');
            config.data.datasets[0].backgroundColor = gradient1;
            config.data.datasets[1].backgroundColor = gradient1;


        } 
        else if (chartId === 'homeSystemDeratingChart') {
            // Gradient for the second chart
            gradient1 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient1.addColorStop(0, 'rgba(0, 172, 14, 0.8)');
            gradient1.addColorStop(1, 'rgba(0, 172, 14, 0.2)');
            config.data.datasets[0].backgroundColor = gradient1;
            config.data.datasets[1].backgroundColor = gradient1;
            config.data.datasets[2].backgroundColor = gradient1;

        } 
        else if (chartId === 'homeStringPerformanceChart') {
            // Gradient for the third chart
            gradient1 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient1.addColorStop(0, 'rgba(255, 99, 132, 0.2)');
            gradient1.addColorStop(1, 'rgba(255, 99, 132, 0.2)');
            gradient2 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient2.addColorStop(0, 'rgba(54, 162, 235, 0.2)');
            gradient2.addColorStop(1, 'rgba(54, 162, 235, 0.2)');
            gradient3 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient3.addColorStop(0, 'rgba(205, 205, 0, 0.2)');
            gradient3.addColorStop(1, 'rgba(205, 205, 0, 0.2)');

            config.data.datasets[0].backgroundColor = gradient1;
            config.data.datasets[1].backgroundColor = gradient2;
            config.data.datasets[2].backgroundColor = gradient3;
        }
        else if (chartId === 'commercialSystemDisconnectedChart') {
            // Gradient for the first chart
            gradient1 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient1.addColorStop(0, 'rgba(255, 165, 0, 0.5)');
            gradient1.addColorStop(1, 'rgba(255, 165, 0, 0.1)');
            config.data.datasets[0].backgroundColor = gradient1;
            config.data.datasets[1].backgroundColor = gradient1;


        } 
        else if (chartId === 'commercialSystemDeratingChart') {
            // Gradient for the second chart
            gradient1 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient1.addColorStop(0, 'rgba(0, 172, 14, 0.8)');
            gradient1.addColorStop(1, 'rgba(0, 172, 14, 0.2)');
            config.data.datasets[0].backgroundColor = gradient1;
            config.data.datasets[1].backgroundColor = gradient1;
            config.data.datasets[2].backgroundColor = gradient1;

        } 
        else if (chartId === 'commercialStringPerformanceChart') {
            // Gradient for the third chart
            gradient1 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient1.addColorStop(0, 'rgba(255, 99, 132, 0.2)');
            gradient1.addColorStop(1, 'rgba(255, 99, 132, 0.2)');
            gradient2 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient2.addColorStop(0, 'rgba(54, 162, 235, 0.2)');
            gradient2.addColorStop(1, 'rgba(54, 162, 235, 0.2)');
            gradient3 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient3.addColorStop(0, 'rgba(205, 205, 0, 0.2)');
            gradient3.addColorStop(1, 'rgba(205, 205, 0, 0.2)');

            config.data.datasets[0].backgroundColor = gradient1;
            config.data.datasets[1].backgroundColor = gradient2;
            config.data.datasets[2].backgroundColor = gradient3;
        }

        // Create and store the chart
        charts[chartId] = new Chart(ctx, config);
    }

    // Show specific chart by ID
    function showChart(chartId) {
        document.querySelectorAll('canvas').forEach(canvas => canvas.style.display = 'none');
        document.getElementById(chartId).style.display = 'block';
        console.log(`Showing chart: ${chartId}`);
    }

    // Show conversation by ID
    function showConversation(conversationId) {
        document.querySelectorAll('.conversation').forEach(conv => {
            conv.style.display = 'none';
            clearMessagesOpacity(conv);
        });
        const conversationElement = document.getElementById(conversationId);
        conversationElement.style.display = 'block';
        setTimeout(() => {
            delayConversationMessages(conversationElement);
        }, 50); 
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

    // Set up event listeners
    document.querySelectorAll('#AfterServiceBtnGroup .btn').forEach(btn => {
    btn.addEventListener('click', () => updateActiveButton(btn.id));
    });

    // Function that display when the chart is visible to viewport
    function createObserver(target, callback) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    callback();
                    observer.unobserve(entry.target); // Stop observing once the chart is shown
                }
            });
        }, { threshold: 0.1 }); // Adjust threshold as needed
        observer.observe(target);
    }
    
    // Helper function to hide all conversations
    function hideAllConversations() {
        document.getElementById('conversation-disconnected').style.display = 'none';
        document.getElementById('conversation-derating').style.display = 'none';
        document.getElementById('conversation-string-performance').style.display = 'none';
        document.getElementById('disconnectedText').style.display = 'none';
        document.getElementById('stringPerformanceText').style.display = 'none';

        document.getElementById('homeConversationDisconnected').style.display = 'none';
        document.getElementById('homeConversationDerating').style.display = 'none';
        document.getElementById('homeConversationStringPerformance').style.display = 'none';

        document.getElementById('commercialConversationDisconnected').style.display = 'none';
        document.getElementById('commercialConversationDerating').style.display = 'none';
        document.getElementById('commercialConversationStringPerformance').style.display = 'none';
    }

    function displayDisconnectedText() {
        const disconnectedText = document.getElementById('disconnectedText');
        const disconnectedButton = document.getElementById('disconnected');
    
        if (disconnectedText && disconnectedButton.classList.contains('active')) {
            disconnectedText.style.display = 'block';
        }
    }

    function displayStringPerformanceText() {
        const stringPerformanceText = document.getElementById('stringPerformanceText');
        const stringPerformanceButton = document.getElementById('string-performance');
    
        if (stringPerformanceText && stringPerformanceButton.classList.contains('active')) {
            stringPerformanceText.style.display = 'block';
        }
    }

    

    // Event Listeneners for all section-------------------------------------
    document.getElementById('disconnected').addEventListener('click', function () {
        const disconnectedButton = document.getElementById('disconnected');
        
        if (disconnectedButton.classList.contains('active')) {
            clearTimeout(conversationTimeout);

            hideAllConversations();

            showChart('systemDisconnectedChart');
            createChart('systemDisconnectedChart', getDisconnectedChartConfig());

            setTimeout(() => {
                displayDisconnectedText();
            }, 1200);

            conversationTimeout = setTimeout(() => {
                showConversation('conversation-disconnected');
            }, 4000);
        }
    });

    document.getElementById('derating').addEventListener('click', function () {
        const deratingButton = document.getElementById('derating');

        // Check if the button is active
        if (deratingButton.classList.contains('active')) {
            // Cancel any existing conversation timeout
            clearTimeout(conversationTimeout);

            // Hide all other conversations immediately
            hideAllConversations();

            // Show the chart and create the derating chart
            showChart('systemDeratingChart');
            createChart('systemDeratingChart', getDeratingChartConfig());

            // Set a new timeout to show the conversation after 4 seconds
            conversationTimeout = setTimeout(() => {
                showConversation('conversation-derating');
            }, 4000);
        }
    });
    
    document.getElementById('string-performance').addEventListener('click', function () {
    const stringPerformanceButton = document.getElementById('string-performance');
        
    if (stringPerformanceButton.classList.contains('active')) {
        clearTimeout(conversationTimeout);

        hideAllConversations();

        showChart('stringPerformanceChart');
        createChart('stringPerformanceChart', getStringPerformanceChartConfig());

        setTimeout(() => {
            displayStringPerformanceText();
        }, 2500);

        conversationTimeout = setTimeout(() => {
            showConversation('conversation-string-performance');
        }, 4000);
    }

    });


    // Event listeners for home section-------------------------------------
    document.getElementById('homeDisconnected').addEventListener('click', function () {
        const disconnectedButton = document.getElementById('homeDisconnected');
        
        if (disconnectedButton.classList.contains('active')) {
            clearTimeout(conversationTimeout);

            hideAllConversations();

            showChart('homeSystemDisconnectedChart');
            createChart('homeSystemDisconnectedChart', getHomeDisconnectedChartConfig());

            setTimeout(() => {
                displayDisconnectedText();
            }, 1200);

            conversationTimeout = setTimeout(() => {
                showConversation('homeConversationDisconnected');
            }, 4000);
        }
    });

    document.getElementById('homeDerating').addEventListener('click', function () {
        const deratingButton = document.getElementById('homeDerating');

        if (deratingButton.classList.contains('active')) {

            clearTimeout(conversationTimeout);
            hideAllConversations();

            showChart('homeSystemDeratingChart');
            createChart('homeSystemDeratingChart', getHomeDeratingChartConfig());

            conversationTimeout = setTimeout(() => {
                showConversation('homeConversationDerating');
            }, 4000);
        }
    });
    
    document.getElementById('homeStringPerformance').addEventListener('click', function () {
    const stringPerformanceButton = document.getElementById('homeStringPerformance');
        
    if (stringPerformanceButton.classList.contains('active')) {
        clearTimeout(conversationTimeout);

        hideAllConversations();

        showChart('homeStringPerformanceChart');
        createChart('homeStringPerformanceChart', getHomeStringPerformanceChartConfig());

        setTimeout(() => {
            displayStringPerformanceText();
        }, 2500);

        conversationTimeout = setTimeout(() => {
            showConversation('homeConversationStringPerformance');
        }, 4000);
    }

    });



     // Event listeners for commercial section-------------------------------------
     document.getElementById('commercialDisconnected').addEventListener('click', function () {
        const disconnectedButton = document.getElementById('commercialDisconnected');
        
        if (disconnectedButton.classList.contains('active')) {
            clearTimeout(conversationTimeout);

            hideAllConversations();

            showChart('commercialSystemDisconnectedChart');
            createChart('commercialSystemDisconnectedChart', getCommercialDisconnectedChartConfig());

            setTimeout(() => {
                displayDisconnectedText();
            }, 1200);

            conversationTimeout = setTimeout(() => {
                showConversation('commercialConversationDisconnected');
            }, 4000);
        }
    });

    document.getElementById('commercialDerating').addEventListener('click', function () {
        const deratingButton = document.getElementById('commercialDerating');

        if (deratingButton.classList.contains('active')) {

            clearTimeout(conversationTimeout);
            hideAllConversations();

            showChart('commercialSystemDeratingChart');
            createChart('commercialSystemDeratingChart', getCommercialDeratingChartConfig());

            conversationTimeout = setTimeout(() => {
                showConversation('commercialConversationDerating');
            }, 4000);
        }
    });
    
    document.getElementById('commercialStringPerformance').addEventListener('click', function () {
    const stringPerformanceButton = document.getElementById('commercialStringPerformance');
        
    if (stringPerformanceButton.classList.contains('active')) {
        clearTimeout(conversationTimeout);

        hideAllConversations();

        showChart('commercialStringPerformanceChart');
        createChart('commercialStringPerformanceChart', getCommercialStringPerformanceChartConfig());

        setTimeout(() => {
            displayStringPerformanceText();
        }, 2500);

        conversationTimeout = setTimeout(() => {
            showConversation('commercialConversationStringPerformance');
        }, 4000);
    }

    });


    
    // Default-------------------------------------
    let currentChartId = null;
    function setChartBehavior(chartId, configFunction, conversationId) {
        const chartElement = document.getElementById(chartId);
    
        createObserver(chartElement, () => {
            clearTimeout(conversationTimeout);
            hideAllConversations();
            // Check if the chart is already shown
            if (currentChartId !== chartId) {
                showChart(chartId);
                currentChartId = chartId; // Update the current chart ID
            } else {
                console.log(`Chart ${chartId} is already displayed, skipping.`);
            }

            try {
                createChart(chartId, configFunction());
            } catch (error) {
                console.error(`Error creating chart: ${error}`);
            }
    
            setTimeout(() => {
                displayDisconnectedText();
            }, 1200);
    
            conversationTimeout = setTimeout(() => {
                showConversation(conversationId);
            }, 4000);
        });
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        setChartBehavior('systemDisconnectedChart', getDisconnectedChartConfig, 'conversation-disconnected');
    });

    // const systemDisconnectedTrigger = document.getElementById('allBtn');
    allBtn.addEventListener('click', () => {
        setChartBehavior('systemDisconnectedChart', getDisconnectedChartConfig, 'conversation-disconnected');
    });

    // const homeChartTrigger = document.getElementById('homesBtn');
    homesBtn.addEventListener('click', () => {
        setChartBehavior('homeSystemDisconnectedChart', getHomeDisconnectedChartConfig, 'homeConversationDisconnected');
    });

    // const commercialChartTrigger = document.getElementById('commercialBtn');
    commercialBtn.addEventListener('click', () => {
        setChartBehavior('commercialSystemDisconnectedChart', getCommercialDisconnectedChartConfig, 'commercialConversationDisconnected');
    });