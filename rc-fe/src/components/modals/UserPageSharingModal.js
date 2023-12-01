import React, {Component} from 'react';
import Modal from "react-bootstrap/Modal";
import {Button, Col, Row} from "react-bootstrap";
import ShareButton from "../ShareButton";
import {CopyToClipboard} from 'react-copy-to-clipboard';

class UserPageSharingModal extends Component {
    state = {
        linkCopied: false
    }

    render() {
        return (
            <Modal show={this.props.opened} dialogClassName={`${this.props.theme}-theme`}
                   onHide={this.props.closeSharingModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Share your page</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <Row className='justify-content-center'>
                        {['Facebook', 'Twitter', 'LinkedIn', 'Telegram', 'WhatsApp'].map(provider => {
                            return (
                                <Col xxxxs={2} key={provider}>
                                    <ShareButton network={provider}
                                                 link={process.env.REACT_APP_SITE_URL + '/' + this.props.pageSlug}
                                                 text={this.props.pageTitle}/>
                                </Col>
                            )
                        })}
                    </Row>

                    <div className="d-grid gap-2 mt-4">
                        <CopyToClipboard text={process.env.REACT_APP_SITE_URL + '/' + this.props.pageSlug}
                                         onCopy={() => {
                                             this.setState({linkCopied: true}, () => {
                                                 setTimeout(() => {
                                                     this.setState({linkCopied: false})
                                                 }, 2000);
                                             })
                                         }}
                        >
                            <Button
                                variant={this.state.linkCopied ? 'success' : 'secondary'}>{this.state.linkCopied ? 'Copied!' : 'Copy link'}</Button>
                        </CopyToClipboard>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

export default UserPageSharingModal;
