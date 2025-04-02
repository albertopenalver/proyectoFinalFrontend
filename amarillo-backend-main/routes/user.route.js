const express = require('express');
const router = express.Router();
const multer = require('multer');

const { createUser, createCreador, getUser, loginUser, assignAdminRole, getUserById, updateUserPhoto, getCurrentUser,updateUserName,deleteUser } = require('../controller/user.controller');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', createUser);
router.get('/', getUser);
router.get ('/creador',createCreador);
router.post('/login', loginUser);
router.put('/:userId/admin', assignAdminRole); // Use :userId
router.get('/:userId', getUserById);  // Use :userId
router.put('/:id/photo', upload.single('photo'), updateUserPhoto);
router.delete('/:id',deleteUser);

router.put('/:id/nombre', updateUserName);

router.get('/me', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    UserInstance.findById(decoded.userId)
      .then(user => res.json(user))
      .catch(err => res.status(500).json({ error: 'Error al obtener usuario', err }));
  });
});


module.exports = router;
