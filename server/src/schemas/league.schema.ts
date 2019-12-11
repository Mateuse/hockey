import * as mongoose from 'mongoose';

export const LeagueSchema = new mongoose.Schema({
    leagueName: { type: String, unique: true, required: true },
    fantasyTeams: [],
    createdDate: String,
    positionRules: JSON,
    pointRules: JSON
})