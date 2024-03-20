import React from "react";
import {Button, Modal} from "react-bootstrap";

export class ConfirmModal extends React.Component {
    render() {
        return (
            <Modal dialogClassName={`${this.props.theme}-theme`} size={'sm'} show={this.props.shown}
                   onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.text}</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={this.props.close}>
                        No
                    </Button>
                    <Button variant="danger" onClick={() => {
                        this.props.action();
                        this.props.close();
                    }}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
