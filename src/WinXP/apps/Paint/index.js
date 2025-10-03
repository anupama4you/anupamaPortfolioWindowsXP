import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

function Paint({ onClose, isFocus }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const longPressTimerRef = useRef(null);
const LONG_PRESS_MS = 600; // tweak to taste
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2C3E50');
  const [brushSize, setBrushSize] = useState(2);
  const [tool, setTool] = useState('pencil');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Base items data (for desktop 900x1000 canvas) - Professional Grid Layout
  const baseItems = [
    // Header
    { id: 'title', type: 'text', content: "About ME 🌟", x: 330, y: 25, fontSize: 28, rotation: 0, fontWeight: 'bold' },

    // Row 1: Early Days & Education
    { id: 'section1', type: 'text', content: "🇱🇰 Early Days", x: 40, y: 80, fontSize: 18, rotation: 0, fontWeight: 'bold' },
    { id: 'img1', type: 'image', src: 'assets/mylife/graduation.jpg', x: 40, y: 120, width: 180, height: 180, rotation: -2, label: 'Graduation' },
    { id: 'text1', type: 'text', content: "Born and raised in Sri Lanka, I've always", x: 250, y: 130, fontSize: 14, rotation: 0 },
    { id: 'text2', type: 'text', content: "been passionate about computers. Started", x: 250, y: 155, fontSize: 14, rotation: 0 },
    { id: 'text3', type: 'text', content: "experimenting with Java apps as a kid,", x: 250, y: 180, fontSize: 14, rotation: 0 },
    { id: 'text4', type: 'text', content: "and built my foundation through my", x: 250, y: 205, fontSize: 14, rotation: 0 },
    { id: 'text5', type: 'text', content: "bachelor's degree in CS 🎓", x: 250, y: 230, fontSize: 14, rotation: 0 },
    { id: 'img2', type: 'image', src: 'assets/mylife/it.jpg', x: 540, y: 110, width: 160, height: 160, rotation: 2, label: 'Tech Life' },
    { id: 'img9', type: 'image', src: 'assets/mylife/leader2.jpeg', x: 720, y: 120, width: 140, height: 140, rotation: -1, label: 'Learning' },

    // Row 2: Career & Travel
    { id: 'section2', type: 'text', content: "🌏 Global Experience", x: 40, y: 340, fontSize: 18, rotation: 0, fontWeight: 'bold' },
    { id: 'text6', type: 'text', content: "I've had the opportunity to work across", x: 40, y: 380, fontSize: 14, rotation: 0 },
    { id: 'text7', type: 'text', content: "three countries: Sri Lanka, Egypt, and", x: 40, y: 405, fontSize: 14, rotation: 0 },
    { id: 'text8', type: 'text', content: "Australia. Currently based in Adelaide 🦘", x: 40, y: 430, fontSize: 14, rotation: 0 },
    { id: 'text9', type: 'text', content: "and open for freelance opportunities!", x: 40, y: 455, fontSize: 14, rotation: 0 },
    { id: 'text10', type: 'text', content: "I love traveling & creating vlogs ✈️📹", x: 40, y: 480, fontSize: 14, rotation: 0 },
    { id: 'img3', type: 'image', src: 'assets/mylife/travel.JPG', x: 340, y: 360, width: 180, height: 180, rotation: 1, label: 'Exploring' },
    { id: 'img4', type: 'image', src: 'assets/mylife/travel2.JPG', x: 550, y: 370, width: 160, height: 160, rotation: -2, label: 'Adventures' },
    { id: 'img5', type: 'image', src: 'assets/mylife/people.jpg', x: 730, y: 365, width: 140, height: 140, rotation: 2, label: 'Team' },

    // Row 3: Leadership & Sports
    { id: 'section3', type: 'text', content: "💼 Leadership & Sports", x: 40, y: 590, fontSize: 18, rotation: 0, fontWeight: 'bold' },
    { id: 'img6', type: 'image', src: 'assets/mylife/leader.jpeg', x: 40, y: 630, width: 160, height: 160, rotation: -1, label: 'Leadership' },
    { id: 'text11', type: 'text', content: "Passionate about inspiring people through", x: 230, y: 640, fontSize: 14, rotation: 0 },
    { id: 'text12', type: 'text', content: "leadership. I'm an opening batsman and", x: 230, y: 665, fontSize: 14, rotation: 0 },
    { id: 'text13', type: 'text', content: "wicketkeeper 🏏 Recently became captain", x: 230, y: 690, fontSize: 14, rotation: 0 },
    { id: 'text14', type: 'text', content: "of Ceylon Strikers cricket team!", x: 230, y: 715, fontSize: 14, rotation: 0 },
    { id: 'img7', type: 'image', src: 'assets/mylife/cricket.JPG', x: 530, y: 625, width: 170, height: 170, rotation: 2, label: 'Cricket' },
    { id: 'img8', type: 'image', src: 'assets/mylife/gym.JPG', x: 720, y: 630, width: 150, height: 150, rotation: -1, label: 'Fitness' },

    // Row 4: Fitness
    { id: 'section4', type: 'text', content: "💪 Fitness Journey", x: 40, y: 840, fontSize: 18, rotation: 0, fontWeight: 'bold' },
    { id: 'text15', type: 'text', content: "Never miss a gym session! Fitness is a crucial part", x: 40, y: 880, fontSize: 14, rotation: 0 },
    { id: 'text16', type: 'text', content: "of my daily routine and keeps me energized 🏋️‍♂️", x: 40, y: 905, fontSize: 14, rotation: 0 },
  ];

  const [items, setItems] = useState(baseItems);

  // Update items when mobile state changes
  useEffect(() => {
    const scale = isMobile ? 0.6 : 1;
    setItems(baseItems.map(item => ({
      ...item,
      x: item.x * scale,
      y: item.y * scale,
      fontSize: item.fontSize ? item.fontSize * scale : undefined,
      width: item.width ? item.width * scale : undefined,
      height: item.height ? item.height * scale : undefined,
    })));
  }, [isMobile]);

  const colors = [
    '#2C3E50', '#34495E', '#16A085', '#27AE60',
    '#2980B9', '#8E44AD', '#E74C3C', '#E67E22',
    '#F39C12', '#95A5A6', '#000000', '#FFFFFF'
  ];

  const canvasWidth = isMobile ? 600 : 900;
  const canvasHeight = isMobile ? 700 : 1000;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFF9E6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isMobile]);

  const handleItemTouchStart = (e, item) => {
  if (!isMobile) return;
  e.stopPropagation();
  // start dragging logic if you want, but we’ll prioritize long-press
  longPressTimerRef.current = setTimeout(() => {
    if (navigator?.vibrate) navigator.vibrate(10);
    if (window.confirm('Remove this item?')) {
      setItems(prev => prev.filter(i => i.id !== item.id));
    }
  }, LONG_PRESS_MS);
};

const handleItemTouchEnd = () => {
  if (longPressTimerRef.current) {
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }
};


  const startDrawing = (e) => {
    if (!isFocus || draggedItem) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !isFocus || draggedItem) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');

    if (tool === 'pencil') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#FFF9E6';
      ctx.lineWidth = brushSize * 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFF9E6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'my-life-story.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Drag handlers for items
  const handleItemMouseDown = (e, item) => {
    if (!isFocus) return;
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    setDraggedItem(item);
    setDragOffset({
      x: e.clientX - rect.left - item.x,
      y: e.clientY - rect.top - item.y
    });
  };

  const handleMouseMove = (e) => {
    if (draggedItem && isFocus) {
      const rect = containerRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      setItems(items.map(item =>
        item.id === draggedItem.id
          ? { ...item, x: newX, y: newY }
          : item
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedItem(null);
  };

  const removeItem = (e, itemId) => {
    e.stopPropagation();
    setItems(items.filter(item => item.id !== itemId));
  };

  return (
    <Container>
      <Toolbar>
        <ToolSection>
          <ToolButton
            active={tool === 'pencil'}
            onClick={() => setTool('pencil')}
            title="Pencil - Draw on the story"
          >
            ✏️
          </ToolButton>
          <ToolButton
            active={tool === 'eraser'}
            onClick={() => setTool('eraser')}
            title="Eraser"
          >
            🧹
          </ToolButton>
        </ToolSection>

        <Separator />

        <ToolSection>
          <label style={{ fontSize: '11px', marginRight: '5px' }}>Size:</label>
          <select
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ fontSize: '11px' }}
          >
            <option value="1">1px</option>
            <option value="2">2px</option>
            <option value="4">4px</option>
            <option value="8">8px</option>
            <option value="12">12px</option>
          </select>
        </ToolSection>

        <Separator />

        <ToolSection>
          <ActionButton onClick={clearCanvas} title="Clear Canvas">
            🗑️ Clear
          </ActionButton>
          <ActionButton onClick={saveImage} title="Save Image">
            💾 Save
          </ActionButton>
        </ToolSection>

        <InfoText>💡 Drag items to rearrange • Click X to remove</InfoText>
      </Toolbar>

      <ColorPalette>
        {colors.map((c) => (
          <ColorBox
            key={c}
            color={c}
            active={color === c}
            onClick={() => setColor(c)}
          />
        ))}
      </ColorPalette>

      <CanvasContainer
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ cursor: tool === 'pencil' ? 'crosshair' : tool === 'eraser' ? 'cell' : 'default' }}
        />

        {/* Render draggable items on top of canvas */}
        <ItemsLayer canvasWidth={canvasWidth} canvasHeight={canvasHeight}>
          {items.map(item => (
            item.type === 'text' ? (
              <DraggableText
                key={item.id}
                style={{
                  left: item.x,
                  top: item.y,
                  fontSize: item.fontSize,
                  fontWeight: item.fontWeight || '600',
                  transform: `rotate(${item.rotation}deg)`,
                  cursor: draggedItem?.id === item.id ? 'grabbing' : 'grab'
                }}
                onMouseDown={(e) => handleItemMouseDown(e, item)}
  onTouchStart={(e) => handleItemTouchStart(e, item)}
  onTouchEnd={handleItemTouchEnd}
              >
                {item.content}
                {!isMobile && (
  <RemoveBtn onClick={(e) => removeItem(e, item.id)}>×</RemoveBtn>
)}
              </DraggableText>
            ) : (
              <PolaroidImage
                key={item.id}
                style={{
                  left: item.x,
                  top: item.y,
                  transform: `rotate(${item.rotation}deg)`,
                  cursor: draggedItem?.id === item.id ? 'grabbing' : 'grab'
                }}
                onMouseDown={(e) => handleItemMouseDown(e, item)}
  onTouchStart={(e) => handleItemTouchStart(e, item)}
  onTouchEnd={handleItemTouchEnd}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  style={{ width: item.width, height: item.height }}
                  draggable={false}
                />
                <ImageLabel>{item.label}</ImageLabel>
                {!isMobile && (
  <RemoveBtn onClick={(e) => removeItem(e, item.id)}>×</RemoveBtn>
)}
              </PolaroidImage>
            )
          ))}
        </ItemsLayer>
      </CanvasContainer>

      {!isFocus && <Overlay />}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(192, 192, 192);
  position: relative;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%);
  border-bottom: 1px solid #999;
  flex-shrink: 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 4px;
    padding: 4px;
  }
`;

const ToolSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ToolButton = styled.button`
  width: 32px;
  height: 32px;
  border: 2px solid;
  border-color: ${props => props.active ? '#999 #fff #fff #999' : '#fff #999 #999 #fff'};
  background: ${props => props.active ? '#ddd' : '#f0f0f0'};
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e8e8e8;
  }

  &:active {
    border-color: #999 #fff #fff #999;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
`;

const ActionButton = styled.button`
  padding: 4px 12px;
  border: 2px solid;
  border-color: #fff #999 #999 #fff;
  background: #f0f0f0;
  cursor: pointer;
  font-size: 11px;
  font-family: 'Tahoma', sans-serif;

  &:hover {
    background: #e8e8e8;
  }

  &:active {
    border-color: #999 #fff #fff #999;
    background: #ddd;
  }

  @media (max-width: 768px) {
    padding: 3px 8px;
    font-size: 10px;
  }
`;

const Separator = styled.div`
  width: 1px;
  height: 24px;
  background: #999;
  box-shadow: 1px 0 0 #fff;

  @media (max-width: 768px) {
    height: 20px;
  }
`;

const InfoText = styled.div`
  margin-left: auto;
  font-size: 10px;
  color: #555;
  font-style: italic;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 24px);
  gap: 2px;
  padding: 8px;
  background: #c0c0c0;
  border-bottom: 2px solid #999;
  flex-shrink: 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(6, 22px);
    padding: 4px;
  }
`;

const ColorBox = styled.div`
  width: 24px;
  height: 24px;
  background: ${props => props.color};
  border: 2px solid;
  border-color: ${props => props.active ? '#000' : '#fff #808080 #808080 #fff'};
  cursor: pointer;
  box-shadow: ${props => props.active ? 'inset 0 0 0 2px #fff' : 'none'};

  &:hover {
    border-color: #000;
  }

  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
  }
`;

const CanvasContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: #808080;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Canvas = styled.canvas`
  background: #FFF9E6;
  border: 1px solid #000;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4);
  position: relative;
  max-width: 100%;
  height: auto;
`;

const ItemsLayer = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: ${props => props.canvasWidth}px;
  height: ${props => props.canvasHeight}px;
  pointer-events: none;

  & > * {
    pointer-events: all;
  }

  @media (max-width: 768px) {
    top: 10px;
  }
`;

const DraggableText = styled.div`
  position: absolute;
  font-family: 'Segoe Print', 'Bradley Hand', 'Brush Script MT', cursive;
  color: #2C3E50;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  padding: 5px 10px;
  user-select: none;
  transition: transform 0.1s;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 150, 0.2);
    border-radius: 4px;
  }

  &:active {
    transform: scale(1.02);
  }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #E74C3C;
  color: white;
  border: 2px solid white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  ${DraggableText}:hover &,
  ${() => PolaroidImage}:hover & {
    display: flex;
  }

  &:hover {
    background: #C0392B;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: flex;
    width: 18px;
    height: 18px;
    font-size: 12px;
  }
`;

const PolaroidImage = styled.div`
  position: absolute;
  background: white;
  padding: 10px;
  padding-bottom: 35px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  user-select: none;
  transition: transform 0.1s;

  img {
    display: block;
    object-fit: cover;
    pointer-events: none;
  }

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    padding: 6px;
    padding-bottom: 25px;
  }
`;

const ImageLabel = styled.div`
  position: absolute;
  bottom: 8px;
  left: 10px;
  right: 10px;
  text-align: center;
  font-family: 'Segoe Print', 'Bradley Hand', cursive;
  font-size: 12px;
  color: #555;

  @media (max-width: 768px) {
    font-size: 10px;
    bottom: 6px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 10;
`;

export default Paint;
