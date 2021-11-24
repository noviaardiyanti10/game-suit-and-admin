'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Roundgames', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
                onDelete: 'cascade',
                onUpdate: 'cascade'
            },
            room_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "Rooms",

                    },
                    key: "id",
                },
                allowNull: true,
                onDelete: 'cascade',
                onUpdate: 'cascade'
            },
            player_one_option: {
                type: Sequelize.STRING
            },
            player_two_option: {
                type: Sequelize.STRING
            },
            round_number: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            winner: {
                type: Sequelize.STRING
            },
            winner_id: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('Roundgames');
    }
};