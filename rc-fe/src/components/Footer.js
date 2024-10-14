import React, {useState} from "react";
import {Nav, Navbar} from "react-bootstrap";
import {NavLink} from "react-router-dom";

export function Footer(props) {
    const [emailShown, setEmailShown] = useState(false);
    return <footer className={`footer mt-auto`}>
        <Navbar bg={props.theme} variant={props.theme} data-bs-theme={props.theme}>
            <div className="container">
                <Navbar.Brand href="/" onClick={(e) => {
                    e.preventDefault()
                    props.navigate('/')
                }
                }>
                    <span className={'text-muted'}>{process.env.REACT_APP_SITE_NAME} </span>
                    <code className={'text-warning'}>beta</code>
                </Navbar.Brand>
                <Nav>
                    {emailShown ? (
                        <Nav.Link href={"mailto:support[at]receive.cash".replace('[at]', '@')}>
                            {"support[at]receive.cash".replace('[at]', '@')}
                        </Nav.Link>
                    ) : (
                        <Nav.Link onClick={e => {
                            e.preventDefault()
                            setEmailShown(true);
                        }} href={'/support'}>Support</Nav.Link>
                    )}
                    <NavLink
                        to="/privacy"
                        className={'nav-link'}
                    >Privacy</NavLink>
                    <NavLink
                        to="/credits"
                        className={'nav-link'}
                    >Credits</NavLink>
                </Nav>
            </div>
        </Navbar>
    </footer>;
}
