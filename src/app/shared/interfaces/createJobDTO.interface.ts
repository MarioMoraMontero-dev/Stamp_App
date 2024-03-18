export interface CreateJobDTO {
    job_name: string; //
    max_distance: number; //
    job_identifier: string; //
    location: string; //
    professional_area: string; //
    work_from_home: boolean; //
    salary: number; //
    job_description: string; //
    ready_availability: boolean; //
    experience: number; //
    travelAvailability: boolean; //
    knowledge: string; //
    require_criminal_record: boolean; //
    requires_license: boolean; //
    languages: [];
    locationName: string; //  ------------------------------- what????
    licenses: []; // empty by default
    max_distance_measure: string; // KM or MI
    salaryCurrency: string; // DOLAR or COLON

}