import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CampaignCreationComponent } from './campaign-creation/campaign-creation.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'create', component: CampaignCreationComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
];
