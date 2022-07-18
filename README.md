# React Dynamic Overlay

A component that can be updated programmatically.

A way to escape the declarative behaviour of react
for event driven layout updates

In other words, a better way to display dialogs

#### How to use

```tsx
import DefaultOverlay, {Overlay} from "react-dynamic-overlay";

// you can use DefaultOverlay instead
const MyOverlay = new Overlay()

function MyApp() {
    return <>
        <h1>Overlay:</h1>
        <MyOverlay.Container />

        <h1>Component:</h1>
        <MyComponent />
    </>
}

function MyComponent() {
    function displayOverlay() {
        MyOverlay.push(id => <>
            <p>Inside Overlay</p>

            <button onclick={_ => MyOverlay.dismiss(id)} />
        </>)
    }

    return <>
        <p>Inside MyComponent</p>

        <button onclick={_ => displayOverlay()}>
            Display Dialog
        </button>
    </>
}
```
