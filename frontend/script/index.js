
const baseURL = 'https://budget-track-qc15.onrender.com';
// Allowing the user only if logged In
let datas =JSON.parse(localStorage.getItem("user"))
const token = sessionStorage.getItem("token") || null;

    function checkValidation()
    {
        if(!token)
        {
            alert('Please Login to Continue');
        }else{
            location.reload();
            window.location.href = 'dashboard.html';
        }
    }
    

    //logout
    const modal = document.getElementById("modal")
    const logout = document.getElementById("logout")
    function toggleModal(){if(token){
        modal.style.display = "block"
        document.getElementById("log").setAttribute("href","#")
    }
    else{
        modal.style.display = "none"
    }}
    logout.addEventListener("click",()=>{
        console.log("clicked")
        fetch(`http://localhost:8080/users/logout`,{
            method:"POST",
           
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({token:token})
            
                
            
        })
        .then((res)=>{return res.json()})
        .then((data)=>{
            console.log(data)
        })
        .catch((error)=>{
            console.log(error)
        })
    })

   if(token){
       document.getElementById("log").innerText = datas
   }
   else{
    document.getElementById("log").innerText = "Login"
   }

   const hamburger = document.querySelector(".hamburger")
   const navMenu = document.querySelector(".nav-menu")

   hamburger.addEventListener("click",()=>{
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")

    
   })
   document.querySelectorAll(".nav-link").forEach(n=>n.addEventListener("click",()=>{
    hamburger.classList.remove("active");
    navMenu.classList.remove("active")

   }))
   