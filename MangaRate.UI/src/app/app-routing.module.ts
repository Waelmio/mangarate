import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangaHomeComponent } from './mangahome/mangahome.component';

const routes: Routes = [
    { path: '', component: MangaHomeComponent },
    // { path: '', redirectTo: '/mangahome', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
