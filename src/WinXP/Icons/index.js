import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

function Icons({
  icons,
  onMouseDown,
  onDoubleClick,
  displayFocus,
  mouse,
  selecting,
  setSelectedIcons,
}) {
  const [iconsRect, setIconsRect] = useState([]);
  function measure(rect) {
    if (iconsRect.find(r => r.id === rect.id)) return;
    setIconsRect(iconsRect => [...iconsRect, rect]);
  }
  useEffect(() => {
    if (!selecting) return;
    const sx = Math.min(selecting.x, mouse.docX);
    const sy = Math.min(selecting.y, mouse.docY);
    const sw = Math.abs(selecting.x - mouse.docX);
    const sh = Math.abs(selecting.y - mouse.docY);
    const selectedIds = iconsRect
      .filter(rect => {
        const { x, y, w, h } = rect;
        return x - sx < sw && sx - x < w && y - sy < sh && sy - y < h;
      })
      .map(icon => icon.id);
    setSelectedIcons(selectedIds);
  }, [iconsRect, setSelectedIcons, selecting, mouse.docX, mouse.docY]);
  return (
    <IconsContainer>
      {icons.map(icon => (
        <StyledIcon
          key={icon.id}
          {...icon}
          displayFocus={displayFocus}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
          measure={measure}
        />
      ))}
    </IconsContainer>
  );
}

function Icon({
  title,
  onMouseDown,
  onDoubleClick,
  icon,
  className,
  id,
  component,
  measure,
}) {
  const ref = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Reset position and styles on mobile
    if (isMobile && ref.current) {
      ref.current.style.position = '';
      ref.current.style.left = '';
      ref.current.style.top = '';
      ref.current.style.zIndex = '';
      setIsDragging(false);
    }
  }, [isMobile]);

  function _onMouseDown(e) {
    onMouseDown(id);

    // Disable dragging on mobile
    if (isMobile) return;

    // Only start drag if holding for a moment or moving
    const rect = ref.current.getBoundingClientRect();
    setInitialPos({ x: rect.left, y: rect.top });
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    // Set a timeout to enable dragging after a brief hold
    const dragTimer = setTimeout(() => {
      setIsDragging(true);
    }, 150);

    const cleanup = () => {
      clearTimeout(dragTimer);
      document.removeEventListener('mouseup', cleanup);
    };

    document.addEventListener('mouseup', cleanup);
  }

  function _onDoubleClick() {
    setIsDragging(false);
    onDoubleClick(component);
  }

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    const { left, top, width, height } = target.getBoundingClientRect();
    const posX = left + window.scrollX;
    const posY = top + window.scrollY;
    measure({ id, x: posX, y: posY, w: width, h: height });
  }, [id, measure]);

  useEffect(() => {
    if (!isDragging) {
      // Reset z-index when not dragging
      if (ref.current) {
        ref.current.style.zIndex = '';
      }
      return;
    }

    const handleMouseMove = (e) => {
      if (ref.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        ref.current.style.position = 'fixed';
        ref.current.style.left = `${newX}px`;
        ref.current.style.top = `${newY}px`;
        ref.current.style.zIndex = '9999';
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Handle click for mobile (single tap to open)
  const handleClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      onDoubleClick(component);
    }
  };

  return (
    <div
      className={className}
      onMouseDown={_onMouseDown}
      onDoubleClick={_onDoubleClick}
      onClick={handleClick}
      ref={ref}
      style={{
        cursor: isDragging ? 'grabbing' : 'pointer',
      }}
    >
      <div className={`${className}__img__container`}>
        <img src={icon} alt={title} className={`${className}__img`} draggable="false" />
      </div>
      <div className={`${className}__text__container`}>
        <div className={`${className}__text`}>{title}</div>
      </div>
    </div>
  );
}

const IconsContainer = styled.div`
  position: absolute;
  margin-top: 40px;
  margin-left: 40px;
  padding-bottom: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 90px);
  grid-template-rows: repeat(5, auto);
  grid-auto-flow: column;

  @media (max-width: 768px) {
    margin-top: 20px;
    margin-left: 15px;
    margin-right: 15px;
    padding-bottom: 120px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    grid-auto-flow: row;
    gap: 15px;
    width: calc(100% - 30px);
  }
`;

const StyledIcon = styled(Icon)`
  width: 90px;
  margin-bottom: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 0;
  }

  &__text__container {
    width: 100%;
    font-size: 11px;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    margin-top: 6px;
    display: flex;
    justify-content: center;

    @media (max-width: 768px) {
      font-size: 10px;
    }

    &:before {
      content: '';
      display: block;
      flex-grow: 1;
    }
    &:after {
      content: '';
      display: block;
      flex-grow: 1;
    }
  }
  &__text {
    padding: 1px 4px 2px;
    background-color: ${({ isFocus, displayFocus }) =>
      isFocus && displayFocus ? '#0b61ff' : 'transparent'};
    text-align: center;
    flex-shrink: 1;
    border-radius: 2px;
  }
  &__img__container {
    width: 30px;
    height: 30px;
    filter: ${({ isFocus, displayFocus }) =>
      isFocus && displayFocus ? 'drop-shadow(0 0 blue)' : ''};

    @media (max-width: 768px) {
      width: 35px;
      height: 35px;
    }
  }
  &__img {
    width: 30px;
    height: 30px;
    opacity: ${({ isFocus, displayFocus }) =>
      isFocus && displayFocus ? 0.5 : 1};

    @media (max-width: 768px) {
      width: 35px;
      height: 35px;
    }
  }
`;

export default Icons;
