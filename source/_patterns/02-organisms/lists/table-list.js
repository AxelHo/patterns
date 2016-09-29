import React, {PropTypes} from "react";
import ReactComponent from "../../react-utils/component";

export default class TableList extends ReactComponent {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.element)
        ]).isRequired
    };

    render() {
        return (
            <div className="t-col-main-content p-a-1" key={this.getUniqueKey()}>
                <div className="t-entity-list" key={this.getUniqueKey()}>
                    <table className="table" key={this.getUniqueKey()}>
                        {this.getChildrenArray(this.props.children)}
                    </table>
                </div>
            </div>
        )
    }
}
