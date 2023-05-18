const bcrypt = require('bcrypt');

const password1 = 'password1';
const password2 = 'admin1';
const hashedPassword1 = '$2b$10$z64Q0IuI2orDuT9OXn5EYuZqhB1Qx1z1yRQnNJf0HSbTnKAw1Mi/a';
const hashedPassword2 = '$2b$10$P6dmFIJkFIdkOIwQUXtvhuODh6HvWJCZ44tgK1JZ6M27ny6MnJsw6';

(async () => {
  const result1 = await bcrypt.compare(password1, hashedPassword1);
  console.log('result1:', result1); // true

  const result2 = await bcrypt.compare(password2, hashedPassword2);
  console.log('result2:', result2); // true
})();