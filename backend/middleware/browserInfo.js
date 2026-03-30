const UAParser = require('ua-parser-js');

const getBrowserInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  let deviceType = 'desktop';
  if (result.device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'tablet';
  }

  return {
    userAgent: userAgent,
    deviceType: deviceType,
    browserName: result.browser.name || 'Unknown',
    browserVersion: result.browser.version || 'Unknown',
    platform: result.os.name || 'Unknown',
  };
};

const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    'Unknown'
  );
};

const browserInfoMiddleware = (req, res, next) => {
  req.browserInfo = {
    ...getBrowserInfo(req),
    ipAddress: getClientIP(req),
  };
  next();
};

module.exports = { browserInfoMiddleware };
