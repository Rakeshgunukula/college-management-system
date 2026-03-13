function showForm(role){
document.querySelectorAll('.form-box').forEach(form=>{
form.classList.remove('active');
});
document.getElementById(role).classList.add('active');
}

// fetching login route from backend
const adminForm = document.getElementById('adminForm');
adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminName').value;
    const password = document.getElementById('adminPassword').value;
    const res = await fetch('/api/admin/admin-login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
});


const data = await res.json();

if (res.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', 'admin');
    // Success ayite status page ki pampu with success param
    window.location.replace('/status?auth=success&role=admin');
} else {
    // Fail ayite status page ki pampu with fail param
    window.location.replace("/status?auth=fail");
}
        

})

// teacher login form 

// Teacher Login Form Script
const teacherLoginForm = document.getElementById('teacherForm');

teacherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;
    try {
        const res = await fetch('/api/teacher/teacher-login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', 'teacher');
            window.location.replace('/status?auth=success&role=teacher');
        } else {

            window.location.replace('/status?auth=fail');
        }
    } catch (err) {
        alert('server error');
    }
});


// student loginform logic

// Student Login Form in main.js
const studentForm = document.getElementById('studentForm');

studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rollno = document.getElementById('studentRollNo').value;
    const password = document.getElementById('studentPass').value;

    const res = await fetch('/api/student/student-login', { // Create this route in backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollno, password })
    });


    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'student');
        window.location.replace("/status?auth=success&role=student");
    } else {
        window.location.replace("/status?auth=fail");
    }

});


// checking token  on page load
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {

        if(role === 'admin'){
            window.location.replace('/admin-dashboard');
        }
        else if(role === 'teacher'){
            window.location.replace('/teacher-dashboard');
        }
        else if(role === 'student'){
            window.location.replace('/student-dashboard');
        }
        else{
            window.location.replace('/login');
        }
    
    }

