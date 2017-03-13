import { Card } from './../data-model/card';
import { Injectable } from '@angular/core';

@Injectable()
export class FrontState {

  public mediaList: Card[];
  public listLength: number;
  public index: number;

  constructor() {
    this.mediaList = [];
    this.listLength = 0;
    this.index = 0;
  }

  public clearState () {
    this.mediaList = [];
    this.listLength = 0;
    this.index = 0;
  }
}
