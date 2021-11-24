'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn('Biodata', 'user_id', {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "Users",

                },
                key: "id",
            },
            allowNull: true,
            onDelete: 'cascade',
            onUpdate: 'cascade'
        })
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Biodata', 'user_id');
    }
};