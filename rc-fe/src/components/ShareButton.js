import React, {Component} from 'react';
import {SocialIcon} from "./icons/SocialIcon";
import {Button} from "react-bootstrap";

class ShareButton extends Component {
    getShareLink = (config) => {
        // config.link = config.link.replace('/', '%2F');
        if (config.network === 'Facebook') {
            return encodeURI(`https://www.facebook.com/sharer/sharer.php?${config.link ? `u=${config.link}&` : ''}${config.text ? `t=${config.text}` : ''}`);
        } else if (config.network === 'Twitter') {
            return encodeURI(`https://twitter.com/intent/tweet?${config.link ? `url=${config.link}&` : ''}${config.text ? `text=${config.text}` : ''}`);
        } else if (config.network === 'LinkedIn') {
            return encodeURI(`https://www.linkedin.com/shareArticle?${config.link ? `url=${config.link}&` : ''}${config.text ? `summary=${config.text}` : ''}`);
        } else if (config.network === 'Telegram') {
            return encodeURI(`https://t.me/share/url?${config.link ? `url=${config.link}&` : ''}${config.text ? `text=${config.text}` : ''}`)
        } else if (config.network === 'WhatsApp') {
            return encodeURI(`https://api.whatsapp.com/send?text=${config.text ? `${config.text}` : ''} ${config.link ? `${config.link}` : ''}`)
        }
    }

    render() {
        const config = {network: this.props.network};
        if (this.props.link) {
            config.link = this.props.link;
        }
        if (this.props.text) {
            config.text = this.props.text;
        }
        return (
            <Button
                variant='link'
                href={this.getShareLink(config)}
                target={'_blank'}
                className={'social-button'}
                disabled={this.props.disabled}
            >
                <SocialIcon network={this.props.network}/>
            </Button>
        );
    }
}

export default ShareButton;
