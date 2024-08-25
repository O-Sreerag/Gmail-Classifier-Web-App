export interface OAuthUser {
    email: string;
    family_name: string;
    given_name: string;
    id: string;
    name: string;
    picture: string;
    verified_email: boolean;
}

export interface Part {
    partId: string;
    mimeType: string;
    filename: string;
    headers: { name: string; value: string }[];
    body: { size: number; data: string };
}

export interface Email {
    id: string;
    threadId: string;
    labelIds: string[];
    snippet: string;
    payload: {
        partId: string;
        mimeType: string;
        filename: string;
        headers: { name: string; value: string }[];
        body: { size: number, data: string };
        parts: Part[];
    };
}

export interface ClassifiedEmail {
    id: string;
    from: string;
    to: string;
    subject: string;
    content: any;
    category?: string;
}