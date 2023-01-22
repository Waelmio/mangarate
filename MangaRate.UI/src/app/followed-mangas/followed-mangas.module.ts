import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowedMangasDisplayComponent } from './followed-mangas-display/followed-mangas-display.component';
import { FollowedMangaComponent } from './followed-manga/followed-manga.component';
import { FollowedMangasDisplayContainerComponent } from './followed-mangas-display-container/followed-mangas-display-container.component';
import { MaterialModule } from '@app/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialElevationDirective } from './followed-manga/materal-elevation.directive';



@NgModule({
  declarations: [
    FollowedMangasDisplayComponent,
    FollowedMangaComponent,
    FollowedMangasDisplayContainerComponent,
    MaterialElevationDirective
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [
    FollowedMangasDisplayContainerComponent
  ]
})
export class FollowedMangasModule { }
