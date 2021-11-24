'use strict';
const { User } = require('../models');

module.exports = {
    up: async(queryInterface, Sequelize) => {
        const users = await User.findOne({ where: { username: 'admin-game' } })
        await queryInterface.bulkInsert('Biodata', [{
            name: "Agung Ayu Dita",
            birth_date: "1998-09-07",
            email: "aadita123@gmail.com",
            phone_number: "0897235235",
            address: "Jogjakarta",
            user_id: users.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        }])
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Biodata', null, {});
    }
};