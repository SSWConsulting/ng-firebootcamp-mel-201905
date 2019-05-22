import { Injectable } from '@angular/core';
import { Company } from './company';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, retry, tap } from 'rxjs/operators';
import { errorHandler } from '@angular/platform-browser/src/browser';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private httpClient: HttpClient
  ) { }

  API_BASE = environment.API_BASE;

  getCompanies(): Observable<Company[]> {
    return this.httpClient.get<Company[]>(`${this.API_BASE}/company`)
    .pipe(
      // retry(10),
      catchError(e => this.errorHandling<Company[]>(e)),
    );
  }

  deleteCompany(company: Company): Observable<Company> {
    console.log("Delete Company", company.id);
    return this.httpClient.delete<Company>(`${this.API_BASE}/company/${company.id}`)
    .pipe(
      // retry(10),
      tap(c => console.log("HttpClient.delete called")),
      catchError(e => this.errorHandling<Company>(e)),
    );
  }


  addCompany(company: Company): Observable<Company> {
    return this.httpClient.post<Company>(
      `${this.API_BASE}/company`, company,
      { headers: new HttpHeaders().set('content-type', 'application/json') }
    ).pipe(catchError(e => this.errorHandling<Company>(e)));
  }

  getCompany(id: number): Observable<Company> {
    return this.httpClient.get<Company>(`${this.API_BASE}/company/${id}`)
    .pipe(catchError(e => this.errorHandling<Company>(e)));
  }

  updateCompany(company: Company): Observable<Company> {
    return this.httpClient.put<Company>(`${this.API_BASE}/company/${company.id}`, company,
    { headers: new HttpHeaders().set('content-type', 'application/json') }
  ).pipe(catchError(e => this.errorHandling<Company>(e)));
  }

  //TODO : rename to errorHandlER
  errorHandling<T>(error: Error): Observable<T> {
    // TODO: Implement proper error handler (Toaster...)
    console.error('ERROR', error);

    return new Observable<T>();
  }
}
