var forms = document.getElementById("my-form");
var items = document.getElementById("items");
var total = document.getElementById("Total")

forms.addEventListener("submit", addExpense);
items.addEventListener("click", removeItm);
items.addEventListener("click", editItm);

async function addExpense(e) {
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
  try {
    const res = await axios.post("http://localhost:3000/", obj);
    console.log(res);
    display();
  } catch (err) {
    console.error(err.message);
  }
}

let del;

async function display() {
  try {
    const res = await axios.get("http://localhost:3000/");
    const data = res.data;
    let p, c, d;
    var ttl = 0;

    items.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      p = data[i].price;
      c = data[i].category;
      d = data[i].description;
      ttl = ttl + p;
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
    total.textContent = "Total Price of items :" + ttl ;
  } catch (err) {
    console.error(err.message);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  display();
})

async function removeItm(e) {
  if (e.target.classList.contains("delete")) {
    var li = e.target.parentElement;
    var ul = li.parentElement;
    ul.removeChild(li);
    var desc = li.firstChild.textContent.trim().split("-")[2];
    var id;
    try {
      const res = await axios.get("http://localhost:3000/del", {
        params: {
          desc: desc,
        },
      });
      console.log(res.data);
      id = res.data;
    } catch (err) {
      console.log(err);
    }
    try {
      const res = await axios.delete("http://localhost:3000/", {
        params: {
          id: id,
        },
      });
      console.log(res);
      await display();
    } catch (err) {
      console.log(err);
    }
  }
}

async function editItm(e) {
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
      const response = await axios.get("http://localhost:3000/del", {
        params: {
          desc: desc,
        },
      });
      console.log(response.data);
      id = response.data;

      const delResponse = await axios.delete("http://localhost:3000/" , {
        params: {
          id : id,
        }
      });
      console.log(delResponse.data);
      await display();
    } catch (error) {
      console.log(error);
    }
  }
}