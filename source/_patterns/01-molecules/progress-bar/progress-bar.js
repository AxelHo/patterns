import React, {PropTypes} from "react";
import ReactComponent from "../../react-utils/component";
import cx from "classnames";

const PROGRESS_TYPES = [
    "success",
    "info",
    "warning",
    "danger"
];

export default class ProgressBar extends ReactComponent {
    static propTypes = {
        classNames: PropTypes.string,
        value: PropTypes.number.isRequired,
        maxValue: PropTypes.number.isRequired,
        minWidth: PropTypes.number.isRequired,
        text: PropTypes.string,
        type: PropTypes.oneOf(PROGRESS_TYPES).isRequired,
        captionID: PropTypes.string,
    };

    static defaultProps = {
        classNames: "",
        text: "",
        captionID: "progress-bar-caption",
    };

    renderRemovableText(text) {
        if (text !== '') {
            return (
                <div className="text-center text-muted" id={this.props.captionID}>
                    <small>{text}</small>
                </div>
            );
        }
        return null;
    }

    render() {
        const classNames = cx(
            'progress',
            `progress-${this.props.type}`,
            this.props.classNames
        );
        return (
            <div>
                {this.renderRemovableText(this.props.text)}

                <progress
                    className={classNames}
                    value={this.props.value}
                    max={this.props.maxValue}
                    style={{width: '100%', minWidth: `${this.props.minWidth}em`}}
                />
            </div>
        );
    }
}
