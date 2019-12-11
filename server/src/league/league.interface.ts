import { Document } from 'mongoose';

export interface League extends Document{
    leagueName: string,
    fantasyTeams: any[],
    createdDate: string,
    positionRules: JSON,
    pointRules: JSON
}
