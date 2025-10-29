/**
 * Example rooms database
 * Provides sample room images for users without their own photos
 */

export const exampleRooms = [
  {
    id: 'living-room-1',
    name: 'Moderne Woonkamer',
    category: 'woonkamer',
    description: 'Lichte woonkamer met neutrale tinten',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300',
    dominantColors: ['#E8E4DC', '#F5F1EB'],
  },
  {
    id: 'living-room-2',
    name: 'Gezellige Woonkamer',
    category: 'woonkamer',
    description: 'Warme woonkamer met bruine accenten',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300',
    dominantColors: ['#F2EDE4', '#E5DDD1'],
  },
  {
    id: 'bedroom-1',
    name: 'Slaapkamer Wit',
    category: 'slaapkamer',
    description: 'Strakke slaapkamer met witte muren',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=300',
    dominantColors: ['#FFFFFF', '#F8F8F8'],
  },
  {
    id: 'bedroom-2',
    name: 'Slaapkamer Grijs',
    category: 'slaapkamer',
    description: 'Moderne slaapkamer met grijze tinten',
    imageUrl: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=300',
    dominantColors: ['#D5D5D5', '#E8E8E8'],
  },
  {
    id: 'kitchen-1',
    name: 'Moderne Keuken',
    category: 'keuken',
    description: 'Lichte keuken met witte kasten',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300',
    dominantColors: ['#FFFFFF', '#F0F0F0'],
  },
  {
    id: 'kitchen-2',
    name: 'Landelijke Keuken',
    category: 'keuken',
    description: 'Warme keuken met houten elementen',
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=300',
    dominantColors: ['#F5F3EF', '#EAE6E0'],
  },
  {
    id: 'office-1',
    name: 'Thuiskantoor',
    category: 'kantoor',
    description: 'Rustig kantoor met lichte muren',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300',
    dominantColors: ['#F2F0ED', '#E8E6E3'],
  },
  {
    id: 'dining-1',
    name: 'Eetkamer',
    category: 'eetkamer',
    description: 'Elegante eetkamer met neutrale tinten',
    imageUrl: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=300',
    dominantColors: ['#F0EDE8', '#E5E2DD'],
  },
];

/**
 * Get rooms by category
 */
export const getRoomsByCategory = (category) => {
  if (!category) return exampleRooms;
  return exampleRooms.filter((room) => room.category === category);
};

/**
 * Get room by ID
 */
export const getRoomById = (id) => {
  return exampleRooms.find((room) => room.id === id);
};

/**
 * Get all categories
 */
export const getCategories = () => {
  const categories = [...new Set(exampleRooms.map((room) => room.category))];
  return categories.map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: exampleRooms.filter((r) => r.category === cat).length,
  }));
};

export default exampleRooms;
