

// Allowing the user only if logged In

const token = sessionStorage.getItem("token") || null;
const loginBtn = document.getElementById("log");

if(token)
{
    loginBtn.innerText = "Logout"
    loginBtn.classList.add("logOut");
    loginBtn.setAttribute("href", "./index.html");
    let logOut = document.getElementsByClassName("logOut")[0];
    logOut.addEventListener("click",()=>{
        sessionStorage.removeItem("token");
        loginBtn.innerText = "Login";
        loginBtn.classList.remove("logOut");
        window.location.href = "./index.html"
    })
}
else{
    loginBtn.setAttribute("href", "./login.html");
    loginBtn.innerText = "Login"
}


    function checkValidation()
    {
        if(!token)
        {
            alert('Please Login to Continue');
        }else{
            window.location.href = 'dashboard.html';
        }
    }
