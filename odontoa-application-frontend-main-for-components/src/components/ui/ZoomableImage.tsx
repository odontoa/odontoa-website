import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  showControls?: boolean;
}

export function ZoomableImage({
  src,
  alt,
  className = "",
  showControls = true
}: ZoomableImageProps) {
  return (
    <div className="w-full h-full">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit={true}
        wheel={{ step: 0.2 }}
        pinch={{ step: 5 }}
        doubleClick={{ step: 2 }}
        panning={{ velocityDisabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform, centerView }) => (
          <>
            {showControls && (
              <div className="absolute top-4 right-4 z-50 flex items-center gap-1 backdrop-blur-sm rounded-lg p-1 bg-black/50">
                <button
                  onClick={() => zoomOut()}
                  className="p-1.5 rounded text-white hover:bg-white/20 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => zoomIn()}
                  className="p-1.5 rounded text-white hover:bg-white/20 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    resetTransform();
                    centerView(1);
                  }}
                  className="p-1.5 rounded text-white hover:bg-white/20 transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            )}

            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100vh' }}
              contentStyle={{ width: '100%', height: '100vh' }}
            >
              <img
                src={src}
                alt={alt}
                className={`w-full object-contain rounded-lg shadow-lg ${className}`}
                draggable={false}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
