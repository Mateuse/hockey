import { PipeTransform, Pipe } from '@angular/core';
import { SimplePlayer } from '../../models/simplePlayer';

@Pipe({ name: 'simplePlayer' })
export class SimplePlayerPipe implements PipeTransform {
  sortArray = SimplePlayer.sortParams
  transform(value, args: string[]): any {
    let values = [];
    for (let key in this.sortArray) {
      values.push(value[this.sortArray[key]]);      
    }
    return values;
  }
}