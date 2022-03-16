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
export class messageComponent implements OnDestroy, OnInit {
    @Input() instance: any;
    /** 外面接收到这个事件，就会销毁这个组件 */
    @Output() destory = new EventEmitter();

    // name = '小张'
    // destory$ = new Subject();


    readonly animationStateChanged: Subject<any> = new Subject<any>();
    closeTimer!: number | undefined;


    constructor(public cdr: ChangeDetectorRef) {
    }
    ngOnInit(): void {
        debugger;
        this.instance.state = 'enter';
        this.animationStateChanged
            .pipe(
                filter(event => event.phaseName === 'done' && event.toState === 'leave'),
                take(1)
            )
            .subscribe(() => {
                console.log("animationStateChanged")
                clearTimeout(this.closeTimer);
                this.destory.next({ id: this.instance.id });
                // this.destroyed.next({ id: this.instance.messageId, userAction: this.userAction });
            });
        if (false) {
            this.willDestory()
        }
    }

    willDestory() {
        setTimeout(() => {
            this.instance.state = 'leave';
            this.readyInstances()
            // this.destory.next({ id: this.instance.id });

            this.closeTimer = window.setTimeout(() => {
                this.closeTimer = undefined;
                this.destory.next({ id: this.instance.id });
            }, 200);
        }, 3000)
    }

    ngOnDestroy(): void {
        // this.destory$.next(null);
    }

    public readyInstances(): void {
        this.cdr.detectChanges();
    }
}