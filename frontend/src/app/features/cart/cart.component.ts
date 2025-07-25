import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../core/services/cart.service';
import { ICartPopulated } from '../../shared/models/cart.model';
import { OrderService } from '../../core/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cart: ICartPopulated | null = null;
  loading = true;

  orderData = {
    items: [],
    total: 0,
    status: 'pending' as const
  };

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => this.cart = cart,
      error: (err) => {
        console.error('Lỗi tải giỏ hàng:', err);
        this.snackBar.open('Không thể tải giỏ hàng.', 'Đóng', { duration: 3000 });
      },
      complete: () => this.loading = false
    });
  }

  updateQuantity(bookId: string, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateQuantity(bookId, quantity).subscribe({
      next: () => this.loadCart(),
      error: () => this.snackBar.open('Không thể cập nhật số lượng.', 'Đóng', { duration: 3000 })
    });
  }

  removeItem(bookId: string): void {
    this.cartService.removeFromCart(bookId).subscribe({
      next: () => {
        this.snackBar.open('Đã xóa sách khỏi giỏ.', 'Đóng', { duration: 3000 });
        this.loadCart();
      },
      error: () => this.snackBar.open('Lỗi khi xóa sách.', 'Đóng', { duration: 3000 })
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.snackBar.open('Đã xóa toàn bộ giỏ hàng.', 'Đóng', { duration: 3000 });
        this.cart = null;
      },
      error: () => this.snackBar.open('Lỗi khi xóa giỏ hàng.', 'Đóng', { duration: 3000 })
    });
  }

  total(): number {
    return this.cart?.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0) || 0;
  }

  submitOrder(): void {
    if (!this.cart || this.cart.items.length === 0) {
      this.snackBar.open('Giỏ hàng trống!', 'Đóng', { duration: 3000 });
      return;
    }

    const orderData = {
      items: this.cart.items.map(item => ({
        bookId: item.book._id,
        quantity: item.quantity,
        price: item.book.price
      })),
      total: this.total(),
      status: 'pending' as const
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.snackBar.open('Đặt hàng thành công!', 'Đóng', { duration: 3000 });
        this.router.navigate(['/checkout']);
      },
      error: () => {
        this.snackBar.open('Lỗi khi đặt hàng!', 'Đóng', { duration: 3000 });
      }
    });
  }

}
