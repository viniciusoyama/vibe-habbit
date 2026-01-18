import express from 'express';
import { getCharacter, updateCharacter } from '../controllers/characterController.js';

const router = express.Router();

router.get('/', getCharacter);
router.put('/', updateCharacter);

export default router;
