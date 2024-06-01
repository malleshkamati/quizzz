// server.js
// import express from 'express';
// import { Client } from 'pg';
// import bodyParser from 'body-parser';
// import cors from 'cors';


// server.mjs

// Import dependencies
import pkg from 'pg';
import express from 'express';
// import { Client } from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
const { Client } = pkg;
// Initialize app and port
const app = express();
const port = 3000;

// Connect to database (can be moved to a separate file)
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: 'Mallesh@123',
  database: 'quiz_app'
});

client.connect(err => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to PostgreSQL');
  }
});


// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Quiz API');
});



app.use(cors());
app.use(bodyParser.json());

// app.post('/api/quizzes', (req, res) => {
//   const { title, questions } = req.body;
//   const quizCode = Math.random().toString(36).substring(7);
//   const quiz = { title, questions, code: quizCode };
//   // document.getElementById('quizCode').innerHTML = `<p>Quiz saved! Code: ${quiz.code}</p>`
//   client.query('INSERT INTO quiz_data (quizcode, quiz_qp) VALUES ($1, $2) RETURNING *', [quizCode, JSON.stringify(quiz)], (err, result) => {
//     if (err) {
//       console.error('Error executing query', err.stack);
//       res.status(500).send('Error saving quiz');
//     } else {
//       res.status(200).json(result.rows[0]);
//     }
//   });
// });


app.post('/api/quizzes', (req, res) => {
  const { title, questions } = req.body;
  const quizCode = Math.random().toString(36).substring(7);
  const quiz = { title, questions, code: quizCode };

  client.query('INSERT INTO quiz_data (quizcode, quiz_qp) VALUES ($1, $2) RETURNING *', 
  [quizCode, JSON.stringify(quiz)], 
  (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error saving quiz');
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});














app.get('/api/quizzes/:code', (req, res) => {
  const quizCode = req.params.code;

  client.query('SELECT * FROM quiz_data WHERE quizcode = $1', [quizCode], (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error loading quiz');
    } else {
      if (result.rows.length === 0) {
        res.status(404).send('Quiz not found');
      } else {
        res.status(200).json(result.rows[0]);
      }
    }
   
  });
});


// app.get('/api/quizzes/:code', (req, res) => {
//   const quizCode = req.params.code;

//   pool.query('SELECT * FROM quiz_data WHERE quizcode = $1', [quizCode], (err, result) => {
//     if (err) {
//       console.error('Error executing query', err.stack);
//       res.status(500).send('Error loading quiz');
//     } else {
//       if (result.rows.length === 10) {
//         res.status(404).send('Quiz is not there');
//       } else {
//         res.status(200).json(result.rows[0]); // Assuming the row contains the entire quiz object
//       }
//     }
//   });
// });







app.post('/api/results', (req, res) => {
  const { userName, quizCode, score, totalQuestions } = req.body;

  client.query('INSERT INTO results (user_name, quiz_code, score, total_questions) VALUES ($1, $2, $3, $4) RETURNING *', 
  [userName, quizCode, score, totalQuestions], (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error saving result');
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});

app.get('/api/results', (req, res) => {
  client.query('SELECT * FROM results', (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error loading results');
    } else {
      res.status(200).json(result.rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
