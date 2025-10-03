import React, { useReducer, useRef, useCallback, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import useMouse from 'react-use/lib/useMouse';

import {
  ADD_APP,
  DEL_APP,
  FOCUS_APP,
  MINIMIZE_APP,
  TOGGLE_MAXIMIZE_APP,
  FOCUS_ICON,
  SELECT_ICONS,
  FOCUS_DESKTOP,
  START_SELECT,
  END_SELECT,
  POWER_OFF,
  CANCEL_POWER_OFF,
} from './constants/actions';
import { FOCUSING, POWER_STATE } from './constants';
import { defaultIconState, defaultAppState, appSettings } from './apps';
import Modal from './Modal';
import Footer from './Footer';
import Windows from './Windows';
import Icons from './Icons';
import { DashedBox } from 'components';
import ClippyAgent from 'components/ClippyAgent';

const initState = {
  apps: [],
  nextAppID: 0,
  nextZIndex: 0,
  focusing: FOCUSING.DESKTOP,
  icons: defaultIconState,
  selecting: false,
  powerState: POWER_STATE.START,
};
const reducer = (state, action = { type: '' }) => {
  switch (action.type) {
    case ADD_APP:
      const app = state.apps.find(
        _app => _app.component === action.payload.component,
      );
      if (action.payload.multiInstance || !app) {
        return {
          ...state,
          apps: [
            ...state.apps,
            {
              ...action.payload,
              id: state.nextAppID,
              zIndex: state.nextZIndex,
            },
          ],
          nextAppID: state.nextAppID + 1,
          nextZIndex: state.nextZIndex + 1,
          focusing: FOCUSING.WINDOW,
        };
      }
      const apps = state.apps.map(app =>
        app.component === action.payload.component
          ? { ...app, zIndex: state.nextZIndex, minimized: false }
          : app,
      );
      return {
        ...state,
        apps,
        nextZIndex: state.nextZIndex + 1,
        focusing: FOCUSING.WINDOW,
      };
    case DEL_APP:
      if (state.focusing !== FOCUSING.WINDOW) return state;
      return {
        ...state,
        apps: state.apps.filter(app => app.id !== action.payload),
        focusing:
          state.apps.length > 1
            ? FOCUSING.WINDOW
            : state.icons.find(icon => icon.isFocus)
              ? FOCUSING.ICON
              : FOCUSING.DESKTOP,
      };
    case FOCUS_APP: {
      const apps = state.apps.map(app =>
        app.id === action.payload
          ? { ...app, zIndex: state.nextZIndex, minimized: false }
          : app,
      );
      return {
        ...state,
        apps,
        nextZIndex: state.nextZIndex + 1,
        focusing: FOCUSING.WINDOW,
      };
    }
    case MINIMIZE_APP: {
      if (state.focusing !== FOCUSING.WINDOW) return state;
      const apps = state.apps.map(app =>
        app.id === action.payload ? { ...app, minimized: true } : app,
      );
      return {
        ...state,
        apps,
        focusing: FOCUSING.WINDOW,
      };
    }
    case TOGGLE_MAXIMIZE_APP: {
      if (state.focusing !== FOCUSING.WINDOW) return state;
      const apps = state.apps.map(app =>
        app.id === action.payload ? { ...app, maximized: !app.maximized } : app,
      );
      return {
        ...state,
        apps,
        focusing: FOCUSING.WINDOW,
      };
    }
    case FOCUS_ICON: {
      const icons = state.icons.map(icon => ({
        ...icon,
        isFocus: icon.id === action.payload,
      }));
      return {
        ...state,
        focusing: FOCUSING.ICON,
        icons,
      };
    }
    case SELECT_ICONS: {
      const icons = state.icons.map(icon => ({
        ...icon,
        isFocus: action.payload.includes(icon.id),
      }));
      return {
        ...state,
        icons,
        focusing: FOCUSING.ICON,
      };
    }
    case FOCUS_DESKTOP:
      return {
        ...state,
        focusing: FOCUSING.DESKTOP,
        icons: state.icons.map(icon => ({
          ...icon,
          isFocus: false,
        })),
      };
    case START_SELECT:
      return {
        ...state,
        focusing: FOCUSING.DESKTOP,
        icons: state.icons.map(icon => ({
          ...icon,
          isFocus: false,
        })),
        selecting: action.payload,
      };
    case END_SELECT:
      return {
        ...state,
        selecting: null,
      };
    case POWER_OFF:
      return {
        ...state,
        powerState: action.payload,
      };
    case CANCEL_POWER_OFF:
      return {
        ...state,
        powerState: POWER_STATE.START,
      };
    default:
      return state;
  }
};
function WinXP() {
  const [state, dispatch] = useReducer(reducer, initState);
  const ref = useRef(null);
  const mouse = useMouse(ref);
  const focusedAppId = getFocusedAppId();

  // Typing animation state
  const roles = [
    'Software Engineer',
    'Full-Stack Developer',
    'Web & Mobile App Developer',
    'Cloud & DevOps Engineer',
    'AI & Automation Specialist'
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.substring(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentRole.substring(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);
  const onFocusApp = useCallback(id => {
    dispatch({ type: FOCUS_APP, payload: id });
  }, []);
  const onMaximizeWindow = useCallback(
    id => {
      if (focusedAppId === id) {
        dispatch({ type: TOGGLE_MAXIMIZE_APP, payload: id });
      }
    },
    [focusedAppId],
  );
  const onMinimizeWindow = useCallback(
    id => {
      if (focusedAppId === id) {
        dispatch({ type: MINIMIZE_APP, payload: id });
      }
    },
    [focusedAppId],
  );
  const onCloseApp = useCallback(
    id => {
      if (focusedAppId === id) {
        dispatch({ type: DEL_APP, payload: id });
      }
    },
    [focusedAppId],
  );
  function onMouseDownFooterApp(id) {
    if (focusedAppId === id) {
      dispatch({ type: MINIMIZE_APP, payload: id });
    } else {
      dispatch({ type: FOCUS_APP, payload: id });
    }
  }
  function onMouseDownIcon(id) {
    dispatch({ type: FOCUS_ICON, payload: id });
  }
  function onDoubleClickIcon(component) {
    const appSetting = Object.values(appSettings).find(
      setting => setting.component === component,
    );
    dispatch({ type: ADD_APP, payload: appSetting });
  }
  function getFocusedAppId() {
    if (state.focusing !== FOCUSING.WINDOW) return -1;
    const focusedApp = [...state.apps]
      .sort((a, b) => b.zIndex - a.zIndex)
      .find(app => !app.minimized);
    return focusedApp ? focusedApp.id : -1;
  }
  function onMouseDownFooter() {
    dispatch({ type: FOCUS_DESKTOP });
  }
  function onClickMenuItem(o) {
    // Extract text content if o is a React element
    const text = typeof o === 'string' ? o : typeof o === 'object' && o.props && o.props.children ?
      (Array.isArray(o.props.children) ? o.props.children[0] : o.props.children) : o;

    if (text === 'Internet' || text === 'Internet Explorer')
      dispatch({ type: ADD_APP, payload: appSettings['Internet Explorer'] });
    else if (text === 'E-mail' || text === 'Outlook Express')
      dispatch({ type: ADD_APP, payload: appSettings.outlookExpress });
    else if (text === 'Minesweeper')
      dispatch({ type: ADD_APP, payload: appSettings.Minesweeper });
    else if (text === 'My Computer')
      dispatch({ type: ADD_APP, payload: appSettings['My Computer'] });
    else if (text === 'Notepad')
      dispatch({ type: ADD_APP, payload: appSettings.Notepad });
    else if (text === 'Winamp')
      dispatch({ type: ADD_APP, payload: appSettings.Winamp });
    else if (text === 'Paint')
      dispatch({ type: ADD_APP, payload: appSettings.Paint });
    else if (text === 'Command Prompt' || text === 'Cmd')
      dispatch({ type: ADD_APP, payload: appSettings.Cmd });
    else if (text === 'ClippyChat' || text === 'AI Expert Clippy')
      dispatch({ type: ADD_APP, payload: appSettings.ClippyChat });
    else if (text === 'Log Off')
      dispatch({ type: POWER_OFF, payload: POWER_STATE.LOG_OFF });
    else if (text === 'Turn Off Computer')
      dispatch({ type: POWER_OFF, payload: POWER_STATE.TURN_OFF });
    else
      dispatch({
        type: ADD_APP,
        payload: {
          ...appSettings.Error,
          injectProps: { message: 'C:\\\nApplication not found' },
        },
      });
  }
  function onMouseDownDesktop(e) {
    if (e.target === e.currentTarget)
      dispatch({
        type: START_SELECT,
        payload: { x: mouse.docX, y: mouse.docY },
      });
  }
  function onMouseUpDesktop(e) {
    dispatch({ type: END_SELECT });
  }
  const onIconsSelected = useCallback(
    iconIds => {
      dispatch({ type: SELECT_ICONS, payload: iconIds });
    },
    [dispatch],
  );
  function onClickModalButton(text) {
    dispatch({ type: CANCEL_POWER_OFF });
    dispatch({
      type: ADD_APP,
      payload: appSettings.Error,
    });
  }
  function onModalClose() {
    dispatch({ type: CANCEL_POWER_OFF });
  }
  return (
    <Container
      ref={ref}
      onMouseUp={onMouseUpDesktop}
      onMouseDown={onMouseDownDesktop}
      state={state.powerState}
    >
      <HeroText>
        <WaveEmoji>👋</WaveEmoji>
        <Greeting>Hey I'm Anupama</Greeting>
        <RoleContainer>
          <RoleText>{displayText}</RoleText>
          <Cursor>|</Cursor>
        </RoleContainer>
      </HeroText>
      <Icons
        icons={state.icons}
        onMouseDown={onMouseDownIcon}
        onDoubleClick={onDoubleClickIcon}
        displayFocus={state.focusing === FOCUSING.ICON}
        appSettings={appSettings}
        mouse={mouse}
        selecting={state.selecting}
        setSelectedIcons={onIconsSelected}
      />
      <DashedBox startPos={state.selecting} mouse={mouse} />
      <Windows
        apps={state.apps}
        onMouseDown={onFocusApp}
        onClose={onCloseApp}
        onMinimize={onMinimizeWindow}
        onMaximize={onMaximizeWindow}
        focusedAppId={focusedAppId}
      />
      <Footer
        apps={state.apps}
        onMouseDownApp={onMouseDownFooterApp}
        focusedAppId={focusedAppId}
        onMouseDown={onMouseDownFooter}
        onClickMenuItem={onClickMenuItem}
      />
      <ClippyWrapper>
        <ClippyAgent onOpenChat={() => onClickMenuItem('ClippyChat')} />
      </ClippyWrapper>
      {state.powerState !== POWER_STATE.START && (
        <Modal
          onClose={onModalClose}
          onClickButton={onClickModalButton}
          mode={state.powerState}
        />
      )}
    </Container>
  );
}

const powerOffAnimation = keyframes`
  0% {
    filter: brightness(1) grayscale(0);
  }
  30% {
    filter: brightness(1) grayscale(0);
  }
  100% {
    filter: brightness(0.6) grayscale(1);
  }
`;
const animation = {
  [POWER_STATE.START]: '',
  [POWER_STATE.TURN_OFF]: powerOffAnimation,
  [POWER_STATE.LOG_OFF]: powerOffAnimation,
};

const Container = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans');
  font-family: Tahoma, 'Noto Sans', sans-serif;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: url(assets/winxp/wallpaper.jpeg) no-repeat center center fixed;
  background-size: cover;
  animation: ${({ state }) => animation[state]} 5s forwards;
  *:not(input):not(textarea) {
    user-select: none;
  }
`;

const ClippyWrapper = styled.div`
  position: fixed;
  bottom: 80px;
  right: 30px;
  z-index: 9999;
  pointer-events: all;

  @media (max-width: 768px) {
    bottom: 100px;
    right: 15px;
    transform: scale(0.5);
    transform-origin: bottom right;
  }
`;

const blinkCursor = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const wave = keyframes`
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(14deg); }
  20%, 40% { transform: rotate(-8deg); }
  50% { transform: rotate(10deg); }
  60% { transform: rotate(-4deg); }
  70% { transform: rotate(0deg); }
`;

const HeroText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 0;
  pointer-events: none;
  animation: ${fadeIn} 1s ease-out;
      2px 2px 4px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(0, 0, 0, 0.5);
  text-shadow:
    1px 1px 2px rgba(0, 0, 0, 0.4),
    0 0 5px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 0 5%;
  }
`;

const WaveEmoji = styled.span`
  display: inline-block;
  font-size: 36px;
  margin-right: 10px;
  animation: ${wave} 2.5s infinite;
  animation-delay: 0.5s;
   text-shadow: none;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-right: 5px;
  }
`;

const Greeting = styled.div`
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 30px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2px;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: -10px;
  }
`;

const RoleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 48px;
`;

const RoleText = styled.div`
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 25px;
  font-weight: 400;
  color: #ffffff;
  border: 3px solid #ffffff;
  padding: 2px 5px;
  border-radius: 4px;
  backdrop-filter: blur(2px);
  min-width: 320px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 10px;
    min-width: 220px;
    padding: 2px 10px;
  }
`;

const Cursor = styled.span`
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 32px;
  color: #ffffff;
  animation: ${blinkCursor} 1s infinite;
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export default WinXP;
