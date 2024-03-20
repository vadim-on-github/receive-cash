import React from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import axios from "axios";

export class DeleteAccountModal extends React.Component {
    state = {
        password: '',
        passwordError: '',
        confirmingPassword: false
    }

    confirmPassword = async () => {
        const app = this;
        let passwordCorrect;
        await this.setState({confirmingPassword: true})
        await axios({
            url: process.env.REACT_APP_AUTH_HOST + '/confirm_password.php',
            method: 'post',
            withCredentials: false,
            data: {
                email: this.props.loggedInUser,
                pass: this.state.password,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response) {
            if (app.props.logging) console.log(response.data);
            passwordCorrect = response.data.pass_correct;
        }).catch(function (error) {
            console.error(error);
        });
        this.setState({confirmingPassword: false})
        return passwordCorrect;
    }

    formIsValid() {
        return !this.props.deletingAccount & (this.props.loginProvider === 'email and password' ? this.state.password !== '' : true);
    }

    deleteEmailPassAccount() {
        this.confirmPassword().then(passwordCorrect => {
            if (passwordCorrect) {
                this.props.confirmModal(
                    "Are you sure you want to delete your account?",
                    () => this.props.deleteAccount(this.state.password)
                )
            } else {
                this.setState({passwordError: 'wrong password'})
            }
        })
    }

    deleteSocialAccount = () => {
        this.props.confirmModal(
            "Are you sure you want to delete your account?",
            () => this.props.deleteAccount()
        )
    }

    passwordEntryHandler = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) { //Enter
            if (this.formIsValid()) {
                this.deleteEmailPassAccount()
            }
        }
    }

    render() {
        return (
            <Modal dialogClassName={`${this.props.theme}-theme delete-account-form`}
                   show={this.props.shown}
                   onHide={() => {
                       this.setState({password: ''})
                       this.props.close()
                   }}
                   size={'sm'}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Account deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.deleted ? (
                        <Alert variant={"success"} className={'mb-0'}>
                            Account deleted
                        </Alert>
                    ) : this.props.loginProvider === 'email and password' ? (
                        <>
                            <Form.Control
                                type="password"
                                placeholder={'Password'}
                                autoFocus
                                onKeyUp={this.passwordEntryHandler}
                                onInput={(e) => this.setState({
                                    password: e.currentTarget.value,
                                    passwordTyped: true,
                                    passwordError: ''
                                })}
                            />
                            {this.state.passwordError === '' ? '' : (
                                <Form.Text className={`d-block text-danger text-start text-input-error`}>
                                    {this.state.passwordError}
                                </Form.Text>
                            )}
                        </>
                    ) : (
                        <>
                            <p>
                                Your account's login method is {this.props.loginProvider}
                            </p>
                            <p className={'mb-0'}>
                                In order to delete your account, you'll be asked to re-authenticate
                                with {this.props.loginProvider}
                            </p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className={'justify-content-center'}>
                    {this.props.deleted ? (
                        <Button
                            variant="primary"
                            onClick={this.props.close}
                            autoFocus
                        >
                            Alright
                        </Button>
                    ) : (
                        <>
                            <div className={
                                "loading-flasher " + (this.props.deletingAccount || this.state.confirmingPassword ? 'visible' : '')
                            }/>
                            <Button
                                variant="success"
                                disabled={!this.formIsValid()}
                                onClick={() => {
                                    if (this.props.loginProvider === 'email and password') {
                                        this.deleteEmailPassAccount();
                                    } else {
                                        this.deleteSocialAccount()
                                    }
                                }}
                            >
                                Delete account
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        )
    }
}
