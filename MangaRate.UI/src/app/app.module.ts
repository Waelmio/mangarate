import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MangaHomeComponent } from './mangahome/mangahome.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddMangaComponent } from './addmanga/addmanga.component';

import { LayoutModule } from '@angular/cdk/layout';
import {FlexLayoutModule} from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from './material.module';
import { StoreModule } from '@core/store/store.module';
import { FollowedMangasModule } from './followed-mangas/followed-mangas.module';


@NgModule({
  declarations: [
    AppComponent,
    AddMangaComponent,
    MangaHomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    FlexLayoutModule,
    NgxSkeletonLoaderModule,
    HttpClientModule,
    StoreModule,
    FollowedMangasModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
