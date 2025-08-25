import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEquipes } from './user-equipes';

describe('UserEquipes', () => {
  let component: UserEquipes;
  let fixture: ComponentFixture<UserEquipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEquipes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEquipes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
