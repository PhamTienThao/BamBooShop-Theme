import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input() value: number = 0;
  @Input() maxRate: number = 1;
  rateValue: number = 0;
  noRatedColor: string = 'white';
  ratedColor: string = 'black';
  @Output() rateChange:EventEmitter<number> =new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }
  rating(index: number) {
    console.log(index);
    this.value = index;
    this.rateChange.emit(index );
    return this.rateValue = index;
  }
  counter() { 
    let newArray:number[] = [];
    for (let j = 1; j <=this.maxRate;j++)
      newArray.push(j)
    return newArray;
  }
}
