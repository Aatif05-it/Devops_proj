// assets/js/navigation.js
// Helper function to get the current page info
function getCurrentPageInfo() {
  const pathname = window.location.pathname;
  const filename = pathname.split('/').pop();
  return filename;
}

// Navigation data structure
const navigationData = {
  'js-intro.html': {
    language: 'JavaScript',
    related: [
      {
        title: 'SQL Introduction',
        description: 'Learn databases and structured queries',
        link: '../sql/sql-intro.html'
      },
      {
        title: 'Python Programming',
        description: 'Explore Python for data & automation',
        link: '../Python/python-intro.html'
      },
      {
        title: 'Java Introduction',
        description: 'Learn enterprise programming',
        link: '../java/java-intro.html'
      },
      {
        title: 'HTML Basics',
        description: 'Understand DOM structure',
        link: '../html/html-intro.html'
      },
      {
        title: 'CSS Fundamentals',
        description: 'Style web pages beautifully',
        link: '../css/css-intro.html'
      },
      {
        title: 'Practice in Code Editor',
        description: 'Build interactive web apps',
        link: '../../editor/frontend-editor.html'
      }
    ]
  },
  'sql-intro.html': {
    language: 'SQL',
    related: [
      {
        title: 'Python Programming',
        description: 'Use Python with databases',
        link: '../Python/python-intro.html'
      },
      {
        title: 'Java Introduction',
        description: 'Build database applications',
        link: '../java/java-intro.html'
      },
      {
        title: 'JavaScript & Web',
        description: 'Frontend to database connections',
        link: '../js/js-intro.html'
      },
      {
        title: 'HTML & Web Forms',
        description: 'Create data entry forms',
        link: '../html/html-forms.html'
      },
      {
        title: 'Data Analysis Basics',
        description: 'Query and analyze data',
        link: 'sql-queries.html'
      },
      {
        title: 'Practice SQL Online',
        description: 'Interactive SQL exercises',
        link: '../../editor/backend-editor.html'
      }
    ]
  },
  'python-intro.html': {
    language: 'Python',
    related: [
      {
        title: 'Java Introduction',
        description: 'Learn compiled programming',
        link: '../java/java-intro.html'
      },
      {
        title: 'JavaScript Basics',
        description: 'Web development with JS',
        link: '../js/js-intro.html'
      },
      {
        title: 'SQL & Databases',
        description: 'Work with data in Python',
        link: '../sql/sql-intro.html'
      },
      {
        title: 'Django Web Framework',
        description: 'Build web apps with Python',
        link: 'python-django.html'
      },
      {
        title: 'Data Science with Python',
        description: 'Pandas, NumPy, Matplotlib',
        link: 'python-data-science.html'
      },
      {
        title: 'Practice in Code Editor',
        description: 'Run Python scripts',
        link: '../../editor/backend-editor.html'
      }
    ]
  },
  'java-intro.html': {
    language: 'Java',
    related: [
      {
        title: 'JavaScript Basics',
        description: 'Master web development',
        link: '../js/js-intro.html'
      },
      {
        title: 'Python Programming',
        description: 'Explore Python for versatility',
        link: '../Python/python-intro.html'
      },
      {
        title: 'SQL & Databases',
        description: 'Essential for backend development',
        link: '../sql/sql-intro.html'
      },
      {
        title: 'Java Syntax & Variables',
        description: 'Learn syntax and variables',
        link: 'java-syntax-variables.html'
      },
      {
        title: 'Spring Boot Framework',
        description: 'Build enterprise applications',
        link: 'java-spring.html'
      },
      {
        title: 'Practice in Code Editor',
        description: 'Build and test your projects',
        link: '../../editor/backend-editor.html'
      }
    ]
  },
  'java-syntax-variables.html': {
    language: 'Java',
    related: [
      {
        title: 'Java Data Types',
        description: 'Master type system and conversions',
        link: 'java-data-types.html'
      },
      {
        title: 'Java Methods & Functions',
        description: 'Learn function definition and calling',
        link: 'java-methods.html'
      },
      {
        title: 'JavaScript Basics',
        description: 'Compare with JavaScript syntax',
        link: '../js/js-intro.html'
      },
      {
        title: 'Python Variables',
        description: 'See alternative language approaches',
        link: '../Python/python-intro.html'
      },
      {
        title: 'Practice Coding',
        description: 'Test your syntax knowledge',
        link: '../../editor/backend-editor.html'
      }
    ]
  },
  'java-data-types.html': {
    language: 'Java',
    related: [
      {
        title: 'Java Operators',
        description: 'Arithmetic, logical, and comparison operators',
        link: 'java-operators.html'
      },
      {
        title: 'Python Programming',
        description: 'Compare type systems across languages',
        link: '../Python/python-intro.html'
      },
      {
        title: 'SQL Data Types',
        description: 'Understand database type systems',
        link: '../sql/sql-intro.html'
      },
      {
        title: 'JavaScript Data Types',
        description: 'Dynamic typing in JavaScript',
        link: '../js/js-intro.html'
      },
      {
        title: 'Test with Code Editor',
        description: 'Practice type conversions',
        link: '../../editor/backend-editor.html'
      }
    ]
  },
  'html-intro.html': {
    language: 'HTML',
    related: [
      {
        title: 'CSS Introduction',
        description: 'Learn styling and layout',
        link: '../css/css-intro.html'
      },
      {
        title: 'JavaScript Basics',
        description: 'Add interactivity to web pages',
        link: '../js/js-intro.html'
      },
      {
        title: 'Web Forms',
        description: 'Create interactive data entry forms',
        link: '../html/html-forms.html'
      },
      {
        title: 'Semantic HTML',
        description: 'Improve accessibility and SEO',
        link: '../html/html-semantic.html'
      },
      {
        title: 'HTML Media',
        description: 'Embed images, audio, and video',
        link: '../html/html-images.html'
      },
      {
        title: 'Practice in Code Editor',
        description: 'Build your first web page',
        link: '../../editor/frontend-editor.html'
      }
    ]
  },
  'css-intro.html': {
    language: 'CSS',
    related: [
      {
        title: 'JavaScript Introduction',
        description: 'Add interactivity to styled pages',
        link: '../js/js-intro.html'
      },
      {
        title: 'HTML Basics',
        description: 'Understand structure for styling',
        link: '../html/html-intro.html'
      },
      {
        title: 'CSS Flexbox',
        description: 'Master modern layout techniques',
        link: '../css/css-flexbox.html'
      },
      {
        title: 'CSS Grid',
        description: 'Create complex grid layouts',
        link: '../css/css-grid.html'
      },
      {
        title: 'Responsive Design',
        description: 'Design for all screen sizes',
        link: '../css/css-responsive.html'
      },
      {
        title: 'Practice in Code Editor',
        description: 'Style web pages beautifully',
        link: '../../editor/frontend-editor.html'
      }
    ]
  },
  'css-organization.html': {
    language: 'CSS',
    related: [
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript for interactivity',
        link: '../js/js-intro.html'
      },
      {
        title: 'CSS Flexbox',
        description: 'Master modern layout techniques',
        link: 'css-flexbox.html'
      },
      {
        title: 'CSS Grid',
        description: 'Create complex grid layouts',
        link: 'css-grid.html'
      },
      {
        title: 'Responsive Design',
        description: 'Design for all screen sizes',
        link: 'css-responsive.html'
      },
      {
        title: 'HTML Essentials',
        description: 'Master advanced HTML techniques',
        link: '../html/html-intro.html'
      },
      {
        title: 'Practice in Code Editor',
        description: 'Build real projects',
        link: '../../editor/frontend-editor.html'
      }
    ]
  }
};

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
});

// Function to populate the navigation container
function initializeNavigation() {
  const nextTopicsContainer = document.getElementById('next-topics');
  if (!nextTopicsContainer) return;

  const currentPage = getCurrentPageInfo();
  const navData = navigationData[currentPage];

  if (!navData) return;

  // Clear existing content
  nextTopicsContainer.innerHTML = '';

  // Create heading
  const heading = document.createElement('h3');
  heading.textContent = 'Continue Your ' + navData.language + ' Journey';
  nextTopicsContainer.appendChild(heading);

  // Create description
  const description = document.createElement('p');
  description.textContent = `You've mastered ${navData.language}! Expand your skills in these areas:`;
  nextTopicsContainer.appendChild(description);

  // Create topics list
  const list = document.createElement('ul');
  navData.related.forEach(topic => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = topic.link;
    link.target = '_blank';
    link.textContent = topic.title;
    
    listItem.appendChild(link);
    
    // Add description as inline text after dash
    const descText = document.createElement('small');
    descText.textContent = ' - ' + topic.description;
    listItem.appendChild(descText);
    
    list.appendChild(listItem);
  });

  nextTopicsContainer.appendChild(list);
}
