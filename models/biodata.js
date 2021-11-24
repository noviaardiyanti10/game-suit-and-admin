'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Biodata extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Biodata.belongsTo(models.User, {
                foreignKey: 'user_id'
            })
        }
    };
    Biodata.init({
        name: DataTypes.STRING,
        birth_date: DataTypes.DATE,
        email: DataTypes.STRING,
        phone_number: DataTypes.STRING,
        address: DataTypes.STRING,
        user_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Biodata',
    });
    return Biodata;
};