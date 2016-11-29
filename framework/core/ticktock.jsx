import { isFunction, isNumber } from "underscore"

class TickTock {
    start() {
        if(!this.handle) {
            // Every 0.5 second is a tick
            this.handle = setInterval(this.tock.bind(this), 500);
        }
    }

    once(handler, count, sync, index) {
		if(!handler) {
			throw "Handler is null!";
		}
        // Set this handler should only call once
        handler._once = true;
        this.tick(handler, count, sync, index);
    }

    tick(handler, count, sync, index) {
		if(!handler) {
			throw "Handler is null!";
		}

        if(isFunction(handler) && !this.hasHandler(handler)) {
            var i = -1;
            var c = 1;
            if(isNumber(index)) {
                i = index;
            }
            if(isNumber(count)) {
                c = count;
            }

            handler._ticks = 0;
            handler._tick_count = c;
            handler._tick_sync = !!sync;

            if(i == -1) {
                this._handlers().push(handler);
            } 
            else {
                this._hs = this._handlers().splice(i, 0, handler);
            }
            handler._tick_index = this._handlers().indexOf(handler);
        }
        return handler;
    }

    hasHandler(handler) {
        return this._handlers().indexOf(handler) != -1;
    }

    _handlers() {
        if(!this._hs) {
            this._hs = [];
        }
        return this._hs;
    }

    stop() {
        clearInterval(this.handle);
        delete this.handle;
    }

    untick(handler) {
        if(this.hasHandler(handler)) {
            this._hs.splice(this._hs.indexOf(handler), 1);
        }
    }

    tock() {
        for(let handler of this._handlers()) {
            // Increase the tick count of the handler
            handler._ticks++;
            if(handler._ticks == handler._tick_count) {
                if(handler._tick_sync) {
                    handler(this, handler);
                }
                else {
                    setTimeout(() => { handler(this, handler); }, 0);
                }
                handler._ticks = 0;
                
                if(handler._once) {
                    this.untick(handler);
                }
            }
        }
    }
}

export default TickTock;
