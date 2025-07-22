export interface IBook {
  _id?: string;
  title: string;
  description?: string;
  cover?: number;
  coverUrl?: string;
  author?: string[];
  openLibraryId?: string;
  price: number;
  first_publish_year?: number;
  source?: 'openlibrary' | 'manual';
  createdAt?: Date;
}
export interface IOpenLibrarySearchBackendResult {
  openLibraryId: string;
  title: string;
  author?: string[];
  first_publish_year?: number;
  isbn?: string; // Backend đã lấy ISBN đầu tiên
  cover?: number;
  coverUrl?: string;
}
