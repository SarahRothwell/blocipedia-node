const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController")


router.get("/users/signup", userController.signUp);
router.post("/users", validation.validateUsers, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/upgrade", userController.upgradeForm);
router.post("/users/:id/upgradeCharge", userController.upgradeCharge);
router.post("/users/:id/upgradeUser", userController.upgradeUser);
router.get("/users/downgrade", userController.downgradeForm);
router.post("/users/:id/downgradeUser", userController.downgradeUser);


module.exports = router;
