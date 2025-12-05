

const getUrl  = "http://localhost:7000/getalluser";
const updateUrl = "http://localhost:7000/updateuserdata";
const addUrl = "http://localhost:7000/adduserdata";
const deleteUrl = "http://localhost:7000/deleteuser";



let userData = [];

displayUserData(userData)

   function displayUserData(){


    let allRows = "";

    userData.forEach((ele, index)=>{

        let row = `
            <tr >
                    <td >${index+1}</td>
                    <td >${ele.name}</td>
                    <td >${ele.city}</td>
                    <td >${ele.email}</td>
                    <td >${ele.mobile}</td>
                          <td>
                                <button class="action-btn edit-btn" onclick="editData(${ele.id}), openClose('editmodal')">Edit</button>
                                <button class="action-btn delete-btn" onclick="deleteuserData(${ele.id}), openClose('deletemodal')">Delete</button>
                              
                            </td>
                   
            </tr>
        `
        allRows += row
    })


    document.getElementById("tBody").innerHTML = allRows

}


  function ApiFetch(){

    fetch(`${getUrl}`, { method: "GET" })
  .then((res) => {
    return res.json();
  })
  .then((result) => {
     userData = (result.result)
     console.log(userData)
     displayUserData(userData)
  })
  .catch((err) => {
    console.log(err);
  });

  }
  ApiFetch()

// Modal open close logic

  let isOpen = false
   function openClose(modalId){
    if(isOpen === false){
      document.getElementById(modalId).style.display = 'flex'
      isOpen  = true;
    }else{
      document.getElementById(modalId).style.display = "none"
      isOpen= false;
    }
   }


   // Add new user 
   let user = {
    name: null,
    city: null,
    email: null,
    mobile: null
   }


   function AddNewUserData(key,value){
    if(value.trim() === ""){
      user[key] = null
    }else{
      user[key] = value
    }

   }
  
   function SumbmitUserData(){
    // check validations

    if(!user.name || !user.city  || !user.email  || !user.mobile){
      alert("please fill all inputs")
      return
    }

    fetch(`${addUrl}`, {method : "POST",
      headers:{"Content-Type" : "application/json"},
       body: JSON.stringify(user)})
     .then((res)=>{
      return res.json()
     })
     .then((response)=>{
     let id = response.result;
     console.log(id)
       user['id'] = Number(id);

       userData.push(user)

     })
     .catch((err)=>{
      console.log(err)
     })
      displayUserData(userData);

     openClose('addmodal');

     user = {
      name: null,
      city: null,
      email: null,
      mobile: null
     }

   }


   // Edit user Data button 

   let UniqueId ;
   let previousData;
   let userIndex;
    
   function editData(id){
       UniqueId = id;
       previousData =userData.find((ele)=> Number(ele.id ) === Number(UniqueId))

       userIndex = userData.findIndex((ele)=> Number(ele.id) === Number(UniqueId))

       document.getElementById('name').value = previousData.name;
       document.getElementById('city').value = previousData.city;
       document.getElementById('email').value= previousData.email;
       document.getElementById('mobile').value = previousData.mobile;


   }

   // update modal

   function updateuserData(key, value){

    if(value.trim() === ""){
      user[key] = null;
    }else{
     user[key] = value;
    }


    if(user.name === null){
      user.name = previousData.name
    }
    if(user.city === null){
      user.city = previousData.city
    }
    if(user.email === null){
      user.email = previousData.email
    }
    if(user.mobile === null){
      user.mobile = previousData.mobile
    }
   }

   //logic for edit user data submit button

   function EditUserData(){

    //validation
    
    if(!user.name || !user.city  || !user.email  || !user.mobile){
      alert("please fill all inputs")
      return
    }
    fetch(`http://localhost:7000/updateuserdata?id=${UniqueId}`, {method : "PUT",
       headers:{"Content-Type" : "application/json"},
        body: JSON.stringify(user)})
    .then((res)=>{
     return res.json()
    }).then((response)=>{
      console.log(response)
    }).catch((err)=>{
      console.log(err)
    })


    user['id'] = UniqueId;

    userData[userIndex] = user;

    openClose('editmodal')

    displayUserData(userData)

    

    user = {
      name: null,
      city: null,
      email: null,
      mobile: null
     }

  }

//delete user data logic

function deleteuserData(id){
  UniqueId = Number(id);

  userIndex = userData.findIndex((ele)=> Number(ele.id) === Number(id));
}


//confirm delete student button

function ConfirmDeleteUserData(){
  userData.splice(userIndex, 1);

  fetch(`${deleteUrl}?id=${UniqueId}`, {method : "DELETE",})
  .then((res)=>{
    return res.json
  }).then((response)=>{
    console.log(response)
  }).catch((err)=>{
    console.log(err)
  })


  displayUserData(userData)

  openClose('deletemodal')

}


//search bar option

let seek = "";

function takeuserData(word){

  if(word.trim() === ""){
    alert("please enter valid user name")
  }else
  {
    seek = document.getElementById("searchInput").value
   
  }

}



let searchUserArray  = [];

function finduser(){
  if(seek.trim() === ""){
    alert("Please Enter valid user name ")
    return;
  }
    searchUserArray = userData.filter((ele) => ele.name.includes(seek))
    console.log(searchUserArray)
  
   if(searchUserArray.length === 0){
     document.getElementById("noData").innerHTML = `<h2 style = "color : red"> No Record Found</h2>`
   }else{
     showsearchUser(searchUserArray);
          document.getElementById("noData").innerHTML = `<h2 style = "color : green"> Search User Data</h2>`
   }


}

function showsearchUser(arr){

  let totalRow = "";

  arr.forEach((ele, i)=>{

    let row = `
               <tr>
               <td>${i+1}</td>
               <td>${ele.name}</td>
               <td>${ele.city}</td>
               <td>${ele.email}</td>
               <td>${ele.mobile}</td>
    
    
               </tr>`

               totalRow += row;
  
});

document.getElementById("SBody").innerHTML = totalRow;

}