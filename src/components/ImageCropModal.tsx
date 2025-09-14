
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Modal from './Modal';
import Button from './Button';

interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(new Image());
  const [crop, setCrop] = useState<Crop | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;
    if (!canvas || !ctx || !image.src || image.naturalWidth === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const imgWidth = image.naturalWidth * scale;
    const imgHeight = image.naturalHeight * scale;
    const dx = (canvas.width - imgWidth) / 2;
    const dy = (canvas.height - imgHeight) / 2;

    ctx.drawImage(image, dx, dy, imgWidth, imgHeight);

    if (crop) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.beginPath();
      ctx.rect(crop.x, crop.y, crop.width, crop.height);
      ctx.clip();
      ctx.drawImage(image, dx, dy, imgWidth, imgHeight);
      ctx.restore();

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
    }
  }, [crop]);

  useEffect(() => {
    if (isOpen && imageSrc) {
      const image = imageRef.current;
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;
      image.onload = () => {
        setCrop(null);
        redrawCanvas();
      };
    }
  }, [isOpen, imageSrc, redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [crop, redrawCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    setIsDragging(true);
    setStartPos(coords);
    setCrop({ x: coords.x, y: coords.y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !startPos) return;
    const coords = getCanvasCoordinates(e);
    let width = coords.x - startPos.x;
    let height = coords.y - startPos.y;

    if (aspectRatio) {
        const signW = width > 0 ? 1 : -1;
        const signH = height > 0 ? 1 : -1;
        if (Math.abs(width) > Math.abs(height * aspectRatio)) {
            height = width / aspectRatio * signW * signH;
        } else {
            width = height * aspectRatio * signW * signH;
        }
    }
    
    setCrop({
        x: width > 0 ? startPos.x : startPos.x + width,
        y: height > 0 ? startPos.y : startPos.y + height,
        width: Math.abs(width),
        height: Math.abs(height),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartPos(null);
  };

  const handleCropImage = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !crop || !image.src || crop.width === 0 || crop.height === 0) return;

    const displayScale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const dx = (canvas.width - image.naturalWidth * displayScale) / 2;
    const dy = (canvas.height - image.naturalHeight * displayScale) / 2;
    
    const sourceX = (crop.x - dx) / displayScale;
    const sourceY = (crop.y - dy) / displayScale;
    const sourceWidth = crop.width / displayScale;
    const sourceHeight = crop.height / displayScale;

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = sourceWidth;
    cropCanvas.height = sourceHeight;
    const cropCtx = cropCanvas.getContext('2d');
    
    if (!cropCtx) return;

    cropCtx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      sourceWidth,
      sourceHeight
    );

    onCropComplete(cropCanvas.toDataURL('image/jpeg'));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Crop Your Image</h3>
            <p className="text-gray-600 mb-4">Click and drag to select an area.</p>
            <canvas
                ref={canvasRef}
                width={500}
                height={400}
                className="mx-auto bg-gray-200 cursor-crosshair rounded-md"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
            <div className="flex justify-center gap-4 mt-6">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleCropImage} disabled={!crop || crop.width === 0}>
                    Crop & Save
                </Button>
            </div>
        </div>
    </Modal>
  );
};

export default ImageCropModal;