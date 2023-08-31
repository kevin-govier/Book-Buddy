import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../services/error-handler.service";

import { catchError, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import { BookService } from "src/app/services/book.service";
import { AuthService } from "src/app/services/auth.service";
import { DialogueService } from "../services/dialogue.service";
import { MatDialog } from '@angular/material/dialog';
import { CreateReviewComponent } from '../create-review/create-review.component';

import { Book } from "src/app/models/Book";

@Component({
  selector: 'app-readingList',
  templateUrl: './readingList.component.html',
  styleUrls: ['./readingList.component.css']
})
export class ReadingListComponent implements OnInit{

  readingList$: Observable<Book[]>;
  userId: number;
  book: any[] = [];
  bookCover: string;
  bookTitle: string;
  bookDate: string;

  sortType: string;
  totalBooks = 0;
  titleSort = false;
  newReleaseSort = false;
  oldReleaseSort = false;

  croppedImages: string[] = [];

  constructor(
    private bookService: BookService, 
    private authService: AuthService, 
    private errorHandlerService: ErrorHandlerService, 
    private dialogueService: DialogueService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.sortType = "NEWLY ADDED"; 
    if (this.userId) {
      this.readingList$ = this.getReadingList();
    } 
    else {
      // User is not logged in
      this.dialogueService.openDialog('User is not logged in');
      console.log('User not logged in');
    }
  }

  preventDefault(event: Event): void {
    event.preventDefault();
  }

  getReadingList(): Observable<Book[]> {
    return this.bookService.fetchAllReadingList(this.userId).pipe(
      map((readingList: Book[]) => {

        if (this.sortType === 'BOOK TITLE') {
          readingList.sort((a, b) => {
            const titleA = a.bookTitle.toUpperCase();
            const titleB = b.bookTitle.toUpperCase();
            return this.titleSort ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
          });
        }
        else if(this.sortType === 'NEWEST RELEASE') {
          readingList.sort((a, b) => {
            const dateA = new Date(a.bookDate);
            const dateB = new Date(b.bookDate);
            return this.newReleaseSort ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();

          });
        }
        else if(this.sortType === 'OLDEST RELEASE') {
          readingList.sort((a, b) => {
            const dateA = new Date(a.bookDate);
            const dateB = new Date(b.bookDate);
            return this.newReleaseSort ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();

          });
        }

        this.totalBooks = readingList.length;
        return readingList;
      }),
      catchError(this.errorHandlerService.handleError<Book[]>("getReadingList", []))
    );
    
  }

  removeBook(bookId: string, userId: number, collection: boolean, clear: boolean): void {
    this.bookService.removeFromReadingList(bookId, userId).subscribe(
      () => {
        if (collection === true){
          this.dialogueService.openDialog('Moved to Bookshelf!');
        }
        else if (clear === true){
          this.dialogueService.openDialog('Reading List Cleared!');
        }
        else{
          this.dialogueService.openDialog('Removed from Reading List!');
        }
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
      },
      (error) => {
        this.dialogueService.openDialog('Error:', error);
        console.error('Error:', error);
      }
    );
  }

  moveToCollection(bookId: string, bookTitle: string, bookCover: string, bookDate: string, userId: number): void {
    this.bookService.addBookToCollection(bookId, bookTitle, bookCover, bookDate, userId).subscribe(
      () => {
        this.removeBook(bookId, userId, true, false);
        this.getReadingList(); // Refresh the reading list after removing the book
      },
      (error) => {
        this.dialogueService.openDialog('Error:', error);
        console.error('Error:', error);
      }
    );
  }

  reviewBook(bookId: string, bookTitle: string, bookCover: string, bookDate: string, userId: number): void {
    // Check if the book already has a review by the user
    this.bookService.findReview(bookId, userId).subscribe(
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
        this.dialogueService.openDialog('Error:', error);
        console.error('Error:', error);
      }
    );
  }

  sortBy(sortType: string): void {
    if (sortType === "BOOK TITLE"){
      this.titleSort = true;
    }
    if (sortType === "NEWEST RELEASE"){
      this.newReleaseSort = true;
    }
    if (sortType === "OLDEST RELEASE"){
      this.oldReleaseSort = true;
    }
    this.readingList$ = this.getReadingList();
    this.sortType = sortType;
  }

  clearReadingList(): void {
    this.readingList$.subscribe((readingList: Book[]) => {
      readingList.forEach((book: Book) => {
        this.removeBook(book.bookId, this.userId, false, true);
      });
    });
  }
}