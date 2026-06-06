export interface AddProjectPayload {
    title: string;
    description: string;
    tech_stacks: string[];
    url?: string | null;
    github_url?: string | null;
    status: 'completed' | 'in_progress';
    images: ProjectImage[];
};

export interface ProjectImage {
    image_url: string;
    is_thumbnail: boolean;
    public_id?: string;
}