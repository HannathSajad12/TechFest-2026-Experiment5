const router = require('express').Router();
const Event = require('../models/Event');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try { res.json({ success: true, data: await Event.find() }); } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: ev });
  } catch (e) { next(e); }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, seats } = req.body;
    if (!name || seats == null)
      return res.status(400).json({ success: false, message: 'name and seats required' });
    res.status(201).json({ success: true, data: await Event.create(req.body) });
  } catch (e) { next(e); }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ev) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: ev });
  } catch (e) { next(e); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
