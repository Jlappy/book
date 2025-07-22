import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = '/favorites';

  constructor(private baseService: BaseService) { }

  getFavorites(): Observable<string[]> {
    return this.baseService.get<string[]>(this.apiUrl);
  }

  addFavorite(bookId: string): Observable<any> {
    return this.baseService.post<any>(this.apiUrl, { bookId });
  }

  removeFavorite(bookId: string): Observable<any> {
    return this.baseService.delete<any>(`${this.apiUrl}/${bookId}`);
  }
}
