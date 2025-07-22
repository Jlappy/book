import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpRequest, withInterceptors, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { withCredentialsInterceptor } from './with-credentials.interceptor';

describe('withCredentialsInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([withCredentialsInterceptor])),
        provideHttpClientTesting(),
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add withCredentials: true to the request', () => {
    const testUrl = '/api/data';

    httpClient.get(testUrl).subscribe(response => {
      expect(response).toBeTruthy(); 
    });

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });

  it('should clone the request before adding withCredentials', () => {
    const testUrl = '/api/data-clone';
    const originalRequest = new HttpRequest('GET', testUrl);

    spyOn(originalRequest, 'clone').and.callThrough();

    httpClient.request(originalRequest).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });

  it('should pass the cloned request to the next handler', () => {
    const testUrl = '/api/next-handler';

    httpClient.get(testUrl).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });
});