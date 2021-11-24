const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authToken');
const { registerUser, userLogin, adminLogin, logoutUser } = require('../controllers/userController');
const { checkLogin, isLogin } = require('../middleware/loginSession');
const { createRoom, updateBiodata, getBiodata, deleteBiodata, addBiodata, updateUser, deleteUser, enterRoom, roundGame, updateRound, generateSkor, gameHistory } = require('../controllers/playerController');


const {
    adminLoginPage,
    mainDashboard,
    addUserPage,
    adminAddUserController,
    getAllUsers,
    deleteUserData,
    getAllBiodatas,
    deleteBiodataUser,
    updateBiodatas,
    addBiodataPage,
    addBiodataController,
    getAllGame,
    updateUserPage,
    historyGames,
    getSkor,
    notfoundController,
    errorController
} = require('../controllers/adminController');

router.post('/register', registerUser)
router.post('/login', userLogin);
router.post('/create-room', authToken, createRoom);
router.get('/api/v1/game-histories', authToken, gameHistory)
router.put('/api/v1/biodata', authToken, updateBiodata)
router.get('/api/v1/biodata', authToken, getBiodata)
router.delete('/api/v1/biodata', authToken, deleteBiodata)
router.post('/api/v1/biodata', authToken, addBiodata)
router.put('/api/v1/users', authToken, updateUser)
router.delete('/api/v1/users', authToken, deleteUser)
router.put('/enter-room/:id', authToken, enterRoom);
router.post('/fight/:id', authToken, roundGame);
router.put('/fight/:id', authToken, updateRound);
router.get('/api/v1/get-scores', authToken, generateSkor)





//ADMIN ROUTES
router.get('/', isLogin, adminLoginPage);
router.get('/login', isLogin, adminLoginPage);
router.post('/login-admin', adminLogin);
router.get('/logout', checkLogin, logoutUser);

router.get('/dashboard', checkLogin, mainDashboard);
router.get('/addUser', checkLogin, addUserPage);
router.post('/addUser', checkLogin, adminAddUserController);
router.get('/users', checkLogin, getAllUsers);
router.get('/users/:id/delete', checkLogin, deleteUserData);

router.get('/games', checkLogin, getAllGame);
router.get('/gameHistories/:id', checkLogin, historyGames);
router.get('/skors', checkLogin, getSkor);

router.get('/biodatas', checkLogin, getAllBiodatas);
router.get('/biodata/:id/delete', checkLogin, deleteBiodataUser);
router.get('/biodata/:id/update', checkLogin, updateUserPage);
router.post('/biodatas/:id/update', checkLogin, updateBiodatas);
router.get('/addBiodatas/:id', checkLogin, addBiodataPage);
router.post('/addBiodatas/:id', checkLogin, addBiodataController);

router.use('*', notfoundController)
router.use('*', errorController);
module.exports = router;