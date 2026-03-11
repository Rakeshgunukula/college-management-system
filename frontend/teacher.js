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

window.onload = () => {

    document.querySelector('.main').classList.add('active');
    document.querySelector('.cards').classList.add('active');

}


// fetching to add send student data

    const addStudentForm = document.getElementById('addStudentForm');

addStudentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentData = {
        name: document.getElementById('studentname').value,
        rollno: document.getElementById('rollno').value,
        password: document.getElementById('studentpassword').value,
        branch: document.getElementById('branch').value
    };

    const res = await fetch('/api/teacher/add-student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(studentData)
    });

    const data = await res.json();
    alert(data.msg);
    if (res.ok) {
        location.reload(); // Table update avvadaniki
    }
});


// fetching all students 

async function studentsFetching(){
    const studentsTable = document.getElementById('studentsTable')
    try
    {
        const res = await fetch('/api/teacher/all-students' ,{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            }
        });

        const students = await res.json();

       if(res.ok){
        studentsTable.innerHTML = '<th>Student Name</th><th>Roll No</th><th>Branch</th>';
        students.forEach(student => {
            studentsTable.innerHTML += 
            `
            <tr>
            <td>${student.name}</td>
            <td>${student.rollno}</td>
            <td>${student.branch}</td>`
        });
        document.getElementById('studentCount').textContent = students.length;
    }
    else{
        studentsTable.innerHTML = `<tr><td colspan="3"><marquee style="color:rgba(255,255,255,0.8); letter-spacing:3px;">${students.msg}</marquee></td></tr>`;
    }
    }catch(err){
        console.log('fetching error');
    }
}

studentsFetching()
// logout from the teacher.html

const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Logging Out Successfully');
    window.location.replace('index.html');
})