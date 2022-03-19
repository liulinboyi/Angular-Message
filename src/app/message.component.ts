import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { filter, Subject, take } from "rxjs";
import { moveUpMotion } from './animation/move';


@Component({
    selector: 'message',
    animations: [moveUpMotion],
    template: `
    <div class="notice" [@moveUpMotion]="instance.state"
  (@moveUpMotion.done)="animationStateChanged.next($event)">
        <div class="out">
            <div class="inner">message {{instance.msg}}</div>
            <i class="close">x</i>
        </div>
    </div>
    `,
    styleUrls: ['./message.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class messageComponent implements OnInit {
    /** 组件需要的参数 */
    @Input() instance: any;
    /** 外面接收到这个事件，就会销毁这个组件 */
    @Output() destory = new EventEmitter();

    /** 动画状态改变 */
    readonly animationStateChanged: Subject<any> = new Subject<any>();
    /** 定时器ID */
    closeTimer!: number | undefined;


    constructor(public cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.instance.state = 'enter';
        this.animationStateChanged
            .pipe(
                filter(event => event.phaseName === 'done' && event.toState === 'leave'),
                take(1)
            )
            .subscribe(() => {
                // 动画结束
                console.log("animationStateChanged")
                clearTimeout(this.closeTimer); // 取消定时回调执行
                this.destory.next({ id: this.instance.id }); // 向外发送结束信息
            });
        // if (false) {
        this.willDestory()
        // }
    }

    /** 将会销毁 */
    willDestory() {
        // 这里是演示，这个完全可以由外部参数来决定什么时候让message消失，甚至不消失
        setTimeout(() => {
            this.instance.state = 'leave';
            this.readyInstances()

            // 让离开动画有时间绘制
            this.closeTimer = window.setTimeout(() => {
                this.closeTimer = undefined; // 将定时器ID置为undefined
                this.destory.next({ id: this.instance.id }); // 向外发送结束信息
            }, 200);
        }, 3000 /* 演示时间 */)
    }

    /** 开始 */
    public readyInstances(): void {
        // 检查该视图及其子视图。与 detach 结合使用可以实现局部变更检测。
        this.cdr.detectChanges();
    }
}