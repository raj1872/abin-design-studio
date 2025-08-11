import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListSvgComponent } from './project-list-svg.component';

describe('ProjectListSvgComponent', () => {
  let component: ProjectListSvgComponent;
  let fixture: ComponentFixture<ProjectListSvgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectListSvgComponent]
    });
    fixture = TestBed.createComponent(ProjectListSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
