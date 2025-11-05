import { Component } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [DragDropModule, CommonModule, ReactiveFormsModule],
  templateUrl: './builder.component.html',
  styleUrl: './builder.component.css'
})
export class ProposalBuilderComponent {

}
