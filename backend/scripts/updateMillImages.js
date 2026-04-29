/**
 * Add sample image URLs and verify location data for rice mills
 * Run: node scripts/updateMillImages.js
 */

import pool from '../config/db.js';

// Using working CDN images for rice mills
const millImageUpdates = [
  { id: 1, image_url: 'https://media.istockphoto.com/photos/rice-mill-picture-id525076865?k=6&m=525076865&s=612x612&w=0&h=YeK0GCHS9I4kOjETmI2J-NG9Kj44jUguhfAmZu1QLSw=' },
  { id: 2, image_url: 'https://media.istockphoto.com/photos/rice-mill-picture-id525076865?k=6&m=525076865&s=612x612&w=0&h=YeK0GCHS9I4kOjETmI2J-NG9Kj44jUguhfAmZu1QLSw=' },
  { id: 3, image_url: 'https://tse2.mm.bing.net/th/id/OIP.FYzFHLF5PCOAz1CSro5LDAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 4, image_url: 'https://th.bing.com/th/id/R.2e3f4fb766f49b9993676b2f084dd569?rik=JcAXvc60fahlCg&pid=ImgRaw&r=0' },
  { id: 5, image_url: 'https://media.istockphoto.com/photos/rice-mill-picture-id525076865?k=6&m=525076865&s=612x612&w=0&h=YeK0GCHS9I4kOjETmI2J-NG9Kj44jUguhfAmZu1QLSw=' },
  { id: 6, image_url: 'https://tse2.mm.bing.net/th/id/OIP.FYzFHLF5PCOAz1CSro5LDAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 7, image_url: 'https://th.bing.com/th/id/R.2e3f4fb766f49b9993676b2f084dd569?rik=JcAXvc60fahlCg&pid=ImgRaw&r=0' },
  { id: 8, image_url: 'https://media.istockphoto.com/photos/rice-mill-picture-id525076865?k=6&m=525076865&s=612x612&w=0&h=YeK0GCHS9I4kOjETmI2J-NG9Kj44jUguhfAmZu1QLSw=' },
];

(async () => {
  try {
    const conn = await pool.getConnection();
    
    console.log('🔄 Updating rice mill image URLs and verifying locations...\n');

    for (const mill of millImageUpdates) {
      await conn.query(
        `UPDATE rice_mills 
         SET image_url = ? 
         WHERE id = ?`,
        [mill.image_url, mill.id]
      );
      console.log(`✅ Updated mill ${mill.id} with image URL: ${mill.image_url}`);
    }

    // Verify the data
    console.log('\n📋 Verifying updated mills:\n');
    const [mills] = await conn.query(
      `SELECT id, mill_name, location, image_url, rating FROM rice_mills ORDER BY id`
    );

    mills.forEach((mill, i) => {
      console.log(
        `  ${i + 1}. ${mill.mill_name.padEnd(25)} | ${mill.location.padEnd(15)} | ⭐ ${mill.rating} | 📸 ${mill.image_url ? '✅' : '❌'}`
      );
    });

    console.log('\n✅ Update complete!');
    console.log('📝 Next steps:');
    console.log('   1. Restart backend: npm start');
    console.log('   2. Images will show as placeholders until files are uploaded\n');

    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating mills:', error.message);
    process.exit(1);
  }
})();
