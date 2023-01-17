"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workshop_controller_1 = require("../controllers/workshop.controller");
const workshopRouter = express_1.default.Router(); //dodeljivanje rutera
workshopRouter.route("/save").post(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new workshop_controller_1.WorkshopController().save(req, res) //poziva se UserController i njegova login metoda
);
workshopRouter.route("/update").post(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new workshop_controller_1.WorkshopController().update(req, res) //poziva se UserController i njegova login metoda
);
workshopRouter.route("/getAllWorkshops").get(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new workshop_controller_1.WorkshopController().getAllWorkshops(req, res) //poziva se UserController i njegova login metoda
);
workshopRouter.route("/deleteWorkshop").post((req, res) => new workshop_controller_1.WorkshopController().deleteWorkshop(req, res));
workshopRouter.route("/sub").post((req, res) => new workshop_controller_1.WorkshopController().sub(req, res));
workshopRouter.route("/unsub").post((req, res) => new workshop_controller_1.WorkshopController().unsub(req, res));
workshopRouter.route("/like").post((req, res) => new workshop_controller_1.WorkshopController().like(req, res));
workshopRouter.route("/unlike").post((req, res) => new workshop_controller_1.WorkshopController().unlike(req, res));
workshopRouter.route("/comment").post((req, res) => new workshop_controller_1.WorkshopController().comment(req, res));
workshopRouter.route("/uncomment").post((req, res) => new workshop_controller_1.WorkshopController().uncomment(req, res));
exports.default = workshopRouter;
//# sourceMappingURL=workshop.routes.js.map