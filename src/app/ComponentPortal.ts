import { ComponentFactoryResolver } from "@angular/core";

export class ComponentPortal {
    /** The type of the component that will be instantiated for attachment. */
    component: any;

    /**
     * [Optional] Where the attached component should live in Angular's *logical* component tree.
     * This is different from where the component *renders*, which is determined by the PortalOutlet.
     * The origin is necessary when the host is outside of the Angular application context.
     */
    viewContainerRef?: any;

    /** [Optional] Injector used for the instantiation of the component. */
    injector?: any;

    /**
     * Alternate `ComponentFactoryResolver` to use when resolving the associated component.
     * Defaults to using the resolver from the outlet that the portal is attached to.
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