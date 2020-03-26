class auth {
  teste(req, res) {
    res.status(200).json({
      status: 'sucess'
    });
  }
}

module.exports = new auth();
