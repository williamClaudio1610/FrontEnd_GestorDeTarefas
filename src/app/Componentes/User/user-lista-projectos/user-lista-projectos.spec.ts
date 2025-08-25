import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListaProjectosComponent } from './user-lista-projectos';

describe('UserListaProjectosComponent', () => {
  let component: UserListaProjectosComponent;
  let fixture: ComponentFixture<UserListaProjectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListaProjectosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListaProjectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
