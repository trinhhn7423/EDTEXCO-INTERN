const userModel = require('../models/user');

const sessionChecker = async (req, res, next) => {
  try {
    const dataUserSession = req.session.user;
    if (dataUserSession) {
      const findUser = await userModel.findOne({ _id: dataUserSession.id });
      if (findUser) {
        console.log("findUser", findUser);
      
        next();
      } else {
        return res.status(401).json({ message: 'Invalid session. User not found.' });
      }
    } else {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
  } catch (error) {
    console.error('Error in sessionChecker:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { sessionChecker }