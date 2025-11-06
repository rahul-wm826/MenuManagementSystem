import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.scss', '../../../menu-admin/admin-layout.scss']
})
export class ClientManagementComponent implements OnInit {
  clients: any[] = [];
  clientForm: FormGroup;
  editingClientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      contactPerson: [''],
      email: [''],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(data => this.clients = data);
  }

  onSubmit(): void {
    if (!this.clientForm.valid) return;
    const formData = this.clientForm.value;
    if (this.editingClientId) {
      this.clientService.updateClient(this.editingClientId, formData).subscribe(() => this.resetFormAndReload());
    } else {
      this.clientService.createClient(formData).subscribe(() => this.resetFormAndReload());
    }
  }

  onEdit(client: any): void {
    this.editingClientId = client._id;
    this.clientForm.patchValue(client);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure?')) {
      this.clientService.deleteClient(id).subscribe(() => this.loadClients());
    }
  }

  resetFormAndReload(): void {
    this.editingClientId = null;
    this.clientForm.reset();
    this.loadClients();
  }
}
