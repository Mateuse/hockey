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
}