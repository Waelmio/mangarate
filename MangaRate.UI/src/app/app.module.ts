import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MangaHomeComponent } from './mangahome/mangahome.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddMangaComponent } from './addmanga/addmanga.component';
import { FollowedMangasComponent } from './followedmangas/followedmangas.component';

import { LayoutModule } from '@angular/cdk/layout';
import {FlexLayoutModule} from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from './material.module';


@NgModule({
  declarations: [
    AppComponent,
    FollowedMangasComponent,
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
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
