import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import User from "./User";

class Staff extends Model {
    public uuid!: string;
    public firstname!: string;
    public lastname!: string;
    public gender!: string;
    public email!: string;
    public phoneNumber!: string;
    public userId!: number;
}

Staff.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Staff',
});

User.hasMany(Staff, { foreignKey: "userId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Staff.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Staff;
