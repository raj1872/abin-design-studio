import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: { normal: string; hover: string }[] = [];

  ngOnInit(): void {
    this.projects = [
      {
        normal: './assets/images/projects/listing-1.png',
        hover: './assets/images/projects/listing-hover-1.png'
      },
      {
        normal: './assets/images/projects/listing-2.png',
        hover: './assets/images/projects/listing-2.png'
      },
      {
        normal: './assets/images/projects/listing-3.png',
        hover: './assets/images/projects/listing-3.png'
      },
      {
        normal: 'https://dummyimage.com/700x700/000/000',
        hover: 'https://dummyimage.com/700x700/4C4C4C/4C4C4C'
      },
      {
        normal: 'https://dummyimage.com/700x700/000/000',
        hover: 'https://dummyimage.com/700x700/4C4C4C/4C4C4C'
      },
      {
        normal: 'https://dummyimage.com/700x700/000/000',
        hover: 'https://dummyimage.com/700x700/4C4C4C/4C4C4C'
      },
      {
        normal: 'https://dummyimage.com/700x700/000/000',
        hover: 'https://dummyimage.com/700x700/4C4C4C/4C4C4C'
      },
      {
        normal: 'https://dummyimage.com/700x700/000/000',
        hover: 'https://dummyimage.com/700x700/4C4C4C/4C4C4C'
      }
    ];
  }
}
