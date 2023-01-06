"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopController = void 0;
const workshop_1 = __importDefault(require("../models/workshop"));
class WorkshopController {
    constructor() {
        this.update = (req, res) => {
            let original_name = req.body._name;
            let workshop = new workshop_1.default({
                name: req.body.name,
                image: req.body.image,
                description: req.body.description,
                date: req.body.date,
                location: req.body.location,
                likes: req.body.likes
            });
            workshop_1.default.updateOne({ "name": original_name }, { $set: {
                    "name": workshop.name,
                    "image": workshop.image,
                    "description": workshop.description,
                    "date": workshop.date,
                    "location": workshop.location,
                    "likes": workshop.likes
                } }, (err, news) => {
                if (err)
                    console.log(err);
                else
                    res.json(news);
            });
        };
        this.getAllWorkshops = (req, res) => {
            workshop_1.default.find({}, (err, news) => {
                if (err)
                    console.log(err);
                else
                    res.json(news);
            });
        };
        this.save = (req, res) => {
            let workshop = new workshop_1.default({
                name: req.body.name,
                image: req.body.image,
                description: req.body.description,
                date: req.body.date,
                location: req.body.location,
            });
            workshop.save().then(workshop => {
                res.status(200).json({ "message": "workshop added" });
            }).catch(err => {
                res.status(400).json({ "message": "error" });
            });
        };
        this.deleteWorkshop = (req, res) => {
            let _name = req.body.name;
            workshop_1.default.collection.deleteOne({ "name": _name });
            res.json(req.body);
        };
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
}
exports.WorkshopController = WorkshopController;
//# sourceMappingURL=workshop.controller.js.map