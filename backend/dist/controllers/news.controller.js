"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const news_1 = __importDefault(require("../models/news"));
class NewsController {
    constructor() {
        this.getAllNews = (req, res) => {
            news_1.default.find({}, (err, news) => {
                if (err)
                    console.log(err);
                else
                    res.json(news);
            });
        };
        this.addComment = (req, res) => {
            let Myid = req.body.Myid;
            let comm = req.body.comm;
            news_1.default.findOne({ "Myid": Myid }, (err, news) => {
                if (err)
                    console.log(err);
                else {
                    let comment = {
                        text: comm
                    };
                    news_1.default.collection.updateOne({ "Myid": Myid }, { $push: { "commnets": comment } });
                    res.json({ "message": "OK" });
                }
            });
        };
    }
}
exports.NewsController = NewsController;
//# sourceMappingURL=news.controller.js.map