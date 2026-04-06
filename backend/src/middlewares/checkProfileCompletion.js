const checkProfileCompletion = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  if (!req.user.is_profile_completed) {
    return res.status(403).json({
      success: false,
      message: 'Complete your profile first',
    });
  }

  next();
};

module.exports = checkProfileCompletion;