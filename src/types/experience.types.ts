export interface AddExperiencePayload {
    company_name: string;
    role: string;
    start_date: string;
    description?: string;
    end_date: string | null;
    tech_stacks: string[];
}

export interface UpdateExperiencePayload {
    company_name?: string;
    role?: string;
    start_date?: string;
    description?: string;
    end_date?: string | null;
    tech_stacks?: string[];
}