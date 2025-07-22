import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBook extends Document {
  title: string;
  description?: string;
  cover?: number; 
  coverUrl?: string;
  author?: string[];
  openLibraryId?: string; 
  price: number;
  first_publish_year?: number;
  source: 'openlibrary' | 'manual';
  createdAt: Date;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  description: String,
  cover: Number,
  coverUrl: String,
  author: [String],
  openLibraryId: { type: String, unique: true, sparse: true }, 
  price: { type: Number, required: true },
  first_publish_year: Number,
  source: {
    type: String,
    enum: ['openlibrary', 'manual'],
    default: 'manual',
  },
  createdAt: { type: Date, default: Date.now },
});

const Book: Model<IBook> = mongoose.model<IBook>('Book', bookSchema);
export default Book;
