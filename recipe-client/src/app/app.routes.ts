import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { DetailsComponent } from './pages/details/details';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'new', component: DetailsComponent },
  { path: '**', redirectTo: '' }
];
