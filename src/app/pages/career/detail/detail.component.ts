import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  careerFormData!: FormGroup;
  currentStep = 0;
  loading = true;
  slug: any;
  openingDetail: any;
  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private apiService: ApiService) {}

  // Define fields per step (must match control names in the form)
  readonly stepFields: string[][] = [
    // 1
    ['name','preferred_name','email','dob','contact_no','city','country'],
    // 2
    ['institution_name','degree_program','expected_grad_year','achievements'],
    // 3
    ['why_join','what_to_learn','inspiration','preferred_duration','preferred_start_date','academic_curriculum','curriculum_explain'],
    // 4
    ['portfolio_file','website_url','software_proficiency','sketching_level'],
    // 5
    ['work_style','studio_excites','competitions'],
    // 6
    ['resume_file','recommendation_file']
  ];

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';

    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';

      this.apiService.getopeningsDetails(this.slug).subscribe({
        next: (res) => {
          this.openingDetail = res.list[0] || res;
          console.log(this.openingDetail);
          console.log(this.openingDetail.id);
          this.loading = false;
        },
        error: (err) => console.error('Error fetching openings:', err),
      });
    });

    this.careerFormData = this.fb.group({ 
      name: ['', Validators.required],
      preferred_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      contact_no: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      city: ['', Validators.required],
      country: ['', Validators.required],
      opening_id: [null, Validators.required],

      institution_name: ['', Validators.required],
      degree_program: ['', Validators.required],
      expected_grad_year: ['', Validators.required],
      achievements: ['', Validators.required],

      why_join: ['', Validators.required],
      what_to_learn: ['', Validators.required],
      inspiration: ['', Validators.required],
      preferred_duration: ['', Validators.required],
      preferred_start_date: ['', Validators.required],
      academic_curriculum: ['', Validators.required],
      curriculum_explain: ['', Validators.required],

      portfolio_file: ['', Validators.required],
      website_url: ['', Validators.required],

      // ✅ checkbox group
      software_proficiency: this.fb.group({
        autocad: [0],
        rhino: [0],
        sketchup: [0],
        revit: [0],
        adobe: [0],
        lumion: [0],
        other: ['']
      }),

      sketching_level: ['', Validators.required],

      work_style: ['', Validators.required],
      studio_excites: ['', Validators.required],
      competitions: ['', Validators.required],

      resume_file: ['', Validators.required],
      recommendation_file: ['', Validators.required],
    });
  }

  toggleCheckbox(controlName: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const group = this.careerFormData.get('software_proficiency') as FormGroup;
    group.get(controlName)?.setValue(input.checked ? 1 : 0);
  }

  get c(): { [key: string]: AbstractControl } {
    return this.careerFormData.controls;
  }

  // Attach this to <input type="file"> (change) event
  onFileChange(controlName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.careerFormData.get(controlName)?.setValue(file);
      this.careerFormData.get(controlName)?.markAsDirty();
      this.careerFormData.get(controlName)?.updateValueAndValidity();
    }
  }

  isControlInvalid(name: string): boolean {
    const ctrl = this.careerFormData.get(name);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  private validateStep(stepIndex: number): boolean {
    const fields = this.stepFields[stepIndex] || [];
    let valid = true;
    fields.forEach(name => {
      const ctrl = this.careerFormData.get(name);
      if (ctrl) {
        ctrl.markAsTouched();
        ctrl.updateValueAndValidity();
        if (ctrl.invalid) valid = false;
      }
    });
    return valid;
  }

  private getFirstInvalidStep(): number {
    for (let i = 0; i < this.stepFields.length; i++) {
      const fields = this.stepFields[i];
      const anyInvalid = fields.some(n => this.careerFormData.get(n)?.invalid);
      if (anyInvalid) return i;
    }
    return -1;
  }

  nextStep(): void {
    if (this.validateStep(this.currentStep)) {
      this.currentStep = Math.min(this.currentStep + 1, this.stepFields.length - 1);
    } else {
      // optionally scroll to first invalid control here
    }
  }

  prevStep(): void {
    this.currentStep = Math.max(this.currentStep - 1, 0);
  }

  submit(): void {
    // Ensure current step is valid first
    if (!this.validateStep(this.currentStep)) return;

    if (!this.openingDetail.id) return;
    this.careerFormData.patchValue({ opening_id: this.openingDetail.id });

    this.careerFormData.markAllAsTouched();
    if (this.careerFormData.invalid) {
      const idx = this.getFirstInvalidStep();
      if (idx >= 0) this.currentStep = idx;
      return;
    }

    // Helper: format to YYYY-MM-DD
    const formatDate = (val: any): string => {
      if (!val) return '';

      const d = new Date(val);

      if (isNaN(d.getTime())) {
        // if it's already in YYYY-MM-DD string, just return it
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (regex.test(val)) return val;
        return '';
      }

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // ensure 2 digits
      const day = String(d.getDate()).padStart(2, '0');        // ensure 2 digits

      return `${year}-${month}-${day}`;
    };

    // Build FormData for files + fields
    const formData = new FormData();
    Object.keys(this.careerFormData.controls).forEach(key => {
      let val = this.careerFormData.get(key)?.value;

      // ✅ format specific date fields
      if (['dob', 'preferred_start_date', 'expected_grad_year'].includes(key)) {
        val = formatDate(val);
      }

      if (key === 'software_proficiency' && val && typeof val === 'object') {
        val = JSON.stringify(val); 
      }

      if (val instanceof File) {
        formData.append(key, val, val.name);
      } else {
        formData.append(key, val);
      }
    });

    // Debugging
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // POST to your API endpoint
    this.apiService.careerInq(formData).subscribe({
      next: (res) => {
        console.log('Submitted', res);
      },
      error: (err) => {
        console.error('Submit failed', err);
      }
    });
  }

}
