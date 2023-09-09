import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

import { Book } from '../models/Book';
import { Review } from '../models/Review';
import { ErrorHandlerService } from './error-handler.service';


@Injectable({
  providedIn: 'root'
})
export class BookService {

  private url = "http://localhost:3000";

  private API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
  private API_KEY = 'AIzaSyDZ2sm8RdPuhtrYVgfyqWbgjv3maRD0fIo';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json", 'Authorization': 'Bearer ' + localStorage.getItem("token") })
  };

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  searchBooksByTitle(query: string): Observable<any>{
    const url = `${this.API_URL}${query}&printType=books&maxResults=40&key=${this.API_KEY}`;
    return this.http.get(url); 
  }

  getBookById(bookId: string): Observable<any> { 
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${this.API_KEY}`;
    return this.http.get(url);
  }

  getFictionBooks(): Observable <any> {
    const url = `https://www.googleapis.com/books/v1/volumes/?q=subject:fiction&orderBy=newest&maxResults=20`;
    return this.http.get(url);
  }

  getCookBooks(): Observable <any> {
    const url = `https://www.googleapis.com/books/v1/volumes/?q=subject:cooking&orderBy=newest&maxResults=20`;
    return this.http.get(url);
  }

  getNonFictionBooks(): Observable <any> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:%22non-fiction%22&orderBy=newest&maxResults=20`;
    return this.http.get(url);
  }

  getSciFiBooks(): Observable <any> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:%22science%20fiction%22&orderBy=newest&maxResults=20`;
    return this.http.get(url);
  }

  getBiographyBooks(): Observable<any> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:%22biography%22&orderBy=newest&maxResults=20`;
    return this.http.get(url);
  }

  getSelfHelpBooks(): Observable<any> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:%22self-help%22&orderBy=newest&maxResults=20`;
    return this.http.get(url);
  }

  fetchAllReadingList(user: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/readingList?user=${user}`, this.httpOptions).pipe( 
      catchError(this.errorHandlerService.handleError<Book[]>("fetchAllReadingList", []))
    );
  }

  fetchAllCollection(user: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/collection?user=${user}`, this.httpOptions).pipe( 
      catchError(this.errorHandlerService.handleError<Book[]>("fetchAllCollection", []))
    );
  }

  fetchAllReviews(user: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.url}/review?user=${user}`, this.httpOptions).pipe( 
      catchError(this.errorHandlerService.handleError<Review[]>("fetchAllReviews", []))
    );
  }

  addBookToReadingList(bookId: string, bookTitle: string, bookCover: string, bookDate: string, user: number): Observable<any> {
    const requestBody = { bookId, bookTitle, bookCover, bookDate, user };
    return this.http.post(`${this.url}/readingList/add`, requestBody, this.httpOptions).pipe(
      catchError((error: any) => {
        let errorMessage = 'An error occurred.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return errorMessage;
      })
    );
  }

  addBookToCollection(bookId: string, bookTitle: string, bookCover: string, bookDate: string, user: number): Observable<any> {
    const requestBody = { bookId, bookTitle, bookCover, bookDate, user };
    return this.http.post(`${this.url}/collection/add`, requestBody, this.httpOptions).pipe(
      catchError((error: any) => {
        let errorMessage = 'An error occurred.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return errorMessage;
      })
    );
  }

  removeFromReadingList(bookId: string, user: number): Observable<any> {
    const deleteUrl = `${this.url}/readingList/${bookId}?user=${user}`;
    return this.http.delete(deleteUrl, this.httpOptions)
    .pipe(catchError(this.errorHandlerService.handleError<void>('removeBookFromReadingList'))); 
  }

  removeFromCollection(bookId: string, user: number): Observable<any> {
    const deleteUrl = `${this.url}/collection/${bookId}?user=${user}`;
    return this.http.delete(deleteUrl, this.httpOptions)
    .pipe(catchError(this.errorHandlerService.handleError<void>('removeBookFromCollection'))); 
  }

  removeReview(bookId: string, user: number): Observable<any> {
    const deleteUrl = `${this.url}/review/${bookId}?user=${user}`;
    return this.http.delete(deleteUrl, this.httpOptions)
    .pipe(catchError(this.errorHandlerService.handleError<void>('removeReview'))); 
  }


  isBookInReadingList(bookId: string, user: number): Observable<boolean> {
    const url = `${this.url}/readingList/${bookId}?user=${user}`;
    return this.http.get<boolean>(url, this.httpOptions).pipe(
      catchError(this.errorHandlerService.handleError<boolean>('isBookInReadingList')));
  }

  isBookInCollection(bookId: string, user: number): Observable<boolean> {
    const url = `${this.url}/collection/${bookId}?user=${user}`;
    return this.http.get<boolean>(url, this.httpOptions).pipe(
      catchError(this.errorHandlerService.handleError<boolean>('isBookInCollection')));
  }

  addReview(bookId: string, bookTitle: string, bookCover: string, bookDate: string, body: string, rating: number, user: number, date: string): Observable<any> {
    const requestBody = { bookId, bookTitle, bookCover, bookDate, body, rating, user, date };
    return this.http.post(`${this.url}/review/add`, requestBody, this.httpOptions).pipe(
      catchError((error: any) => {
        let errorMessage = 'An error occurred.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return errorMessage;
      })
    );
  }

  findReview(bookId: string, userId: number): Observable<any> {
    const url = `${this.url}/review/${bookId}?user=${userId}`;
    return this.http.get(url, this.httpOptions).pipe(
      catchError(this.errorHandlerService.handleError<any>('findReview'))
    );
  }
}