export type Technology = {
    id: number;
    name: string;
    slug: string;
    type: string | null;
    icon: string | null;
    icon_class: string | null;
    color: string | null;
    order: number;
    is_featured: boolean;
};

export type Feature = {
    id: number;
    project_id: number;
    title: string;
    description: string | null;
    icon: string | null;
    order: number;
};

export type Project = {
    id: number;
    user_id: number | null;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    featured_image: string | null;
    thumbnail: string | null;
    gallery: string[] | null;
    video_url: string | null;
    demo_url: string | null;
    github_url: string | null;
    client_name: string | null;
    client_logo: string | null;
    client_url: string | null;
    client_website: string | null;
    client_testimonial: string | null;
    client_position: string | null;
    start_date: string | null;
    end_date: string | null;
    duration: string | null;
    team_size: number | null;
    role: string | null;
    status: string;
    is_featured: boolean;
    is_published: boolean;
    show_in_portfolio: boolean;
    order: number;
    views_count: number;
    likes_count: number;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    featured_image_url?: string | null;
    thumbnail_url?: string | null;
    gallery_urls?: string[];
    client_logo_url?: string | null;
    technologies?: Technology[];
    features?: Feature[];
    published_testimonials?: Testimonial[];
    testimonials_count?: number;
    user?: {
        id: number;
        name: string;
    };
};

export type Skill = {
    id: number;
    name: string;
    category: string;
    icon: string | null;
    years_experience: number | null;
    is_highlighted: boolean;
    order: number;
    created_at: string;
    updated_at: string;
};

export type Testimonial = {
    id: number;
    project_id: number | null;
    client_name: string;
    client_position: string | null;
    client_company: string | null;
    client_avatar: string | null;
    client_avatar_url?: string | null;
    content: string;
    rating: number | null;
    is_featured: boolean;
    is_published: boolean;
    order: number;
    project?: Project | null;
    created_at: string;
    updated_at: string;
};

export type Experience = {
    id: number;
    title: string;
    company: string;
    company_logo: string | null;
    company_logo_url?: string | null;
    company_url: string | null;
    location: string | null;
    employment_type: string | null;
    description: string | null;
    responsibilities: string[] | null;
    achievements: string[] | null;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    order: number;
    duration?: string;
    period?: string;
    created_at: string;
    updated_at: string;
};

export type Education = {
    id: number;
    degree: string;
    institution: string;
    institution_logo: string | null;
    institution_logo_url?: string | null;
    location: string | null;
    field_of_study: string | null;
    description: string | null;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    order: number;
    period?: string;
    full_degree?: string;
    created_at: string;
    updated_at: string;
};

export type Certification = {
    id: number;
    name: string;
    issuing_organization: string;
    credential_id: string | null;
    credential_url: string | null;
    badge_image: string | null;
    issue_date: string;
    expiry_date: string | null;
    does_not_expire: boolean;
    order: number;
    created_at: string;
    updated_at: string;
};

export type HomeStats = {
    projects_completed: number;
    years_experience: number;
    happy_clients: number;
    technologies_used: number;
};

export type ContactMessage = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    admin_notes: string | null;
    read_at: string | null;
    replied_at: string | null;
    created_at: string;
    updated_at: string;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};
