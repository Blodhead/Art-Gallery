import mongoose from 'mongoose'

const Schema = mongoose.Schema; 

let News = new Schema({ //sva polja koja postoje u users semi
    Myid:{
        Myid:Number
    },
    caption:{
        caption:String
    },
    comments:{
        comments:Array
    }
})

export default mongoose.model("News", News, "news");// (1)Dodeljuje promenjivoj "User" , za semu (2)User koju smo gore definisali kako izgleda,
                                                     // za kolekciju koja dolazi iz (3)"users" collection iz baze