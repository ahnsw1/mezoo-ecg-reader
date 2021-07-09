import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PDataComponent } from './component/p-data/p-data.component';
import { DListComponent } from './component/d-list/d-list.component';
import { PeriodComponent } from './component/period/period.component';
import { ControllerComponent } from './component/graph/controller/controller.component';
import { EcgComponent } from './component/ecg/ecg.component';
import { RespirationComponent } from './component/respiration/respiration.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphComponent } from './component/graph/graph.component';
import { PrdComponent } from './component/graph/prd/prd.component';
import { Ecg1Component } from './component/graph/ecg1/ecg1.component';
import { Res1Component } from './component/graph/res1/res1.component';

@NgModule({
  declarations: [
    AppComponent,
    PDataComponent,
    DListComponent,
    PeriodComponent,
    ControllerComponent,
    EcgComponent,
    RespirationComponent,
    GraphComponent,
    PrdComponent,
    Ecg1Component,
    Res1Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
