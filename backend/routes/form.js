const express = require("express");

const form = require("../controllers/form");

const signup = require("../controllers/users");

const purchase = require("../controllers/purchase");

const password = require("../controllers/forgotPassword");

const authentication = require("../middleware/auth");

const router = express.Router();

router.post("/login", signup.login);

router.post("/", signup.postUser);

router.get("/premium/leaderboard", authentication.Auth, purchase.leaderboard);

router.get("/premium", authentication.Auth, purchase.purchaseMembership);

router.post("/updatepremium", authentication.Auth, purchase.updateMembership);

router.get("/expense/prem", authentication.Auth, form.getMemb);

router.get("/expense/:desc", authentication.Auth, form.getDetail);

router.get("/user/download", authentication.Auth, form.download);

router.post("/password/forgotpassword", password.forgotPassword);

router.get("/password/resetpassword/:id", password.resetpassword);

router.post("/password/resetpassword/:id", password.updatepassword);

router.delete("/expenses/:id", form.delExpense);

router.get("/expenses", authentication.Auth, form.getDetails);

router.post("/expenses", authentication.Auth, form.postDetail);

module.exports = router;
