// Quiz Data
const quizData = [
    {
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correct: 1
    },
    {
        question: "What CSS property is used to change the text color?",
        options: ["text-color", "font-color", "color", "text-style"],
        correct: 2
    },
    {
        question: "Which HTML element is used to create a paragraph?",
        options: ["<text>", "<paragraph>", "<p>", "<para>"],
        correct: 2
    },
    {
        question: "What CSS property is used to add space between elements?",
        options: ["spacing", "margin", "padding", "gap"],
        correct: 1
    },
    {
        question: "Which HTML tag is used to create an unordered list?",
        options: ["<list>", "<ul>", "<ol>", "<dl>"],
        correct: 1
    },
    {
        question: "What CSS property is used to make text bold?",
        options: ["text-weight", "font-weight", "bold", "text-style"],
        correct: 1
    }
];

// Quiz State
let currentQuestion = 0;
let score = 0;
let selectedOption = null;

// DOM Elements
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score-value');

// Weather API
const weatherApiKey = 'b445d38a8607d15f8d8afac046330276'; // OpenWeatherMap API key
const weatherContainer = document.getElementById('weather-details');
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-btn');

// Quiz Functions
function loadQuestion() {
    const question = quizData[currentQuestion];
    questionElement.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });
    
    selectedOption = null;
    nextButton.disabled = true;
}

function selectOption(index) {
    selectedOption = index;
    const options = optionsContainer.getElementsByClassName('option');
    
    Array.from(options).forEach((option, i) => {
        option.classList.toggle('selected', i === index);
    });
    
    nextButton.disabled = false;
}

function checkAnswer() {
    if (selectedOption === quizData[currentQuestion].correct) {
        score++;
        scoreElement.textContent = score;
    }
}

function nextQuestion() {
    checkAnswer();
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        questionElement.textContent = `Quiz completed! Your score: ${score}/${quizData.length}`;
        optionsContainer.innerHTML = '';
        nextButton.style.display = 'none';
    }
}

// Weather Functions
async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayWeather(data) {
    const weather = {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
    };
    
    weatherContainer.innerHTML = `
        <div class="weather-card">
            <h3>${weather.city}, ${weather.country}</h3>
            <p class="temperature">${weather.temperature}°C</p>
            <p class="description">${weather.description}</p>
            <div class="details">
                <p>Humidity: ${weather.humidity}%</p>
                <p>Wind Speed: ${weather.windSpeed} m/s</p>
            </div>
        </div>
    `;
}

// Event Listeners
nextButton.addEventListener('click', nextQuestion);
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

// Initialize
loadQuestion(); 