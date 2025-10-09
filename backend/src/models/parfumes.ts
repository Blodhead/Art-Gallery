import mongoose from 'mongoose'

const Schema = mongoose.Schema; 

let Parfume = new Schema({
    name:{
        type:String
    },
    amount:{
        type:Number
    },
    price:{
        type:Number
    },
    img_location:{
        type:String
    }
})

export default mongoose.model("Parfume", Parfume, "Parfumes");// (1)Dodeljuje promenjivoj "User" , za semu (2)User koju smo gore definisali kako izgleda,
                                                     // za kolekciju koja dolazi iz (3)"users" collection iz baze