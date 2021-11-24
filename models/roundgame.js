'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Roundgame extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Room, {
                foreignKey: 'room_id'
            })
        }
    };
    Roundgame.init({
        room_id: DataTypes.INTEGER,
        player_one_option: DataTypes.STRING,
        player_two_option: DataTypes.STRING,
        round_number: DataTypes.INTEGER,
        winner: DataTypes.STRING,
        winner_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Roundgame',
    });
    return Roundgame;
};