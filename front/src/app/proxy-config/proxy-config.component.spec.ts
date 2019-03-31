import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxyConfigComponent } from './proxy-config.component';

describe('ProxyConfigComponent', () => {
  let component: ProxyConfigComponent;
  let fixture: ComponentFixture<ProxyConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProxyConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
