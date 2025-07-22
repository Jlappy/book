import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ICartPopulated } from '../../shared/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = '/cart';

  constructor(private baseService: BaseService) { }

  getCart(): Observable<ICartPopulated> {
    return this.baseService.get<ICartPopulated>(this.apiUrl);
  }

  addToCart(bookId: string, quantity: number): Observable<ICartPopulated> {
    return this.baseService.post<ICartPopulated>(this.apiUrl, { bookId, quantity });
  }

  updateQuantity(bookId: string, quantity: number): Observable<ICartPopulated> {
    return this.baseService.put<ICartPopulated>(this.apiUrl, { bookId, quantity });
  }

  removeFromCart(bookId: string): Observable<ICartPopulated> {
    return this.baseService.delete<ICartPopulated>(`${this.apiUrl}/${bookId}`);
  }

  clearCart(): Observable<ICartPopulated> {
    return this.baseService.delete<ICartPopulated>(this.apiUrl);
  }
}