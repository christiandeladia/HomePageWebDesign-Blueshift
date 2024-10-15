// Global Variables
let locationData = null;
let map;
let autocomplete;
let disableLoadingDiv = false;

const sectionDivs = ['#aboutYourPlace', '#aboutYourPlace2', '#finalContent'];
let currentDiv = 0;

// Create and append the script tag for Google Maps API
var mapsScript = document.createElement('script');
mapsScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCz8uwySRi7b4cG9a0MsC5sEB7rmsPxe4o&libraries=places&callback=initMap';
mapsScript.async = true;
document.head.appendChild(mapsScript);

//chart
var myChart;
var energyMixChart;
var roiChart;

var tempUserData = {
    buildingType: null,
    address: null,
    coordinates: null,
    monthlyBill: null,
    roofType: null,
    lineType: null,
    lineVoltage:null,
    timeOfUse:null,
    netMetering:null,
}

var results = {};

$(document).ready(function () {
    setupEventListeners();

    analytics.logEvent('sds_session_start', {
        sessionID: sessionStart,
      });
});

// --- Event Listeners ---

function setupEventListeners() {
    // General
    $(window).on('beforeunload', function () {
        return 'Are you sure you want to leave this page?';
    });

    $('#nextButton').click(onNextButtonClick);
    $('#backButton').click(onBackButtonClick);

    //about your place 1
    $('input[name="buildingRadio"]').change(function(){
        changeGraphicSection($('input[name="buildingRadio"]:checked').val())
    });
    $("#averageElectricityInput").on('keyup', function(){
        let value = Number($(this).val().replace(/,/g, '')).toLocaleString();
        $(this).val(value);
        checkNextButtonState();
    });
    $("#averageElectricityInput").on('input', function(){
        let value = $(this).val().replace(/[^0-9]/g, '');
        $(this).val(value);
    });
    $("#addressBar").on("focus", function(){
        if(locationData != null) changeGraphicSection("MAP");
    });

    //about your place2

    $('input[name="RoofType"]').change(function(){
        changeGraphicSection($('input[name="RoofType"]:checked').val());
        checkNextButtonState();
    });
    $('input[name="TimeUse"]').change(function(){
        var selectedValue = $("input[name='TimeUse']:checked").attr('id');
        changeGraphicSection(`CHART/${selectedValue}`);
        checkNextButtonState();
    });
    $('input[name="netMeter"]').change(function(){
        var selectedValue = $("input[name='netMeter']:checked").attr('value');
        changeGraphicSection(`NETMETER/${selectedValue}`);
        checkNextButtonState();
    });

    $('input[name="PowerType"]').change(function(){
        checkNextButtonState();
    });

    $('input[name="voltage"]').change(function(){
        checkNextButtonState();
    });

    //finalContent
    $("#adjustSizeBtn").click(function(){
        var $adjustSystemSize = $("#adjustSystemSize");

        if ($adjustSystemSize.is(":visible")) {
            $adjustSystemSize.fadeOut('fast');
            $("#utilityBillRangeInput").val(tempUserData.monthlyBill - results.systemEstimates.monthlyIncome).trigger('input');
        } else {
            $adjustSystemSize.fadeIn('slow');
        }
    })

    $("#backupPowerBtn").click(function(){
        var batteryItem = $("#systemList li.batteryItem");
        
        if(batteryItem.length && batteryItem.is(':visible')) { // Check for existence and visibility
            // Hide the battery item
            $(".batteryItem").fadeOut('fast');
    
            // Revert the button's style and text with animation
            $(this).fadeOut(function() {
                $(this).removeClass('btn-success').addClass('btn-outline-dark').text("Need Backup Power?");
                $(this).fadeIn('fast');
            });
        
            // Hide the NIP text with animation
            $(".nipText").fadeOut('fast');

            tempUserData.battery = false;
        } 
        else {
            // Show the battery item
            $(".batteryItem").fadeIn('fast');
        
            // Change the button's style and text with animation
            $(this).fadeOut(function() {
                $(this).removeClass('btn-outline-dark').addClass('btn-success').text("Backup Power ✔");
                $(this).fadeIn('fast');
            });
        
            // Show the NIP text with animation
            $(".nipText").fadeIn('fast');

            tempUserData.battery = true;
        }
    });
    

    $("#utilityBillRangeInput").on('input', function() {
        var inputValue = $(this).val();
    
        // Format the number as currency with commas
        var formattedValue = new Intl.NumberFormat('en-US').format(inputValue);
    
        // Update the newBillText with the formattedValue
        $("#newBillText").text('₱' + formattedValue);
    
        // Check if inputValue is less than results.minimumUtilityBill
        if (inputValue < results.minimumUtilityBill) {
            // Change input color to danger and show warning text
            $("#utilityBillRangeWarning").fadeIn();
        } else {
            // Revert input color and hide warning text
            $("#utilityBillRangeWarning").fadeOut();
        }
    });

    $("#recalculateSystemDesign").click(async function() {
        tempUserData.newRequestedMonthlyBill =  $("#utilityBillRangeInput").val();

        results = await getSolarDesignData();
        setDesignContent();
        $("#adjustSystemSize").fadeOut();

        //log analytics
        analytics.logEvent('sds_redesign', {
            sessionID: sessionStart,
          });
        
    })
    
    // Final Confirmation Page

    $('#phoneNumberInput').on('input', function() {
        var number = $(this).val().replace(/[^\d]/g, ''); // Remove non-digits
        if (number.length > 4) {
            number = number.substring(0, 4) + '-' + number.substring(4);
        }
        if (number.length > 8) {
            number = number.substring(0, 8) + '-' + number.substring(8);
        }
        $(this).val(number.substring(0, 13)); // Limit to 13 characters
    });

    // Auto-fill emailInput based on emailInput2
    $('#emailInput2').on('input', function() {
        var emailInput2Value = $(this).val().trim();

        if (emailInput2Value) {
            $('#emailInput').val(emailInput2Value);
        } else {
            $('#emailInput').val(''); // Clear emailInput if emailInput2 is empty
        }
    });

    
    $("#nextButtonFinal").click(async function() {
        var name = $('#nameInput').val().trim();
        var email = $('#emailInput').val().trim();
        var phoneNumber = $("#phoneNumberInput").val();
        var isValid = true;

        clearErrors();

        if (name === "") {
            showError('#nameError', "Name is incomplete!");
            isValid = false;
        }

        if (email === "" || !isValidEmail(email)) {
            showError('#emailError', "Email is incomplete or not in the proper format!");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        $('#contactInputDiv :input').prop('disabled', true);
        $('#finalSpinner').fadeIn();

        // Save data to Firebase
        tempUserData.saveInfoOnly = true;
        tempUserData.name = name;
        tempUserData.phoneNumber = phoneNumber;
        tempUserData.email = email;

        try {
            await getSolarDesignData();
        } catch (error) {
            console.error("Error fetching solar design data:", error.message);
            return;
        }

        $("#informationSentDiv").siblings().fadeOut('slow').promise().done(function () {
            $("#informationSentDiv").fadeIn('slow');
        });

        $(window).off('beforeunload');

        // Log analytics
        analytics.logEvent('sds_complete_contact', {
            sessionID: sessionStart,
        });
    });


    $("#sendButtonModal").click(async function(event) {
        event.preventDefault();
        console.log("sendButtonModal clicked");
        var email = $('#emailInput2').val().trim();
        var confirmEmail = $('#confirmInput2').val().trim();
        var isValid = true;
    
        clearErrors();
    
        if (email === "" || !isValidEmail(email)) {
            showError('#emailError', "Email is incomplete or not in the proper format!");
            isValid = false;
        }
        if (email !== confirmEmail) {
            showError('#confirmEmailError', 'Email addresses do not match. Please check and try again.');
            isValid = false;
        }
    
        if (!isValid) {
            return;
        }
    
        $('#contactInputDiv :input').prop('disabled', true);
        $('#emailSpinner').fadeIn();

    
        tempUserData.saveEmailOnly = true;
        tempUserData.email = email;
        
        disableLoadingDiv = true;
    
        try {
            await getSolarDesignData();
    
            $('#emailSpinner').hide();
            $('#sendButtonModal').html('Sent <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-4 4.5a.75.75 0 0 1-1.08 0l-2-2a.75.75 0 1 1 1.08-1.05l1.47 1.47 3.47-3.97z"/></svg>');
    
        } catch (error) {
            console.error("Error fetching solar design data:", error.message);
        } finally {
            disableLoadingDiv = false;
        }
    });
    

    $("#backButtonFinal").click(function(){
        currentDiv--
        //hide last section
        $("#contentRow").siblings().fadeOut('slow').promise().done(function () {
            $("#contentRow").fadeIn('slow');
            updateSaveButtonVisibility();
        });
    });

    checkNextButtonState();
    checkBackButtonState();
}

// --- Event Handlers ---

async function onNextButtonClick() {
    currentDiv++;
    if (currentDiv < sectionDivs.length) {
        $(sectionDivs[currentDiv]).siblings().fadeOut('fast').promise().done(function () {
            $(sectionDivs[currentDiv]).fadeIn('slow');
        });
    } else {
        //show last section
        $("#finalDesignRow").siblings().fadeOut('slow').promise().done(function () {
            $("#finalDesignRow").fadeIn('slow');
        });
    }

    switch (currentDiv) {
        case 1:
            tempUserData.buildingType = $("input[name='buildingRadio']:checked").attr('data');
            tempUserData.address = $("#addressBar").val();
            tempUserData.monthlyBill = parseInt($("#averageElectricityInput").val().replace(/,/g, ''));;
            tempUserData.coordinates = `${marker.getPosition().lat()},${marker.getPosition().lng()}`

            changeGraphicSection(tempUserData.roofType);

            //show power type if commercial
            if(tempUserData.buildingType == "commercial"){ $("#commercialPowerTypeDiv").fadeIn();} else { $("#commercialPowerTypeDiv").fadeOut();}
            if(tempUserData.buildingType == "commercial"){$("#voltageTypeDiv").fadeIn();} else { $("#voltageTypeDiv").fadeOut();}
            break;
        case 2:
            tempUserData.roofType = $("input[name='RoofType']:checked").attr('data');
            tempUserData.lineType = $("input[name='PowerType']:checked").attr('data');
            tempUserData.timeOfUse = $("input[name='TimeUse']:checked").attr('data');
            tempUserData.netMetering = $("input[name='netMeter']:checked").attr('data');
            tempUserData.lineVoltage =  $("input[name='voltage']:checked").attr('data');
            tempUserData.lineType = $("input[name='PowerType']:checked").attr('data');

            results = await getSolarDesignData();
            setDesignContent();
            changeGraphicSection("DESIGN/panels");

            analytics.logEvent('sds_complete', {
                sessionID: sessionStart,
              });

            break;
        case 3:
            $("#finalKWPanels").html(`${(results.solarPanels.watts * results.solarPanels.count)/1000} kW Solar Panels`);
            $("#finalTotalCostText").html(`Total Cost: ₱${parseFloat(results.pricing.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
            $("#finalTwentyYearSavingsText").html(`Est. 25 Year Savings: ₱${parseFloat(results.systemEstimates.monthlyIncome * 12 * 25).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`);
            $("#finalCostIncludesText").html(`Includes installation cost, government applications & ${tempUserData.netMetering === 'no' ? '<u>does not include</u> net metering processing' : '<u>includes</u> net metering processing'}. Design & price is not final and may be subject to change upon finalization.`);

            break;
        default:
            break;
    }

    checkBackButtonState();
    checkNextButtonState();
    updateSaveButtonVisibility();
    resetSaveButtonModal();
}

function onBackButtonClick(){
    currentDiv--;
    if (currentDiv >= sectionDivs.length) {
        currentDiv = 0;
    }

    $(sectionDivs[currentDiv]).siblings().fadeOut('fast').promise().done(function () {
        $(sectionDivs[currentDiv]).fadeIn('slow');
    });

    switch (currentDiv) {
        case 0:
            changeGraphicSection("MAP");
            break;
        case 1:
            var selectedValue = $("input[name='netMeter']:checked").attr('value');
            changeGraphicSection(`NETMETER/${selectedValue}`);
            break;
        default:
            break;
    }

    checkBackButtonState();
    checkNextButtonState();
    updateSaveButtonVisibility();
    resetSaveButtonModal();
}

function checkNextButtonState() {
    switch (currentDiv) {
        case 0:
            const electricityInput = $("#averageElectricityInput").val();
            const largeBill = (parseFloat(electricityInput.replace(/,/g, '')) >= 80000)

            if(largeBill){
                $("#contactPageLink").fadeIn();
            }

            if (electricityInput && locationData && !largeBill) {
                $("#nextButton").prop('disabled', false);
                
            } else {
                $("#nextButton").prop('disabled', true);
            }
            break;
        case 1:
            const roofTypeDone = $('input[name="RoofType"]:checked').length > 0;
            const electricityTimeUseDone = $('input[name="TimeUse"]:checked').length > 0;
            const netMeteringDone = $('input[name="netMeter"]:checked').length > 0;
            const voltageDone = $('input[name="buildingRadio"]:checked').attr('data') === 'residential' || $('input[name="voltage"]:checked').length > 0;
            const commercialDone = $('input[name="buildingRadio"]:checked').attr('data') === 'residential' || ($('input[name="PowerType"]:checked').length > 0);

            if (roofTypeDone && electricityTimeUseDone && netMeteringDone && voltageDone && commercialDone) {
                $("#nextButton").prop('disabled', false);
            } else {
                $("#nextButton").prop('disabled', true);
            }

            break;
        case 2:
            break;
        default:
            break;
    }

}


function checkBackButtonState() {

    switch (currentDiv) {
        case 0:
            $("#backButton").prop('disabled', true);
            break;
        default:
            $("#backButton").prop('disabled', false);
            break;
    }

}

function updateSaveButtonVisibility() {
    if (currentDiv === 2 && !$("#saveButton").is(":visible")) {
        $("#saveButton").fadeIn();
    } else if (currentDiv !== 2 && $("#saveButton").is(":visible")) {
        $("#saveButton").fadeOut();
    }
}

function resetSaveButtonModal() {
    var email = $('#emailInput2').val().trim();
    var confirmEmail = $('#confirmInput2').val().trim();
    tempUserData.saveEmailOnly = false;

    if (email && confirmEmail) { 
        $('#emailInput2').val('');
        $('#confirmInput2').val('');

        clearErrors();

        $('#contactInputDiv :input').prop('disabled', false);
        $('#sendButtonModal').html('Send');
    }
}

function clearErrors() {
    $('#nameError').text('');
    $('#emailError').text('');
    $('#confirmEmailError').text('');
    $('#phoneError').text('');
    $('#nameInput').removeClass('is-invalid');
    $('#emailInput').removeClass('is-invalid');
    $('#emailInput2').removeClass('is-invalid');
    $('#confirmInput2').removeClass('is-invalid');
    $('#phoneNumberInput').removeClass('is-invalid');
}

function showError(selector, message) {
    $(selector).text(message);
    $(selector.replace('Error', 'Input')).addClass('is-invalid');
}




// --- Helper Functions ---
var sds_assets_cache = {};
async function changeGraphicSection(option) {
    switch (option) {
        case "BUILDING/HOME":
            $('#imageContent').siblings().fadeOut('fast', function () {
                $('#imageContent').attr('src', '/assets/img/backgrounds/banners/residential-main.webp');
                $('#imageContent').fadeIn('slow');
            });
            break;
        case "BUILDING/COMMERCIAL":
            $('#imageContent').siblings().fadeOut('fast', function () {
                $('#imageContent').attr('src', 'https://images.pexels.com/photos/9799994/pexels-photo-9799994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
                $('#imageContent').fadeIn('fasslowt');
            });
            break;
        case "MAP":
            $('#mapDiv').siblings().fadeOut('fast', function () {
                $('#mapDiv').fadeIn('slow');
            });
            break;
        case "ROOF":
            if (sds_assets_cache.default == undefined){
                sds_assets_cache.default = "/assets/img//stock/roof-types.webp"
            }

            $('#imageContent').attr('src', sds_assets_cache.default);
            $('#imageContent').fadeIn('fast');
            $("#imageContent").siblings().fadeOut('slow')
            break;
        case "ROOF/METAL":
            if (sds_assets_cache.metal == undefined){
                sds_assets_cache.metal = "/assets/img//stock/metal-roof.webp"
            }

            $('#imageContent').attr('src', sds_assets_cache.metal);
            $('#imageContent').fadeIn('fast');
            $("#imageContent").siblings().fadeOut('slow')
            break;
        case "ROOF/SHINGLES":
            if (sds_assets_cache.shingles == undefined){
                sds_assets_cache.shingles = "/assets/img//stock/shingles-roof.webp";
            }

            $('#imageContent').attr('src', sds_assets_cache.shingles);
            $('#imageContent').fadeIn('slow');
            $("#imageContent").siblings().fadeOut('fast')

            break;
        case "ROOF/TILES":
            if (sds_assets_cache.tiles == undefined){
                sds_assets_cache.tiles = "/assets/img/stock/tiles-roof.webp"
            } 

            $('#imageContent').attr('src', sds_assets_cache.tiles);
            $('#imageContent').fadeIn('fast');
            $("#imageContent").siblings().fadeOut('slow');
            break;
        case "ROOF/FLAT":

            if(sds_assets_cache.flat == undefined){
                sds_assets_cache.flat = "/assets/img/stock/flat-roof.webp";
            }

            $('#imageContent').attr('src', sds_assets_cache.flat);
            $('#imageContent').fadeIn('fast');
            $("#imageContent").siblings().fadeOut('slow');
            break;

        case "CHART/nightTimeBtn":
            var nightTimeData = {
                labels: ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
                datasets: [{
                    label: '% Energy Usage',
                    data: [16, 17, 17, 15, 5, 5, 4, 5, 4, 13, 15, 16],
                    fill: true

                }]
            };
            updateChart(nightTimeData);

            $('#chart').siblings().fadeOut('fast', function () {
                $('#chart').fadeIn('slow');
            });
            break;
        case "CHART/daytimeBtn":

            var dayTimeData = {
                labels: ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
                datasets: [{
                    label: '% Energy Usage',
                    data: [2, 2, 3, 3, 16, 16, 18, 16, 17, 4, 4, 3],
                    fill: true
                }]
            };

            updateChart(dayTimeData);

            $('#chart').siblings().fadeOut('fast', function () {
                $('#chart').fadeIn('slow');
            });
            break;
        case "CHART/twentyFourSevenBtn":

            var twentyFourSevenData = {
                labels: ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
                datasets: [{
                    label: '% Energy Usage',
                    data: [9, 10, 9, 9, 9, 10, 10, 10, 10, 10, 11, 9],
                    fill: true
                }]
            };
            updateChart(twentyFourSevenData);

            $('#chart').siblings().fadeOut('fast', function () {
                $('#chart').fadeIn('slow');
            });
            break;
        case "CHART/idkBtn3":

            var idkData = {
                labels: ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
                datasets: [{
                    label: '% Energy Usage',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                }]
            };
            updateChart(idkData);

            $('#chart').siblings().fadeOut('fast', function () {
                $('#chart').fadeIn('slow');
            });
            break;
        case "NETMETER/yes":
            //start load video;
            sds_assets_cache.netMeteringURL = sds_assets_cache.netMeteringURL ?? await getStorageSource('website/demos/net-metering_kylxnr.mp4');
            $('#myVideo').children('source').attr('src', sds_assets_cache.netMeteringURL);
            $('#myVideo')[0].load(); // needed to load the new source

        
            $('#video-player').siblings().fadeOut('fast', function () {
                $('#video-player').fadeIn('fast');
            });

            $("#net-metering-text").text("Sell your excess electricity during the daytime and get credited for this power. Adding more panels is ideal for this setup.");

            break;
        case "NETMETER/no":
            sds_assets_cache.noNetMeteringURL = sds_assets_cache.noNetMeteringURL ?? await getStorageSource('website/demos/no_net_meter_sfrkh4.mp4'); 
            $('#myVideo').children('source').attr('src', sds_assets_cache.noNetMeteringURL);
            $('#myVideo')[0].load(); // needed to load the new source

            $('#video-player').siblings().fadeOut('fast', function () {
                $('#video-player').fadeIn('fast');
            });

            $("#net-metering-text").text("Solar power will be limited to your own electricity load & draw extra power from the grid at night.");

            break;

        case "DESIGN/panels":
            $('#panelsDiv').siblings().fadeOut('fast', function () {
                $('#panelsDiv').fadeIn('slow');
            });
            break;

        default:
            break;
    }

}

function initMap() {
    var zoom = 10;
    var latLng = {
        lat: 14.6760,
        long: 121.0438,
    }
    map = new google.maps.Map(document.getElementById('map'), {
        zoom,
        mapTypeId: 'satellite',
        center: { lat: latLng.lat, lng: latLng.long },
        minZoom: zoom - 5,
        gestureHandling: "cooperative",
        disableDefaultUI: true,
        mapTypeControl: false,
        zoomControl: false,
        restriction: {
            latLngBounds: {
                north: latLng.lat + 7,
                south: latLng.lat - 12,
                east: latLng.long + 8,
                west: latLng.long - 9,
            },
        },
    });

    marker = new google.maps.Marker({ map: map });
    marker.set("id", "marker");

    //places auto complete
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("addressBar"),
        {
            componentRestrictions: { 'country': ['PH'] },
            fields: ["address_component", "adr_address", "business_status", "formatted_address", "geometry", "icon", "icon_mask_base_uri", "icon_background_color", 'name', "photo", "place_id", "plus_code", "type", "url", "vicinity"],

        });

    autocomplete.addListener('place_changed', onPlaceChanged)


    //On Map Dragged
    google.maps.event.addListener(map, 'dragend', function () {
        if (marker.getPosition() != null) {
            marker.setPosition(this.getCenter()); // set marker position to map center
        }

    });
}

function updateChart(data){
    var ctx = document.getElementById('chart').getContext('2d');

    if(myChart == null){
        myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Relative Energy Usage (%)'
                        },
                        grid: {
                            drawOnChartArea: false, // Disable drawing the lines on the chart area
                            drawBorder: false, // Disable drawing the border lines
                            color: 'rgba(0,0,0,0)' // Set color to transparent
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time of Day'
                        },
                        grid: {
                            drawOnChartArea: false, // Disable drawing the lines on the chart area
                            drawBorder: false, // Disable drawing the border lines
                            color: 'rgba(0,0,0,0)' // Set color to transparent
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Electricity Usage Throughout the Day'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    } else {
        myChart.data = data;
        myChart.update();
    }
    
}

function onPlaceChanged() {
    var place = autocomplete.getPlace();

    if (!place.geometry) {
        document.getElementById("searchBar").placeHolder = 'Enter a place';
    } else {

        changeGraphicSection("MAP");

        var geocoder = new google.maps.Geocoder();

        //place marker inside place id
        geocoder.geocode({ placeId: place.place_id }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {

                marker.setPosition(results[0].geometry.location);
                map.setZoom(18);
                map.panTo(results[0].geometry.location);

                //Check for location inside circle
                locationData = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                };

                $("#coordinates-text").text("Coordinates: " + locationData.lat + ", " + locationData.lng);
                checkNextButtonState();
            } else {
            }
        });
    }
}

function arePointsInside(checkPoint, centerPoint, km) {
    console.log(checkPoint, centerPoint, km);
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

async function getSolarDesignData() {
    if (!disableLoadingDiv) {
        $("#loadingDiv").fadeIn(); // Show loadingDiv if not disabled
    }

    // const url = new URL('http://localhost:5001/axcent-866d5/us-central1/solarDesign');
    const url = new URL('https://us-central1-axcent-866d5.cloudfunctions.net/solarDesign');

    // Append tempUserData properties to the URL
    Object.keys(tempUserData).forEach(key => url.searchParams.append(key, tempUserData[key]));

    console.log(tempUserData);

    const response = await fetch(url, {
        method: 'GET',
    });

    const responseBody = await response.text();

    let responseJSON;
    try {
        responseJSON = JSON.parse(responseBody);
    } catch (error) {
        responseJSON = responseBody; // If JSON parsing fails, treat responseBody as a plain string
    }

    if (typeof responseJSON === 'object' && responseJSON.documentID) {
        tempUserData.documentID = responseJSON.documentID;
        console.log(tempUserData);
    } else if (typeof responseJSON === 'string') {
        console.log("Received string response:", responseJSON);
    }

    if (!disableLoadingDiv) {
        $("#loadingDiv").fadeOut(); // Hide loadingDiv if not disabled
    }
    return responseJSON;
}


function setDesignContent(){

    $("#panelsCountText").html(`${results.solarPanels.count}x Panels`);
    $("#panelWattageText").html(`${results.solarPanels.watts}W`);
    $("#squareFootText").html(`${parseFloat(results.solarPanels.sqm).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m<sup>2</sup>`);

    $("#systemKwList").html(`${(results.solarPanels.watts * results.solarPanels.count)/1000} kW Solar Panels`);
    
    $("#oldBillText").html(`₱${parseFloat(tempUserData.monthlyBill).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    $("#newBillText").html(`₱${parseFloat(tempUserData.monthlyBill - results.systemEstimates.monthlyIncome).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    $("#utilityBillRangeInput").attr("max", tempUserData.monthlyBill * 0.9);
    $("#utilityBillRangeInput").val(tempUserData.monthlyBill - results.systemEstimates.monthlyIncome).trigger('input');
    
    $("#solarAmountProgressBar").children().html(`₱${parseFloat(tempUserData.monthlyBill - results.systemEstimates.monthlyIncome).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    $("#solarAmountProgressBar .progress-bar").css("width", `${(1 - (results.systemEstimates.monthlyIncome/tempUserData.monthlyBill)) * 100}%`);
    $("#totalMonthlyBillText").html(`₱${parseFloat(tempUserData.monthlyBill).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    $("#monthlySavingsText").html(`₱${parseFloat(results.systemEstimates.monthlyIncome).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    $("#monthlyGenerationText").html(`${results.systemEstimates.monthlyGeneration} kWh`);
    
    $("#totalSystemCostText").html(`₱${parseFloat(results.pricing.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    $("#solarkwhRateText").html(`₱${parseFloat(results.pricing.total / (results.systemEstimates.monthlyGeneration * 12 * 20)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/kWh`);
    $("#utilitykwhRateText").html(`₱${parseFloat(results.utility.utilityRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/kWh`);

    var ctx = document.getElementById('ROIChart').getContext('2d');
    if (roiChart) {
        roiChart.destroy();
    }
    roiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: results.systemEstimates.twentyFiveYearForecast.forecast.map(item => item.year),
            datasets: [
                {
                    label: 'Return On Investment',
                    backgroundColor: results.systemEstimates.twentyFiveYearForecast.forecast.map(item => 
                        item.returnOnInvestment < 0 ? 'rgb(182, 53, 46)' : 'rgb(61, 90, 215)'
                    ), // Setting the background color for the bars based on the value
                    data: results.systemEstimates.twentyFiveYearForecast.forecast.map(item => item.returnOnInvestment),
                    fill: true,
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,  // This hides the legend
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
                x: { // X-axis configuration
                    ticks: {
                        maxRotation: 0, // This will ensure that the labels are straight and not tilted
                        minRotation: 0
                    },
                    grid: {
                        drawOnChartArea: false, // This will remove the y-axis grid lines
                    }
                }
            }
        }
    });

    //view calculation table
    var tableBody = document.querySelector("#forecastTable tbody");
    while(tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    results.systemEstimates.twentyFiveYearForecast.forecast.forEach(item => {
        var row = tableBody.insertRow();
    
        var cellYear = row.insertCell(0);
        cellYear.textContent = item.year;
    
        var cellSolarGeneration = row.insertCell(1);
        cellSolarGeneration.textContent = formatNumberWithCommas(item.solarGeneration) + " kWh";
    
        var cellElectricityRate = row.insertCell(2);
        cellElectricityRate.textContent = "P" + item.electricityRate;
    
        var cellNetMeteringRate = row.insertCell(3);
        cellNetMeteringRate.textContent = "P" + item.netMeteringRate;

        var cellAnnualSavings = row.insertCell(4);
        cellAnnualSavings.textContent =  "P" + formatNumberWithCommas(item.annualSavings);
    
        var cellROI = row.insertCell(5);
        cellROI.textContent = "P" + formatNumberWithCommas(item.returnOnInvestment);

        // Change text color if returnOnInvestment is negative
        if (item.returnOnInvestment < 0) {
            cellROI.style.color = 'red';
        }
    });
    //params
    var paramsTable = document.querySelector("#defaultParameters tbody");
    while(paramsTable.firstChild) {
        paramsTable.removeChild(paramsTable.firstChild);
    }
    var row = paramsTable.insertRow();
    row.insertCell(0).textContent = results.systemEstimates.twentyFiveYearForecast.sunlightHours;
    row.insertCell(1).textContent = (results.systemEstimates.twentyFiveYearForecast.electricityRateIncrease * 100) + "%";
    row.insertCell(2).textContent = results.systemEstimates.twentyFiveYearForecast.degradationRate * 100 + "%";
    row.insertCell(3).textContent = results.systemEstimates.twentyFiveYearForecast.exportEnergyPercentage * 100 + "%";

    $("#returnInTwentyFiveYearsText").html(`₱${parseFloat(results.systemEstimates.twentyFiveYearForecast.forecast[results.systemEstimates.twentyFiveYearForecast.forecast.length - 1].returnOnInvestment).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`);
    $("#returnYOYText").html(`+${parseFloat((results.systemEstimates.monthlyIncome * 12 / results.pricing.total)*100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%`);
   
    $("#tonnesCO2EText").html(`${parseFloat(results.environment.savingsCO2ePerMonth).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    $("#maturedTreesText").html(`${parseFloat(results.environment.matureTrees).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    $("#gasolineCarKMText").html(`${parseFloat(results.environment.gasolineCarKM).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

    var energyMixCtx = document.getElementById('energyMixChart').getContext('2d');
    var energyMixDataSet = [
        {
            label: 'Building Usage %',
            data: [100],
            backgroundColor: 'rgba(0,0,0,1)',
            borderWidth: 1,
        },
        {
            label: 'Utility %',
            data: [Math.round(Math.max(0, (1 - (results.systemEstimates.monthlyGeneration / results.utility.kWhPerMonth)) * 100))],
            backgroundColor: 'rgba(149,154,159,1)',
            borderWidth: 1,
        },
        {
            label: 'Solar %',
            data: [Math.round((results.systemEstimates.monthlyGeneration / results.utility.kWhPerMonth)*100)],
            backgroundColor: 'rgba(252,158,9,1)',
            borderWidth: 1,
        }
    ]
    energyMixDataSet = energyMixDataSet.sort((a, b) => b.data[0] - a.data[0]);

    if (energyMixChart) {
        energyMixChart.destroy();
    }
    energyMixChart = new Chart(energyMixCtx,  {
        type: 'bar',
        data: {
            labels: ['Energy Mix'],
            datasets: energyMixDataSet,
        },
        options: {
            indexAxis: 'y',
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },scales: {
                y: {
                    display: false,
                    title: {
                        display: false  // Turn off y-axis title
                    }
                }
            }
            
        }
    });


}
