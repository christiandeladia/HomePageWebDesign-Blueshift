// analytics.logEvent('contact_open', {
//     sessionID: sessionStart,
//   });

const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('messageContent');

$("#messageInput").text(message);


function formatPhoneNumber(input) {
    var number = input.val().replace(/[^\d]/g, '');
    var isValid = true;

    if (number.length > 4) {
        number = number.substring(0, 4) + '-' + number.substring(4);
    }
    if (number.length > 8) {
        number = number.substring(0, 8) + '-' + number.substring(8);
    }
    input.val(number.substring(0, 13));

    if (number.length < 13) {
        isValid = false;
    }

    return isValid;
}

// INPUT EVENT LISTENERS---------------
$('#phoneInput').on('input', function() {
    var isValid = formatPhoneNumber($(this));
    if (isValid) {
        $("#phoneInput").removeClass("border-danger");
        $("#phoneWarning").hide();
    } else {
        $("#phoneInput").addClass("border-danger");
        $("#phoneWarning").show();
    }
});

$("#nameInput").on('input', function() {
    const nameInput = $(this);
    
    if (nameInput.val() === "") {
        nameInput.addClass("border-danger");
        $("#nameWarning").show();
    } else {
        nameInput.removeClass("border-danger");
        $("#nameWarning").hide();
    }
});

$("#emailInput").on('input', function() {
    const emailInput = $(this);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(emailInput.val())) {
        emailInput.addClass("border-danger");
        $("#emailWarning").show();
        return false;
    } else {
        emailInput.removeClass("border-danger");
        $("#emailWarning").hide();
        return true;
    }
});

$("#inquirySelect").on('change', function() {
    const inquirySelect = $(this);
    
    if (inquirySelect.val() === null) {
        inquirySelect.addClass("border-danger");
        $("#inquiryWarning").show();
    } else {
        inquirySelect.removeClass("border-danger");
        $("#inquiryWarning").hide();
    }
});

$("#messageInput").on('input', function() {
    const messageInput = $(this);
    
    if (messageInput.val() === "") {
        messageInput.addClass("border-danger");
        $("#messageWarning").show();
    } else {
        messageInput.removeClass("border-danger");
        $("#messageWarning").hide();
    }
});



// BUTTON EVENT LISTENERS---------------
$("#submitMessage").click(function() {
    $(".text-danger").hide();
    $(".form-control").removeClass("border-danger");

    // Log attempt to send message
    // analytics.logEvent('contact_attempt_send_message', {
    //     name: $("#nameInput").val(),
    //     email: $("#emailInput").val(),
    //     phoneNumber: $("#phoneInput").val(),
    //     businessName: $("#businessInput").val(),
    //     message: $("#messageInput").val(),
    //     inquiryType: $("#inquirySelect").val(),
    //     sessionID: sessionStart,
    // });

    let isValid = true;

    if ($("#nameInput").val() === "") {
        $("#nameInput").addClass("border-danger");
        $("#nameWarning").show();
        isValid = false;
    }

    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test($("#emailInput").val())) {
        $("#emailInput").addClass("border-danger");
        $("#emailWarning").show();
        isValid = false;
    }

    if ($("#phoneInput").val() === "") {
        $("#phoneInput").addClass("border-danger");
        $("#phoneWarning").show();
        isValid = false;
    }

    if ($("#inquirySelect").val() === null) {
        $("#inquirySelect").addClass("border-danger");
        $("#inquiryWarning").show();
        isValid = false;
    }

    if ($("#messageInput").val() === "") {
        $("#messageInput").addClass("border-danger");
        $("#messageWarning").show();
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    if (!$("#checkBoxContact").is(":checked")) {
        alert("Please agree to the terms by checking the box before sending the message.");
        return;
    }

    // perform your action here'
    $("#sendMessageSpinner").removeClass("visually-hidden").animate({opacity: 1}, 200);
    $("#buttonSubmitText").text("Sending Message");
    $(".form-control").prop("disabled", true);


    //send data
    var data = {
        name: $("#nameInput").val(),
        email:$("#emailInput").val(),
        phoneNumber:$("#phoneInput").val(),
        businessName: $("#businessInput").val(),
        message: $("#messageInput").val(),
        inquiryType: $("#inquirySelect").val(),
        date: Date.now(),
    }

    // var db = firebase.firestore();
    // db.collection("contact").doc().set(data).then(() => {
    //     $("#buttonSubmitText").text("Message Sent!");
    //     $("#sendMessageSpinner").addClass("visually-hidden").animate({opacity: 1}, 200);

    //     analytics.logEvent('contact_sent_message', {
    //         name: $("#nameInput").val(),
    //         email: $("#emailInput").val(),
    //         phoneNumber: $("#phoneInput").val(),
    //         businessName: $("#businessInput").val(),
    //         message: $("#messageInput").val(),
    //         inquiryType: $("#inquirySelect").val(),
    //         sessionID: sessionStart,
    //       });
    // })
    // .catch((error) => {
    //     console.error("Error writing document: ", error);
    // });

  });



function clickedMail(){
    analytics.logEvent('contact_mail_clicked', {
        sessionID: sessionStart,
      });
}

function clickedDirections(){
    analytics.logEvent('contact_directions_clicked', {
        sessionID: sessionStart,
      });
}

function clickedCall(){
    analytics.logEvent('contact_call_clicked', {
        sessionID: sessionStart,
      });
}