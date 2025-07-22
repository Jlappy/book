// src/app/core/services/favorite.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite.service';
import { BaseService } from './base.service';
import { of, throwError, firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

describe('FavoriteService', () => {
  let favoriteService: FavoriteService;
  let baseServiceMock: jasmine.SpyObj<BaseService>;

  // Mock data
  const mockFavoriteBookIds: string[] = ['book123', 'book456', 'book789'];
  const newFavoriteBookId = 'book007';
  const removedFavoriteBookId = 'book123';

  // Mock responses for BaseService methods
  const addFavoriteSuccessResponse = { message: 'Book added to favorites' };
  const removeFavoriteSuccessResponse = { message: 'Book removed from favorites' };
  const getFavoritesError = new Error('Failed to fetch favorites');

  beforeEach(() => {
    // Create a spy object for BaseService
    baseServiceMock = jasmine.createSpyObj('BaseService', ['get', 'post', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        FavoriteService,
        { provide: BaseService, useValue: baseServiceMock }
      ]
    });

    favoriteService = TestBed.inject(FavoriteService);
  });

  // Test getFavorites method
  it('should call baseService.get with the correct URL for getFavorites and return string array', async () => {
    const expectedUrl = favoriteService['apiUrl'];
    baseServiceMock.get.and.returnValue(of(mockFavoriteBookIds));

    const result = await firstValueFrom(favoriteService.getFavorites());

    expect(baseServiceMock.get).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(mockFavoriteBookIds);
  });

  // Test addFavorite method
  it('should call baseService.post with the correct URL and body for addFavorite', async () => {
    const expectedUrl = favoriteService['apiUrl'];
    baseServiceMock.post.and.returnValue(of(addFavoriteSuccessResponse));

    const result = await firstValueFrom(favoriteService.addFavorite(newFavoriteBookId));

    expect(baseServiceMock.post).toHaveBeenCalledWith(expectedUrl, { bookId: newFavoriteBookId });
    expect(result).toEqual(addFavoriteSuccessResponse);
  });

  // Test removeFavorite method
  it('should call baseService.delete with the correct URL for removeFavorite', async () => {
    const expectedUrl = `${favoriteService['apiUrl']}/${removedFavoriteBookId}`;
    baseServiceMock.delete.and.returnValue(of(removeFavoriteSuccessResponse));

    const result = await firstValueFrom(favoriteService.removeFavorite(removedFavoriteBookId));

    expect(baseServiceMock.delete).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(removeFavoriteSuccessResponse);
  });

  // Test error handling for getFavorites
  it('should handle errors for getFavorites', async () => {
    baseServiceMock.get.and.returnValue(throwError(() => getFavoritesError));

    await firstValueFrom(favoriteService.getFavorites().pipe(
      catchError(err => {
        expect(err).toEqual(getFavoritesError);
        return of([]); // Return an empty array or re-throw if you want the error to propagate
      })
    ));

    expect(baseServiceMock.get).toHaveBeenCalledWith(favoriteService['apiUrl']);
  });

  // Test error handling for addFavorite
  it('should handle errors for addFavorite', async () => {
    baseServiceMock.post.and.returnValue(throwError(() => getFavoritesError));

    await firstValueFrom(favoriteService.addFavorite(newFavoriteBookId).pipe(
      catchError(err => {
        expect(err).toEqual(getFavoritesError);
        return of(null); // Return null or re-throw
      })
    ));

    expect(baseServiceMock.post).toHaveBeenCalledWith(favoriteService['apiUrl'], { bookId: newFavoriteBookId });
  });

  // Test error handling for removeFavorite
  it('should handle errors for removeFavorite', async () => {
    baseServiceMock.delete.and.returnValue(throwError(() => getFavoritesError));

    await firstValueFrom(favoriteService.removeFavorite(removedFavoriteBookId).pipe(
      catchError(err => {
        expect(err).toEqual(getFavoritesError);
        return of(null); // Return null or re-throw
      })
    ));

    expect(baseServiceMock.delete).toHaveBeenCalledWith(`${favoriteService['apiUrl']}/${removedFavoriteBookId}`);
  });
});
