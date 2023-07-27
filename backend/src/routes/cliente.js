const express = require('express');
const router = express.Router();

const pool = require('../database');
const { render } = require('timeago.js');


const {  isLoggedIn } = require('../lib/auth');

router.get('/form', isLoggedIn,(req,res) => {
    res.render('clientes/agregar');
})


router.post('/agregar', isLoggedIn, async (req, res) => {
    try {
      const { clienteId, clienteNombre, clienteDireccion, clienteTelefono } = req.body;
      const newClient = {
        id_cliente: clienteId,
        nombre: clienteNombre,
        direccion: clienteDireccion,
        telefono: clienteTelefono,
        user_id: req.user.id,
      };
  
      await pool.query('INSERT INTO Clientes SET ?', [newClient]);

      res.redirect('/clientes');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al agregar el cliente, es posible que ya hay un id igual guardado en la base de datos');
    }
  });

  router.get('/', isLoggedIn, async(req, res) =>{
    const datosCliente = await pool.query('SELECT * FROM Clientes WHERE user_id = ?',  [req.user.id])
    res.render('clientes/cliente',{datosCliente});
  })

// Eliminar un cliente
router.get('/delete/:id',isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el cliente tiene cuentas
    const cuentas = await pool.query('SELECT COUNT(*) as cuenta FROM Cuentas WHERE id_cliente = ?', [id]);
    const cuenta = cuentas[0].cuenta;

    if (cuenta > 0) {
      // El cliente tiene cuentas, mostrar mensaje de alerta
      req.flash('error_msg', 'Debes eliminar las cuentas primero');
      res.redirect('/clientes');
    } else {
      // El cliente no tiene cuentas, eliminarlo
      await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
      req.flash('success_msg', 'Cliente eliminado exitosamente');
      res.redirect('/clientes');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el cliente');
  }
});

  //edit client
  router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const cliente = await pool.query('SELECT * FROM Clientes WHERE id_cliente = ?', [id]);
    res.render('clientes/edit', { cliente: cliente[0] });
  });
  

  router.post('/edit/:id', isLoggedIn, async(req, res) =>{
    const {id} = req.params;
    const { clienteId, clienteNombre, clienteDireccion, clienteTelefono } = req.body;
    const newClient = {
        id_cliente: clienteId,
        nombre: clienteNombre,
        direccion: clienteDireccion,
        telefono: clienteTelefono,
        user_id: req.user.id,
      };
    await pool.query('UPDATE clientes SET ? WHERE id_cliente = ?', [newClient, id])
    res.redirect('/clientes')
   
});



// Ruta para redireccionar al perfil del usuario
router.get('/cuenta/:id_cliente/profile', isLoggedIn, async (req, res) => {
  try {
    const { id_cliente } = req.params;
    // Obtén los datos del usuario de la base de datos
    const userData = await pool.query('SELECT * FROM Cuentas WHERE id_cliente = ?', [id_cliente]);
    

    res.render('cuentas/cuenta', { cuentas: userData });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos del usuario');
  }
});

  
module.exports = router;