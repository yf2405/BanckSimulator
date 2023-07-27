const bcrypt = require('bcryptjs'); //modulo para encriptar datos en esta caso la contraseña

const helpers ={};

helpers.encryptPassword = async (password) =>{ // este primer codigo resive la contraseña tal cual 

  const salt = await bcrypt.genSalt(10); // este salt o metodo gensalt crea un sifrado el numero 10 identifica los caracteres de 

 // sifrado que tendra, a mayor nuero de sifrado /es mas seguro
  
 const hashFinalPassword = await bcrypt.hash(password, salt); // resivimos las contraseña y el sifrado para poder unirlas y crear por fin la encriptacion
return hashFinalPassword;

};
// este codigo es para hacer pa conparacionn de contraseñas ingrasadas conlas guardadas
helpers.matchPassword = async (password, savePassword) =>{
try{
  return  await bcrypt.compare(password, savePassword);
} catch(e){
    console.log(e);
}
};  
module.exports = helpers;