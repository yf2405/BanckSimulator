const express = require('express');
const router = express.Router();

const pool = require('../database');

const {  isLoggedIn } = require('../lib/auth');

// Mostrar todos los movimientos
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const movimientos = await pool.query('SELECT * FROM Movimientos WHERE user_id = ?',  [req.user.id]);
    res.render('movimientos/movimiento', { movimientos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los movimientos');
  }
});

// Mostrar formulario para agregar un movimiento
router.get('/agregar',isLoggedIn, (req, res) => {
  res.render('movimientos/agregar');
});

// Agregar un movimiento
router.post('/agregar', isLoggedIn, async (req, res) => {
  try {
    const { movimientoId, movimientoCuenta, movimientoTipo, movimientoMonto } = req.body;
    const newMovement = {
      id_movimiento: movimientoId,
      id_cuenta: movimientoCuenta,
      tipo_movimiento: movimientoTipo,
      monto: movimientoMonto,
      user_id: req.user.id,
    };

    await pool.query('INSERT INTO Movimientos SET ?', [newMovement]);
    res.redirect('/movimientos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el movimiento');
  }
});

// Mostrar formulario para editar un movimiento
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const movimiento = await pool.query('SELECT * FROM Movimientos WHERE id_movimiento = ?', [id]);
    res.render('movimientos/editMovimiento', { movimiento: movimiento[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el movimiento');
  }
});

// Editar un movimiento
router.post('/edit/:id', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { movimientoId, movimientoCuenta, movimientoTipo, movimientoMonto } = req.body;
    const updatedMovement = {
      id_movimiento: movimientoId,
      id_cuenta: movimientoCuenta,
      tipo_movimiento: movimientoTipo,
      monto: movimientoMonto,
      user_id: req.user.id,
    };

    await pool.query('UPDATE Movimientos SET ? WHERE id_movimiento = ?', [updatedMovement, id]);
    res.redirect('/movimientos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al editar el movimiento');
  }
});

// Eliminar un movimiento
router.post('/delete/:id', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Movimientos WHERE id_movimiento = ?', [id]);
    res.redirect('/movimientos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el movimiento');
  }
});

module.exports = router;
