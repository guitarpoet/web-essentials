import $ from "webpack-zepto"
import { isString } from "underscore"
import EventSource from "./core/event_source"

class Bridge extends EventSource {
    constructor() {
		super();
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
            let message = isString(e.data)? JSON.parse(e.data): e;
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
    callback(fn, cb, args = []) {
		this.fire("bridge_callback", {func: fn, callback: cb, args: args});
        let id = this.currentId(true);
        let message = {
            id: id,
            type: "callback",
            data: "(" + fn.toString() + ")",
			args: args
        }
        // Storing the callback
        this.callbacks[id] = cb;
        this.send(message);
    }

    //
    // Execute the function using cordova's context
    //
    exec(fn, args = []) {
		this.fire("bridge_exec", {func: fn});
        let id = this.currentId(true);
        let message = {
            id: id,
            type: "function",
            data: "(" + fn.toString() + ")",
			args: args
        }
        this.send(message);
        return new Promise((resolve, reject) => {
            this.tasks[id] = {resolve, reject};
        });
    }

	//
	// Download the uri's content to local file
	//
	download(uri, fileName, headers = {}) {
		return new Promise((resove, reject) => {
			this.callback((message, service) => {
				let {uri, fileName, headers} = message.args;
				let fileTransfer = new FileTransfer();
				uri = encodeURI(uri);
				let to = "cdvfile://localhost/root/data/data/" + fileName;

				console.info("Starting the download....", to);

				fileTransfer.download(
					uri,
					to,
					(entry) => {
						console.info("Download completed..." + entry.toURL());
						message.result = entry.toURL();
						service.callback(message);
					},
					(error) => {
						console.info("Download failed..." + error.code + ":" + error.target);
						message.error = error.code;
						service.callback(message);
					},
					false,
					{
						headers: headers
					}
				);
			}, (message) => {
				if(message.result) {
					resolve(message.result, message);
				} else {
					reject(message);
				}
			}, {uri, fileName, headers});
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
