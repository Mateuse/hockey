export class TeamDTO{
    readonly id: number;
    readonly name: string;
    readonly abbreviation: string;
    readonly link: string;
    readonly stats: JSON;
    readonly poolPoints: number;
    readonly poolTeam: string;
    readonly acquisitionDate: string;
}