import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Todo } from "../interfaces/todo.interface";

@Injectable({
    providedIn: 'root'
})
export class DataSubjectService{
    constructor(){}

    todoList: Todo[] = [
        {id: 1 , isCompleted: false,description: 'Make coffee' },
        {id: 2 , isCompleted: false,description: 'Get Groceries' },
        {id: 3, isCompleted: false,description: 'Read an article' },
        {id: 4 , isCompleted: false,description: 'Go Shopping' },
    ] // setting the initial value of the todo list
    todoSubject = new BehaviorSubject(this.todoList) // behaviour subject definition and initialization, any component in this application can subscribe to the values emitted from this behaviour subject

    //method that calls .next on the todo behaviour subject when it recieves a new update and also updates local storage
    updateTodoList(update: Todo[]){
        this.todoList = update;
        this.todoSubject.next(this.todoList)
        localStorage.setItem('todoList', JSON.stringify(this.todoList))
    }
}