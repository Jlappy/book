import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { IUser } from '../../shared/models/user.model';
import { MatButtonModule } from '@angular/material/button'; // nếu bạn dùng Material button

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  user$: Observable<IUser | null>;

  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.currentUser$;

    this.user$.pipe(take(1)).subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
