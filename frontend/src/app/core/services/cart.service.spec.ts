// src/app/core/services/cart.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { BaseService } from './base.service';
import { of, throwError, firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ICartPopulated } from '../../shared/models/cart.model'; // Removed ICartItem import
import { IBook } from '../../shared/models/book.model'; // Import IBook

describe('CartService', () => {
  let cartService: CartService;
  let baseServiceMock: jasmine.SpyObj<BaseService>;

  // Mock IBook for cart items
  const mockBook1: IBook = {
    _id: 'book123',
    title: 'The Great Gatsby',
    author: ['F. Scott Fitzgerald'],
    price: 15.00,
    source: 'manual'
  };
  const mockBook2: IBook = {
    _id: 'book456',
    title: '1984',
    author: ['George Orwell'],
    price: 10.50,
    source: 'manual'
  };

  // Mock data based on updated cart.model.ts structure
  const mockUserId = 'user1'; // Represents the user ID string

  // These mocks are for the 'items' array within ICartPopulated,
  // where 'book' is an IBook object.
  const mockCartPopulatedItem1: { book: IBook; quantity: number; } = { book: mockBook1, quantity: 2 };
  const mockCartPopulatedItem2: { book: IBook; quantity: number; } = { book: mockBook2, quantity: 1 };

  const mockCartPopulated: ICartPopulated = {
    _id: 'cart1',
    user: mockUserId,
    items: [mockCartPopulatedItem1, mockCartPopulatedItem2],
  };

  const updatedQuantity = 5;
  // Fix: Use non-null assertion operator (!) because we know _id will be a string in our mocks
  const mockBookId1 = mockBook1._id!; // Use the actual ID from mockBook1 for payloads

  const updatedCartPopulated: ICartPopulated = {
    ...mockCartPopulated,
    items: [{ book: mockBook1, quantity: updatedQuantity }, mockCartPopulatedItem2],
  };

  const cartAfterRemoval: ICartPopulated = {
    ...mockCartPopulated,
    items: [mockCartPopulatedItem2],
  };

  const emptyCart: ICartPopulated = {
    _id: 'cart1',
    user: mockUserId,
    items: [],
  };

  beforeEach(() => {
    // Create a spy object for BaseService
    baseServiceMock = jasmine.createSpyObj('BaseService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: BaseService, useValue: baseServiceMock }
      ]
    });

    cartService = TestBed.inject(CartService);
  });

  // Test getCart method
  it('should call baseService.get with the correct URL for getCart', async () => {
    const expectedUrl = cartService['apiUrl'];
    baseServiceMock.get.and.returnValue(of(mockCartPopulated));

    const result = await firstValueFrom(cartService.getCart());

    expect(baseServiceMock.get).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(mockCartPopulated);
  });

  // Test addToCart method
  it('should call baseService.post with the correct URL and body for addToCart', async () => {
    const expectedUrl = cartService['apiUrl'];
    const bookId = mockBookId1; // Service method still takes bookId (string)
    const quantity = 1;
    baseServiceMock.post.and.returnValue(of(mockCartPopulated));

    const result = await firstValueFrom(cartService.addToCart(bookId, quantity));

    expect(baseServiceMock.post).toHaveBeenCalledWith(expectedUrl, { bookId, quantity });
    expect(result).toEqual(mockCartPopulated);
  });

  // Test updateQuantity method
  it('should call baseService.put with the correct URL and body for updateQuantity', async () => {
    const expectedUrl = cartService['apiUrl'];
    const bookId = mockBookId1; // Service method still takes bookId (string)
    const quantity = updatedQuantity;
    baseServiceMock.put.and.returnValue(of(updatedCartPopulated));

    const result = await firstValueFrom(cartService.updateQuantity(bookId, quantity));

    expect(baseServiceMock.put).toHaveBeenCalledWith(expectedUrl, { bookId, quantity });
    expect(result).toEqual(updatedCartPopulated);
  });

  // Test removeFromCart method
  it('should call baseService.delete with the correct URL for removeFromCart', async () => {
    const bookId = mockBookId1;
    const expectedUrl = `${cartService['apiUrl']}/${bookId}`;
    baseServiceMock.delete.and.returnValue(of(cartAfterRemoval));

    const result = await firstValueFrom(cartService.removeFromCart(bookId));

    expect(baseServiceMock.delete).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(cartAfterRemoval);
  });

  // Test clearCart method
  it('should call baseService.delete with the correct URL for clearCart', async () => {
    const expectedUrl = cartService['apiUrl'];
    baseServiceMock.delete.and.returnValue(of(emptyCart));

    const result = await firstValueFrom(cartService.clearCart());

    expect(baseServiceMock.delete).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(emptyCart);
  });

  // Example of testing error handling for a method (e.g., getCart)
  it('should handle errors for getCart', async () => {
    const errorResponse = new Error('Failed to fetch cart');
    baseServiceMock.get.and.returnValue(throwError(() => errorResponse));

    await firstValueFrom(cartService.getCart().pipe(
      catchError(err => {
        expect(err).toEqual(errorResponse);
        return of(null as any); // Return a null or empty cart for error handling
      })
    ));

    expect(baseServiceMock.get).toHaveBeenCalledWith(cartService['apiUrl']);
  });
});
