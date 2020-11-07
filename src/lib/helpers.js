const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
};

helpers.matchPassword = async (contrasena,savedPasword)=>{
   try {
   return  await  bcrypt.compare(contrasena,savedPasword)
   } catch (error) {
       console.log(error)
   }
}

module.exports = helpers;
