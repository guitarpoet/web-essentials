import React, { PropTypes, Component } from "react"
import { extend } from "underscore"
import { findNode } from "../functions"

class Render extends Component {
    componentDidMount() {
        // Set the inner html when this component is mount
        if(this.props.html) {
            findNode(this).html(this.props.html);
        }
    }

    render() {
        // Copy all the props from props
        let props = extend({}, this.props);
        // Remove the html props from it
        delete props.html;
        return (<div {...props}>
        </div>)
    }
}

Render.PropTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    html: PropTypes.string,
    id: PropTypes.string
}

export default Render
