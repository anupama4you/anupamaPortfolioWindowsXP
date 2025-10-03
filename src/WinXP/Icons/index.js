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
  function _onMouseDown() {
    onMouseDown(id);
  }
  function _onDoubleClick() {
    onDoubleClick(component);
  }
  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const posX = left + window.scrollX;
    const posY = top + window.scrollY;
    measure({ id, x: posX, y: posY, w: width, h: height });
  }, [id, measure]);
  return (
    <div
      className={className}
      onMouseDown={_onMouseDown}
      onDoubleClick={_onDoubleClick}
      ref={ref}
    >
      <div className={`${className}__img__container`}>
        <img src={icon} alt={title} className={`${className}__img`} />
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
