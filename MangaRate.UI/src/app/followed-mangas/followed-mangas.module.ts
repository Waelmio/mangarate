import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowedMangasDisplayComponent } from './followed-mangas-display/followed-mangas-display.component';
import { FollowedMangaComponent } from './followed-manga/followed-manga.component';
import { FollowedMangasDisplayContainerComponent } from './followed-mangas-display-container/followed-mangas-display-container.component';



@NgModule({
  declarations: [
    FollowedMangasDisplayComponent,
    FollowedMangaComponent,
    FollowedMangasDisplayContainerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FollowedMangasDisplayContainerComponent
  ]
})
export class FollowedMangasModule { }
