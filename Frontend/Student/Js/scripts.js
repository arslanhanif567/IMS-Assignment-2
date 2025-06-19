// Login main JS 
  function handleLogin(e) {
    e.preventDefault();

    const emailInput = document.querySelector('input[type="email"]').value;
    const passwordInput = document.querySelector('input[type="password"]').value;

    const savedStudent = JSON.parse(localStorage.getItem("student"));

    if (!savedStudent) {
      alert("No student account found. Please sign up first.");
      window.location.href = "signups.html";
      return;
    }

    if (emailInput === savedStudent.email && passwordInput === savedStudent.password) {
      alert("Login successful!");
      window.location.href = "../Images/index.html"; // Path to your student dashboard
    } else {
      alert("Incorrect email or password.");
    }
  }

