import express from "express";
import mongoose from "mongoose";

import { UserController, PostController } from "./controllers/index.js";
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from "./validations.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";

mongoose
    .connect(
        "mongodb+srv://bahram:bahram123456@cluster0.m3bkulz.mongodb.net/blog?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB ok"))
    .catch((error) => console.log("DB error", error));

const app = express();

app.use(express.json());

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
