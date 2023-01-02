import mongoose from 'mongoose'

const Schema = mongoose.Schema; 

let Workshops = new Schema({ //sva polja koja postoje u users semi
    name:{
        name:String
    },
    image:{
        image:String
    },
    date:{
        date:Date
    },
    place:{
        place:String
    },
    description:{
        description:String
    },
    likes:{
        likes:Number
    }

})

export default mongoose.model("Workshops", Workshops, "workshops");// (1)Dodeljuje promenjivoj "User" , za semu (2)User koju smo gore definisali kako izgleda,
                                                     // za kolekciju koja dolazi iz (3)"users" collection iz baze