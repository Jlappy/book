import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { IBook } from '../../shared/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = '/favorites';

  constructor(private baseService: BaseService) { }

  getFavorites(): Observable<string[]> {
    return this.baseService.get<string[]>(this.apiUrl);
  }

  getFavoriteBooks(): Observable<IBook[]> {
    return this.baseService.get<IBook[]>(`${this.apiUrl}/fav-books`)
  }

  addFavorite(bookId: string): Observable<any> {
    return this.baseService.post<any>(this.apiUrl, { bookId });
  }

  removeFavorite(bookId: string): Observable<any> {
    return this.baseService.delete<any>(`${this.apiUrl}/${bookId}`);
  }
}
