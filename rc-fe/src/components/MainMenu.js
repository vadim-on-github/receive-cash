import React from "react";
import {Button, Dropdown, NavDropdown} from "react-bootstrap";
import {BurgerIcon} from "./icons/BurgerIcon";
import {KeyIcon} from "./icons/KeyIcon";
import {DeleteIcon} from "./icons/DeleteIcon";

export function MainMenu(props) {
    const CustomMenuToggle = React.forwardRef(({children, onClick}, ref) => (
        <Button id='main-menu-toggle'
                variant={'link'}
                className={'burger flex-shrink-0 flex-grow-1 d-flex align-items-center justify-content-center h-100'}
                ref={ref}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}>
            {/*children*/}
            <BurgerIcon/>
        </Button>
    ));

    return (
        <Dropdown className={'d-flex align-items-center justify-content-center'}>
            <Dropdown.Toggle as={CustomMenuToggle} variant="outline-secondary" id="main-menu-toggle">
                Menu
            </Dropdown.Toggle>

            <Dropdown.Menu variant={props.variant}>
                <NavDropdown.Item
                    onClick={() => {
                        props.navigate('/')
                    }}
                    disabled={props.body === 'home'}
                >
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path
                                d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>
                        </svg>
                    </span>
                    <span>Home</span>
                </NavDropdown.Item>
                <Dropdown.Item
                    onClick={() => props.navigate('/draft')}
                    disabled={props.params.pageSlug === 'draft'}
                >
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path
                                d="M320 464c8.8 0 16-7.2 16-16V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64z"/>
                        </svg>
                    </span>
                    <span>
                        Create a page
                    </span>
                </Dropdown.Item>
                {props.loggedIn ? (
                    <>
                        <NavDropdown.Item
                            onClick={props.navigateToMyPages}
                            disabled={props.body === 'userPages'}
                        >
                            <span className="icon">
                                <svg width="700pt" height="700pt" viewBox="0 0 700 700"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M580.736.006H285.71c-35.57 0-65.054 29.103-65.054 64.675v36.14h-19.783c-35.57 0-63.913 29.103-63.913 64.865v16.93h-17.69c-35.571 0-64.103 28.723-64.103 64.483v388.226c0 35.57 28.532 64.675 64.102 64.675h279.044c35.57 0 63.913-29.103 63.913-64.675v-17.12h17.5c35.57 0 64.293-28.723 64.293-64.293V534.51h36.712c35.57 0 64.102-29.865 64.102-65.435v-404.4C644.833 29.105 616.301 0 580.731 0zM408.969 635.328c0 6.277-4.375 11.413-10.652 11.413H119.273c-6.277 0-10.843-5.136-10.843-11.413V247.102c0-6.278 4.566-11.223 10.843-11.223h17.69V553.93c0 35.57 28.153 64.294 63.913 64.294h208.105zm81.793-81.412c0 6.277-4.756 11.032-11.033 11.032H200.877c-6.277 0-10.652-4.755-10.652-11.032V165.689c0-6.277 4.184-11.603 10.652-11.603h19.782v314.992c0 35.57 29.294 65.434 65.054 65.434h205.061zm100.816-84.077c0 6.277-5.136 11.413-11.414 11.413H285.33c-6.278 0-11.414-5.136-11.414-11.413V64.674c0-6.277 5.136-11.413 11.414-11.413h294.834c6.278 0 11.414 5.136 11.414 11.413z"
                                        style={{strokeWidth: 1.73913}}
                                    />
                                </svg>
                            </span>
                            <span>My pages</span>
                        </NavDropdown.Item>
                        {props.loginProvider === 'email and password' ? (
                            <>
                                <NavDropdown.Item onClick={props.openChangeEmailModal}>
                                    <span className="icon">
                                      <KeyIcon/>
                                    </span>
                                    <span>Change email</span>
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={props.openChangePasswordModal}>
                                    <span className="icon">
                                      <KeyIcon/>
                                    </span>
                                    <span>Change password</span>
                                </NavDropdown.Item>
                            </>
                        ) : ''}
                        <NavDropdown.Item onClick={props.openDeleteAccountModal}>
                            <span className="icon">
                              <DeleteIcon/>
                            </span>
                            <span>Delete account</span>
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={props.logOut}>
                            <span className="icon">
                              <svg xmlns="http://www.w3.org/2000/svg"
                                   viewBox="0 0 448 512">
                                <path
                                    d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"/>
                              </svg>
                            </span>
                            <span>Log out</span>
                        </NavDropdown.Item>
                    </>
                ) : (
                    <>
                        <Dropdown.Item onClick={props.open}>
                            <span className="icon">
                              <KeyIcon/>
                            </span>
                            <span>
                              Register
                            </span>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={props.openLoginForm}>
                            <span className="icon">
                              <svg xmlns="http://www.w3.org/2000/svg"
                                   viewBox="0 0 448 512">
                                <path
                                    d="M400 256H152V152.9c0-39.6 31.7-72.5 71.3-72.9 40-.4 72.7 32.1 72.7 72v16c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24v-16C376 68 307.5-.3 223.5 0 139.5.3 72 69.5 72 153.5V256H48c-26.5 0-48 21.5-48 48v160c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"
                                />
                                  {/*<path
                                  d="M423.5 0C339.5.3 272 69.5 272 153.5V224H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48h-48v-71.1c0-39.6 31.7-72.5 71.3-72.9 40-.4 72.7 32.1 72.7 72v80c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24v-80C576 68 507.5-.3 423.5 0z"
                                />*/}
                              </svg>
                            </span>
                            <span>Log in</span>
                        </Dropdown.Item>
                    </>
                )}
                {/*<Dropdown.Divider/>
                  <Dropdown.Item href="#action5">About</Dropdown.Item>
                  <Dropdown.Item href="#action5">Feedback</Dropdown.Item>
                  <Dropdown.Item href="#action5">Donate</Dropdown.Item>
                  <Dropdown.Item href="#action5">Contact</Dropdown.Item>*/}
            </Dropdown.Menu>
        </Dropdown>
    )
}
