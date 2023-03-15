import express from "express";
import { Router } from "express";
import productManager from "../productManager.js";
import Products from "../products.js";

export const pm = new productManager("./database/productos.json");

export const appProducts = Router();
appProducts.use(express.json());
appProducts.use(express.urlencoded({ extended: true }));

//agregar products a la persistencia en archivo desde el servidor

appProducts.post("/", async (req, res, next) => {
  try {
    const newproduct = new Products({ ...req.body });
    const agregada = await pm.addProduct(newproduct);
    res.json(agregada);
  } catch (error) {
    next(error);
  }
});

//consultar productos todos o con limite desde el servidor

appProducts.get("/", async (req, res, next) => {
  const limit = req.query.limit;
  if (!limit) {
    try {
      const productos = await pm.getProducts();
      res.json(productos);
    } catch (error) {
      return next(error);
    }
  } else {
    try {
      const productos = await pm.getProducts();
      const productLimit = productos.slice(0, Number(limit));
      res.json(productLimit);
    } catch (error) {
      next(error);
    }
  }
});

//obtener producto por ID

appProducts.get("/:pid", async (req, res, next) => {
  try {
    const producto = await pm.getProductById(Number(req.params.pid));
    res.json(producto);
  } catch (error) {
    next(error);
  }
});

//editar un producto
appProducts.put("/:pid", async (req, res, next) => {
  let upd;
  try {
    upd = { ...req.body };
  } catch (error) {
    return next(error);
  }
  try {
    const actualizada = await pm.updateProduct(Number(req.params.pid), upd);
    res.json(actualizada);
  } catch (error) {
    next(error);
  }
});

//eliminar un producto
appProducts.delete("/:pid", async (req, res, next) => {
  try {
    await pm.deleteProduct(Number(req.params.pid));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
