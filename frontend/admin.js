  const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    menuBtn.onclick = () => { sidebar.classList.toggle('active'); overlay.classList.toggle('active'); };
    overlay.onclick = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); };


// fetching route to send data from the body

const createTeachersForm = document.getElementById('createTeachersForm');

createTeachersForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const name = document.getElementById('teacherName').value;
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;
    try{
        const res = await fetch('/api/admin/create-teacher', {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            },
            body:JSON.stringify({name, email, password})
        });
    
        const data = await res.json();
       if(!res.ok){
        alert(data.msg);
        console.log(data.msg);
        return;
       }
       else{
        alert(data.msg);
        createTeachersForm.reset();
        location.reload();
       }
    }catch(err){
        console.log('Frontend Fetching error', err);
    }
});


// fetching all teachers from the Mongodb and display according to the role in the table

async function fetchAndDisplayTables() {
    const teachersTable = document.getElementById("teachersTable");
    const studentsTable = document.getElementById("studentsTable");

    try {
        const res = await fetch('/api/admin/all-users', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            },
        });

        const users = await res.json();

        // Check if users is empty or status is 404
        if (!res.ok || !users || users.length === 0) {
            const noDataMsg = `<tr><td colspan="4" style="text-align:center; padding: 20px;">
                                <marquee style="color: rgba(255,255,255,0.6);">No Records Found in Database</marquee>
                               </td></tr>`;
            
            teachersTable.innerHTML = `<tr><th>Email</th><th>Role</th><th>Remove</th><th>Action</th></tr>` + noDataMsg;
            studentsTable.innerHTML = `<tr><th>Rollno</th><th>Branch</th><th>Action</th></tr>` + noDataMsg;
            
            // Stats ni zero cheyi
            document.getElementById("students").innerText = 0;
            document.getElementById("teachers").innerText = 0;
            return;
        }

        // Tables reset with headers if data exists
        teachersTable.innerHTML = `<tr><th>Email</th><th>Role</th><th>Remove</th><th>Action</th></tr>`;
        studentsTable.innerHTML = `<tr><th>Student Name</th><th>Roll No</th><th>Branch</th><th>Action</th></tr>`;

        // Data loop ikkada start avtundi
        users.forEach((user) => {
            if (user.role === 'admin' || user.role === 'teacher') {
                const isAdmin = user.role === 'admin';
                const btnText = isAdmin ? "Remove Admin" : "Make Admin";
                const btnClass = isAdmin ? "removeBtn" : "makeAdmin";

                teachersTable.innerHTML += `
                <tr>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td><button class="removeBtn" onclick="deleteUser('${user._id}')">Remove</button></td>
                    <td><button class="${btnClass}" onclick="updateUser('${user._id}')">${btnText}</button></td>
                </tr>`;
            } 
            else if (user.role === 'student') {
                studentsTable.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.rollno}</td>
                    <td>${user.branch}</td> 
                    <td><button class="removeBtn" onclick="deleteUser('${user._id}')">Remove Student</button></td>
                </tr>`;
            }
        });

        // Filter chesi counts update cheyi
        document.getElementById("students").innerText = users.filter(u => u.role === 'student').length;
        document.getElementById("teachers").innerText = users.filter(u => u.role === 'teacher').length;

    } catch (err) {
        console.error('Frontend Error:', err);
    }
}

// Function call on load
fetchAndDisplayTables();

// fetching data to update role to admin

async function updateUser(id) {
    try{
        const res = await fetch(`/api/admin/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            }
        });
    
        const data = await res.json();
        if(!res.ok){
             alert(data.msg);
        }
        else{
           alert(data.msg);
           location.reload();
        }
    }catch(err){
        alert('Update Failed');
    }
};


// fetching data to delete data from the database
async function deleteUser(id) {
    try{
        const res = await fetch(`/api/admin/deleteuser/${id}`, {
            method:"DELETE",
            headers:{
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            }
        });
        const data = await res.json();
        if(!res.ok){
            return alert(data.msg);
        }
        else{
            alert(data.msg);
            location.reload();
        }
    }catch(err){
        return alert('server Error' + err);
    }
}


// logout from the admin.html

const logOut = document.getElementById('logout');

logOut.addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Logged Out Successfully');
    window.location.replace("index.html");
})
