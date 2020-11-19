import { useState } from 'react';

const useIsActive = (initState = false) => {
    const [isActive, setIsActive] = useState(initState);
    const toggle = () => {
        setIsActive((previousIsActive) => !previousIsActive);
    }
    
    const activate = () => {
        setIsActive(true);
    }
    
    const deactivate = () => {
        setIsActive(false);
    }

    return {isActive, toggle, activate, deactivate};
}

export default useIsActive;