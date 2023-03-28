var forms = document.getElementById("my-form");
var items = document.getElementById("items");

forms.addEventListener("submit", addExpense);
items.addEventListener("click", removeItm);
items.addEventListener("click", editItm);

function addExpense(e) {
  e.preventDefault();
  var price = document.getElementById("price").value;
  var category = document.getElementById("category").value;
  var desc = document.getElementById("desc").value;
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(price + "-" + category + "-" + desc));
  var dlt = document.createElement("button");
  dlt.className = "delete";
  li.appendChild(dlt);
  dlt.appendChild(document.createTextNode("delete"));
  var edit = document.createElement("button");
  edit.className = "edit";
  edit.appendChild(document.createTextNode("edit"));
  li.appendChild(edit);
  items.appendChild(li);
  let obj = {
    p: price,
    c: category,
    d: desc,
  };
  axios
    .post("http://localhost:3000/", obj)
    .catch((err) => console.error(err.message));
}
let del;

window.addEventListener("DOMContentLoaded", () => {
  async function display() {
    setTimeout(() => {
      axios.get("http://localhost:3000/").then((res) => {
        const data = res.data;
        let p, c, d;
        for (let i = 0; i < data.length; i++) {
          p = data[i].price;
          c = data[i].category;
          d = data[i].description;
          var li = document.createElement("li");
          li.appendChild(document.createTextNode(p + "-" + c + "-" + d));
          var dlt = document.createElement("button");
          dlt.className = "delete";
          li.appendChild(dlt);
          dlt.appendChild(document.createTextNode("delete"));
          var edit = document.createElement("button");
          edit.className = "edit";
          edit.appendChild(document.createTextNode("edit"));
          li.appendChild(edit);
          items.appendChild(li);
        }
        console.log(res);
      }, 1000);
    });
  }
  async function main() {
    await display();
  }
  main();
});

async function removeItm(e) {
  if (e.target.classList.contains("delete")) {
    var li = e.target.parentElement;
    var ul = li.parentElement;
    ul.removeChild(li);
    var desc = li.firstChild.textContent.trim().split("-")[2];
    var id;
    await axios
      .get("http://localhost:3000/del", {
        params: {
          desc: desc,
        },
      })
      .then((res) => {
        console.log(res.data);
        id = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    await axios.delete("http://localhost:3000/" , {
      params: {
        id : id,
      }
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }
}

async function editItm(e) {
  if (e.target.classList.contains("edit")) {
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
    await axios
      .get("http://localhost:3000/del", {
        params: {
          desc: desc,
        },
      })
      .then((res) => {
        console.log(res.data);
        id = res.data;
      })
      .catch((err) => {
        console.log(err);
      });

      await axios.delete("http://localhost:3000/" , {
        params: {
          id : id,
        }
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
  }
}
