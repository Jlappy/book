import Book, { IBook } from '../models/book.model';

export const getAllBooks = async (): Promise<IBook[]> => {
  const books = await Book.find();
  return books;
};

export const getBookById = async (bookId: string): Promise<IBook | null> => {
  const book = await Book.findById(bookId);
  return book;
};

export const createBook = async (bookData: Partial<IBook>): Promise<IBook> => {
  const { title, author, openLibraryId } = bookData;

  if (openLibraryId) {
    const exists = await Book.findOne({ openLibraryId });
    if (exists) throw new Error('Sách đã tồn tại (OpenLibrary ID)');
  } else {
    const exists = await Book.findOne({ title, author, source: 'manual' });
    if (exists) throw new Error('Sách trùng tên và tác giả');
  }

  const book = new Book({
    ...bookData,
    source: openLibraryId ? 'openlibrary' : 'manual'
  });

  await book.save();
  return book;
};

export const updateBook = async (bookId: string, updateData: Partial<IBook>): Promise<IBook | null> => {
  const updated = await Book.findByIdAndUpdate(bookId, updateData, { new: true });
  return updated;
};

export const deleteBook = async (bookId: string): Promise<IBook | null> => {
  const deleted = await Book.findByIdAndDelete(bookId);
  return deleted;
};
