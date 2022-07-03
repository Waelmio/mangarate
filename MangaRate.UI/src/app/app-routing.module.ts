import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FollowedMangasComponent } from './followedmangas/followedmangas.component';
import { MangaHomeComponent } from './mangahome/mangahome.component';

const routes: Routes = [
    { path: '', component: MangaHomeComponent },
    { path: 'followed', component: FollowedMangasComponent }
    // { path: '', redirectTo: '/mangahome', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
