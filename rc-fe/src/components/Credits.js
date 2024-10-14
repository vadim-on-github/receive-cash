import {Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import React from "react";

export function Credits(props) {
    return (
        <Container>
            <Row>
                <Col xxxxs={12} md={6} xl={3}>
                    <Card
                        className={'mb-4'}
                        bg={props.theme}
                        text={props.theme === 'light' ? 'dark' : 'white'}
                    >
                        <Card.Header>
                            <h2 className={'mb-0'}>Development</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>This project was started by&nbsp;
                                <a href={'https://web.haiduk.org'} target={'_blank'}>
                                    Vadim&nbsp;H
                                </a>
                                &nbsp;and is now open-source
                            </p>
                        </Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item className={'bg-' + props.theme}>
                                <Card.Link href={'https://github.com/vadim-on-github/receive-cash'} target={'_blank'}>
                                    GitHub
                                </Card.Link>
                            </ListGroup.Item>
                            <ListGroup.Item className={'bg-' + props.theme}>
                                <Card.Link href={'https://memo.cash/profile/1MAGxXBnqxuQ18aeiHtRVCaewSVjQSGbKe'}
                                           target={'_blank'}>
                                    Memo.cash
                                </Card.Link>
                            </ListGroup.Item>
                            <ListGroup.Item className={'bg-' + props.theme}>
                                <NavLink
                                    to="/donations"
                                    className={'card-link'}
                                >
                                    Donations
                                </NavLink>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
                <Col xxxxs={12} md={6} xl={3}>
                    <Card
                        className={'mb-4'}
                        bg={props.theme}
                        text={props.theme === 'light' ? 'dark' : 'white'}
                    >
                        <Card.Header>
                            <h2 className={'mb-0'}>Crypto logos</h2>
                        </Card.Header>
                        <Card.Body>
                            Coin logos are sourced from CryptoLogos.cc, and as a backup via an API provided by CoinGecko
                        </Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item className={'bg-' + props.theme}>
                                <Card.Link href={'https://cryptologos.cc/'} target={"_blank"}>
                                    cryptologos.cc
                                </Card.Link>
                            </ListGroup.Item>
                            <ListGroup.Item className={'bg-' + props.theme}>
                                <Card.Link href={'https://coingecko.com'} target={"_blank"}>
                                    coingecko.com
                                </Card.Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
