import express from "express"
import { UserController } from "../controllers/user.controller";

const userRouter = express.Router(); //dodeljivanje rutera

userRouter.route("/login").post( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req,res)=>new UserController().login(req,res)//poziva se UserController i njegova login metoda
)

userRouter.route("/register").post(
    (req,res)=>new UserController().register(req,res)
)

export default userRouter; //eksportuj ruter da se moze koristiti negde drugde