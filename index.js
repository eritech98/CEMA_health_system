import express from "express";
import pg from "pg";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";
import crypto from "crypto";
//import database configuration
import pool from "./Database/db.js";
///Import Get Routes
import home from "./api_Routes/GET/home.js";
import signup from "./api_Routes/GET/signup.js";
import login from "./api_Routes/GET/login.js";
import dashboard from "./api_Routes/GET/dashboard.js";
import verify from "./api_Routes/GET/verify_token.js";
import logout from "./api_Routes/GET/logout.js";
import addProgram from "./api_Routes/GET/addprogram.js";
import clientRegister from "./api_Routes/GET/clientRegister.js";
import programEnroll from "./api_Routes/GET/programEnroll.js";
import forgotPassword from "./api_Routes/GET/forgot_password.js";
import deleteAccount from "./api_Routes/GET/deleteAccount.js";
import resetToken from "./api_Routes/GET/resetToken.js";
import clients from "./api_Routes/GET/clients.js";
//Test Apis imports
import getClients from "./Test_apis/getclient.js";
import getAllUsers from "./Test_apis/getAllUsers.js";
import programs from "./Test_apis/programs.js";

///Post Routes imports
import signup_post from "./api_Routes/POST/signup_post.js";
import transporter from "./Transporter/email.js";
import login_post from "./api_Routes/POST/login_post.js";
import programADD_post from "./api_Routes/POST/programADD_post.js";
import clientRegister_post from "./api_Routes/POST/clientRegister_post.js";
import ProgramsEnrol from "./api_Routes/POST/programsEnrol.js";
import forgotPassword_post from "./api_Routes/POST/forgotPassword_post.js";
import processToken from "./api_Routes/POST/processToken.js";
//Delete Routes
import clientDelete from "./api_Routes/DELETE/clientDelete.js";
import doctorDelete from "./api_Routes/DELETE/doctorDelete.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

///Get Routes
app.use("/", home);
app.use("/signup", signup);
app.use("/login", login);
app.use("/dashboard", dashboard);
app.use("/verify", verify);
app.use("/logout", logout);
app.use("/programs/add", addProgram);
app.use("/clients/register", clientRegister);
app.use("/programs/enroll", programEnroll);
app.use("/forgot-password", forgotPassword);
app.use("/doctor/delete", deleteAccount);
app.use("/reset-password", resetToken);
app.use("/clients", clients);
//Test api Routes
app.use("/api/clients", getClients);
app.use("/api/users", getAllUsers);
app.use("/api/programs-per-doctor", programs);


//post Routes
app.use("/signup-post", signup_post);
app.use("/login", login_post);
app.use("/programs/add", programADD_post);
app.use("/clients/register_post", clientRegister_post);
app.use('/programs/enroll', ProgramsEnrol);
app.use("/forgot-password", forgotPassword_post);
app.use("/reset-password", processToken);
//Delete Routes
app.use("/clients", clientDelete);
app.use("/doctor/delete", doctorDelete);



app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
