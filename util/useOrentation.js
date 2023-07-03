 
import { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

 // ----WARNING---- check orientation ----WARNING---- //

export const useOrientation = () => {
    const [orientation, setOrientation] = useState(null);
    
    const checkOrientation = async () => {
        const orientation = await ScreenOrientation.getOrientationAsync();
        setOrientation(orientation);
    };
    
    const handleOrientationChange = (e) => {
        setOrientation(e.orientationInfo.orientation);
    };

    useEffect(() => {
        checkOrientation();
        const subscription = ScreenOrientation.addOrientationChangeListener(
            handleOrientationChange
        );
        
        return () => {
            ScreenOrientation.removeOrientationChangeListeners(subscription);
        };
    }, []);
    
    return orientation;
};