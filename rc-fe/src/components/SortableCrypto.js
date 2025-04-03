import React, {useEffect} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Crypto from "./Crypto";
import {useEventListener} from 'usehooks-ts'
import {useRef} from 'react'

export default function SortableCrypto(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: props.id,
        disabled: !props.sortingAllowed
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const open = () => {
        props.navigate(`/${props.pageSlug}/${props.symbol.toLowerCase()}`)
    }


    const keyboardEntryHandler = (e) => {
        if (props.draggedCrypto === null) {
            const code = (e.keyCode ? e.keyCode : e.which);

            if (code === 13 || code === 32) { // enter or space
                e.preventDefault()
                open();
            }
        }
    }

    /*  const theCont = useRef();
    useEffect(() => {
        theCont.current.childNodes[0].addEventListener('keydown', keyboardEntryHandler)
    }, []);*/

    return (
        <button
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={
                'sortable-crypto-card-cont btn w-100 mb-4' +
                (props.draggedCrypto === null ? '' : (props.draggedCrypto.id === props.id ? ' opacity-0 ' : ''))
            }
            onKeyUp={keyboardEntryHandler}
            aria-label={props.name + ' (' + props.symbol + ')'}
        >
            <Crypto {...props} sortable={true}/>
        </button>
    );
}
