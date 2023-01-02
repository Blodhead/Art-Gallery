import express from "express"
import { WorkshopController } from "../controllers/workshop.controller";

const workshopRouter = express.Router(); //dodeljivanje rutera

/*userRouter.route("/login").post( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req,res)=>new UserController().login(req,res)//poziva se UserController i njegova login metoda
)*/

workshopRouter.route("/getAllWorkshops").get( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req,res)=>new WorkshopController().getAllWorkshops(req,res)//poziva se UserController i njegova login metoda
)

export default workshopRouter;