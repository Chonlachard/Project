const express = require('express');
const router = express.Router();




const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');

const userController = require('../controllers/getUser'); // ปรับเส้นทางให้ตรง

router.get('/user', userController.user);

// เส้นทางสำหรับการลงทะเบียน
router.post('/register', registerController.register);

// เส้นทางสำหรับการเข้าสู่ระบบ
router.post('/login', loginController.login);


module.exports = router;
