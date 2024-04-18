import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ITask } from '../model/task';
import { ServiceService } from '../todoservice.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todoForm!: FormGroup;
  tasks: ITask[] = [];
  tempTasks: ITask[] = [];
  pending: ITask[] = [];
  inProgress: ITask[] = [];
  done: ITask[] = [];
  filteredTasks: ITask[] = [];
  searchText: string = '';
  pendingString: string = 'pending';
  openString: string = 'open';
  inProgressString: string = 'inProgress';
  completedString: string = 'completed'
  sortBy: string = 'dueDate';

  updateIndex: number | undefined;
  isEditEnabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskService: ServiceService

  ) { }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: [''],
      description: [''],
      dueDate: ['']
    });
    this.getAllTasks();

  }

  getAllTasks(): void {
    this.taskService.getTasksByUserId(this.getUserId()).subscribe(tasks => {
      this.tasks = tasks;
      this.tempTasks = this.tasks;
      this.performSearch("");
    });
  }

  getUserId(): string {
    const storedUserJSON = localStorage.getItem("user");
    if (storedUserJSON) {
      const storedUser = JSON.parse(storedUserJSON);
      const { id } = storedUser;
      return id;
    } else { return "" }
  }
  addTask(): void {

    const newTask: ITask = {
      id: undefined,
      item: this.todoForm.value.item,
      description: this.todoForm.value.description,
      dueDate: this.todoForm.value.dueDate,
      status: 'open',
      userId: this.getUserId()
    };

    this.taskService.addTask(newTask).subscribe((task: ITask) => {
      this.tasks.push(task);
      this.todoForm.reset();
    });
  }

  performSearch(searchQuery: string): void {
    if (this.searchText.trim() === "") {
      this.tasks = this.tempTasks;
    } else {
      this.filteredTasks = this.tasks.filter(tasks =>
        tasks.item.toLowerCase().includes(this.searchText.toLowerCase()) ||
        tasks.description.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.tasks = this.filteredTasks;
    }
  }
  onSearchChange(searchQuery: string): void {
    this.performSearch(searchQuery);
  }
  onEdit(item: ITask, i: number): void {
    this.todoForm.patchValue(item);
    this.updateIndex = i;
    this.isEditEnabled = true;
  }
  updateTask(): void {
    if (this.updateIndex !== undefined) {
      const updatedTask: ITask = this.todoForm.value;
      if (this.tasks[this.updateIndex] !== undefined && this.tasks[this.updateIndex].id !== undefined) {
        const taskId = this.tasks[this.updateIndex].id;
        if (taskId !== undefined) {
          updatedTask.userId = this.getUserId();
          this.taskService.updateTask(taskId, updatedTask)
            .subscribe(
              (response) => {
              },
              (error) => {
                console.error(`Failed to update task with ID ${taskId}.`, error);
              });
        };

        updatedTask.id = taskId;

        this.tasks[this.updateIndex] = updatedTask;
        this.isEditEnabled = false;
        this.todoForm.reset();
      } else {
        console.error(`Task ID at index ${this.updateIndex} is undefined.`);
      }
    }
  }
  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== id);
      alert("Delete successfully!!");

    });
  }

  deleteInProgressTask(i: number): void {
    this.inProgress.splice(i, 1);
  }

  deleteDoneTask(i: number): void {
    this.done.splice(i, 1);
  }

  deletePendingTask(i: number): void {
    this.pending.splice(i, 1);
  }

  drop(status:string,event: CdkDragDrop<ITask[]>): void {
    if (event.previousContainer === event.container) {
      
       
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {console.log(event);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
  console.log(event.container.data)
   if(event.container.data[0].id!=undefined){
   event.container.data[0].status = status;
   this.taskService.updateTask(event.container.data[0].id, event.container.data[0])
   }
    }
  }
}
