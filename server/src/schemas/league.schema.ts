import * as mongoose from 'mongoose';

export const LeagueSchema = new mongoose.Schema({
    id: {type: Number, unique: true, required: true},
    leagueName: String,
    fantasyTeams: [],
    createdDate: String,
    positionRules: JSON,
    pointRules: JSON
})