import {Button, ButtonGroup, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import React from "react";

export function Credits(props) {
    return (
        <Container>
            <Row>
                <Col xxxxs={12} md={6} xl={4}>
                    <Card
                        className={'mb-4'}
                        bg={props.theme}
                        text={props.theme === 'light' ? 'dark' : 'white'}
                    >
                        <Card.Header>
                            <h2 className={'mb-0'}>Web development</h2>
                        </Card.Header>
                        <Card.Body>
                            This website was envisioned, prototyped, and initially developed by Vadim Haiduk
                        </Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item className={'bg-' + props.theme}>
                                <Card.Link href={'https://web.haiduk.org'} target={'_blank'}>
                                    web.haiduk.org
                                </Card.Link>
                            </ListGroup.Item>
                            <ListGroup.Item className={'bg-' + props.theme}>
                                <Card.Link href={'/vadim'}>
                                    receive.cash/vadim
                                </Card.Link>
                                {/*<NavLink
                                    to="/vadim"
                                    className={'card-link'}
                                >
                                    receive.cash/vadim
                                </NavLink>*/}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
                <Col xxxxs={12} md={6} xl={4}>
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
