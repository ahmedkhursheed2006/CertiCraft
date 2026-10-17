import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Rect as KonvaRect, Transformer, Group } from 'react-konva';
import { calculateFittedFontSize } from '../utils/fontManager';
import { interpolateText } from '../utils/exportGenerator';

// Individual Draggable and Resizable Text Element on Canvas
const EditableTextElement = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  currentRecord,
  stageScale
}) => {
  const shapeRef = useRef(null);
  const trRef = useRef(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Interpolate dynamic tags with current recipient record
  const displayText = currentRecord
    ? interpolateText(shapeProps.tag || shapeProps.text, currentRecord)
    : (shapeProps.text || shapeProps.tag);

  // Compute auto-fitted font size if autoFit is enabled
  const computedFontSize = shapeProps.autoFit
    ? calculateFittedFontSize(
        displayText,
        shapeProps.width,
        shapeProps.fontSize,
        shapeProps.fontFamily,
        shapeProps.fontWeight
      )
    : shapeProps.fontSize;

  return (
    <>
      <Group
        ref={shapeRef}
        x={shapeProps.x}
        y={shapeProps.y}
        width={shapeProps.width}
        height={shapeProps.height}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: Math.round(e.target.x()),
            y: Math.round(e.target.y()),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale and update true width & height
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: Math.round(node.x()),
            y: Math.round(node.y()),
            width: Math.max(40, Math.round(node.width() * scaleX)),
            height: Math.max(20, Math.round(node.height() * scaleY)),
          });
        }}
      >
        {/* Subtle background container to indicate bounding box when selected */}
        <KonvaRect
          width={shapeProps.width}
          height={shapeProps.height}
          fill={isSelected ? 'rgba(59, 130, 246, 0.08)' : 'transparent'}
          stroke={isSelected ? '#3b82f6' : 'rgba(148, 163, 184, 0.25)'}
          strokeWidth={isSelected ? 1.5 : 1}
          dash={isSelected ? [] : [4, 4]}
          cornerRadius={4}
        />

        {/* Text Node */}
        <KonvaText
          text={displayText}
          width={shapeProps.width}
          height={shapeProps.height}
          fontSize={computedFontSize}
          fontFamily={shapeProps.fontFamily || 'Inter'}
          fontStyle={`${shapeProps.fontStyle === 'italic' ? 'italic ' : ''}${shapeProps.fontWeight || 'normal'}`}
          fill={shapeProps.fill || '#ffffff'}
          align={shapeProps.align || 'center'}
          verticalAlign="middle"
          wrap="none"
          ellipsis={false}
          listening={false}
        />

        {/* Small floating tag badge */}
        {isSelected && (
          <KonvaText
            x={0}
            y={-18}
            text={shapeProps.tag || 'Text Box'}
            fontSize={11}
            fontFamily="Inter"
            fill="#60a5fa"
            listening={false}
          />
        )}
      </Group>

      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 40 || newBox.height < 20) {
              return oldBox;
            }
            return newBox;
          }}
          enabledAnchors={['middle-left', 'middle-right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']}
          anchorCornerRadius={3}
          anchorSize={8}
          anchorStroke="#3b82f6"
          anchorFill="#ffffff"
          borderStroke="#3b82f6"
          borderStrokeWidth={1.5}
        />
      )}
    </>
  );
};

export default function CanvasEditor({
  template,
  elements,
  selectedId,
  onSelectElement,
  onChangeElement,
  currentRecord,
  showGrid = true
}) {
  const containerRef = useRef(null);
  const [bgImage, setBgImage] = useState(null);
  const [stageScale, setStageScale] = useState(1);
  const [stageDimensions, setStageDimensions] = useState({ width: 900, height: 506 });

  // Load background image
  useEffect(() => {
    if (!template.backgroundUrl) {
      setBgImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setBgImage(img);
    img.src = template.backgroundUrl;
  }, [template.backgroundUrl]);

  // Responsive stage scaling: fits canvas to container while preserving native coordinates
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 40;
      const containerHeight = containerRef.current.clientHeight - 40;

      const scaleX = containerWidth / template.width;
      const scaleY = containerHeight / template.height;
      const fitScale = Math.min(scaleX, scaleY, 1);

      setStageScale(fitScale);
      setStageDimensions({
        width: template.width * fitScale,
        height: template.height * fitScale
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [template.width, template.height]);

  const checkDeselect = (e) => {
    // Deselect when clicking directly on stage background
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'bgImage' || e.target.name() === 'bgRect';
    if (clickedOnEmpty) {
      onSelectElement(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full w-full flex items-center justify-center p-6 bg-slate-950 overflow-hidden relative select-none"
    >
      {/* Canvas Paper Wrapper with Elevation */}
      <div
        className="rounded-xl shadow-2xl overflow-hidden border border-slate-800 transition-all duration-200"
        style={{
          width: stageDimensions.width,
          height: stageDimensions.height,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        <Stage
          width={stageDimensions.width}
          height={stageDimensions.height}
          scaleX={stageScale}
          scaleY={stageScale}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            {/* Background image or default fallback */}
            {bgImage ? (
              <KonvaImage
                name="bgImage"
                image={bgImage}
                width={template.width}
                height={template.height}
              />
            ) : (
              <KonvaRect
                name="bgRect"
                x={0}
                y={0}
                width={template.width}
                height={template.height}
                fill="#0f172a"
              />
            )}

            {/* Grid Lines if toggled */}
            {showGrid && (
              <Group listening={false}>
                {[...Array(Math.floor(template.width / 100))].map((_, i) => (
                  <KonvaRect
                    key={`v_${i}`}
                    x={i * 100}
                    y={0}
                    width={1}
                    height={template.height}
                    fill="rgba(255, 255, 255, 0.03)"
                  />
                ))}
                {[...Array(Math.floor(template.height / 100))].map((_, i) => (
                  <KonvaRect
                    key={`h_${i}`}
                    x={0}
                    y={i * 100}
                    width={template.width}
                    height={1}
                    fill="rgba(255, 255, 255, 0.03)"
                  />
                ))}
              </Group>
            )}

            {/* Render all user text boxes */}
            {elements.map((el) => (
              <EditableTextElement
                key={el.id}
                shapeProps={el}
                isSelected={el.id === selectedId}
                onSelect={() => onSelectElement(el.id)}
                onChange={(newAttrs) => onChangeElement(newAttrs)}
                currentRecord={currentRecord}
                stageScale={stageScale}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Canvas Dimensions Badge */}
      <div className="absolute bottom-4 left-6 px-3 py-1 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-md text-xs text-slate-400 font-mono">
        Native Canvas: {template.width} × {template.height} px | Zoom: {Math.round(stageScale * 100)}%
      </div>
    </div>
  );
}
