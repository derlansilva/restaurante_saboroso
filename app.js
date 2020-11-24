var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const redis = require('redis');
const session = require('express-session');
const formidable = require('formidable');

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient()


const app = express();

const http = require('http').createServer(app)
const io = require('socket.io')(http);



io.on('connection' , function(socket){

  console.log('Novo usuario conectado')

})

var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);

//salvar imagens no banco de dados usando o formidable
app.use(function(req , res , next ){
  req.body = {}
  if(req.method === 'POST'){

      var form = formidable.IncomingForm({
          uploadDir: path.join(__dirname , "/public/images"),
      
          keepExtensions : true 
      });
    
      form.parse(req , function(err , fields , files){
          req.body = fields;
          req.fields = fields;
          req.files = files
      
          next()
      })

  }else{
    next()
  }
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.set('trust proxy', 1)

app.use(session({
  store: new RedisStore({ client: redisClient }),
    secret : 'alinne moreno',
    resave: true ,
    saveUninitialized: true
}))


app.use(logger('dev'));
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


http.listen(3000 , function() {
  console.log('servidor em execução')
})

