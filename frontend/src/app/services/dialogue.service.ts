import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserMessagesComponent } from '../user-messages/user-messages.component';

@Injectable({
  providedIn: 'root'
})
export class DialogueService {

  dialogRef: MatDialogRef<UserMessagesComponent>;

  constructor(private dialog: MatDialog) { }

  openDialog(message: string, length: number = 1500): void {
    this.dialogRef = this.dialog.open(UserMessagesComponent, {
      data: { message: message }
    });
    setTimeout(() => {
      this.closeDialog();
    }, length);
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}