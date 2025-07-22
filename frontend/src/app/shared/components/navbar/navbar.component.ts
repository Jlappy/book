import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule

  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  searchTerm: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
  ) { }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchTerm.trim() }
      });
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Đăng xuất thành công');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Lỗi khi đăng xuất:', err);
      }
    });
  }

}
