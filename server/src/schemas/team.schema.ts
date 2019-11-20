import * as mongoose from 'mongoose';

export const TeamSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    name: String,
    abbreviation: String,
    link: String,
    stats: JSON,
    poolPoints: Number,
    poolTeam: String,
    acquisitionDate: String
})