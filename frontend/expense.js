var forms = document.getElementById("my-form");
var items = document.getElementById("items");
var total = document.getElementById("Total");
var board = document.getElementById("board");
var leader = document.getElementById("leader");
var leaderboard = document.getElementById("leaderboard");
var submit = document.getElementById("submit");
var Download = document.getElementById("download");
const paginationNumbers = document.getElementById("pagination-numbers");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const token = localStorage.getItem("token");

Download.addEventListener("click", download);
async function download() {
  try {
    const res = await axios.get("http://localhost:3000/user/download", {
      headers: { Auth: token },
    });
    if (res.status === 201) {
      const data = JSON.stringify(res.data);
      const file = new Blob([data], { type: "text/plain" });
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = "myexpenses.txt";
      a.click();
    } else {
      console.log(res.message);
    }
  } catch (err) {
    console.log(err.message + " in expense.js");
  }
}

leaderboard.addEventListener("click", async function (e) {
  if (e.target.classList.contains("lbd")) {
    leader.style.display = "block";

    const res = await axios.get("http://localhost:3000/premium/leaderboard", {
      headers: { Auth: token },
    });
    board.innerHTML = "";
    for (let j = 0; j < res.data.length; j++) {
      var user = document.createElement("li");
      user.innerHTML = `name : ${res.data[j].name}, TotalExpense : ${res.data[j].totalExpense}`;
      board.appendChild(user);
    }

    console.log(res);
  }
});

document.getElementById("rzr-button1").onclick = async function (e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:3000/premium", {
      headers: { Auth: token },
    });
    console.log(response);

    var options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        const res = await axios.post(
          "http://localhost:3000/updatepremium",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Auth: token } }
        );
        if (res) {
          alert("You are now a premium User");
        }
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", () => {
      console.log("payment failed");
      alert("payment failed");
    });
  } catch (err) {
    console.log(err.message);
  }
};

submit.addEventListener("click", async function (e) {
  e.preventDefault();
  var price = document.getElementById("price").value;
  var category = document.getElementById("category").value;
  var desc = document.getElementById("desc").value;
  let obj = {
    p: price,
    c: category,
    d: desc,
  };
  try {
    const token = localStorage.getItem("token");
    await axios
      .post("http://localhost:3000/expenses", obj, {
        headers: { Auth: token },
      })
      .then((res) => {
        console.log(res);
        display();
      });
  } catch (err) {
    console.error(err.message);
  }
});

async function display() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/expenses", {
      headers: { Auth: token},
    });
    const data = res.data;
    page = data;
    console.log(data);
    let p, c, d;
    var ttl = 0;
    const prem = await axios.get("http://localhost:3000/expense/prem", {
      headers: { Auth: token },
    });
    if (prem.data) {
      const premium = document.getElementById("rzr-button");
      premium.innerHTML = "You are a Premium Member";
    }

    

    while (items.firstChild) {
      items.removeChild(items.firstChild);
    }

    for (let i = 0; i < data.length; i++) {
      p = data[i].price;
      c = data[i].category;
      d = data[i].description;
      ttl = ttl + p;
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(p + "-" + c + "-" + d));

      var dlt = document.createElement("button");
      dlt.className = "delete btn";
      dlt.textContent = "delete";
      li.appendChild(dlt);

      var edit = document.createElement("button");
      edit.className = "edit btn";
      edit.textContent = "edit";
      li.appendChild(edit);
      items.appendChild(li);
    }
    total.textContent = "Total Price of items: " + ttl;

    const paginationLimit = 5;
    const pageCount = Math.ceil(data.length / paginationLimit);
    let currentPage;

    const appendPageNumber = (index) => {
      const pageNumber = document.createElement("button");
      pageNumber.className = "pagination-number";
      pageNumber.innerHTML = index;
      pageNumber.setAttribute("page-index", index);
      pageNumber.setAttribute("aria-blue", "Page " + index);

      paginationNumbers.appendChild(pageNumber);
    };

    const getPaginationNumbers = () => {
      for (let i = 1; i <= pageCount; i++) {
        appendPageNumber(i);
      }
    };

    getPaginationNumbers();

    const handleActivePageNumber = () => {
      document.querySelectorAll(".pagination-number").forEach((button) => {
        button.classList.remove("active");
        
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex == currentPage) {
          button.classList.add("active");
        }
      });
    };

    const setCurrentPage = (pageNum) => {
      currentPage = pageNum;
      
      handleActivePageNumber();
      const prevRange = (pageNum - 1) * paginationLimit;
      console.log(prevRange);
      const currRange = pageNum * paginationLimit;
      console.log(currRange);
      console.log(items.querySelectorAll("li"));
      items.querySelectorAll("li").forEach((item, index) => {
        item.classList.add("hidden");
        if (index >= prevRange && index < currRange) {
          item.classList.remove("hidden");
        }
      });
    };
    setCurrentPage(1);

    prevButton.addEventListener("click", () => {
      setCurrentPage(currentPage - 1);
    });
    nextButton.addEventListener("click", () => {
      setCurrentPage(currentPage + 1);
    });

    document.querySelectorAll(".pagination-number").forEach((button) => {
      const pageIndex = Number(button.getAttribute("page-index"));
  
      if (pageIndex) {
        button.addEventListener("click", () => {
          setCurrentPage(pageIndex);
        });
      }
    });
  } catch (err) {
    console.error(err.message);
  }
}

let del;

window.addEventListener("load", async () => {
  await display();
  
});

items.addEventListener("click", async function (e) {
  if (e.target.classList.contains("delete")) {
    console.log("delete btn pressed");
    var li = e.target.parentElement;
    var ul = li.parentElement;
    ul.removeChild(li);
    var desc = li.firstChild.textContent.trim().split("-")[2];
    var id;
    try {
      const res = await axios.get("http://localhost:3000/expense", {
        params: {
          desc: desc,
        },
      });
      id = res.data;
    } catch (err) {
      console.log(err);
    }
    try {
      const res = await axios
        .delete("http://localhost:3000/expenses", {
          params: {
            id: id,
          },
        })
        .then(() => {
          display();
        });
    } catch (err) {
      console.log(err);
    }
  }
});

items.addEventListener("click", async function (e) {
  if (e.target.classList.contains("edit")) {
    try {
      var li = e.target.parentElement;
      var ul = li.parentElement;
      console.log(li);
      var toEdit = li.firstChild.textContent.trim().split("-");
      var price = document.getElementById("price");
      var cat = document.getElementById("category");
      var desc = document.getElementById("desc");
      price.value = toEdit[0];
      cat.value = toEdit[1];
      desc.value = toEdit[2];
      ul.removeChild(li);
      var desc = li.firstChild.textContent.trim().split("-")[2];
      var id;
      const response = await axios.get("http://localhost:3000/expense", {
        params: {
          desc: desc,
        },
      });
      id = response.data;

      const delResponse = await axios
        .delete("http://localhost:3000/expenses", {
          params: {
            id: id,
          },
        })
        .then(() => {
          display();
        });
    } catch (error) {
      console.log(error);
    }
  }
});
