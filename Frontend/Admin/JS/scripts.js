  // signup page JS 
   function handleSignup(e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const adminData = { name, email, password };
      localStorage.setItem("admin", JSON.stringify(adminData));

      alert("Sign-up successful! Please log in.");
      window.location.href = "login.html";
   }

   // login page JS 
   function handleLogin(e) {
      e.preventDefault();

      const inputEmail = document.getElementById("email").value;
      const inputPassword = document.getElementById("password").value;

      const savedAdmin = JSON.parse(localStorage.getItem("admin"));

      if (!savedAdmin) {
        alert("No admin account found. Please sign up first.");
        window.location.href = "signups.html";
        return;
      }

      if (inputEmail === savedAdmin.email && inputPassword === savedAdmin.password) {
        alert("Login successful!");
        window.location.href = "index.html"; // admin dashboard
      } else {
        alert("Incorrect email or password.");
      }
    }