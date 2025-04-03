import {Component} from "react";
import {Button} from "react-bootstrap";
import {SocialIcon} from "./icons/SocialIcon";

export class AuthButton extends Component {
    loginWithAuthProvider = () => {
        this.props.authenticateSocialUser({
            provider: this.props.provider,
            type: this.props.type
        });
    }

    render() {
        return (
            <Button
                className={
                    'authProvider social-button ' +
                    (this.props.provider === this.props.authenticatingSocialUserAsync ? 'authenticating' : "")
                }
                disabled={this.props.disabled || this.props.authenticatingSocialUserAsync !== null}
                variant={'primary'}
                onClick={this.loginWithAuthProvider}
            >
                <SocialIcon network={this.props.provider}/>
            </Button>
        );
    }
}
