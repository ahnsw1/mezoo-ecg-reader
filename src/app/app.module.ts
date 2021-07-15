import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PDataComponent } from './component/p-data/p-data.component';
import { DListComponent } from './component/d-list/d-list.component';
import { ControllerComponent } from './component/graph/controller/controller.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphComponent } from './component/graph/graph.component';
import { PrdComponent } from './component/graph/prd/prd.component';
import { EcgComponent } from './component/graph/ecg/ecg.component';
import { RespirationComponent } from './component/graph/respiration/respiration.component';

@NgModule({
  declarations: [
    AppComponent,
    PDataComponent,
    DListComponent,
    ControllerComponent,
    GraphComponent,
    PrdComponent,
    EcgComponent,
    RespirationComponent
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
