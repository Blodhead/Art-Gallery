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
    long_desc:string;
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
}