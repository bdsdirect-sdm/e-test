import { Router } from "express";
import { registerUser, loginUser, verifyUser, getUser, getDocList, getPatientList, addPatient, addAddress, getDoctorList, updateprofile, changePassword, addStaff, getStaffList, addAppoinment } from "../controllers/userController";
import userAuthMiddleware from "../middlewares/userAuth";
import signupValidation from "../middlewares/formValidation.ts/signupValidation";
import loginValidation from "../middlewares/formValidation.ts/loginValidation";

const router = Router();

router.post("/register", signupValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.put("/verify", verifyUser);
router.get('/user', userAuthMiddleware, getUser);
router.get('/doc-list', userAuthMiddleware, getDocList);
router.get('/doctor-list', userAuthMiddleware, getDoctorList);
router.get('/patient-list', userAuthMiddleware, getPatientList);
router.post('/add-patient', userAuthMiddleware, addPatient);
router.post('/add-address', userAuthMiddleware, addAddress);
router.post('/add-staff', userAuthMiddleware, addStaff);
router.get('/get-staff', userAuthMiddleware, getStaffList);
router.get('/app-appoinment', userAuthMiddleware, addAppoinment);
router.post('/update-profile', userAuthMiddleware, updateprofile);
router.post("/change-password", userAuthMiddleware, changePassword);

export default router;

