const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");

menuBtn.addEventListener("click",()=>{
sidebar.classList.toggle("active");
overlay.classList.toggle("active");
});

overlay.addEventListener("click",()=>{
sidebar.classList.remove("active");
overlay.classList.remove("active");
});


async function loadStudentProfile() {
    const token = localStorage.getItem('token');
    
    // Login avvakunda vaste back pampicchey
    if (!token) {
        window.location.replace("index.html");
        return;
    }

    try {
        const res = await fetch('/api/student/profile', {
            method: "GET",
            headers: {
                "Authorization": token, // AuthMiddleware deenni verify chestundi
                "Content-Type": "application/json"
            }
        });

        const studentData = await res.json();

        if (res.ok) {
            // Top Navbar lo updates
            document.getElementById('profileUpdate').innerText = `Welcome, ${studentData.name.toUpperCase()}👋`;
            document.getElementById('studentCgpa').innerText = `${studentData.name.toUpperCase()} CGPA`;
            document.getElementById('studentname').innerText = `${studentData.name}`;
            document.getElementById('rollno').innerText = `${studentData.rollno}`;
            document.getElementById('branch').innerText = `${studentData.branch}`;
            // document.getElementById('studentBranchDisplay').innerText = `Branch: ${studentData.branch}`;
            
            // Inka cards lo data unte avi kooda update cheyochu
            // Example: document.getElementById('studentCount').innerText = studentData.cgpa || 'N/A';
        } else {
            console.error("Profile load failed");
            localStorage.removeItem('token');
            window.location.replace("index.html");
        }
    } catch (err) {
        console.log('Error:', err);
    }
}

window.onload = () => {
    loadStudentProfile();
        document.querySelector('.cards').classList.add('active');
        document.querySelector('.card').classList.add('active');
        document.querySelector('#main').classList.add('active');

}

function logout(){
localStorage.removeItem('token');
alert('Logged Out Successfully');
window.location.replace("/login");
}

/* Dynamic Example */
document.getElementById("studentMarks").innerText = '7.5 / 10'
document.getElementById("assignmentMarks").innerText = '5 / 5';
document.getElementById("attendance").innerText = '75%';
document.getElementById("review").innerText = 'Good';

