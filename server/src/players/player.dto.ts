export class PlayerDTO{
    readonly id: number;
    readonly fullName: string;
    readonly team: number;
    readonly stats: JSON;
    readonly link: string;
    readonly position: string;
    readonly poolPoints: number;
    readonly poolTeam: string;
    readonly acquisitionDate: string;
    readonly history: any[];
}