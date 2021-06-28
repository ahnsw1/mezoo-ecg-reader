import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PDataComponent } from './p-data/p-data.component';
import { DListComponent } from './d-list/d-list.component';
import { PeriodComponent } from './period/period.component';
import { ControllerComponent } from './controller/controller.component';
import { EcgComponent } from './ecg/ecg.component';
import { RespirationComponent } from './respiration/respiration.component';

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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
