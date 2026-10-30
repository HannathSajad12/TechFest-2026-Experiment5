const router = require('express').Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res, next) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ success: false, message: 'eventId required' });
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.seats <= 0) return res.status(400).json({ success: false, message: 'No seats left' });
    if (await Registration.findOne({ user: req.user.id, event: eventId }))
      return res.status(400).json({ success: false, message: 'Already registered' });
    await Registration.create({ user: req.user.id, event: eventId });
    event.seats -= 1;
    await event.save();
    res.status(201).json({ success: true, message: 'Registered successfully' });
  } catch (e) { next(e); }
});

router.get('/my', protect, async (req, res, next) => {
  try {
    const data = await Registration.find({ user: req.user.id }).populate('event');
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

module.exports = router;
