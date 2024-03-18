export interface UserAccountData {
    JWToken: string;
    userType: string;
    profiles: {
        employer: any;
        user: {
            currentStep: number;
            email:string;
            name: string;
            photo: string;
            rate: number;
            token: string;
        }
    }
}