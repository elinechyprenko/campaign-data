export interface Campaign {
    id: number,
    name: string,
    keywords: string[],
    bidAmount: number,
    campaignFund: number,
    status: string,
    city: string,
    radius: number,
    emeraldAccountBalance: number
}