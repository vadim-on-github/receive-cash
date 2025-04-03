import React, {Component} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import * as PropTypes from "prop-types";
import {UserPage} from "./UserPage";
import {db} from '../firebase-config';
import {deleteDoc, doc, setDoc, updateDoc} from 'firebase/firestore';
import {NewUserPageForm} from "./NewUserPageForm";
import BrowserTabTitle from "./BrowserTabTitle";

UserPage.propTypes = {
    bg: PropTypes.any,
    page: PropTypes.any,
    callbackfn: PropTypes.func,
    creationDate: PropTypes.string,
    creationTime: PropTypes.string,
    updateDate: PropTypes.string,
    updateTime: PropTypes.string
};

class UserPages extends Component {
    state = {
        pageLinkError: {
            slug: '',
            text: ''
        },
        pageIdBeingSaved: null
    }

    componentDidMount() {
        this.props.getUserPages()
        this.props.emptyCryptos();
    }

    savePage = async (id, origFlds, flds) => {
        const newSlugIsValid = await this.props.newUserPageSlugIsValid(flds.newSlug);
        if (!newSlugIsValid) {
            await this.setState({
                pageLinkError: {
                    slug: id,
                    text: 'Page with this link already exists',
                    pageIdBeingSaved: null
                }
            })
            return false;
        }
        await this.setState({pageIdBeingSaved: id})

        const origFldsWithoutId = {...origFlds};
        delete origFldsWithoutId.id;
        if (flds.newSlug) {
            await setDoc(doc(db, `pages/${flds.newSlug}`), {
                ...origFldsWithoutId,
                title: flds.title,
                updateEpoch: Date.now()
            })
            await deleteDoc(doc(db, `pages/${id}`));
        } else {
            await updateDoc(doc(db, `pages/${id}`), {title: flds.title, updateEpoch: Date.now()});
        }

        const newPages = [];

        this.props.pages.forEach((page) => {
            if (id === page.id) {
                if (flds.newSlug) {
                    newPages.push({
                        ...origFlds,
                        id: flds.newSlug,
                        title: flds.title,
                        updateEpoch: Date.now()
                    })
                } else {
                    newPages.push({
                        ...origFlds,
                        title: flds.title,
                        updateEpoch: Date.now()
                    })
                }
            } else {
                newPages.push(page);
            }
        })
        this.props.setPages(newPages)
        this.setState({pageIdBeingSaved: null})

        return true;
    }

    clearPageLinkError = (slug) => {
        if (this.state.pageLinkError.slug === slug) {
            this.setState({pageLinkError: {slud: '', text: ''}});
        }
    }

    render() {
        return (
            <>
                <BrowserTabTitle subtitle={'Your pages'}/>
                <Container className={'user-pages'}>
                    <Row>
                        {this.props.pages.map(page => {
                            const locale = "en-CA";
                            const dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
                            const timeOptions = {hour: 'numeric', minute: '2-digit'}
                            const creationEpoch = new Date(page.creationEpoch);
                            const creationDate = creationEpoch.toLocaleDateString(locale, dateOptions);
                            const creationTime = creationEpoch.toLocaleTimeString(locale, timeOptions);
                            const updateEpoch = new Date(page.updateEpoch);
                            const updateDate = updateEpoch.toLocaleDateString(locale, dateOptions);
                            const updateTime = updateEpoch.toLocaleTimeString(locale, timeOptions);
                            return (
                                <Col key={page.id} xs={12} sm={6} lg={4}>
                                    <UserPage
                                        theme={this.props.theme}
                                        page={page}
                                        creationDate={creationDate}
                                        creationTime={creationTime}
                                        updateDate={updateDate}
                                        updateTime={updateTime}
                                        navigate={this.props.navigate}
                                        save={this.savePage}
                                        saving={this.state.pageIdBeingSaved === page.id || this.props.pageBeingDeleted === page.id}
                                        delete={this.props.deleteUserPage}
                                        deleteDraftPage={this.props.deleteDraftPage}
                                        pageLinkError={this.state.pageLinkError}
                                        clearPageLinkError={this.clearPageLinkError}
                                        confirmModal={this.props.confirmModal}
                                        saveCryptosToLocalStorage={this.props.saveCryptosToLocalStorage}
                                    />
                                </Col>
                            )
                        })}
                        <Col xs={12} sm={6} lg={4}>
                            <NewUserPageForm
                                theme={this.props.theme}
                                slugAlreadyExists={this.props.slugBeingSavedAlreadyExists}
                                title={this.props.newPageTitle}
                                slug={this.props.newPageSlug}
                                setTitle={this.props.setNewPageTitle}
                                setSlug={this.props.setNewPageSlug}
                                save={this.props.savePage}
                                saving={this.props.savingPage}
                                loggedInUser={this.props.loggedInUser}
                                clearFlds={this.props.clearNewPageFlds}
                            />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default UserPages;
