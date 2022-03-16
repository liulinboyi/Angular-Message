import { Component } from '@angular/core';
import { messageCointerComponent } from './message-container.component';
import { messageService } from './message.service';

let count = 0;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-message';
  instance!: messageCointerComponent;
  constructor(public message: messageService) { }

  show() {
    debugger;
    // 创建container
    this.instance = this.message.show(messageCointerComponent, {
      msg: count++
    })
    this.instance.destory$.subscribe(() => {
      this.message.destory()
    })
  }

  change() {
    this.instance.name = `${Math.random()}`
    this.instance.readyInstances();
  }
}
