import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
    id: Number,
    fullName: String,
    stats: JSON,
    link: String,
    position: String,
    poolPoints: Number,
    poolTeam: Number,
    acquisitionDate: String
})