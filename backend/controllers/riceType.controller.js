import pool from '../config/db.js';

const transformRiceType = (row) => ({
  id: row.id,
  mill_id: row.mill_id,
  mill_name: row.mill_name || null,
  location: row.location || null,
  contact_number: row.contact_number || null,
  image_url: row.image_url || null,
  rating: row.rating || 0,
  type_name: row.type_name,
  price_per_kg: row.price_per_kg !== null ? Number(row.price_per_kg) : 0,
  stock_kg: row.stock_kg !== null ? Number(row.stock_kg) : 0,
  description: row.description,
  status: row.status,
  created_at: row.created_at,
});

export const getAllTypes = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [types] = await conn.query(
      `SELECT rt.*, rm.mill_name, rm.location, rm.contact_number, rm.image_url, rm.rating
       FROM rice_types rt
       LEFT JOIN rice_mills rm ON rt.mill_id = rm.id
       ORDER BY rt.id DESC`
    );
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${types.length} rice type(s)`,
      data: types.map(transformRiceType)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching rice types',
      error: error.message
    });
  }
};

export const getTypesByMill = async (req, res) => {
  try {
    const millId = parseInt(req.params.millId, 10);
    if (isNaN(millId) || millId <= 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid mill ID'
      });
    }

    const conn = await pool.getConnection();
    const [types] = await conn.query(
      `SELECT rt.*, rm.mill_name, rm.location, rm.contact_number, rm.image_url, rm.rating
       FROM rice_types rt
       LEFT JOIN rice_mills rm ON rt.mill_id = rm.id
       WHERE rt.mill_id = ? AND rt.status = 'active'
       ORDER BY rt.type_name ASC`,
      [millId]
    );
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${types.length} rice type(s) for mill ${millId}`,
      data: types.map(transformRiceType)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching rice types for mill',
      error: error.message
    });
  }
};

export const addRiceType = async (req, res) => {
  try {
    const { millId, typeName, pricePerKg, stockKg, description, status } = req.body;
    const mill_id = parseInt(millId, 10);
    const price_per_kg = parseFloat(pricePerKg);
    const stock_kg = Number(stockKg) || 0;

    if (isNaN(mill_id) || mill_id <= 0) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Rice mill is required' });
    }
    if (!typeName || !typeName.trim()) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Paddy type name is required' });
    }
    if (isNaN(price_per_kg) || price_per_kg <= 0) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Buying price must be greater than 0' });
    }

    const normalizedStatus = status === 'inactive' ? 'inactive' : 'active';

    const conn = await pool.getConnection();
    const [result] = await conn.query(
      `INSERT INTO rice_types (mill_id, type_name, price_per_kg, stock_kg, description, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [mill_id, typeName.trim(), price_per_kg, stock_kg, description || null, normalizedStatus]
    );

    const [rows] = await conn.query(
      `SELECT rt.*, rm.mill_name
       FROM rice_types rt
       LEFT JOIN rice_mills rm ON rt.mill_id = rm.id
       WHERE rt.id = ?`,
      [result.insertId]
    );
    conn.release();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Rice type created successfully',
      data: transformRiceType(rows[0])
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error creating rice type',
      error: error.message
    });
  }
};

export const updateRiceType = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { millId, typeName, pricePerKg, stockKg, description, status } = req.body;
    const mill_id = parseInt(millId, 10);
    const price_per_kg = parseFloat(pricePerKg);
    const stock_kg = Number(stockKg) || 0;

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Invalid rice type ID' });
    }
    if (isNaN(mill_id) || mill_id <= 0) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Rice mill is required' });
    }
    if (!typeName || !typeName.trim()) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Paddy type name is required' });
    }
    if (isNaN(price_per_kg) || price_per_kg <= 0) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Buying price must be greater than 0' });
    }

    const normalizedStatus = status === 'inactive' ? 'inactive' : 'active';

    const conn = await pool.getConnection();
    const [existing] = await conn.query('SELECT id FROM rice_types WHERE id = ?', [id]);
    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, statusCode: 404, message: 'Rice type not found' });
    }

    await conn.query(
      `UPDATE rice_types
       SET mill_id = ?, type_name = ?, price_per_kg = ?, stock_kg = ?, description = ?, status = ?
       WHERE id = ?`,
      [mill_id, typeName.trim(), price_per_kg, stock_kg, description || null, normalizedStatus, id]
    );

    const [rows] = await conn.query(
      `SELECT rt.*, rm.mill_name
       FROM rice_types rt
       LEFT JOIN rice_mills rm ON rt.mill_id = rm.id
       WHERE rt.id = ?`,
      [id]
    );
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Rice type updated successfully',
      data: transformRiceType(rows[0])
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error updating rice type',
      error: error.message
    });
  }
};

export const deleteRiceType = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Invalid rice type ID' });
    }

    const conn = await pool.getConnection();
    const [result] = await conn.query('DELETE FROM rice_types WHERE id = ?', [id]);
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Rice type not found' });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Rice type deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error deleting rice type',
      error: error.message
    });
  }
};
