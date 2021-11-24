'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasMany(models.Room, { foreignKey: 'player_one_id' })
            User.hasMany(models.Room, { foreignKey: 'player_two_id' })

            User.hasOne(models.Biodata, {
                foreignKey: "user_id",
            });
            User.hasOne(models.Skoruser, {
                foreignKey: "user_id",
            });
        }
    };
    User.init({
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.ENUM(("SuperAdmin", "PlayerUser"))
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users'
    });
    return User;
};