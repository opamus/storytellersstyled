import { Card } from './../data-model/card';
import { Injectable } from '@angular/core';

@Injectable()
export class ArchiveState {

  public mediaList: Card[];
  public listLength: number;
  public index: number;
  public searchList: Card[];

  constructor() {
    this.mediaList = [];
    this.listLength = 0;
    this.index = 0;
    this.searchList = [];
  }

  public clearState () {
    this.mediaList = [];
    this.listLength = 0;
    this.index = 0;
    this.searchList = [];
  }
}
