import Jumbotron from "./Jumbotron";
import {Button, Card, Col, Container, Row} from "react-bootstrap";

export function Privacy(props) {
    return (
        <>
            <Container>
                <Row>
                    <Col xxxxs={12} md={6} lg={4}>
                        <Card
                            bg={props.theme}
                            text={props.theme === 'light' ? 'dark' : 'white'}
                            className={'mb-3'}
                        >
                            <Card.Header>
                                <h2 className={'mb-0'}>Information storage</h2>
                            </Card.Header>
                            <Card.Body>
                                <p>When a new page is created as a draft, the crypto addresses are stored in the web
                                    browser's local storage. Caution must be exercised before leaving the device
                                    unattended</p>
                                <p>We utilize Google Firebase Firestore Database to save and access user pages' URLs,
                                    titles, cryptocurrency names, symbols, and addresses.
                                    However, unless the user registers an account using one of the provided identity
                                    providers (e.g. Facebook, Google, etc.),
                                    personal information (email address) is not stored on Google's servers but only an
                                    encrypted hash of the email address</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xxxxs={12} md={6} lg={4}>
                        <Card
                            bg={props.theme}
                            text={props.theme === 'light' ? 'dark' : 'white'}
                            className={'mb-3'}
                        >
                            <Card.Header>
                                <h2 className={'mb-0'}>Authentication</h2>
                                <div>email & password</div>
                            </Card.Header>
                            <Card.Body>
                                When a user registers an account on our website using an email address, the email
                                address itself is never
                                saved in plain form, but only an encrypted version of it is saved on our own servers as
                                well as the Google servers
                                in order to utilize Google Firebase services on this website. Whenever a user provides
                                an email address
                                during account registration on this website, the email address is never revealed to us
                                nor to any third-parties
                                in plain form - it is always encrypted before saving. The email address is used for the
                                sole purpose of password
                                recovery
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xxxxs={12} md={6} lg={4}>
                        <Card
                            bg={props.theme}
                            text={props.theme === 'light' ? 'dark' : 'white'}
                            className={'mb-3'}
                        >
                            <Card.Header>
                                <h2 className={'mb-0'}>Authentication</h2>
                                <div>via social networks</div>
                            </Card.Header>
                            <Card.Body>
                                When a user registers an account on our website using one of the provided identity
                                providers such as Facebook,
                                Google, and others, some identifying information is stored on Google's servers as a
                                result. This is why
                                we recommend to always choose the email/password method of account login during
                                registration
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
