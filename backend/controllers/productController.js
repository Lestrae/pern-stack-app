import { sql } from '../config/db.js';

export const searchProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const productsSearch = await sql`
      SELECT * FROM products
      WHERE name ILIKE ${search}
      ORDER BY created_at DESC
    `;
    console.log('Products fetched', productsFetch);
    res.status(200).json({ success: true, data: productsFetch });
  } catch (error) {
    console.log('Error fetching data', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}
export const getProducts = async (req, res) => {
  try {
    const productsFetch = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;

    console.log('Products fetched', productsFetch);
    res.status(200).json({ success: true, data: productsFetch });
  } catch (error) {
    console.log('Error fetching data', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
export const createProduct = async (req, res) => {
  const { name, image, price } = req.body;
  if (!name || !image || !price) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }
  try {
    const newProduct = await sql`
      INSERT INTO products (name, image, price)
      VAlUES (${name}, ${image}, ${price})
      RETURNING *
      `
    console.log('Product created', newProduct);
    res.status(201).json({ 
      success: true, 
      data: newProduct[0] 
    });
  } catch (error) {
    console.log('Error in createProduct function', error);
  }
};
export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const fetchProduct = await sql`
      SELECT * FROM products
      WHERE id = ${id}
    `
    res.status(200).json({ 
      success: true, 
      data: fetchProduct[0] 
    });
  } catch (error) {
   console.log('Error in getProduct function', error); 
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price } = req.body;
  try {
    const updateProduct = await sql`
      UPDATE products
      SET name = ${name}, image = ${image}, price = ${price}
      WHERE id = ${id}
      RETURNING *
    `
    if (updateProduct.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
      
    }
    res.status(200).json({ 
      success: true, 
      data: updateProduct[0] 
    }); 
  } catch (error) {
    console.log('Error in updateProduct function', error);
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING *
    `
    if (deleteProduct.length === 0) {
      return res.statue(404).json({
        success: false,
        message: 'Product not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: deleteProduct[0] 
    });
  } catch (error) {
    console.log('Error in deleteProduct function', error);
  }
};  