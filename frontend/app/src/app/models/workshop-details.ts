export class WorkshopDetails {
    image: string;//path to an image
    name: string;
    date: Date;
    location: string;
    description: string;
    likes: string[];
    owner: string;
    status: string;
    participants: Array<Subscription>;
}
export class Subscription{
    mail: string;
    status:string;
}