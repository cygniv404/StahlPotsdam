import React, {useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Dialog, ImageList, ImageListItemBar, Modal, Typography} from '@material-ui/core';
import ImageListItem from '@material-ui/core/ImageListItem';
import SingleImageViewer from "./SingleImageViewer";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    imageList: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        overflowY: 'hidden',
    },
    image: {
        width: '70px',
        height: '70px',
    },
    imageContainer: {
        cursor: 'pointer',
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '5px',
    }
}));

export default function BasicImageList({chosenEdge, bendTypeData, dimX, dimY, scale, showLabel, width, height}) {
    const classes = useStyles();
    const [prevEl, setPrevEL] = useState(null)
    const [currentEl, setCurrentEL] = useState(0)
    const [nextEl, setNextEL] = useState(1)
    const [open, setOpen] = useState(false)
    const handleKeyUp = e => {
        if (e.key === "ArrowRight") {
            setCurrentEL(currentEl === bendTypeData.length - 1 ? currentEl : currentEl + 1)
            setPrevEL(currentEl - 1 < 0 ? 0 : currentEl - 1)
            setNextEL(currentEl + 1 > bendTypeData.length - 1 ? bendTypeData.length - 1 : currentEl + 1)
        }
        if (e.key === "ArrowLeft") {
            setCurrentEL(currentEl === 0 ? 0 : currentEl - 1)
            setPrevEL(currentEl - 1 < 0 ? 0 : currentEl - 1)
            setNextEL(currentEl + 1 > bendTypeData.length - 1 ? bendTypeData.length - 1 : currentEl + 1)
        }
        if (e.key === "ArrowDown") {
            setCurrentEL(currentEl + 15 > bendTypeData.length - 1 ? bendTypeData.length - 1 : currentEl + 15)
            setPrevEL(currentEl - 15 < 0 ? 0 : currentEl - 15)
            setNextEL(currentEl + 15 > bendTypeData.length - 1 ? bendTypeData.length - 1 : currentEl + 15)
        }
        if (e.key === "ArrowUp") {
            setCurrentEL(currentEl - 15 < 0 ? 0 : currentEl - 15)
            setPrevEL(currentEl - 15 < 0 ? 0 : currentEl - 15)
            setNextEL(currentEl + 15 > bendTypeData.length - 1 ? bendTypeData.length - 1 : currentEl + 15)

        }
        if (e.key === 'F3') {
            setOpen(!open)
        }
        if (e.key === 'Escape') {
            setOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyUp);
        };
    }, [currentEl, open])

    useEffect(() => {
        const nextSibling = document.querySelector(
            `[id=image-${nextEl}]`
        );
        const prevSibling = document.querySelector(
            `[id=image-${prevEl}]`
        );
        const targetSibling = document.querySelector(
            `[id=image-${currentEl}]`
        );
        if (prevSibling !== null) {
            prevSibling.style.color = 'black';
            prevSibling.style.backgroundColor = 'transparent';
            prevSibling.style.border = 'none';
        }
        if (nextSibling !== null) {
            nextSibling.style.color = 'black';
            nextSibling.style.backgroundColor = 'transparent';
            nextSibling.style.border = 'none';
        }
        if (targetSibling !== null) {
            targetSibling.style.color = 'white';
            targetSibling.style.backgroundColor = 'gray';
            targetSibling.style.border = '1px solid #e8e8e8';
        }

    }, [currentEl, nextEl, prevEl])
    return (
        <>
            <div className={classes.root}>
                <ImageList rowHeight={50} className={classes.imageList} cols={14}>
                    {bendTypeData.map((item, index) => (
                        <ImageListItem key={index} cols={item.cols || 1} className={classes.image}>
                            <span
                                id={`image-${index}`}
                                className={classes.imageContainer}>
                            <Typography style={{
                                fontSize: '12px',
                                position: "absolute",
                                left: '5px',
                                top: '5px',
                                transition: 'ease-in-out 300ms'
                            }}>{item.id}</Typography>
                            <SingleImageViewer
                                chosenEdge={chosenEdge}
                                bendTypeData={item}
                                dimX={dimX}
                                dimY={dimY}
                                scale={scale}
                                showLabel={showLabel}
                                width={width}
                                height={height}
                                style={{position: 'relative', bottom: '30px', left: '5px'}}
                            />
                        </span>
                        </ImageListItem>
                    ))}
                </ImageList>
                <Dialog
                    fullScreen
                    open={open}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <SingleImageViewer
                        chosenEdge={chosenEdge}
                        bendTypeData={bendTypeData[currentEl]}
                        dimX={1000}
                        dimY={500}
                        scale={1}
                        showLabel={showLabel}
                        width={1000}
                        height={500}
                        style={{position: 'relative'}}
                        defaultColor={'#000'}
                        lineWidth={10}
                    />
                </Dialog>
            </div>
        </>
    );
}
