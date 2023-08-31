import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../services/error-handler.service";

import { catchError, map } from "rxjs";
import { Observable } from "rxjs";

import { BookService } from "src/app/services/book.service";
import { AuthService } from "src/app/services/auth.service";
import { DialogueService } from "../services/dialogue.service";
import { MatDialog } from '@angular/material/dialog';
import { CreateReviewComponent } from '../create-review/create-review.component';
import { Router } from "@angular/router";

import { Book } from "src/app/models/Book";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit{
  collection$: Observable<Book[]>;
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
      this.collection$ = this.getCollection();
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

  getCollection(): Observable<Book[]> {
    return this.bookService.fetchAllCollection(this.userId).pipe(
      map((collection: Book[]) => {
  
        if (this.sortType === 'BOOK TITLE') {
          collection.sort((a, b) => {
            const titleA = a.bookTitle.toUpperCase();
            const titleB = b.bookTitle.toUpperCase();
            return this.titleSort ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
          });
        }
        else if(this.sortType === 'NEWEST RELEASE') {
          collection.sort((a, b) => {
            const dateA = new Date(a.bookDate);
            const dateB = new Date(b.bookDate);
            return this.newReleaseSort ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  
          });
        }
        else if(this.sortType === 'OLDEST RELEASE') {
          collection.sort((a, b) => {
            const dateA = new Date(a.bookDate);
            const dateB = new Date(b.bookDate);
            return this.newReleaseSort ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  
          });
        }
  
        this.totalBooks = collection.length;
        return collection;
      }),
      catchError(this.errorHandlerService.handleError<Book[]>("getCollection", []))
    );
    
  }

  removeBook(bookId: string, userId: number, clear: boolean): void {
    this.bookService.removeFromCollection(bookId, userId).subscribe(
      () => {
        
        if(clear === false){
          this.dialogueService.openDialog('Removed from Bookshelf!');
        }
        else{
          this.dialogueService.openDialog('Bookshelf Cleared!');
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
    this.collection$ = this.getCollection();
    this.sortType = sortType;
  }

  clearCollection(): void {
    this.collection$.subscribe((collection: Book[]) => {
      collection.forEach((book: Book) => {
        this.removeBook(book.bookId, this.userId, true);
      });
    });
  }
}