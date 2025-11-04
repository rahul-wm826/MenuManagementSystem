import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishManagement } from './dish-management';

describe('DishManagement', () => {
  let component: DishManagement;
  let fixture: ComponentFixture<DishManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
