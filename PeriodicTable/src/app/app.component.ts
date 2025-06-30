import { Component, effect, inject } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ElementStore } from './store/element.store';
import { PeriodicElement } from './model/element.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ElementDialogComponent } from './element-dialog/element-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTableModule, MatFormField, MatLabel, MatInputModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  readonly store = inject(ElementStore);
  private readonly dialog = inject(MatDialog);

  filterControl = new FormControl('');

  constructor() {
    this.filterControl.valueChanges.pipe(debounceTime(2000)).subscribe((value: string | null) => {
      if (value !== null) {
        this.store.setQuery(value.trim().toLowerCase());
      }
    })
  }

  ngOnInit() {
    this.store.loadAll();
  }

  private readonly updateTableEffect = effect(() => {
    this.dataSource.data = this.store.filteredElements();
  });

  onRowClick(element: PeriodicElement) {
    const dialogRef = this.dialog.open(ElementDialogComponent, {
      width: '300px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.updateElement(result);
      }
    });
  }

  title = 'PeriodicTable';
}