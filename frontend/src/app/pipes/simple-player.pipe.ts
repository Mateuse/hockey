import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'simplePlayer' })
export class SimplePlayerPipe implements PipeTransform {
  sortArray = ["name", "games", "goals", "assists", "gwg", "ppg", "poolPoints", "poolPointsPerGame", "position", "team"];
  transform(value, args: string[]): any {
    let values = [];
    for (let key in this.sortArray) {
      values.push(value[this.sortArray[key]]);      
    }
    return values;
  }
}