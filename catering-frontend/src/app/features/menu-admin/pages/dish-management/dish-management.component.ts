import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Dish, DishService } from '../../services/dish.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-dish-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dish-management.component.html',
  styleUrls: ['./dish-management.component.scss', '../../admin-layout.scss']
})
export class DishManagementComponent implements OnInit {
  dishes: WritableSignal<Dish[]> = signal([]);
  categories: WritableSignal<any[]> = signal([]);
  dishForm: FormGroup;
  editingDish: Dish | null = null;

  constructor(
    private fb: FormBuilder,
    private dishService: DishService,
    private categoryService: CategoryService
  ) {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: [''], // For simplicity, a single image URL
    });
  }

  ngOnInit(): void {
    this.loadCategoriesAndDishes();
  }

  loadCategoriesAndDishes(): void {
    // Fetch categories
    this.categoryService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });

    // Fetch dishes
    this.dishService.getDishes().subscribe(dishes => {
      this.dishes.set(dishes);
    });
  }

  onSubmit(): void {
    if (!this.dishForm.valid) return;

    const formData = {
      name: this.dishForm.value.name,
      description: this.dishForm.value.description,
      price: this.dishForm.value.price,
      category: this.dishForm.value.category,
      images: this.dishForm.value.image ? [this.dishForm.value.image] : []
    };

    if (this.editingDish) {
      const categoryId = this.editingDish.category;
      this.dishService.updateDish(this.editingDish._id, formData).subscribe(() => this.resetFormAndReload());
    } else {
      const categoryId = this.dishForm.value.category;
      this.dishService.createDish(formData).subscribe(() => this.resetFormAndReload());
    }
  }

  onEdit(dish: Dish): void {
    this.editingDish = dish;
    this.dishForm.patchValue({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      image: dish.images?.[0] || ''
    });
  }

  onDelete(dish: Dish): void {
    if (confirm('Are you sure you want to delete this dish?')) {
      this.dishService.deleteDish(dish._id).subscribe(() => this.loadCategoriesAndDishes());
    }
  }

  resetFormAndReload(): void {
    this.editingDish = null;
    this.dishForm.reset({
      price: 0,
      category: ''
    });
    this.loadCategoriesAndDishes();
  }
}
