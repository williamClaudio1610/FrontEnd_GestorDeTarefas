import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteTailwind } from './teste-tailwind';

describe('TesteTailwind', () => {
  let component: TesteTailwind;
  let fixture: ComponentFixture<TesteTailwind>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteTailwind]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TesteTailwind);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
