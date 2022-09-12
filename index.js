import express from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";

mongoose
    .connect(
        "mongodb+srv://bahram:bahram123456@cluster0.m3bkulz.mongodb.net/blog?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB ok"))
    .catch((error) => console.log("DB error", error));

const app = express();

app.use(express.json());

app.post("/auth/register", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: "Не удалось зарегистрироваться",
        });
    }
});

app.post("/auth/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email }); 

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден!",
            });
        }

        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!isValidPass) {
            return res.status(404).json({
                message: "Неверный логин или пароль!",
            });
        }

        const token = jwt.sign({ _id: user._id }, "secret123", {
            expiresIn: "30d",
        });

        const { passwordHash, ...userData } = user._doc;
        res.json({ ...userData, token });
        // res.json(user)
    } catch (error) {
        res.status(500).json({
            message: "Не удалось авторизоваться",
        });
    }
});

app.get("/auth/me", checkAuth, async (req,res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if(!user){
            return res.status(404).json({
                message:'Пользователь'
            })
        }
    } catch (error) {
        
    }
})

app.listen(4444, (err) => {
    if (err) {
        return console.log("err");
    }
    console.log("Server OK");
});
