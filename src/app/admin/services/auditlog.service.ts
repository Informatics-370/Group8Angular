import { Injectable } from '@angular/core';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuditlogService {

  private apiUrl = `${environment.baseApiUrl}api/AuditLog`;

  constructor(private http: HttpClient
              ) { }



  getAuditLog(): Observable<any> {
    return this.http.get<AuditTrail[]>(this.apiUrl);
  }

  async addAuditLog(AuditTrail: AuditTrail): Promise<AuditTrail> {
    return firstValueFrom(this.http.post<AuditTrail>(this.apiUrl+ "/AddAuditLog", AuditTrail));
  }

}
