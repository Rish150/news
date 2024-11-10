// Check if JWT token exists; if not, redirect to login
var jwt = localStorage.getItem("jwt");
if (jwt == null) {
  window.location.href = "./login.html";
}

function loadUser() {
  // Since Reqres doesn't link token to user data, we'll fetch a static user
  const userId = 2; // You can choose any valid user ID from Reqres

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `https://reqres.in/api/users/${userId}`); // Updated endpoint
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  
  // Optionally, you can pass the token in the headers if needed
  // xhttp.setRequestHeader("Authorization", "Bearer " + jwt);

  xhttp.send();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status === 200) {
        const response = JSON.parse(this.responseText);
        const user = response["data"];
        document.getElementById("fname").innerHTML = `${user.first_name} ${user.last_name}`;
        document.getElementById("avatar").src = user.avatar;
        document.getElementById("username").innerHTML = user.email;
      } else {
        Swal.fire({
          text: "Failed to load user information.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Handle network errors
  xhttp.onerror = function() {
    Swal.fire({
      text: "An error occurred while loading user information.",
      icon: "error",
      confirmButtonText: "OK",
    });
  };
}

loadUser();

function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "./login.html";
}
