export class ParfumeDetails {

    _id: string;
    name: string;
    img_location: string;
    price: number;
    amount: number;
    description: string;
    status: string;
    
}
export class Subscription {
    mail: string;
    status: string;
}

export class Comment {
    username: string;
    image: string;
    date: Date;
    message: string;

    constructor(data){
        this.username = data.username;
        this.image = data.image;
        this.date = data.date;
        this.message = data.message
    }

}

export class Message {
    from: string;
    to: string;
    message: string;
    date: Date;

    constructor(data){
        this.from = data.from;
        this.to = data.to;
        this.message = data.message;
        this.date = data.date;
    }
}