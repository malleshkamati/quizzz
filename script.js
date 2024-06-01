document.getElementById('createQuizLink').addEventListener('click', function() {
  document.getElementById('createQuiz').classList.remove('hidden');
  document.getElementById('takeQuiz').classList.add('hidden');
  

});

document.getElementById('takeQuiz').classList.remove('hidden');
document.getElementById('viewResults').classList.add('hidden');
document.getElementById('takeQuizLink').addEventListener('click', function() {
  document.getElementById('createQuiz').classList.add('hidden');
  document.getElementById('takeQuiz').classList.remove('hidden');
});

document.getElementById('addQuestion').addEventListener('click', function() {
  const questionDiv = document.createElement('div');
  questionDiv.classList.add('question');
  questionDiv.innerHTML = `
  <input type="text" placeholder="Question" class="questionText" required><br><br><br>
  <input type="text" placeholder="Option 1" class="option" required><br><br>
  <input type="text" placeholder="Option 2" class="option" required><br><br>
  <input type="text" placeholder="Option 3" class="option" required><br><br>
  <input type="text" placeholder="Option 4" class="option" required><br><br>
  <input type="text" placeholder="Correct Answer" class="correctAnswer" required><br>
  -----------------------------------------------------------------------------------`
  document.getElementById('questions').appendChild(questionDiv);
});


  



document.getElementById('loginLink').addEventListener('click', function() {
  document.getElementById('loginForm').classList.remove('hidden');
});



function showCreateQuiz() {
  document.getElementById('createQuiz').classList.remove('hidden');
  document.getElementById('takeQuiz').classList.add('hidden');
}

function showTakeQuiz() {
  document.getElementById('createQuiz').classList.add('hidden');
  document.getElementById('takeQuiz').classList.remove('hidden');
}

document.getElementById('createQuizLink').addEventListener('click', showCreateQuiz);
document.getElementById('takeQuizLink').addEventListener('click', showTakeQuiz);


// Login functionality...

let loggedInUser = null;

document.getElementById('loginButton').addEventListener('click', function() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'admin' && password === 'password') {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('createQuizLink').classList.remove('hidden');
    document.getElementById('takeQuizLink').classList.remove('hidden');
    document.getElementById('viewResults').classList.remove('hidden');
    document.getElementById('result_table').classList.remove('hidden');
    loggedInUser = 'admin';
    showCreateQuiz();
  } else {
    alert('Invalid credentials');
     document.getElementById('takeQuizLink').classList.remove('hidden');
  }
});

document.getElementById('saveQuiz').addEventListener('click', async function() {
  const title = document.getElementById('quizTitle').value;
  const questionElements = document.querySelectorAll('.question');
  const questions = Array.from(questionElements).map(questionElement => {
    const questionText = questionElement.querySelector('.questionText').value;
    const options = Array.from(questionElement.querySelectorAll('.option')).map(option => option.value);
    const correctAnswer = questionElement.querySelector('.correctAnswer').value;
    return  {questionText, options, correctAnswer} ;
  });

  try {
    const response = await fetch('http://localhost:3000/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, questions })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const quiz = await response.json();
    document.getElementById('quizCode').innerHTML = `<p>Quiz saved! Code: ${quiz.quizcode}</p>`;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
});








document.getElementById('loadQuiz').addEventListener('click', async function() {
  const quizCode = document.getElementById('quizCodeInput').value;
  const response = await fetch(`http://localhost:3000/api/quizzes/${quizCode}`);
  var quiz = await response.json();

  if (!quiz) {
    alert('Quiz not found!!!');
    console.log(quiz);
    return;
  }

  const quizContainer = document.getElementById('quizContainer');
  quizContainer.innerHTML = `<h3 style="text-align:center; margin-bottom:20px;">${quiz.quiz_qp.title}</h3>`;
  quizContainer.style.backgroundColor = '#f8f9fa'; // Light grey background for the quiz container
  quizContainer.style.padding = '20px';
  quizContainer.style.borderRadius = '10px';
  quizContainer.style.boxShadow = '0 4px 6px rgba(0,0,0,.1)';

  quiz.quiz_qp.questions.forEach((question, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.innerHTML = `
      <p style="margin-bottom:10px;">${question.questionText}</p>
      ${question.options.map((option, i) => `
        <div style="margin-bottom:10px;">
          <input type="radio" name="question${index}" value="${option}" style="margin-right:5px;">${option}
        </div>
      `).join('')}
    `;
    questionDiv.style.marginBottom = '20px'; // Add some space between questions
    quizContainer.appendChild(questionDiv);

    // Differentiate between even and odd questions using :nth-of-type()
    if (index % 2 === 0) {
      questionDiv.classList.add('even-question');
    } else {
      questionDiv.classList.add('odd-question');
    }
  });

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit Quiz';
  submitButton.style.marginTop = '20px';
  submitButton.style.padding = '10px 20px';
  submitButton.style.backgroundColor = '#007bff';
  submitButton.style.color = 'white';
  submitButton.style.border = 'none';
  submitButton.style.borderRadius = '5px';
  submitButton.style.cursor = 'pointer';
  submitButton.addEventListener('click', async function() {
    let score = 0;
    quiz.quiz_qp.questions.forEach((question, index) => {
      const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
      if (selectedOption && selectedOption.value === question.correctAnswer) {
        score++;
      }
    });

    const userName = document.getElementById('userNameInput').value;
    await fetch('http://localhost:3000/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, quizCode, score, totalQuestions: quiz.quiz_qp.questions.length })
    });

    alert(`You scored ${score} out of ${quiz.quiz_qp.questions.length}`);
    window.location.href = 'app.html';
  });

  quizContainer.appendChild(submitButton);
});






document.getElementById('viewResults').addEventListener('click', async function() {
  const resultsContainer = document.getElementById('result_table');
  resultsContainer.innerHTML = '';

  try {
    const response = await fetch('http://localhost:3000/api/results');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const results = await response.json();

    if (!results || results.length === 0) {
      resultsContainer.innerHTML = '<p>No results found.</p>';
    } else {
      resultsContainer.innerHTML = '';
      results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
          <p>s.no:${result.result_id}</p>
          <p>User Name: ${result.user_name}</p>
          <p>Quiz Code: ${result.quiz_code}</p>
          <p>Score: ${result.score}/${result.total_questions}</p>
          <hr>
        `;
        resultsContainer.appendChild(resultDiv);
      });
    }

  } catch (error) {
    console.error('Fetch error:', error);
    resultsContainer.innerHTML = '<p>Error loading results.</p>';
  }

  document.getElementById('createQuiz').classList.add('hidden');
  document.getElementById('takeQuiz').classList.add('hidden');
  document.getElementById('viewResults').classList.remove('hidden');
});
































