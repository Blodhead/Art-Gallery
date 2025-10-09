import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParfumeComponent } from './parfume.component';

describe('ParfumeComponent', () => {
  let component: ParfumeComponent;
  let fixture: ComponentFixture<ParfumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParfumeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParfumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
