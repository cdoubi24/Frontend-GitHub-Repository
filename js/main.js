let token = '';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', loginUser);
  } else {
    loadDashboard();
  }
});

function loginUser(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('../backend/data/users.json')
    .then(res => res.json())
    .then(users => {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('role', user.role);
        window.location.href = 'dashboard.html';
      } else {
        alert('Invalid credentials');
      }
    });
}

function loadDashboard() {
  token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  fetch('https://your-glitch-app.glitch.me/api/courses')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('courses');
      container.innerHTML = data.map(course => `<p>${course.title}</p>`).join('');
    });

  if (role === 'teacher') {
    document.getElementById('adminControls').style.display = 'block';
  }
}

function createCourse() {
  const title = document.getElementById('courseTitle').value;
  fetch('https://your-glitch-app.glitch.me/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    },
    body: JSON.stringify({ title })
  })
    .then(res => res.json())
    .then(() => loadDashboard());
}
