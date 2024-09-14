//disconnected
function createChartDisconnected() {
  const ctx = document.getElementById('systemDisconnectedChart').getContext('2d');
  let chartInitialized = false;

  const gridData = [96, 96, 92, 89, 86, 88, 93, 100, 92, 86, 90, 93, 89, 94, 87, 92, 93, 100, 97, 99, 98, 87, 90, 98, 98, 93, 90, 90, 92, 94, 93, 85, 98, 91, 105, 98, 90, 93, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
            display: false,
            grid: {
              display: false
            },
            beginAtZero: true
          },
          y: {
            display: false,
            min: 70,
            max: 110,
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
            enabled: false  // Disable hover data display
          }
        }
      }
    });
    chartInitialized = true;
  }
}


// Derating
function createChartDerating() {
  const ctx = document.getElementById('systemDeratingChart').getContext('2d');
  let chartInitialized = false;

  const gridData = [56, 56, 52, 49, 46, 49, 53, 45, 48, 57, 53, 51, 46, 56, 50, 53, 60, 52, 46, 50, 53, 49, 54, 47, 52, 53, 60, 57, 59, 58, 47, 50, 58, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50];

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
            tension: 0.4,
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
            display: false,
            grid: {
              display: false
            },
            beginAtZero: true
          },
          y: {
            display: false,
            min: 30,
            max: 70,
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
      30, 32, 29, 31, 28, 30, 33, 27, 30, 31, 29, 28, 32, 31, 30, 29, 30, 37, 33, 29,
      30, 36, 28, 31, 29, 30, 31, 32, 30, 39, 28, 31, 35, 33, 29, 30, 40, 31, 30, 29,
      28, 30, 31, 32, 29, 30, 31, 38, 30, 29, 30, 37, 32, 40, 29, 30, 31, 32, 30, 35,
      28, 30, 37, 34, 30
    ];
    
    const gridData50 = [
      40, 38, 42, 39, 41, 40, 37, 43, 48, 39, 42, 38, 40, 41, 39, 42, 45, 38, 41, 40,
      39, 37, 40, 45, 38, 47, 39, 42, 40, 43, 41, 35, 39, 42, 40, 38, 41, 40, 39, 42,
      47, 40, 42, 49, 40, 41, 46, 40, 42, 49, 40, 41, 36, 40, 42, 38, 39, 40, 45, 41,
      36, 40, 43, 39
    ];
    
    const gridData90 = [
      50, 52, 49, 47, 46, 51, 56, 48, 50, 52, 43, 49, 48, 50, 53, 46, 49, 50, 52, 47,
      48, 50, 51, 46, 49, 52, 49, 47, 55, 51, 44, 52, 50, 48, 50, 49, 50, 52, 51, 46,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

  const totalDuration = 2500;
  const delayBetweenPoints = totalDuration / gridData50.length;
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
        labels: Array.from({ length: gridData50.length }, (_, i) => 'Day ' + (i + 1)),
        datasets: [
          {
            label: '30%',
            data: gridData30,
            backgroundColor: gradientGrid,  // Light red
            borderColor: 'rgba(205, 205, 0, 1)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.4,
          },
          {
            label: '50%',
            data: gridData50,
            backgroundColor: gradientGrid,  // Light green
            borderColor: 'rgba(205, 205, 0, 1)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.4,
          },
          {
            label: '90%',
            data: gridData90,
            backgroundColor: gradientGrid,  // Light blue
            borderColor: 'rgba(205, 205, 0, 1)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.4,
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
            display: false,
            grid: {
              display: false
            },
            beginAtZero: true
          },
          y: {
            display: false,
            min: 25,
            max: 60,
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
            enabled: false

          }
        }
      }
    });
    chartInitialized = true;
  }
}

