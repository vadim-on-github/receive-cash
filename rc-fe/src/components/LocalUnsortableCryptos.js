import React from "react";
import {Col} from "react-bootstrap";
import Crypto from "./Crypto";

export class LocalUnsortableCryptos extends React.Component {
    componentDidMount() {
        if (this.props.logging) console.log('mounting local unsortable cryptos')
        this.props.loadLocalCryptos();
    }

    componentWillUnmount() {
        if (this.props.logging) console.log('unmounting local unsortable cryptos')
    }

    render() {
        return this.props.cryptos.map(crypto => {
            return (
                <Col xxxxs={6} md={4} lg={3}
                     key={crypto.id}>
                    <Crypto
                        name={crypto.name}
                        symbol={crypto.symbol}
                        address={crypto.address}
                        logo={crypto.logo}
                        icon={crypto.icon}
                        theme={this.props.theme}
                        ref={crypto.ref}
                        id={crypto.id}
                        pageSlug={this.props.pageSlug}
                        allCryptos={this.props.cryptos}
                        updateCrypto={this.props.updateCrypto}
                        deleteCrypto={this.props.deleteCrypto}
                        loggedInUserIsOwner={this.props.loggedInUserIsOwner}
                        requestedCrypto={this.props.requestedCrypto}
                        navigate={this.props.navigate}
                        updating={this.props.cryptoBeingAddedAsync === crypto.id}
                    />
                </Col>
            )
        });
    }
}
