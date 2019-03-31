import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxyAddPopupComponent } from './proxy-add-popup.component';

describe('ProxyAddPopupComponent', () => {
  let component: ProxyAddPopupComponent;
  let fixture: ComponentFixture<ProxyAddPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProxyAddPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxyAddPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
