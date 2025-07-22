import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { IOrderPopulated, IOrder } from '../../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '/orders';

  constructor(private baseService: BaseService) { }

  getOrders(): Observable<IOrderPopulated[]> {
    return this.baseService.get<IOrderPopulated[]>(this.apiUrl);
  }

  createOrder(): Observable<IOrderPopulated> {
    return this.baseService.post<IOrderPopulated>(this.apiUrl, {});
  }

  getOrderById(orderId: string): Observable<IOrderPopulated> {
    return this.baseService.get<IOrderPopulated>(`${this.apiUrl}/${orderId}`);
  }
}