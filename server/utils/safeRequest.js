export default function safeRequest(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(err => {
      console.error(err);
      res.status(500).send('Internal server error');
    });
  };
}
