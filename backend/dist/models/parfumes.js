"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Parfume = new Schema({
    name: {
        type: String
    },
    amount: {
        type: Number
    },
    price: {
        type: Number
    },
    img_location: {
        type: String
    }
});
exports.default = mongoose_1.default.model("Parfume", Parfume, "Parfumes"); // (1)Dodeljuje promenjivoj "User" , za semu (2)User koju smo gore definisali kako izgleda,
// za kolekciju koja dolazi iz (3)"users" collection iz baze
//# sourceMappingURL=parfumes.js.map