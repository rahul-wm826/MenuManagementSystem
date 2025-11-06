import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dish {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    name: string;
  };
  images: string[];
}

@Injectable({
  providedIn: 'root',
})
export class DishService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAllDishes() {
    return this.http.get<Dish[]>(`${this.apiUrl}/dishes`);
  }
  
  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/dishes`);
  }

  getDish(dishId: string): Observable<Dish> {
    return this.http.get<Dish>(`${this.apiUrl}/dishes/${dishId}`);
  }

  createDish(data: Partial<Dish>): Observable<Dish> {
    return this.http.post<Dish>(`${this.apiUrl}/dishes`, data);
  }

  updateDish(dishId: string, data: Partial<Dish>): Observable<Dish> {
    return this.http.put<Dish>(`${this.apiUrl}/dishes/${dishId}`, data);
  }

  deleteDish(dishId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/dishes/${dishId}`);
  }
}
