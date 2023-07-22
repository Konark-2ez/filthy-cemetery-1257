const baseURL = "https://budget-track-qc15.onrender.com";
// const baseURL = "http://localhost:8080";

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
        <img src="./images/search.png" alt="" onclick="googleLogin()"/>
    </div>
    <div>
        <img src="./images/github.png" alt="" />
    </div>
    <div>
        <img src="./images/facebook.png" alt="" />
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
                name="name"
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
                name="age"
                placeholder="age"
                autocomplete="off"
                 required
            />
            <input
                type="string"
                name="bank"
                placeholder="bank"
                autocomplete="off"
                 required
            />
            <input
                type="string"
                name="occupation"
                placeholder="occupation"
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
            <img src="./images/search.png" alt=""  onclick="googleLogin()"/>
        </div>
        <div>
            <img src="./images/github.png" alt="" />
        </div>
        <div>
            <img src="./images/facebook.png" alt="" />
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
};
onload();

// ---------------------------------------------------------------------------

// login form submit
const loginFormSubmit = async (event) => {
  event.preventDefault();

  let form = document.getElementById("loginForm");
  let formData = new FormData(form);
  let data = Object.fromEntries(formData);

  loading_container.style.display = "block";
  try {
    let response = await fetch(`${baseURL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let result = await response.json();

    if (result.message === "User does not exists, Please Register") {
      Swal.fire({
        title: "Please Register!",
        text: "User does not exists",
        icon: "error",
      }).then(() => {
        registerlink();
      });
      return;
    }

    if (result.msg === "login successfully") {
      sessionStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.name));

      Swal.fire({
        title: "Logged In successfully!",
        text: "You are logged in successfully.",
        icon: "success",
      })
        .then((res) => {
          window.location.assign("./index.html");
        })
        .catch((err) => {
          alert("Something Went Wrong");
        });
    } else {
      Swal.fire({
        title: "Wrong Credentials!",
        text: "Try Again",
        icon: "error",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Something went wrong!",
      text: "Please try again later!",
      icon: "error",
    });
    console.log(error);
  } finally {
    loading_container.style.display = "none";
  }
};

// ---------------------------------------------------------------------------

// register form submit
const registerFormSubmit = async (event) => {
  event.preventDefault();

  let form = document.getElementById("registerForm");
  let formData = new FormData(form);
  let data = Object.fromEntries(formData);

  if (data.confirm_password !== data.password) {
    Swal.fire({
      title: "Password Mismatched",
      text: "Please Check Your Password",
      icon: "error",
    });
    return;
  }

  const { confirm_password, lname, ...userInfo } = data;

  loading_container.style.display = "block";
  fetch(`${baseURL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.message === "user successfully registered") {
        Swal.fire({
          title: "Registered Successfully!",
          text: "You are registered successfully.",
          icon: "success",
        }).then((res) => {
          window.location.reload();
        });
        return;
      }

      if (data.message === "User already exists") {
        Swal.fire({
          title: "User Already Registered!",
          text: "Please Login",
          icon: "error",
        }).then((res) => {
          window.location.reload();
        });
        return;
      }

      //   window.location.reload();
    })
    .catch((error) => {
      Swal.fire({
        title: "Something went wrong!",
        text: "Please try again later!",
        icon: "error",
      });
      console.log(error);
    })
    .finally(() => {
      loading_container.style.display = "none";
    });
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

// let register = document.getElementById("registerForm")
// register.addEventListener('click', () => {
//     console.log("hello");
// })
