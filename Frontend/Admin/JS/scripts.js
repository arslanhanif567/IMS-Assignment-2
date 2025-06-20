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
    // JS for the applications part 

    let applications = [
      {
        id: 1,
        studentName: "Ali Khan",
        internshipTitle: "Frontend Developer Intern",
        email: "ali@example.com",
        status: "Pending"
      },
      {
        id: 2,
        studentName: "Sara Ahmed",
        internshipTitle: "Backend Developer Intern",
        email: "sara@example.com",
        status: "Accepted"
      },
      {
        id: 3,
        studentName: "Zain Raza",
        internshipTitle: "UI/UX Designer Intern",
        email: "zain@example.com",
        status: "Rejected"
      }
    ];

    const container = document.getElementById("applications-container");
    const filterSelect = document.getElementById("statusFilter");

    function renderApplications() {
      const filterValue = filterSelect.value;
      container.innerHTML = "";

      const filteredApps = applications.filter(app => {
        return filterValue === "All" || app.status === filterValue;
      });

      if (filteredApps.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:gray;'>No applications found for selected filter.</p>";
        return;
      }

      filteredApps.forEach(app => {
        const card = document.createElement("div");
        card.className = "application-card";
        card.innerHTML = `
          <h3>${app.studentName}</h3>
          <p><strong>Internship:</strong> ${app.internshipTitle}</p>
          <p><strong>Email:</strong> ${app.email}</p>
          <p class="status"><strong>Status:</strong> <span>${app.status}</span></p>
          <div class="action-buttons">
            <button class="accept-btn">Accept</button>
            <button class="reject-btn">Reject</button>
            <button class="delete-btn">Delete</button>
          </div>
        `;

        // Button actions
        card.querySelector(".accept-btn").onclick = () => updateStatus(app.id, "Accepted");
        card.querySelector(".reject-btn").onclick = () => updateStatus(app.id, "Rejected");
        card.querySelector(".delete-btn").onclick = () => deleteApplication(app.id);

        container.appendChild(card);
      });
    }

    function updateStatus(id, newStatus) {
      const app = applications.find(app => app.id === id);
      if (app) {
        app.status = newStatus;
        renderApplications();
      }
    }

    function deleteApplication(id) {
      applications = applications.filter(app => app.id !== id);
      renderApplications();
    }

    filterSelect.addEventListener("change", renderApplications);

    renderApplications(); // Initial render

    // Pre-shown-internships 
    
  const defaultInternships = [
    {
      role: "Frontend Developer Intern",
      company: "TechNova",
      description: "Work with HTML, CSS, and JavaScript to build responsive UI.",
      location: "Dubai",
      salary: "AED 2000",
      startDate: "2025-07-01",
      endDate: "2025-09-30"
    },
    {
      role: "Data Analyst Intern",
      company: "DataScope",
      description: "Analyze business data and generate reports using Excel and Python.",
      location: "Abu Dhabi",
      salary: "AED 2500",
      startDate: "2025-08-01",
      endDate: "2025-10-31"
    },
    {
      role: "Cybersecurity Intern",
      company: "SecureTech",
      description: "Assist in penetration testing and system monitoring.",
      location: "Sharjah",
      salary: "AED 3000",
      startDate: "2025-07-15",
      endDate: "2025-09-15"
    }
  ];

  // Load internships or insert defaults if not present
  let internships = JSON.parse(localStorage.getItem("internships"));
  if (!internships || internships.length === 0) {
    internships = defaultInternships;
    localStorage.setItem("internships", JSON.stringify(internships));
  }

  const listDiv = document.getElementById("internship-list");

  function renderInternships() {
    listDiv.innerHTML = internships.length === 0 ? '<p>No internships found.</p>' : "";
    internships.forEach((intern, index) => {
      const card = document.createElement("div");
      card.className = "internship-card";
      card.innerHTML = `
        <h3>${intern.role} - ${intern.company}</h3>
        <p><strong>Location:</strong> ${intern.location}</p>
        <p><strong>Salary:</strong> ${intern.salary}</p>
        <p><strong>Start Date:</strong> ${intern.startDate}</p>
        <p><strong>End Date:</strong> ${intern.endDate}</p>
        <p>${intern.description}</p>
        <button class="delete-btn" onclick="deleteInternship(${index})">Delete</button>
      `;
      listDiv.appendChild(card);
    });
  }

  function openForm() {
    document.getElementById("formModal").style.display = "flex";
  }

  function closeForm() {
    document.getElementById("formModal").style.display = "none";
  }

  function submitInternship() {
    const role = document.getElementById("role").value;
    const company = document.getElementById("company").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;
    const salary = document.getElementById("salary").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!role || !company) return alert("Job Title and Company Name are required!");

    internships.push({ role, company, description, location, salary, startDate, endDate });
    localStorage.setItem("internships", JSON.stringify(internships));

    closeForm();
    renderInternships();
  }

  function deleteInternship(index) {
    if (confirm("Are you sure you want to delete this internship?")) {
      internships.splice(index, 1);
      localStorage.setItem("internships", JSON.stringify(internships));
      renderInternships();
    }
  }

  window.onclick = function(event) {
    if (event.target == document.getElementById("formModal")) {
      closeForm();
    }
  }

  renderInternships();
  


    