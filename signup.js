function registerUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const xhttp = new XMLHttpRequest();
    const apiUrl = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"; // Replace with your Web App URL

    xhttp.open("POST", apiUrl);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.send(JSON.stringify({ name, email, password }));

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status === 200) {
                Swal.fire({
                    text: "Registration successful!",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "./login.html"; // Redirect to login page
                    }
                });
            } else {
                Swal.fire({
                    text: "Registration failed. Please try again.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    return false; // Prevent form submission
}
