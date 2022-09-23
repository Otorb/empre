const { User} = require("../db");
const { encrypt } = require("../encrypted/encripte");


async function createUser(req, res, next) {
  try {
    const { email, name, password } = req.body;
    console.log('linea 8' , email , name , password )
    if (email && name && password) {
      const user = await User.findAll({
        where: { email: email },
      })
      
      if (user.length === 0) {
        console.log("Correcto, no existe un usuario con ese correo, se procede a crear uno nuevo")
        const passwordHash = await encrypt(password);
        let user1 = await User.create({
          email,
          name,
          password: passwordHash,
          type: "User"
        });

        return res.status(200).send({ Msg: "Usuario creado con exito", /* completeUser */user1});

      } else {
        console.log("entro aqui (18)")
        return res.status(400).json({ msg: "este usuario ya se encuentra registrado" })
      }

    } else {
      console.log("entro aqui (23)")
      return res.status(400).json({ msj: "falta algun campo" })
    }

  } catch (error) {
    next(error);
  }
}

module.exports = { createUser };