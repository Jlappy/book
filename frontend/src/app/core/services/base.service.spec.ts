// src/app/core/services/base.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// Import environment as a module to access its properties for mocking
import * as originalEnvironment from '../environments/environment';
import { BaseService } from './base.service';

describe('BaseService', () => {
    let baseService: BaseService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    // Store original environment values to restore them later
    let originalApiBaseUrl: string;
    let originalOpenLibraryApi: string;

    // Mock environment values for tests
    const mockEnvironment = {
        apiBaseUrl: 'http://localhost:3000/api', // This is the URL we want to use in tests
        openLibraryApi: 'https://openlibrary.org'
    };

    // Use beforeAll to run once before all tests in this suite
    beforeAll(() => {
        // Store original values
        originalApiBaseUrl = originalEnvironment.environment.apiBaseUrl;
        originalOpenLibraryApi = originalEnvironment.environment.openLibraryApi;

        // Temporarily override environment properties BEFORE TestBed config.
        // This is a hacky but necessary way to ensure the static import in BaseService
        // picks up the mock values during test execution.
        originalEnvironment.environment.apiBaseUrl = mockEnvironment.apiBaseUrl;
        originalEnvironment.environment.openLibraryApi = mockEnvironment.openLibraryApi;
    });

    // Use afterAll to run once after all tests in this suite
    afterAll(() => {
        // Restore original environment values to avoid affecting other test files
        originalEnvironment.environment.apiBaseUrl = originalApiBaseUrl;
        originalEnvironment.environment.openLibraryApi = originalOpenLibraryApi;
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                BaseService,
                // We no longer need to provide `environment` here, as we're globally overriding it.
                // { provide: environment, useValue: mockEnvironment } // This line is now removed
            ]
        });

        baseService = TestBed.inject(BaseService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify(); // Đảm bảo không có yêu cầu nào bị bỏ sót
    });

    // --- Test GET method ---
    it('should send a GET request to local API by default', () => {
        const testPath = '/books';
        const expectedUrl = `${mockEnvironment.apiBaseUrl}${testPath}`; // Should use 3000
        const mockResponse = [{ id: 1, title: 'Local Book' }];

        baseService.get(testPath).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should send a GET request to Open Library API when isOpenLibrary is true', () => {
        const testPath = '/works/OL7033240W.json';
        const expectedUrl = `${mockEnvironment.openLibraryApi}${testPath}`;
        const mockResponse = { title: 'The Lord of the Rings' };

        baseService.get(testPath, true).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should handle GET request errors', () => {
        const testPath = '/error';
        const expectedUrl = `${mockEnvironment.apiBaseUrl}${testPath}`;
        const mockError = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

        baseService.get(testPath).subscribe({
            next: () => fail('should have failed with the 500 error'),
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
                expect(error.statusText).toBe('Internal Server Error');
            }
        });

        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('Network error'), mockError);
    });

    // --- Test POST method ---
    it('should send a POST request to local API', () => {
        const testPath = '/users';
        const expectedUrl = `${mockEnvironment.apiBaseUrl}${testPath}`;
        const requestBody = { name: 'John Doe', email: 'john@example.com' };
        const mockResponse = { id: 101, ...requestBody };

        baseService.post(testPath, requestBody).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(requestBody);
        req.flush(mockResponse);
    });

    it('should handle POST request errors', () => {
        const testPath = '/users';
        const expectedUrl = `${mockEnvironment.apiBaseUrl}${testPath}`;
        const requestBody = { name: 'John Doe', email: 'john@example.com' };
        const mockError = new HttpErrorResponse({ status: 400, statusText: 'Bad Request' });

        baseService.post(testPath, requestBody).subscribe({
            next: () => fail('should have failed with the 400 error'),
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(400);
                expect(error.statusText).toBe('Bad Request');
            }
        });

        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toBe('POST');
        req.error(new ErrorEvent('Client error'), mockError);
    });

    // --- Test PUT method ---
    it('should send a PUT request to local API', () => {
        const testPath = '/users/1';
        const expectedUrl = `${mockEnvironment.apiBaseUrl}${testPath}`;
        const requestBody = { name: 'Jane Doe' };
        const mockResponse = { message: 'Updated' };

        baseService.put(testPath, requestBody).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(requestBody);
        req.flush(mockResponse);
    });

    // --- Test DELETE method ---
    it('should send a DELETE request to local API', () => {
        const testPath = '/users/1';
        const expectedUrl = `${mockEnvironment.apiBaseUrl}${testPath}`;
        const mockResponse = { message: 'Deleted' };

        baseService.delete(testPath).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toBe('DELETE');
        req.flush(mockResponse);
    });
});
