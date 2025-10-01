import React, { useState } from 'react';
import styled from 'styled-components';

const LINKEDIN_URL = "https://www.linkedin.com/in/anupama-dilshan";

// Mock search results that all lead to LinkedIn
const searchResults = {
  "anupama dilshan": [
    {
      title: "Anupama Dilshan - Software Developer - LinkedIn",
      url: "linkedin.com › anupama-dilshan",
      description: "Recent University of Adelaide Computer Science Master's graduate with three years of international experience in web application development and cloud technologies..."
    },
    {
      title: "Anupama Dilshan | Professional Profile",
      url: "linkedin.com › in › anupama-dilshan",
      description: "Adelaide, South Australia, Australia · Software Developer at Department of Infrastructure and Transport · University of Adelaide · 500+ connections"
    },
    {
      title: "Contact Anupama Dilshan - LinkedIn",
      url: "linkedin.com/pub/anupama-dilshan",
      description: "Connect with Anupama Dilshan on LinkedIn. View profile, experience, education, and professional network."
    }
  ],
  "software developer adelaide": [
    {
      title: "Anupama Dilshan - Software Developer | LinkedIn",
      url: "linkedin.com › anupama-dilshan",
      description: "Experienced Software Developer in Adelaide specializing in Java, AWS, React, and cloud technologies. Currently working at Department of Infrastructure..."
    },
    {
      title: "Top Software Developers in Adelaide - LinkedIn",
      url: "linkedin.com › directory › adelaide-developers",
      description: "Featured: Anupama Dilshan - Master's in Computer Science from University of Adelaide. Expertise in full-stack development, AWS, Docker..."
    }
  ],
  "react developer portfolio": [
    {
      title: "Anupama Dilshan - Full Stack Developer Portfolio",
      url: "linkedin.com › anupama-dilshan",
      description: "Check out my portfolio featuring React, Node.js, and cloud-based applications. Currently building innovative solutions at Department of Infrastructure..."
    },
    {
      title: "Best React Developer Portfolios 2024",
      url: "dev.to › react-portfolios-2024",
      description: "Featuring standout portfolios including Anupama Dilshan's Windows XP-themed site. View on LinkedIn: linkedin.com/in/anupama-dilshan"
    }
  ],
  "university of adelaide computer science": [
    {
      title: "Anupama Dilshan - Master's Graduate | LinkedIn",
      url: "linkedin.com › anupama-dilshan",
      description: "Recent Master of Science graduate from University of Adelaide (GPA 5.8/7). Global Citizens Scholarship recipient. Currently working as Software Developer..."
    }
  ]
};

function GoogleSearch({ query, onSearch, goMain }) {
  const [searchInput, setSearchInput] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    "anupama dilshan",
    "anupama dilshan linkedin",
    "software developer adelaide",
    "react developer portfolio",
    "university of adelaide computer science"
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.toLowerCase());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  // Get matching results
  const getResults = () => {
    const q = query.toLowerCase();
    for (const [key, results] of Object.entries(searchResults)) {
      if (q.includes(key) || key.includes(q)) {
        return results;
      }
    }
    return searchResults["anupama dilshan"];
  };

  const results = query ? getResults() : null;

  return (
    <GoogleContainer>
      {!query ? (
        // Google Homepage
        <HomePage>
          <GoogleLogo>
            <span style={{ color: '#4285F4' }}>G</span>
            <span style={{ color: '#EA4335' }}>o</span>
            <span style={{ color: '#FBBC04' }}>o</span>
            <span style={{ color: '#4285F4' }}>g</span>
            <span style={{ color: '#34A853' }}>l</span>
            <span style={{ color: '#EA4335' }}>e</span>
          </GoogleLogo>
          <SearchForm onSubmit={handleSearch}>
            <SearchBox>
              <SearchIcon>🔍</SearchIcon>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search or type URL"
              />
              <MicIcon>🎤</MicIcon>
            </SearchBox>
            {showSuggestions && searchInput.length > 0 && (
              <Suggestions>
                {suggestions
                  .filter(s => s.toLowerCase().includes(searchInput.toLowerCase()))
                  .slice(0, 5)
                  .map((suggestion, i) => (
                    <SuggestionItem
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      🔍 {suggestion}
                    </SuggestionItem>
                  ))}
              </Suggestions>
            )}
            <ButtonGroup>
              <GoogleButton type="submit">Google Search</GoogleButton>
              <GoogleButton type="button" onClick={() => handleSuggestionClick("anupama dilshan")}>
                I'm Feeling Lucky
              </GoogleButton>
            </ButtonGroup>
          </SearchForm>
          <LangLinks>
            Google offered in: <a href="#" onClick={(e) => e.preventDefault()}>සිංහල</a> <a href="#" onClick={(e) => e.preventDefault()}>தமிழ்</a>
          </LangLinks>
        </HomePage>
      ) : (
        // Search Results Page
        <ResultsPage>
          <ResultsHeader>
            <SmallLogo onClick={goMain}>
              <span style={{ color: '#4285F4' }}>G</span>
              <span style={{ color: '#EA4335' }}>o</span>
              <span style={{ color: '#FBBC04' }}>o</span>
              <span style={{ color: '#4285F4' }}>g</span>
              <span style={{ color: '#34A853' }}>l</span>
              <span style={{ color: '#EA4335' }}>e</span>
            </SmallLogo>
            <SearchForm onSubmit={handleSearch} style={{ flex: 1, maxWidth: '600px' }}>
              <SearchBox style={{ margin: 0 }}>
                <SearchIcon>🔍</SearchIcon>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search"
                />
              </SearchBox>
            </SearchForm>
          </ResultsHeader>

          <ResultsInfo>
            About {results.length} results (0.42 seconds)
          </ResultsInfo>

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

            {/* Easter egg - "Did you mean" suggestion */}
            <DidYouMean>
              <span style={{ color: '#70757a' }}>Tip: All roads lead to </span>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1a0dab', textDecoration: 'none' }}
              >
                LinkedIn
              </a>
              <span style={{ color: '#70757a' }}> when searching for Anupama! 😉</span>
            </DidYouMean>
          </ResultsList>

          <Pagination>
            <PageNumbers>
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
            </PageNumbers>
          </Pagination>
        </ResultsPage>
      )}
    </GoogleContainer>
  );
}

const GoogleContainer = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  font-family: Arial, sans-serif;
`;

const HomePage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 20px;
`;

const GoogleLogo = styled.h1`
  font-size: 90px;
  margin-bottom: 30px;
  font-weight: normal;
  letter-spacing: -5px;
`;

const SearchForm = styled.form`
  width: 100%;
  max-width: 584px;
  position: relative;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  border: 1px solid #dfe1e5;
  border-radius: 24px;
  padding: 0 15px;
  margin: 0 auto 20px;
  background: white;
  
  &:hover {
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
    border-color: rgba(223, 225, 229, 0);
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    padding: 0 10px;
  }
`;

const SearchIcon = styled.span`
  color: #9aa0a6;
  font-size: 18px;
`;

const MicIcon = styled.span`
  font-size: 18px;
  cursor: pointer;
`;

const Suggestions = styled.div`
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #dfe1e5;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);
  z-index: 100;
`;

const SuggestionItem = styled.div`
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const GoogleButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #f8f9fa;
  border-radius: 4px;
  color: #3c4043;
  font-size: 14px;
  padding: 10px 16px;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    border: 1px solid #dadce0;
  }
`;

const LangLinks = styled.div`
  margin-top: 20px;
  font-size: 13px;
  color: #3c4043;
  
  a {
    color: #1a0dab;
    text-decoration: none;
    margin: 0 5px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ResultsPage = styled.div`
  padding: 20px 180px;
  
  @media (max-width: 1024px) {
    padding: 20px 40px;
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebebeb;
`;

const SmallLogo = styled.div`
  font-size: 30px;
  font-weight: normal;
  letter-spacing: -2px;
  cursor: pointer;
  flex-shrink: 0;
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

const DidYouMean = styled.div`
  margin: 30px 0;
  font-size: 14px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const Pagination = styled.div`
  margin-top: 40px;
`;

const PageNumbers = styled.div`
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
`;

export default GoogleSearch;