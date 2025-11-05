import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { ProposalService } from '../../services/proposal.service';
import { DishService } from '../../../menu-admin/services/dish.service';
import { CategoryService } from '../../../menu-admin/services/category.service';

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {
  functionId: string = '';
  currentProposal: any;
  masterDishes: any[] = [];
  filteredDishes: any[] = [];
  categories: any[] = [];
  proposalForm: FormGroup;
  newSectionForm: FormGroup;
  connectedDropLists: string[] = ['master-dish-list'];

  constructor(
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private dishService: DishService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.proposalForm = this.fb.group({ name: ['', Validators.required] });
    this.newSectionForm = this.fb.group({ title: ['', Validators.required] });
  }

  ngOnInit(): void {
    this.functionId = this.route.snapshot.paramMap.get('functionId')!;
    this.loadMasterLists();
    this.loadOrCreateProposal();
  }

  loadMasterLists() {
    this.dishService.getDishes().subscribe(data => { this.masterDishes = data; this.filteredDishes = data; });
    this.categoryService.getCategories().subscribe(data => this.categories = data);
  }

  loadOrCreateProposal() {
    this.proposalService.getProposalsForFunction(this.functionId).subscribe(proposals => {
      if (proposals && proposals.length > 0) {
        this.currentProposal = proposals[0];
        this.setupProposalForms();
      } else {
        this.proposalService.createProposal(this.functionId, { name: 'New Proposal' }).subscribe(newProposal => {
          this.currentProposal = newProposal;
          this.setupProposalForms();
        });
      }
    });
  }

  setupProposalForms() {
    this.proposalForm.patchValue({ name: this.currentProposal.name });
    this.buildConnectedDropLists();
  }

  onCategoryFilterChange(event: Event) {
    const categoryId = (event.target as HTMLSelectElement).value;
    if (categoryId) {
      this.filteredDishes = this.masterDishes.filter(dish => dish.category === categoryId);
    } else {
      this.filteredDishes = this.masterDishes;
    }
  }

  onAddSection() {
    if (this.newSectionForm.invalid || !this.currentProposal) return;
    const newSection = { title: this.newSectionForm.value.title, items: [] };
    this.currentProposal.menuSections.push(newSection);
    this.newSectionForm.reset();
    this.buildConnectedDropLists();
    this.onSaveProposal();
  }

  buildConnectedDropLists() {
    this.connectedDropLists = ['master-dish-list'];
    this.currentProposal.menuSections.forEach((s: any, index: number) => {
      this.connectedDropLists.push(`section-list-${index}`);
    });
  }

  onSaveProposal() {
    if (!this.currentProposal) return;
    const proposalData = {
      name: this.proposalForm.value.name,
      menuSections: this.currentProposal.menuSections
    };
    this.proposalService.updateProposal(this.currentProposal._id, proposalData).subscribe(res => {
      console.log('Proposal Saved!', res);
    });
  }

  onRemoveItem(section: any, itemIndex: number) {
    section.items.splice(itemIndex, 1);
    this.onSaveProposal();
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (event.previousContainer.id === 'master-dish-list') {
      const dish = event.previousContainer.data[event.previousIndex];
      const dishSnapshot = {
        dishId: dish._id,
        name: dish.name,
        description: dish.description,
        images: dish.images
      };
      event.container.data.splice(event.currentIndex, 0, dishSnapshot);
    } else if (event.container.id === 'master-dish-list') {
      event.previousContainer.data.splice(event.previousIndex, 1);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.onSaveProposal();
  }
}
