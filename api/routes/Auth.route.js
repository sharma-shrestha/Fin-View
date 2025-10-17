import express from 'express';
import { ForgetPassword, GoogleLogin, Logout, Register, ResetPassword, VerifyOtp} from '../controllers/Auth.controller.js';
import { Login } from '../controllers/Auth.controller.js';


const AuthRoute = express.Router();

AuthRoute.post('/register', Register);
AuthRoute.post('/login', Login);
AuthRoute.post('/google-login',GoogleLogin)
AuthRoute.get('/logout',Logout);
AuthRoute.post("/forgot-password", ForgetPassword);
AuthRoute.post("/verify-otp", VerifyOtp);
AuthRoute.post("/reset-password", ResetPassword);

export default AuthRoute;
