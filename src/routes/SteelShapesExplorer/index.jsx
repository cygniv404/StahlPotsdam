import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ImageList from '../Positionen/ImageList';
import { get } from '../../utils/requests';

export default function ({ bendGroup }) {
  const [bendTypeData, setBendTypeData] = useState(undefined);
  useEffect(() => {
    get(`bend_type/${bendGroup}`, (data) => setBendTypeData(data), null);
  }, [bendGroup]);
  return (
    <Box width="100%">
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
  );
}
