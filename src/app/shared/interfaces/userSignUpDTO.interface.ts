export interface UserSignUpDTO{
    name: string;
    last_name: string;
    email: string;
    password: string;
    birth_date: string;
    phone_number: string;
    photo?: any;
    notifications: string;
}