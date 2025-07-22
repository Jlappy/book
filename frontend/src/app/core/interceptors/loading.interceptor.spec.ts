// src/app/core/interceptors/loading.interceptor.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, withInterceptors, provideHttpClient } from '@angular/common/http'; // Import provideHttpClient
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoadingService } from '../services/loading.service';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  let loadingServiceMock: jasmine.SpyObj<LoadingService>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Tạo một đối tượng spy (giả lập) cho LoadingService
    loadingServiceMock = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        // Cung cấp HttpClient và cấu hình nó với functional interceptor của bạn.
        // `withInterceptors` là cách chính xác để thêm functional interceptor vào HttpClient.
        provideHttpClient(withInterceptors([loadingInterceptor])),
        // `provideHttpClientTesting()` sẽ ghi đè backend của HttpClient
        // được cung cấp ở trên bằng HttpTestingController, mà không làm mất
        // cấu hình interceptor đã được thêm vào.
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: loadingServiceMock }
      ]
    });

    // Inject HttpClient và HttpTestingController từ TestBed
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  // Sau mỗi test, xác minh rằng không có yêu cầu HTTP nào còn đang chờ xử lý
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should call show() and hide() on successful request', () => {
    const testUrl = '/api/data-success';

    // Gửi một yêu cầu HTTP thông qua HttpClient
    httpClient.get(testUrl).subscribe(response => {
      // Khối này chạy khi yêu cầu thành công
      expect(response).toEqual({ message: 'Success' });
    });

    // Mong đợi một yêu cầu duy nhất đến testUrl
    const req = httpTestingController.expectOne(testUrl);
    // Phản hồi yêu cầu với dữ liệu thành công
    req.flush({ message: 'Success' });

    // Xác minh show() đã được gọi một lần
    expect(loadingServiceMock.show).toHaveBeenCalledTimes(1);
    // Xác minh hide() đã được gọi một lần
    expect(loadingServiceMock.hide).toHaveBeenCalledTimes(1);
  });

  it('should call show() and hide() on failed request', () => {
    const testUrl = '/api/data-failure';
    // Tạo một đối tượng HttpErrorResponse đúng cấu trúc cho lỗi
    const errorResponse = new HttpErrorResponse({
      error: 'Test Error',
      status: 500,
      statusText: 'Internal Server Error',
      url: testUrl
    });

    // Gửi yêu cầu và đăng ký để xử lý lỗi
    httpClient.get(testUrl).subscribe({
      next: () => fail('Should have failed with an error'),
      error: (err: HttpErrorResponse) => { // Đảm bảo kiểu dữ liệu là HttpErrorResponse
        expect(err.status).toBe(500);
        expect(err.statusText).toBe('Internal Server Error');
      }
    });

    // Mong đợi một yêu cầu duy nhất đến testUrl
    const req = httpTestingController.expectOne(testUrl);
    // Phản hồi yêu cầu với một lỗi
    req.error(new ErrorEvent('Network error'), errorResponse);

    // Xác minh show() đã được gọi
    expect(loadingServiceMock.show).toHaveBeenCalledTimes(1);
    // Xác minh hide() đã được gọi (do finalize)
    expect(loadingServiceMock.hide).toHaveBeenCalledTimes(1);
  });

  it('should call show() before the request and hide() after it completes', () => {
    const testUrl = '/api/data-timing';
    let showCalledBeforeRequest = false;
    let hideCalledAfterRequest = false;

    // Sử dụng callFake để theo dõi thứ tự gọi
    loadingServiceMock.show.and.callFake(() => {
      showCalledBeforeRequest = true;
      expect(hideCalledAfterRequest).toBeFalse(); // hide chưa được gọi
    });
    loadingServiceMock.hide.and.callFake(() => {
      hideCalledAfterRequest = true;
      expect(showCalledBeforeRequest).toBeTrue(); // show đã được gọi
    });

    httpClient.get(testUrl).subscribe(response => {
      // Tại thời điểm này, phản hồi đã nhận, nhưng finalize (và hide()) chưa chạy
      expect(hideCalledAfterRequest).toBeFalse();
    });

    const req = httpTestingController.expectOne(testUrl);
    // Xác minh show() đã được gọi trước khi yêu cầu được xử lý
    expect(showCalledBeforeRequest).toBeTrue();

    req.flush({}); // Hoàn tất yêu cầu

    // Sau khi flush, finalize đã chạy, và hide() phải được gọi
    expect(showCalledBeforeRequest).toBeTrue();
    expect(hideCalledAfterRequest).toBeTrue();
  });
});