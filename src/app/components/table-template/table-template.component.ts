import { Component, Input, OnInit } from '@angular/core';
import { Data } from './data-model';

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.css']
})
export class TableTemplateComponent implements OnInit {

  @Input() columnsTable: any[] = [];

  checked = false;
  loading = false;
  indeterminate = false;
  @Input() listOfData: readonly any[] = [];
  listOfCurrentPageData: readonly any[] = [];
  setOfCheckedId = new Set<number>();
  
  constructor() { }

  ngOnInit(): void {
    this.listOfData.forEach(x => {
      this.columnsTable.forEach(y => {
        y.prop == typeof(x)
      })
    })
  }
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly Data[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }
  trackByName(_: number, item: any): string {
    return item.name;
  }
  
  // sendRequest(): void {
  //   this.loading = true;
  //   const requestData = this.listOfData.filter(data => this.setOfCheckedId.has(data['id']));
  //   console.log(requestData);
  //   setTimeout(() => {
  //     this.setOfCheckedId.clear();
  //     this.refreshCheckedStatus();
  //     this.loading = false;
  //   }, 1000);
  // }
}
