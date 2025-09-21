let cl = console.log;

const studentForm = document.getElementById('studentForm')
const fnameControler = document.getElementById('fname')
const lnameControler = document.getElementById('lname')
const emailControler = document.getElementById('email')
const contactControler = document.getElementById('contact')
const addStudent = document.getElementById('addStudent')
const updateStudent = document.getElementById('updateStudent')
const studentContainer = document.getElementById('studentContainer')
const loader = document.getElementById('loader')

const snackBar = (msg, icon)=>{
    Swal.fire({
        title:msg,
        icon:icon,
        timer:1500
    })
}

let BASE_URL = `https://crud-35fc1-default-rtdb.asia-southeast1.firebasedatabase.app`
let STUDENT_URL = `${BASE_URL}/student.json`


const objtoArr = (obj) =>{
    let studentArr = []
    for(const key in obj){
        studentArr.push({...obj[key], id:key})
    }
    return studentArr
}

const studentTemplating = (arr) =>{
    let result = ``
    arr.forEach((obj, i)=>{
        result += `         <tr id="${obj.id}">   
                            <td>${i+1}</td>
                            <td>${obj.fname}</td>
                            <td>${obj.lname}</td>
                            <td>${obj.email}</td>
                            <td>${obj.contact}</td>
                            <td class="text-center"><i onclick ="onEdit(this)" class="fa-solid fa-user-pen text-success fa-2x"
                                    role="button"></i></td>
                            <td class="text-center"><i onclick ="onRemove(this)" class="fa-solid fa-trash text-danger fa-2x" role="button"></i>
                            </td>
                            </tr>`
     localStorage.setItem('i', i)
    })
    studentContainer.innerHTML = result;
}

const onEdit = async (ele)=>{
    let Edit_Id = ele.closest('tr').id
    cl(Edit_Id)
    localStorage.setItem('Edit_Id', Edit_Id)
    let Edit_URL = `${BASE_URL}/student/${Edit_Id}.json`

    let res = await makeApiCall('GET', Edit_URL, null)
    fnameControler.value = res.fname;
    lnameControler.value = res.lname;
    emailControler.value = res.email;
    contactControler.value = res.contact;

    addStudent.classList.add('d-none')
    updateStudent.classList.remove('d-none')

    studentForm.scrollIntoView({behavior:'smooth', block:'center'})
    snackBar('The data is patch successfully!!!', 'success')
}

const onRemove = async(ele) =>{
  let re = await  Swal.fire({
  title: "Do you want to remove this student details?",
  showCancelButton: true,
  confirmButtonText: "No",
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
    let Remove_Id = ele.closest('tr').id;
    let Remove_URL = `${BASE_URL}/student/${Remove_Id}.json`
    let res = makeApiCall('DELETE', Remove_URL, null)
    ele.closest('tr').remove()

    let rows = studentContainer.querySelectorAll('tr')
    // let index = document.get
    rows.forEach((row, i)=>{
        row.children[0].innerText = i+1
        window.scrollTo({top:0, behavior:'smooth'})
    })
  }
});

}

const makeApiCall = async (methodName, api_url, msgBody)=>{
    loader.classList.remove('d-none')
    let msg = msgBody ? JSON.stringify(msgBody) : null
        let res = await fetch(api_url,{
        method:methodName,
        body:msg,
        headers:{
            "auth":"JWT token from LS",
            "content-type" : "application/json"
        }
    })
    try{
    if(!res.ok){
        throw new Error('Network Error')
    }
    return res.json()
    }catch{
        cl('Error')
    }finally{
        loader.classList.add('d-none')
    }
}

const makeAll = async ()=>{
    let res = await makeApiCall('GET', STUDENT_URL, null)
    let posts = objtoArr(res)
    studentTemplating(posts)
}
makeAll()

const onSubmitStudent = async (eve) =>{
    eve.preventDefault()
    let obj = {
        fname:fnameControler.value,
        lname : lnameControler.value,
        email : emailControler.value,
        contact : contactControler.value
    }
    cl(obj)
    let res = await makeApiCall('POST', STUDENT_URL, obj)
    studentForm.reset()
    let tr = document.createElement('tr')
    tr.id = res.id;
    let i = localStorage.getItem('i')
    tr.innerHTML = `        <td>${i}</td>
                            <td>${obj.fname}</td>
                            <td>${obj.lname}</td>
                            <td>${obj.email}</td>
                            <td>${obj.contact}</td>
                            <td class="text-center"><i onclick ="onEdit(this)" class="fa-solid fa-user-pen text-success fa-2x"
                                    role="button"></i></td>
                            <td class="text-center"><i onclick ="onRemove(this)" class="fa-solid fa-trash text-danger fa-2x" role="button"></i>
                            </td>` 
    studentContainer.append(tr)
    tr.scrollIntoView({behavior:'smooth', block:'center'})
    snackBar('The data is added successfully!!!', 'success')

}

const onUpdateStudent = async (eve) =>{
    let Update_Id = localStorage.getItem('Edit_Id')
    cl(Update_Id)
    let Update_URL = `${BASE_URL}/student/${Update_Id}.json`
    let Update_Obj = {
        fname:fnameControler.value,
        lname : lnameControler.value,
        email : emailControler.value,
        contact : contactControler.value,
        id : Update_Id
    }
    let res = await makeApiCall('PATCH', Update_URL, Update_Obj)
    studentForm.reset()
    let tr = document.getElementById(Update_Id).children
    cl(tr)
    tr[1].innerHTML = res.fname;
    tr[2].innerHTML = res.lname;
    tr[3].innerHTML = res.email;
    tr[4].innerHTML = res.contact

    addStudent.classList.remove('d-none')
    updateStudent.classList.add('d-none')

    studentContainer.scrollIntoView({behavior:'smooth', block:'center'})
    snackBar('The data is updated successfully!!!', 'success')

}

studentForm.addEventListener('submit', onSubmitStudent)
updateStudent.addEventListener('click', onUpdateStudent)