import { IBook } from './book.model';
import { Types } from 'mongoose';

export interface ICartItem {
  book: string; 
  quantity: number;
}

export interface ICart {
  _id?: string;
  user: string; 
  items: ICartItem[];
}

export interface ICartPopulated {
  _id?: string;
  user: string;
  items: {
    book: IBook; 
    quantity: number;
  }[];
}