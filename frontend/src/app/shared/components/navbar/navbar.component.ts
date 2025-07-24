import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SearchService } from '../../../core/services/search.service';

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
  searchTerm = '';

  constructor(
    public authService: AuthService,
    private searchService: SearchService,
    private router: Router,
  ) { }

  onSearch(): void {
    const trimmed = this.searchTerm.trim();
    if (trimmed) {
      this.searchService.setSearchTerm(trimmed);
      this.searchTerm = '';
    }
  }

  goHome(): void {
    this.searchService.setSearchTerm(''); 
    this.router.navigate(['/']);     
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Đăng xuất thành công');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Lỗi khi đăng xuất:', err);
      }
    });
  }

}
