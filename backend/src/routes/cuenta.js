const express = require('express');
const router = express.Router();

const pool = require('../database');


const {  isLoggedIn } = require('../lib/auth');
// Mostrar todas las cuentas
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const cuentas = await pool.query('SELECT * FROM Cuentas WHERE user_id = ?',  [req.user.id]);
    res.render('cuentas/cuenta', { cuentas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las cuentas');
  }
});

// Mostrar formulario para agregar una cuenta
router.get('/agregar', isLoggedIn, (req, res) => {
  res.render('cuentas/agregar');
});

// Agregar una cuenta
router.post('/agregar', isLoggedIn, async (req, res) => {
  try {
    const { cuentaId, cuentaCliente, cuentaTipo, cuentaSaldo } = req.body;
    const newAccount = {
      id_cuenta: cuentaId,
      id_cliente: cuentaCliente,
      tipo_cuenta: cuentaTipo,
      saldo: cuentaSaldo,
      user_id: req.user.id,
    };

    await pool.query('INSERT INTO Cuentas SET ?', [newAccount]);
    res.redirect('/cuentas');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar la cuenta');
  }
});

// Mostrar formulario para editar una cuenta
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const cuenta = await pool.query('SELECT * FROM Cuentas WHERE id_cuenta = ?', [id]);
    res.render('cuentas/editCuenta', { cuenta: cuenta[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la cuenta');
  }
});

// Editar una cuenta
router.post('/edit/:id', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { cuentaId, cuentaCliente, cuentaTipo, cuentaSaldo } = req.body;
    const updatedAccount = {
      id_cuenta: cuentaId,
      id_cliente: cuentaCliente,
      tipo_cuenta: cuentaTipo,
      saldo: cuentaSaldo,
      user_id: req.user.id,
    };

    await pool.query('UPDATE Cuentas SET ? WHERE id_cuenta = ?', [updatedAccount, id]);
    res.redirect('/cuentas');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al editar la cuenta');
  }
});

// Eliminar una cuenta
router.post('/delete/:id', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Cuentas WHERE id_cuenta = ?', [id]);
    res.redirect('/cuentas');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar la cuenta');
  }
});

// Ruta para redireccionar al perfil del usuario
router.get('/clientes/:id_cliente/profile', isLoggedIn, async (req, res) => {
    try {
      const { id_cliente } = req.params;
      // Obtén los datos del usuario de la base de datos
      const userData = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id_cliente]);
      const user = userData[0]; // Suponiendo que solo recuperas un usuario
  
      res.render('cuentas/userProfile', { user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos del usuario');
    }
  });
  

module.exports = router;