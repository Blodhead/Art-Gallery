import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkshopsComponent } from './my-workshops.component';

describe('MyWorkshopsComponent', () => {
  let component: MyWorkshopsComponent;
  let fixture: ComponentFixture<MyWorkshopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyWorkshopsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyWorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
