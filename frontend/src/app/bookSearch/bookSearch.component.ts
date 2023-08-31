import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from '../services/book.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-bookSearch',
  templateUrl: './bookSearch.component.html',
  styleUrls: ['./bookSearch.component.css']
})
export class BookSearchComponent implements OnInit {
  userId: number;
  query: string;
  books: any[] = []; 
  totalItemCount: number;

  constructor(private bookService: BookService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.userId;

    // Check if there are stored search results in session storage
    const storedResults = sessionStorage.getItem('searchResults');
    if (storedResults) {
      this.books = JSON.parse(storedResults);
      this.totalItemCount = this.books.length;
    }
  }

  searchBooks(): void {
    if (!this.query || this.query.trim().length === 0) {
      return;
    }
  
    this.bookService.searchBooksByTitle(this.query).subscribe(response => {
      const totalItems = response.totalItems;
      if (totalItems > 0) {
        this.books = response.items.filter(book => book.volumeInfo.imageLinks?.thumbnail).map(book => ({
          id: book.id,
          title: book.volumeInfo.title,
          coverUrl: book.volumeInfo.imageLinks?.thumbnail || '',
          author: book.volumeInfo.authors,
          date: new Date(book.volumeInfo.publishedDate).getFullYear()
        }));
        this.books = this.books.slice(0, 20); // Gets the first 20 books
      } else {
        this.books = [];
      }
      this.totalItemCount = totalItems;
      sessionStorage.setItem('searchResults', JSON.stringify(this.books));
    });
  }

  ngOnDestroy(): void {
    // Clears the storage when the user leaves the page
    sessionStorage.removeItem('searchResults');
  }
}