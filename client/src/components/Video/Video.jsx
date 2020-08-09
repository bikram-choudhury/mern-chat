import React, { useEffect, useRef } from 'react';

export default function Video({ srcObject, ...props }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current) return;
        const videoEl = videoRef.current;
        videoEl.srcObject = srcObject;

        videoEl.addEventListener('loadedmetadata', () => {
            videoEl.play();
        });

        return () => {
            videoEl.removeEventListener('loadedmetadata', () => {
                videoEl.stop();
            })
        }
    }, [videoRef, srcObject]);
    return (
        <video ref={videoRef} {...props} />
    )
}
