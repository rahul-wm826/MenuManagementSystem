import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss', '../../../menu-admin/admin-layout.scss']
})
export class EventDetailComponent implements OnInit {
  event: any;
  eventId: string = '';
  functions: any[] = [];
  functionForm: FormGroup;
  editingFunctionId: string | null = null;
  functionTypes = ['Breakfast', 'Lunch', 'Dinner', 'Hi-Tea', 'Cocktail', 'Other'];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.functionForm = this.fb.group({
      name: ['', Validators.required],
      type: ['Lunch', Validators.required],
      approxGuests: [0],
      description: ['']
    });
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.loadEvent();
    this.loadFunctions();
  }

  loadEvent() {
    this.eventService.getEventById(this.eventId).subscribe(data => this.event = data);
  }

  loadFunctions() {
    this.eventService.getFunctionsForEvent(this.eventId).subscribe(data => this.functions = data);
  }

  onFunctionSubmit() {
    if (!this.functionForm.valid) return;
    const formData = this.functionForm.value;
    if (this.editingFunctionId) {
      this.eventService.updateFunction(this.editingFunctionId, formData).subscribe(() => this.resetFormAndReload());
    } else {
      this.eventService.createFunction(this.eventId, formData).subscribe(() => this.resetFormAndReload());
    }
  }

  onEditFunction(func: any) {
    this.editingFunctionId = func._id;
    this.functionForm.patchValue(func);
  }

  onDeleteFunction(id: string) {
    if (confirm('Are you sure?')) {
      this.eventService.deleteFunction(id).subscribe(() => this.loadFunctions());
    }
  }

  resetFormAndReload() {
    this.editingFunctionId = null;
    this.functionForm.reset({ type: 'Lunch' });
    this.loadFunctions();
  }
}
