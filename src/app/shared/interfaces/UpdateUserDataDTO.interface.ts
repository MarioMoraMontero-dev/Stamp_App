export interface UpdateUserDataDTO{
    name: string;
      last_name: string;
      email:  string;
      birth_date: string;
      phone_number:  string,
      phtoto?: File,
      oldPassword:  string;
      newPassword: string;
      notifications: string;
}