import { ChangeDetectionStrategy, Component } from '@angular/core';
import { action, observable } from 'mobx-angular';
import { Todos } from './stores/todos.store';
import { intercept, reaction, runInAction } from 'mobx';

@Component({
  // TODO: mobx works good with OnPush change detection strategy
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  template: `
    <div *mobxAutorun>
      <h1>{{header.app}}</h1>
      <h2>{{header.framework}}</h2>
      <h3 *ngIf="header.mobx">{{header.mobx}}</h3>
      <button (click)="toggleFramework()">Toggle framework</button>
      <button (click)="toggleHeaderToAngular()">Toggle header to Angular</button>
      <button (click)="toggleHeader()">Toggle header</button>
      <button (click)="toggleHeaderAsync()">Toggle header async</button>
      <button (click)="setHeaderMobx()">Set header mobx</button>
      <div class="mb10"></div>
      <section class="todoapp">
        <header class="header">
          <form name="new-todo" class="todo-form" (submit)="addTodo()">
            <!-- TODO: enforce action 1-->
            <input
              class="new-todo"
              name="title"
              placeholder="What needs to be done?"
              [ngModel]="title"
              (ngModelChange)="setTitle($event)"
              autofocus
            />
          </form>
        </header>
        <app-section></app-section>
        <app-footer></app-footer>
      </section>
    </div>
  `
})
export class AppComponent {
  // TODO: modifier
  @observable header = {
    app: 'todos',
    framework: 'angular'
  };
  @observable title = '';

  constructor(public todos: Todos) {
    // TODO: struct modifier

    // reaction(
    //   () => this.header,
    //   (header) => console.log('header changed to ' + JSON.stringify(header))
    // );

    // TODO: ref modifier
    reaction(
      () => {
        return this.header.framework;
      },
      (framework) => console.log('framework changed to ' + framework),
      // TODO: reaction options
      {
        // fireImmediately: true
      }
    );

    // TODO: intercept
    // this.interceptTitle();

    // TODO: mobx4
    this.initHeaderMobxReaction();
  }

  // TODO: enforce action 2
  @action.bound setTitle(event): void {
    this.title = event;
  }

  @action.bound addTodo(): void {
    this.todos.addTodo({ title: this.title });
    this.title = '';
  }

  @action toggleFramework(): void {
    this.header.framework = this.header.framework === 'angular' ? 'react' : 'angular';
  }

  @action toggleHeaderToAngular(): void {
    this.header = { app: 'todos', framework: 'angular' };
  }

  @action toggleHeader(): void {
    this.header = this.header.framework === 'angular'
      ? { app: 'todos', framework: 'react' }
      : { app: 'todos', framework: 'angular' };
  }

  async delay(): Promise<void> {
    return Promise.resolve();
  }

  @action setHeaderWithDelay(): void {
    const react = { app: 'todos', framework: 'react' };
    const angular = { app: 'todos', framework: 'angular' };
    this.header = this.header.framework === 'angular' ? react : angular;
  }

  // TODO: async action
  @action
  async toggleHeaderAsync(): Promise<void> {
    const react = { app: 'todos', framework: 'react' };
    const angular = { app: 'todos', framework: 'angular' };
    this.delay().then(() => {
      // this.setHeaderWithDelay();
      runInAction(() => {
        this.header = this.header.framework === 'angular' ? react : angular;
      });
    });
  }

  interceptTitle(): any {
    intercept(this, 'title', (ch) => {
      if (ch.newValue === 'bad') {
        ch.newValue = 'b*d';
      }
      return ch;
    });
  }

  @action setHeaderMobx(): void {
    const mobx4 = 'Mobx 4 doesn\'t react to new property';
    const mobx5 = 'Mobx 5 reacts to new property';
    (this.header as any).mobx = !(this.header as any).mobx ? mobx5 : ((this.header as any).mobx === mobx5 ? mobx4 : mobx5);
  }

  initHeaderMobxReaction(): void {
    reaction(
      () => (this.header as any).mobx,
      (mobx) => console.log(mobx)
    );
  }
}
