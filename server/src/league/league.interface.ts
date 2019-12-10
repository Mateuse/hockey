import { Document } from 'mongoose';

export interface League extends Document{
    name: string,
    teams: Number[],
    createDate: string,
    pointRules: JSON,
    positionRules: JSON,
    users: Number[]
}