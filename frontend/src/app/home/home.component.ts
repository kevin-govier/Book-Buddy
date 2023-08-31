import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userId: number;

  fictionBooks: any[] = [];
  cookBooks: any[] = [];
  nonFictionBooks: any[] = [];
  sciFiBooks: any[] = [];
  biographyBooks: any[] = [];
  selfHelpBooks: any[] = [];

  booksPerRow: number = 8;
  
  constructor(
    private bookService: BookService, 
    private authService: AuthService,
  ) {}
  
  ngOnInit(): void {
    this.updateUserId();
    this.getFictionBooks();
    this.getCookBooks();
    this.getSciFiBooks();
    this.getNonFictionBooks();
    this.getBiographyBooks();
    this.getSelfHelpBooks();
  }

  updateUserId(): void {
    if (this.authService.checkLoginStatus()) {
      this.userId = this.authService.userId;
    } else {
      this.userId = undefined;
    }
  }
  
  getFictionBooks(): void {
    this.bookService.getFictionBooks().subscribe(
      (response: any) => {
        const totalItems = response.totalItems;
        if (totalItems > 0) {
          this.fictionBooks = response.items.filter(book => book.volumeInfo.imageLinks?.thumbnail).slice(0, 8).map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                cover: book.volumeInfo.imageLinks?.thumbnail
            })); 
        } else {
          this.fictionBooks = []; 
        }
      },
      (error: any) => {
        console.error('Fiction Books Error:', error);
      }
    )
  }

  getCookBooks(): void {
    this.bookService.getCookBooks().subscribe(
      (response: any) => {
        const totalItems = response.totalItems;
        if (totalItems > 0) {
          this.cookBooks = response.items.filter(book => book.volumeInfo.imageLinks?.thumbnail).slice(0, 8).map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                cover: book.volumeInfo.imageLinks?.thumbnail
            })); 
        } else {
          this.cookBooks = []; 
        }
      },
      (error: any) => {
        console.error('Cook Books Error:', error);
      }
    )
  }
  
  getNonFictionBooks(): void {
    this.bookService.getNonFictionBooks().subscribe(
      (response: any) => {
        const totalItems = response.totalItems;
        if (totalItems > 0) {
          this.nonFictionBooks = response.items.filter(book => book.volumeInfo.imageLinks?.thumbnail).slice(0, 8).map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                cover: book.volumeInfo.imageLinks?.thumbnail
            })); 
        } else {
          this.nonFictionBooks = []; 
        }
      },
      (error: any) => {
        console.error('Non Fiction Books Error:', error);
      }
    )
  }

  getSciFiBooks(): void {
    this.bookService.getSciFiBooks().subscribe(
      (response: any) => {
        const totalItems = response.totalItems;
        if (totalItems > 0) {
          this.sciFiBooks = response.items.filter(book => book.volumeInfo.imageLinks?.thumbnail).slice(0, 8).map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                cover: book.volumeInfo.imageLinks?.thumbnail
            })); 
        } else {
          this.sciFiBooks = []; 
        }
      },
      (error: any) => {
        console.error('Sci Fi Books Error:', error);
      }
    )
  }

  getBiographyBooks(): void {
    this.bookService.getBiographyBooks().subscribe(
      (response: any) => {
        const totalItems = response.totalItems;
        if (totalItems > 0) {
          this.biographyBooks = response.items.filter(book => book.volumeInfo.imageLinks?.thumbnail).slice(0, 8).map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                cover: book.volumeInfo.imageLinks?.thumbnail
            })); 
        } else {
          this.biographyBooks = []; 
        }
      },
      (error: any) => {
        console.error('Biography Books Error:', error);
      }
    )
  }

  getSelfHelpBooks(): void {
    this.bookService.getSelfHelpBooks().subscribe(
      (response: any) => {
        const totalItems = response.totalItems;
        if (totalItems > 0) {
          this.selfHelpBooks = response.items.filter(book => book.volumeInfo.imageLinks?.thumbnail).slice(0, 8).map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                cover: book.volumeInfo.imageLinks?.thumbnail
            })); 
        } else {
          this.selfHelpBooks = []; 
        }
      },
      (error: any) => {
        console.error('Biography Books Error:', error);
      }
    )
  }
}