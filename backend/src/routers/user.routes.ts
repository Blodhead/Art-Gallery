import express from "express"
import { UserController } from "../controllers/user.controller";

const userRouter = express.Router(); //dodeljivanje rutera

userRouter.route("/login").post( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req, res) => new UserController().login(req, res)//poziva se UserController i njegova login metoda
)

userRouter.route("/getTempData").get( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req, res) => new UserController().getTempData(req, res)//poziva se UserController i njegova login metoda
)

userRouter.route("/update").post(
    (req, res) => new UserController().update(req, res)
)

userRouter.route("/register").post(
    (req, res) => new UserController().register(req, res)
)

userRouter.route("/checkMail").post(
    (req, res) => new UserController().checkMail(req, res)
)

userRouter.route("/deleteUser").post(
    (req, res) => new UserController().deleteUser(req, res)
)

userRouter.route("/updateStatus").post(
    (req, res) => new UserController().updateStatus(req, res)
)

userRouter.route("/sendMail").post(
    (req, res) => new UserController().sendMail(req, res)
)

userRouter.route("/requestReset").post(
    (req, res) => new UserController().requestReset(req, res)
)

userRouter.route("/verifyCode").post(
    (req, res) => new UserController().verifyCode(req, res)
)

userRouter.route("/resetPassword").post(
    (req, res) => new UserController().resetPassword(req, res)
)

userRouter.route("/updatePassword").post(
    (req, res) => new UserController().updatePassword(req, res)
)

userRouter.route("/changePassword").post(
    (req, res) => new UserController().changePassword(req, res)
)

userRouter.route("/order").post(
    (req, res) => new UserController().order(req, res)
)

userRouter.route("/logout").post(
    (req, res) => new UserController().logout(req, res)
)

export default userRouter; //eksportuj ruter da se moze koristiti negde drugde