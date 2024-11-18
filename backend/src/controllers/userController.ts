import { Local } from "../environment/env";
import Address from "../models/Address";
import Patient from "../models/Patient";
import sendOTP from "../utils/mailer";
import User from "../models/User";
import { Response } from 'express';
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import bcrypt from 'bcrypt';
import Staff from "../models/Staff";
import Appointment from "../models/Appoinment";

const Security_Key: any = Local.SECRET_KEY;

const otpGenerator = () => {
    return String(Math.round(Math.random() * 10000000000)).slice(0, 6);
}

export const registerUser = async (req: any, res: Response) => {
    try {
        const { firstname, lastname, doctype, email, password } = req.body;
        const isExist = await User.findOne({ where: { email: email } });
        if (isExist) {
            res.status(401).json({ "message": "User already Exist" });
        }
        else {

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ firstname, lastname, doctype, email, password: hashedPassword });
            if (user) {
                const OTP = otpGenerator();
                sendOTP(user.email, OTP);
                res.status(201).json({ "OTP": OTP, "message": "Data Saved Successfully" });
            }
            else {
                res.status(403).json({ "message": "Something Went Wrong" });
            }
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
}

export const verifyUser = async (req: any, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            user.is_verified = true;
            user.save();
            res.status(200).json({ "message": "User Verfied Successfully" });
        }
        else {
            res.status(403).json({ "message": "Something Went Wrong" })
        }
    }
    catch (err) {
        res.status(500).json({ "message": err })
    }
}

export const loginUser = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                if (user.is_verified) {
                    const token = jwt.sign({ uuid: user.uuid }, Security_Key);
                    res.status(200).json({ "token": token, "user": user, "message": "Login Successfull" });
                }
                else {
                    const OTP = otpGenerator();
                    sendOTP(user.email, OTP);
                    res.status(200).json({ "user": user, "OTP": OTP, "message": "OTP sent Successfully" });
                }
            }
            else {
                res.status(403).json({ "message": "Invalid Password" });
            }
        }
        else {
            res.status(403).json({ "message": "User doesn't Exist" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
}

export const getUser = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid }, include: Address });
        if (user) {
            const referCount = await Patient.count({ where: { referedto: uuid } });
            const referCompleted = await Patient.count({ where: { referedto: uuid, referalstatus: 1 } });
            let docCount;

            if (user.doctype == 1) {
                docCount = await User.count({ where: { is_verified: 1 } });
            }
            else {
                docCount = await User.count({ where: { is_verified: 1, doctype: 1 } });
            }
            res.status(200).json({ "user": user, "message": "User Found", "docCount": docCount, "referCount": referCount, "referCompleted": referCompleted });
        }
        else {
            res.status(404).json({ "message": "User Not Found" })
        }
    }
    catch (err) {
        res.status(500).json({ "message": `Error--->${err}` })
    }
}

export const getDocList = async (req: any, res: Response) => {
    try {
        console.log("11111111111111");
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } })
        let docList;
        if (user?.doctype == 1) {
            docList = await User.findAll({ where: { uuid: { [Op.ne]: uuid } }, include: Address });
        }
        else {
            docList = await User.findAll({ where: { doctype: 1, uuid: { [Op.ne]: uuid } }, include: Address });
        }
        if (docList) {
            res.status(200).json({ "docList": docList, "message": "Docs List Found" });
        }
        else {
            res.status(404).json({ "message": "MD List Not Found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }

}

export const getPatientList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });
        if (user) {
            let patientList: any = await Patient.findAll({ where: { [Op.or]: [{ referedby: uuid }, { referedto: uuid }] } });
            if (patientList) {
                const plist: any[] = [];

                for (const patient of patientList) {
                    const [referedtoUser, referedbyUser, address] = await Promise.all([
                        User.findOne({ where: { uuid: patient.referedto } }),
                        User.findOne({ where: { uuid: patient.referedby } }),
                        Address.findOne({ where: { uuid: patient.address } }),
                    ]);

                    const newPatientList: any = {
                        uuid: patient.uuid,
                        firstname: patient.firstname,
                        lastname: patient.lastname,
                        disease: patient.disease,
                        referalstatus: patient.referalstatus,
                        referback: patient.referback,
                        createdAt: patient.createdAt,
                        updatedAt: patient.updatedAt,
                        referedto: referedtoUser,
                        referedby: referedbyUser,
                        address: address,
                    };

                    plist.push(newPatientList);
                }

                console.log("Data----->", plist);
                // console.log("P-------->", patientList[0]);
                res.status(200).json({ "patientList": plist, "message": "Patient List Found" });
            }
            else {
                res.status(404).json({ "message": "Patient List Not Found" });
            }
        }
        else {
            res.status(404).json({ "message": "User Not Found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
}

export const addPatient = async (req: any, res: Response) => {
    try {

        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });
        if (user) {
            const { firstname, lastname, disease, address, referedto, referback } = req.body;

            const patient = await Patient.create({ firstname, lastname, disease, address, referedto, referback, referedby: uuid });
            if (patient) {
                res.status(200).json({ "message": "Patient added Successfully" });
            }
        }
        else {
            res.status(401).json({ "message": "you're not Authorised" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
}

export const addAddress = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });
        if (user) {
            const { street, district, city, state, pincode, phone } = req.body;
            const address = await Address.create({ street, district, city, state, pincode, phone, user: uuid });
            if (address) {
                res.status(200).json({ "message": "Address added Successfully" });
            }
            else {
                res.status(400).json({ "message": "Error in Saving Address" });
            }
        }
        else {
            res.status(401).json({ "message": "you're not Authorised" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
}

export const getDoctorList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;

        console.log("User UUID:", req.user);

        const user = await User.findOne({ where: { uuid: uuid }, include: Address });

        if (user) {
            const referCount = await Patient.count({ where: { referedto: uuid } });

            const referCompleted = await Patient.count({ where: { referedto: uuid, referalstatus: 1 } });

            const docCount = await User.count({
                where: {
                    is_verified: 1,
                    doctype: [1, 2],
                }
            });

            const doctorList = await User.findAll({
                where: {
                    doctype: [1, 2],
                    is_verified: 1,
                },
                include: Address,
            });


            res.status(200).json({
                user,
                message: "User Found",
                docCount,
                referCount,
                referCompleted,
                doctorList,
            });
        } else {
            res.status(404).json({ message: "User Not Found" });
        }
    } catch (err) {
        console.error("Error fetching doctor list:", err);
        res.status(500).json({ message: `Error: ${err}` });
    }
};


export const getUserProfile = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid }, include: Address });
        
        if (!user) {
            return res.status(404).json({ "message": "User Not Found" });
        }

        let profileDetails: any = {
            user: user,
            message: "User Found",
        };

        if (user.doctype === 1) { // If user is a Doctor
            // Doctor-specific data
            const patientCount = await Patient.count({ where: { referedto: uuid } });
            const referredPatients = await Patient.findAll({ where: { referedto: uuid } });
            profileDetails = {
                ...profileDetails,
                patientCount: patientCount,
                referredPatients: referredPatients,
            };
        } else if (user.doctype === 2) { // If user is a Patient
            // Patient-specific data
            const referredDoctors = await User.findAll({ where: { uuid: { [Op.in]: user.referredby } }, include: Address });
            profileDetails = {
                ...profileDetails,
                referredDoctors: referredDoctors,
            };
        } else {
            
            profileDetails = {
                ...profileDetails,
                additionalData: "Custom data for Admin or other types"
            };
        }

        res.status(200).json(profileDetails);
    } catch (err) {
        res.status(500).json({ "message": `Error--->${err}` });
    }
};

export const updateprofile = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const { firstname, lastname, phone, email } = req.body;

        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.phone = phone || user.phone;
        user.email = email || user.email;

        await user.save();

        return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating profile" });
    }
};

export const changePassword = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const { currentPassword, newPassword } = req.body;

    
        const user = await User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(403).json({ "message": "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ "message": "Password updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ "message": "Error updating password" });
    }
};

export const addStaff = async (req: any, res: Response):Promise<void> => {
    try {
        const { uuid } = req.user;

        const user = await User.findOne({ where: { uuid: uuid } });

        if (user) {
            const { firstname, lastname, gender, email, phoneNumber } = req.body;

            if (!firstname || !lastname || !gender || !email || !phoneNumber) {
                 res.status(400).json({ message: 'All fields are required' });
                 return
            }

            const staff = await Staff.create({
                firstname,
                lastname,
                gender,
                email,
                phoneNumber,
                userId: uuid,
            });

            if (staff) {
                 res.status(200).json({ message: 'Staff added successfully' });
                 return
            } else {
                 res.status(400).json({ message: 'Error in saving staff' });
                 return
            }
        } else {
             res.status(401).json({ message: "You're not authorized" });
             return
        }
    } catch (err) {
        console.error(err);
         res.status(500).json({ message: 'Server error, please try again later' });
         return
    }
};


export const getStaffList = async (req: any, res: Response):Promise<void> => {
    try {
        console.log("testin")
        const { uuid } = req.user;

        const staffList = await Staff.findAll({
            where: { userId: uuid },  
            attributes: ['uuid', 'firstname', 'lastname', 'gender', 'email', 'phoneNumber'],  
        });
        console.log("stafff list ---------------->",staffList)
        if (!staffList) {
             res.status(404).json({ "message": "Staff Not Found for this user" });
             return
        }
        res.status(200).json(staffList);

    } catch (err) {
        console.error(err);
         res.status(500).json({ message: 'Server error, please try again later.' });
         return
    }
};


export const addAppoinment = async (req: any, res: Response):Promise<void> => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
        const { appointmentDate, patientId, appointmentType } = req.body;
        
        const appoinment = await Appointment.create({
            appointmentDate,
            patientId,
            appointmentType,
            userId: uuid,
        });
    }
    }catch(err:any){
        console.error(err)
    }
}