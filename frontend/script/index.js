
// const baseURL = 'https://budget-track-qc15.onrender.com';

// Allowing the user only if logged In
let datas = JSON.parse(localStorage.getItem("user")) || null
const token = sessionStorage.getItem("token") || null;

function checkValidation() {
    if (!token) {
        alert('Please Login to Continue');
    } else {
        window.location.href = 'dashboard.html';
    }
}


//logout
const modal = document.getElementById("modal")
const logout = document.getElementById("logout")
const logoutOverlay = document.getElementsByClassName("logout-overlay")[0];

function toggleModal() {
    if (token) {
        document.getElementById("log").setAttribute("href", "#")
        modal.style.display = "flex"
        logoutOverlay.classList.add("visible-logout-overlay");
    }
    else {
        modal.style.display = "none"
        logoutOverlay.classList.remove("visible-logout-overlay");
    }
}


function removeOverlayLg() {
    logoutOverlay.classList.remove("visible-logout-overlay");
    modal.style.display = "none"
}


logout.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    document.getElementById("log").innerText = "Login";
    window.location.href = "./index.html"
})


if (token) {
    document.getElementById("log").innerText = datas
}
else {
    document.getElementById("log").innerText = "Login"
}


const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")


})
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active")

}))


