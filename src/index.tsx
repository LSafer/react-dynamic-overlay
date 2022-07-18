import {Fragment, ReactNode, useEffect, useState} from "react";

/**
 * An overlay is a list of components that can be changed anywhere out of the
 * React context.
 * The components can be viewed using the overlay's container react component.
 * The container component gets updated whenever the components list changes.
 *
 * @author LSafer
 * @since 1.0.0
 */
export class Overlay {
    /**
     * An incremental id to be given to components.
     */
    private iid = -1;
    /**
     * The components list.
     *
     * Contains an array associating the component with its id.
     */
    private components: [number, ReactNode][] = [];
    /**
     * A list of functions to be invoked each time
     * the components list changes.
     */
    private subscribers: (() => void)[] = [];

    /**
     * Construct a new overlay instance.
     *
     * @param component the default component composer.
     * @since 1.0.0
     */
    constructor(
        private component?: (_: ReactNode[]) => ReactNode
    ) {}

    /**
     * A React component containing the components
     * pushed to this overlay in real time.
     *
     * @since 1.0.0
     */
    Container = (props: { component?: ((_: ReactNode[]) => ReactNode) }) => {
        const [components, setComponents] = useState(this.components);

        useEffect(() => {
            const subscription = this.subscribers.push(() => {
                setComponents(this.components);
            });

            return () => {
                this.subscribers.splice(subscription - 1);
            };
        }, []);

        if (props.component)
            return <>{props.component(components.map(it => it[1]))}</>;

        if (this.component)
            return <>{this.component(components.map(it => it[1]))}</>;

        return <>{components.map(([, component], index) =>
            <Fragment key={index}>{component}</Fragment>
        )}</>;
    };

    /**
     * Push the given component to the overlay.
     *
     * @param component the component to be pushed.
     *                  Pass a function to obtain an id of the component.
     * @since 1.0.0
     */
    push(component: ReactNode | ((id: number) => ReactNode)) {
        switch (typeof component) {
            case "function":
                this.pushWithId(component);
                break;
            default:
                this.pushLast(component);
        }
    }

    /**
     * Dismiss a component.
     *
     * @param id the id of the component to dismiss.
     *           Pass nothing to dismiss the last component.
     * @since 1.0.0
     */
    dismiss(id?: number) {
        switch (typeof id) {
            case "number":
                this.dismissById(id);
                break;
            default:
                this.dismissLast();
        }
    }

    /**
     * Dismiss all components in the overlay.
     *
     * @since 1.0.0
     */
    dismissAll() {
        this.components = [];
        this.subscribers.forEach(fn => fn());
    }

    /**
     * Push the component resulted from invoking the given function.
     */
    private pushWithId(component: (id: number) => ReactNode) {
        const id = ++this.iid;
        this.components = [...this.components, [id, component(id)]];
        this.subscribers.forEach(fn => fn());
    }

    /**
     * Push the given component.
     */
    private pushLast(component: ReactNode) {
        this.components = [...this.components, [-1, component]];
        this.subscribers.forEach(fn => fn());
    }

    /**
     * Dismiss the component with the given id.
     */
    private dismissById(id: number) {
        this.components = this.components.filter(it => it[0] != id);
        this.subscribers.forEach(fn => fn());
    }

    /**
     * Dismiss the last component.
     */
    private dismissLast() {
        this.components = this.components.slice(0, -1);
        this.subscribers.forEach(fn => fn());
    }
}

export default new Overlay();
