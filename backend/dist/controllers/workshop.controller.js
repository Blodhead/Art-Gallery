"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopController = void 0;
const workshop_1 = __importDefault(require("../models/workshop"));
class WorkshopController {
    constructor() {
        this.getAllWorkshops = (req, res) => {
            workshop_1.default.find({}, (err, news) => {
                if (err)
                    console.log(err);
                else
                    res.json(news);
            });
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