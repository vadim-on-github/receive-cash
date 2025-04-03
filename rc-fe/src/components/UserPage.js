import React, {Component} from "react";
import {Button, Card, Col, Dropdown, Form, InputGroup, ListGroup, Row} from "react-bootstrap";
import {DeleteIcon} from "./icons/DeleteIcon";
import {CrossIcon} from "./icons/CrossIcon";
import {TickIcon} from "./icons/TickIcon";
import {PencilIcon} from "./icons/PencilIcon";
import {CryptoIcon} from "./icons/CryptoIcon";
import ShareDropdownItem from "./ShareDropdownItem";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {CopyIcon} from "./icons/CopyIcon";

export class UserPage extends Component {
    state = {
        editing: false,
        sharingModalOpened: false,
        linkCopied: false,
        newTitle: this.props.page.title,
        newSlug: this.props.page.id
    }

    titleEditFld = React.createRef();
    slugEditFld = React.createRef();
    trashOrCancelEditingBtn = React.createRef();

    save = () => {
        const page = this.props.page;
        const flds = {
            title: this.state.newTitle,
        }
        if (page.id !== this.state.newSlug) {
            flds.newSlug = this.state.newSlug;
        }
        if (page.id !== this.state.newSlug || page.title !== flds.title) {
            this.props.save(page.id, page, flds).then((success) => {
                if (success) {
                    this.setState({editing: false});
                }
            }).catch(err => {
                console.error("Page update error:")
                console.error(err)
            });
        } else {
            this.setState({editing: false});
        }
    }

    startEditing = async () => {
        await this.setState({editing: true});
        this.titleEditFld.current.focus()
    }

    cancelEditing = () => {
        this.setState({
            editing: false,
            newTitle: this.props.page.title,
            newSlug: this.props.page.id
        });
        this.trashOrCancelEditingBtn.current.blur()
    }

    formIsValid() {
        return !this.props.saving && this.state.newTitle.trim() !== '' && this.state.newSlug !== ''
    }


    fldKeyboardPress = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);

        if (code === 13) { //Enter keycode
            if (this.formIsValid()) {
                this.save();
            }
        } else if (code === 27) { //Esc keycode
            this.cancelEditing();
        }
    }

    openSharingModal = () => {
        this.setState({sharingModalOpened: true})
    }

    closeSharingModal = () => {
        this.setState({sharingModalOpened: false})
    }

    render() {
        const page = this.props.page;
        const listGroupItemClass = `bg-${this.props.theme} text-${this.props.theme === "dark" ? "light" : "dark"}`;

        const colPropsDt = {
            xxs: 5,
            xs: 3,
            sm: 12,
            xl: 4,
            xxl: 3,
        }
        const colPropsDd = {
            xxs: 7,
            xs: 9,
            sm: 12,
            xl: 8,
            xxl: 9,
        }
        return (
            <>
                <Card
                    bg={this.props.theme}
                    text={this.props.theme === "light" ? "dark" : "white"}
                    className={`user-page mb-4` + (this.props.saving ? ' loading' : '')}
                >
                    <Card.Header className={"text-center d-flex justify-content-between align-items-center"}>
                        <Button
                            ref={this.trashOrCancelEditingBtn}
                            variant='link'
                            size='sm'
                            className='d-flex'
                            disabled={this.props.saving}
                            onClick={() => {
                                if (this.state.editing) {
                                    this.cancelEditing();
                                } else {
                                    if (page.draft) {
                                        this.props.confirmModal(
                                            "Are you sure you want to delete your draft page?",
                                            this.props.deleteDraftPage
                                        )
                                    } else {
                                        this.props.confirmModal(
                                            "Are you sure you want to delete page titled " + page.title + "?",
                                            () => {
                                                this.props.delete(page.id, page.owner)
                                            }
                                        )
                                    }
                                }
                            }
                            }
                        >
                            {this.state.editing ? <CrossIcon/> : <DeleteIcon/>}
                        </Button>
                        {this.state.editing ? (
                            <Form.Control
                                className='user-page-slug-edit-fld ms-2 me-2 text-center'
                                type='text'
                                ref={this.titleEditFld}
                                placeholder={"Page title"}
                                value={page.draft ? 'Draft' : this.state.newTitle}
                                onInput={(e) => this.setState({newTitle: e.currentTarget.value})}
                                disabled={this.props.saving}
                                onKeyUp={this.fldKeyboardPress}
                            />
                        ) : (
                            <span className="title">{page.draft ? 'Draft' : page.title}</span>
                        )}
                        <Button
                            variant='link'
                            size='sm'
                            onClick={this.state.editing ? this.save : this.startEditing}
                            className={'d-flex ' + (page.draft ? 'opacity-0' : '')}
                            disabled={page.draft ? true : this.state.editing ? !this.formIsValid() : false}
                        >
                            {this.state.editing ? <TickIcon/> : <PencilIcon/>}
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <div className="cryptos">
                            {page.cryptos ? (page.cryptos.length ? page.cryptos.map(crypto => {
                                    return (
                                        <CryptoIcon key={crypto.id} src={crypto.icon} name={crypto.name}/>
                                    )
                                }) : <span className='text-warning text-center'>No cryptos</span>) :
                                <span className='text-warning text-center'>No cryptos</span>}
                        </div>
                    </Card.Body>
                    {page.draft ? '' : (
                        <ListGroup className={`list-group-flush`}>
                            <ListGroup.Item className={listGroupItemClass}>
                                <Row className='align-items-center'>
                                    <Col {...colPropsDt} className='fw-bold'>
                                        Link:
                                    </Col>
                                    <Col {...colPropsDd}>
                                        {this.state.editing ? (
                                            <>
                                                <InputGroup>
                                                    <InputGroup.Text id="url_beginning">
                                                        {process.env.REACT_APP_SITE_URL}/
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        ref={this.slugEditFld}
                                                        id='page_slug'
                                                        disabled={this.props.saving}
                                                        aria-describedby="url_beginning"
                                                        placeholder='page-name'
                                                        value={this.state.newSlug}
                                                        onInput={(e) => {
                                                            this.props.clearPageLinkError(page.id);
                                                            this.setState({newSlug: e.currentTarget.value.replace(/[^a-zA-Z0-9\-_]/, '')})
                                                        }}
                                                        onKeyUp={this.fldKeyboardPress}
                                                    />
                                                </InputGroup>
                                                <Form.Text
                                                    className={'text-danger text-start text-input-error d-block ps-2'}>
                                                    {this.props.pageLinkError.slug === this.props.page.id ? this.props.pageLinkError.text : ''}
                                                </Form.Text>
                                            </>
                                        ) : (
                                            <CopyToClipboard
                                                text={'https://' + process.env.REACT_APP_SITE_URL + '/' + page.id}
                                                onCopy={() => {
                                                    this.setState({linkCopied: true}, () => {
                                                        setTimeout(() => {
                                                            this.setState({linkCopied: false})
                                                        }, 2000);
                                                    })
                                                }}
                                                onKeyUp={e => {
                                                    const code = (e.keyCode ? e.keyCode : e.which);
                                                    if (code === 13 || code === 32) {
                                                        e.currentTarget.click();
                                                    }
                                                }}
                                                tabIndex={0}
                                            >
                                                <div
                                                    className={'page-link btn d-flex align-items-center gap-2 highlight-icon-on-hover'}
                                                    style={{cursor: 'pointer'}}
                                                >
                                                    <div>
                                                        <span className="text-muted">
                                                            {process.env.REACT_APP_SITE_URL}/
                                                        </span>
                                                        {page.id}
                                                    </div>

                                                    {this.state.linkCopied ?
                                                        <TickIcon
                                                            className={'tick dont-highlight-icon-on-hover'}
                                                            width={16}
                                                            height={16}
                                                        /> :
                                                        <CopyIcon width={16} height={16}/>}
                                                </div>
                                            </CopyToClipboard>
                                        )}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item className={listGroupItemClass}>
                                <Row>
                                    <Col {...colPropsDt} className='fw-bold'>
                                        Created:
                                    </Col>
                                    <Col {...colPropsDd}>
                                        {this.props.creationDate}
                                        <span className="text-muted"> / </span>
                                        <span className={'text-nowrap'}>{this.props.creationTime}</span>
                                    </Col>
                                </Row>

                            </ListGroup.Item>
                            <ListGroup.Item className={listGroupItemClass}>
                                <Row>
                                    <Col {...colPropsDt} className='fw-bold'>
                                        Updated:
                                    </Col>
                                    <Col {...colPropsDd}>
                                        {this.props.updateDate}
                                        <span className="text-muted"> / </span>
                                        <span className={'text-nowrap'}>{this.props.updateTime}</span>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    )}
                    <Card.Body>
                        <Row className='justify-content-center'>
                            <Col xxxxs={6} className='pe-2'>
                                <Button variant='outline-primary' className='w-100' onClick={() => {
                                    this.props.navigate(`/${page.id}`)
                                }}>Open</Button>
                            </Col>
                            {page.draft ? '' : (
                                <Col xxxxs={6} className='ps-2'>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-primary" className='w-100'
                                                         id="dropdown-basic">
                                            Share
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu variant={this.props.theme}>
                                            {['Facebook', 'Twitter', 'LinkedIn', 'Telegram', 'WhatsApp'].map(provider => {
                                                return (
                                                    <ShareDropdownItem
                                                        key={provider}
                                                        network={provider}
                                                        link={process.env.REACT_APP_SITE_URL + '/' + this.props.page.id}
                                                        text={this.props.page.title}
                                                    />
                                                )
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            )}
                        </Row>
                    </Card.Body>
                </Card>
            </>
        );
    }
}
