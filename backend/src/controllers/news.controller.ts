import * as express from "express";
import News from "../models/news"


export class NewsController {

    getAllNews = (req: express.Request, res: express.Response) => {
        News.find({}, (err, news) => {
            if (err) console.log(err);
            else res.json(news);
        }
        )
    }

    addComment = (req: express.Request, res: express.Response) => {
        let Myid = req.body.Myid;
        let comm = req.body.comm;

        News.findOne({ "Myid": Myid }, (err, news) => {
            if (err) console.log(err);
            else {
                let comment = {
                    text: comm
                }
                News.collection.updateOne({ "Myid": Myid }, { $push: { "commnets": comment } });
                res.json({"message":"OK"});
            }
        })
    }
}