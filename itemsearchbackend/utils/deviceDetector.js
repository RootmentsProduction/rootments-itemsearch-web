const { UAParser } = require('ua-parser-js');

/**
 * Extract device and browser information from user agent
 */
const getDeviceInfo = (userAgent, req) => {
  const parser = new UAParser(userAgent);
  
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();
  const cpu = parser.getCPU();
  const engine = parser.getEngine();
  
  const ip = req.headers['x-forwarded-for'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress || 
             (req.connection.socket ? req.connection.socket.remoteAddress : null);
  
  return {
    browser: browser.name || 'Unknown',
    browserVersion: browser.version || 'Unknown',
    operatingSystem: os.name || 'Unknown',
    osVersion: os.version || 'Unknown',
    deviceType: device.type || 'Desktop',
    deviceModel: device.model || 'Unknown',
    deviceVendor: device.vendor || 'Unknown',
    cpu: cpu.architecture || 'Unknown',
    engine: engine.name || 'Unknown',
    userAgent: userAgent,
    ipAddress: ip ? ip.split(',')[0].trim() : 'Unknown',
    screenResolution: req.headers['screen-resolution'] || 'Unknown',
    language: req.headers['accept-language'] || 'Unknown',
  };
};

module.exports = { getDeviceInfo };

