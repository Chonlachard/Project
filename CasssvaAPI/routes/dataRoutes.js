const express = require('express');
const router = express.Router();




const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');



// เส้นทางสำหรับการลงทะเบียน
router.post('/register', registerController.register);

// เส้นทางสำหรับการเข้าสู่ระบบ
router.post('/login', loginController.login);


module.exports = router;
