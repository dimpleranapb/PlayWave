// import  {Router}  from "express";
// import {registerUser} from "./../controllers/user.controller";
// //import {registerUser} from "../controllers/user.controller";

// const router = Router();



// module.exports = router;


import express from "express";
import registerUser from '../controllers/user.controller.js';
const router = express.Router();

router.route("/register").get(registerUser)
// router.post('/register', registerUser.registerUser);

// module.exports = router;
export default router;