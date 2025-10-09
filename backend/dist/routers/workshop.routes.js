"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parfume_controller_1 = require("../controllers/parfume.controller");
const parfumeRouter = express_1.default.Router(); //dodeljivanje rutera
parfumeRouter.route("/save").post(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new parfume_controller_1.ParfumeController().save(req, res) //poziva se UserController i njegova login metoda
);
parfumeRouter.route("/update").post(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new parfume_controller_1.ParfumeController().update(req, res) //poziva se UserController i njegova login metoda
);
parfumeRouter.route("/getAllParfumes").get(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new parfume_controller_1.ParfumeController().getAllParfumes(req, res) //poziva se UserController i njegova login metoda
);
parfumeRouter.route("/deleteParfume").post((req, res) => new parfume_controller_1.ParfumeController().deleteParfume(req, res));
parfumeRouter.route("/sub").post((req, res) => new parfume_controller_1.ParfumeController().sub(req, res));
parfumeRouter.route("/unsub").post((req, res) => new parfume_controller_1.ParfumeController().unsub(req, res));
parfumeRouter.route("/like").post((req, res) => new parfume_controller_1.ParfumeController().like(req, res));
parfumeRouter.route("/unlike").post((req, res) => new parfume_controller_1.ParfumeController().unlike(req, res));
parfumeRouter.route("/comment").post((req, res) => new parfume_controller_1.ParfumeController().comment(req, res));
parfumeRouter.route("/uncomment").post((req, res) => new parfume_controller_1.ParfumeController().uncomment(req, res));
parfumeRouter.route("/sendMail").post((req, res) => new parfume_controller_1.ParfumeController().sendMail(req, res));
parfumeRouter.route("/informAll").post((req, res) => new parfume_controller_1.ParfumeController().informAll(req, res));
parfumeRouter.route("/updateParfume").post((req, res) => new parfume_controller_1.ParfumeController().updateParfume(req, res));
parfumeRouter.route("/reject").post((req, res) => new parfume_controller_1.ParfumeController().reject(req, res));
parfumeRouter.route("/accept").post((req, res) => new parfume_controller_1.ParfumeController().accept(req, res));
parfumeRouter.route("/syncMail").post((req, res) => new parfume_controller_1.ParfumeController().syncMail(req, res));
parfumeRouter.route("/syncUsername").post((req, res) => new parfume_controller_1.ParfumeController().syncUsername(req, res));
parfumeRouter.route("/addMessage").post((req, res) => new parfume_controller_1.ParfumeController().addMessage(req, res));
exports.default = parfumeRouter;
//# sourceMappingURL=workshop.routes.js.map