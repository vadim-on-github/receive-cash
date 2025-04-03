import React, {Component} from 'react';
import {Alert, Button, Col, Form, Modal, Row} from "react-bootstrap";
import {AuthButton} from "../AuthButton";
import {TickIcon} from "../icons/TickIcon";

class RegistrationForm extends Component {
    state = {
        onExitedCallback: () => {
        }
    }

    setEmail = (e) => {
        this.props.setEmail(e);
        this.props.setEmailError('');
    }
    setVerifCode = (e) => {
        this.props.setVerifCode(e);
        this.props.setVerifError('');
    }

    emailKeyboardEntry = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) { //Enter
            if (this.props.email !== '') {
                this.props.sendVerifCode()
            }
        }
    };

    verifCodeKeyboardEntry = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) { //Enter
            if (this.props.verifCode !== '') {
                this.props.verify()
            }
        }
    };

    passwordKeyboardEntry = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) { //Enter keycode
            if (this.props.pass !== '') {
                this.props.savePass()
            }
        }
    };

    render() {
        return (
            <Modal
                show={this.props.opened}
                dialogClassName={
                    `${this.props.theme}-theme reg-form ` +
                    (this.props.registering ? 'registeringUser' : '') +
                    (this.props.offeredToLogin ? ' offeredToLogin ' : '') +
                    (this.props.socialUserRegistered ? ' socialUserRegistered ' : '') +
                    (this.props.registered && this.props.verified && this.props.passwordSet ? ' accountCreated ' : '')
                }
                onHide={this.props.close}
                size={this.props.loggedIn || this.props.offeredToLogin || this.props.socialUserRegistered || (this.props.registered && this.props.verified && this.props.passwordSet) ? 'sm' : 'lg'}
                onExited={() => {
                    this.state.onExitedCallback();
                    if (this.props.verified) {
                        this.props.deverify();
                    }
                    if (this.props.offeredToLogin || this.props.loggedIn) {
                        this.props.cancelReg();
                    }
                    this.props.forgetSocialUserRegistered();
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        New account
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {this.props.socialUserRegistered || this.props.passwordSet ? (
                        <Alert
                            className={'mb-0'}
                            variant={'success'}
                        >
                            Account created and you're now logged in
                        </Alert>
                    ) : (
                        <>
                            {!(this.props.registered && this.props.verified && this.props.passwordSet) && !this.props.offeredToLogin ?
                                <p className={'mb-4'}>
                                    Would you like to use your email & password as a login method or one of the
                                    third-party identity providers for faster login?
                                </p>
                                : ''}
                            <Row className={'method-columns'}>
                                <Col className={'email-pass-method'}>
                                    {!this.props.registered && !this.props.verified && !this.props.passwordSet ? (
                                        <>
                                            <Form.Control
                                                type='email'
                                                placeholder='Email address'
                                                disabled={this.props.registering || this.props.authenticatingSocialUserAsync !== null}
                                                value={this.props.email}
                                                onInput={this.setEmail}
                                                onKeyUp={this.emailKeyboardEntry}
                                            />

                                            {this.props.emailError !== '' ? (
                                                <Form.Text
                                                    className={'text-danger text-start text-input-error d-block'}>
                                                    {this.props.emailError}
                                                </Form.Text>
                                            ) : ''}

                                            <div className="d-flex mt-3 align-items-center">
                                                <Button
                                                    disabled={this.props.registering || this.props.email === ''}
                                                    type='button'
                                                    variant={'success'}
                                                    onClick={this.props.sendVerifCode}
                                                >Send verification code</Button>
                                                <div
                                                    className={"loading-flasher " + (this.props.registering ? 'visible' : '')}></div>
                                            </div>
                                        </>
                                    ) : ''}

                                    {this.props.registered && !this.props.verified && !this.props.passwordSet ? (
                                        <>
                                            <Form.Group className="mb-3" controlId="verifCode">
                                                <Form.Label>{this.props.email}</Form.Label>
                                                <Form.Control
                                                    placeholder='Verification code'
                                                    type='text'
                                                    autoFocus
                                                    disabled={this.props.registering}
                                                    onInput={this.setVerifCode}
                                                    onKeyUp={this.verifCodeKeyboardEntry}
                                                />
                                                {this.props.verifError !== '' ? (
                                                    <Form.Text
                                                        className={'text-danger text-start text-input-error d-block'}>
                                                        {this.props.verifError}
                                                    </Form.Text>
                                                ) : ''}
                                            </Form.Group>
                                            <div className="d-flex mt-3 align-items-center">
                                                <div>
                                                    <Button
                                                        type='button'
                                                        disabled={this.props.registering || this.props.verifCode === ''}
                                                        variant={'success'}
                                                        onClick={this.props.verify}
                                                    >
                                                        Verify the email
                                                    </Button>
                                                    <Button
                                                        type='button'
                                                        className={'ms-3'}
                                                        variant={'outline-secondary'}
                                                        onClick={this.props.cancelReg}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                                <div
                                                    className={"loading-flasher " + (this.props.registering ? 'visible' : '')}></div>
                                            </div>
                                        </>
                                    ) : ''}

                                    {this.props.registered && this.props.verified && !this.props.passwordSet ? (
                                        <>
                                            <Form.Group className="mb-3" controlId="password">
                                                <Form.Label>
                                                    {this.props.email}
                                                    <TickIcon width={12} height={12} color={'green'}
                                                              className={'d-inline-block ms-2'}/>
                                                </Form.Label>
                                                <Form.Control
                                                    type='password'
                                                    placeholder='Password'
                                                    autoFocus
                                                    disabled={this.props.registering}
                                                    onInput={this.props.setPass}
                                                    onKeyUp={this.passwordKeyboardEntry}
                                                />
                                            </Form.Group>

                                            <div className="d-flex mt-3 align-items-center">
                                                <div>
                                                    <Button
                                                        type='button'
                                                        variant={'success'}
                                                        onClick={this.props.savePass}
                                                        disabled={this.props.pass === ''}
                                                    >
                                                        Create account
                                                    </Button>
                                                    <Button
                                                        type='button'
                                                        className={'ms-3'}
                                                        variant={'outline-secondary'}
                                                        onClick={this.props.cancelReg}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                                <div
                                                    className={"loading-flasher " + (this.props.registering ? 'visible' : '')}></div>
                                            </div>
                                        </>
                                    ) : ''}

                                    {this.props.offeredToLogin ? (
                                        <p className={'mb-0'}>
                                            {this.props.email} is already registered & verified. Would you like to
                                            log in with it?
                                        </p>
                                    ) : (
                                        <Form.Text className={'text-start d-block mt-3'}>
                                            This is a more secure type of account. We only store encrypted versions of
                                            your email address and password
                                        </Form.Text>
                                    )}
                                </Col>
                                {!this.props.passwordSet ?
                                    <Col className={'account-provider-method'}>
                                        <div className='d-flex justify-content-center gap-3 '>
                                            {['Google', 'Facebook', 'Twitter', 'GitHub'].map(provider => {
                                                return (
                                                    <AuthButton
                                                        provider={provider}
                                                        key={provider}
                                                        type={'register'}
                                                        disabled={this.props.registering || this.props.registered}
                                                        cancelReg={this.props.cancelReg}
                                                        authenticateSocialUser={this.props.authenticateSocialUser}
                                                        authenticatingSocialUserAsync={this.props.authenticatingSocialUserAsync}
                                                        authProvider={this.props.authProvider}
                                                        logOut={this.props.logOut}
                                                        theme={this.props.theme}
                                                    />
                                                )
                                            })}
                                        </div>
                                    </Col>
                                    : ''}
                            </Row>
                        </>
                    )}
                </Modal.Body>
                {(this.props.registered && this.props.verified && this.props.passwordSet && !this.props.offeredToLogin) || this.props.socialUserRegistered ? (
                    <Modal.Footer className={'justify-content-center'}>
                        <Button
                            type='button'
                            variant={'primary'}
                            onClick={this.props.close}
                            autoFocus
                        >Cool!</Button>
                    </Modal.Footer>
                ) : this.props.offeredToLogin ? (
                    <Modal.Footer className={'justify-content-center'}>
                        <Button
                            type='button'
                            variant={'success'}
                            autoFocus
                            onClick={() => {
                                this.props.close();
                                this.props.setLoginEmail(this.props.email);
                                this.props.openLoginForm();
                            }}
                        >Yes, log in</Button>
                        <Button
                            type='button'
                            className={'ms-3'}
                            variant={'outline-secondary'}
                            onClick={this.props.cancelReg}
                        >No</Button>
                        <div className={"loading-flasher " + (this.props.registering ? 'visible' : '')}></div>
                    </Modal.Footer>
                ) : ''}
            </Modal>
        );
    }
}

export default RegistrationForm;
