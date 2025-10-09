"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parfume_controller_1 = require("../controllers/parfume.controller");
const parfumeRouter = express_1.default.Router(); //dodeljivanje rutera
parfumeRouter.route("/login").post(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new parfume_controller_1.ParfumeController().login(req, res) //poziva se ParfumeController i njegova login metoda
);
parfumeRouter.route("/getAllParfumes").get(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new parfume_controller_1.ParfumeController().getAllParfumes(req, res) //poziva se ParfumeController i njegova login metoda
);
parfumeRouter.route("/getTempData").get(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new parfume_controller_1.ParfumeController().getTempData(req, res) //poziva se ParfumeController i njegova login metoda
);
parfumeRouter.route("/update").post((req, res) => new parfume_controller_1.ParfumeController().update(req, res));
parfumeRouter.route("/register").post((req, res) => new parfume_controller_1.ParfumeController().register(req, res));
parfumeRouter.route("/deleteParfume").post((req, res) => new parfume_controller_1.ParfumeController().deleteParfume(req, res));
parfumeRouter.route("/updateStatus").post((req, res) => new parfume_controller_1.ParfumeController().updateStatus(req, res));
parfumeRouter.route("/sendMail").post((req, res) => new parfume_controller_1.ParfumeController().sendMail(req, res));
parfumeRouter.route("/updatePassword").post((req, res) => new parfume_controller_1.ParfumeController().updatePassword(req, res));
exports.default = parfumeRouter; //eksportuj ruter da se moze koristiti negde drugde
//# sourceMappingURL=parfume.routes.js.map