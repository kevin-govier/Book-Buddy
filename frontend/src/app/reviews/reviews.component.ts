import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../services/error-handler.service";

import { catchError, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Router } from '@angular/router';

import { BookService } from "src/app/services/book.service";
import { AuthService } from "src/app/services/auth.service";
import { DialogueService } from "../services/dialogue.service";
import { MatDialog } from '@angular/material/dialog';
import { CreateReviewComponent } from '../create-review/create-review.component';

import { Review } from "src/app/models/Review";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit{
  reviews$: Observable<Review[]>;
  userId: number;
  review: any[] = [];
  bookCover: string;
  bookDate: string;
  bookTitle: string;
  body: string;
  rating: number;
  date: string;

  constructor(
    private bookService: BookService, 
    private router: Router, 
    private authService: AuthService, 
    private errorHandlerService: ErrorHandlerService, 
    private dialogueService: DialogueService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.userId; 
    if (this.userId) {
      this.reviews$ = this.getReviews();
    } else {
      // User is not logged in
      this.dialogueService.openDialog('User is not logged in');
      console.log('User not logged in');
    }
  }

  getReviews(): Observable<Review[]> {
    return this.bookService.fetchAllReviews(this.userId).pipe(
      map((reviews: Review[]) => {
        return reviews;
      }),
      catchError(this.errorHandlerService.handleError<Review[]>("getReviews", []))
    );
  }

  removeReview(bookId: string, userId: number): void {
    this.bookService.removeReview(bookId, userId).subscribe(
      () => {
        this.dialogueService.openDialog('Review Deleted!');
        this.getReviews();
      },
      (error) => {
        this.dialogueService.openDialog('Error:', error);
        console.error('Error:', error);
      }
    );
  }

  refreshPage(){
    window.location.reload();
  } 

  editReview(bookId: string, bookTitle: string, bookCover: string, bookDate: string): void{
    const dialogRef = this.dialog.open(CreateReviewComponent, {
      panelClass: 'dialog-width',
      data: {
        bookId: bookId,
        bookTitle: bookTitle,
        bookCover: bookCover,
        bookDate: bookDate,
        editMode: 'edit'
      }
    });
  }
}