import express from "express"
import { NewsController } from "../controllers/news.controller";

const newsRouter = express.Router(); //dodeljivanje rutera

newsRouter.route("/getAllNews").get( //ako dodje "/login" ruta on obradjuje POST zahtev, za GET ne zna sta da radi, jer nije definisano
    (req,res)=>new NewsController().getAllNews(req,res)//poziva se UserController i njegova login metoda
)

newsRouter.route("/addComment").post(
    (req,res)=>new NewsController().addComment(req,res)
)

export default newsRouter; //eksportuj ruter da se moze koristiti negde drugde