import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { LandingComponent } from './pages/landing/landing.component';
import { OurStudioComponent } from './pages/our-studio/our-studio.component';
import { TeamComponent } from './pages/team/team.component';
import { ProjectListSvgComponent } from './pages/project-list-svg/project-list-svg.component';
import { PublicationsComponent } from './pages/publications/publications.component';
import { NewsComponent } from './pages/news/news.component';
import { NewsDetailComponent } from './pages/news-detail/news-detail.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects-svg', component: ProjectListSvgComponent },
  { path: 'publications', component: PublicationsComponent },
  { path: 'news', component: NewsComponent },
  { path: 'news-detail', component: NewsDetailComponent },
  { path: 'studio', component: OurStudioComponent },
  { path: 'our-team', component: TeamComponent },
  { path: 'project-detail', component: ProjectDetailComponent }, // ✅ static route
  { path: '**', redirectTo: '', pathMatch: 'full' }, // ✅ ensure full match for wildcard
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking', // ✅ Required for Angular Universal SSR
      scrollPositionRestoration: 'enabled', // ✅ Scroll to top on route change
      anchorScrolling: 'enabled', // ✅ Scroll to anchors if present in URL
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
