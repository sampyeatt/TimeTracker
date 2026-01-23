import {RouterModule, Routes} from '@angular/router'
import {RegisterComponent} from './pages/register/register'
import {DashboardComponent} from './pages/dashboard/dashboard'
import {NgModule} from '@angular/core'

export const routes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppModule {}
