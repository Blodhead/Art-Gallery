import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyParfumesComponent } from './my-parfumes.component';

describe('MyParfumesComponent', () => {
  let component: MyParfumesComponent;
  let fixture: ComponentFixture<MyParfumesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyParfumesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyParfumesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
