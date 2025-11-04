import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dish {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

@Injectable({
  providedIn: 'root',
})
export class DishService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getDishes(categoryId: string): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/categories/${categoryId}/dishes`);
  }

  getDish(categoryId: string, dishId: string): Observable<Dish> {
    return this.http.get<Dish>(`${this.apiUrl}/categories/${categoryId}/dishes/${dishId}`);
  }

  createDish(categoryId: string, data: Partial<Dish>): Observable<Dish> {
    return this.http.post<Dish>(`${this.apiUrl}/categories/${categoryId}/dishes`, data);
  }

  updateDish(categoryId: string, dishId: string, data: Partial<Dish>): Observable<Dish> {
    return this.http.put<Dish>(`${this.apiUrl}/categories/${categoryId}/dishes/${dishId}`, data);
  }

  deleteDish(categoryId: string, dishId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/categories/${categoryId}/dishes/${dishId}`);
  }
}
