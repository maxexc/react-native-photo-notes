import { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import { useOrientation } from "./useOrentation";

// ----WARNING---- check orientation ----WARNING---- //

export const useDimantions = () => {
    const orientation = useOrientation();
    const [currentDimentions, setCurrentDimentions] = useState();

    useEffect(() => {
        if (orientation !== 1) {
            return setCurrentDimentions((Dimensions.get('window').width) / 2);
        } else {
            return setCurrentDimentions((Dimensions.get('window').width) - 20 * 2);
        }
    }, [orientation]);
    
    return { orientation, currentDimentions };
};