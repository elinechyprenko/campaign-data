import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { BehaviorSubject, distinctUntilChanged, exhaustMap, map, take } from 'rxjs';
import { CampaignService } from '../services/campaign.service';

@Component({
  selector: 'app-campaign-creation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './campaign-creation.component.html',
  styleUrl: './campaign-creation.component.scss'
})
export class CampaignCreationComponent {

  searchTerms = new BehaviorSubject('');

  campaignForm: FormGroup | any = '';
  cities = ['Warsaw', 'Krakow', 'Lublin', 'Lodz', 'Poznan'];

  emeraldBalance$;

  constructor(private fb: FormBuilder, private service: CampaignService) {
    this.emeraldBalance$ = this.service.emeraldBalance$;
  }

  keyValue = this.searchTerms.pipe(
    distinctUntilChanged(),
    exhaustMap((term: string) => this.service.getKeywords(term))
  )

  ngOnInit() {
    this.buildForm()
  }

  public buildForm() {
    this.campaignForm = this.fb.group({
      id: [1, [Validators.required]],
      name: ['', [Validators.required]],
      keywords: [[], [Validators.required]],
      bidAmount: [1, [Validators.required]],
      campaignFund: [1, [Validators.required]],
      status: ['', [Validators.required]],
      city: ['', [Validators.required]],
      radius: [1, [Validators.required]],
      emeraldAccountBalance: [1000, [Validators.required]],
    })
  }
  onSubmit(): void {
    if (this.campaignForm.valid) {
      const campaignData = this.campaignForm.value;
      this.service.createCampaign(campaignData).subscribe({
        next: (response) => {
          alert('Campaign created successfully!');
          this.campaignForm.reset();
        },
        error: (err) => {
          console.error('Error creating campaign:', err);
          alert('Failed to create campaign. Please try again.');
        }
      });
    } else {
      alert('Please fill out the form correctly before submitting.');
    }
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerms.next(input.value);
  }

  onCampaignFundChange(amount: number) {
    this.emeraldBalance$.pipe(
      distinctUntilChanged(),
      take(1),
      map((currentBalance) => {
        if (amount > currentBalance) {
          alert('Insufficient balance.');
          throw new Error('Insufficient balance.');
        }
        return currentBalance - amount;
      })
    ).subscribe({
      next: (newBalance) => this.service.updateBalance(newBalance),
      error: (err) => console.error(err.message)
    });
  }
}
