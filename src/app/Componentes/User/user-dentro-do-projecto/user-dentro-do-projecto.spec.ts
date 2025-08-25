import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDentroDoProjecto } from './user-dentro-do-projecto';

describe('UserDentroDoProjecto', () => {
  let component: UserDentroDoProjecto;
  let fixture: ComponentFixture<UserDentroDoProjecto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDentroDoProjecto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDentroDoProjecto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
