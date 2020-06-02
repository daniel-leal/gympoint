class HomeController {
  async index(req, res) {
    return res.json({ name: 'feature branch test' });
  }
}

export default new HomeController();
