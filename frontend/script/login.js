
let loading_container = document.getElementById("loading-container");

// ---------------------------------------------------------------------------
// login switch
const loginlink = () => {
    const loginLayout = ` 
    <section id="login-section">
    <h2>Login</h2>
    <form action="" id="loginForm" onsubmit="loginFormSubmit(event)">
    <input
        type="text"
        name="email"
        placeholder="Email"
        autocomplete="off"
        required
    /><input
        type="password"
        name="password"
        placeholder="Password"
        autocomplete="off"
        required
    />
    <button type="submit">Login</button>
    </form>
    </section>
    <section id="register-and-social-media">
    <div>
    <span>Dont Have an Account? </span
    ><a href="#" onclick="registerlink()"> Register</a>
    <p>-OR-</p>
    </div>
    <div id="social-medial-auth">
    <div>
        <img src="../images/search.png" alt="" onclick="googleLogin()"/>
    </div>
    <div>
        <img src="../images/github.png" alt="" />
    </div>
    <div>
        <img src="../images/facebook.png" alt="" />
    </div>
    </div>
    </section>

`;
    let right = document.getElementById("picture");
    let left = document.getElementById("login-register-div");

    right.innerHTML = null;
    left.innerHTML = null;

    let img = document.createElement("img");
    img.style.display = "block";
    img.style.width = "100%";
    img.style.margin = "auto";
    img.style.marginTop = "25%";
    img.src = "https://i.ibb.co/dfJrgS9/picure.png";

    left.style.backgroundColor = "#EAD6CD";
    right.style.backgroundColor = "#F7F7F7";

    left.append(img);
    right.innerHTML = loginLayout;
};

// ---------------------------------------------------------------------------

// register switch
const registerlink = () => {
    const registerLayout = `
            <div id="register-div">
            <h2>Register</h2>
            <form action="" id="registerForm" onsubmit="registerFormSubmit(event)">
            <div>
                <input
                type="text"
                name="fname"
                placeholder="First Name"
                autocomplete="off"
                required
                />
                <input
                type="text"
                name="lname"
                placeholder="Last Name"
                autocomplete="off"
                required
                />
            </div>
            <input
                type="email"
                name="email"
                placeholder="Email"
                autocomplete="off"
                required
            /><input
                type="number"
                name="mobile"
                placeholder="Phone Number"
                autocomplete="off"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                autocomplete="off"
                required
            /><input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                autocomplete="off"
                required
            />
            <button type="submit">Register</button>
            <span style="color: red">Already Have Account? </span
            ><a href="#" onclick="loginlink()">Login</a>
            </form>
            </div>
    `;

    let right = document.getElementById("picture");
    let left = document.getElementById("login-register-div");
    right.innerHTML = null;
    left.innerHTML = null;

    left.innerHTML = registerLayout;

    let img = document.createElement("img");
    img.style.display = "block";
    img.style.width = "100%";
    img.style.margin = "auto";
    img.style.marginTop = "25%";
    img.src = "https://i.ibb.co/dfJrgS9/picure.png";

    right.style.backgroundColor = "#EAD6CD";
    left.style.backgroundColor = "#F7F7F7";

    right.append(img);
};

// ---------------------------------------------------------------------------

// display login page on load
const onload = () => {
    const loginLayout = ` 
        <section id="login-section">
        <h2>Login</h2>
        <form action="" id="loginForm" onsubmit="loginFormSubmit(event)">
        <input
            type="text"
            name="email"
            placeholder="Email"
            autocomplete="off"
            required
        /><input
            type="password"
            name="password"
            placeholder="Password"
            autocomplete="off"
            required
        />
        <button type="submit">Login</button>
        </form>
        </section>
        <section id="register-and-social-media">
        <div>
        <span>Dont Have an Account? </span
        ><a href="#" onclick="registerlink()"> Register</a>
        <p>-OR-</p>
        </div>
        <div id="social-medial-auth">
        <div>
            <img src="../images/search.png" alt=""  onclick="googleLogin()"/>
        </div>
        <div>
            <img src="../images/github.png" alt="" />
        </div>
        <div>
            <img src="../images/facebook.png" alt="" />
        </div>
        </div>
        </section>
   
`;
    let right = document.getElementById("picture");
    let left = document.getElementById("login-register-div");
    let img = document.createElement("img");
    img.style.display = "block";
    img.style.width = "100%";
    img.style.margin = "auto";
    img.style.marginTop = "25%";
    img.src = "https://i.ibb.co/dfJrgS9/picure.png";

    left.style.backgroundColor = "#EAD6CD";
    right.style.backgroundColor = "#F7F7F7";

    left.append(img);
    right.innerHTML = loginLayout;

    let loading_container = document.getElementById("loading-container");
    loading_container.style.display = "block";

    setTimeout(() => {
        loading_container.style.display = "none";
    }, 2000);
};
onload();

// ---------------------------------------------------------------------------

// login form submit
const loginFormSubmit = async (event) => {
    event.preventDefault();
    loading_container.style.display = "block";

    let form = document.getElementById("loginForm");
    let formData = new FormData(form);
    let data = Object.fromEntries(formData);
    let response = await fetch(
        "http://localhost:8080/users/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );
    let result = await response.json();

    if (result.msg === "Login Successfull") {
        loading_container.style.display = "none";
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("username", result.user.fname);

        Swal.fire({
            title: "Logged In successfully!",
            text: "You are logged in successfully.",
            icon: "success",
        })
            .then((res) => {
                window.location.href = "./Dashboard.html";
            })
            .catch((err) => {
                alert("Something Went Wrong");
            });
    } else {
        loading_container.style.display = "none";
        Swal.fire({
            title: "Wrong Credentials!",
            text: "Try Again",
            icon: "error",
        }).then((res) => { });
    }
};

// ---------------------------------------------------------------------------

// register form submit
const registerFormSubmit = async (event) => {
    event.preventDefault();
    loading_container.style.display = "block";

    let form = document.getElementById("registerForm");
    let formData = new FormData(form);
    let data = Object.fromEntries(formData);

    if (data.confirm_password == data.password) {
        delete data.confirm_password;
        let response = await fetch(
            "http://localhost:8080/users/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        let result = await response.json();

        if (result.msg == "Signup Successfully") {
            loading_container.style.display = "none";
            Swal.fire({
                title: "Registered Successfully!",
                text: "You are registered successfully.",
                icon: "success",
            }).then((res) => {
                if (res.value) {
                    window.location.reload();
                } else {
                    Swal.fire({
                        title: "Wrong Credentials!",
                        text: "Try Again",
                        icon: "error",
                    });
                }
            });
        } else {
            loading_container.style.display = "none";
            Swal.fire({
                title: "User Already Registered!",
                text: "Please Login",
                icon: "error",
            });
        }
    } else {
        loading_container.style.display = "none";
        Swal.fire({
            title: "Password Mismatched",
            text: "Please Try Again",
            icon: "error",
        }).then();
    }
};

// ---------------------------------------------------------------------------

// // login via google
// const googleLogin = async () => {
//   try {
//     let response = await fetch(
//       "https://periwinkle-catfish-cuff.cyclic.app/user/auth/google",
//       { mode: "no-cors" }
//     );
//     let result = await response.json();
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// };
//

let register = document.getElementById("registerForm")
register.addEventListener('click', () => {
    console.log("hello");
})