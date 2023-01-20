import express from "express"
import { WorkshopController } from "../controllers/workshop.controller";

const workshopRouter = express.Router(); //dodeljivanje rutera

workshopRouter.route("/save").post( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req,res)=>new WorkshopController().save(req,res)//poziva se UserController i njegova login metoda
)

workshopRouter.route("/update").post( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req,res)=>new WorkshopController().update(req,res)//poziva se UserController i njegova login metoda
)

workshopRouter.route("/getAllWorkshops").get( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req,res)=>new WorkshopController().getAllWorkshops(req,res)//poziva se UserController i njegova login metoda
)

workshopRouter.route("/deleteWorkshop").post(
    (req,res)=>new WorkshopController().deleteWorkshop(req,res)
)

workshopRouter.route("/sub").post(
    (req,res)=>new WorkshopController().sub(req,res)
)

workshopRouter.route("/unsub").post(
    (req,res)=>new WorkshopController().unsub(req,res)
)

workshopRouter.route("/like").post(
    (req,res)=>new WorkshopController().like(req,res)
)

workshopRouter.route("/unlike").post(
    (req,res)=>new WorkshopController().unlike(req,res)
)

workshopRouter.route("/comment").post(
    (req,res)=>new WorkshopController().comment(req,res)
)

workshopRouter.route("/uncomment").post(
    (req,res)=>new WorkshopController().uncomment(req,res)
)

workshopRouter.route("/sendMail").post(
    (req,res)=>new WorkshopController().sendMail(req,res)
)

workshopRouter.route("/informAll").post(
    (req,res)=>new WorkshopController().informAll(req,res)
)

workshopRouter.route("/updateWorkshop").post(
    (req,res)=>new WorkshopController().updateWorkshop(req,res)
)

export default workshopRouter;