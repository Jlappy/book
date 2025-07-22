export interface BookForm {
  _id?: string; 
  title: string | null; 
  description?: string | null;
  cover?: number | null;
  coverUrl?: string | null;
  author: string | string[] | null; 
  openLibraryId?: string | null;
  price: number | null;
  first_publish_year?: number | null;
  source?: 'openlibrary' | 'manual' | null;
  createdAt?: Date | null; 
}