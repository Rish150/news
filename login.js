function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const xhttp = new XMLHttpRequest();
  const apiUrl = "https://script.google.com/macros/s/AKfycbwyU8Rbr6wq7HrU0UulhOOTONRyfvUBRR0_HgqipYahY66yJT5IVO0gXSTxeQDkvgIm/exec"; // Replace with your Web App URL

  xhttp.open("POST", apiUrl);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhttp.send(JSON.stringify({ email, password }));

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status === 200) {
        try {
          const response = JSON.parse(this.responseText);
          if (response["token"]) {
            localStorage.setItem("jwt", response["token"]); // Store the token

            Swal.fire({
              text: "Login successful!",
              icon: "success",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "./index.html"; // Redirect to index
              }
            });
          } else {
            Swal.fire({
              text: "No token received. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } catch (e) {
          Swal.fire({
            text: "Failed to parse server response. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        try {
          const errorResponse = JSON.parse(this.responseText);
          Swal.fire({
            text: errorResponse["error"] || "Login failed",
            icon: "error",
            confirmButtonText: "OK",
          });
        } catch (e) {
          Swal.fire({
            text: "Unexpected server response. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  return false; // Prevent form submission
}

function register() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");

  const xhttp = new XMLHttpRequest();
  const apiUrl = "YOUR_WEB_APP_URL?action=register"; // Replace with your Web App URL

  xhttp.open("POST", apiUrl);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhttp.send(JSON.stringify({ email, password }));

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status === 200) {
        Swal.fire({
          text: "Registration successful!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        try {
          const errorResponse = JSON.parse(this.responseText);
          Swal.fire({
            text: errorResponse["error"] || "Registration failed",
            icon: "error",
            confirmButtonText: "OK",
          });
        } catch (e) {
          Swal.fire({
            text: "Unexpected server response. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };
}
