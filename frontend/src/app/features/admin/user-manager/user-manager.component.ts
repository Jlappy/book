// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatTableModule } from '@angular/material/table';
// import { IUser } from '../../../shared/models/user.model';
// import { AuthService } from '../../../core/services/auth.service';
// import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-user-manager',
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatSnackBarModule

//   ],
//   templateUrl: './user-manager.component.html',
//   styleUrl: './user-manager.component.scss'
// })
// export class UserManagerComponent implements OnInit {
//   users: IUser[] = [];
//   displayedColumns = ['username', 'email', 'role'];

//   constructor(
//     private authService: AuthService,
//     private snackBar: MatSnackBar,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     this.loadUsers();
//   }

//   loadUsers(): void {
//     this.authService.getUsersByRole('user').subscribe({
//       next: users => {
//         this.users = users;
//       },
//       error: () => {
//         this.snackBar.open('Không thể tải người dùng.', 'Đóng', { duration: 3000 });
//       }
//     });
//   }
// }
