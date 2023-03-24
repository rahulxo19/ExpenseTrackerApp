var users = document.getElementById("users");
var form = document.getElementById("my-form");

form.addEventListener("submit", addUser);
users.addEventListener("click", removeItem);
users.addEventListener("click", editItem);

async function addUser(e) {
  e.preventDefault();
  var newName = document.getElementById("name").value;
  console.log(newName);
  var newEmail = document.getElementById("email").value;
  console.log(newEmail);
  let obj = {
    name: newName,
    email: newEmail,
  };
  var li = document.createElement("li");
  li.className = "list-group-item";
  li.appendChild(document.createTextNode(newName + "-" + newEmail + "-"));
  var deleteBtn = document.createElement("button");

  // Add classes to del button
  deleteBtn.className = "btn btn-danger btn-sm float-right delete";

  // Append text node
  deleteBtn.appendChild(document.createTextNode("delete "));

  li.appendChild(deleteBtn);

  var edit = document.createElement("button");

  // Add classes to del button
  edit.className = "btn btn-danger btn-sm float-right edit";

  // Append text node
  edit.appendChild(document.createTextNode("edit "));

  // Append button to li
  li.appendChild(edit);

  // Append li to list
  users.appendChild(li);

  console.log(obj);

  await axios
    .post("http://localhost:3000/", obj, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      showUsers();
    })
    .catch((err) => {
      console.log("something and i dont know what");
    });
}
async function removeItem(e) {
  if (e.target.classList.contains("delete")) {
    if (confirm("Are you sure you want to remove this user?")) {
      var li = e.target.parentElement;
      var ul = li.parentElement;
      var name = li.textContent.trim().split("-")[0];

      // remove the list item from the ul element
      ul.removeChild(li);
      console.log(name);
      // remove the corresponding object from the local storage using the name value as the key
      await axios
        .delete(`http://localhost:3000/${name}`)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}
function editItem(e) {
  if (e.target.classList.contains("edit")) {
    var li = e.target.parentElement;
    var ul = li.parentElement;
    var form = ul.previousElementSibling;
    console.log(form);
    var name = li.textContent.trim().split(" ")[0];
    var editName = document.getElementById("name");
    var editEmail = document.getElementById("email");
    editName.value = li.textContent.trim().split(" ")[0];
    editEmail.value = li.textContent.trim().split(" ")[1];

    // remove the list item from the ul element
    ul.removeChild(li);
  }
  // remove the corresponding object from the local storage using the name value as the key
}

async function showUsers() {
  try {
    const response = await axios.get("http://localhost:3000/");
    const data = response.data;
    for (const user of data) {
      var newName = user.name;
      var newEmail = user.email;
      var li = document.createElement("li");
      li.className = "list-group-item";
      li.appendChild(document.createTextNode(newName + "-" + newEmail + "-"));
      var deleteBtn = document.createElement("button");

      // Add classes to del button
      deleteBtn.className = "btn btn-danger btn-sm float-right delete";

      // Append text node
      deleteBtn.appendChild(document.createTextNode("delete "));

      li.appendChild(deleteBtn);

      var edit = document.createElement("button");

      // Add classes to del button
      edit.className = "btn btn-danger btn-sm float-right edit";

      // Append text node
      edit.appendChild(document.createTextNode("edit "));

      // Append button to li
      li.appendChild(edit);

      // Append li to list
      users.appendChild(li);
    }
  } catch (error) {
    console.error(error);
  }
}
showUsers();
