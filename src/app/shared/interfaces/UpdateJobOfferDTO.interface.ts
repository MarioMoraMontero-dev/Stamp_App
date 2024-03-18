export interface updateJobOfferDTO {
    professional_area: string;
    job_name: string;
    job_identifier: string;
    job_description: string;
    max_distance: number;
    salary: number;
    work_from_home: boolean;
    ready_availability: boolean;
    location: string;
    locationName: string;
    experience: number;
    travelAvailability: boolean;
    // changeResidence: boolean;
    knowledge: string;
    // grade: string;
    require_criminal_record: string;
    requires_license: string;
    salaryCurrency: string;
    max_distance_measure: string;
    languages: [],
    licenses: [],
    job_id: string;
}