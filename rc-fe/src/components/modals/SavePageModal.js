import React from "react";
import {Button, Modal} from "react-bootstrap";
import {NewPageFlds} from "../NewPageFlds";

class SavePageModal extends React.Component {
    handleFldKeyboardEntry = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) { //Enter
            if (this.props.title.trim() !== '' && this.props.slug !== '') {
                this.props.save()
            }
        }
    }

    render() {
        const cryptosInLocalStorage = window.localStorage.getItem('cryptos');

        return (
            <Modal show={this.props.opened}
                   dialogClassName={`${this.props.theme}-theme save-page-form ` + (
                       this.props.saving ? 'creating-page' : ''
                   )}
                   onHide={this.props.close}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Saving your page
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <NewPageFlds
                        title={this.props.title}
                        slug={this.props.slug}
                        setTitle={this.props.setTitle}
                        setSlug={this.props.setSlug}
                        handleFldKeyboardEntry={this.handleFldKeyboardEntry}
                        slugAlreadyExists={this.props.slugAlreadyExists}
                        autoFocusOnTitle={true}
                    />
                </Modal.Body>
                <Modal.Footer className={'justify-content-center'}>
                    <Button
                        type='button'
                        variant='success'
                        disabled={!cryptosInLocalStorage || this.props.title === '' || this.props.slug === '' || this.props.saving}
                        onClick={this.props.save}
                        className={this.props.saving ? 'loading' : ''}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default SavePageModal;
