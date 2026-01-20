const { Client } = require('pg');

async function checkSchema() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'admin',
        database: 'store_db',
    });

    try {
        await client.connect();
        const res = await client.query(\`
      SELECT column_name, data_type, column_default, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'products';
    \`);
    console.log('COLUMNS:' + JSON.stringify(res.rows));

    const products = await client.query('SELECT * FROM products LIMIT 5;');
    console.log('DATA:' + JSON.stringify(products.rows));

  } catch (err) {
    console.error('Error', err);
  } finally {
    await client.end();
  }
}

checkSchema();
