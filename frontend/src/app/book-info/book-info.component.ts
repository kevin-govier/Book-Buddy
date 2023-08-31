import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { BookService } from '../services/book.service';
import { AuthService } from '../services/auth.service';
import { DialogueService } from '../services/dialogue.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateReviewComponent } from '../create-review/create-review.component';

import { Book } from "src/app/models/Book";


@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.css']
})

export class BookInfoComponent implements OnInit {
  readingList$: Observable<Book[]>;
  userId: number;

  book: any;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookDate: number;
  bookPublisher: string;
  bookPageCount: number;
  bookGenres: string;
  bookDescription: string;
  bookCover: any;
  bookCoverLarge: any;
  bookRating: number;
  bookLanguage: string;
  bookISBN: string;
  bookRatingRounded: number;
  isBookInReadingList: boolean;
  isBookInCollection: boolean;

  constructor(
    private route: ActivatedRoute, 
    private bookService: BookService, 
    private authService: AuthService,
    private dialogueService: DialogueService, 
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.bookId = this.route.snapshot.paramMap.get('id').substring(1);
    this.getBook();
    this.findBookInReadingList();
    this.findBookInCollection();
  }

  getBook() {
    this.bookService.getBookById(this.bookId)
      .subscribe(
        (book) => {
          this.bookTitle = book.volumeInfo.title;
          this.bookAuthor = book.volumeInfo.authors;
          this.bookDate = new Date(book.volumeInfo.publishedDate).getFullYear();
          this.bookPublisher = book.volumeInfo.publisher;
          this.bookPageCount =book.volumeInfo.pageCount;
          this.bookLanguage = book.volumeInfo.language;
          this.bookISBN = book.volumeInfo.industryIdentifiers?.find(identifier => identifier.type === 'ISBN_13')?.identifier;
          this.bookRating = book.volumeInfo.averageRating;
          this.bookRatingRounded = Math.round(this.bookRating);

          if(book.volumeInfo.categories !== undefined){
            this.bookGenres = book.volumeInfo.categories[0];
          }

          this.bookDescription = book.volumeInfo.description;
          this.bookCover = book.volumeInfo.imageLinks?.thumbnail;
          this.bookCoverLarge = `https://books.google.com/books?id=${this.bookId}&printsec=frontcover&img=1&zoom=2&edge=curl&source=gbs_api`
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }


  addToCollection(){
    const bookId = this.bookId;
    const bookTitle = this.bookTitle;
    const bookCover = this.bookCover;
    const bookDate = this.bookDate.toString();
    const user = this.userId;

    if (!user) {
      // User is not logged in
      this.router.navigateByUrl('/login');
      return;
    }
  
    this.bookService.addBookToCollection(bookId, bookTitle, bookCover, bookDate, user).subscribe(
      () => {
        const token = localStorage.getItem("token");

        if (token){
          this.isBookInCollection = true;
          this.dialogueService.openDialog('Added to Bookshelf!');
        }
        else{
          return;
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  addReview(){
    const bookId = this.bookId;
    const bookTitle = this.bookTitle;
    const bookCover = this.bookCover;
    const bookDate = this.bookDate;
    const user = this.userId;

    if (!user) {
      // User is not logged in
      this.dialogueService.openDialog('User is not logged in');
      console.log('User not logged in');
      return;
    }

    // Check if the book already has a review by the user
    this.bookService.findReview(bookId, user).subscribe(
      (existingReview) => {

        const token = localStorage.getItem("token");

        if (token){
          const dialogRef = this.dialog.open(CreateReviewComponent, {
            panelClass: 'dialog-width',
            data: {
              bookId: bookId,
              bookTitle: bookTitle,
              bookCover: bookCover,
              bookDate: bookDate,
              editMode: existingReview ? 'edit' : 'noEdit'
            }
          });
        }
        else{
          return;
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  addToReadingList() {
    const bookId = this.bookId;
    const bookTitle = this.bookTitle;
    const bookCover = this.bookCover;
    const bookDate = this.bookDate.toString();
    const user = this.userId;

    if (!user) {
      // User is not logged in
      this.dialogueService.openDialog('User is not logged in');
      console.log('User not logged in');
      return;
    }
  
    this.bookService.addBookToReadingList(bookId, bookTitle, bookCover, bookDate, user).subscribe(
      () => {
        const token = localStorage.getItem("token");

        if (token){
          this.isBookInReadingList = true;
          this.dialogueService.openDialog('Added to Reading List!');
        }
        else{
          return;
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  findBookInReadingList(){
    const user = this.userId;
    if(!user){
      console.log('User not logged in');
      return;
    }
    this.bookService.isBookInReadingList(this.bookId, this.userId).subscribe(
      (result) => {
        this.isBookInReadingList = result;
      },
      (error) => {
        console.error('Error: ', error);
      }
    );
  }

  findBookInCollection(){
    const user = this.userId;
    if(!user){
      console.log('User not logged in');
      return;
    }
    this.bookService.isBookInCollection(this.bookId, this.userId).subscribe(
      (result) => {
        this.isBookInCollection = result;
      },
      (error) => {
        console.error('Error: ', error);
      }
    );
  }

  removeFromReadingList(){
    const user = this.userId;
    if(!user){
      this.dialogueService.openDialog('User is not logged in');
      console.log('User not logged in');
      return;
    }
    this.bookService.removeFromReadingList(this.bookId, this.userId).subscribe(
      () => {
        const token = localStorage.getItem("token");

        if (token){
          this.isBookInReadingList = false;
          this.dialogueService.openDialog('Removed from Reading List!');
        }
        else{
          return;
        }
      },
      (error) => {
        console.error('Error: ', error);
      }
    )
  }

  removeFromCollection(){
    const user = this.userId;
    if(!user){
      this.dialogueService.openDialog('User is not logged in');
      console.log('User not logged in');
      return;
    }
    this.bookService.removeFromCollection(this.bookId, this.userId).subscribe(
      () => {
        const token = localStorage.getItem("token");

        if (token){
          this.isBookInCollection = false;
          this.dialogueService.openDialog('Removed from Bookshelf!');
        }
        else{
          return;
        }
        
      },
      (error) => {
        console.error('Error: ', error);
      }
    )
  }
} 