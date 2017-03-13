import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the Thumbnails pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'thumbnails'
})
@Injectable()
export class Thumbnails {
  /*
    Takes a value and makes it lowercase.
   */
  transform(filename, size) {
    switch (size) {
      case 'small':
        return filename.substring(0, filename.indexOf('.')) + '-tn160.png';
      case 'medium':
        return filename.substring(0, filename.indexOf('.')) + '-tn320.png';
      case 'large':
        return filename.substring(0, filename.indexOf('.')) + '-tn640.png';
      default:
        return filename;
    }
  }
}
