import {LampIcon} from "./icons/LampIcon";
import React from "react";
import {Button} from "react-bootstrap";

export function LightSwitch(props) {
    return <Button className="theme-switcher" variant={'link'}
                   onClick={props.onClick}>
        <LampIcon/>
    </Button>;
}
