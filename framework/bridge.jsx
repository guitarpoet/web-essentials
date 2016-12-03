import $ from "webpack-zepto"
import { isString } from "underscore"
import EventSource from "./core/event_source"

class Bridge extends EventSource {
    constructor() {
        this.tasks = {};
        this.callbacks = {};
        this._id = 0;
    }

    currentId(inc = false) {
        let i = this._id; 
        if(inc) {
            this._id++;
        }
        return i;
    }

    start() {
		this.fire("bridge_start", {});
        $(window).on("message", (e) => {
            let message = JSON.parse(e.data);
			this.fire("bridge_message", {message});
            if(message.type == "callback") {
                // This is the callback function
                let cb = this.callbacks[message.id];
                if(cb) {
                    cb(message);
                }
            } else if(this.tasks[message.id]) {
                if(message.type == "data") {
                    this.tasks[message.id].resolve(message);
                } else {
                    this.tasks[message.id].reject(message);
                }
            }
        });
    }

    //
    // Eexecute the function that will have a callback support
    //
    callback(fn, cb) {
		this.fire("bridge_callback", {func: fn, callback: cb});
        let id = this.currentId(true);
        let message = {
            id: id,
            type: "callback",
            data: "(" + fn.toString() + ")"
        }
        // Storing the callback
        this.callbacks[id] = cb;
        this.send(message);
    }

    //
    // Execute the function using cordova's context
    //
    exec(fn) {
		this.fire("bridge_exec", {func: fn});
        let id = this.currentId(true);
        let message = {
            id: id,
            type: "function",
            data: "(" + fn.toString() + ")"
        }
        this.send(message);
        return new Promise((resolve, reject) => {
            this.tasks[id] = {resolve, reject};
        });
    }

    close() {
        $(window).off("message");
    }

    send(message) {
		this.fire("bridge_send", {message});
        if(!isString(message)) {
            message = JSON.stringify(message);
        }
        parent.postMessage(message, "*");
    }
}

export default Bridge
