const { z } = require('zod');

const searchGameValidator = z.object({
  name: z.string().optional(),
  platform: z.enum(['ios', 'android', '']).optional(),
});

module.exports = {
  searchGameValidator,
};
