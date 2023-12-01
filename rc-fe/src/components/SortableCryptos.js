import React, {useState} from 'react';
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import Crypto from './Crypto';
import * as PropTypes from "prop-types";
import {LocalSortableCryptos} from "./LocalSortableCryptos";
import {CloudSortableCryptos} from "./CloudSortableCryptos";
import {Alert, Container} from "react-bootstrap";

export default function SortableCryptos(props) {
    const [activeCrypto, setActiveCrypto] = useState(null);
    const [activeCryptoScale, setActiveCryptoScale] = useState(1);
    const sensors = useSensors(
        useSensor(MouseSensor, {
            // Require the mouse to move by 5 pixels before activating
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            // Press delay of 250ms, with tolerance of 5px of movement
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
            keyboardCodes: {
                start: ['KeyM'],
                cancel: ['Escape'],
                end: ['KeyM'],
            }
        })
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext
                items={props.cryptos}
                strategy={rectSortingStrategy}
            >
                <Container>
                    <Alert variant={'primary'} tabIndex={0} className={'sorting-with-keyboard-hint'}
                           onMouseDown={e => e.preventDefault()}>
                        To move a crypto, press M key on the keyboard to start moving it, use arrow keys to move it
                        around, then press M again to stop moving it and save the new order
                    </Alert>
                </Container>
                {props.pageSlug === 'draft' ? (
                    <LocalSortableCryptos
                        draggedCrypto={activeCrypto}
                        {...props}
                    />
                ) : (
                    <CloudSortableCryptos
                        draggedCrypto={activeCrypto}
                        {...props}
                    />
                )}

            </SortableContext>
            <DragOverlay style={{boxSizing: "content-box", padding: 0}}>
                {activeCrypto !== null ? <Crypto
                    id={activeCrypto.id}
                    address={activeCrypto.address}
                    icon={activeCrypto.icon}
                    logo={activeCrypto.logo}
                    name={activeCrypto.name}
                    symbol={activeCrypto.symbol}
                    scale={activeCryptoScale}
                    beingDragged={false}
                    // ref={crypto.ref}
                    updating={props.cryptoBeingAddedAsync === activeCrypto.id}
                    theme={props.theme}
                    pageSlug={props.pageSlug}
                    allCryptos={props.cryptos}
                    updateCrypto={props.updateCrypto}
                    deleteCrypto={props.deleteCrypto}
                    loggedInUserIsOwner={props.loggedInUserIsOwner}
                    requestedCrypto={props.requestedCrypto}
                    navigate={props.navigate}
                /> : null}
            </DragOverlay>
        </DndContext>
    );

    async function handleDragStart(event) {
        if (props.logging) console.log(props.sortingAllowed)
        if (!props.sortingAllowed) {
            return
        }
        const {active} = event;
        await setActiveCrypto(props.cryptos.filter(c => c.id === active.id)[0])
        setActiveCryptoScale(1.05);
    }

    async function handleDragEnd(event) {
        if (props.logging) console.log(props.sortingAllowed)
        if (!props.sortingAllowed) {
            return
        }
        const {active, over} = event;
        if (active.id !== over.id) {
            const newCryptos = (oldCryptos) => {
                const oldIndex = oldCryptos.map(e => e.id).indexOf(active.id);
                const newIndex = oldCryptos.map(e => e.id).indexOf(over.id);
                return arrayMove(oldCryptos, oldIndex, newIndex);
            }
            props.saveCryptos(newCryptos(props.cryptos));
        }

        await setActiveCryptoScale(1);
        setActiveCrypto(null);
    }

    async function handleDragCancel(event) {
        await setActiveCryptoScale(1);
        setActiveCrypto(null);
    }
}
