export interface AddUserFilterDTO {
    legally: boolean;
    location: string; //MAIl by deafult
    location_type: string ;  // PHONE or
    max_distance: number;
    max_distance_measure: string;
    professional_area: string;
    min_salary:number;
    max_salary: number;
    ready_availability: boolean;
    work_from_home: true;
    notifications: string;
}