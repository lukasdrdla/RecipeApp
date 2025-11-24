import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { DetailsComponent } from './pages/details/details';
import { IngredientsComponent } from './pages/ingredients/ingredients';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'new', component: DetailsComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'ingredients/new', component: IngredientsComponent },
  { path: 'ingredients/:id', component: IngredientsComponent },
  { path: '**', redirectTo: '' }
];
