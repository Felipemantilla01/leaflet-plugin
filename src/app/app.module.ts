import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletComponent } from './components/leaflet/leaflet.component';
import { HttpClientModule } from '@angular/common/http';
import { FetchDataService } from './services/fetch-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MantillaModule } from 'mantilla';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { WorkproEditableComponent } from './work/workpro-editable/workpro-editable.component';
import { WorkproComponent } from './work/workpro/workpro.component';
import { WorkproMgmtComponent } from './management/workpro-mgmt/workpro-mgmt.component';
import { WorkproEditMgmtComponent } from './management/workpro-edit-mgmt/workpro-edit-mgmt.component';
import { WorkComponent } from './work/work.component';
import { TesterComponent } from './tester/tester.component';

@NgModule({
  declarations: [
    AppComponent,
    LeafletComponent,
    WorkproEditableComponent,
    WorkproComponent,
    WorkproMgmtComponent,
    WorkproEditMgmtComponent,
    WorkComponent,
    TesterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MantillaModule,
    MatSnackBarModule
  ],
  providers: [FetchDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
