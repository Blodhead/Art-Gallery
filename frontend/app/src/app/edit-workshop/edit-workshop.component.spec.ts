import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkshopComponent } from './edit-workshop.component';

describe('EditWorkshopComponent', () => {
  let component: EditWorkshopComponent;
  let fixture: ComponentFixture<EditWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWorkshopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
