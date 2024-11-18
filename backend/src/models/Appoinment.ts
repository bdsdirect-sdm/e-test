import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import User from "./User";
import Patient from "./Patient"; // Assuming there's a Patient model

class Appointment extends Model {
    public uuid!: string;
    public patientId!: number; // Assuming patientId is an integer
    public date!: string; // You might want to use DATE type here instead of STRING
    public type!: string;
    public userId!: number;
}

Appointment.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    patientId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    appointmentDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    appointmentType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Appointment',
    paranoid:true,
});

User.hasMany(Appointment, { foreignKey: "userId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Appointment.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Patient.hasMany(Appointment, { foreignKey: "patientId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Appointment.belongsTo(Patient, { foreignKey: "patientId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Appointment;
