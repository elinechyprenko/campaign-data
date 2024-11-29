import { Component } from '@angular/core';
import { Campaign } from '../model/campaign.model';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { CampaignService } from '../services/campaign.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss'
})
export class CampaignListComponent {
  campaigns$: Observable<Campaign[]>;
  editedCampaign$: Observable<Campaign | null>;

  private editingIdSubject = new BehaviorSubject<number | null>(null)
  editingID$ = this.editingIdSubject.asObservable();

  constructor(private service: CampaignService) {
    this.campaigns$ = this.service.campaigns$;
    this.editedCampaign$ = combineLatest([this.campaigns$, this.editingID$]).pipe(
      map(([campaign, editID]: [Campaign[], number | null]) => campaign.find(campaign => campaign.id === editID) || null)
    )
  }

  ngOnInit() {
  }

  editCampaign(id: number) {
    this.editingIdSubject.next(id);
  }
  saveCampaign(campaign: Campaign) {
    this.service.updateCampaign(campaign).subscribe(() => this.editingIdSubject.next(null))
  }

  cancelEdit() {
    this.editingIdSubject.next(null)
  }

  deleteCampaign(id: number) {
    this.service.deleteCampaign(id).subscribe(() => this.editingIdSubject.next(null))
  }
}
