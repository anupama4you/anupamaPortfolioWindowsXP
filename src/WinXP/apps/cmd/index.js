import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import projectsData from 'data/projects.json';
import resumeData from 'data/resume.json';

const getAsciiArt = () => {
  return `
    ___                                           
   / _ \\                                          
  / /_\\ \\ _ __   _   _  _ __    __ _  _ __ ___   __ _ 
  |  _  || '_ \\ | | | || '_ \\  / _\` || '_ \` _ \\ / _\` |
  | | | || | | || |_| || |_) || (_| || | | | | || (_| |
  \\_| |_/|_| |_| \\__,_|| .__/  \\__,_||_| |_| |_| \\__,_|
                       | |                             
                       |_|    DILSHAN                  
`;
};

const CMD = ({ onClose, isFocus }) => {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Animated startup sequence
    const lines = [
      'Microsoft Windows XP [Version 5.1.2600]',
      '(C) Copyright 1985-2001 Microsoft Corp.',
      '',
    ];
    
    // Add ASCII art lines
    const asciiLines = getAsciiArt().split('\n').filter(line => line !== '');
    const infoLines = [
      '',
      `ABOUT ${resumeData.personal.name}`,
      '='.repeat(6 + resumeData.personal.name.length),
      '',
      resumeData.summary,
      '',
      'Type "help" for available commands.',
      '',
    ];
    
    const allLines = [...lines, ...asciiLines, ...infoLines];

    let currentLine = 0;
    const typeNextLine = () => {
      if (currentLine < allLines.length) {
        setHistory(prev => [...prev, allLines[currentLine]]);
        currentLine++;
        
        // Variable delays for effect
        let delay = 100;
        if (currentLine === 1) delay = 300;
        else if (currentLine === 2) delay = 500;
        else if (currentLine === 3) delay = 300;
        
        setTimeout(typeNextLine, delay);
      } else {
        setIsAnimating(false);
      }
    };

    typeNextLine();
  }, []);

  useEffect(() => {
    if (isFocus && inputRef.current && !isAnimating) {
      inputRef.current.focus();
    }
  }, [isFocus, isAnimating]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const getAsciiArt = () => {
    return `
    ___                                           
   / _ \\                                          
  / /_\\ \\ _ __   _   _  _ __    __ _  _ __ ___   __ _ 
  |  _  || '_ \\ | | | || '_ \\  / _\` || '_ \` _ \\ / _\` |
  | | | || | | || |_| || |_) || (_| || | | | | || (_| |
  \\_| |_/|_| |_| \\__,_|| .__/  \\__,_||_| |_| |_| \\__,_|
                       | |                             
                       |_|    DILSHAN                  
`;
  };

  const executeCommand = (cmd) => {
    const command = cmd.trim().toLowerCase();
    const args = command.split(' ');
    const mainCmd = args[0];

    let output = [];

    switch (mainCmd) {
      case 'help':
        output = [
          'Available Commands:',
          '==================',
          'HELP          - Display this help message',
          'ABOUT         - Information about Anupama',
          'SKILLS        - List technical skills',
          'EXPERIENCE    - Show work experience',
          'EDUCATION     - Display education history',
          'PROJECTS      - List all projects',
          'CONTACT       - Get contact information',
          'SOCIAL        - Social media links',
          'VOLUNTEERING  - Leadership & volunteer work',
          'ACCOMPLISHMENTS - Awards and achievements',
          'REFERENCES    - Professional references',
          'ASCII         - Display ASCII art',
          'CLEAR/CLS     - Clear the screen',
          'EXIT          - Close command prompt',
          '',
          'Type any command to get started!',
        ];
        break;

      case 'about':
        output = [
          getAsciiArt(),
          `ABOUT ${resumeData.personal.name}`,
          '='.repeat(6 + resumeData.personal.name.length),
          '',
          `Location: ${resumeData.personal.location}`,
          '',
          resumeData.summary,
          '',
          `Website: ${resumeData.personal.website}`,
        ];
        break;

      case 'skills':
        output = [
          'TECHNICAL SKILLS',
          '================',
          '',
          ...Object.entries(resumeData.skills).map(([category, skills]) => 
            `${category}:\n  > ${skills}`
          ),
        ];
        break;

      case 'experience':
        if (args[1]) {
          const index = parseInt(args[1]) - 1;
          if (resumeData.experience[index]) {
            const exp = resumeData.experience[index];
            output = [
              `${exp.title}`,
              '='.repeat(exp.title.length),
              `${exp.company} | ${exp.location}`,
              `Period: ${exp.period}`,
              '',
              'Responsibilities:',
              ...exp.responsibilities.map(r => `  * ${r}`),
            ];
          } else {
            output = [`Invalid experience number. Use 1-${resumeData.experience.length}`];
          }
        } else {
          output = [
            'WORK EXPERIENCE',
            '===============',
            '',
            'For details, type: experience [number]',
            '',
            ...resumeData.experience.map((exp, i) => 
              `[${i + 1}] ${exp.title}\n    ${exp.company} | ${exp.location}\n    ${exp.period}`
            ),
          ];
        }
        break;

      case 'education':
        output = [
          'EDUCATION',
          '=========',
          '',
          ...resumeData.education.flatMap(edu => [
            `${edu.degree}${edu.gpa ? ` (${edu.gpa})` : ''}`,
            `${edu.institution}${edu.location ? `, ${edu.location}` : ''} - ${edu.date}`,
            ...edu.highlights.map(h => `  * ${h}`),
            '',
          ]),
        ];
        break;

      case 'projects':
        if (args[1]) {
          const projectName = args.slice(1).join(' ');
          const project = projectsData.projects.find(
            p => p.name.toLowerCase() === projectName.toLowerCase()
          );
          if (project) {
            output = [
              `PROJECT: ${project.name}`,
              '='.repeat(project.name.length + 9),
              '',
              project.tagline,
              '',
              'Description:',
              project.description,
              '',
              'Technologies:',
              ...project.technologies.map(t => `  * ${t}`),
              '',
              'Highlights:',
              ...project.highlights.map(h => `  * ${h}`),
              '',
              project.github ? `GitHub: ${project.github}` : '',
              project.demo ? `Demo: ${project.demo}` : '',
              project.category ? `Category: ${project.category}` : '',
              project.year ? `Year: ${project.year}` : '',
            ].filter(Boolean);
          } else {
            output = [
              `Project "${projectName}" not found.`,
              '',
              'Type "projects" to see available projects',
            ];
          }
        } else {
          output = [
            'MY PROJECTS',
            '===========',
            '',
            'For detailed info, type: projects [name]',
            '',
            ...projectsData.projects.map(p => 
              `  * ${p.name} - ${p.tagline}`
            ),
            '',
            'Or open "My Computer" to explore projects visually!',
          ];
        }
        break;

      case 'contact':
        output = [
          'CONTACT INFORMATION',
          '===================',
          '',
          `Email    : ${resumeData.personal.email}`,
          `Phone    : ${resumeData.personal.phone}`,
          `Location : ${resumeData.personal.location}`,
          `Website  : ${resumeData.personal.website}`,
          '',
          'Type "social" for social media links',
        ];
        break;

      case 'social':
        output = [
          'SOCIAL MEDIA',
          '============',
          '',
          'LinkedIn : https://www.linkedin.com/in/anupama-dilshan',
          'GitHub   : https://github.com/anupama4you',
          'Medium   : https://medium.com/@anupama4you',
          '',
          'Feel free to connect!',
        ];
        break;

      case 'volunteering':
        output = [
          'VOLUNTEERING & LEADERSHIP',
          '=========================',
          '',
          ...resumeData.volunteering.map(v => `  * ${v}`),
        ];
        break;

      case 'accomplishments':
        output = [
          'ACCOMPLISHMENTS & AWARDS',
          '========================',
          '',
          ...resumeData.accomplishments.map(a => `  * ${a}`),
        ];
        break;

      case 'references':
        output = [
          'PROFESSIONAL REFERENCES',
          '=======================',
          '',
          ...resumeData.references.flatMap(ref => [
            `${ref.name} (${ref.title})`,
            ref.organization,
            `Email: ${ref.email}`,
            '',
          ]),
        ];
        break;

      case 'ascii':
        output = [getAsciiArt()];
        break;

      case 'clear':
      case 'cls':
        setHistory(['C:\\Users\\Anupama>']);
        return;

      case 'exit':
        onClose();
        return;

      case '':
        output = [];
        break;

      default:
        output = [
          `'${cmd}' is not recognized as an internal or external command,`,
          'operable program or batch file.',
          '',
          'Type "help" for available commands.',
        ];
    }

    setHistory([...history, `C:\\Users\\Anupama>${cmd}`, ...output, '']);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic autocomplete
      const commands = ['help', 'about', 'skills', 'experience', 'education', 'projects', 'contact', 'social', 'clear', 'exit'];
      const match = commands.find(cmd => cmd.startsWith(currentInput.toLowerCase()));
      if (match) {
        setCurrentInput(match);
      }
    }
  };

  const handleTerminalClick = () => {
    if (isFocus && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Container onClick={handleTerminalClick}>
      <Terminal ref={terminalRef}>
        {history.filter(line => line !== undefined).map((line, index) => (
          <Line key={index}>
            {String(line).split('\n').map((subLine, subIndex) => (
              <div key={subIndex}>{subLine || '\u00A0'}</div>
            ))}
          </Line>
        ))}
        {!isAnimating && (
          <InputLine>
            <Prompt>C:\Users\Anupama&gt;</Prompt>
            <Input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!isFocus || isAnimating}
              spellCheck={false}
            />
          </InputLine>
        )}
      </Terminal>
      {!isFocus && <Overlay />}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  position: relative;
  cursor: text;
`;

const Terminal = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  color: #c0c0c0;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;

  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: #000;
  }

  &::-webkit-scrollbar-thumb {
    background: #404040;
    border: 2px solid #000;
  }
`;

const Line = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
`;

const InputLine = styled.div`
  display: flex;
  align-items: center;
`;

const Prompt = styled.span`
  color: #c0c0c0;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  margin-right: 0;
  white-space: nowrap;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #c0c0c0;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  caret-color: #c0c0c0;

  &:disabled {
    cursor: default;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
`;

export default CMD;