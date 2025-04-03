import React from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";

export class ChangeEmailModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentEmail: '',
            newEmail: '',
            newEmailRepeated: '',
            newEmailRepeatedError: '',
            password: '',
        }
        //preserve the initial state
        this.baseState = this.state
    }

    saveNewEmail = () => {
        //check if new emails match
        if (this.state.newEmail !== this.state.newEmailRepeated) {
            this.setState({newEmailRepeatedError: 'Emails do not match'})
            return
        }

        //save the email
        this.props.saveNewEmail(this.state.currentEmail, this.state.newEmail, this.state.password);
    }

    resetFlds = () => {
        this.setState(this.baseState)
    }

    enterKeyHandler = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);

        if (code === 13) { //Enter keycode
            if (this.formIsFilled()) {
                this.saveNewEmail()
            }
        }
    }

    formIsFilled = () => {
        return !(
            this.state.currentEmail === '' ||
            this.state.newEmail === '' ||
            this.state.newEmailRepeated === '' ||
            this.state.password === '' ||
            this.props.changingEmail
        )
    }

    render() {
        return (
            <Modal
                dialogClassName={`change-email-modal ${this.props.theme}-theme`}
                show={this.props.shown}
                onHide={() => {
                    if (!this.props.changingEmail) {
                        this.resetFlds();
                        this.props.forgetEmailWasChanged();
                        this.props.clearError();
                        this.props.clearCurrEmailError();
                        this.props.clearNewEmailError();
                        this.props.clearPasswordError();
                        this.props.close()
                    }
                }}
                size={'sm'}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!this.props.emailChanged ? (
                        <>
                            <Form.Control
                                placeholder={'Current email'}
                                onInput={(e) => {
                                    this.props.clearCurrEmailError();
                                    this.setState({currentEmail: e.currentTarget.value})
                                }}
                                onKeyUp={this.enterKeyHandler}
                                autoFocus
                            />
                            {this.props.currEmailError !== '' ? (
                                <Form.Text className={`d-block text-danger text-start text-input-error`}>
                                    {this.props.currEmailError}
                                </Form.Text>
                            ) : ''}

                            <Form.Control
                                className={'mt-3'}
                                placeholder={'New email'}
                                onInput={(e) => {
                                    this.props.clearNewEmailError();
                                    this.setState({newEmail: e.currentTarget.value, newEmailRepeatedError: ''})
                                }}
                                onKeyUp={this.enterKeyHandler}
                            />
                            {this.props.newEmailError !== '' ? (
                                <Form.Text className={`d-block text-danger text-start text-input-error`}>
                                    {this.props.newEmailError}
                                </Form.Text>
                            ) : ''}

                            <Form.Control
                                className={'mt-3'}
                                placeholder={'New email repeated'}
                                onInput={(e) => {
                                    this.props.clearNewEmailError();
                                    this.setState({newEmailRepeated: e.currentTarget.value, newEmailRepeatedError: ''})
                                }}
                                onKeyUp={this.enterKeyHandler}
                            />
                            {this.state.newEmailRepeatedError !== '' ? (
                                <Form.Text className={`d-block text-danger text-start text-input-error`}>
                                    {this.state.newEmailRepeatedError}
                                </Form.Text>
                            ) : ''}

                            <Form.Control
                                className={'mt-3'}
                                placeholder={'Password'}
                                type={'password'}
                                onInput={(e) => {
                                    this.props.clearPasswordError();
                                    this.setState({password: e.currentTarget.value})
                                }}
                                onKeyUp={this.enterKeyHandler}
                            />
                            {this.props.passwordError ? (
                                <Form.Text className={`d-block text-danger text-start text-input-error`}>
                                    {this.props.passwordError}
                                </Form.Text>
                            ) : ''}
                        </>
                    ) : ''}

                    {this.props.error !== '' ? (
                        <Alert variant={"danger"} className={'mb-0 mt-4'}>{this.props.changeEmailError}</Alert>
                    ) : ''}
                    {this.props.emailChanged ? (
                        <Alert variant={"success"} className={'mb-0'}>Your email has been changed</Alert>
                    ) : ''}
                </Modal.Body>
                <Modal.Footer className={'justify-content-center'}>
                    {this.props.emailChanged ? (
                        <Button variant="primary" autoFocus onClick={() => {
                            this.resetFlds();
                            this.props.forgetEmailWasChanged();
                            this.props.close()
                        }}>
                            Great!
                        </Button>
                    ) : (
                        <Button
                            variant="success"
                            onClick={this.saveNewEmail}
                            disabled={!this.formIsFilled()}
                            className={this.props.changingEmail ? 'loading' : ''}
                        >
                            Change
                        </Button>
                    )}

                </Modal.Footer>
            </Modal>
        );
    }
}
