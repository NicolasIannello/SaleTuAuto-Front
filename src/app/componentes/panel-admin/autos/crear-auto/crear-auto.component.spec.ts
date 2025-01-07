import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAutoComponent } from './crear-auto.component';

describe('CrearAutoComponent', () => {
  let component: CrearAutoComponent;
  let fixture: ComponentFixture<CrearAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearAutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
