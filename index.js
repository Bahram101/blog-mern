import express from "express";
import mongoose from "mongoose";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";

mongoose
    .connect(
        "mongodb+srv://bahram:bahram123456@cluster0.m3bkulz.mongodb.net/blog?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB ok"))
    .catch((error) => console.log("DB error", error));

const app = express();

app.use(express.json());

app.post("/auth/register", registerValidation, UserController.register);
app.post("/auth/login", loginValidation, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);

// app.get("/posts", PostController.getAll)
// app.get("/posts/:id", PostController.getOne)
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
// app.delete("/posts", PostController.remove)
// app.patch("/posts", PostController.update)

app.listen(4444, (err) => {
    if (err) {
        return console.log("err");
    }
    console.log("Server OK");
});
