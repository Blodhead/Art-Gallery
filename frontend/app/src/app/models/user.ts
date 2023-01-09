export class User {          //definisanje strukture
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    phone:string;
    mail:string;
    type: string;
    profile_photo_name:string;
    org_name:String;
    state: string;
    city: string;
    postal_code: string;
    street: string;
    number: number;
    pib: string;
    status:string;
    tempPass:string;
    timeStamp:Date;
}

export class Temp_Data{
    username: string;
    mail:string;
}

export class Token {
    temp_pass:string;
    time: Date;
    expires: 1800;
}
