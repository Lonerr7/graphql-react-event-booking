import jwt from 'jsonwebtoken';

export const isAuth = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    req.isAuth = false;
    return next();
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    req.isAuth = false;
    return next();
  }

  if (!decoded) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decoded.userId;
  next();
};
