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
  /** 需要动态创建的组件容器 */
  instance!: messageCointerComponent;
  constructor(public message: messageService/* message服务 */) { }

  show() {
    // 创建container
    // this.instance = this.message.show(messageCointerComponent, {
    //   msg: count++
    // })
    // // 如果将组件固定，则可以将在这个销毁逻辑放到创建组件实例（例如messageCointerComponent）中
    // this.instance.destory$.subscribe(() => {
    //   this.message.destory()
    // })

    // 固定组件实例
    this.message.shoeMessage({
      msg: count++
    })
  }
}
