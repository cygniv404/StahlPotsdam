import React, {useEffect, useState} from 'react';
import ImageList from "../Positionen/ImageList";
import {get} from "../../utils/requests";
import Box from "@material-ui/core/Box";

export default function ({bendGroup}) {
    const [bendTypeData, setBendTypeData] = useState(null)
    useEffect(() => {
        get(`bend_type/${bendGroup}`, (data) => setBendTypeData(data), null)
    }, [])
    return (
        <Box width='100%'>
            {bendTypeData && (
                <ImageList
                    chosenEdge={-1}
                    bendTypeData={bendTypeData}
                    dimX={70}
                    dimY={70}
                    scale={0.07}
                    showLabel={false}
                    width={70}
                    height={70}
                />
            )}
        </Box>
    )
}