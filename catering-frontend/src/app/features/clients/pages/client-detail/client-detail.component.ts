import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { EventService } from '../../../events/services/event.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.scss']
})
export class ClientDetailComponent implements OnInit {
  client= signal<any>(null);
  clientId: string = '';
  clientEvents = signal<any[]>([]);
  eventForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      status: ['Potential', Validators.required]
    });
  }

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('id')!;
    this.loadClient();
    this.loadEvents();
  }

  loadClient() {
    this.clientService.getClientById(this.clientId).subscribe(data => this.client.set(data));
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(allEvents => {
      console.log(this.clientId);
      this.clientEvents.set(allEvents.filter((event: any) => event.clientId._id === this.clientId));
    });
  }

  onEventSubmit() {
    if (!this.eventForm.valid) return;
    const eventData = { ...this.eventForm.value, clientId: this.clientId };
    this.eventService.createEvent(eventData).subscribe(() => {
      this.eventForm.reset({ status: 'Potential' });
      this.loadEvents();
    });
  }
}
