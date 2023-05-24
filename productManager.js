const PRODUCTS = "products.txt";

const fs = require("fs");

// Clase ProductManager para administrar productos
class ProductManager {
  constructor() {
    this.products = [];
    this.path = PRODUCTS;
    this.automaticId = 1;
  }

   // Agrega un producto a la lista
  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      // Comprueba si el código ya existe
      const existCode = this.products.find((prod) => prod.code === code);
      if (existCode) {
        console.log(
          `El código ${code} coincide con un código ya existente de ${existCode.title} dentro de productos`
        );
      }

      // Comprueba si el ID ya está en uso
      const existId = this.products.find(
        (prod) => prod.id === this.automaticId
      );
      if (existId) {
        console.log(
          `El ID ${this.automaticId} ya está en uso, no se puede agregar el producto`
        );
      }

      // Comprueba si todos los campos están completos
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Por favor complete todos los campos solicitados");
      } else {

        const product = {
          id: this.automaticId++,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };

        // Agrega el producto a la lista
        this.products.push(product);
        console.log(`El producto ${title} fue agregado correctamente`);

        let text = JSON.stringify(this.products, null, 2);

        fs.writeFileSync(PRODUCTS, text, (error) => console.log(error));
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Obtiene la lista de productos
  async getProducts() {
    try {
      if (this.products.length === 0) {
        console.log("No hay productos disponibles");
      } else {
        console.log("Productos disponibles:");
        this.products.forEach((product) => {
          console.log(product);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Obtiene un producto por su ID
  async getProductById(id) {
    try {
      const productExistent = this.products.find((prod) => prod.id === id);
      if (!productExistent) {
        console.log(`Not found: el producto con el id ${id} no fue encontrado`);
      } else {
        console.log(`El producto con el ID ${id} fue encontrado`);
        console.log(productExistent);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Actualiza un campo de un producto
  async updateProduct(id, fieldToUpdate, newValue) {
    try {
      const product = this.products.find((prod) => prod.id === id);
      if (!product) {
        console.log("El producto no fue encontrado");
      }

      product[fieldToUpdate] = newValue;

      fs.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2),
        (error) => {
          if (error) {
            console.log("Error al guardar los cambios en el PRODUCTS");
          } else {
            console.log("El producto fue actualizado correctamente");
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  // Elimina un producto por su ID
  async deleteProduct(id) {
    try {
      const index = this.products.findIndex((prod) => prod.id === id);

      if (index === -1) {
        console.log(`No se encontro ningún producto con el ID numero: ${id}`);
        return;
      } else {
        console.log("El elemento del PRODUCTS se eliminó correctamente");
      }
      // Elimina el producto de la lista
      this.products.splice(index, 1);

      fs.readFile(PRODUCTS, "utf-8", (error, data) => {
        if (error) {
          console.log("Ocurrió un error al leer el PRODUCTS");
        }

        let productsData = JSON.parse(data);

        productsData = this.products;
        const contenidoActualizado = JSON.stringify(productsData, null, 2);

        fs.writeFile(PRODUCTS, contenidoActualizado, (error) => {
          if (error) {
            console.log("Hubo un error al actualizar  PRODUCTS");
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

(async () => {
  try {
    let test = new ProductManager();
    console.log(test.getProducts());
    await test.addProduct(
      "Producto prueba",
      "Este es un producto prueba",
      200,
      "Sin imagen",
      "abc123",
      25
    );
    await test.addProduct(
      "Producto prueba 2",
      "Este es un producto prueba 2",
      200,
      "Sin imagen",
      "abc321",
      25
    );
    await test.addProduct(
      "Producto prueba 3",
      "Este es un producto prueba 3",
      200,
      "Sin imagen",
      "cba123",
      25
    );
    console.log(test.getProducts());
    await test.getProductById(2);
    await test.getProductById(5);
    await test.updateProduct(2, "price", 500);
    await test.deleteProduct(3);
    await test.deleteProduct(5);
  } catch (error) {
    console.log(error);
  }
})();
