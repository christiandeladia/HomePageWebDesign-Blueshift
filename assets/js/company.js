
     //Best Clients Section -------------------------------------
     var companyRightBtn = document.getElementById('companyClientsRightBtn');
     var companyLeftBtn = document.getElementById('companyClientsLeftBtn');
     var companyRowContainer = document.getElementById('companyClientsRow');
     var companyDivCard = $('#companyClientsDivCard');
 
    $(companyLeftBtn).hide();

     if (!('ontouchstart' in window)) {
         $(companyRightBtn).show();
     }
 
     // Listen for click events on the right button
     companyRightBtn.addEventListener('click', function () {
         var newScrollPosition = companyRowContainer.scrollLeft + companyDivCard.width();
 
         if (newScrollPosition + companyRowContainer.offsetWidth >= companyRowContainer.scrollWidth) {
         $(companyRightBtn).hide();
         }
 
         $(companyRowContainer).animate({ scrollLeft: newScrollPosition }, 500, function () {
         $(companyLeftBtn).show();
         });
     });
 
     // Listen for click events on the left button
     companyLeftBtn.addEventListener('click', function () {
         var newScrollPosition = companyRowContainer.scrollLeft - companyDivCard.width();
 
         console.log(companyRowContainer.scrollLeft - companyDivCard.width())
 
         if (companyRowContainer.scrollLeft - companyDivCard.width() <= 0) {
            $(companyLeftBtn).hide();
         }
 
         $(companyRowContainer).animate({ scrollLeft: newScrollPosition }, 500, function () {
            $(companyRightBtn).show();
         });
     });

     

    // Maps Section -------------------------------------
    function loadMaps(apiKey) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCz8uwySRi7b4cG9a0MsC5sEB7rmsPxe4o&libraries=places&callback=initMap`;
        script.async = true;
        document.head.appendChild(script);
    }

    function initMap() {
        const metroManila = { lat: 14.5995, lng: 120.9842 };
        const map = new google.maps.Map(document.getElementById("metroManilaMap"), {
            zoom: 8.7,
            center: metroManila,
        });

        const circle = new google.maps.Circle({
            strokeColor: '#0000FF',
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fillColor: '#0000FF',
            fillOpacity: 0.15,
            map,
            center: metroManila,
            radius: 60000,
        });
    }

    // Load the map
    window.onload = initMap;
    loadMaps('AIzaSyCz8uwySRi7b4cG9a0MsC5sEB7rmsPxe4o&libraries=places');