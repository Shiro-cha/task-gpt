import type { User } from "./User";

export class Message{
    id: string;
    text: string;
    createdAt: Date;
    user: User;
    constructor(id: string, text: string, createdAt: Date, user: User) {
        this.id = id;
        this.text = text;
        this.createdAt = createdAt;
        this.user = user;
    }}