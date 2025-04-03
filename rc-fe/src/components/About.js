import {Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import React from "react";

export function About(props) {
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
              <h2 className={'mb-0'}>About</h2>
            </Card.Header>
            <Card.Body>
              <p>This project was launched in 2023 to ease crypto transactions</p>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className={'bg-' + props.theme}>
                <Card.Link href={'https://github.com/vadim-on-github/receive-cash'} target={'_blank'}>
                  Open source on GitHub
                </Card.Link>
              </ListGroup.Item>
              <ListGroup.Item className={'bg-' + props.theme}>
                <Card.Link href={'https://memo.cash/profile/1MAGxXBnqxuQ18aeiHtRVCaewSVjQSGbKe'}
                           target={'_blank'}>
                  Social at Memo.cash
                </Card.Link>
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
              <h2 className={'mb-0'}>Cryptos</h2>
            </Card.Header>
            <Card.Body>
              <p>Coin logos are sourced from <a href={'https://cryptologos.cc'} target={'_blank'}>CryptoLogos.cc</a></p>
              <p>
                Crypto search as well as more logos are provided by <a href={'https://coingecko.com'}
                                                                       target={'_blank'}>CoinGecko</a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
