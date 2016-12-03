import $ from "webpack-zepto"
import { isObject } from "underscore"

class EventSource {
	addListener(event, func) {
		$(this).on(event, func);
	}

	on(event, func) {
		this.addListener(event, func);
	}

	removeListener(event, func = null) {
		$(this).off(event, func);
	}

	off(event, func = null) {
		this.removeListener(event, func);
	}
	
	fire(event, args = {}) {
		if(isObject(args)) {
			args.currentTarget = this;
			args.target = this;
		}
		$(this).trigger(event, args);
	}
}

export default EventSource
