const { User, Biodata, Skoruser } = require('../models');
const { success, error, fail, } = require('../controllers/responseBuilder')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const skoruser = require('../models/skoruser');
require("dotenv").config();

const registerUser = async(req, res) => {
    const { username, password, name, birth_date, email, phone_number, address } = req.body;

    try {
        const userCheck = await User.findAll({ where: { username: username } });

        if (userCheck.length > 0) return res.status(401).send('Username already exists');

        encrypt = await bcrypt.hash(password, 10)

        const user = await User.create({
            username: username,
            password: encrypt,

        });

        const biodata = await Biodata.create({
            name,
            birth_date,
            email,
            phone_number,
            address,
            user_id: user.id
        })

        const skor = await Skoruser.create({
            user_id: user.id,
            skor: 0
        })

        // console.log(password + '\n' + encrypt);
        return res.status(201).json(success({
            username,
            biodata
        }));

    } catch (error) {
        return res.status(500).json(error)
    }

}

function validPassword(password, encrypt) {
    return bcrypt.compare(password, encrypt)
}

const userLogin = async(req, res) => {

    const user = await User.findOne({ where: { username: req.body.username } });


    if (!user) {
        res.status(401).json(fail({
            message: 'You are not register. Please register you account before.'
        }));

    }

    let result = await validPassword(req.body.password, user.password);
    console.log(result);

    if (user.role === 'PlayerUser' && result == true) {
        //Create token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.TOKEN_SECRET, {
            expiresIn: '1h'
        });
        res.header('authorization', token).json(success({
            token: token
        }));
    } else {
        return res.status(401).json(fail({
            message: 'Login Failed'
        }));

    }


}


const adminLogin = async(req, res) => {

    const user = await User.findOne({ where: { username: req.body.username } });


    if (!user) {
        req.flash('message', 'Forbidden. Login Failed');
        res.redirect("/");

    }

    let result = await validPassword(req.body.password, user.password);
    console.log(result);

    if (user.role === 'SuperAdmin' && result == true) {
        req.session.username = req.body.username;
        res.redirect('/dashboard')

    } else {
        req.flash('message', 'Login Failed');
        res.redirect("/");

    }


}

const logoutUser = async(req, res) => {
    req.session.destroy();
    res.redirect('/');
}


module.exports = { registerUser, userLogin, adminLogin, logoutUser };