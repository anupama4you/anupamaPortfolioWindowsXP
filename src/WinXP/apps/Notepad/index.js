import React, { useState } from 'react';
import styled from 'styled-components';

import { WindowDropDowns } from 'components';
import dropDownData from './dropDownData';
import resumeData from 'data/resume.json'; 

// Function to generate resume text from JSON
function generateResumeText(data) {
  const border = '='.repeat(80);
  const line = '-'.repeat(76);
  
  let text = `${border}\n`;
  text += `                            ${data.personal.name}\n`;
  text += `${border}\n`;
  text += `${data.personal.location}\n`;
  text += `${data.personal.phone}\n`;
  text += `${data.personal.email}\n`;
  text += `${data.personal.website}\n\n`;
  
  // Professional Summary
  text += `${border}\n`;
  text += `PROFESSIONAL SUMMARY\n`;
  text += `${border}\n`;
  text += `${data.summary}\n\n`;
  
  // Technical Skills
  text += `${border}\n`;
  text += `TECHNICAL SKILLS\n`;
  text += `${border}\n`;
  Object.entries(data.skills).forEach(([category, skills]) => {
    const padding = ' '.repeat(19 - category.length);
    text += `${category}${padding}: ${skills}\n`;
  });
  text += '\n';
  
  // Professional Experience
  text += `${border}\n`;
  text += `PROFESSIONAL EXPERIENCE\n`;
  text += `${border}\n\n`;
  
  data.experience.forEach((job, index) => {
    const titlePadding = ' '.repeat(68 - job.title.length - job.period.length);
    text += `${job.title}${titlePadding}${job.period}\n`;
    text += `${job.company}, ${job.location}\n`;
    text += `${line}\n`;
    job.responsibilities.forEach(resp => {
      text += `  • ${resp}\n`;
    });
    if (index < data.experience.length - 1) text += '\n';
  });
  text += '\n';
  
  // Education
  text += `${border}\n`;
  text += `EDUCATION\n`;
  text += `${border}\n\n`;
  
  data.education.forEach((edu, index) => {
    const titleParts = [edu.degree];
    if (edu.gpa) titleParts.push(`(${edu.gpa})`);
    const titleLine = titleParts.join(' ');
    const datePadding = ' '.repeat(80 - titleLine.length - edu.date.length);
    text += `${titleLine}${datePadding}${edu.date}\n`;
    text += `${edu.institution}`;
    if (edu.location) text += `, ${edu.location}`;
    text += '\n';
    text += `${line}\n`;
    edu.highlights.forEach(highlight => {
      text += `  • ${highlight}\n`;
    });
    if (index < data.education.length - 1) text += '\n';
  });
  text += '\n';
  
  // Projects Note
  text += `${border}\n`;
  text += `PROJECTS\n`;
  text += `${border}\n`;
  text += `${data.projectsNote}\n\n`;
  
  // Volunteering
  text += `${border}\n`;
  text += `VOLUNTEERING & LEADERSHIP\n`;
  text += `${border}\n`;
  data.volunteering.forEach(item => {
    text += `  • ${item}\n`;
  });
  text += '\n';
  
  // Accomplishments
  text += `${border}\n`;
  text += `ACCOMPLISHMENTS\n`;
  text += `${border}\n`;
  data.accomplishments.forEach(item => {
    text += `  • ${item}\n`;
  });
  text += '\n';
  
  // References
  text += `${border}\n`;
  text += `REFERENCES\n`;
  text += `${border}\n`;
  data.references.forEach((ref, index) => {
    text += `${ref.name} (${ref.title})\n`;
    text += `${ref.organization}\n`;
    text += `Email: ${ref.email}\n`;
    if (index < data.references.length - 1) text += '\n';
  });
  text += '\n';
  
  text += `${border}\n`;
  text += `                        Last Updated: October 2025\n`;
  text += `${border}`;
  
  return text;
}

// Component to render text with bold support
function FormattedText({ text }) {
  // Parse text to identify bold sections (all caps lines, section headers)
  const lines = text.split('\n');
  
  return (
    <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'Lucida Console, Courier New, monospace', fontSize: '12px', lineHeight: '16px' }}>
      {lines.map((line, index) => {
        // Check if line should be bold
        const isBorder = line.match(/^[=]+$/);
        const isMainHeader = line.trim() === 'ANUPAMA DILSHAN';
        const isSectionHeader = line.match(/^[A-Z\s&]+$/) && line.trim().length > 3 && !isBorder;
        const isJobTitle = line.match(/^[A-Z\s]+(\(INTERNSHIP\))?\s+[A-Za-z]+\s+\d{4}/);
        const isDegreeTitle = line.match(/^(Master|Bachelor|Higher National)/);
        
        const shouldBeBold = isMainHeader || isSectionHeader || isJobTitle || isDegreeTitle;
        
        return (
          <div key={index} style={{ fontWeight: shouldBeBold ? 'bold' : 'normal' }}>
            {line || '\u00A0'}
          </div>
        );
      })}
    </div>
  );
}

export default function Notepad({ onClose }) {
  const initialText = generateResumeText(resumeData);
  const [docText, setDocText] = useState(initialText);
  const [wordWrap, setWordWrap] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  function onClickOptionItem(item) {
    switch (item) {
      case 'Exit':
        onClose();
        break;
      case 'Word Wrap':
        setWordWrap(!wordWrap);
        break;
      case 'Time/Date':
        const date = new Date();
        setDocText(
          `${docText}\n${date.toLocaleTimeString()} ${date.toLocaleDateString()}`,
        );
        setIsEditing(true);
        break;
      default:
    }
  }

  return (
    <Div>
      <section className="np__toolbar">
        <WindowDropDowns items={dropDownData} onClickItem={onClickOptionItem} />
      </section>
      <ContentWrapper 
        wordWrap={wordWrap}
        onClick={() => setIsEditing(true)}
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
          <FormattedText text={docText} />
        )}
      </ContentWrapper>
    </Div>
  );
}

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
  overflow-x: ${props => props.wordWrap ? 'hidden' : 'auto'};
  border: 1px solid #96abff;
  background: white;
  padding: 4px 6px;
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