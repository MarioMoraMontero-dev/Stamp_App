export interface EmployerSignUpDTO{
    name: string;
    email: string;
    password: string;
    phone_number: string;
    employer_Name: string;
    enterprise_ID?: string;
    description: string;
    photo?: any;
}