import express from "express"
import { ParfumeController } from "../controllers/parfume.controller";

const parfumeRouter = express.Router(); //dodeljivanje rutera

parfumeRouter.route("/login").post( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req, res) => new ParfumeController().login(req, res)//poziva se ParfumeController i njegova login metoda
)

parfumeRouter.route("/getAllParfumes").get( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req, res) => new ParfumeController().getAllParfumes(req, res)//poziva se ParfumeController i njegova login metoda
)

parfumeRouter.route("/getTempData").get( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req, res) => new ParfumeController().getTempData(req, res)//poziva se ParfumeController i njegova login metoda
)

parfumeRouter.route("/getByName").get(
    (req, res) => new ParfumeController().getByName(req, res)
)

parfumeRouter.route("/update").post(
    (req, res) => new ParfumeController().update(req, res)
)

parfumeRouter.route("/register").post(
    (req, res) => new ParfumeController().register(req, res)
)

parfumeRouter.route("/deleteParfume").post(
    (req, res) => new ParfumeController().deleteParfume(req, res)
)

parfumeRouter.route("/updateStatus").post(
    (req, res) => new ParfumeController().updateStatus(req, res)
)

parfumeRouter.route("/sendMail").post(
    (req, res) => new ParfumeController().sendMail(req, res)
)

parfumeRouter.route("/updatePassword").post(
    (req, res) => new ParfumeController().updatePassword(req, res)
)

export default parfumeRouter; //eksportuj ruter da se moze koristiti negde drugde