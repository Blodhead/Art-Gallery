import mongoose from 'mongoose'

const Schema = mongoose.Schema; 

let User = new Schema({ //sva polja koja postoje u users semi
    profile_photo_name:{
        type:String
    },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:String
    },
    mail:{
        type:String
    },
    type:{
        type:String
    },
    org_name:{
        type:String
    },
    state:{
        type:String
    },
    city:{
        type:String
    },
    postal_code:{
        type:String
    },
    street:{
        type:String
    },
    number:{
        type:Number
    },
    pib:{
        type:String
    },
    status:{
        type:String
    }
})

export default mongoose.model("User", User, "users");// (1)Dodeljuje promenjivoj "User" , za semu (2)User koju smo gore definisali kako izgleda,
                                                     // za kolekciju koja dolazi iz (3)"users" collection iz baze