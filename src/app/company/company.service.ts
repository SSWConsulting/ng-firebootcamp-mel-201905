import { Injectable } from '@angular/core';
import { Company } from './company';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, retry, tap, delay, timeout } from 'rxjs/operators';
import { errorHandler } from '@angular/platform-browser/src/browser';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private httpClient: HttpClient
  ) {
    this.loadCompanies();
  }

  API_BASE = environment.API_BASE;

  companies$: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>([]);

  loadCompanies() {
    this.httpClient.get<Company[]>(`${this.API_BASE}/company`)
    .pipe(
      // retry(10),
      catchError(e => this.errorHandling<Company[]>(e)),
    ).
    subscribe(companies => this.companies$.next(companies));
  }

  getCompanies(): Observable<Company[]> {
    return this.companies$;
  }

  deleteCompany(company: Company) {
    console.log('Delete Company', company.id);
    this.httpClient.delete<Company>(`${this.API_BASE}/company/${company.id}`)
    .pipe(
      // retry(10),
      tap(c => console.log("HttpClient.delete called")),
      catchError(e => this.errorHandling<Company>(e)),
    )
    .subscribe(c => this.loadCompanies());
  }


  addCompany(company: Company) {
    this.httpClient.post<Company>(
      `${this.API_BASE}/company`, company,
      { headers: new HttpHeaders().set('content-type', 'application/json') }
    ).pipe(
      catchError(e => this.errorHandling<Company>(e)),
      delay(1000),
      timeout(5000)
      )
    .subscribe(c => this.loadCompanies());
  }

  getCompany(id: number): Observable<Company> {
    return this.httpClient.get<Company>(`${this.API_BASE}/company/${id}`)
    .pipe(catchError(e => this.errorHandling<Company>(e)));
  }

  updateCompany(company: Company) {
    return this.httpClient.put<Company>(`${this.API_BASE}/company/${company.id}`, company,
    { headers: new HttpHeaders().set('content-type', 'application/json') }
  ).pipe(catchError(e => this.errorHandling<Company>(e)))
  .subscribe(c => this.loadCompanies());
  }

  //TODO : rename to errorHandlER
  errorHandling<T>(error: Error): Observable<T> {
    // TODO: Implement proper error handler (Toaster...)
    console.error('ERROR', error);

    return new Observable<T>();
  }
}
