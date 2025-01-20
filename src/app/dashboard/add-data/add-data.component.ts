import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-data',
  standalone: true,  // standalone-Komponente
  imports: [SharedModule,
    MatSnackBarModule, 
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,  
    ReactiveFormsModule
  ],  // Import der benötigten Module
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css']
})
export class AddDataComponent implements OnInit {
  public registrationForm: any; // FormGroup deklariert, aber nicht initialisiert

  constructor(
    private formBuilder: FormBuilder,
    public storeService: StoreService,
    private backendService: BackendService,
    private snackBar: MatSnackBar // Snackbar-Service
  ) {}

  ngOnInit(): void {
    // Initialisierung der FormGroup in ngOnInit
    this.registrationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      courseId: ['', Validators.required],
      birthdate: [null, Validators.required], // Setze null als Standardwert
      newsletter: [false]
    });  
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Formularwerte:', this.registrationForm.value);
  
      this.backendService.addRegistration(this.registrationForm.value, this.storeService.currentPage);
      
      // Snackbar anzeigen
      this.snackBar.open('Anmeldung erfolgreich erfasst!', 'Schließen', {
        duration: 3000,
        panelClass: ['success-snackbar'] ,// Optionales Styling
        verticalPosition: 'top', 
        horizontalPosition: 'center'
      });
  
      // Formular zurücksetzen
      this.registrationForm.reset();
    } else {
      console.log('Formular ist ungültig!');
    }
  }
}
