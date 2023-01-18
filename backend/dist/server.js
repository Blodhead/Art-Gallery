"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //koristimo express aplikaciju
const cors_1 = __importDefault(require("cors")); //mogucnost deljenja podataka izmedju dva "servera" tj. domena npr. 4000 i 4200
const body_parser_1 = __importDefault(require("body-parser")); //da moze da se kupe i ubacuj podaci na sajt
const mongoose_1 = __importDefault(require("mongoose")); //radi konektovanja na mongo bazu
const user_routes_1 = __importDefault(require("./routers/user.routes"));
const workshop_routes_1 = __importDefault(require("./routers/workshop.routes"));
const app = (0, express_1.default)(); //nasoj aplikaciji dodeljujemo da je exxpress aplikacija
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use((0, cors_1.default)()); //uvezivanje fron i back end-a
app.use(body_parser_1.default.json()); //sve sto se podaci kojima se barata su json dormata
mongoose_1.default.connect("mongodb://127.0.0.1/PIAMEAN"); //dodeljivanje baze mongoos-u
const connection = mongoose_1.default.connection; //uvezivanje sa bazom
connection.once("open", () => {
    console.log("db connection ok");
});
const router = express_1.default.Router(); //kreiranje rutera, obradjuje zahteve sa fronta
router.use("/users", user_routes_1.default); //ako dodje ruta /user, tj. svaki zahtev koji dolazi sa stranice "user" preusmeri ka ovom ruteru
router.use("/workshop", workshop_routes_1.default);
app.use("/", router); //svaka ruta koja se pojavi koristi ovaj ruter, i kasnije u savisnosti od toga koja ruta dodje vrsi se specijalizacija i salje se na predodredjeni ruter
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map