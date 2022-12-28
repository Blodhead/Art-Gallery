"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router(); //dodeljivanje rutera
userRouter.route("/login").post(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new user_controller_1.UserController().login(req, res) //poziva se UserController i njegova login metoda
);
userRouter.route("/getTempData").get(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new user_controller_1.UserController().getTempData(req, res) //poziva se UserController i njegova login metoda
);
userRouter.route("/register").post((req, res) => new user_controller_1.UserController().register(req, res));
exports.default = userRouter; //eksportuj ruter da se moze koristiti negde drugde
//# sourceMappingURL=user.routes.js.map