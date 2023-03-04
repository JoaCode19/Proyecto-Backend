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
    return product;
  }

  async getProducts() {
    await this.#loadProducts();
    return this.products;
  }

  async getProductById(id) {
    await this.#loadProducts();
    const finder = this.products.find((c) => c.id === id);
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
    return this.products[updindex];
  }
}
