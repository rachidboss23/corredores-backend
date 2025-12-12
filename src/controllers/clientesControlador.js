const { obtenerClientes } = require("../services/clientesServicio");

exports.listarClientes = async (req, res) => {
  try {
    const clientes = await obtenerClientes();
    return res.json({ ok: true, clientes });
  } catch (error) {
    console.error("Error listarClientes:", error);
    return res.status(500).json({ ok: false, error: "Error obteniendo clientes" });
  }
};
