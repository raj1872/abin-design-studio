import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // ✅ Import this

import { AppRoutingModule } from './app-routing.module';
import { SwiperModule } from 'swiper/angular';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FullPageLoaderComponent } from './core/full-page-loader/full-page-loader.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { LandingComponent } from './pages/landing/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FullPageLoaderComponent,
    LandingComponent,
    HomeComponent,
    ProjectsComponent,
    ProjectDetailComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,       // ✅ Needed for routerLink / routerLinkActive
    SwiperModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
