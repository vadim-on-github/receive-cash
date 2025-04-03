import React from "react";
import {LocalUnsortableCryptos} from "./LocalUnsortableCryptos";
import {CloudUnsortableCryptos} from "./CloudUnsortableCryptos";

export class UnsortableCryptos extends React.Component {
    render() {
        return this.props.pageSlug === 'draft' ? (
            <LocalUnsortableCryptos {...this.props} />
        ) : (
            <CloudUnsortableCryptos {...this.props} />
        );
    }
}
