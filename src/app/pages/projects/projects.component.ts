import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  loading = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loading = true;

    // Subscribe to resolver data changes
    this.route.data.subscribe((data: Data) => {
      this.projects = data['projectsData']?.list || [];
      this.loading = false;
    });
  }
}
