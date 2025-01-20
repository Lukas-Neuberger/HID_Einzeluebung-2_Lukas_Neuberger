import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Course } from './Interfaces/Course';
import { Registration } from './Interfaces/Registration';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private storeService: StoreService) { }

  public getCourses() {
      this.http.get<Course[]>('http://localhost:5000/courses?_expand=eventLocation').subscribe(data => {
        this.storeService.courses = data;
        this.storeService.cousesLoading = false;
      });
  }

  public getRegistrations(page: number) {

    const options = {
      observe: 'response' as const,
      transferCache: {
        includeHeaders: ['X-Total-Count']
      }
    };

    this.http.get<Registration[]>(`http://localhost:5000/registrations?_expand=course&_page=${page}&_limit=4`, options).subscribe(data => {
      this.storeService.registrations = data.body!;
      this.storeService.registrationTotalCount = Number(data.headers.get('X-Total-Count'));
      this.storeService.registrationsLoading = false;
    });
  }

  public addRegistration(registration: any, page: number) {
    // Füge das aktuelle Datum zur Registrierung hinzu
    const newRegistration = {
      ...registration,
      registrationDate: new Date().toISOString().split('T')[0]  // YYYY-MM-DD Format
    };
  
    this.http.post('http://localhost:5000/registrations', newRegistration).subscribe(_ => {
      this.getRegistrations(page);
    });
  }
  
  public deleteRegistration(registrationId: string) {
    return this.http.delete(`http://localhost:5000/registrations/${registrationId}`);
  }
  
}
