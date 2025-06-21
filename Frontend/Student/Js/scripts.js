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
document.addEventListener("DOMContentLoaded", function () {
      const internships = JSON.parse(localStorage.getItem("internships")) || [];

      const container = document.getElementById("internship-list");

      if (internships.length === 0) {
        container.innerHTML = "<p>No internships available at the moment.</p>";
        return;
      }

      internships.forEach(internship => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <h3>${internship.title}</h3>
          <p><strong>Company:</strong> ${internship.company}</p>
          <p><strong>Location:</strong> ${internship.location}</p>
          <p><strong>Duration:</strong> ${internship.duration}</p>
          <p>${internship.description}</p>
          <button onclick="applyInternship('${internship.title}')">Apply Now</button>
        `;
        container.appendChild(card);
      });
    });

    function applyInternship(title) {
      alert("You have applied for: " + title);
      // You can store application info here or redirect
    }
       // Load profile on page load
    window.onload = function () {
      const student = JSON.parse(localStorage.getItem("student"));
      if (student) {
        document.getElementById("fullName").value = student.fullName || "";
        document.getElementById("email").value = student.email || "";
        document.getElementById("university").value = student.university || "";
        document.getElementById("major").value = student.major || "";
        document.getElementById("phone").value = student.phone || "";
      }
    };

    function updateProfile(event) {
      event.preventDefault();

      const updatedStudent = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        university: document.getElementById("university").value,
        major: document.getElementById("major").value,
        phone: document.getElementById("phone").value,
        password: JSON.parse(localStorage.getItem("student")).password // keep old password
      };

      localStorage.setItem("student", JSON.stringify(updatedStudent));
      document.getElementById("successMsg").style.display = "block";
    }
    function handleSignup(event) {
      event.preventDefault();

      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("email").value;
      const university = document.getElementById("university").value;
      const major = document.getElementById("major").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const studentData = {
        fullName,
        email,
        university,
        major,
        phone,
        password
      };

      localStorage.setItem("student", JSON.stringify(studentData));
      alert("Signup successful! Redirecting to your dashboard...");
      window.location.href = "../Images/index.html"; // Student dashboard
    }
