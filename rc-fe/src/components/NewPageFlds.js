import {Form, InputGroup} from "react-bootstrap";
import React from "react";

export class NewPageFlds extends React.Component {
    render() {
        return <>
            <Form.Control
                type="text"
                placeholder={"Page Title"}
                onInput={this.props.setTitle}
                value={this.props.title}
                onKeyUp={this.props.handleFldKeyboardEntry}
                autoFocus={this.props.autoFocusOnTitle}
            />
            <InputGroup className="mt-3">
                <InputGroup.Text id="url_addon">
                    {process.env.REACT_APP_SITE_URL}/
                </InputGroup.Text>
                <Form.Control
                    placeholder="page-name"
                    onInput={this.props.setSlug}
                    aria-describedby="url_addon"
                    value={this.props.slug}
                    onKeyUp={this.props.handleFldKeyboardEntry}
                />
            </InputGroup>
            <Form.Text
                className={`${this.props.slugAlreadyExists ? 'd-block' : 'hidden'} text-danger text-start text-input-error`}>
                Page with this link already exists
            </Form.Text>
        </>;
    }
}
