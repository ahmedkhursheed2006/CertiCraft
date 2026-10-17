import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Rect as KonvaRect, Transformer, Group } from 'react-konva';
import { calculateFittedFontSize } from '../utils/fontManager';
import { interpolateText } from '../utils/exportGenerator';

const EditableTextElement = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onDoubleClick,
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

  const displayText = currentRecord
    ? interpolateText(shapeProps.tag || shapeProps.text, currentRecord)
    : (shapeProps.text || shapeProps.tag);

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
        onDblClick={() => onDoubleClick(shapeProps, displayText)}
        onDblTap={() => onDoubleClick(shapeProps, displayText)}
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

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: Math.round(node.x()),
            y: Math.round(node.y()),
            width: Math.max(30, Math.round(node.width() * scaleX)),
            height: Math.max(15, Math.round(node.height() * scaleY)),
          });
        }}
      >
        {/* Crisp Bounding Box / Container */}
        <KonvaRect
          width={shapeProps.width}
          height={shapeProps.height}
          fill={isSelected ? 'rgba(255, 255, 255, 0.03)' : 'transparent'}
          stroke={isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'}
          strokeWidth={isSelected ? 1.5 : 0.8}
          dash={isSelected ? [] : [3, 3]}
          cornerRadius={2}
        />

        {/* Text Node inside the container */}
        <KonvaText
          text={displayText}
          width={shapeProps.width}
          height={shapeProps.height}
          fontSize={computedFontSize}
          fontFamily={shapeProps.fontFamily || 'Inter'}
          fontStyle={`${shapeProps.fontStyle === 'italic' ? 'italic ' : ''}${shapeProps.fontWeight || 'normal'}`}
          fill={shapeProps.fill || '#f4f4f5'}
          align={shapeProps.align || 'center'}
          verticalAlign={shapeProps.verticalAlign || 'middle'}
          wrap="none"
          ellipsis={false}
          listening={false}
        />

        {/* Floating tag badge */}
        {isSelected && (
          <KonvaText
            x={0}
            y={-18}
            text={shapeProps.tag || 'Text Box'}
            fontSize={10}
            fontFamily="JetBrains Mono, monospace"
            fill="#a1a1aa"
            listening={false}
          />
        )}
      </Group>

      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={false} // ALLOWS FREE VERTICAL & HORIZONTAL RESIZING OF THE CONTAINER
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30 || newBox.height < 15) {
              return oldBox;
            }
            return newBox;
          }}
          // All 8 Handles Enabled: Full Height and Width Control
          enabledAnchors={[
            'top-left',
            'top-center',
            'top-right',
            'middle-left',
            'middle-right',
            'bottom-left',
            'bottom-center',
            'bottom-right'
          ]}
          anchorCornerRadius={2}
          anchorSize={8}
          anchorStroke="#ffffff"
          anchorFill="#09090b"
          borderStroke="#ffffff"
          borderStrokeWidth={1.2}
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
  onUpdateTextValue,
  currentRecord,
  showGrid = true
}) {
  const containerRef = useRef(null);
  const [bgImage, setBgImage] = useState(null);
  const [stageScale, setStageScale] = useState(1);
  const [stageDimensions, setStageDimensions] = useState({ width: 900, height: 506 });

  // Inline Double-Click Editor Overlay State
  const [inlineEditor, setInlineEditor] = useState(null);

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
      const containerWidth = containerRef.current.clientWidth - 48;
      const containerHeight = containerRef.current.clientHeight - 48;

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
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'bgImage' || e.target.name() === 'bgRect';
    if (clickedOnEmpty) {
      onSelectElement(null);
      if (inlineEditor) finishInlineEditing();
    }
  };

  const handleDoubleClickElement = (element, text) => {
    setInlineEditor({
      element,
      value: text || '',
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height
    });
  };

  const finishInlineEditing = () => {
    if (!inlineEditor) return;
    const { element, value } = inlineEditor;
    if (onUpdateTextValue) {
      onUpdateTextValue(element, value);
    }
    setInlineEditor(null);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full w-full flex items-center justify-center p-6 bg-[#08090b] dot-grid overflow-hidden relative select-none"
    >
      {/* Canvas Paper Wrapper with Elevation */}
      <div
        className="rounded-lg shadow-2xl overflow-hidden border border-neutral-800 transition-all duration-200 relative"
        style={{
          width: stageDimensions.width,
          height: stageDimensions.height,
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
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
                fill="#0f1117"
              />
            )}

            {/* Subtle Alignment Grid */}
            {showGrid && (
              <Group listening={false}>
                {[...Array(Math.floor(template.width / 100))].map((_, i) => (
                  <KonvaRect
                    key={`v_${i}`}
                    x={i * 100}
                    y={0}
                    width={1}
                    height={template.height}
                    fill="rgba(255, 255, 255, 0.04)"
                  />
                ))}
                {[...Array(Math.floor(template.height / 100))].map((_, i) => (
                  <KonvaRect
                    key={`h_${i}`}
                    x={0}
                    y={i * 100}
                    width={template.width}
                    height={1}
                    fill="rgba(255, 255, 255, 0.04)"
                  />
                ))}
              </Group>
            )}

            {/* Canvas Text Elements */}
            {elements.map((el) => (
              <EditableTextElement
                key={el.id}
                shapeProps={el}
                isSelected={el.id === selectedId}
                onSelect={() => onSelectElement(el.id)}
                onChange={(newAttrs) => onChangeElement(newAttrs)}
                onDoubleClick={handleDoubleClickElement}
                currentRecord={currentRecord}
                stageScale={stageScale}
              />
            ))}
          </Layer>
        </Stage>

        {/* Double-Click Inline Editable Overlay */}
        {inlineEditor && (
          <div
            className="absolute z-30"
            style={{
              left: `${inlineEditor.x * stageScale}px`,
              top: `${inlineEditor.y * stageScale}px`,
              width: `${inlineEditor.width * stageScale}px`,
              height: `${inlineEditor.height * stageScale}px`,
            }}
          >
            <input
              type="text"
              autoFocus
              value={inlineEditor.value}
              onChange={(e) =>
                setInlineEditor((prev) => ({ ...prev, value: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') finishInlineEditing();
                if (e.key === 'Escape') setInlineEditor(null);
              }}
              onBlur={finishInlineEditing}
              className="w-full h-full bg-black/90 text-white border-2 border-white rounded px-2 outline-none font-medium shadow-2xl"
              style={{
                fontSize: `${Math.max(12, Math.round(inlineEditor.element.fontSize * stageScale))}px`,
                fontFamily: inlineEditor.element.fontFamily || 'Inter',
                textAlign: inlineEditor.element.align || 'center'
              }}
            />
          </div>
        )}
      </div>

      {/* Floating Canvas Metadata Pill */}
      <div className="absolute bottom-4 left-6 px-3 py-1 bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-md text-[11px] text-neutral-400 font-mono shadow-md flex items-center gap-2">
        <span>{template.width} × {template.height} px</span>
        <span className="text-neutral-600">•</span>
        <span>{Math.round(stageScale * 100)}%</span>
      </div>
    </div>
  );
}
