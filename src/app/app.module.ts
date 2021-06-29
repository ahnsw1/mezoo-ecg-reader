import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PDataComponent } from './component/p-data/p-data.component';
import { DListComponent } from './component/d-list/d-list.component';
import { PeriodComponent } from './component/period/period.component';
import { ControllerComponent } from './component/controller/controller.component';
import { EcgComponent } from './component/ecg/ecg.component';
import { RespirationComponent } from './component/respiration/respiration.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PDataComponent,
    DListComponent,
    PeriodComponent,
    ControllerComponent,
    EcgComponent,
    RespirationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
