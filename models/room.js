'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Room extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Room.hasMany(models.Roundgame, { foreignKey: 'room_id' });

            this.belongsTo(models.User, {
                foreignKey: 'player_one_id'
            });
            this.belongsTo(models.User, {
                foreignKey: 'player_two_id'
            });
        }
    };
    Room.init({
        room_name: DataTypes.STRING,
        player_one_id: DataTypes.INTEGER,
        player_two_id: DataTypes.INTEGER,
        game_result: DataTypes.STRING,
        final_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Room',
        tableName: 'Rooms'
    });
    return Room;
};