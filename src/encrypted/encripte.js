const bcrypt = require ('bcryptjs')

const encrypt = async (textPplain ) => {
  const hash = await bcrypt.hash( textPplain, 10);
  return hash;
}

const compare = async (textPlain, hashPassword  )   => { 
  const result = await bcrypt.compare(textPlain, hashPassword);
  return result;
}

module.exports = { encrypt, compare }