'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Rooms', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
                onDelete: 'cascade',
                onUpdate: 'cascade'
            },
            room_name: {
                type: Sequelize.STRING
            },
            player_one_id: {
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
            },
            player_two_id: {
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
            },
            game_result: {
                type: Sequelize.STRING
            },
            final_id: {
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
        await queryInterface.dropTable('Rooms');
    }
};