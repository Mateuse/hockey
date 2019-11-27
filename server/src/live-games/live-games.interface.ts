import { Team } from '../teams/team.interface';

export interface LiveGames{
    homeTeam: Team,
    homeTeamStats: JSON,
    homeTeamPlayers: JSON,
    awayTeam: Team,
    awayTeamStats: JSON,
    awayTeamPlayers: JSON
}