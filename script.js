const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/',
    'Space', 'Backspace'
  ];
  
  const keyboard = document.getElementById('keyboard');
  const inputField = document.querySelector('.inputField');
  const questionField = document.querySelector('.qHint');
  let  attempts = 5;
  // Create the keyboard
  keys.forEach(key => {
    const keyElement = document.createElement('div');
    keyElement.classList.add('key');
    keyElement.textContent = key === 'Space' ? '␣' : key;
  
    // Style specific keys
    if (key === 'Space') {
      keyElement.style.gridColumn = 'span 8'; // Make Space key span 8 columns
    } else if (key === 'Backspace') {
      keyElement.style.gridColumn = 'span 2'; // Make Backspace key span 2 columns
    }
  
    // Add data-key attribute
    keyElement.setAttribute('data-key', key);
  
    // Add event listener for key functionality
    keyElement.addEventListener('click', () => {
      const keyValue = keyElement.getAttribute('data-key');
      if (key === 'Space') {
        inputField.value += ' ';
      } else if (key === 'Backspace') {
        inputField.value = inputField.value.slice(0, -1);
      } else {
        inputField.value += key.toLowerCase();
      }
    });
  
    keyboard.appendChild(keyElement);
  });
  
  // Function to handle key presses
  function useKey(e) {
    const key = e.key.toUpperCase();
    const keyElement = document.querySelector(`.key[data-key="${key}"]`);
  
    if (keyElement) {
      keyElement.classList.add('clicked'); // Add class for visual feedback
      if (key === ' ') {
        inputField.value += ' ';
      } else if (key === 'Backspace') {
        inputField.value = inputField.value.slice(0, -1);
      } 
      inputField.focus();
    }
  }
  
  // Remove the `clicked` class after key release
  function removeKeyClass(e) {
    const key = e.key.toUpperCase();
    const keyElement = document.querySelector(`.key[data-key="${key}"]`);
    if (keyElement) {
      keyElement.classList.remove('clicked');
    }
  }
  
  // Fetch data from a JSON file
  function fetchData() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'data.json', true); // Ensure 'data.json' exists in the same directory
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject('Cannot fetch data');
          }
        }
      };
      xhr.send();
    });
  }
  
  let currentIndex = 0;
  let score = 0;
  let sortedQuestions = [];
  
  // Shuffle and prepare questions
  async function sortQuestions() {
    try {
      const questions = await fetchData();
      if (questions) {
        sortedQuestions = questions.gameData.sort(() => Math.random() - 0.5);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }
  
  // Display the current question
  function displayQuestion() {
    if (currentIndex < sortedQuestions.length) {
      const question = sortedQuestions[currentIndex];
      questionField.textContent = question.hint;
      inputField.value = ''; // Clear input field for new question
    } else {
      questionField.textContent = `Game Over! Your score: ${score}`;
    }
  }
  
  // Validate answer
  function checkAnswer() {
    const answer = inputField.value.trim().toLowerCase();
    if (answer === sortedQuestions[currentIndex].answer.toLowerCase()) {
      score++;
      document.querySelector('.scoreValue').textContent=`${score}`
      currentIndex++;
      displayQuestion();
    }else{
        attempts --;
    }
  }
  function updateLife(){
    
  }
  // Start the game
  async function startGame() {
    await sortQuestions();
    displayQuestion();
  }
  
  // Attach event listeners
  window.addEventListener('keydown', useKey);
  window.addEventListener('keyup', removeKeyClass);
  
  // Trigger game start
  startGame();
  
  // Validate answer on `Enter` key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  });
  document.querySelector('.cBtn').addEventListener('click',()=>{
    checkAnswer();
  })