const { User, Biodata, Room, Roundgame, Skoruser } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");

const adminLoginPage = (req, res) => {

    res.render('login', {
        title: "Login",
        message: req.flash('message')

    });
}


const mainDashboard = async(req, res) => {

    const totalUsers = await User.count({ col: 'id' });
    const totalGames = await Room.count({ col: 'id' });
    res.render('admin/main-dashboard', {
        title: "Dashboard",
        totalUsers,
        totalGames
    });
}

const addUserPage = (req, res) => {

    res.render('admin/add-user', {
        title: " Add User",
        message: req.flash('message')
    });

}

const adminAddUserController = async(req, res) => {
    const { username, password } = req.body
    const cekUser = await User.findAll({ where: { username: username } })
    console.log(cekUser);
    if (cekUser.length > 0) {
        req.flash('message', `Username ${req.body.username} already exists `);
        res.redirect('/addUser')
    } else {
        let encrypt = await bcrypt.hash(password, 10)
        await User.create({
            username: username,
            password: encrypt
        });

        res.status(201).redirect('/users');
    }
}


const getAllUsers = async(req, res) => {
    const users = await User.findAll({
        include: Biodata,
    })
    console.log(users)
    res.render('admin/list-user', {
        title: "List User",
        users
    });
}

const getAllBiodatas = async(req, res) => {
    const biodatas = await Biodata.findAll({
        include: User
    })
    console.log(biodatas)
    res.render('admin/biodata-list', {
        title: "List Biodata",
        biodatas
    });
}


const getAllGame = async(req, res) => {
    const games = await Room.findAll()
    console.log(games)
    res.render('admin/game-list', {
        title: "List Game",
        games
    });
}
const historyGames = async(req, res) => {
    const rounds = await Roundgame.findAll({ where: { room_id: req.params.id } })

    res.render('admin/round-game', {
        title: "Round Game",
        rounds
    });
}

const getSkor = async(req, res) => {
    const skors = await Skoruser.findAll({
        include: User
    })
    console.log(skors)
    res.render('admin/list-skor', {
        title: "List Skor",
        skors
    });
}

const deleteUserData = async(req, res) => {
    const user = await User.findByPk(Number(req.params.id));

    if (!user) return res.send('Not found!');

    await user.destroy();
    res.status(201).redirect('/users');

}
const deleteBiodataUser = async(req, res) => {
    const biodata = await Biodata.findByPk(Number(req.params.id));

    if (!biodata) return res.send('Not found!');

    await biodata.destroy();
    res.status(201).redirect('/biodatas');

}

const updateUserPage = async(req, res) => {
    const biodata = await Biodata.findOne({
        include: User,
        where: {
            id: req.params.id
        }
    })

    // console.log(biodata)
    res.render('admin/update-biodatas', {
        title: "Update Biodata",
        biodata,
        message: req.flash('message')
    });

}
const updateBiodatas = async(req, res) => {
    const { username, name, birth_date, email, phone_number, address } = req.body;

    const bio = await Biodata.findOne({ where: { id: req.params.id } })

    // console.log(username)

    const checkUser = await User.findAll({
        where: {
            username: username,
            [Op.not]: { id: bio.user_id }
        }

    });

    if (checkUser.length > 0) {

        req.flash('message', `Username ${req.body.username} already exists `);
        res.redirect(`/biodata/${req.params.id}/update`)
    } else {

        const biodata = await Biodata.update({
            name,
            birth_date,
            email,
            phone_number,
            address
        }, {
            where: {
                id: bio.id
            }
        });

        const user = await User.update({
            username
        }, {
            where: {
                id: bio.user_id
            }
        })

        res.redirect('/biodatas')
    }
}

const addBiodataPage = async(req, res) => {
    const user = await User.findOne({
        include: Biodata,
        where: {
            id: req.params.id
        }

    })

    console.log(user)
    res.render('admin/create-biodatas', {
        title: "Create Biodata",
        user
    });

}

const addBiodataController = async(req, res) => {
    let { name, birth_date, email, phone_number, address } = req.body;

    const user = await User.findByPk(req.params.id);
    const biodata = await Biodata.create({
        name,
        birth_date,
        email,
        phone_number,
        address,
    });
    console.log(await biodata.setUser(user));
    res.status(201).redirect('/biodatas');
}


const notfoundController = (req, res) => {
    res.status(404).render('./error/404', {
        title: "Page not found"
    });
};
const errorController = (req, res) => {
    res.status(500).render('./error/500', {
        title: "Internal Server Error"
    });
};

module.exports = {
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
    errorController,
    updateUserPage,
    historyGames,
    getSkor,
    notfoundController
}