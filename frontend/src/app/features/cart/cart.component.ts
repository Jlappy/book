import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../core/services/cart.service';
import { ICartPopulated } from '../../shared/models/cart.model';

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

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

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
}
