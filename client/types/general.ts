export interface Meta {
    pagination: Pagination
}

export interface Pagination {
    page: number
    pageSize: number
    pageCount: number
    total: number
}

export interface Photo {
    data: Datum[];
}

export interface Datum {
    id: number;
    attributes: PhotoAttributes;
}

export interface PhotoAttributes {
    name: string;
    alternativeText?: any;
    caption?: any;
    width: number;
    height: number;
    formats: FormatsPhoto;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: any;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
}

export interface FormatsPhoto {
    large: FormatsPhotoItem;
    small: FormatsPhotoItem;
    medium: FormatsPhotoItem;
    thumbnail: FormatsPhotoItem;
}


export interface FormatsPhotoItem {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path?: any;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
}

export interface PageParams {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
