import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
    id: {type: Number, unique: true, required: true},
    fullName: String,
    team: Number,
    stats: JSON,
    link: String,
    position: String,
    poolPoints: Number,
    poolTeam: String,
    acquisitionDate: String,
    history: []
})