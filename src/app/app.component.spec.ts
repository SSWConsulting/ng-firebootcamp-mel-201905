import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { CompanyService } from './company/company.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { CompanyTableComponent } from './company/company-table/company-table.component';
import { DebugElement } from '@angular/core';
import { CompanyEditComponent } from './company/company-edit/company-edit.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('hello testing', () => {
  it('can add 1+1', () => {
    expect(1 + 1).toEqual(2);
  });

  it('Can Create AppComponent', () => {
    const component = new AppComponent(null);
    expect(component.title).toBe('firebootcamp-crm');
  });
});

describe('fake company service', () => {
  let component: AppComponent;
  let companySvc;

  beforeEach(() => {
    companySvc = {
      getCompanies: () => of([{
        name: 'Fake Company',
        email : 'fakeEmail@ssw.com.au',
        number: 12345,
      }])
    };
    component = new AppComponent(companySvc);
  });

  it('gets company count', () => {
    component.ngOnInit();
    component.companiesCount$.subscribe(c => {
      expect(c).toEqual(1);
    });
  });

});

describe('spyon', () => {
  let companyService;
  let component: AppComponent;

  beforeEach(() => {
    companyService = {
      getCompanies: () => {}
    };
    component = new AppComponent(companyService);
  });

  it(`companyCount = 2`, () => {
    spyOn(companyService, 'getCompanies').and.returnValue(of([
      {
        name: 'Fake Company A',
        email: 'fakeEmail@ssw.com.au',
        number: 12345
      },
      {
        name: 'Fake Company B',
        email: 'fakeEmail@ssw.com.au',
        number: 12345
      }
    ]));
    component.ngOnInit();
    component.companiesCount$.subscribe(c => {
      expect(c).toEqual(2);
    });
  });

});

describe('testbed Tests', () => {

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let companySvc: CompanyService;
  let de: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CompanyListComponent,   // Our routing module needs it
        CompanyTableComponent,  // Our routing module needs it
        CompanyEditComponent,   // Our routing module needs it
      ],
      imports: [
        AppRoutingModule, // Routerlink in AppComponent needs it
        HttpClientModule,
        ReactiveFormsModule
      ],
      providers: [{provide: APP_BASE_HREF, useValue: '/'}]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    companySvc = TestBed.get(CompanyService);
  });


  it(`companyCount = 1`, () => {
    spyOn(companySvc, 'getCompanies').and.returnValue(of([
      {
        name: 'Fake Company C',
        email: 'fakeEmail@ssw.com.au',
        number: 12345
      }
    ]));
    fixture.detectChanges();

    expect(component.companiesCount$.subscribe(c => {
      expect(c).toEqual(1);
    }));
  });

  it(`CompanyCount HTML should update`, () => {
    spyOn(companySvc, 'getCompanies').and.returnValue(of([
      {
        name: "Fake Company C",
        email: "fakeEmail@ssw.com.au",
        number: 12345
      }
    ]));
    fixture.detectChanges();

    let el = fixture.debugElement.query(By.css('#company-count')).nativeElement;

    expect(el.textContent).toEqual('1');
  });


});

