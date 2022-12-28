"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let User = new Schema({
    profile_photo_name: {
        profile_photo_name: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: Number
    },
    org_name: {
        org_name: String
    },
    state: {
        state: String
    },
    city: {
        city: String
    },
    postal_code: {
        postal_code: String
    },
    street: {
        street: String
    },
    number: {
        number: Number
    },
    pib: {
        pib: String
    }
});
exports.default = mongoose_1.default.model("User", User, "users"); // (1)Dodeljuje promenjivoj "User" , za semu (2)User koju smo gore definisali kako izgleda,
// za kolekciju koja dolazi iz (3)"users" collection iz baze
//# sourceMappingURL=users.js.map