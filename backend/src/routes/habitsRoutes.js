import express from 'express';
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  uncompleteHabit,
  getCompletions
} from '../controllers/habitsController.js';

const router = express.Router();

router.get('/', getHabits);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/complete', completeHabit);
router.delete('/:id/complete', uncompleteHabit);
router.get('/completions', getCompletions);

export default router;
