import express from 'express'; //koristimo express aplikaciju
import cors from "cors" //mogucnost deljenja podataka izmedju dva "servera" tj. domena npr. 4000 i 4200
import bodyParser from "body-parser" //da moze da se kupe i ubacuj podaci na sajt
import mongoose from 'mongoose'; //radi konektovanja na mongo bazu
import userRouter from "./routers/user.routes"
import workshopRouter from './routers/workshop.routes';

const app = express(); //nasoj aplikaciji dodeljujemo da je exxpress aplikacija
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
  });
app.use(cors());//uvezivanje fron i back end-a
app.use(bodyParser.json());//sve sto se podaci kojima se barata su json dormata

mongoose.connect("mongodb://127.0.0.1/PIAMEAN");//dodeljivanje baze mongoos-u

const connection = mongoose.connection;//uvezivanje sa bazom

connection.once("open",()=>{ //once it's open ispisi "db connection ok"(lambda izraz)
    console.log("db connection ok");
})

const router = express.Router(); //kreiranje rutera, obradjuje zahteve sa fronta
router.use("/users", userRouter); //ako dodje ruta /user, tj. svaki zahtev koji dolazi sa stranice "user" preusmeri ka ovom ruteru
router.use("/workshop",workshopRouter);
app.use("/", router);//svaka ruta koja se pojavi koristi ovaj ruter, i kasnije u savisnosti od toga koja ruta dodje vrsi se specijalizacija i salje se na predodredjeni ruter

app.listen(4000, () => console.log(`Express server running on port 4000`));