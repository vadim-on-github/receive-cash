import React from "react";
import {Col} from "react-bootstrap";
import SortableCrypto from "./SortableCrypto";

export class LocalSortableCryptos extends React.Component {
    componentDidMount() {
        if (this.props.logging) console.log('mounting local sortable cryptos')
        this.props.loadLocalCryptos();
    }

    componentWillUnmount() {
        if (this.props.logging) console.log('unmounting local sortable cryptos')
    }

    render() {
        return this.props.cryptos.map((crypto) =>
            <Col xxxxs={6} md={4} lg={3}
                 key={crypto.id}
            >
                <SortableCrypto
                    id={crypto.id}
                    address={crypto.address}
                    icon={crypto.icon}
                    logo={crypto.logo}
                    name={crypto.name}
                    symbol={crypto.symbol}
                    beingDragged={false}
                    scale={1}
                    // ref={crypto.ref}
                    updating={this.props.cryptoBeingAddedAsync === crypto.id}
                    draggedCrypto={this.props.draggedCrypto}
                    theme={this.props.theme}
                    pageSlug={this.props.pageSlug}
                    allCryptos={this.props.cryptos}
                    updateCrypto={this.props.updateCrypto}
                    deleteCrypto={this.props.deleteCrypto}
                    loggedInUserIsOwner={this.props.loggedInUserIsOwner}
                    requestedCrypto={this.props.requestedCrypto}
                    navigate={this.props.navigate}
                    sortingAllowed={this.props.sortingAllowed}
                />
            </Col>
        )
    }
}
