import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';
import { AuthService } from '../../../core/services/auth.service';
import { IOverviewStats } from '../../../shared/models/overview.model';
import { MatSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSpinner,
    HighchartsChartComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  stats: IOverviewStats | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartOptions2: Highcharts.Options = {};

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.getOverviewStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.setupChart();
        this.setupChart2()
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);

        this.isLoading = false;
      }

    })

  }

  setupChart() {
    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Thống kê tổng quan hệ thống'
      },
      xAxis: {
        categories: [
          'Sách',
          'Người dùng',
          'Đơn hàng',
          'Đơn đang xử lý',
          'Đơn hoàn tất',
          'Doanh thu'
        ],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Số lượng'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          borderRadius: 5,
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Tổng',
          type: 'column',
          data: [
            this.stats?.booksCount ?? 0,
            this.stats?.usersCount ?? 0,
            this.stats?.ordersCount ?? 0,
            this.stats?.pendingOrdersCount ?? 0,
            this.stats?.completedOrdersCount ?? 0,
            this.stats?.totalRevenue ?? 0
          ]
        }
      ],
      credits: {
        enabled: false
      }
    };
  }

  setupChart2() {
    this.chartOptions2 = {
      chart: { type: 'pie' },
      title: { text: 'Tình trạng đơn hàng' },
      series: [
        {
          name: 'Số lượng',
          type: 'pie',
          data: [
            { name: 'Đơn đang xử lý', y: this.stats?.pendingOrdersCount ?? 0 },
            { name: 'Đơn hoàn tất', y: this.stats?.completedOrdersCount ?? 0 }
          ]
        }
      ],
      credits: { enabled: false }
    }
  }
}
