import { useState, useCallback } from "react";

export const useMediaSource = (videoRef) => {
    const [image, setImage] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsCameraActive(false);
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setImage(img);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
                setImage(null);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera.");
        }
    };

    const stopCamera = () => {
        setIsCameraActive(false);
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    return {
        image,
        setImage,
        isCameraActive,
        setIsCameraActive,
        handleImageUpload,
        startCamera,
        stopCamera
    };
};
