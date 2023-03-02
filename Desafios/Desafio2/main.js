import fs from "fs/promises";
import { title } from "process";

export default class ProductManager {
  #path;
  constructor(path) {
    this.#path = path;
  }

  async #loadProducts() {
    const json = await fs.readFile(this.#path, "utf-8");
    this.products = JSON.parse(json);
  }

  async addProduct(product) {
    await this.#loadProducts();
    const codeValid = this.products.find((e) => e.code === product.code);
    if (codeValid) {
      throw new Error("Product already exist");
    }
    if (this.products.length === 0) {
      product.id = 1;
    } else {
      product.id = this.products[this.products.length - 1].id + 1;
    }

    this.products.push(product);
    const write = JSON.stringify(this.products, null, 2);
    await fs.writeFile(this.#path, write);
  }

  async getProducts() {
    await this.#loadProducts();
    return this.products;
  }

  async getProductById(id) {
    await this.#loadProducts();
    const finder = this.products.filter((e) => e.id === id);
    if (!finder) {
      throw new Error("Not Found");
    }
    return finder;
  }

  async deleteProduct(id) {
    await this.#loadProducts();
    const finder = this.products.filter((e) => e.id === id);
    if (!finder) {
      throw new Error("Not Found");
    }
    const deleter = this.products.filter((e) => e.id !== id);
    this.products = deleter;
    const write = JSON.stringify(this.products, null, 2);
    await fs.writeFile(this.#path, write);
  }

  async updateProduct(id, productUpd) {
    await this.#loadProducts();
    const updindex = this.products.findIndex((e) => e.id === id);
    if (updindex === -1) {
      throw new Error("Product not found");
    }
    const oldproduct = this.products[updindex];
    this.products[updindex] = { ...oldproduct, ...productUpd };
    this.products[updindex].id = id;
    const write = JSON.stringify(this.products, null, 2);
    await fs.writeFile(this.#path, write);
  }
}

class Products {
  constructor({ title, description, price, thumbnail, code, stock }) {
    this.title = title ?? "none";
    this.description = description ?? "none";
    this.price = price ?? 0;
    this.thumbnail = thumbnail ?? "none";
    this.code = code ?? "none";
    this.stock = stock ?? 0;
  }
}

// // Prueba

console.log("agrego 1 producto y lo muestro");

const productosAstros = new ProductManager("./static/productos.txt");

await productosAstros.addProduct(
  new Products({
    title: "Camista Argentina 94",
    description: "replica de la orignial/camiseta retro",
    price: 5500,
    thumbnail:
      "https://media.tycsports.com/files/2022/07/08/449801/camiseta-argentina-1994_w416.webp",
    code: "ARG94",
    stock: 10,
  })
);

console.log(await productosAstros.getProducts());

console.log(
  "agrego un nuevo producto para probar el id autoincremental y vuelvo a mostrar"
);

await productosAstros.addProduct(
  new Products({
    title: "Camista Argentina 86",
    description: "replica de la orignial/camiseta retro",
    price: 7500,
    thumbnail:
      "https://http2.mlstatic.com/D_NQ_NP_836338-MLA41873746734_052020-O.webp",
    code: "ARG86",
    stock: 15,
  })
);
console.log(await productosAstros.getProducts());

console.log("busco un producto pro su ID");

console.log(await productosAstros.getProductById(2));

console.log("modifico un resgistro y muestro");

await productosAstros.updateProduct(
  2,
  new Products({
    title: "Camista Argentina 86",
    description: "orignial/camiseta retro",
    price: 15500,
    thumbnail:
      "https://http2.mlstatic.com/D_NQ_NP_836338-MLA41873746734_052020-O.webp",
    code: "ARG86",
    stock: 10,
  })
);

console.log(await productosAstros.getProducts());

console.log("elimino un registro y muesto");

await productosAstros.deleteProduct(2);

console.log(await productosAstros.getProducts());
