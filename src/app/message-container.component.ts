import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: 'message-cointer',
    template: `
    <div class="scroll">
        <div class="message">
            <message [ngClass]="instance.id" *ngFor="let instance of instances" [instance]="instance" (destory)="remove($event)"></message>
        </div>
    </div>
    `,
    styleUrls: ['./message-container.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class messageCointerComponent implements OnDestroy {
    destory$ = new Subject(); // 销毁Observerable
    instances: Array<any> = []; // 实例们，其实就是一个数组，里面全是每一个message组件需要的参数对象

    constructor(public cdr: ChangeDetectorRef) {
    }

    /** 移除 */
    remove(data: any) {
        console.log(data)
        // 遍历查询，使用some可以在返回true之后结束遍历，使用for配合break可以达到同样效果
        this.instances.some((instance, index) => {
            if (instance.id === data.id /* 找到了 */) {
                this.instances.splice(index, 1); // 直接把找到的索引切出来，改变原数组
                this.instances = [...this.instances]; // 使用展开语法，来创建新的数组引用，里面的对象成员引用未变
                // this.onRemove(instance, userAction);
                this.readyInstances();
                return true;
            }
            return false;
        });
    }

    /** 创建 */
    create(data: any) {
        // 使用展开语法，来创建新的数组引用，里面的对象成员引用未变
        this.instances = [...this.instances, data];

        this.readyInstances();

        return data;
    }

    ngOnDestroy(): void {
        this.destory$.next(null);
    }

    /** 开始 */
    public readyInstances(): void {
        // 检查该视图及其子视图。与 detach 结合使用可以实现局部变更检测。
        this.cdr.detectChanges();
    }
}
