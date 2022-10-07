import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteInputComponent } from './invite-input.component';

describe('DatepickerComponent', () => {
  let component: InviteInputComponent;
  let fixture: ComponentFixture<InviteInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
