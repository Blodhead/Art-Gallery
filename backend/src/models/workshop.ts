import mongoose from 'mongoose'

const Schema = mongoose.Schema; 

let Workshops = new Schema({ //sva polja koja postoje u users semi
    name:{
        type:String
    },
    image:{
        type:String
    },
    date:{
        type:Date
    },
    location:{
        type:String
    },
    description:{
        type:String
    },
    likes:{
        type:Array
    },
    owner:{
        type:String
    },
    status:{
        type:String
    }

})

export default mongoose.model("Workshops", Workshops, "workshops");// (1)Dodeljuje promenjivoj "User" , za semu (2)User koju smo gore definisali kako izgleda,
                                                     // za kolekciju koja dolazi iz (3)"users" collection iz baze