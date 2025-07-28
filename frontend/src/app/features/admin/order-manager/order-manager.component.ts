import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OrderService } from '../../../core/services/order.service';
import { IOrderPopulated } from '../../../shared/models/order.model';
import { IUser } from '../../../shared/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { HighchartsChartComponent } from 'highcharts-angular';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-order-manager',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    HighchartsChartComponent,
  ],
  templateUrl: './order-manager.component.html',
  styleUrl: './order-manager.component.scss'
})
export class OrderManagerComponent implements OnInit {
  orders: IOrderPopulated[] = [];
  users: IUser[] = [];
  selectedUserId: string = '';

  displayedColumns = ['user', 'total', 'status', 'createdAt', 'actions'];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartOptionsPie: Highcharts.Options = {};

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.getUsersByRole('user').subscribe({
      next: (users) => {
        this.users = users;
        // Nếu có user đầu tiên thì tự động chọn luôn
        if (users.length > 0) {
          this.selectedUserId = users[0]._id!;
          this.onSelectUser(this.selectedUserId);
        }
      },
      error: (err) => console.error('Lỗi khi tải users:', err)
    });
  }

  onSelectUser(userId: string): void {
    if (!userId) return;

    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.updateCharts(orders);
      },
      error: (err) => console.error('Lỗi khi tải đơn hàng:', err)
    });
  }

  updateCharts(orders: IOrderPopulated[]) {
    const grouped = this.groupByDate(orders);

    this.chartOptions = {
      chart: { type: 'column' },
      title: { text: 'Doanh thu theo ngày' },
      xAxis: {
        categories: Object.keys(grouped),
        title: { text: 'Ngày' }
      },
      yAxis: {
        title: { text: 'Tổng tiền (VND)' }
      },
      series: [
        {
          name: 'Doanh thu',
          data: Object.values(grouped),
          type: 'column'
        }
      ]
    };

    this.chartOptionsPie = {
      chart: { type: 'pie' },
      title: { text: 'Trạng thái đơn hàng' },
      series: [
        {
          name: 'Số lượng',
          type: 'pie',
          data: [
            {
              name: 'Hoàn tất',
              y: orders.filter(o => o.status === 'completed').length
            },
            {
              name: 'Đang xử lý',
              y: orders.filter(o => o.status === 'pending').length
            }
          ]
        }
      ]
    };
  }

  groupByDate(orders: IOrderPopulated[]): Record<string, number> {
    const result: Record<string, number> = {};
    for (const order of orders) {
      const date = new Date(order.createdAt!).toLocaleDateString('vi-VN');
      result[date] = (result[date] || 0) + order.total;
    }
    return result;
  }

  markAsCompleted(orderId: string) {
    this.orderService.updateOrderStatus(orderId, 'completed').subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o._id === updatedOrder._id);
        if (index > -1) {
          this.orders[index] = updatedOrder;

          this.orders = [...this.orders];

          this.updateCharts(this.orders);
        }
      },
      error: (err) => {
        console.error('Lỗi cập nhật đơn hàng:', err);
      }
    });
  }

}


