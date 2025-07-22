import { IBook } from './book.model';
import { Types } from 'mongoose'; 

export interface IOrderItem {
  book: string; 
  quantity: number;
  price: number; 
}

export interface IOrder {
  _id?: string;
  user: string; 
  items: IOrderItem[];
  total: number;
  createdAt?: Date;
  status: 'pending' | 'completed';
}

export interface IOrderPopulated {
  _id?: string;
  user: string;
  items: {
    book: IBook; 
    quantity: number;
    price: number;
  }[];
  total: number;
  createdAt?: Date;
  status: 'pending' | 'completed';
}