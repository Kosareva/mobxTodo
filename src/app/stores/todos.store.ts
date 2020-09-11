import { action, autorun, comparer, computed, observable, reaction, toJS, when } from 'mobx';
import { Injectable } from '@angular/core';

export class Todo {
  @observable completed = false;
  @observable title: string;

  constructor({ title, completed }) {
    this.completed = completed;
    this.title = title;
  }

  @action setCompleted(value): void {
    this.completed = value;
  }
}

@Injectable()
export class Todos {
  @observable todos = [];
  @observable filter = 'SHOW_ALL';

  constructor() {
    this.localStorageSync();

    // TODO: @computed and getter comparison
    // setInterval(() => {
    //   const allComplete = this.allComplete;
    //   const filteredTodosLength = this.filteredTodosLength;
    // }, 1000);

    // reaction(
    //   () => this.filteredTodosLength,
    //   () => {}
    // );

    // TODO: autorun
    // autorun((reaction) => {
    //   console.log('left to complete: ' + this.uncompletedItems);
    //   if (this.allComplete && this.todos.length) {
    //     console.log('all are completed!');
    //     reaction.dispose();
    //   }
    // });

    // TODO: when
    // this.trackCompletion();
  }

  async trackCompletion(): Promise<void> {
    when(
      () => this.todos.length > 0 && !this.uncompletedItems,
      () => console.log('All are completed with "when"')
    );
    // or
    // TODO: when promise
    // await when(() => this.todos.length > 0 && !this.uncompletedItems);
    // console.log('All are completed with "when promise"');
  }

  @action addTodo({ title, completed = false }): void {
    this.todos.push(new Todo({ title, completed }));
  }

  @action removeTodo(todo): void {
    const index = this.todos.indexOf(todo);
    this.todos.splice(index, 1);
  }

  @action showAll(): void {
    this.filter = 'SHOW_ALL';
  }

  @action showCompleted(): void {
    this.filter = 'COMPLETED';
  }

  @action showActive(): void {
    this.filter = 'ACTIVE';
  }

  @action clearCompleted(): void {
    this.todos = this._filter(this.todos, 'ACTIVE');
  }

  @action setCompleteAll(value): void {
    this.todos.forEach(todo => todo.setCompleted(value));
  }

  // TODO: computed comparers
  @computed({ equals: comparer.structural }) get filteredTodos(): any[] {
    return this.filter !== 'SHOW_ALL'
      ? this._filter(this.todos, this.filter)
      : this.todos;
  }

  @computed get uncompletedItems(): number {
    return this._filter(this.todos, false).length;
  }

  // TODO: computed
  @computed get allComplete(): boolean {
    // console.log('get allComplete');
    return this.uncompletedItems === 0;
  }

  // TODO: computed used as getter
  @computed get filteredTodosLength(): number {
    console.log('get filteredTodosLength');
    return this.filteredTodos.length;
  }

  private _filter(todos, value): any[] {
    return todos.filter(todo =>
      value === 'COMPLETED' ? todo.completed : !todo.completed
    );
  }

  private localStorageSync(): void {
    const initialTodos = JSON.parse(localStorage.todos || '[]');
    this.todos = initialTodos.map(todo => new Todo(todo));
    this.filter = JSON.parse(localStorage.filter || '"SHOW_ALL"');

    autorun(() => {
      localStorage.todos = JSON.stringify(toJS(this.todos));
      localStorage.filter = JSON.stringify(toJS(this.filter));
    });
  }
}

// TODO: alternative way to decorate class members
// decorate(Todos, {
//   todos: observable,
// });
