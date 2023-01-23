export class WorkshopDetails {
    image: string;//path to an image
    name: string;
    date: Date;
    location: string;
    description: string;
    likes: string[];
    owner: string;
    status: string;
    comments: Array<Comment>;
    participants: Array<Subscription>;
    gallery: Array<string>;
    long_desc: string;
    free_spaces: number;
    messages: Array<Message>;
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
}