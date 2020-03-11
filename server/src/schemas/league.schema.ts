import * as mongoose from 'mongoose';

export const LeagueSchema = new mongoose.Schema({
    leagueName: { type: String, required: true },
    commissioner: String,
    fantasyTeams: [],
    players: [],
    teams: [],
    createdDate: String,
    positionRules: JSON,
    pointRules: JSON
})