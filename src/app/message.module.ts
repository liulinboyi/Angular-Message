import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { messageCointerComponent } from "./message-container.component";
import { messageComponent } from "./message.component";
import { messageService } from "./message.service";

@NgModule({
    imports: [CommonModule],
    declarations: [messageComponent, messageCointerComponent],
    // Entry components 代表的是：「要在 Angular 程序中指令式（imperatively）地产生的组件」，
    // 跟宣告式（declarative）使用组件不同的地方在于，宣告式是在样板中宣告要使用的组件，而指令
    // 式是在程序（也就是 TypeScript）内设置要使用的元件。
    entryComponents: [messageCointerComponent],
    providers: [messageService],
})
export class messageModule { }