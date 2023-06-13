const fs = require('fs')

const FILE = 'products.json'

class ProductManager {
  static id = 0

  constructor() {
    this.props = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    this.path = FILE;
    try {
      this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
    } catch (error) {
      this.products = []
    }
    ProductManager.id = this.products.reduce((prev, curr) => (
      curr.id >= prev ? curr.id : prev
    ), 0)
  }

  async getProducts() {
    try {
      return this.products;
    } catch (error) {
      console.log(error);
    }
  }

  isValidateCode(product) {
    return this.products.some(item => item.code === product.code);
  }

  async addProduct(product) {
    try {
      for (let prop of this.props) {
        if (!product.hasOwnProperty(prop) || this.isValidateCode(product)) {
          return 'Producto invalido!';
        }
      }

      this.products = [...this.products, { id: ++ProductManager.id, ...product }];
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      let productId = this.products.find(product => product.id === id);
      return productId ?? 'Not found';
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(index, field, newValue) {
    try {
      const updateProductIndex = this.products.findIndex(product => product.id === index)
      if (updateProductIndex !== -1) {
        this.products[updateProductIndex][field] = newValue;
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProducts(id) {
    try {
      this.products = this.products.filter(product => product.id !== id);
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.log(error);
    }
  }
}

const product1 = {
  title: 'Product 1',
  description: 'este es el producto 1',
  price: 10,
  thumbnail: 'thumbnail-url',
  code: 'abc1',
  stock: 10
}

const product2 = {
  title: 'Product 2',
  description: 'este es el producto 2',
  price: 10,
  thumbnail: 'ABC123',
  code: 'abc21',
  stock: 2
}

const product3 = {
  title: 'Product 3',
  description: 'este es el producto 3',
  price: 2,
  thumbnail: 'thumbnail-url',
  code: '5671235',
  stock: 7,
} 


const products = async () => {
  try {
    const productManager = new ProductManager()
    await productManager.addProduct(product1);
    await productManager.addProduct(product2);
    await productManager.addProduct(product3);
    // const getProduct = productManager.getProductById(2);
    const getProducts = await productManager.getProducts();
    const updateProduct = await productManager.updateProduct(3, 'title', 'Product 3 actualizado');
    const deleteProduct = await productManager.deleteProducts(5);

    console.log(getProducts);
  } catch (error) {
    console.log(error);
  }
}

products()
