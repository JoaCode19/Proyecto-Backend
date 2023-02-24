import fs from "fs/promises";

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
    if (!codeValid) {
      if (this.products.length === 0) {
        product.id = 1;
      } else {
        product.id = this.products[this.products.length - 1].id + 1;
      }

      this.products.push(product);
      const write = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.#path, write);
    }
  }

  async getProducts() {
    await this.#loadProducts();
    console.log(this.products);
  }

  async getProductById(id) {
    await this.#loadProducts();
    const finder = this.products.filter((e) => e.id === id);
    if (!finder) {
      console.log("Not Found");
    } else {
      console.log(finder);
    }
  }

  async deleteProduct(id) {
    await this.#loadProducts();
    const finder = this.products.filter((e) => e.id !== id);
    this.products = finder;
    const write = JSON.stringify(this.products, null, 2);
    await fs.writeFile(this.#path, write);
  }

  async updateProduct(id, productUpd) {
    await this.#loadProducts();
    const updindex = this.products.findIndex((e) => e.id === id);
    this.products[updindex] = productUpd;
    this.products[updindex].id = id;
    const write = JSON.stringify(this.products, null, 2);
    await fs.writeFile(this.#path, write);
  }
}

class Products {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title ?? "none";
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

// // Prueba

console.log("agrego 1 producto y lo muestro");

const productosAstros = new ProductManager("./static/productos.txt");

await productosAstros.addProduct(
  new Products(
    "Camista Argentina 94",
    "replica de la orignial/camiseta retro",
    5500,
    "https://media.tycsports.com/files/2022/07/08/449801/camiseta-argentina-1994_w416.webp",
    "ARG94",
    10
  )
);

await productosAstros.getProducts();

console.log(
  "agrego un nuevo producto para probar el id autoincremental y vuelvo a mostrar"
);

await productosAstros.addProduct(
  new Products(
    "Camista Argentina 86",
    "replica de la orignial/camiseta retro",
    7500,
    "https://http2.mlstatic.com/D_NQ_NP_836338-MLA41873746734_052020-O.webp",
    "ARG86",
    15
  )
);
await productosAstros.getProducts();

console.log("busco un producto pro su ID");

await productosAstros.getProductById(2);

console.log("modifico un resgistro y muestro");

await productosAstros.updateProduct(
  2,
  new Products(
    "Camista Argentina 86",
    "orignial/camiseta retro",
    15500,
    "https://http2.mlstatic.com/D_NQ_NP_836338-MLA41873746734_052020-O.webp",
    "ARG86",
    10
  )
);

await productosAstros.getProducts();

console.log("elimino un registro y muesto");

await productosAstros.deleteProduct(2);

await productosAstros.getProducts();
