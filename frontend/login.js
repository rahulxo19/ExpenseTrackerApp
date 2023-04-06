var login = document.getElementById("login");
var err = document.getElementById("err");

login.addEventListener("submit", loginHandler);

async function loginHandler(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const pswd = document.getElementById("pswd").value;

  const obj = {
    email,
    pswd,
  };

  console.log(obj);

  try {
    const res = await axios.post("http://localhost:3000/login", obj);
    if (res.status == 201) {
      localStorage.setItem('token',res.data.token);
      alert("User Login Successful");
      // Redirect to expense.html page
      window.location.href = "./expense.html";
    } else {
      err.innerHTML = res.data.error;
    }
  } catch (error) {
    console.log(error);
    err.innerHTML = error.response.data.error;
  }
}
