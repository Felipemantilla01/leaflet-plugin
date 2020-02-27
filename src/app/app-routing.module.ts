import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkproMgmtComponent } from './management/workpro-mgmt/workpro-mgmt.component';
import { WorkproEditMgmtComponent } from './management/workpro-edit-mgmt/workpro-edit-mgmt.component';


const routes: Routes = [
  {path:'', component:WorkproMgmtComponent},
  {path:'workpro', component:WorkproMgmtComponent},
  {path:'workpro/editar', component:WorkproEditMgmtComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
