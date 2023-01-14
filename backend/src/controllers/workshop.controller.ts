import * as express from "express";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import Workshops from "../models/workshop"


export class WorkshopController {

    update = (req: express.Request, res: express.Response) => {

        let original_name = req.body._name;

        let workshop = new Workshops({
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location,
            likes: req.body.likes
        })

        Workshops.updateOne({ "name": original_name },
            {
                $set: {
                    "name": workshop.name,
                    "image": workshop.image,
                    "description": workshop.description,
                    "date": workshop.date,
                    "location": workshop.location,
                    "likes": workshop.likes
                }
            }, (err, news) => {
                if (err) console.log(err);
                else res.json(news);
            });

    }

    sub = (req: express.Request, res: express.Response) => {

        console.log(req.body);

        let workshop = req.body.myWorkshopDetail;
        let user = req.body.current_user;

        Workshops.updateOne({ "name": workshop }, { $push: { "participants": user } }, (err, _workshop) => {
            if (err) console.log("ERROR");
            else res.json(_workshop);
        });
    }



    getAllWorkshops = (req: express.Request, res: express.Response) => {
        Workshops.find({}, (err, news) => {
            if (err) console.log(err);
            else res.json(news);
        }
        )
    }

    save = (req: express.Request, res: express.Response) => {
        let workshop = new Workshops({
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location,
        })
        workshop.save().then(workshop => {
            res.status(200).json({ "message": "workshop added" });
        }).catch(err => {
            res.status(400).json({ "message": "error" })
        })
    }


    deleteWorkshop = (req: express.Request, res: express.Response) => {
        let _name = req.body.name;
        Workshops.collection.deleteOne({ "name": _name });
        res.json(req.body);
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
                ews.collection.updateOne({ "Myid": Myid }, { $push: { "commnets": comment } });
                res.json({"message":"OK"});
            }
        })
    }*/
}