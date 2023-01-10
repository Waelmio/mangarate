import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { FollowedMangasState } from './followed-mangas/followed-mangas.store';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxsModule.forRoot([FollowedMangasState], { developmentMode: !environment.production }),
    NgxsDispatchPluginModule.forRoot()
  ],
  exports: [
    NgxsModule
  ]
})
export class StoreModule { }
