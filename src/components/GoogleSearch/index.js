import React, { useState } from 'react';
import styled from 'styled-components';
import smile from './smile.svg';
import find from './find.svg';

const LINKEDIN_URL = "https://www.linkedin.com/in/anupama-dilshan";

// Mock search results that all lead to LinkedIn
const searchResults = {
  "anupama dilshan": [
    {
      title: "Anupama Dilshan - Software Developer - LinkedIn",
      url: "linkedin.com › anupama-dilshan",
      description: "Recent University of Adelaide Computer Science Master's graduate with three years of international experience in web application development and cloud technologies. Currently working at Department of Infrastructure and Transport..."
    },
    {
      title: "Anupama Dilshan | Professional Profile",
      url: "linkedin.com › in › anupama-dilshan",
      description: "Adelaide, South Australia, Australia · Software Developer at Department of Infrastructure and Transport · University of Adelaide · 500+ connections · View Anupama's complete profile and connect"
    },
    {
      title: "Contact Anupama Dilshan - LinkedIn",
      url: "linkedin.com/pub/anupama-dilshan",
      description: "Connect with Anupama Dilshan on LinkedIn. View profile, experience with Java, AWS, React, Node.js, and professional network in Adelaide tech community."
    }
  ],
  "software developer adelaide": [
    {
      title: "Anupama Dilshan - Software Developer | LinkedIn",
      url: "linkedin.com › anupama-dilshan",
      description: "Experienced Software Developer in Adelaide specializing in Java, AWS, React, and cloud technologies. Currently working at Department of Infrastructure and Transport developing transport regulation systems..."
    },
    {
      title: "Top Software Developers in Adelaide - LinkedIn",
      url: "linkedin.com › directory › adelaide-developers",
      description: "Featured: Anupama Dilshan - Master's in Computer Science from University of Adelaide. Expertise in full-stack development, AWS, Docker, Kubernetes. Global Citizens Scholarship recipient..."
    },
    {
      title: "Adelaide Tech Community - Software Engineers",
      url: "linkedin.com › groups › adelaide-tech",
      description: "Connect with Adelaide's top developers including Anupama Dilshan. Active contributor to local tech meetups and open source projects. View profile: linkedin.com/in/anupama-dilshan"
    }
  ],
  "react developer portfolio": [
    {
      title: "Anupama Dilshan - Full Stack Developer Portfolio",
      url: "linkedin.com › anupama-dilshan",
      description: "Check out my portfolio featuring React, Node.js, Flutter, and cloud-based applications. Projects include WeCare (edge AI), CropSense (AIGC), and findLove dating platform..."
    },
    {
      title: "Best React Developer Portfolios 2024",
      url: "dev.to › react-portfolios-2024",
      description: "Featuring standout portfolios including Anupama Dilshan's Windows XP-themed site built with React and styled-components. Innovative approach to portfolio presentation. LinkedIn: linkedin.com/in/anupama-dilshan"
    },
    {
      title: "Creative Developer Portfolios - React Showcase",
      url: "linkedin.com › pulse › creative-portfolios",
      description: "Anupama Dilshan's nostalgic Windows XP portfolio demonstrates exceptional React skills and creative design thinking. Connect on LinkedIn to see more projects."
    }
  ],
  "university of adelaide computer science": [
    {
      title: "Anupama Dilshan - Master's Graduate | LinkedIn",
      url: "linkedin.com › anupama-dilshan",
      description: "Recent Master of Science graduate from University of Adelaide (GPA 5.8/7). Global Citizens Scholarship recipient. Specialized in distributed systems, machine learning, and secure software engineering..."
    },
    {
      title: "University of Adelaide Alumni - Tech Industry",
      url: "linkedin.com › school › university-of-adelaide-alumni",
      description: "Notable graduates: Anupama Dilshan (M.Sc Computer Science 2024) - Now Software Developer at Department of Infrastructure. Featured for academic excellence and industry contributions..."
    }
  ]
};

function GoogleSearch({ route, query, onSearch, goMain }) {
  const [value, setValue] = useState(query || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tag, setTag] = useState('All');

  const suggestions = [
    "anupama dilshan",
    "anupama dilshan linkedin",
    "software developer adelaide",
    "react developer portfolio",
    "university of adelaide computer science",
    "anupama dilshan github",
    "full stack developer adelaide"
  ];

  function onChange(e) {
    setValue(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  }

  function onClick() {
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
    }
  }

  function onFeelingLucky() {
    const luckySearch = "anupama dilshan";
    setValue(luckySearch);
    onSearch(luckySearch);
    setShowSuggestions(false);
  }

  function handleSuggestionClick(suggestion) {
    setValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  }

  // Get matching results
  function getResults() {
    const q = query.toLowerCase();
    for (const [key, results] of Object.entries(searchResults)) {
      if (q.includes(key) || key.includes(q)) {
        return results;
      }
    }
    return searchResults["anupama dilshan"];
  }

  const results = route === 'search' ? getResults() : null;

  function renderTags() {
    return 'All,Images,Videos,News,Maps,More'.split(',').map(tagName => (
      <div
        onClick={() => setTag(tagName)}
        className={`tag ${tagName === tag ? 'active' : ''}`}
        key={tagName}
      >
        {tagName}
      </div>
    ));
  }

  if (route === 'search') {
    return (
      <SearchPage>
        <section className="top-bars">
          <div className="top-bar">
            <div className="bar-items left">
              <img
                onClick={goMain}
                className="logo"
                src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                alt="Google"
              />
              <div className="search-bar">
                <input
                  type="text"
                  value={value}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                />
                <div className="icon">
                  <img
                    src="https://www.gstatic.com/images/branding/googlemic/2x/googlemic_color_24dp.png"
                    alt="microphone"
                  />
                </div>
                <div className="icon" onClick={onClick}>
                  <img src={find} alt="find" />
                </div>
              </div>
            </div>
            <div className="bar-items right">
              <div className="functions">
                <img src={smile} alt="smile" />
              </div>
            </div>
          </div>
          <div className="app-bar">
            <div className="tags left">{renderTags()}</div>
            <div className="tags right">
              <div className="tag">Settings</div>
              <div className="tag">Tools</div>
            </div>
          </div>
        </section>

        <section className="content">
          <ResultsInfo>About {results.length} results (0.42 seconds)</ResultsInfo>
          
          <ResultsList>
            {results.map((result, i) => (
              <ResultItem key={i}>
                <ResultURL>{result.url}</ResultURL>
                <ResultTitle
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.title}
                </ResultTitle>
                <ResultDescription>{result.description}</ResultDescription>
              </ResultItem>
            ))}

            <EasterEgg>
              <span style={{ color: '#70757a' }}>💡 Pro tip: All results lead to </span>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <span style={{ color: '#70757a' }}> - because that's where the real Anupama is! </span>
            </EasterEgg>
          </ResultsList>

          <Pagination>
            <PageNumber className="active">1</PageNumber>
            <PageNumber>2</PageNumber>
            <PageNumber>3</PageNumber>
            <PageNumber>4</PageNumber>
            <PageNumber>5</PageNumber>
            <PageNumber>6</PageNumber>
            <PageNumber>7</PageNumber>
            <PageNumber>8</PageNumber>
            <PageNumber>9</PageNumber>
            <PageNumber>10</PageNumber>
            <PageNext>Next</PageNext>
          </Pagination>
        </section>
        <br/>

        <footer>
          <section className="upper">
            <div className="footer-items left">
              <div className="item">Adelaide, SA, Australia</div>
            </div>
          </section>
          <section className="lower">
            <div className="footer-items left">
              <div className="item">Help</div>
              <div className="item">Send feedback</div>
              <div className="item">Privacy</div>
              <div className="item">Terms</div>
            </div>
          </section>
        </footer>
      </SearchPage>
    );
  }

  // Main Google page
  return (
    <MainPage>
      <header>
        <div className="text">Gmail</div>
        <div className="text">Images</div>
        <img src={smile} alt="avatar" />
      </header>
      <section className="content">
        <img
          className="logo"
          alt="Google"
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
        />
        <div className="search-bar-container">
          <div className="search-bar">
            <input
              type="text"
              onChange={onChange}
              value={value}
              onKeyDown={onKeyDown}
              onFocus={() => setShowSuggestions(value.length > 0)}
              placeholder="Search Google or type a URL"
            />
            <div className="icon">
              <img
                src="https://www.gstatic.com/images/branding/googlemic/2x/googlemic_color_24dp.png"
                alt="microphone"
              />
            </div>
          </div>
          {showSuggestions && value.length > 0 && (
            <Suggestions>
              {suggestions
                .filter(s => s.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 6)
                .map((suggestion, i) => (
                  <SuggestionItem
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <SearchIcon>🔍</SearchIcon>
                    <span>{suggestion}</span>
                  </SuggestionItem>
                ))}
            </Suggestions>
          )}
        </div>
        <div className="buttons">
          <button onClick={onClick}>Google Search</button>
          <button onClick={() => handleSuggestionClick("anupama dilshan")}>
            I'm Feeling Lucky
          </button>
        </div>
      </section>
      <footer>
        <section className="upper">
          <div className="items left">
            <div className="item">Adelaide, SA, Australia</div>
          </div>
        </section>
        <section className="lower">
          <div className="items left">
            <div className="item">Advertising</div>
            <div className="item">Business</div>
            <div className="item">About</div>
          </div>
          <div className="items right">
            <div className="item">Privacy</div>
            <div className="item">Terms</div>
            <div className="item">Settings</div>
          </div>
        </section>
      </footer>
    </MainPage>
  );
}

const MainPage = styled.div`
  height: 100%;
  background: white;
  position: relative;
  
  header {
    position: absolute;
    top: 0;
    width: 100%;
    height: 60px;
    padding: 0 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 13px;
    color: rgb(80, 80, 80);
    
    * {
      padding-right: 15px;
      cursor: pointer;
    }
    
    .text:hover {
      text-decoration: underline;
    }
    
    img {
      width: 48px;
    }
  }
  
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .logo {
      height: 92px;
      width: 272px;
      margin-top: 198px;
    }
    
    .search-bar-container {
      position: relative;
      margin-top: 26px;
      width: 586px;
    }
    
    .search-bar {
      width: 100%;
      height: 46px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.2);
      border-radius: 24px;
      display: flex;
      align-items: center;
      padding: 0 8px 0 16px;
      background: white;
      
      &:hover {
        box-shadow: 0 2px 8px -1px rgba(0, 0, 0, 0.3);
      }
      
      input {
        border: none;
        color: rgba(0, 0, 0, 0.87);
        flex: 1;
        height: 34px;
        font-size: 16px;
        outline: 0;
      }
      
      .icon {
        width: 40px;
        padding: 0 8px;
        height: 44px;
        cursor: pointer;
        display: flex;
        align-items: center;
        
        img {
          height: 24px;
          width: 24px;
        }
      }
    }
    
    .buttons {
      width: 100%;
      height: 36px;
      margin-top: 31px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      button {
        padding: 0 16px;
        height: 36px;
        margin: 0 6px;
        border: 0;
        font-size: 14px;
        color: rgb(60, 64, 67);
        background: rgb(248, 249, 250);
        border: 1px solid rgb(248, 249, 250);
        border-radius: 4px;
        cursor: pointer;
        
        &:hover {
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
          border: 1px solid rgb(218, 220, 224);
        }
      }
    }
  }
  
  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 83px;
    border-top: 1px solid rgba(0, 0, 0, 0.07);
    background-color: rgba(0, 0, 0, 0.05);
    
    .upper {
      position: relative;
      color: rgba(0, 0, 0, 0.54);
      width: 100%;
      font-size: 15px;
      padding-bottom: 2px;
      height: 50%;
    }
    
    .lower {
      position: relative;
      border-top: 1px solid rgba(0, 0, 0, 0.07);
      height: 50%;
      color: rgb(95, 99, 104);
      font-size: 13px;
      width: 100%;
      
      .item {
        cursor: pointer;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    .items {
      position: absolute;
      height: 100%;
      display: flex;
      align-items: center;
    }
    
    .left {
      left: 3px;
      
      .item {
        padding-left: 27px;
      }
    }
    
    .right {
      right: 3px;
      
      .item {
        padding-right: 27px;
      }
    }
  }
`;

const Suggestions = styled.div`
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 100;
  overflow: hidden;
`;

const SuggestionItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const SearchIcon = styled.span`
  font-size: 16px;
  color: #70757a;
`;

const SearchPage = styled.div`
  height: 100%;
  background: white;
  padding-top: 22px;
  position: relative;
  
  .top-bars {
    border-bottom: 1px rgb(235, 235, 235) solid;
  }
  
  .top-bar {
    height: 44px;
  }
  
  .app-bar {
    height: 58px;
    margin-left: 154px;
    position: relative;
    width: 584px;
  }
  
  .bar-items {
    display: flex;
    align-items: center;
    position: relative;
    height: 44px;
  }
  
  .left {
    position: absolute;
    left: 0;
  }
  
  .right {
    position: absolute;
    right: 4px;
  }
  
  .logo {
    width: 150px;
    height: 34px;
    padding: 4px 28px 0 30px;
    cursor: pointer;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    border-radius: 22px;
    width: 586px;
    height: 46px;
    border: 1px rgb(223, 225, 229) solid;
    padding: 5px 0 0 20px;
    
    input {
      outline: 0;
      border: 0;
      flex: 1;
      width: 30px;
      font-size: 16px;
    }
    
    img {
      width: 24px;
      height: 24px;
    }
    
    .icon {
      width: 40px;
      cursor: pointer;
    }
  }
  
  .functions {
    display: flex;
    align-items: center;
    height: 100%;
    padding-right: 14px;
    
    img {
      margin: 8px;
      width: 24px;
      cursor: pointer;
      height: 24px;
    }
  }
  
  .tags {
    height: 100%;
    display: flex;
    font-size: 13px;
    align-items: center;
    color: rgb(119, 119, 119);
  }
  
  .tag.active {
    color: rgb(26, 115, 232);
    border-bottom: 3px rgb(26, 115, 232) solid;
    font-weight: 700;
  }
  
  .tag {
    height: 100%;
    cursor: pointer;
    padding: 28px 16px 0;
    
    &:hover:not(.active) {
      color: rgb(34, 34, 34);
    }
  }
  
  .content {
    padding: 20px 0 0 170px;
  }
  
  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 83px;
    border-top: 1px solid rgba(0, 0, 0, 0.07);
    background-color: rgba(0, 0, 0, 0.05);
    
    .upper {
      position: relative;
      color: rgba(0, 0, 0, 0.54);
      width: 100%;
      font-size: 15px;
      padding-bottom: 2px;
      height: 50%;
    }
    
    .lower {
      position: relative;
      border-top: 1px solid rgba(0, 0, 0, 0.07);
      height: 50%;
      color: rgb(95, 99, 104);
      font-size: 13px;
      width: 100%;
      
      .item {
        cursor: pointer;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    .footer-items {
      height: 100%;
      display: flex;
      align-items: center;
      padding-left: 150px;
      position: relative;
    }
    
    .left .item {
      margin-right: 27px;
    }
  }
`;

const ResultsInfo = styled.div`
  color: #70757a;
  font-size: 14px;
  margin-bottom: 20px;
`;

const ResultsList = styled.div`
  max-width: 600px;
`;

const ResultItem = styled.div`
  margin-bottom: 30px;
`;

const ResultURL = styled.div`
  color: #202124;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 3px;
`;

const ResultTitle = styled.a`
  color: #1a0dab;
  font-size: 20px;
  line-height: 26px;
  text-decoration: none;
  display: block;
  margin-bottom: 3px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:visited {
    color: #681da8;
  }
`;

const ResultDescription = styled.div`
  color: #4d5156;
  font-size: 14px;
  line-height: 22px;
`;

const EasterEgg = styled.div`
  margin: 30px 0;
  font-size: 14px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4285f4;
  
  a {
    color: #1a0dab;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Pagination = styled.div`
  margin-top: 40px;
  margin-bottom: 120px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const PageNumber = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1a0dab;
  border-radius: 50%;
  
  &.active {
    background: #4285f4;
    color: white;
  }
  
  &:hover:not(.active) {
    background: #f8f9fa;
  }
`;

const PageNext = styled(PageNumber)`
  width: auto;
  padding: 0 15px;
  border-radius: 20px;
  color: #1a0dab;
`;

export default GoogleSearch;