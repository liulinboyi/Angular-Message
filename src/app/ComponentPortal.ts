import { ComponentFactoryResolver } from "@angular/core";

/** 这个类，纯粹就是为了保存一些参数，没有实际意义 */
export class ComponentPortal {
    /** The type of the component that will be instantiated for attachment. */
    /** 将要实例化以进行连接的组件的类型。*/
    component: any;

    /**
     * [Optional] Where the attached component should live in Angular's *logical* component tree.
     * This is different from where the component *renders*, which is determined by the PortalOutlet.
     * The origin is necessary when the host is outside of the Angular application context.
     */
    /**
     * [可选] 附加组件应位于 Angular 的 *逻辑* 组件树中的位置。
     * 这与组件 *呈现* 的位置不同，后者由 PortalOutlet 确定。
     * 当主机位于 Angular 应用程序上下文之外时，源是必需的。
     */
    viewContainerRef?: any;

    /** [Optional] Injector used for the instantiation of the component. */
    /** [可选] 用于实例化组件的注入器。*/
    injector?: any;

    /**
     * Alternate `ComponentFactoryResolver` to use when resolving the associated component.
     * Defaults to using the resolver from the outlet that the portal is attached to.
     */
    /**
     * 解析关联组件时要使用的备用"组件工厂解决方案"。
     * 默认使用门户连接到的插座中的解析程序。
     */
    componentFactoryResolver?: ComponentFactoryResolver | null;

    constructor(
        component: any,
        viewContainerRef?: any,
        injector?: any,
        componentFactoryResolver?: ComponentFactoryResolver | null,
    ) {
        this.component = component;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
        this.componentFactoryResolver = componentFactoryResolver;
    }
}