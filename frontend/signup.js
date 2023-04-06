var signUp = document.getElementById("signUp");

signUp.addEventListener("submit", SignUp);

async function SignUp(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const pswd = document.getElementById("pswd").value;

  const obj = {
    name,
    email,
    pswd,
  };

  await axios.post('http://localhost:3000/', obj)
  .then(res => {
    console.log(res);
    window.location.href = "./login.html";
  })
  .catch(err => {
    console.log('error aya h')
  })

}