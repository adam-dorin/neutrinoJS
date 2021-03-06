import { Template } from "../template";
import { SimpleObserver } from "../observer";
import { DataProxy } from "./proxy";
import { ExecuteHook, HOOKS } from "./hook";

export class State {
    constructor(name, state, dataReceiver) {
        this.name = name
        Object.assign(this, state.methods);
        Object.assign(this, state.data);
        this.component = {
            sendMessageTo: (name, data) => dataReceiver.sendTo(name, data),
            emitter: dataReceiver
        }
    }
}

export const setComponentDefaultState = (name, state, DataReceiver, renderer) => {

    let _state = ({
        state: new State(name, state, DataReceiver),
        template: {
            instance: new Template(),
            raw: document.querySelector(`#${name}`).innerHTML
        },
        hooks: state.hooks,
        renderer: {
            internal: renderer.internal,
            external: renderer.external
        },
        proxy: null,
        setTemplate: function () {
            this.template.instance.setTemplate(name, this.template.raw)
        },
        render: function () {
            this.template.instance.render(name, this.proxy);
        },
        setRendererSubscribers: function () {
            this.renderer.internal.subscribe(name, () => {
                this.template.instance.render(name, this.proxy)
            })
            this.renderer.external.subscribe(name, () => {
                this.template.instance.render(name, this.proxy)
            })
        },
        executeHook: function () {
            return {
                onCreate: () => ExecuteHook(HOOKS.ON_CREATE, this.hooks, this.proxy),
                onData: data => ExecuteHook(HOOKS.ON_DATA, this.hooks, this.proxy, data)
            }
        }
    })
    _state.proxy = DataProxy(_state.state, _state.renderer.internal)
    _state.setTemplate();
    _state.setRendererSubscribers();   
    return _state;
}
