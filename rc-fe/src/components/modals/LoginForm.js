import React, {Component} from 'react';
import Modal from "react-bootstrap/Modal";
import {Button, Col, Form, Row} from "react-bootstrap";
import {AuthButton} from "../AuthButton";

class LoginForm extends Component {
    setLoginEmail = (e) => {
        this.props.setLoginEmail(e.currentTarget.value.trim());
        this.props.setLoginEmailError('');
    }
    setLoginPass = (e) => {
        this.props.setLoginPass(e.currentTarget.value);
        this.props.setLoginPassError('');
    }
    setNewUserVerifCode = (e) => {
        this.props.setNewUserVerifCode(e.currentTarget.value.trim());
    }
    enterKeyHandler = (e) => {
        if (!(this.props.loginEmail === '' || this.props.loginPass === '')) {
            const code = (e.keyCode ? e.keyCode : e.which);
            if (code === 13) { //Enter keycode
                this.props.loginWithEmailPass()
            }
        }
    };

    render() {
        return (
            <Modal show={this.props.opened && !this.props.loggedIn}
                   dialogClassName={`${this.props.theme}-theme login-form ` + (
                       this.props.loggingInAsync ? 'loggingInAsync' : ''
                   )}
                   onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Log in with</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className={'mb-4'}>
                        Would you like to login with an email & password or one of the third-party identity providers?
                    </p>

                    <Row className={'method-columns'}>
                        <Col className={'email-pass-method'}>
                            <Form.Control
                                type='email'
                                placeholder='Email'
                                defaultValue={this.props.loginEmail}
                                onInput={this.setLoginEmail}
                                onKeyUp={this.enterKeyHandler}
                            />
                            <Form.Text className={'text-danger text-input-error d-block'}>
                                {this.props.loginEmailError}
                            </Form.Text>
                            <Form.Control
                                type='password'
                                placeholder='Password'
                                className={'mt-3'}
                                onInput={this.setLoginPass}
                                onKeyUp={this.enterKeyHandler}
                                autoFocus={this.props.loginEmail !== ''}
                            />
                            <Form.Text className={'text-danger text-input-error d-block'}>
                                {this.props.loginPassError}
                            </Form.Text>
                            <div className={'mt-3 d-flex'}>
                                <Button
                                    type='submit'
                                    variant='success'
                                    onClick={this.props.loginWithEmailPass}
                                    disabled={
                                        this.props.loginEmail === '' ||
                                        this.props.loginPass === '' ||
                                        this.props.loggingInAsync
                                    }
                                    className={
                                        'me-3 ' +
                                        (this.props.loggingInAsync ? 'loading' : '')
                                    }
                                >
                                    Enter
                                </Button>
                                <Button
                                    type={'button'}
                                    variant={'outline-secondary'}
                                    onClick={this.props.showResetPasswordModal}
                                >
                                    Recover
                                </Button>
                            </div>
                        </Col>
                        <Col className={'account-provider-method'}>
                            <div className='d-flex justify-content-center gap-3 '>
                                {['Google', 'Facebook', 'Twitter', 'GitHub'].map(provider => {
                                    return (
                                        <AuthButton
                                            key={provider}
                                            provider={provider}
                                            type={'login'}
                                            authenticateSocialUser={this.props.authenticateSocialUser}
                                            authenticatingSocialUserAsync={this.props.authenticatingSocialUserAsync}
                                            logOut={this.props.logOut}
                                            theme={this.props.theme}
                                        />
                                    )
                                })}
                            </div>

                        </Col>
                    </Row>
                </Modal.Body>
                {/*<Modal.Footer className={'justify-content-center'}>

        </Modal.Footer>*/}
            </Modal>
        );
    }
}

export default LoginForm;
