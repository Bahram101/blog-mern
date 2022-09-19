import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import { UserController, PostController } from "./controllers/index.js";
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from "./validations.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

const app = express();

mongoose
    .connect(
        "mongodb+srv://bahram:bahram123456@cluster0.m3bkulz.mongodb.net/blog?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB ok"))
    .catch((error) => console.log("DB error", error));

const storage = multer.diskStorage({
    destination: (_, __, callBack) => {
        callBack(null, "uploads");
    },
    filename: (_, file, callBack) => {
        callBack(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));

app.post(
    "/auth/register",
    registerValidation,
    handleValidationErrors,
    UserController.register
);
app.post(
    "/auth/login",
    loginValidation,
    handleValidationErrors,
    UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
    "/posts",
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.create
);
app.patch(
    "/posts/:id",
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.update
);
app.delete("/posts/:id", checkAuth, PostController.remove);

app.listen(3000, (err) => {
    if (err) {
        return console.log("err");
    }
    console.log("Server OK");
});
