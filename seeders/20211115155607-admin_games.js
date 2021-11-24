'use strict';
const bcrypt = require('bcrypt');


module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Users', [{
            username: "admin-game", //Jangan dirubah
            password: await bcrypt.hash("Passwordinirahasia-07", 10),
            role: "SuperAdmin",
            createdAt: new Date(),
            updatedAt: new Date(),
        }])
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
    }
};