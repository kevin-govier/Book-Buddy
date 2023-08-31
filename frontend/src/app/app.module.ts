import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { BookSearchComponent } from './bookSearch/bookSearch.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'; 
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BookService } from './services/book.service';
import {MatTabsModule} from '@angular/material/tabs';
import { CollectionComponent } from './collection/collection.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReadingListComponent } from './readingList/readingList.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { BookInfoComponent } from './book-info/book-info.component';
import { CreateReviewComponent } from './create-review/create-review.component';
import { UserMessagesComponent } from './user-messages/user-messages.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BookSearchComponent,
    CollectionComponent,
    ReviewsComponent,
    ReadingListComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    BookInfoComponent,
    CreateReviewComponent,
    UserMessagesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    AppRoutingModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule,
    MatGridListModule,
    MatSidenavModule
  ],
  providers: [
    BookService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }