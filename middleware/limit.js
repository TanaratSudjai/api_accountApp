const { RateLimiterRedis } = require('rate-limiter-flexible');
const Redis = require('ioredis');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  // password: process.env.REDIS_PASSWORD || undefined, // ถ้ามีรหัส
});

function createRateLimiter(points, duration, keyPrefix) {
  return new RateLimiterRedis({
    storeClient: redisClient,
    points,
    duration,
    keyPrefix,
  });
}

const registerLimiter = createRateLimiter(20, 1 * 60, 'register'); 
const loginLimiter = createRateLimiter(20, 1 * 60, 'login'); 

function rateLimitMiddleware(limiter) {
  return (req, res, next) => {
    limiter.consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        res.set('Retry-After', String(limiter.duration));
        res.status(429).json({
          error: 'Too many requests',
          message: 'คุณส่งคำขอมากเกินไป ลองใหม่อีกครั้งใน 5 นาที',
        });
      });
  };
}

module.exports = {
  registerLimiterMiddleware: rateLimitMiddleware(registerLimiter),
  loginLimiterMiddleware: rateLimitMiddleware(loginLimiter),
};
