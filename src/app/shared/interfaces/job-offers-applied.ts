export interface JobOffersApplied {
    offer:Offer;
}

export interface Offer {
    _id:                 string;
    job_name:            string;
    job_description:     string;
    experience?:         number;
    travelAvailability?: boolean;
    knowledge?:          string;
    changeResidence?:    boolean;
}