import * as express from "express";
import Workshops from "../models/workshop"


export class WorkshopController {

    getAllWorkshops = (req: express.Request, res: express.Response) => {
        Workshops.find({}, (err, news) => {
            if (err) console.log(err);
            else res.json(news);
        }
        )
    }

    /*addComment = (req: express.Request, res: express.Response) => {
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
    }*/
}