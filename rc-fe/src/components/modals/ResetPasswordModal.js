import React from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";

export class ResetPasswordModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newPassword: ''
        }
        //preserve the initial state
        this.baseState = this.state
    }

    resetFlds = () => {
        this.setState(this.baseState)
    }

    emailKeyboardEntry = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) { //Enter
            if (this.props.email !== '' && !this.props.requestingCode) {
                this.props.verifyEmailAndSendVerifCode();
            }
        }
    };

    verifCodeKeyboardEntry = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) { //Enter
            if (this.props.verifCode !== '' && !this.props.verifyingCode) {
                this.props.verifyCode()
            }
        }
    };

    passwordKeyboardEntry = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) { //Enter keycode
            if (this.state.newPassword !== '' && !this.props.requestingPassword) {
                this.props.resetPasswordAndLogin(this.state.newPassword)
            }
        }
    };

    render() {
        return (
            <Modal
                dialogClassName={`${this.props.theme}-theme reset-pass-form`}
                show={this.props.shown}
                onHide={() => {
                    if (this.props.passwordReset) {
                        this.resetFlds();
                        this.props.forgetPasswordWasReset();
                    }
                    if (this.props.codeVerifiedFor !== '') {
                        this.setState({verifCodeTyped: false, newPasswordTyped: false})
                    }
                    this.setState({
                        verifCodeTyped: false,
                        newPasswordTyped: false
                    })
                    this.props.close()
                }}
                size={'sm'}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Reset password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.passwordReset ? (
                        <Alert variant={"success"} className={'mb-0'}>
                            Your password has been changed and you are now logged in
                        </Alert>
                    ) : (
                        <>
                            <Form.Control
                                type="text"
                                className={
                                    this.props.codeVerifiedFor !== '' &&
                                    this.props.email === this.props.codeVerifiedFor ?
                                        'is-valid' :
                                        ''
                                }
                                placeholder={'Email address'}
                                value={this.props.email}
                                autoFocus
                                onInput={(e) => {
                                    this.props.clearEmailError();
                                    this.props.setEmail(e.currentTarget.value.trim());
                                }}
                                onKeyUp={this.emailKeyboardEntry}
                            />
                            {this.props.emailError !== '' ? (
                                <Form.Text className={`d-block text-danger text-start text-input-error`}>
                                    {this.props.emailError}
                                </Form.Text>
                            ) : ''}

                            {
                                this.props.verifEmailSentTo !== '' &&
                                this.props.email === this.props.verifEmailSentTo &&
                                this.props.email !== this.props.codeVerifiedFor ? (
                                    <>
                                        <Form.Control
                                            type="text"
                                            className={'mt-3'}
                                            placeholder={'Verification code'}
                                            value={this.props.verifCode}
                                            autoFocus
                                            onInput={(e) => {
                                                this.props.setVerifCode(e.currentTarget.value.trim())
                                                this.props.clearVerifCodeError();
                                            }}
                                            onKeyUp={this.verifCodeKeyboardEntry}
                                        />
                                        {this.props.verifCodeError !== '' ? (
                                            <Form.Text className={`d-block text-danger text-start text-input-error`}>
                                                {this.props.verifCodeError}
                                            </Form.Text>
                                        ) : ''}
                                    </>
                                ) : ('')}

                            {this.props.codeVerifiedFor !== '' && this.props.email === this.props.codeVerifiedFor ? (
                                <>
                                    <Form.Control
                                        type="password"
                                        className={'mt-3'}
                                        placeholder={'New password'}
                                        autoFocus
                                        value={this.state.newPassword}
                                        onInput={(e) => this.setState({newPassword: e.currentTarget.value})}
                                        onKeyUp={this.passwordKeyboardEntry}
                                    />
                                    {this.props.passwordResetError !== '' ? (
                                        <Form.Text className={`d-block text-danger text-start text-input-error`}>
                                            {this.props.passwordResetError}
                                        </Form.Text>
                                    ) : ''}
                                </>
                            ) : ''}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className={'justify-content-center'}>
                    <div
                        className={"loading-flasher " + (this.props.verifyingCode || this.props.requestingCode || this.props.requestingPassword ? 'visible' : '')}></div>
                    {
                        this.props.passwordReset ? (
                            <Button variant="primary" autoFocus onClick={() => {
                                this.resetFlds();
                                this.props.forgetPasswordWasReset();
                                this.props.close()
                            }}>
                                Okay
                            </Button>
                        ) : this.props.codeVerifiedFor !== '' && this.props.email === this.props.codeVerifiedFor ? (
                            <Button
                                variant="success"
                                disabled={this.state.newPassword === '' || this.props.requestingPassword}
                                onClick={() => {
                                    this.props.resetPasswordAndLogin(this.state.newPassword)
                                }}
                            >
                                Change password
                            </Button>
                        ) : (
                            this.props.verifEmailSentTo !== '' &&
                            this.props.email === this.props.verifEmailSentTo &&
                            this.props.email !== this.props.codeVerifiedFor ? (
                                <Button
                                    variant="success"
                                    disabled={this.props.verifCode === '' || this.props.verifyingCode}
                                    onClick={this.props.verifyCode}
                                >
                                    Verify
                                </Button>
                            ) : (
                                <Button
                                    variant="success"
                                    disabled={this.props.email === '' || this.props.requestingCode}
                                    onClick={this.props.verifyEmailAndSendVerifCode}
                                >
                                    Send verification code
                                </Button>
                            )
                        )
                    }


                </Modal.Footer>
            </Modal>
        );
    }
}
