function getDisconnectedChartConfig() {

    const activeCurveData = [
        0, 35, 9, 25, 4, 
        40, 10, 30, 25, 35, 
        7, 40, 15, 25, 38, 
        30, 5, 60, 27, 43, 
        20, 45, 29, 28, 4, 
        52, 10, 40, 20, 70, 
        42, 60, 35, 45, 58, 
        50, 35, 70, 47, 63,
        70, 75, 50, 77, 88, 
        57, 95, 70, 80, 78, 
        90, 60, 80, 70, 120,  
        70, 115, 99, 108, 90,
        100, 75, 130, 97, 123, 
        82, 130, 105, 95, 142, 
        128, 140, 130, 110, 160,  
        140, 155, 136, 168, 154,
        150, 185, 149, 188, 174, 
        178, 170, 185, 180, 190, 
        184, 170,
        
    ];


    const PotentialData = [...activeCurveData, ...activeCurveData.slice().reverse()];
    const peakIndex = activeCurveData.indexOf(Math.max(...activeCurveData));
    const verticalLineData = activeCurveData.map((value, i) => (i === peakIndex ? value : (i === peakIndex + 1 ? 0 : null)));

    const totalLength = PotentialData.length ;

    const totalDuration = 2500;
    const delayBetweenPoints = totalDuration / activeCurveData.length;

    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;


    return {
        type: 'line',
        data: {
            labels: Array.from({ length: totalLength }, (_, i) => {
                const startHour = 6; // 6am
                const totalTicks = totalLength; // Total number of ticks based on combined data length
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
                    label: 'Active Curve',
                    data: activeCurveData.map((value, i) => (i <= peakIndex ? value : null)),
                    borderColor: 'orange',
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 0,
                    tension: 0.3
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
                    data: PotentialData,
                    borderColor: 'orange',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.3
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
                            data.datasets[1].backgroundColor = 'rgba(128, 128, 128, 0.4)';
                            data.datasets[1].borderColor = 'rgba(128, 128, 128, 1)';  
                            // data.datasets[2].borderColor = 'rgba(128, 128, 128, 1)';

                            // Safely update the chart after all animations are done
                            chartInstance.update('none');
                        }, 2500);  // Small delay after the animation completes to ensure smoothness
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
                        autoSkip: false, // Prevent auto skipping to control labels manually
                        maxRotation: 0,
                        minRotation: 0,
                        callback: function(value, index, values) {
                            const startHour = 6; // 6am
                            const endHour = 18;  // 6pm
                            const totalTicks = totalLength; // Total number of ticks based on data length
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
                    max: Math.max(...activeCurveData) + 10,
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



    const activeCurveData = [
        0, 35, 9, 25, 4, 
        40, 10, 30, 25, 35, 
        7, 40, 15, 25, 38, 
        30, 5, 60, 27, 43, 
        20, 45, 29, 28, 4, 
        52, 10, 40, 20, 70, 
        42, 60, 35, 45, 58, 
        50, 35, 70, 47, 63,
        70, 75, 50, 77, 88, 
        57, 95, 70, 80, 78, 
        90, 60, 80, 70, 120,  
        70, 115, 99, 108, 90,
        100, 75, 130, 97, 123, 
        82, 130, 105, 95, 142, 
        128, 140, 130, 110, 160,  
        140, 155, 136, 168, 154,
        150, 185, 149, 188, 174, 
        178, 170, 185, 180, 190, 
        184, 170
    ];

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

    // for (let i = 6; i <= 18; i++) {
    //     for (let j = 0; j < 60; j += 10) {
    //         const hour = i % 12 === 0 ? 12 : i % 12;
    //         const suffix = i < 12 ? 'AM' : 'PM';
    //         const minute = j === 0 ? '00' : j;
    //         labels.push(`${hour} ${suffix}`);
    //     }
    // }

    // Filter to show only specific labels
    // const displayLabels = labels.map((label, index) => {
    //     const displayTimes = [0, 18, 36, 54, 72];  // Indices for 3-hour intervals
    //     return displayTimes.includes(index) ? label : '';
    // });

    const peakValue = Math.max(...gridData);
    const peakIndex = gridData.indexOf(peakValue);

    // Create the vertical line data
    const verticalLineData = new Array(numPoints).fill(null);
    verticalLineData[peakIndex] = peakValue;  // Start at the peak value

    // Drop to 70 and stop
    let droppedToSeventy = false;
    for (let i = peakIndex + 1; i < numPoints; i++) {
        if (!droppedToSeventy) {
            verticalLineData[i] = 70; // Set to 70
            droppedToSeventy = true; // Mark that we've dropped to 70
        } else {
            verticalLineData[i] = null; // Keep the rest as null
        }
    }

    // Create the offline drop data starting after verticalLineData
    const offlineDropData = new Array(numPoints).fill(null);

    // Define the starting index for offlineDropData after verticalLineData
    const startOfflineIndex = peakIndex + 1; // Start right after the peak

    // Set 70 until 2 PM (represented by index)
    const twoPMIndex = Math.floor((8 * 60) / 10); // 2 PM corresponds to 8th hour (from 6 AM)
    const sixPMIndex = Math.floor((12 * 60) / 10); // 6 PM corresponds to 12th hour

    // Initialize offlineDropData from startOfflineIndex
    for (let i = startOfflineIndex; i <= twoPMIndex; i++) {
        offlineDropData[i] = 70;
    }

    // Gradually decrease from 70 to 0 between 2 PM and 6 PM
    const decreaseRate = 70 / (sixPMIndex - twoPMIndex); // Calculate the decrease rate per index
    for (let i = twoPMIndex + 1; i <= sixPMIndex; i++) {
        offlineDropData[i] = 70 - (decreaseRate * (i - twoPMIndex));
    }

    // Fill the remaining data with the last value (e.g., 0)
    for (let i = sixPMIndex + 1; i < numPoints; i++) {
        offlineDropData[i] = 0; // You can change this value if needed
    }

    const rightHalfData = gridData.map((value, i) => (i > peakIndex ? value : null));

    const totalDuration = 2500;
    const delayBetweenPoints = totalDuration / gridData.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const PotentialData = [...activeCurveData, ...activeCurveData.slice().reverse()];
    const totalLength = PotentialData.length ;

    
    return {
        type: 'line',
        data: {
            labels: Array.from({ length: totalLength }, (_, i) => {
                const startHour = 6; // 6am
                const totalTicks = totalLength; // Total number of ticks based on combined data length
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
                    label: 'Active Curve',
                    data: activeCurveData.slice(0, numPoints),
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
                    fill: true
                },
                {
                    label: 'Vertical Line',
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
            },
            scales: {
                x: {
                    type: 'category',
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        autoSkip: false, // Prevent auto skipping to control labels manually
                        maxRotation: 0,
                        minRotation: 0,
                        callback: function(value, index, values) {
                            const startHour = 6; // 6am
                            const endHour = 18;  // 6pm
                            const totalTicks = totalLength; // Total number of ticks based on data length
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
                    max: 200,
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