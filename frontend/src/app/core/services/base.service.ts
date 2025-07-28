import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private localAPI = environment.apiBaseUrl;
  private openLibraryAPI = environment.openLibraryApi;

  constructor(private http: HttpClient) { }

  // GET: tự nhận diện local hoặc openlibrary
  get<T>(path: string, isOpenLibrary = false): Observable<any> {
    const url = isOpenLibrary ? `${this.openLibraryAPI}${path}` : `${this.localAPI}${path}`;
    const options = isOpenLibrary ? {} : { withCredentials: true };
    return this.http.get<T>(url, options);
  }

  post<T>(path: string, body: any): Observable<any> {
    return this.http.post<T>(`${this.localAPI}${path}`, body, {
      withCredentials: true
    });
  }

  put<T>(path: string, body: any): Observable<any> {
    return this.http.put<T>(`${this.localAPI}${path}`, body, {
      withCredentials: true
    });
  }

  delete<T>(path: string): Observable<any> {
    return this.http.delete<T>(`${this.localAPI}${path}`, {
      withCredentials: true
    });
  }

  patch<T>(path: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.localAPI}${path}`, body, {
      withCredentials: true
    });
  }

}