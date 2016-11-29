// For the render function
import { render } from "react-dom"
// For the basic functions
import { isObject, isFunction, extend } from "underscore"
// For the ajax requests
import axios from "axios"
// For the react tap event fix
import TapEventPlugin from "react-tap-event-plugin"
// The state object class for the application
import AppState from "./state"
import { property, template } from "./core"
import TickTock from "./core/ticktock"
import jsyaml from "js-yaml"
import logger from "winston"

class Application {
    constructor(configUrl, initHandlers = []) {
        this.initHandlers = initHandlers;
        this.services = {};
        this.configUrl = configUrl;
        // Set the application as the global reference
        window.application = this;
    }

    getState(path) {
        let s = this.service("store").getState();
        if(!path) {
            return s;
        }
        return property(s, path);
    }

    startTick() {
        let t = this.services.ticktock;
        if(!t) {
            this.services.ticktock = new TickTock();
            this.services.ticktock.start();     
        }
        return this.services.ticktock;
    }

    timeout(handler, count = 1, sync = false, index = -1) {
        let t = this.services.ticktock;
        if(!t) {
            t = this.startTick();
        }
        return t.once(handler, count, sync, index);
    }

    tick(cause, handler, count = 1, sync = false, index = -1) {
        let t = this.services.ticktock;
        if(!t) {
            t = this.startTick();
        }
        handler.cause = cause;
        return t.tick(handler, count, sync, index);
    }

    untick(handler) {
        let t = this.services.ticktock;
        if(t) {
            t.untick(handler);
        }
    }

    pauseTick() {
        let t = this.services.ticktok;
        if(t) {
            t.stop();
        }
    }

    route(router, path) {
        // Trigger the route change
        this.trigger("ROUTE", {path: path});
        // Then route to it
        router.push(path);
    }

    info(tpl, context) {
        logger.info(template(tpl, context))
    }

    debug(tpl, context) {
        logger.debug(template(tpl, context))
    }

    error(tpl, context) {
        logger.error(template(tpl, context))
    }

	initState() {
		return this.config("init_state");
	}

    service(name, v) {
        if(name) {
            if(v && isObject(v)) {
                this.services[name] = v;
            } else {
                let s = this.services[name];
                if(s && isObject(s)) {
                    return s;
                }
            }
        }
        return this.services;
    }

    addInitHandler(handler) {
        if(isFunction(handler)) {
            this.initHandlers.push(handler);
        }
    }

    react(id = "app") {
        return {
            render: (component) => {
                return render(component, document.getElementById("app"));
            }
        }    
    }

	trigger(e, tag) {
		if(this.services.store) {
			this.services.store.dispatch(extend({type: e}, tag));
		}
		return this
	}

	ajax() {
		return axios;
	}

    init() {
        // Intialiase the Touch Tap Plugin of React at the init of the application
        TapEventPlugin();

        return new Promise((resolve, reject) => {
            this.ajax().get(this.configUrl, {responseType: "text"}).then((data) => {
                this._config = jsyaml.load(data.data);
                for(let h of this.initHandlers) {
                    h(this);
                }
                resolve(this);
            }).catch((error) => {
                reject(error)
            });
        });
    }

	title(text) {
		let t = document.getElementsByTagName("title");
		if(t.length) {
			let title = t[0];	
			if(text) {
				title.innerHTML = text;
			}
			return title.innerHTML.trim()
		}
		return null;
	}

    // Getting the query parameter from the current window's location
    // If no name is given, will return all the parameter map
    param(name) {
        if(!this._params) {
            var search = window.location.search;
            this._params = {};
            if(search && search.length) {
                // This window do have search parameters
                search = search.substring(1); // Remove the start ?
                
                for(let s of search.split('&')) {
                    let o = s.split('=');
                    this._params[o[0]] = o[1];
                }
            }
        }
    
        if(!name)
            return this._params;
        return this._params[name];
    }

    url(uri) {
        if(!uri)
            uri = '';
        var pathes = uri.split('/');
        pathes.unshift(this.config('base'));
        return pathes.join('/');
    }

    hash(hash) {
        if(hash) {
            window.location.hash = hash;
        }
        return window.location.hash;
    }

    config(name, defaultValue) {
		if(!name) {
			return this._config;
		}
        let ret = property(this._config, name);
        return ret || defaultValue;
    }
}

export default Application
