import express from "express";
import productManager from "./productManager.js";
import Products from "./products.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pm = new productManager("./database/productos.json");

//agregar products a la persistencia en archivo desde el servidor

app.post("/productos", async (req, res) => {
  const newproduct = new Products({ ...req.body });
  const agregada = await pm.addProduct(newproduct);
  res.json(agregada);
});

//consultar productos todos o con limite desde el servidor

app.get("/productos", async (req, res) => {
  const limit = req.query.limit;
  if (!limit) {
    try {
      const productos = await pm.getProducts();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    try {
      const productos = await pm.getProducts();
      const productLimit = productos.slice(0, Number(limit));
      res.json(productLimit);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

//obtener producto por ID

app.get("/productos/:pid", async (req, res) => {
  try {
    const producto = await pm.getProductById(Number(req.params.pid));
    res.json(producto);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//editar un producto
app.put("/productos/:pid", async (req, res) => {
  let upd;
  try {
    // upd = new Products({ id: Number(req.params.pid), ...req.body });
    upd = { ...req.body };
    console.log(upd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  try {
    const actualizada = await pm.updateProduct(Number(req.params.pid), upd);
    res.json(actualizada);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//eliminar un producto
app.delete("/productos/:pid", async (req, res) => {
  try {
    await pm.deleteProduct(Number(req.params.pid));
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(8080);

//si bien no son requeridas las peticiones de tipo put post y delete hacen al funcionamiento momentaneo de la app por eso las incoorpore
