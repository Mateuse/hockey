import { Document } from 'mongoose';

export interface Player extends Document{
    id: number,
    fullName: string,
    team: number,
    stats: JSON,
    link: string,
    position: string,
    poolPoints: number,
    poolTeam: string,
    acquisitionDate: string,
    history: any[]
}