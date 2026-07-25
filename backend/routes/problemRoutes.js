const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// GET all problems with filters
router.get('/problems', async (req, res) => {
  try {
    const { difficulty, search } = req.query;
    let query = {};

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const problems = await Problem.find(query).sort({ createdAt: -1 });
    
    const stats = {
      total: await Problem.countDocuments(),
      easy: await Problem.countDocuments({ difficulty: 'Easy' }),
      medium: await Problem.countDocuments({ difficulty: 'Medium' }),
      hard: await Problem.countDocuments({ difficulty: 'Hard' }),
      solved: await Problem.countDocuments({ solved: { $gt: 0 } })
    };

    res.json({ problems, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single problem
router.get('/problems/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new problem
router.post('/problems', async (req, res) => {
  try {
    const { title, description, difficulty, examples, constraints, testCases, category } = req.body;
    
    const newProblem = await Problem.create({
      title,
      description,
      difficulty,
      examples,
      constraints,
      testCases,
      category
    });

    res.status(201).json(newProblem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update problem solved count
router.put('/problems/:id/solve', async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      { $inc: { solved: 1 } },
      { new: true }
    );
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;