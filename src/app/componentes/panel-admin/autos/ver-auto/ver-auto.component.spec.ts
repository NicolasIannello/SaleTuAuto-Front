import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAutoComponent } from './ver-auto.component';

describe('VerAutoComponent', () => {
  let component: VerAutoComponent;
  let fixture: ComponentFixture<VerAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerAutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
