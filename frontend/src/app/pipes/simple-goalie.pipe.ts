import { PipeTransform, Pipe } from '@angular/core';
import { SimpleGoalie } from '../../models/simpleGoalie';

@Pipe({ name: 'simpleGoalie' })
export class SimpleGoaliePipe implements PipeTransform {
  sortArray = SimpleGoalie.sortParams
  transform(value, args: string[]): any {
    let values = [];
    for (let key in this.sortArray) {
      values.push(value[this.sortArray[key]]);
    }
    return values;
  }
}
