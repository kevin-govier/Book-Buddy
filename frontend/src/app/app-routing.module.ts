import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookSearchComponent } from './bookSearch/bookSearch.component';
import { CollectionComponent } from './collection/collection.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReadingListComponent } from './readingList/readingList.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { BookInfoComponent } from './book-info/book-info.component';
import { CreateReviewComponent } from './create-review/create-review.component';

import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'home', component:HomeComponent},
  {path:'bookSearch', component:BookSearchComponent},
  { path: 'create-review/:bookId/:bookTitle/:bookCover/:bookDate/:action', component: CreateReviewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'book-info/:id', component: BookInfoComponent },
  { path: 'readingList', component: ReadingListComponent, canActivate: [AuthGuard] }, // Protected route
  { path: 'reviews', component: ReviewsComponent, canActivate: [AuthGuard] }, // Protected route
  { path: 'collection', component: CollectionComponent, canActivate: [AuthGuard] }, // Protected route
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }