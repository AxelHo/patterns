import React, {PropTypes} from "react";
import ReactComponent from "../../react-utils/component";
import cx from "classnames";
import styles from "./nav-sidebar.scss";

export default class NavSecondaryGroup extends ReactComponent {
    static propTypes = {
        children: PropTypes.node.isRequired,
        title: PropTypes.string
    };

    render() {
        const {children, title} = this.props;
        return (
            <div className={cx(styles["o-nav-sidebar"])}>
                <div className={styles["o-nav-sidebar-secondaryGroup"]}>
                    {title &&
                    <div className={styles["title"]}>
                        {title}
                    </div>
                    }
                    {children}
                </div>
            </div>
        );
    }
}