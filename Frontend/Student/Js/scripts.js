document.addEventListener('DOMContentLoaded', () => {
    // STUDENT SIGNUP FORM
    const signupForm = document.querySelector('#signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

            const fullName = document.querySelector('#fullName').value;
            const email = document.querySelector('#email').value;
            const university = document.querySelector('#university').value;
            const major = document.querySelector('#major').value;
            const phoneNumber = document.querySelector('#phoneNumber').value;
            const password = document.querySelector('#password').value;
            const confirmPassword = document.querySelector('#confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
      return;
    }

            try {
                const res = await fetch('http://localhost:3000/api/auth/student/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, email, university, major, phoneNumber, password }),
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

    // STUDENT LOGIN FORM
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        console.log('Student login form script loaded. Attaching listener.');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login form submitted.');

            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;

            console.log(`Attempting to log in user: ${email}`);

            try {
                const res = await fetch('http://localhost:3000/api/auth/student/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                console.log('Fetch request sent. Server responded with status:', res.status);

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    alert('Login successful!');
                    window.location.href = 'index.html'; // Redirect to student dashboard
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (err) {
                alert('An error occurred. Please try again.');
                console.error('Fetch error:', err);
            }
        });
    }
});

// --- INTERNSHIP VIEWING & APPLYING ---
document.addEventListener('DOMContentLoaded', () => {
    const internshipList = document.getElementById('internship-list');
    
    if (internshipList) {
        const fetchInternships = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/internships', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const internships = await res.json();
            
            internshipList.innerHTML = '';
            internships.forEach(internship => {
                const card = document.createElement('div');
                card.className = 'internship-card'; // Make sure you have this class in your CSS
                card.innerHTML = `
                    <h3>${internship.title} - ${internship.companyName}</h3>
                    <p><strong>Location:</strong> ${internship.location || 'N/A'}</p>
                    <p><strong>Salary:</strong> ${internship.salary || 'N/A'}</p>
                    <p><strong>Start Date:</strong> ${new Date(internship.startDate).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> ${new Date(internship.endDate).toLocaleDateString()}</p>
                    <p>${internship.description || ''}</p>
                    <input type="file" class="resume-upload" id="resume-${internship.id}" required>
                    <button class="apply-btn" data-id="${internship.id}">Apply</button>
                `;
                internshipList.appendChild(card);
            });
        };

        fetchInternships();
    }
    
    internshipList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('apply-btn')) {
            const internshipId = e.target.dataset.id;
            const resumeInput = document.getElementById(`resume-${internshipId}`);
            const resumeFile = resumeInput.files[0];

            if (!resumeFile) {
                alert('Please select a resume to upload.');
        return;
      }

            const formData = new FormData();
            formData.append('internshipId', internshipId);
            formData.append('resume', resumeFile);

            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/api/applications', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // 'Content-Type' is not set for FormData; the browser sets it with the boundary
                    },
                    body: formData,
                });
                
                const result = await res.json();
                if (res.ok) {
                    alert('Application successful!');
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (err) {
                console.error('Failed to apply:', err);
                alert('An error occurred during application.');
            }
        }
    });
});