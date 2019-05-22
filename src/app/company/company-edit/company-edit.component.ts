import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyService } from '../company.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from '../company';

@Component({
  selector: 'fbc-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private fb: FormBuilder) { }

    company: Company;
    isNewCompany: boolean;
    companyId: number;
    companyForm: FormGroup;

  ngOnInit() {
    this.isNewCompany = !this.activatedRoute.snapshot.params['id'];
    this.buildForm();

    if(!this.isNewCompany){
      this.companyId = this.activatedRoute.snapshot.params['id'];

      this.companyService.getCompany(this.companyId)
      .subscribe(company => this.companyForm.patchValue(company));
    }
  }

buildForm() {
  this.companyForm = this.fb.group({
    name: ['', Validators.required],
    phone: [''],
    email: ['']
  });
}

saveCompany() {
  console.log('SAVING FORM', this.companyForm);
  if (this.isNewCompany) {
    this.companyService.addCompany(this.companyForm.value)
    .subscribe(c => this.router.navigateByUrl('/company/list'));
  } else {
    const company: Company = {... this.companyForm.value, id: this.companyId };
    this.companyService.updateCompany(company)
    .subscribe(c => this.router.navigateByUrl('/company/list'));
  }
}


}
