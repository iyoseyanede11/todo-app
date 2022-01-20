import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TodoDto } from 'src/app/dtos/todo.dto';
import { Todo } from 'src/app/interfaces/todo.interface';
import { DataSubjectService } from 'src/app/services/data-subjects.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {

  constructor(private dataSubjectService: DataSubjectService) { }

  todoList: Todo[]
  selectedTodo: Todo
  todoListSubcription: Subscription

  //method is called on initialization of the component
  ngOnInit(): void {
    // checks if todolist exists in localstorage, if it doesn't it subscribes to the 
    // todo subject in the dataSubjectService and set todoList to the value emitted,
    // if it does exist in the localStorage then set todoList to parsed value
    !localStorage.getItem('todoList') ? 
    this.todoListSubcription = this.dataSubjectService.todoSubject.subscribe( response => this.todoList = response)
    : this.todoList = JSON.parse(localStorage.getItem('todoList'))
  }

  //method that updates the status of the todo item
  updateTodo = (todoId: number) => {
   this.selectedTodo = this.todoList.find(todo => todo.id == todoId) //finds the todo item with its ID
   this.selectedTodo.isCompleted = !this.selectedTodo.isCompleted // sets its status to the opposite of its previous state
   this.dataSubjectService.updateTodoList(this.todoList) // calls the update todo list method in order for the todo list behaviour subject to emit a new value
  }

  //method that adds a todo item
  addTodo = (event: any) => {
    let todo = new TodoDto();
    todo = {
      id: this.generateID(),
      description: event.target.value,
      isCompleted:false
    }
    this.todoList.push(todo) // pushes the new todo object to the todoList array
    this.dataSubjectService.updateTodoList(this.todoList); // calls the update todo list method in order for the todo list behaviour subject to emit a new value
   (document.getElementById('text-field') as HTMLInputElement).value = '' // resets the form field
  }

  //method that deletes a todo item
  removeTodo = (todoId: number) => {
    let index = this.todoList.findIndex(todo => todo.id == todoId) //finds the index of the todo
    this.todoList.splice(index, 1) // deletes the todo via its index
    this.dataSubjectService.updateTodoList(this.todoList) // calls the update todo list method in order for the todo list behaviour subject to emit a new value
  }

  //returns a random integer 5 digits long
  generateID = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };

  //method that helps unsubscribe from the observable if it exists on destruction of the component (this is to help avoid memory leaks)
  ngOnDestroy(): void {
    if(this.todoListSubcription)
      this.todoListSubcription.unsubscribe()
  }

}
