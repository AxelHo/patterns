import React, {PropTypes} from "react";
import ReactComponent from "../../reactComponent";
import cx from "classnames";

import Card from "../../01-molecules/card/card"
import Button from "../../00-atoms/button/button"

export default class Auth extends ReactComponent {
    static propTypes = {
        contextInfoTitle: PropTypes.string,
        contextInfoText: PropTypes.string,
        loginHeader: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired,
        authButtonText: PropTypes.string.isRequired,
        logoURI: PropTypes.string.isRequired,
        onAuthClick: PropTypes.func.isRequired,
    };

    renderContextInfo() {
        if (this.props.contextInfoText && this.props.contextInfoTitle)
            return (
                <div className="card card-block">
                    <h4 className="card-title">{this.props.contextInfoTitle}</h4>
                    <p className="card-text">{this.props.contextInfoText}</p>
                </div>
            );
    }

    render() {
        return (
            <div className="o-login">
                <div className="o-login-logo text-xs-center">
                    <img src={this.props.logoURI} className="logo" alt="App-Arena.com" />
                </div>

                {this.renderContextInfo()}

                <Card>
                    <div className="card-header">
                        {this.props.loginHeader}
                    </div>

                    <div className="card-block">
                        {this.props.children}
                    </div>

                    <div className="card-footer text-xs-right">
                        <Button buttonClass="btn btn-primary" onClickMethod={this.props.onAuthClick} >
                            <p>{this.props.authButtonText}</p>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }
}