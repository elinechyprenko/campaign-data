import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Campaign } from '../model/campaign.model';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';

const apiUrl = 'http://localhost:3000'

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private campaignsSubject = new BehaviorSubject<Campaign[]>([]);
  campaigns$ = this.campaignsSubject.asObservable();

  emeraldBalanceSubject = new BehaviorSubject<number>(5000);
  emeraldBalance$ = this.emeraldBalanceSubject.asObservable();


  constructor(private http: HttpClient) {
    this.loadData()
  }

  loadData() {
    this.http.get<Campaign[]>(`${apiUrl}/campaigns`).subscribe((campaigns => this.campaignsSubject.next(campaigns)))
  }

  updateCampaign(campaign: Campaign): Observable<void> {
    return this.http.put<void>(`${apiUrl}/campaigns/${campaign.id}`, campaign).pipe(
      tap(() => {
        const updatedCampaigns = this.campaignsSubject
          .getValue()
          .map((c) => c.id === campaign.id ? campaign : c);
        this.campaignsSubject.next(updatedCampaigns);
      }),
      catchError((error) => {
        console.error('Error updating campaign:', error);
        throw error;
      })
    );
  }
  deleteCampaign(id: number): Observable<void> {
    return this.http.delete<void>(`${apiUrl}/campaigns/${id}`).pipe(
      tap(() => {
        const updateCampaign = this.campaignsSubject
          .getValue()
          .filter((c) => c.id !== id);
        this.campaignsSubject.next(updateCampaign)
      })
    )
  }

  getKeywords(term: string): Observable<string[]> {
    return this.http.get<{ name: string }[]>(`${apiUrl}/keywords`, {
      params: { criteria: term }
    }).pipe(
      map((response) => response.map(keyword => keyword.name)))
  }

  updateBalance(newBalance: number) {
    this.emeraldBalanceSubject.next(newBalance);
  }

  createCampaign(campaign: Campaign): Observable<Campaign> {
    return this.http.post<Campaign>(`${apiUrl}/campaigns`, campaign).pipe(
      tap((newCampaign: Campaign) => {
        const updateCampaigns = [...this.campaignsSubject.getValue(), newCampaign];
        this.campaignsSubject.next(updateCampaigns)
      })
    )
  }
}
