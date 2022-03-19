import { DOCUMENT } from "@angular/common";
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector } from "@angular/core";
import { ComponentPortal } from "./ComponentPortal";
import { messageCointerComponent } from "./message-container.component";

let globalCounter = 0;

@Injectable({
    providedIn: 'root',
})
export class messageService {

    /** 组件前缀 */
    protected componentPrefix = 'message-';
    /** Document */
    protected _document: Document;
    /** 根（host）dom元素 */
    private out: any;
    /** 已经添加加上的元素 */
    public _attachedPortal: any;
    /** A function that will permanently dispose this host. */
    /** 一个将永久地处置这个host的函数。*/
    private _disposeFn!: (() => void) | null;
    /** 缓存 */
    public mapCache = new Map();

    constructor(
        public app: ApplicationRef,
        @Inject(DOCUMENT) public document: Document,
        public _componentFactoryResolver: ComponentFactoryResolver,
        public injector: Injector
    ) {
        this._document = document;
    }

    /** 获取ID */
    protected getInstanceId(): string {
        return `${this.componentPrefix}-${globalCounter++}`;
    }

    /** 固定组件实例 */
    public shoeMessage(options: any) {
        // 固定组件

        // 动态创建组件
        let containerInstance: messageCointerComponent = this.withContainer<messageCointerComponent>(messageCointerComponent);
        // 订阅组件销毁
        containerInstance.destory$.subscribe(() => {
            this.destory()
        })
        // 创建message 内容
        containerInstance.create({
            ...options,
            id: this.getInstanceId()
        })
        // 触发更新
        containerInstance.readyInstances();
        return containerInstance;
    }

    /** 动态创建component */
    public show(component: any/* 组件类 */, options: any/** 参数 */) {
        let containerInstance = this.withContainer(component);
        // containerInstance.name = '哈哈';
        containerInstance.readyInstances();
        // 创建message 内容
        containerInstance.create({
            ...options,
            id: this.getInstanceId()
        })
        // 返回
        return containerInstance;
    }

    /** 创建根（host）dom元素且添加到body最后（appendChild） */
    private _createHostElement(): HTMLElement {
        // 创建div元素作为host
        const host = this._document.createElement('div');
        // 添加类
        host.classList.add('container')
        // 获取容器，并将host元素添加进容器元素
        this._document.body.appendChild(host);
        // 返回host元素
        return host;
    }

    /** 创建根（host）dom元素和赋值给out */
    public create() {
        // 创建
        let out = this._createHostElement();
        // 赋值
        this.out = out;
        // 返回
        return out;
    }

    /** Gets the root HTMLElement for an instantiated component. */
    /** 获取实例化组件的根 HTML 元素。*/
    private _getComponentRootNode(componentRef: any): HTMLElement {
        return componentRef.hostView.rootNodes[0] as HTMLElement;
    }

    /** 动态创建组件实例 */
    public withContainer<T>(ctor: typeof messageCointerComponent) {
        // 查看缓存中是否存在当前创建的组件实例
        let cache = this.mapCache.get(this.componentPrefix);
        if (cache /* 如果有 */) {
            return cache; // 直接返回
        }
        if (!this.out/* 如果没有 */) {
            this.create() // 在此函数中调用其他函数，创建和append到body
            this.out.style.zIndex = '1010' // 设置层叠样式
        }
        const componentPortal = new ComponentPortal(ctor, null, this.injector); // 这个类，纯粹就是为了保存一些参数，没有实际意义
        const componentRef = this.attachComponentPortal<T>(componentPortal); // 将给定的ComponentPortal附加到DOM元素
        this.mapCache.set(this.componentPrefix, componentRef.instance) // 加入缓存
        return componentRef.instance; // 返回
    }

    /**
     * Attaches content, given via a Portal, to the overlay.
     * If the overlay is configured to have a backdrop, it will be created.
     *
     * @param portal Portal instance to which to attach the overlay.
     * @returns The portal attachment result.
     */
    /**
     * 将通过Portal给定的内容附加到覆盖物上。
     * 如果覆盖层被配置为有一个背景，它将被创建。
     *
     *param portal 要附加到覆盖层的Portal实例。
     * @returns 门户附件的结果。
     */
    attach<T>(portal: ComponentPortal) {
        return this.attachComponentPortal<T>(portal);
    }

    /**
     * Attach the given ComponentPortal to DOM element using the ComponentFactoryResolver.
     * @param portal Portal to be attached
     * @returns Reference to the created component.
     */
    /**
     *使用ComponentFactoryResolver将给定的ComponentPortal附加到DOM元素。
     * @param portal 要附加的Portal
     * @returns 对创建的组件的引用。
     */
    attachComponentPortal<T>(portal: ComponentPortal) {
        const resolver = portal.componentFactoryResolver || this._componentFactoryResolver;
        // 一个简单的注册表，它将 Components 映射到生成的 ComponentFactory 类，
        // 该类可用于创建组件的实例。用于获取给定组件类型的工厂，然后使用工厂的 
        // create() 方法创建该类型的组件。
        const componentFactory = resolver.resolveComponentFactory<T>(portal.component);
        let componentRef: ComponentRef<T>;

        // If the portal specifies a ViewContainerRef, we will use that as the attachment point
        // for the component (in terms of Angular's component tree, not rendering).
        // When the ViewContainerRef is missing, we use the factory to create the component directly
        // and then manually attach the view to the application.
        // 如果 门户 指定了一个ViewContainerRef，我们将使用它作为组件的连接点。
        // 作为该组件的附着点（就Angular的组件树而言，而不是渲染）。
        // 当ViewContainerRef缺失时，我们会使用工厂直接创建组件。
        // 然后手动将视图附加到应用程序中。
        if (portal.viewContainerRef /* 存在viewContainerRef，则使用它作为组件的连接点 */) {
            // componentRef = portal.viewContainerRef.createComponent(
            //   componentFactory,
            //   portal.viewContainerRef.length,
            //   portal.injector || portal.viewContainerRef.injector,
            // );
            componentRef = portal.viewContainerRef.createComponent(
                portal.component,
                {
                    index: portal.viewContainerRef.length,
                    injector: portal.injector || portal.viewContainerRef.injector
                }
            );

            this.setDisposeFn(() => componentRef.destroy());
        } /* viewContainerRef缺失 */ else {
            // 我们会使用工厂直接创建组件。
            componentRef = componentFactory.create(portal.injector);
            // 然后手动将视图附加到应用程序中。
            /**
             * 附上一个视图，这样它就会被脏检查。
             * 当视图被销毁时，它将被自动分离。
             * 如果视图已经被附加到一个ViewContainer上，这将被抛出。
             */
            this.app.attachView(componentRef.hostView);
            this.setDisposeFn(() => {
                /**
                 *将一个视图再次从脏检查中分离出来。
                */
                this.app.detachView(componentRef.hostView);
                componentRef.destroy();
            });
        }
        // At this point the component has been instantiated, so we move it to the location in the DOM
        // where we want it to be rendered.
        // 此时，组件已被实例化，因此我们将其移动到 DOM 中的位置
        // 我们希望它在哪里渲染。
        this.out.appendChild(this._getComponentRootNode(componentRef));
        this._attachedPortal = portal;

        return componentRef;
    }

    /** 设置处理方式 */
    setDisposeFn(fn: () => void) {
        this._disposeFn = fn;
    }

    destory() {
        this.detach()
    }

    detach(): void {
        if (this._attachedPortal) {
            // this._attachedPortal.setAttachedHost(null);
            this._attachedPortal = null;
        }

        this._invokeDisposeFn();
    }

    private _invokeDisposeFn() {
        if (this._disposeFn) {
            this._disposeFn();
            this._disposeFn = null;
        }
    }
}