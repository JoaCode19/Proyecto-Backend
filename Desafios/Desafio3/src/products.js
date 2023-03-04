export default class Products {
  constructor({ title, description, price, thumbnail, code, stock }) {
    this.title = title ?? "none";
    this.description = description ?? "none";
    this.price = price ?? 0;
    this.thumbnail = thumbnail ?? "none";
    this.code = code ?? "none";
    this.stock = stock ?? 0;
  }
}
