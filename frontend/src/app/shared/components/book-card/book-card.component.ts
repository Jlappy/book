
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IBook } from '../../models/book.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-book-card',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule 
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {
  @Input() book!: IBook;
  @Input() showActions: boolean = false;
  @Input() isFavorite = false;
  @Input() userRole: string = '';

  @Output() addToCart = new EventEmitter<string>()
  @Output() toggleFavorite = new EventEmitter<string>()

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  handleToggleFavorite(event: Event) {
    event.stopPropagation();
    this.toggleFavorite.emit(this.book._id);
  }

  handleAddToCart(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.book._id);
  }
}
