import { Component, OnInit, OnDestroy } from '@angular/core';
import { Company } from '../company';
import { CompanyService } from '../company.service';
import { tap, takeWhile, map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'fbc-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  constructor(private companySvc: CompanyService) {
  }

  companies$: Observable<Company[]>;

  ngOnInit() {
    this.companies$ = this.getCompanies();
  }

  deleteCompany(company: Company) {
    let a$: Observable<Company> = this.companySvc.deleteCompany(company);

    a$.subscribe(c => {
      this.companies$ = this.getCompanies();
    });
  }

  getCompanies() {
    return this.companySvc.getCompanies()
    // inject a sort transform into the pipeline
    .pipe(map(c => c.sort((a, b) => a.name.localeCompare(b.name))));
  }

}
