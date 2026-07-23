export interface User {
    _id?: string;
    name:string;
    email:string;
    phone:string;
    dateOfBirth:string;
    role:"User" | "Admin";
}