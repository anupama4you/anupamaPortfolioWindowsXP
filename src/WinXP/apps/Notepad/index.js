import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { WindowDropDowns } from 'components';
import dropDownData from './dropDownData';
import resumeData from 'data/resume.json';

// ---------- Helpers ----------
const repeat = (ch, n) => (n > 0 ? ch.repeat(n) : '');
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function wrapPlain(text, width) {
  if (width <= 10) return text; // avoid over-wrapping on tiny panes
  const lines = text.split('\n');
  const out = [];
  for (const line of lines) {
    const words = line.split(/\s+/).filter(Boolean);
    if (!words.length) {
      out.push('');
      continue;
    }
    let cur = words[0];
    for (let i = 1; i < words.length; i++) {
      const w = words[i];
      if (cur.length + 1 + w.length > width) {
        out.push(cur);
        cur = w;
      } else {
        cur += ' ' + w;
      }
    }
    out.push(cur);
  }
  return out.join('\n');
}

function bulletBlock(text, cols, bullet = '  • ') {
  const w = cols - bullet.length;
  const wrapped = wrapPlain(text, w);
  const lines = wrapped.split('\n');
  return [bullet + (lines[0] ?? ''), ...lines.slice(1).map(l => ' '.repeat(bullet.length) + l)].join('\n');
}

function rightAlignedLine(left, right, cols, minGap = 2) {
  const gap = Math.max(minGap, cols - left.length - right.length);
  return left + repeat(' ', gap) + right;
}

function centerLine(s, cols) {
  if (s.length >= cols) return s;
  const left = Math.floor((cols - s.length) / 2);
  const right = cols - s.length - left;
  return repeat(' ', left) + s + repeat(' ', right);
}

// ---------- Resume text generator (width-aware) ----------
function generateResumeText(data, cols = 100) {
  cols = clamp(cols, 40, 200); // sensible bounds for layout
  const BORDER = repeat('=', cols);
  const LINE = repeat('-', cols);

  let text = '';
  text += `${BORDER}\n`;
  text += `${centerLine(data.personal.name, cols)}\n`;
  text += `${BORDER}\n`;
  text += `${data.personal.location}\n`;
  text += `${data.personal.phone}\n`;
  text += `${data.personal.email}\n`;
  text += `${data.personal.website}\n\n`;

  // Professional Summary
  text += `${BORDER}\n`;
  text += `PROFESSIONAL SUMMARY\n`;
  text += `${BORDER}\n`;
  const summary = data.summary && data.summary.trim().length
    ? data.summary
    : 'Full-stack Software Engineer with experience across government, fintech, and enterprise systems. Proven delivery of secure APIs, cloud-native services, and modern web apps.';
  text += `${wrapPlain(summary, cols)}\n\n`;

  // Technical Skills (align the colon)
  text += `${BORDER}\n`;
  text += `TECHNICAL SKILLS\n`;
  text += `${BORDER}\n`;
  const skillEntries = Object.entries(data.skills || {});
  const maxCat = clamp(skillEntries.reduce((m, [k]) => Math.max(m, k.length), 0), 8, Math.min(28, Math.floor(cols * 0.35)));
  for (const [category, skills] of skillEntries) {
    const padding = repeat(' ', maxCat - category.length + 1);
    // soft wrap skill values if very long
    const wrapped = wrapPlain(String(skills), cols - (maxCat + 2));
    const [first, ...rest] = wrapped.split('\n');
    text += `${category}${padding}: ${first}\n`;
    for (const cont of rest) {
      text += `${repeat(' ', maxCat + 2)}${cont}\n`;
    }
  }
  text += '\n';

  // Experience
  text += `${BORDER}\n`;
  text += `PROFESSIONAL EXPERIENCE\n`;
  text += `${BORDER}\n\n`;
  for (let i = 0; i < data.experience.length; i++) {
    const job = data.experience[i];
    const header = rightAlignedLine(job.title, job.period, cols);
    text += `${header}\n`;
    text += `${job.company}, ${job.location}\n`;
    text += `${LINE}\n`;
    for (const resp of job.responsibilities || []) {
      text += bulletBlock(resp, cols) + '\n';
    }
    if (i < data.experience.length - 1) text += '\n';
  }
  text += '\n';

  // Education
  text += `${BORDER}\n`;
  text += `EDUCATION\n`;
  text += `${BORDER}\n\n`;
  for (let i = 0; i < data.education.length; i++) {
    const edu = data.education[i];
    const titleParts = [edu.degree];
    if (edu.gpa) titleParts.push(`(${edu.gpa})`);
    const titleLine = titleParts.join(' ');
    text += rightAlignedLine(titleLine, edu.date, cols) + '\n';
    const instLine = `${edu.institution}${edu.location ? `, ${edu.location}` : ''}`;
    text += `${instLine}\n`;
    text += `${LINE}\n`;
    for (const h of edu.highlights || []) {
      text += bulletBlock(h, cols) + '\n';
    }
    if (i < data.education.length - 1) text += '\n';
  }
  text += '\n';

  // Projects note
  text += `${BORDER}\n`;
  text += `PROJECTS\n`;
  text += `${BORDER}\n`;
  text += `${wrapPlain(data.projectsNote || '', cols)}\n\n`;

  // Volunteering
  text += `${BORDER}\n`;
  text += `VOLUNTEERING & LEADERSHIP\n`;
  text += `${BORDER}\n`;
  for (const v of data.volunteering || []) {
    text += bulletBlock(v, cols) + '\n';
  }
  text += '\n';

  // Accomplishments
  text += `${BORDER}\n`;
  text += `ACCOMPLISHMENTS\n`;
  text += `${BORDER}\n`;
  for (const a of data.accomplishments || []) {
    text += bulletBlock(a, cols) + '\n';
  }
  text += '\n';

  // References
  text += `${BORDER}\n`;
  text += `REFERENCES\n`;
  text += `${BORDER}\n`;
  data.references?.forEach((ref, idx) => {
    text += `${ref.name} (${ref.title})\n`;
    text += `${ref.organization}\n`;
    text += `Email: ${ref.email}\n`;
    if (idx < data.references.length - 1) text += '\n';
  });
  text += '\n';

  text += `${BORDER}\n`;
  text += `${centerLine('Last Updated: October 2025', cols)}\n`;
  text += `${BORDER}`;

  return text;
}

// ---------- Render text with bold cues ----------
function FormattedText({ text }) {
  const lines = text.split('\n');
  return (
    <div
      style={{
        whiteSpace: 'pre-wrap',
        fontFamily: 'Lucida Console, Courier New, monospace',
        fontSize: '12px',
        lineHeight: '16px',
      }}
    >
      {lines.map((line, i) => {
        const isBorder = /^[=]+$/.test(line) || /^[-]+$/.test(line);
        const isMainHeader = line.trim() === 'ANUPAMA DILSHAN';
        const isSectionHeader = /^[A-Z][A-Z\s&]+$/.test(line.trim()) && !isBorder;
        const shouldBeBold = isMainHeader || isSectionHeader;
        return (
          <div key={i} style={{ fontWeight: shouldBeBold ? '700' : '400' }}>
            {line || '\u00A0'}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Component ----------
export default function Notepad({ onClose }) {
  const [docText, setDocText] = useState(''); // initial after measure
  const [wordWrap, setWordWrap] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [cols, setCols] = useState(100);
  const contentRef = useRef(null);

  // Measure columns based on monospace char width inside the content area
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const computeCols = () => {
      // Create a hidden measurer with the same font as the viewer
      const probe = document.createElement('span');
      probe.style.visibility = 'hidden';
      probe.style.position = 'absolute';
      probe.style.whiteSpace = 'pre';
      probe.style.fontFamily = 'Lucida Console, Courier New, monospace';
      probe.style.fontSize = '12px';
      probe.style.lineHeight = '16px';
      probe.textContent = 'M'.repeat(200);
      el.appendChild(probe);
      const charW = probe.getBoundingClientRect().width / 200;
      el.removeChild(probe);

      // subtract horizontal padding from ContentWrapper (6px left + 6px right)
      const innerW = el.clientWidth - 12;
      const newCols = Math.floor(innerW / charW);
      setCols(clamp(newCols, 40, 200));
    };

    computeCols();
    const ro = new ResizeObserver(computeCols);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Regenerate text whenever width changes (but don't clobber while editing)
  useEffect(() => {
    if (!isEditing) {
      setDocText(generateResumeText(resumeData, cols));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols]);

  function onClickOptionItem(item) {
    switch (item) {
      case 'Exit':
        onClose();
        break;
      case 'Word Wrap':
        setWordWrap(v => !v);
        break;
      case 'Time/Date': {
        const date = new Date();
        setDocText(prev => `${prev}\n${date.toLocaleTimeString()} ${date.toLocaleDateString()}`);
        setIsEditing(true);
        break;
      }
      default:
    }
  }

  const handleOpenResume = () => {
    window.open('assets/resume/Resume-Anupama-Dilshan-emanate.pdf', '_blank', 'noopener,noreferrer');
  };

  return (
    <Div>
      <section className="np__toolbar">
        <WindowDropDowns items={dropDownData} onClickItem={onClickOptionItem} />
      </section>
      <ContentWrapper
        ref={contentRef}
        wordWrap={wordWrap}
        onDoubleClick={() => setIsEditing(true)}
        onClick={() => !isEditing && setIsEditing(false)}
        title="Double-click to edit"
      >
        {isEditing ? (
          <StyledTextarea
            wordWrap={wordWrap}
            value={docText}
            onChange={e => setDocText(e.target.value)}
            spellCheck={false}
            autoFocus
            onBlur={() => setIsEditing(false)}
          />
        ) : (
          <>
            <DownloadButton onClick={handleOpenResume} title="Download PDF Resume">
              📄 Download Complete Resume (PDF)
            </DownloadButton>
            <FormattedText text={docText} />
          </>
        )}
      </ContentWrapper>
    </Div>
  );
}

// ---------- Styles ----------
const Div = styled.div`
  height: 100%;
  background: linear-gradient(to right, #edede5 0%, #ede8cd 100%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  .np__toolbar {
    position: relative;
    height: 21px;
    flex-shrink: 0;
    border-bottom: 1px solid white;
  }
`;

const ContentWrapper = styled.div`
  flex: auto;
  overflow-y: auto;
  overflow-x: ${props => (props.wordWrap ? 'hidden' : 'auto')};
  border: 1px solid #96abff;
  background: white;
  padding: 4px 6px; /* keep in sync with width calc */
  cursor: text;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  outline: none;
  font-family: 'Lucida Console', 'Courier New', monospace;
  font-size: 12px;
  line-height: 16px;
  resize: none;
  border: none;
  padding: 0;
  ${props => (props.wordWrap ? '' : 'white-space: nowrap;')}
  background: white;
  color: #000;
`;

const DownloadButton = styled.button`
  position: sticky;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  margin: 10px auto;
  padding: 10px 20px;
  background: linear-gradient(to bottom, #fff 0%, #e0e0e0 100%);
  border: 1px solid #888;
  border-radius: 3px;
  box-shadow:
    inset 1px 1px 0 rgba(255,255,255,0.8),
    inset -1px -1px 0 rgba(0,0,0,0.2),
    0 2px 4px rgba(0,0,0,0.2);
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.1s;

  &:hover {
    background: linear-gradient(to bottom, #fff 0%, #d5d5d5 100%);
    box-shadow:
      inset 1px 1px 0 rgba(255,255,255,0.9),
      inset -1px -1px 0 rgba(0,0,0,0.3),
      0 2px 6px rgba(0,0,0,0.3);
  }

  &:active {
    background: linear-gradient(to bottom, #d5d5d5 0%, #e0e0e0 100%);
    box-shadow:
      inset 1px 1px 2px rgba(0,0,0,0.3),
      inset -1px -1px 0 rgba(255,255,255,0.5);
    transform: translateX(-50%) translateY(1px);
  }
`;
