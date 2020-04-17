import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-node',
  templateUrl: './dialog-node.component.html',
  styleUrls: ['./dialog-node.component.scss']
})
export class DialogNodeComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  ngOnInit() {
  }

}
