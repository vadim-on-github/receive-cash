import React, {Component} from 'react';
import {Button, Card, Form, Modal} from "react-bootstrap";
import {QRCodeSVG} from 'qrcode.react';
import {DeleteIcon} from "./icons/DeleteIcon";
import ShareButton from "./ShareButton";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {TickIcon} from "./icons/TickIcon";
import {CopyIcon} from "./icons/CopyIcon";

class Crypto extends Component {
    cancelSaveTimer = React.createRef();

    state = {
        headerHeight: 0,
        footerHeight: 0,
        bodyHeight: 0,
        QRshown: false,
        editing: false,
        addressCopied: false,
        forceOpened: false,
        address: '' //local state which later gets saved (copied) up the props
    }
    cardKeyboardPressHandler = (e) => {
        const keyCode = (e.keyCode ? e.keyCode : e.which);
        if (keyCode === 13) { // enter
            this.open();
        } else if (keyCode === 32 && !this.props.loggedInUserIsOwner) { // space
            this.open();
        }
    };

    componentDidMount() {
        this.setState({address: this.props.address})
    }

    addressInputEvent = (e) => {
        this.setState({address: e.currentTarget.value})
        clearTimeout(this.cancelSaveTimer);
        this.cancelSaveTimer = setTimeout(() => {
            this.save();
        }, 1000)
    };


    keyboardEntryHandler = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);

        if (code === 13 || code === 32) { // enter or space
            e.preventDefault()
            this.open();
        }
    }

    save = () => {
        this.props.updateCrypto({
            id: this.props.id,
            name: this.props.name,
            address: this.state.address,
            logo: this.props.logo
        });
    }

    delete = () => {
        this.props.deleteCrypto({
            id: this.props.id
        });
    }

    open = async (e) => {
        if (this.props.pageSlug) {
            this.props.navigate(`/${this.props.pageSlug}/${this.props.symbol.toLowerCase()}`)
        } else {
            await this.setState({forceOpened: true})
        }
        e.currentTarget.blur();
    }

    close = () => {
        if (this.props.pageSlug) {
            this.props.navigate(`/${this.props.pageSlug}`)
        } else {
            this.setState({forceOpened: false})
        }
    }

    render() {
        return (
            <>
                <Card
                    className={`crypto p-0` + (this.props.sortable ? '' : ' btn mb-4 ') + (this.props.updating ? 'updating' : '')}
                    bg={this.props.theme}
                    // style={{transform: `scale(${this.props.scale})`}}
                    text={this.props.theme === 'light' ? 'dark' : 'white'}
                    onClick={this.open}
                    tabIndex={this.props.sortable ? '-1' : 0}
                    onKeyDown={this.props.sortable ? () => {
                    } : this.keyboardEntryHandler}
                >
                    <Card.Header className={'text-center '}>
                        <span className='title'>{this.props.name} <sup>{this.props.symbol}</sup></span>
                    </Card.Header>
                    <Card.Body>
                        <div className="logo-wrapper">
                            <Card.Img className='logo' variant="top"
                                      src={`${process.env.REACT_APP_AUTH_HOST}/get_crypto_icon.php?name=${this.props.name}&symbol=${this.props.symbol}&default=${encodeURIComponent(this.props.logo)}`}
                            />
                        </div>
                    </Card.Body>
                </Card>

                <Modal
                    show={
                        this.props.requestedCrypto ?
                            (this.props.requestedCrypto.toLowerCase() === this.props.symbol.toLowerCase()) :
                            (this.state.forceOpened)
                    }
                    dialogClassName={`crypto ${this.props.theme}-theme`}
                    onHide={this.close}
                    size={'sm'}
                >
                    <Modal.Header closeButton>
                        <img
                            src={`${process.env.REACT_APP_AUTH_HOST}/get_crypto_icon.php?name=${this.props.name}&symbol=${this.props.symbol}&default=${encodeURIComponent(this.props.icon)}`}
                            alt='' className='me-2 logo'
                        />
                        <span className='title'>{this.props.name} <sup>{this.props.symbol}</sup></span>
                    </Modal.Header>
                    <Modal.Body className='text-center'>
                        <div className="address highlight-icon-on-hover">
                            <CopyToClipboard
                                text={this.props.address}
                                onCopy={() => {
                                    this.setState({addressCopied: true}, () => {
                                        setTimeout(() => {
                                            this.setState({addressCopied: false})
                                        }, 2000);
                                    })
                                }}
                            >
                                <QRCodeSVG
                                    style={{height: "auto", maxWidth: "100%", width: "100%"}}
                                    bgColor={this.props.theme === 'dark' ? '#212529' : '#f8f9fa'}
                                    fgColor={this.props.theme === 'dark' ? '#f8f9fa' : '#212529'}
                                    className='qr mb-3'
                                    value={this.props.address}
                                />
                            </CopyToClipboard>
                            <div>
                                {this.props.loggedInUserIsOwner || !this.props.pageSlug || this.props.pageSlug === 'draft' ? (
                                    <Form.Control as="textarea"
                                                  value={this.state.address}
                                                  placeholder={`Receiving address`}
                                                  style={{height: '7rem'}}
                                                  onInput={this.addressInputEvent}
                                    ></Form.Control>
                                ) : (

                                    <CopyToClipboard
                                        text={this.props.address}
                                        onCopy={() => {
                                            this.setState({addressCopied: true}, () => {
                                                setTimeout(() => {
                                                    this.setState({addressCopied: false})
                                                }, 2000);
                                            })
                                        }}
                                    >
                                        <div className={'text'}>
                                            {this.props.address} {this.state.addressCopied ?
                                            <TickIcon color={'green'} className={'dont-highlight-icon-on-hover'}/> :
                                            <CopyIcon/>}
                                        </div>

                                    </CopyToClipboard>
                                )}
                            </div>
                        </div>
                    </Modal.Body>


                    <Modal.Footer>
                        {this.props.loggedInUserIsOwner || this.props.pageSlug === 'draft' ? (
                            <Button variant='link' size='sm' onClick={this.delete} className='d-flex'>
                                <DeleteIcon/>
                            </Button>
                        ) : ''}
                        {
                            ['Facebook', 'Twitter', 'LinkedIn', 'Telegram', 'WhatsApp'].map((network) => {
                                return <ShareButton
                                    key={network}
                                    network={network}
                                    text={this.props.address}
                                    disabled={this.props.pageSlug === 'draft'}
                                    link={`${process.env.REACT_APP_SITE_URL}/${this.props.pageSlug}/${this.props.symbol}`}
                                />
                            })

                        }
                    </Modal.Footer>

                </Modal>
            </>
        );
    }
}

export default Crypto;
