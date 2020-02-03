import { Sort } from '@angular/material/sort';

export class SimpleGoalie {
    name: string;
    games: number;
    assists: number;
    shutouts: number;
    savePercentage: number;
    gaa: number;
    position: string;
    team: string;
    poolPoints: number;
    poolPointsPerGame: number;

    static sortParams: Array<string> = ["name", "games", "shutouts", "savePercentage", "gaa", "poolPoints", "poolPointsPerGame", "position", "team"];
    static displayParams: Array<string> = ["Name", "Games", "Shutouts", "Save %", "GAA", "Pool Points", "PPPG", "Position", "Team"]

    constructor(name: string, games: number,assists: number, shutouts: number, savePercentage: number,
                gaa: number, team: string, poolPoints: number, poolPointsPerGame: number) {
        this.name = name;
        this.games = games;
        this.assists = assists;
        this.shutouts = shutouts;
        this.savePercentage = savePercentage;
        this.gaa = gaa;
        this.position = 'G';
        this.team = team;
        this.poolPoints = poolPoints;
        this.poolPointsPerGame = poolPointsPerGame;
    }

    static dataSort(players: Array<SimpleGoalie>, sort: Sort): SimpleGoalie[] {
        console.log("hg")
        const data = players.slice();
        if (!sort.active || sort.direction === '') {
            return data;
        }
        return data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'Games': return this.compare(a.games, b.games, isAsc);
                case 'Assists': return this.compare(a.assists, b.assists, isAsc);
                case 'Shutouts': return this.compare(a.shutouts, b.shutouts, isAsc);
                case 'Save%': return this.compare(a.savePercentage, b.savePercentage, isAsc);
                case 'GAA': return this.compare(a.gaa, b.gaa, isAsc);
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