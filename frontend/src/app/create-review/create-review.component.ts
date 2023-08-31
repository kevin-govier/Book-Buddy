import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../services/book.service';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CreateReviewComponent implements OnInit {

  body: string;
  createReviewRating: number;

  exactDate: Date;
  month: string;
  day: number;
  year: number;

  date: string;

  bookId: string;
  bookTitle: string;
  bookCover: string;
  bookDate: string;
  userId: number;

  isEditing: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateReviewComponent>,
    private route: ActivatedRoute, 
    private authService: AuthService, 
    private bookService: BookService, 
    private location: Location,
    private router: Router
  ){
    this.userId = this.authService.userId;
    this.bookId = data.bookId;
    this.bookTitle = data.bookTitle;
    this.bookCover = data.bookCover;
    this.bookDate = data.bookDate;
    this.isEditing = data.editMode;
   }

  ngOnInit(){
    

    //adds information from the previous review
    if(this.isEditing) {
      this.bookService.findReview(this.bookId, this.userId).subscribe(
        (review) => {
          if (review) {
            this.body = review.body;
            this.createReviewRating = review.rating;
            this.rate(this.createReviewRating);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

  rate(createReviewRating: number) {
    
    this.createReviewRating = createReviewRating;
    
    var stars = document.querySelectorAll('.rating .ma-ic');
    for (var i = 0; i < stars.length; i++) {
      if (i < createReviewRating) {
        stars[i].textContent = 'star';
      } 
      else {
        stars[i].textContent = 'star_border';
      }
    }
  }

  createReview() {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    this.exactDate = new Date();
    this.day = this.exactDate.getDate();
    this.year = this.exactDate.getFullYear();
    this.month = months[this.exactDate.getMonth()];
    const date = `${this.day} ${this.month}, ${this.year}`;

    const bookId = this.bookId;
    const bookTitle = this.bookTitle;
    const bookCover = this.bookCover;
    const bookDate = this.bookDate;
    const user = this.userId;

    const body = this.body;
    const createReviewRating = this.createReviewRating;
    
    if (this.isEditing) {
      this.bookService.removeReview(bookId, user).subscribe(
        () => {
          console.log("hello");
          this.bookService.addReview(bookId, bookTitle, bookCover, bookDate, body, createReviewRating, user, date).subscribe(
            () => {
              if(this.location.path() === '/reviews') {
                window.location.reload();
              }
              else{
                this.router.navigate(['./reviews']);
              }
              this.dialogRef.close();
            },
            (error) => {
              console.error('Error:', error);
            }
          );
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } 
    else {
      this.bookService.addReview(bookId, bookTitle, bookCover, bookDate, body, createReviewRating, user, date).subscribe(
        () => {
          this.router.navigate(['./reviews']);
          this.dialogRef.close();
        },
        (error) => {
          console.error();
        }
      );
    }
  }
}