import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VcustomizerComponent } from './vcustomizer.component';

describe('VcustomizerComponent', () => {
  let component: VcustomizerComponent;
  let fixture: ComponentFixture<VcustomizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VcustomizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VcustomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
