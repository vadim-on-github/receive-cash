import React from "react";
import {Button, ButtonGroup, Container, Navbar} from "react-bootstrap";
import {MainMenu} from "./MainMenu";
import {LightSwitch} from "./LightSwitch";
import {FloppyIcon} from "./icons/FloppyIcon";
import {NavLink} from "react-router-dom";


class Header extends React.Component {
  themeSwitcher = React.createRef();
  // The forwardRef is important!!
  // Dropdown needs access to the DOM node in order to position the Menu

  setTheme = () => {
    if (this.themeSwitcher.current.checked) {
      this.props.setTheme('light')
    } else {
      this.props.setTheme('dark')
    }
  }

  render() {
    const prettifyBreadcrumbs = (crumbs) => {
      const slash = <span className='text-muted'> / </span>
      return crumbs.split(' / ').map((part, i, splitTitle) => {
        return <span key={i}>{part} {i < splitTitle.length - 1 ? slash : ''}</span>
      })
    }
    const localCryptos = window.localStorage.getItem('cryptos');

    let pageTitle;

    if (this.props.pageSlug === 'draft') {
      pageTitle = 'Draft page';
    } else if (this.props.body === 'cryptos') {
      pageTitle = this.props.userPageTitle
    } else if (this.props.body === 'userPages') {
      pageTitle = prettifyBreadcrumbs(process.env.REACT_APP_SITE_NAME + ' / Your pages')
    } else {
      pageTitle = <NavLink to="/">{process.env.REACT_APP_SITE_NAME}</NavLink>;
    }
    return (
      <Navbar bg={this.props.theme} variant={this.props.theme} className='main-header mb-4'>
        <Container>
          <Navbar.Brand className={'d-flex align-items-center'}>
            <div className={'text-wrap'}>{pageTitle}</div>
            <div className={
              'loading-flasher' +
              (this.props.cryptosLoading || this.props.userPagesLoading ? ' visible' : '')
            }/>
          </Navbar.Brand>
          <div className="d-flex text-end align-items-center">
            {this.props.body === 'cryptos' ? this.props.pageSlug === 'draft' ? localCryptos ?
              <div className={'note text-muted text-wrap flex-shrink-1 me-2'}>
                Draft cached in browser
              </div>
              : '' : this.props.loggedIn && this.props.loggedInUserIsOwner ?
              <span className={'note text-muted text-nowrap flex-shrink-1 me-2'}>
                                Auto-save ON
                            </span> : '' : ''
            }
            <ButtonGroup>
              {this.props.body === 'cryptos' && this.props.pageSlug === 'draft' && localCryptos ?
                <Button
                  variant={'link'}
                  className={`save-page d-flex align-items-center justify-content-center`}
                  onClick={() => {
                    if (this.props.loggedIn) {
                      this.props.openSavePageModal();
                    } else {
                      this.props.openRegForm();
                      this.props.setSavePageIntent(true);
                    }
                  }}
                >
                  <FloppyIcon/>
                </Button>
                : ''}
              <LightSwitch
                onClick={() => this.props.setTheme(this.props.theme === 'dark' ? 'light' : 'dark')}
              />
              <MainMenu
                variant={this.props.theme}
                open={this.props.openRegForm}
                loggedIn={this.props.loggedIn}
                params={this.props.params}
                navigate={this.props.navigate}
                navigateToMyPages={() => this.props.navigate(`/user/pages`)}
                loadLocalCryptos={this.props.loadLocalCryptos}
                logOut={this.props.logOut}
                openLoginForm={this.props.openLoginForm}
                loginProvider={this.props.loginProvider}
                openChangePasswordModal={this.props.openChangePasswordModal}
                openChangeEmailModal={this.props.openChangeEmailModal}
                openDeleteAccountModal={this.props.openDeleteAccountModal}
                createPage={this.props.createPage}
                stopListeningToPageData={this.props.stopListeningToPageData}
                body={this.props.body}
              />
            </ButtonGroup>
          </div>
        </Container>
      </Navbar>
    );
  }
}

export default Header;
