function registrar() {
    var fullname = $("#fullname").val();
    var email = $("#email").val();
    var username = $("#username").val();
    var password = $("#password").val();
    var cpassword = $("#cpassword").val();
    var dob = $("#dob").val();
    var latlng = $("#location").val();

    if (!fullname || !email || !password || !cpassword || !dob || !username) {
        $("#msgDiv").show().html("All fields are required.");
    } else if (cpassword !== password) {
        $("#msgDiv").show().html("Passowrds dont't match.");
    } else {
        $.ajax({
            url: "/register",
            method: "POST",
            data: {
                full_name: fullname,
                email: email, 
                password: password, 
                dob: dob, 
                username: username, 
                location: latlng
            }
        }).done(function (data) {

            if (data) {
                if (data.status == 'error') {

                    var errors = '<ul>';
                    $.each(data.message, function (key, value) {
                        errors = errors + '<li>' + value.msg + '</li>';
                    });

                    errors = errors + '</ul>';
                    $("#msgDiv").html(errors).show();
                } else {
                    $("#msgDiv").removeClass('alert-danger').addClass('alert-success').html(data.message).show();
                }
            }
        });
    }


}

