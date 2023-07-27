const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const { database } = require('./keys');
const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool(database);

// Create a MySQLStore instance using the session and the connection pool
const sessionStore = new MySQLStore({}, pool);

const app = express();
const port = 3000;
require('./lib/passport');


// Configuración del motor de plantillas Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars'),
}));
app.set('view engine', '.hbs');



// Session middleware
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));



// Configurar connect-flash
app.use(flash());
// Middleware para pasar el flash a las vistas

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
;
// Variables globales
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user;
  next();
});

// Rutas
app.use('/', require('./routes/index')); // Ruta principal
app.use(require('./routes/authentication')); // Ruta de autenticación
app.use('/clientes', require('./routes/cliente')); // Ruta de clientes
app.use('/cuentas', require('./routes/cuenta')); //  ruta cuenta
app.use('/movimientos', require('./routes/movimiento'));

// Carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos
// ...

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
