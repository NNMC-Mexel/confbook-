module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 16000),
  app: {
    keys: env.array('APP_KEYS', ['key1_change_me', 'key2_change_me']),
  },
});
