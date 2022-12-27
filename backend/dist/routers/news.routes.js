"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const news_controller_1 = require("../controllers/news.controller");
const newsRouter = express_1.default.Router(); //dodeljivanje rutera
newsRouter.route("/getAllNews").get(//ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
(req, res) => new news_controller_1.NewsController().getAllNews(req, res) //poziva se UserController i njegova login metoda
);
newsRouter.route("/addComment").post((req, res) => new news_controller_1.NewsController().addComment(req, res));
exports.default = newsRouter; //eksportuj ruter da se moze koristiti negde drugde
//# sourceMappingURL=news.routes.js.map