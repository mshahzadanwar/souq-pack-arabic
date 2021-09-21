import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenblockerComponent } from './screenblocker.component';

describe('ScreenblockerComponent', () => {
  let component: ScreenblockerComponent;
  let fixture: ComponentFixture<ScreenblockerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenblockerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenblockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
