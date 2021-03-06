import React, {PropTypes} from "react";
import ReactComponent from "../../react-utils/component";
import cx from "classnames";

export default class Media extends ReactComponent {
    static propTypes = {
        classNames: PropTypes.string,
        mediaPosition: PropTypes.oneOf(['left', 'right']),
        mediaClassNames: PropTypes.string,
        mediaHref: PropTypes.string,
        mediaObject: PropTypes.node,
        mediaBodyClassNames: PropTypes.string,
        mediaBodyHeaderClassNames: PropTypes.string,
        mediaBodyHeader: PropTypes.string,
        mediaBody: PropTypes.string,
    };

    static defaultProps = {
        mediaPosition: 'left',
        mediaHref: '#',
    };

    renderMedia() {
        return (
            <a className={cx('media-' + this.props.mediaPosition, this.props.mediaClassNames)} href={this.props.mediaHref}>
                {this.props.mediaObject}
            </a>
        );
    }

    renderMediaBody() {
        return (
            <div className={cx('media-body', this.props.mediaBodyClassNames)}>
                <h4 className={cx('media-body', this.props.mediaBodyHeaderClassNames)}>
                    {this.props.mediaBodyHeader}
                </h4>
                {this.props.mediaBody}
            </div>
        );
    }

    render() {
        return (
            <div className={cx('media', this.props.classNames)}>
                {(this.props.mediaPosition === 'left')?this.renderMedia():this.renderMediaBody()}
                {(this.props.mediaPosition === 'right')?this.renderMedia():this.renderMediaBody()}
            </div>
        );
    }
}