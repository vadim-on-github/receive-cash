import React from "react";
import Jumbotron from "./Jumbotron";
import {Button} from "react-bootstrap";

class Home extends React.Component {
  render() {
    const contProps = {}

    contProps.img = {
      src: `img/intro1-${this.props.theme}.webp`,
    }
    contProps.imgForNarrowerVP = {
      src: `img/intro-${this.props.theme}.webp`,
    }
    contProps.imgForNarrowestVP = {
      src: `img/intro2-${this.props.theme}.webp`,
      alt: "One crypto's address with QR code floats above other cryptos' logos",
      hwPercent: 81
    }

    return (
      <>
        <Jumbotron
          theme={this.props.theme}
          title={
            <>
              <span className={'text-nowrap'}>Easily view & share</span>
              <span> </span>
              <span className={'text-nowrap'}>crypto addresses</span>
            </>
          }
          description={
            `The goal is to eliminate economic barriers and increase the adoption of cryptocurrency by easing
                         and accelerating the sending and receiving of money in person and remotely`
          }
          {...contProps}
          id={'main-intro'}
          actions={
            <Button
              size={'lg'}
              variant={'primary'}
              type={'button'}
              onClick={() => {
                this.props.navigate('/draft')
              }}
            >
              Create a page of cryptos
            </Button>
          }
        >
        </Jumbotron>
        <Jumbotron
          theme={this.props.theme}
          title={"Live updates"}
          id={'live-updates-info'}
          description={
            `Anytime a page owner adds, removes, or changes cryptocurrency addresses, live updates are sent to
                        wherever the page is being viewed`
          }
        >
        </Jumbotron>
      </>
    )
  }
}

export default Home;
