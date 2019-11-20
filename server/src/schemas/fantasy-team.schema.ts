import * as mongoose from 'mongoose';
import { Player } from '../players/player.interface';
import { Team } from '../teams/team.interface';;


export const FantasyTeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    players: Array<Player>(),
    teams: Array<Team>(),
    poolPoints: Number
})