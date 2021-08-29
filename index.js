const express = require('express');
const app = express();
const connection = require('./database/database');
const Question = require('./database/Question');
const Answer = require('./database/Answer');

/* Database */
connection
    .authenticate()
    .then(() => {
        console.log('OK')
    })
    .catch((e) => {
        console.log(e);
    })

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    Question.findAll({raw: true, order:[
        ['id', 'DESC']
    ]}).then(questions => {
        res.render('index', {
            questions: questions
        });
    });   
});

app.get('/question/:id', (req, res) => {
    const id = parseInt(req.params.id);

    Question.findOne({
        where: {id: id}
    }).then(question => {
       if(question != undefined) {

            Answer.findAll({
                where: {questionId: question.id},
                order:[
                    ['id', 'DESC']
                ]
            }).then(answer => {
                res.render('question', {
                    question: question,
                    answer: answer
                });
            })
       } else {
            res.redirect('/');
       }
    })
});

app.get('/ask', (req, res) => {
    res.render('ask');
});


app.post('/savequestion', (req, res) => {
    const subject = req.body.subject;
    const question = req.body.question;

    Question.create({
        title: subject,
        description: question 
    }).then(() => {
        res.redirect('/')
    });
});

app.post('/answer', (req, res) => {
    const answer = req.body.answer;
    const questionId = req.body.questionId;

    Answer.create({
        body: answer,
        questionId: questionId
    }).then(() => {
        res.redirect('/question/' + questionId)
    })
});

// app.listen(4000, () => {
//     console.log('Server started');
// });

app.listen(process.env.PORT || 3000, function(){
    console.log("Server listening on port %d in %s mode", this.address().port, app.settings.env);
  });