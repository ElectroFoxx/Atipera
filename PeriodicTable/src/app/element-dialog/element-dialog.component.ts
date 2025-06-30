import { Component, Inject } from '@angular/core';
import { PeriodicElement } from '../model/element.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-element-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './element-dialog.component.html',
  styleUrl: './element-dialog.component.css'
})
export class ElementDialogComponent {
  editedElement: PeriodicElement;

  constructor(
    public dialogRef: MatDialogRef<ElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement
  ) {
    this.editedElement = { ...data };
  }

  save(): void {
    this.dialogRef.close(this.editedElement);
  }
}
