"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workshop_controller_1 = require("../controllers/workshop.controller");
const workshopRouter = express_1.default.Router(); //dodeljivanje rutera
/*userRouter.route("/login").post( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req,res)=>new UserController().login(req,res)//poziva se UserController i njegova login metoda
)*/
workshopRouter.route("/getAllWorkshops").get(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new workshop_controller_1.WorkshopController().getAllWorkshops(req, res) //poziva se UserController i njegova login metoda
);
exports.default = workshopRouter;
//# sourceMappingURL=workshop.routes.js.map