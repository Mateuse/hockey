import * as mongoose from 'mongoose';


export const FantasyTeamSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    players: [],
    teams: [],
    poolPoints: Number
})