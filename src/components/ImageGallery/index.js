import React, { useState } from 'react';
import styled from 'styled-components';

function ImageGallery({ images, projectName }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious(e);
    if (e.key === 'ArrowRight') goToNext(e);
  };

  React.useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [lightboxOpen, currentImageIndex]);

  return (
    <>
      <GalleryGrid>
        {images.map((image, i) => (
          <ThumbnailWrapper key={i} onClick={() => openLightbox(i)}>
            <img
              src={image}
              alt={`${projectName} screenshot ${i + 1}`}
            />
            <Overlay>
              <span>🔍</span>
            </Overlay>
          </ThumbnailWrapper>
        ))}
      </GalleryGrid>

      {lightboxOpen && (
        <LightboxOverlay onClick={closeLightbox}>
          <LightboxContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}>×</CloseButton>
            
            {images.length > 1 && (
              <>
                <NavButton className="prev" onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious(e);
                }}>
                  ‹
                </NavButton>
                <NavButton className="next" onClick={(e) => {
                  e.stopPropagation();
                  goToNext(e);
                }}>
                  ›
                </NavButton>
              </>
            )}

            <ImageWrapper>
              <img
                src={images[currentImageIndex]}
                alt={`${projectName} screenshot ${currentImageIndex + 1}`}
              />
            </ImageWrapper>

            <ImageCounter>
              {currentImageIndex + 1} / {images.length}
            </ImageCounter>

            {images.length > 1 && (
              <ThumbnailStrip>
                {images.map((image, i) => (
                  <ThumbPreview
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={i === currentImageIndex ? 'active' : ''}
                  >
                    <img src={image} alt={`Thumbnail ${i + 1}`} />
                  </ThumbPreview>
                ))}
              </ThumbnailStrip>
            )}
          </LightboxContent>
        </LightboxOverlay>
      )}
    </>
  );
}

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  border: 1px solid #ddd;
  padding: 5px;
  background: #fff;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 32px;

  ${ThumbnailWrapper}:hover & {
    opacity: 1;
  }

  span {
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const LightboxContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: transparent;
  border: none;
  color: white;
  font-size: 48px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  z-index: 10001;

  &:hover {
    transform: scale(1.1);
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  font-size: 48px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10001;
  transition: background 0.2s;
  font-family: Arial, sans-serif;
  line-height: 1;
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &.prev {
    left: 20px;
  }

  &.next {
    right: 20px;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90vw;
  max-height: 70vh;

  img {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    border: 3px solid white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }
`;

const ImageCounter = styled.div`
  color: white;
  font-size: 14px;
  margin-top: 15px;
  font-family: 'Tahoma', sans-serif;
`;

const ThumbnailStrip = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  overflow-x: auto;
  max-width: 90vw;
  padding: 10px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
  }
`;

const ThumbPreview = styled.div`
  width: 80px;
  height: 60px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s, transform 0.2s;
  flex-shrink: 0;

  &.active {
    border-color: white;
  }

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default ImageGallery;