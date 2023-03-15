export default class Products {
  constructor({ title, description, price, thumbnail, code, stock, category }) {
    /*comentar para opcion 2 de update*/
    if (!title) throw new Error("Some imput is empty");
    if (!description) throw new Error("Some imput is empty");
    if (!price) throw new Error("Some imput is empty");
    if (!thumbnail) throw new Error("Some imput is empty");
    if (!code) throw new Error("Some imput is empty");
    //hasta acá

    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = [thumbnail];
    this.code = code;
    this.stock = stock ?? 0;
    this.status = true;
    this.category = category;
  }
}
