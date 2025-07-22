import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { BaseService } from './base.service';
import { of, throwError, firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IOrderPopulated } from '../../shared/models/order.model';
import { IBook } from '../../shared/models/book.model';

describe('OrderService', () => {
  let orderService: OrderService;
  let baseServiceMock: jasmine.SpyObj<BaseService>;
  //mock data dựa trên IBook và IOrderPopulated
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

  const mockOrderPopulated1: IOrderPopulated = {
    _id: 'order1',
    user: 'user123',
    items: [
      { book: mockBook1, quantity: 2, price: mockBook1.price * 2 },
      { book: mockBook2, quantity: 1, price: mockBook2.price * 1 }
    ],
    total: 40.50,
    status: 'pending',
    createdAt: new Date(),
  };

  const mockOrderPopulated2: IOrderPopulated = {
    _id: 'order2',
    user: 'user456',
    items: [
      { book: mockBook1, quantity: 1, price: mockBook1.price * 1 }
    ],
    total: 15.00,
    status: 'completed',
    createdAt: new Date(),
  };
  // mock data để test
  const mockOrdersPopulated: IOrderPopulated[] = [mockOrderPopulated1, mockOrderPopulated2];

  const createdOrderPopulated: IOrderPopulated = {
    _id: 'newOrder123',
    user: 'currentUser',
    items: [{ book: mockBook1, quantity: 3, price: mockBook1.price * 3 }],
    total: 45.00,
    status: 'pending',
    createdAt: new Date(),
  };


  beforeEach(() => {
    baseServiceMock = jasmine.createSpyObj('BaseService', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: BaseService, useValue: baseServiceMock }
      ]
    });

    orderService = TestBed.inject(OrderService);
  });

  // Test getOrder - tạo expected URL và kiểm tra baseService.get gọi đúng : mockOrdersPopulated
  it('baseService.get Url - getOrders', async () => {
    const expectedUrl = orderService['apiUrl'];
    baseServiceMock.get.and.returnValue(of(mockOrdersPopulated));

    const result = await firstValueFrom(orderService.getOrders());

    expect(baseServiceMock.get).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(mockOrdersPopulated);
  });

  // Test createOrder - tạo expected URL và kiểm tra baseService.post gọi đúng : createdOrderPopulated
  it('baseService.post URL - createOrder', async () => {
    const expectedUrl = orderService['apiUrl'];
    baseServiceMock.post.and.returnValue(of(createdOrderPopulated));

    const result = await firstValueFrom(orderService.createOrder());

    expect(baseServiceMock.post).toHaveBeenCalledWith(expectedUrl, {});
    expect(result).toEqual(createdOrderPopulated);
  });

  // Test getOrderById - tạo expected URL và kiểm tra baseService.get gọi đúng : mockOrderPopulated1
  it('baseService.get URL - getOrderById', async () => {
    const orderId = 'order1';
    const expectedUrl = `${orderService['apiUrl']}/${orderId}`;
    baseServiceMock.get.and.returnValue(of(mockOrderPopulated1));

    const result = await firstValueFrom(orderService.getOrderById(orderId));

    expect(baseServiceMock.get).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(mockOrderPopulated1);
  });

  // Test error getOrders - tạo error(trả về) => services trả về observable error
  // nếu orderService.getOrders() - trả về observable error thì sẽ bắt lỗi và trả về observable rỗng
  it('should handle errors for getOrders', async () => {
    const errorResponse = new Error('Failed to fetch orders');
    baseServiceMock.get.and.returnValue(throwError(() => errorResponse));

    await firstValueFrom(orderService.getOrders().pipe(
      catchError(err => {
        expect(err).toEqual(errorResponse);
        return of([]);
      })
    ));

    expect(baseServiceMock.get).toHaveBeenCalledWith(orderService['apiUrl']);
  });

  // Test error createOrder - tạo error(trả về) => services trả về observable error
  // nếu orderService.createOrder() - trả về observable error thì sẽ bắt lỗi và trả về observable rỗng
  it('should handle errors for createOrder', async () => {
    const errorResponse = new Error('Failed to create order');
    baseServiceMock.post.and.returnValue(throwError(() => errorResponse));

    await firstValueFrom(orderService.createOrder().pipe(
      catchError(err => {
        expect(err).toEqual(errorResponse);
        return of(null as any);
      })
    ));

    expect(baseServiceMock.post).toHaveBeenCalledWith(orderService['apiUrl'], {});
  });

  // Test error getOrderById  - tạo error(trả về) => services trả về observable error
  // nếu orderService.getOrderById(orderId) - trả về observable error thì sẽ
  it('should handle errors for getOrderById', async () => {
    const orderId = 'nonExistentOrder';
    const errorResponse = new Error('Order not found');
    baseServiceMock.get.and.returnValue(throwError(() => errorResponse));

    await firstValueFrom(orderService.getOrderById(orderId).pipe(
      catchError(err => {
        expect(err).toEqual(errorResponse);
        return of(null as any);
      })
    ));

    expect(baseServiceMock.get).toHaveBeenCalledWith(`${orderService['apiUrl']}/${orderId}`);
  });
});
