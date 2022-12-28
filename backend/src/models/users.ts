import mongoose from 'mongoose'

const Schema = mongoose.Schema; 

let User = new Schema({ //sva polja koja postoje u users semi
    profile_photo_name:{
        profile_photo_name:String
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
    type:{
        type:Number
    },
    org_name:{
        org_name:String
    },
    state:{
        state:String
    },
    city:{
        city:String
    },
    postal_code:{
        postal_code:String
    },
    street:{
        street:String
    },
    number:{
        number:Number
    },
    pib:{
        pib:String
    }
})

export default mongoose.model("User", User, "users");// (1)Dodeljuje promenjivoj "User" , za semu (2)User koju smo gore definisali kako izgleda,
                                                     // za kolekciju koja dolazi iz (3)"users" collection iz baze