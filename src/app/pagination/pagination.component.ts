import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() URL: string;
  @Input() MAX_PAGINATION_TILES: number = 5;
  response: any = [];
  displayContent: any = [];
  tileSize: number = 5;
  pageSize: number = 2;
  currentTotalTiles: number;
  hideLeft: boolean = true;
  hideRight: boolean = true;
  prevFirst: number = 1;
  prevLast: number;



  constructor() { }

  ngOnInit() {
    fetch(`${this.URL}`).then(response => response.json())
      .then(json => {
        this.response = json;
        this.currentTotalTiles = Math.ceil(this.response.length / this.pageSize);
        if (this.currentTotalTiles > this.tileSize) {
          this.hideRight = false;
          this.prevLast = this.tileSize;
        } else {
          this.prevLast = this.currentTotalTiles;
        }
        this.displayContent = this.response.slice(0, this.pageSize);
      });
  }


  getPaginationTiles() {
    return document.querySelectorAll('#paginationtiles a');
  }

  clearActiveTilestate() {
    let tiles = this.getPaginationTiles();
    for (let i = 0; i < tiles.length; i++) tiles[i].classList.remove('active');
  }

  pagination(event: Event) {
    let tn = +event.target['innerText'];
    this.displayContent = this.response.slice(tn * this.pageSize - this.pageSize, tn * this.pageSize);
    let tiles = this.getPaginationTiles();
    this.clearActiveTilestate();
    tiles[(tn % tiles.length === 0) ? tiles.length - 1 : tn % tiles.length - 1].classList.add('active');

  }

  rightNext() {
    let tiles = this.getPaginationTiles();
    let curLastTileValue = +tiles[tiles.length - 1].innerHTML;
    if ((this.currentTotalTiles - curLastTileValue) > 0) {
      if ((this.currentTotalTiles - curLastTileValue) <= this.tileSize) {
        this.hideLeft = false;
        this.hideRight = true;
      }

    }
    this.clearActiveTilestate();
    for (let i = 0; i < this.tileSize; i++) {
      if ((curLastTileValue + 1) <= this.currentTotalTiles) {
        tiles[i].innerHTML = `${++curLastTileValue}`;
      } else {
        tiles[i].innerHTML = '-'
      }
    }
  }

  leftPrev() {
    let tiles = this.getPaginationTiles();
    let curFirstTileValue = +tiles[0].innerHTML;
    this.hideRight = false;
    this.clearActiveTilestate();
    for (let i = this.tileSize - 1; i >= 0; i--) {
      tiles[i].innerHTML = `${--curFirstTileValue}`;
    }
    if (+tiles[0].innerHTML === 1) this.hideLeft = true;
  }


}
