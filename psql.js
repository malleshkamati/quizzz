const {Client}=require('pg')

const client=new Client({
  host:"localhost",
  user:"postgres",
  port:5432,
  password:'Mallesh@123',
  database:'quiz_app'
})
client.connect()
quizCode='15ed'
quiz={'sd':10}
client.query('insert into quiz_data (quizcode,quiz_qp) values($1,$2) RETURNING *',[quizCode,quiz])
client.query('select * from quiz_data',(err,res)=> {
    if (!err){
        console.log(res.rows);
    }else{
        console.log(err.message);
    }
  });
  
