import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.css']
})
export class TableTemplateComponent implements OnInit {

  @Input() columnsTable: any[] = [];

  @Input() addEditComponent: any;
  
  @Input() refreshTable: boolean = true;

  @Input() multiColSelect: boolean = false;
  @Input() tableSize: any = 'default';
  @Output() onDelete = new EventEmitter<any>();
  @Output() onRefresh = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onAddnew = new EventEmitter<any>();
  @Output() onMultiSelect = new EventEmitter<any>();

  @Input() listOfData: readonly any[] = [];

  @Input() editDeleteAction: boolean = true;

  checked = false;
  loading = false;
  indeterminate = false;
  listOfCurrentPageData: readonly any[] = [];
  setOfCheckedId = new Set<number>();
  
  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute) { 

  }

  ngOnInit(): void {
    this.listOfData.forEach(x => {
      this.columnsTable.forEach(y => {
        y.prop == typeof(x)
      })
    })
    if(this.refreshTable){
      this.setOfCheckedId = new Set<number>();
    }
  }
  updateCheckedSet(Id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(Id);
    } else {
      this.setOfCheckedId.delete(Id);
    }
  }
  log(value: any){
    console.log(value);
  }
  onCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ Id }) => this.setOfCheckedId.has(Id));
    this.indeterminate = listOfEnabledData.some(({ Id }) => this.setOfCheckedId.has(Id)) && !this.checked;
  }

  onItemChecked(Id: number, checked: boolean): void {
    this.updateCheckedSet(Id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ Id }) => this.updateCheckedSet(Id, checked));
    this.refreshCheckedStatus();
  }
  trackByName(_: number, item: any): string {
    return item.name;
  }
  onClickDelete(data: any) {
    this.onDelete.emit(data);
  }
  showDetail(data:any){
    this.onEdit.emit(data);
  }
  // refreshTable(reset: boolean = false) {
  //   this.onRefresh.emit(reset);
  // }
  deleteList(): void {
    const requestData = this.listOfData.filter(data => this.setOfCheckedId.has(data.Id));
    this.onMultiSelect.emit(requestData);
  }
}
