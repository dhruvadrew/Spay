import React from 'react';
import InfoSection from '../pages/Info/InfoSection.js';
import { homeObjOne, homeObjThree, homeObjTwo, homeObjFour} from './Data';

const Home = () => {
    return (
        <>
            <InfoSection {...homeObjOne} />
        </>
    )
}

export default Home;