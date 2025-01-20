import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialog } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';  

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [SharedModule, MatSpinner, MatIcon],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent {

  constructor(public storeService: StoreService, private backendService: BackendService, private dialog: MatDialog) {}

  public page: number = 0;

  selectPage(i: any) {
    let currentPage = i;
    this.storeService.currentPage = i;
    this.backendService.getRegistrations(currentPage);
  }

  public returnAllPages() {
    var pagesCount = Math.ceil(this.storeService.registrationTotalCount / 2);
    let res = [];
    for (let i = 0; i < pagesCount; i++) {
        res.push(i + 1);
      }
    return res;
  }

  public sortOrder: 'asc' | 'desc' = 'asc'; // Standard-Sortierreihenfolge

  sortByDate(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  
    this.storeService.registrations.sort((a, b) => {
      const dateA = new Date(a.registrationDate).getTime();
      const dateB = new Date(b.registrationDate).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }
  

  onDelete(registrationId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '400px',
      data: { message: 'Sind Sie sicher, dass Sie sich abmelden möchten?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.storeService.registrations = this.storeService.registrations.map(reg => {
          if (reg.id === registrationId) {
            return { ...reg, deleting: true };
          }
          return reg;
        });
  
        this.backendService.deleteRegistration(registrationId).subscribe({
          next: () => {
            this.backendService.getRegistrations(this.storeService.currentPage);
          },
          error: (err) => {
            console.error('Fehler beim Löschen:', err);
            this.storeService.registrations = this.storeService.registrations.map(reg => {
              if (reg.id === registrationId) {
                return { ...reg, deleting: false };
              }
              return reg;
            });
          }
        });
      }
    });
  }
  
  
  
}
