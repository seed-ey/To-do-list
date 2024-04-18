import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { ITask } from './model/task';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl= 'http://localhost:3000/tasks'
  constructor(
    private http: HttpClient,
  ) { }
  updateTask(taskId: number, updatedTask: ITask): Observable<any> {
    const url = `${this.apiUrl}/${taskId}`;
    console.log(url, updatedTask)
    return this.http.put<any>(url, updatedTask);
  }

  addTask(task: ITask): Observable<ITask> {
    return this.http.post<ITask>(this.apiUrl, task);
  }
  
   getAllTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.apiUrl);
  }

  getTasksByUserId(userId: string): Observable<ITask[]> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.get<ITask[]>(url);
  }
  
  onEdit(id: number, updateTask: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.updateTask);
  
  }
  // deleteTask(id: number) {
  //   return this.http.delete<any>(`${this.apiUrl}/${id}`)
  // }
  deleteTask(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
