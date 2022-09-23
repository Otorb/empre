
const { User } = require("../db");
const { compare } = require("../encrypted/encripte");
async function loginUser(req, res, next) {



  const { email, password } = req.body;

  try {
    if (email) {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json("El usuario no existe");
      } else {
        const checkPassword = await compare(password, user.password);
        if (checkPassword) {
         
          const result = {
            checkpassword: checkPassword,
            userId: user.id,
            totalUser: user
          }
          return res.status(200).json(result);

        } else {
          return res.status(404).json("La contraseña no es correcta");
        }
      }

    } else {
      return res.status(404).json({ msg: "no hay email" });

    }

  } catch (err) {
    next(err);
  }
}

module.exports = { loginUser };
