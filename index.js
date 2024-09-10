document.addEventListener('DOMContentLoaded', function () {

    const adjustViewBoxSVG = (id, width, height, x, y) => {
      const svg = document.getElementById(id);
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }
  
    //Heading SVG-------------------------------------
    const img = document.getElementById('imgHeader'); // Adjust this to match your image selector
  
    img.addEventListener('load', function () {
      adjustViewBoxSVG("headingImageSVG", img.naturalWidth, img.naturalHeight, img.x, img.y);
    });
  
    window.addEventListener('resize', function () {
      adjustViewBoxSVG("headingImageSVG", img.naturalWidth, img.naturalHeight, img.x, img.y);
    });
  
    // If the image is already loaded when the script runs, the load event won't fire.
    // So we need to manually call displayImageSize in case the image is already loaded.
    if (img.complete) {
      adjustViewBoxSVG("headingImageSVG", img.naturalWidth, img.naturalHeight, img.x, img.y);
    }
  
  
    //ChartSVG-------------------------------------
    const ctx = document.getElementById('beforeSolarChart').getContext('2d');
    let chartInitialized = false;
  
  
    function createChart() {
  
      const solarData = ["n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", 0, 59.0, 64.0, 56.0, 55.0, 58.0, 60.0, 70.0, 68.0, 64.0, 70.0, 60.0, 64.0, 66.0, 69.0, 54.0, 66.0, 68.0, 64.0, 60.0, 63.0, 60.0, 58.0, 59.0, 59.0, 61.0, 55.0, 54.0, 54.0, 69.0, 61.0, 54.0, 51.0, 64.0, 64.0, 58.0, 51.0, 57.0, 56.0, 60.0, 59.0]
      const gridData = [96, 96, 92, 89, 86, 96, 93, 85, 90, 96, 96, 98, 86, 88, 97, 99, 91, 86, 96, 88, 93, 100, 92, 86, 90, 93, 89, 94, 87, 92, 93, 100, 97, 99, 98, 87, 90, 98, 98, 93, 39, 35, 35, 31, 34, 32, 21, 22, 26, 27, 32, 34, 33, 28, 46, 34, 21, 32, 36, 26, 35, 31, 41, 31, 24, 41, 41, 45, 19, 29, 36, 43, 23, 36, 31, 39, 38, 31, 25, 31]
      const consumptionData = ["n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", 0, 98, 99, 91, 86, 92, 92, 91, 90, 90, 97, 92, 98, 99, 97, 100, 100, 89, 96, 96, 89, 95, 89, 100, 90, 85, 96, 95, 99, 88, 90, 90, 94, 87, 100, 89, 90, 95, 87, 85, 90]
  
      const gradientSolar = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradientSolar.addColorStop(0.05, "rgba(205, 205, 0, 0.8)");
      gradientSolar.addColorStop(0.95, "rgba(205, 205, 0, 0.2)");
  
      const gradientConsumption = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradientConsumption.addColorStop(0.05, "rgba(0, 172, 14, 0.8)");
      gradientConsumption.addColorStop(0.95, "rgba(0, 172, 14, 0.2)");
  
      const gradientGrid = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradientGrid.addColorStop(0.05, "rgba(113, 113, 113, 0.8)");
      gradientGrid.addColorStop(0.95, "rgba(113, 113, 113, 0.2)");
  
  
      const totalDuration = 2500;
      const delayBetweenPoints = totalDuration / solarData.length;
      const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
      const animation = {
        x: {
          // ...
          delay(ctx) {
            if (ctx.type !== 'data' || ctx.xStarted) {
              return 0;
            }
            ctx.xStarted = true;
            // Delay the animation of the solar and consumption datasets
            const delay = ctx.datasetIndex === 1 || ctx.datasetIndex === 2 ? 1000 : 0;
            return ctx.index * delayBetweenPoints + delay;
          }
        },
        y: {
          // ...
          delay(ctx) {
            if (ctx.type !== 'data' || ctx.yStarted) {
              return 0;
            }
            ctx.yStarted = true;
            // Delay the animation of the solar and consumption datasets
            const delay = ctx.datasetIndex === 1 || ctx.datasetIndex === 2 ? 1000 : 0;
            return ctx.index * delayBetweenPoints + delay;
          }
        }
      };
  
      // Chart creation logic
      if (!chartInitialized) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: Array.from({ length: solarData.length }, (_, i) => 'Day ' + (i + 1)),
            datasets: [
              {
                label: 'Grid',
                data: gridData,
                backgroundColor: gradientGrid,
                borderColor: 'rgba(113, 113, 113, 1)',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.4,
              }, {
                label: 'Solar',
                data: solarData,
                backgroundColor: gradientSolar,
                borderColor: 'rgba(205, 205, 0, 1)',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.4,
              }, {
                label: 'Consumption',
                data: consumptionData,
                backgroundColor: gradientConsumption,
                borderColor: 'rgba(0, 172, 14, 1)',
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
              axis: 'x', // Ensures that interaction considers the x-axis
              intersect: false // Show the tooltip even when not exactly over a point
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
                beginAtZero: true,
  
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
  
    const whatWeDoSection = document.getElementById('whatWeDoSection');
    const observerOptions = {
      root: null, // Use the viewport as the bounding box
      threshold: 0.8,
    };
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // The "whatwedo" section is now visible
          createChart();
          observer.unobserve(entry.target); // Optional: Stop observing the target
        }
      });
    }, observerOptions);
  
    observer.observe(whatWeDoSection)
  
  
    window.onscroll = function () {
  
      function setupCustomizedNavbar() {
        const toolbar = document.getElementById('customizedClientToolBar');
        const navbar = document.getElementById('customizedClientNavBar');
  
        // Get the position of the toolbar relative to the top of the page
        const toolbarPosition = toolbar.getBoundingClientRect().bottom + window.scrollY;
  
        // Buffer value
        const buffer = 25; // Adjust this value to your needs
  
        // If we've scrolled past the toolbar plus the buffer, show the navbar
        if (window.scrollY > toolbarPosition + buffer) {
          navbar.classList.add('show');
        }
        // If we've scrolled up past the toolbar minus the buffer, hide the navbar
        else if (window.scrollY < toolbarPosition - buffer) {
          navbar.classList.remove('show');
        }
      }
  
  
      setupCustomizedNavbar();
  
  
    };
  
  
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
  
  
  });
  
  //Personal NavBar Section-------------------------------------
  
  let selectedCategory = 'All';
  
  // Click event for all buttons
  $('.customizedBtn').click(function () {
    // Remove 'active' class from all buttons
    $('.customizedBtn').removeClass('active');
  
    // Update selectedCategory with the text of the clicked button
    selectedCategory = $(this).text();
  
    // Find the button with the same text as selectedCategory and add 'active' class
    $('.customizedBtn:contains("' + selectedCategory + '")').addClass('active');
  
    switchContent(selectedCategory);
  });
  
  function switchContent(selectedCategory) {
  
    $('html, body').animate({
      scrollTop: $("#whatWeDoSection").offset().top - 75
    }, 1000);
  
    switch (selectedCategory) {
      case 'All':
        $('#whatWeDoHeading').text("We help places reduce energy costs by installing solar & energy monitoring.");
        $("#overviewHeading").text("Switching to clean energy never made so much sense till now.");
        break;
      case 'Homes':
        $('#whatWeDoHeading').text("We install, process documents, and monitor your solar panels for your new or existing home.");
        $("#overviewHeading").text("Get the most out of your solar for your home with us.");
        break;
      case 'Commercial':
        $('#whatWeDoHeading').text("We can help your busines cut costs with solar panels & give basic energy consulting to help you manage your energy consumption.");
        $('#overviewHeading').text('Long term solar solutions for your business needs.');
        break;
      case 'Industrial':
        $('#whatWeDoHeading').text("We engineer, procure, & construct your solar system as well as explore your options in the energy market to reduce energy costs.");
        $('#overviewHeading').text('Long term solar solutions for your industrial needs.');
        break;
      default:
        break;
    }
  };
  
  
  
  
  
  
  
  
  
  
  