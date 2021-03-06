import { Sort } from '@angular/material/sort';

export class SimplePlayer{
    name: string;
    games: number;
    goals: number;
    assists: number;
    gwg: number;
    position: string;
    ppg: number;
    team: string;
    poolPoints: number;
    poolPointsPerGame: number;

    static sortParams: Array<string> = ["name", "games", "goals", "assists", "gwg", "ppg", "poolPoints", "poolPointsPerGame", "position", "team"];
    static displayParams: Array<string> = ["Name", "Games", "Goals", "Assists", "GWG", "PPG", "Pool Points", "PPPG", "Position", "Team"]
    
    constructor(name: string, games: number, goals: number, assists: number, gwg: number,
                position: string, ppg: number, team: string, poolPoints: number, poolPointsPerGame: number){
        this.name = name;
        this.games = games;
        this.goals = goals;
        this.assists = assists;
        this.gwg = gwg;
        this.position = position;
        this.ppg = ppg;
        this.team = team;
        this.poolPoints = poolPoints;
        this.poolPointsPerGame = poolPointsPerGame;
    }

    static dataSort(players: Array<SimplePlayer>, sort: Sort): SimplePlayer[]{
        const data = players.slice();
        if (!sort.active || sort.direction === '') {
            return data;
        }
        return data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'Games': return this.compare(a.games, b.games, isAsc);
                case 'Goals': return this.compare(a.goals, b.goals, isAsc);
                case 'Assists': return this.compare(a.assists, b.assists, isAsc);
                case 'PPG': return this.compare(a.ppg, b.ppg, isAsc);
                case 'GWG': return this.compare(a.gwg, b.gwg, isAsc);
                case 'Pool Points': return this.compare(a.poolPoints, b.poolPoints, isAsc);
                case 'PPPG': return this.compare(a.poolPointsPerGame, b.poolPointsPerGame, isAsc);
                default: return 0;
            }
        });
    }

    static compare(a: number, b: number, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}