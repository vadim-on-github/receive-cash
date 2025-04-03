import React from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";

export class ChangePasswordModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPassword: '',
            newPassword: '',
            newPasswordRepeated: '',
            newPasswordRepeatedError: ''
        }
        //preserve the initial state
        this.baseState = this.state
    }

    okBtnRef = React.createRef();

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.changed) {
            this.okBtnRef.current.focus();
        }
    }

    save = () => {
        //check if new passwords match
        if (this.state.newPassword === this.state.newPasswordRepeated) {
            this.setState({newPasswordRepeatedError: ''})
        } else {
            this.setState({newPasswordRepeatedError: 'Passwords do not match'});
            return
        }

        //save the password
        this.props.save(this.state.currentPassword, this.state.newPassword);
    }

    resetFlds = () => {
        this.setState(this.baseState)
    }

    formIsFilled = () => {
        return !(
            this.state.currentPassword === '' ||
            this.state.newPassword === '' ||
            this.state.newPasswordRepeated === ''
        )
    }

    fldKeyboardEntry = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) { //Enter keycode
            if (this.formIsFilled()) {
                this.save();
            }
        }
    };

    render() {
        return (
            <Modal
                dialogClassName={`${this.props.theme}-theme`}
                show={this.props.shown}
                onHide={() => {
                    this.resetFlds();
                    this.props.forgetPasswordWasChanged();
                    this.props.clearError();
                    this.setState({newPasswordRepeatedError: ''});
                    this.props.close()
                }}
                size={'sm'}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!this.props.changed ? (
                        <>
                            <Form.Control
                                type="password"
                                placeholder={'Current password'}
                                autoFocus
                                onInput={(e) => {
                                    this.props.clearError();
                                    this.setState({currentPassword: e.currentTarget.value})
                                }}
                                onKeyUp={this.fldKeyboardEntry}
                            />
                            {this.props.error === 'Current password incorrect' ? (
                                <>
                                    <Form.Text className={`d-block text-danger text-start text-input-error`}>
                                        {this.props.error}
                                    </Form.Text>
                                </>
                            ) : ''}

                            <Form.Control
                                type="password"
                                className={'mt-3'}
                                placeholder={'New password'}
                                onInput={(e) => {
                                    this.setState({
                                            newPassword: e.currentTarget.value,
                                            newPasswordRepeatedError: ''
                                        }
                                    )
                                }}
                                onKeyUp={this.fldKeyboardEntry}
                            />

                            <Form.Control
                                type="password"
                                className={'mt-3'}
                                placeholder={'New password repeated'}
                                onInput={(e) => {
                                    this.setState({
                                        newPasswordRepeated: e.currentTarget.value,
                                        newPasswordRepeatedError: ''
                                    })
                                }}
                                onKeyUp={this.fldKeyboardEntry}
                            />
                            {this.state.newPasswordRepeatedError !== '' ? (
                                <Form.Text
                                    className={`d-block text-danger text-start text-input-error`}>
                                    {this.state.newPasswordRepeatedError}
                                </Form.Text>
                            ) : ''}
                        </>
                    ) : ''}

                    {this.props.error !== '' && this.props.error !== 'Current password incorrect' ? (
                        <Alert variant={"danger"} className={'mb-0 mt-4'}>{this.props.error}</Alert>
                    ) : ''}
                    {this.props.changed ? (
                        <Alert variant={"success"} className={'mb-0'}>Your password has been changed</Alert>
                    ) : ''}
                </Modal.Body>
                <Modal.Footer className={'justify-content-center'}>
                    {this.props.changed ? (
                        <Button
                            variant="primary"
                            autoFocus
                            ref={this.okBtnRef}
                            onClick={() => {
                                this.resetFlds();
                                this.props.forgetPasswordWasChanged();
                                this.props.clearError();
                                this.props.close()
                            }}
                        >
                            Okay
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="success"
                                className={this.props.changing ? 'loading' : ''}
                                disabled={!this.formIsFilled() || this.props.changing}
                                onClick={this.save}
                            >
                                Change
                            </Button>
                        </>
                    )}

                </Modal.Footer>
            </Modal>
        );
    }
}
