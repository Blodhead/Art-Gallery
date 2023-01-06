import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrganizerComponent } from './user-organizer.component';

describe('UserOrganizerComponent', () => {
  let component: UserOrganizerComponent;
  let fixture: ComponentFixture<UserOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOrganizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
