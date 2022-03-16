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
    name = '小张'
    destory$ = new Subject();
    instances: Array<any> = [];
    _instances: Array<any> = [];

    constructor(public cdr: ChangeDetectorRef) {
    }

    remove(data: any) {
        console.log(data)
        this.instances.some((instance, index) => {
            if (instance.id === data.id) {
                this.instances.splice(index, 1);
                this.instances = [...this.instances];
                debugger;
                // this.onRemove(instance, userAction);
                this.readyInstances();
                return true;
            }
            return false;
        });
    }

    create(data: any) {
        // const instance = this.onCreate(data);

        // if (this.instances.length >= this.config!.nzMaxStack) {
        //     this.instances = this.instances.slice(1);
        // }
        debugger;

        this.instances = [...this.instances, data];

        this.readyInstances();

        return data;
    }

    ngOnDestroy(): void {
        this.destory$.next(null);
    }

    public readyInstances(): void {
        this.cdr.detectChanges();
    }
}
