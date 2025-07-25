import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OrderService } from '../../../core/services/order.service';
import { IOrderPopulated } from '../../../shared/models/order.model';
import { IUser } from '../../../shared/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-manager',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './order-manager.component.html',
  styleUrl: './order-manager.component.scss'
})
export class OrderManagerComponent implements OnInit {
  orders: IOrderPopulated[] = [];
  users: IUser[] = [];
  selectedUserId: string = '';

  displayedColumns = ['user', 'total', 'status', 'createdAt'];

  constructor(
    private orderService: OrderService,
    private authService: AuthService

  ) { }

  ngOnInit(): void {
    this.authService.getUsersByRole('user').subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Lỗi khi tải users:', err)
    });
  }

  onSelectUser(userId: string): void {
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (orders) => this.orders = orders,
      error: (err) => console.error('Lỗi khi tải đơn hàng:', err)
    });
  }
}

