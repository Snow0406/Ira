export interface NewAnimeResult {
    date: string;
    detail: NewAnimeInfo[];
}

interface NewAnimeInfo {
    title: string;
    studio: string;
    original: string;
    date: string;
}