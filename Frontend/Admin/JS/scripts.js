document.addEventListener('DOMContentLoaded', () => {
    // SIGNUP FORM
    const signupForm = document.querySelector('#signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
            const companyName = document.querySelector('#companyName').value;
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;
            const confirmPassword = document.querySelector('#confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
        return;
      }

            try {
                const res = await fetch('http://localhost:3000/api/auth/admin/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ companyName, email, password }),
                });

                const data = await res.json();
                if (res.ok) {
                    alert('Signup successful! Please login.');
                    window.location.href = 'login.html';
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (err) {
                alert('An error occurred. Please try again.');
                console.error(err);
            }
        });
    }

    // LOGIN FORM
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;

            try {
                const res = await fetch('http://localhost:3000/api/auth/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    alert('Login successful!');
                    window.location.href = 'index.html'; // Redirect to admin dashboard
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (err) {
                alert('An error occurred. Please try again.');
                console.error(err);
            }
        });
    }
});

// --- INTERNSHIP MANAGEMENT ---
document.addEventListener('DOMContentLoaded', () => {
    const internshipList = document.getElementById('internship-list');
    const addInternshipForm = document.getElementById('add-internship-form');

    const fetchInternships = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/internships', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) {
                alert('Session expired. Please login again.');
                window.location.href = 'login.html';
                return;
            }
            const internships = await res.json();
            if (internshipList) {
                internshipList.innerHTML = ''; // Clear existing list
                internships.forEach(internship => {
                    const card = document.createElement('div');
                    card.className = 'internship-card';
      card.innerHTML = `
                        <h3>${internship.title} - ${internship.companyName}</h3>
                        <p><strong>Location:</strong> ${internship.location || 'N/A'}</p>
                        <p><strong>Salary:</strong> ${internship.salary || 'N/A'}</p>
                        <p><strong>Start Date:</strong> ${new Date(internship.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> ${new Date(internship.endDate).toLocaleDateString()}</p>
                        <p>${internship.description || ''}</p>
                        <button class="delete-btn" data-id="${internship.id}">Delete</button>
                    `;
                    internshipList.appendChild(card);
                });
            }
        } catch (err) {
            console.error('Failed to fetch internships:', err);
        }
    };
    
    const deleteInternship = async (id) => {
        if (!confirm('Are you sure you want to delete this internship?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/internships/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                alert('Internship deleted successfully.');
                fetchInternships(); // Refresh the list
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (err) {
            console.error('Failed to delete internship:', err);
        }
    };

    if (internshipList) {
        fetchInternships();
        internshipList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                deleteInternship(e.target.dataset.id);
            }
        });
    }

    if (addInternshipForm) {
        addInternshipForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addInternshipForm);
            const data = Object.fromEntries(formData.entries());
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/api/internships', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data),
                });
                const result = await res.json();
                if (res.ok) {
                    alert('Internship added successfully!');
                    window.location.href = 'internships.html';
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (err) {
                console.error('Failed to add internship:', err);
            }
        });
    }
    
    // --- APPLICATIONS VIEWING ---
    const applicationsContainer = document.getElementById('applications-container');
    if(applicationsContainer) {
        const fetchApplications = async () => {
             const token = localStorage.getItem('token');
             const res = await fetch('http://localhost:3000/api/admin/applications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const applications = await res.json();
            applicationsContainer.innerHTML = '';
            applications.forEach(app => {
                const card = document.createElement('div');
                card.className = 'application-card';
                card.innerHTML = `
                    <h3>${app.studentName}</h3>
                    <p><strong>Internship:</strong> ${app.internshipTitle}</p>
                    <p><strong>Email:</strong> ${app.studentEmail}</p>
                    <p class="status"><strong>Status:</strong> <span id="status-${app.id}">${app.status}</span></p>
                    <a href="http://localhost:3000/${app.resumePath}" target="_blank" class="action-btn download">Download Resume</a>
                    <div class="action-buttons">
                        <button class="action-btn accept" data-id="${app.id}">Accept</button>
                        <button class="action-btn reject" data-id="${app.id}">Reject</button>
                    </div>
                `;
                applicationsContainer.appendChild(card);
            });
        };

        applicationsContainer.addEventListener('click', async (e) => {
            if (!e.target.classList.contains('action-btn')) return;

            const id = e.target.dataset.id;
            let status = '';

            if (e.target.classList.contains('accept')) {
                status = 'Accepted';
            } else if (e.target.classList.contains('reject')) {
                status = 'Rejected';
            } else {
                return; 
            }

            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:3000/api/applications/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status })
                });

                if (res.ok) {
                    alert(`Application ${status.toLowerCase()}.`);
                    document.getElementById(`status-${id}`).textContent = status;
                } else {
                    const data = await res.json();
                    alert(`Error: ${data.error}`);
                }
            } catch (err) {
                console.error('Failed to update status:', err);
            }
        });

        fetchApplications();
    }
});
    