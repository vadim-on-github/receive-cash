import {Col, Container, Row} from "react-bootstrap";
import AddCryptoForm from "./AddCryptoForm";
import React from "react";
import PropTypes from 'prop-types';
import SortableCryptos from './SortableCryptos';
import {UnsortableCryptos} from "./UnsortableCryptos";
import BrowserTabTitle from "./BrowserTabTitle";

class Cryptos extends React.Component {
    componentDidMount() {
        this.props.clearNewPageFlds();
    }

    render() {
        return (
            <Container>
                <BrowserTabTitle
                    subtitle={this.props.pageSlug === 'draft' ? 'New cryptos page' : this.props.pageTitle}/>
                <Row className={'cryptos-page'}>
                    {this.props.pageSlug === 'draft' || this.props.loggedInUserIsOwner ? (
                        <>
                            <SortableCryptos {...this.props}/>
                            <Col xxxxs={12} xxxs={6} md={4} lg={3}>
                                <AddCryptoForm
                                    addCrypto={this.props.addCrypto}
                                    theme={this.props.theme}
                                    newCryptoNameError={this.props.newCryptoNameError}
                                    clearNewCryptoNameError={this.props.clearNewCryptoNameError}
                                    logging={this.props.logging}
                                />
                            </Col>
                        </>
                    ) : (
                        <UnsortableCryptos {...this.props} />
                    )}
                </Row>
            </Container>
        );
    }
}

export default Cryptos;
