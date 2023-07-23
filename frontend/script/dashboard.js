const baseURL = "https://budget-track-qc15.onrender.com";
// const baseURL = "http://localhost:8080";

const token = sessionStorage.getItem("token") || null;

window.addEventListener("load", () => {
  if (!token) {
    Swal.fire({
      title: "Please Login!",
      text: "to use dashboard",
      icon: "error",
    }).then(() => {
      window.location.href = "./login.html";
    });
  }
});

const budgetInput = document.getElementById("d-budget");
const chooseExpense = document.getElementById("choose-expense");
const expenseAmt = document.getElementById("expense-amout");
const expenseSubmitBtn = document.getElementById("expense-submit-form");
const otherExpenseHolder = document.getElementById("expense-otherName-wrapper");
const displayBudget = document.getElementById("budget-amount-input");
const displayExpense = document.getElementById("expense-amount-input");
const displayBalance = document.getElementById("balance-amount-input");
const historyContainer = document.getElementById("recent-expenses-history");
let dashLoader = document.getElementById("dash-loading-container");
let dashOverlay = document.getElementById("over-lay-dash");
let socket;
let popupForm = document.getElementById("popupForm");
let closePopup = document.getElementById("close-popup");

dashOverlay.style.display = "block";
dashLoader.style.display = "block";

if (!token) {
  Swal.fire({
    title: "Please Login!",
    text: "to use dashboard",
    icon: "error",
  }).then(() => {
    window.location.href = "./login.html";
  });
} else {
  socket = io(baseURL, {
    transports: ["websocket"],
    query: {
      token: token,
      oAuthEmail: "fromLocalStorage",
    },
  });
}

// handling the errors
socket.on("connect_error", (error) => {
  if (error.message) {
    console.log(error.message);
    Swal.fire({
      title: "Please Login!",
      text: "Session expired.",
      icon: "error",
    }).then(() => {
      window.location.href = "./login.html";
    });
  } else {
    console.log(error);
    Swal.fire({
      title: "Something went wrong!",
      text: "Please try again later",
      icon: "error",
    });
  }
});

// Default Budget
socket.on("defaultBudget", (data) => {
  dashOverlay.style.display = "none";
  dashLoader.style.display = "none";
  if (data) {
    data = JSON.parse(data);

    // Displaying the Stats
    displayStats(data);

    if (!data.transactions[0]) {
      emptyRecentHistory();
    } else {
      showRecentHistory(data.transactions);
    }
  } else {
    Swal.fire({
      title: "No Data!",
      text: "",
      icon: "warning",
    });
  }
});

// Sending budget amount
function budgetBtn() {
  if (!token) {
    return Swal.fire({
      title: "Please Login!",
      text: "",
      icon: "error",
    });
  }

  let budgetamt = +budgetInput.value;
  if (!budgetamt)
    return Swal.fire({
      title: "Please provide budget",
      icon: "warning",
    });

  dashOverlay.style.display = "block";
  dashLoader.style.display = "block";
  socket.emit("budgetAmt", budgetamt);
  budgetInput.value = null;
}

// getting the updated data
socket.on("updatedBudget", (data) => {
  dashOverlay.style.display = "none";
  dashLoader.style.display = "none";
  const updatedBudget = JSON.parse(data);

  // Displaying the Stats
  displayStats(updatedBudget);

  if (!updatedBudget.transactions[0]) {
    emptyRecentHistory();
  } else {
    showRecentHistory(updatedBudget.transactions);
  }
});

chooseExpense.addEventListener("change", () => {
  if (chooseExpense.value === "other") {
    otherExpenseHolder.innerHTML = null;
    otherExpenseHolder.innerHTML =
      '<input type="text" id="expense-title" class="budget-input-box" placeholder="Expenses" pattern="^(?![0-9]+$).+" title="Expected valid expense" required>';
  } else {
    otherExpenseHolder.innerHTML = null;
  }
});

// Adding the expenses
expenseSubmitBtn.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!token)
    return Swal.fire({
      title: "Please Login!",
      text: "",
      icon: "error",
    });

  if (expenseAmt.value <= 0) {
    return Swal.fire({
      title: "Amount must be greater than 0!",
      text: "",
      icon: "error",
    });
  }

  let expenseNameHolder;

  if (chooseExpense.value === "other") {
    const expenseName = document.getElementById("expense-title");
    expenseNameHolder = expenseName.value;
    otherExpenseHolder.innerHTML = null;
  } else {
    expenseNameHolder = chooseExpense.value;
  }

  let expenses = {
    transactionDetails: {
      name: expenseNameHolder,
      amount: +expenseAmt.value,
    },
    expenseAmt: +expenseAmt.value,
  };

  dashOverlay.style.display = "block";
  dashLoader.style.display = "block";
  socket.emit("expenses", JSON.stringify(expenses));
  expenseSubmitBtn.reset();
});

// Getting the Updated Expenses
socket.on("expenseDeduct", (data) => {
  dashOverlay.style.display = "none";
  dashLoader.style.display = "none";
  const updatedExpense = JSON.parse(data);

  // Displaying the Stats
  displayStats(updatedExpense);

  // Display Transactions
  if (!updatedExpense.transactions[0]) {
    emptyRecentHistory();
  } else {
    showRecentHistory(updatedExpense.transactions);
  }

  // Checking if the expenses > budget
  if (updatedExpense.balance < 0) {
    Swal.fire({
      title: "Expenses exceeded!",
      text: "",
      icon: "warning",
    });
  }
});

// Getting the Updated expenses history
socket.on("updatedExpenses", (data) => {
  dashOverlay.style.display = "none";
  dashLoader.style.display = "none";
  const updatedHistory = JSON.parse(data);

  // Displaying the Stats
  displayStats(updatedHistory);

  // Display Transactions
  if (!updatedHistory.transactions[0]) {
    emptyRecentHistory();
  } else {
    showRecentHistory(updatedHistory.transactions);
  }

  // Checking if the expenses > budget
  if (updatedHistory.balance < 0) {
    Swal.fire({
      title: "Expenses exceeded budget!",
      text: "",
      icon: "warning",
    });
  }
});

// FUNCTIONS TO DISPLAY STATS
function displayStats(data) {
  displayBudget.innerText = data.budget;
  displayExpense.innerText = data.expenses;
  displayBalance.innerText = data.balance;
}

function emptyRecentHistory() {
  historyContainer.innerHTML = null;
  let tr = document.createElement("tr");
  let noData = document.createElement("td");
  noData.setAttribute("class", "data-null");
  noData.setAttribute("colspan", 4);
  noData.innerText = "No Recent Transactions";
  tr.append(noData);
  historyContainer.append(tr);
}

function showRecentHistory(data) {
  historyContainer.innerHTML = null; //
  data.forEach((ele, i) => {
    let tr = document.createElement("tr");
    let name = document.createElement("td");
    name.innerText = ele.name;
    let amount = document.createElement("td");
    amount.innerText = ele.amount;
    let remove = document.createElement("td");
    let edit = document.createElement("td");
    let deleteIcon = document.createElement("img");
    deleteIcon.setAttribute(
      "src",
      "./images/cancel-delete-remove-svgrepo-com.png"
    );
    let editIcon = document.createElement("img");
    editIcon.setAttribute("src", "./images/edit-pen-write-1-svgrepo-com.png");
    editIcon.addEventListener("click", () => openEditPopup(ele._id, data));

    deleteIcon.addEventListener("click", () => {
      if (!data[0]) return emptyRecentHistory();

      let filtered = data.filter((element, index) => {
        if (i === index) return false;
        return true;
      });
      dashOverlay.style.display = "block";
      dashLoader.style.display = "block";

      // Sending Updated transactions
      socket.emit(
        "removeExpenses",
        JSON.stringify({ filtered, amt: ele.amount })
      );
    });

    remove.append(deleteIcon);
    edit.append(editIcon);
    tr.append(name, amount, remove, edit);

    historyContainer.append(tr);
  });
}

let details = {};
function openEditPopup(itemId, data) {
  let item = data.find((item) => item._id === itemId);

  if (item) {
    details = {
      itemId,
      data,
      prevAmt: item.amount,
    };

    document.getElementById("editName").value = item.name;
    document.getElementById("editAmount").value = item.amount;
    dashOverlay.style.display = "block";
    popupForm.style.display = "flex";
  }
}

popupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let editName = document.getElementById("editName").value;
  let editAmount = parseInt(document.getElementById("editAmount").value);

  let { itemId, data, prevAmt } = details;

  let newData = data.map((item) => {
    if (item._id === itemId) {
      return {
        // only name and amount will change, rest remains same
        ...item,
        name: editName,
        amount: editAmount,
      };
    } else {
      return item;
    }
  });

  socket.emit(
    "updateExpenses",
    JSON.stringify({ newData, amt: editAmount - prevAmt })
  );
  popupForm.style.display = "none";
  dashLoader.style.display = "block";
});

closePopup.addEventListener("click", () => {
  popupForm.style.display = "none";
  dashOverlay.style.display = "none";
});

// INDEX.JS CODE

// Allowing the user only if logged In
let datas = JSON.parse(localStorage.getItem("user")) || null;

//logout
const modal = document.getElementById("modal");
const logout = document.getElementById("logout");
const logoutOverlay = document.getElementsByClassName("logout-overlay")[0];

function toggleModal() {
  if (token) {
    document.getElementById("log").setAttribute("href", "#");
    modal.style.display = "flex";
    logoutOverlay.classList.add("visible-logout-overlay");
  } else {
    modal.style.display = "none";
    logoutOverlay.classList.remove("visible-logout-overlay");
  }
}

function removeOverlayLg() {
  logoutOverlay.classList.remove("visible-logout-overlay");
  modal.style.display = "none";
}

logout.addEventListener("click", () => {
  sessionStorage.removeItem("token");
  localStorage.removeItem("user");
  document.getElementById("log").innerText = "Login";
  window.location.href = "./index.html";
});

if (token) {
  document.getElementById("log").innerText = datas;
} else {
  document.getElementById("log").innerText = "Login";
}

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);
