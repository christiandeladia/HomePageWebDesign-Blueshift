//disconnected
function createChartDisconnected() {
  const ctx = document.getElementById('systemDisconnectedChart').getContext('2d');
  let chartInitialized = false;

  const gridData = [96, 96, 92, 89, 86, 96, 93, 85, 90, 96, 96, 98, 86, 88, 97, 99, 91, 86, 96, 88, 93, 100, 92, 86, 90, 93, 89, 94, 87, 92, 93, 100, 97, 99, 98, 87, 90, 98, 98, 93, 90, 90, 92, 94, 93, 90, 98, 91, 88, 98, 90, 99, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const gradientGrid = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradientGrid.addColorStop(0.05, "rgba(0, 0, 255, 0.5)");
  gradientGrid.addColorStop(0.95, "rgba(0, 0, 255, 0.2)");
  const totalDuration = 2500;
  const delayBetweenPoints = totalDuration / gridData.length;
  const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

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
            tension: 0.4,
          }
        ]
      },
      options: {
        interaction: {
          mode: 'nearest',
          axis: 'x',
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
            intersect: false,
            callbacks: {
              label: function (context) {
                var label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Number(context.parsed.y) + '%';
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


// Derating
function createChartDerating() {
  const ctx = document.getElementById('systemDeratingChart').getContext('2d');
  let chartInitialized = false;

  const gridData = [56, 56, 52, 49, 46, 56, 53, 45, 50, 56, 56, 58, 46, 48, 57, 59, 51, 46, 56, 48, 53, 60, 52, 46, 50, 53, 49, 54, 47, 52, 53, 60, 57, 59, 58, 47, 50, 58, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50];

  const gradientGrid = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradientGrid.addColorStop(0.05, "rgba(0, 172, 14, 0.8)");
  gradientGrid.addColorStop(0.95, "rgba(0, 172, 14, 0.2)");
  const totalDuration = 2500;
  const delayBetweenPoints = totalDuration / gridData.length;
  const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

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
          mode: 'nearest',
          axis: 'x',
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
            intersect: false,
            callbacks: {
              label: function (context) {
                var label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Number(context.parsed.y) + '%';
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
      30, 32, 29, 31, 28, 30, 33, 27, 30, 31, 29, 28, 32, 31, 30, 29, 30, 31, 33, 29,
      30, 32, 28, 31, 29, 30, 31, 32, 30, 29, 28, 31, 30, 33, 29, 30, 32, 31, 30, 29,
      28, 30, 31, 32, 29, 30, 31, 32, 30, 29, 30, 31, 32, 30, 29, 30, 31, 32, 30, 29,
      28, 30, 31, 32, 30
    ];
    
    const gridData50 = [
      50, 52, 49, 47, 46, 51, 53, 48, 50, 52, 51, 49, 48, 50, 53, 46, 49, 50, 52, 47,
      48, 50, 51, 46, 50, 52, 49, 47, 50, 51, 46, 52, 50, 48, 50, 49, 50, 52, 51, 46,
      47, 50, 52, 49, 50, 51, 46, 50, 52, 49, 50, 51, 46, 50, 52, 48, 49, 50, 52, 51,
      46, 50, 52, 49
    ];
    
    const gridData90 = [
      90, 88, 92, 89, 91, 90, 87, 93, 91, 89, 92, 88, 90, 91, 89, 92, 90, 88, 91, 90,
      89, 93, 90, 92, 88, 91, 89, 92, 90, 93, 91, 90, 89, 92, 90, 88, 91, 90, 89, 92,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0
    ];

  const totalDuration = 2500;
  const delayBetweenPoints = totalDuration / gridData50.length;
  const gradientGrid = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradientGrid.addColorStop(0.05, "rgba(205, 205, 0, 0.8)");
  gradientGrid.addColorStop(0.95, "rgba(205, 205, 0, 0.2)");

  const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
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
          mode: 'nearest',
          axis: 'x',
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
            intersect: false,
            callbacks: {
              label: function (context) {
                var label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Number(context.parsed.y) + '%';
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

