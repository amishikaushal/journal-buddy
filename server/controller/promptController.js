import { Request, Response } from 'express';
import { Prompt } from '../models/Prompt';

export const getRandomPrompt = async (req, res) => {
  try {
    const count = await Prompt.countDocuments();
    const random = Math.floor(Math.random() * count);
    const prompt = await Prompt.findOne().skip(random);
    res.json(prompt);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prompt' });
  }
};

export const getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prompts' });
  }
};