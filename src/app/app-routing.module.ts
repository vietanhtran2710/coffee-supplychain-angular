import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { BatchComponent } from './batch/batch.component';

const routes: Routes = [
  {path: "", component: HomeComponent}, 
  {path: "admin", component: AdminComponent},
  {path: "user", component: UserComponent},
  {path: "batch/:address", component: BatchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
