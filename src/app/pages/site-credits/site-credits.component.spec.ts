import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCreditsComponent } from './site-credits.component';

describe('SiteCreditsComponent', () => {
  let component: SiteCreditsComponent;
  let fixture: ComponentFixture<SiteCreditsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteCreditsComponent]
    });
    fixture = TestBed.createComponent(SiteCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
