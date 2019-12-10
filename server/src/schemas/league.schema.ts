import * as mongoose from 'mongoose';
import { FantasyTeam } from '../fantasy-teams/fantasy-team.interface';
import { PointRules, PositionRules } from '../rules/rules.interface';

export const LeagueSchema = new mongoose.Schema({
    id: {type: Number, unique: true, required: true},
    name: String,
    teams: Array<Number>(),
    createdDate: String,
    pointRules: JSON,
    positionRules: JSON,
    users: Array<Number>()
})