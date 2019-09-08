import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sort' })
export class SortPipe implements PipeTransform {
    transform(items: any[], property: string, asc:boolean = true): any {
        return (items || []).sort( (start:any, end:any) => {
            return start[property] < end[property]? (asc? -1 : 1) : (asc? 1 : -1);
        });
    }
}