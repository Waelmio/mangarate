import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import {FlexLayoutModule} from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastrModule } from 'ngx-toastr';

import { MangaHomeComponent } from './mangahome/mangahome.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddMangaComponent } from './addmanga/addmanga.component';

import { MaterialModule } from './material.module';
import { FollowedMangasModule } from './followed-mangas/followed-mangas.module';
import { CoreModule } from '@core/core.module';
import { FormsModule } from '@angular/forms';


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
    FormsModule,
    NgxSkeletonLoaderModule,
    HttpClientModule,
    CoreModule,
    FollowedMangasModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
