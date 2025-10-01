import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

function Paint({ onClose, isFocus }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [tool, setTool] = useState('pencil');

  const colors = [
    '#000000', '#808080', '#800000', '#FF0000',
    '#808000', '#FFFF00', '#008000', '#00FF00',
    '#008080', '#00FFFF', '#000080', '#0000FF',
    '#800080', '#FF00FF', '#FFFFFF', '#C0C0C0'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e) => {
    if (!isFocus) return;
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
    if (!isDrawing || !isFocus) return;
    
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
      ctx.strokeStyle = 'white';
      ctx.lineWidth = brushSize * 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'fill') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Container>
      <Toolbar>
        <ToolSection>
          <ToolButton 
            active={tool === 'pencil'} 
            onClick={() => setTool('pencil')}
            title="Pencil"
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
          <ToolButton 
            active={tool === 'fill'} 
            onClick={() => setTool('fill')}
            title="Fill"
          >
            🪣
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
            <option value="16">16px</option>
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

      <CanvasContainer>
        <Canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ cursor: tool === 'pencil' ? 'crosshair' : tool === 'eraser' ? 'cell' : 'pointer' }}
        />
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
`;

const Separator = styled.div`
  width: 1px;
  height: 24px;
  background: #999;
  box-shadow: 1px 0 0 #fff;
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 24px);
  gap: 2px;
  padding: 8px;
  background: #c0c0c0;
  border-bottom: 2px solid #999;
  flex-shrink: 0;
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
`;

const CanvasContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding: 8px;
  background: #808080;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Canvas = styled.canvas`
  background: white;
  border: 1px solid #000;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
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