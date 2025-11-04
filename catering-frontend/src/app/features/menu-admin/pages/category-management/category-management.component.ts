import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss',
})
export class CategoryManagementComponent implements OnInit {
  categories = signal<any[]>([]);
  categoryForm: FormGroup;
  editingCategoryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories.set(data);
    });
  }

  onSubmit() {
    if (!this.categoryForm.valid) return;

    const formData = this.categoryForm.value;

    if (this.editingCategoryId) {
      this.categoryService.updateCategory(this.editingCategoryId, formData).subscribe(() => {
        this.resetFormAndReload();
      });
    } else {
      this.categoryService.createCategory(formData).subscribe(() => {
        this.resetFormAndReload();
      });
    }
  }

  onEdit(category: any) {
    this.editingCategoryId = category._id;
    this.categoryForm.patchValue(category);
  }

  onDelete(id: string) {
    if (confirm('Are you sure?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  resetFormAndReload() {
    this.editingCategoryId = null;
    this.categoryForm.reset();
    this.loadCategories();
  }
}
