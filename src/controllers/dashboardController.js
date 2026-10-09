const s = require('../services/dashboardService');

exports.resumo = async (req, res, next) => {
  try {
    res.json(await s.obterResumo());
  } catch (e) {
    next(e);
  }
};
