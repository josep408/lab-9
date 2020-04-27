
var express = require('express');
var mysql = require('mysql');
var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'jperez',
    password: 'jperez',
    database: 'quotes_db'
});
connection.connect();

app.get('/', function(req, res){
      var stmt = 'select * from l9_author;';
    console.log(stmt);
    var authors = null;
    connection.query(stmt, function(error, results){
        if(error) throw error;
        if(results.length) authors = results;
        res.render('home', {authors: authors});
    });
});


app.get('/author', function(req, res){
    var stmt = 'select * from l9_author where firstName=\'' 
                + req.query.firstname + '\' and lastName=\'' 
                + req.query.lastname + '\';'
	connection.query(stmt, function(error, found){
	    var author = null;
	    if(error) throw error;
	    if(found.length){
	        author = found[0];
	        author.dob = author.dob.toString().split(' ').slice(0,4).join(' ');
	        author.dod = author.dod.toString().split(' ').slice(0,4).join(' ');
	    }
	    res.render('author', {author: author});
	});
});

app.get('/author/:aid', function(req, res){
    var stmt = 'select quote, firstName, lastName ' +
               'from l9_quotes, l9_author ' +
               'where l9_quotes.authorId=l9_author.authorId ' + 
               'and l9_quotes.authorId=' + req.params.aid + ';'
    connection.query(stmt, function(error, results){
        if(error) throw error;
        var name = results[0].firstName + ' ' + results[0].lastName;
        res.render('quotes', {name: name, quotes: results});      
    });
});

app.get('/category', function(req, res) {
  var stmt = 'select category ' + 'from l9_quotes;';
              
    connection.query(stmt, function(error, results) {
        if(error) throw error;
        var category = results[0].category;
        res.render('category', {category: category, quotes: results});
});
});

app.get('/keywords', function(req, res) {
    var stmt = 'select quote ' + 'from l9_quotes;';
              
    connection.query(stmt, function(error, results) {
        if(error) throw error;
        var keywords = results[0].quote;
        res.render('keywords', {quote: keywords, quotes: results});
});
//   res.render('keywords'); 
});

app.get('/sex', function(req, res) {
    // select sex from l9_author;
   var stmt = 'select sex ' + 'from l9_author;' ;
   connection.query(stmt, function(error, results) {
       if(error)throw error;
       var sex = results[0].sex;
       res.render('sex', {sex: sex, quotes: results});
   });
//   res.render('sex'); 
});
app.get('*', function(req, res){
   res.render('Ever Feel Like You are int he wrong place?'); 
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Server has started ... ');
})