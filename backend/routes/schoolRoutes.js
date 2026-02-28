import express from 'express';
import auth from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js'; // Assuming this exists for backend use or using direct DB calls

const router = express.Router();

// Get Instructor's Schools
router.get('/schools', auth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('schools')
            .select('*')
            .eq('instructor_id', req.userId);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create School
router.post('/schools', auth, async (req, res) => {
    try {
        const { name, address } = req.body;
        const { data, error } = await supabase
            .from('schools')
            .insert({ name, address, instructor_id: req.userId })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get School's Classes
router.get('/schools/:schoolId/classes', auth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('classes')
            .select('*')
            .eq('school_id', req.params.schoolId)
            .eq('instructor_id', req.userId);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Class
router.post('/schools/:schoolId/classes', auth, async (req, res) => {
    try {
        const { name, grade_level } = req.body;
        const { data, error } = await supabase
            .from('classes')
            .insert({
                school_id: req.params.schoolId,
                name,
                grade_level,
                instructor_id: req.userId
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enroll Learner in Class
router.post('/classes/:classId/enroll', auth, async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Find user by email (using Supabase Auth or Profiles)
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (profileError || !profile) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Enroll
        const { data, error } = await supabase
            .from('class_enrollments')
            .insert({ class_id: req.params.classId, user_id: profile.id })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') return res.status(400).json({ error: 'Student already enrolled' });
            throw error;
        }

        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
