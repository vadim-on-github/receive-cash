import React, {Component} from "react";
import {Button, Card, Form} from "react-bootstrap";
import {NewPageFlds} from "./NewPageFlds";

export class NewUserPageForm extends Component {
    componentDidMount() {
        this.props.clearFlds();
    }

    handleFldKeyboardEntry = (e) => {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) { //Enter
            if (this.props.title.trim() !== '' && this.props.slug !== '') {
                this.props.save()
            }
        }
    }

    render() {
        return (
            <Card bg={this.props.theme} text={this.props.theme === "light" ? "dark" : "white"} className='mb-4'>
                <Card.Header as='h5' className={"text-center"}>
                    New cryptos page
                </Card.Header>
                <Card.Body>
                    <NewPageFlds
                        title={this.props.title}
                        slug={this.props.slug}
                        setTitle={this.props.setTitle}
                        setSlug={this.props.setSlug}
                        handleFldKeyboardEntry={this.handleFldKeyboardEntry}
                        slugAlreadyExists={this.props.slugAlreadyExists}
                    />
                    <div className='text-center mt-3'>
                        <Button
                            variant="success"
                            type='button'
                            disabled={this.props.title.trim() === '' || this.props.slug === '' || this.props.saving}
                            onClick={this.props.save}
                            className={this.props.saving ? 'loading' : ''}
                        >Create</Button>
                    </div>
                </Card.Body>
            </Card>
        );
    }
}
