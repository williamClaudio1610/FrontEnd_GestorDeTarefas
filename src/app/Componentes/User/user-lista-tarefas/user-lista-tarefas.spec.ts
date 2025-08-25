import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListaTarefasComponent } from './user-lista-tarefas';

describe('UserListaTarefasComponent', () => {
  let component: UserListaTarefasComponent;
  let fixture: ComponentFixture<UserListaTarefasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListaTarefasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListaTarefasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
