const Sib = require("sib-api-v3-sdk");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const User = require("../model/signup");
const Forgotpassword = require("../model/forgotpassword");

const client = Sib.ApiClient.instance;

const apikey = client.authentications["api-key"];
apikey.apiKey = process.env.BLUE_API;

const apiInstance = new Sib.TransactionalEmailsApi();

const sender = {
  email: "ghosttown0kill@gmail.com",
  name: "Ghosty",
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const id = uuid.v4();
      console.log("ID:", id);
      const newForgotpassword = new Forgotpassword({
        userId: user._id,
        id: id,
        active: true,
      });
      newForgotpassword.save();
      await apiInstance.sendTransacEmail({
        sender,
        to: [{ email }],
        subject: "first time sending mail using api",
        textContent: "this place will be used for sending forgotten password",
        htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      });
      console.log("Forgot Password record created successfully.");
    }
  } catch (err) {
    console.error("Error:", err);
    res.send(err.message);
  }
};

exports.resetpassword = async (req, res) => {
  try {
    const id = req.params.id;
    const forgotpasswordrequest = await Forgotpassword.findOne({ id });
    if (forgotpasswordrequest.active) {
      forgotpasswordrequest.active = false;
      await forgotpasswordrequest.save();
      console.log(forgotpasswordrequest);
      res.status(200).send(`<html>
      <form id="resetPasswordForm" method="post">
  <label for="newpassword">Enter New password</label>
  <input name="newpassword" type="password" required></input>
  <button>Reset Password</button>
</form>

<script>
  const id = "your_reset_password_id"; // Replace with the actual reset password ID
  const form = document.getElementById("resetPasswordForm");
</script>

                                </html>`);
      res.end();
    }
  } catch (err) {
    console.error("Error:", err);
    res.send(err.message);
  }
};

exports.updatepassword = async (req, res) => {
  try {
    const newpassword = req.body.newpassword;
    const id = req.params.id.toString();
    const resetpasswordrequest = await Forgotpassword.findOne({ id: id });
    console.log(resetpasswordrequest.userId);
    const user = await User.findOne({
      _id: resetpasswordrequest.userId,
    });
    console.log(user);
    if (user) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(newpassword, salt);
      await user.updateOne({ pswd: hash });
      res
        .status(201)
        .json({ message: "Successfully updated the new password" });
    } else {
      return res.status(404).json({ error: "No user Exists", success: false });
    }
  } catch (err) {
    console.error("Error:", err);
    res.send(err.message);
  }
};
