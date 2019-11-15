import { Document } from 'mongoose';

export interface Player extends Document{
    id: number,
    fullName: string,
    stats: JSON,
    link: string,
    position: string,
    poolPoints: number,
    poolTeam: number,
    acquisitionDate: string
}