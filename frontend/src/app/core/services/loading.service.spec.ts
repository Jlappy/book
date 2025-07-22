import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { firstValueFrom } from 'rxjs';

// nhóm các test cho LoadingService
// LoadingService là một service đơn giản dùng để quản lý trạng thái loading trong ứng dụng nên không cần tạo mock phức tạp
describe('LoadingService', () => {
  // Khởi tạo biến service để sử dụng trong các test
  let service: LoadingService;
  // Khởi tạo service trước khi chạy các test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });
  // Kiểm tra xem service có được tạo thành công không
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  // Kiểm tra trạng thái ban đầu của loading$
  it('should have initial loading state as false', async () => {
    const initialValue = await firstValueFrom(service.loading$);
    expect(initialValue).toBeFalse();
  });
  // Kiểm tra các phương thức show() và hide() có hoạt động đúng không
  it('should set loading state to true when show() is called', async () => {
    const emittedValues: boolean[] = [];
    const subscription = service.loading$.subscribe(value => emittedValues.push(value));
    emittedValues.splice(0, emittedValues.length);

    service.show();
    // Kiểm tra xem observable đã phát ra giá trị true chưa
    expect(emittedValues).toEqual([true]);
    // Kiểm tra xem giá trị hiện tại của BehaviorSubject có phải là true không
    subscription.unsubscribe(); // Hủy đăng ký để tránh rò rỉ bộ nhớ
  });
  // Kiểm tra xem hide() có đặt trạng thái loading về false không
  it('should set loading state to false when hide() is called', async () => {
    // Đầu tiên gọi show() để đặt trạng thái loading thành true
    service.show();
    // Sau đó gọi hide() để đặt trạng thái loading về false
    const emittedValues: boolean[] = [];
    // Đăng ký để theo dõi các giá trị phát ra từ loading$
    // và xóa sạch mảng để kiểm tra giá trị mới phát ra

    const subscription = service.loading$.subscribe(value => emittedValues.push(value));
    emittedValues.splice(0, emittedValues.length);

    service.hide();

    // Kiểm tra xem observable đã phát ra giá trị false chưa
    expect(emittedValues).toEqual([false]);

    subscription.unsubscribe(); // Hủy đăng ký để tránh rò rỉ bộ nhớ
  });

  it('should emit true then false when show() then hide() are called', async () => {
    const emittedValues: boolean[] = [];
    const subscription = service.loading$.subscribe(value => emittedValues.push(value));

    // The BehaviorSubject emits its initial value (false) upon subscription.
    expect(emittedValues).toEqual([false]); // Initial value

    service.show();
    expect(emittedValues).toEqual([false, true]);

    service.hide();
    expect(emittedValues).toEqual([false, true, false]);

    subscription.unsubscribe(); // Clean up subscription
  });

  it('should emit even if state does not change (e.g., calling show twice)', async () => {
    const emittedValues: boolean[] = [];
    const subscription = service.loading$.subscribe(value => emittedValues.push(value));

    expect(emittedValues).toEqual([false]); // Initial value: [false]

    service.show(); // Emits true
    expect(emittedValues).toEqual([false, true]); // State: [false, true]

    service.show(); // Will emit true again because BehaviorSubject.next() always emits
    expect(emittedValues).toEqual([false, true, true]); // State: [false, true, true]

    service.hide(); // Emits false
    expect(emittedValues).toEqual([false, true, true, false]); // State: [false, true, true, false]

    service.hide(); // Will emit false again
    expect(emittedValues).toEqual([false, true, true, false, false]); // State: [false, true, true, false, false]

    subscription.unsubscribe(); // Clean up subscription
  });
});
