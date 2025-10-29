/**
 * Room Templates with SVG definitions
 * Each room has selectable elements: walls, ceiling, window, door
 */

export const roomTemplates = [
  {
    id: 'living-room',
    name: 'Woonkamer',
    category: 'Woonruimte',
    viewBox: '0 0 800 600',
    elements: [
      {
        id: 'ceiling',
        name: 'Plafond',
        type: 'ceiling',
        path: 'M 100 50 L 700 50 L 600 150 L 200 150 Z',
        defaultColor: '#FFFFFF',
      },
      {
        id: 'wall-left',
        name: 'Linker Muur',
        type: 'wall',
        path: 'M 100 50 L 200 150 L 200 550 L 100 500 Z',
        defaultColor: '#F5F5DC',
      },
      {
        id: 'wall-right',
        name: 'Rechter Muur',
        type: 'wall',
        path: 'M 700 50 L 600 150 L 600 550 L 700 500 Z',
        defaultColor: '#F5F5DC',
      },
      {
        id: 'wall-back',
        name: 'Achtermuur',
        type: 'wall',
        path: 'M 200 150 L 600 150 L 600 550 L 200 550 Z',
        defaultColor: '#E8E8D0',
      },
      {
        id: 'floor',
        name: 'Vloer',
        type: 'floor',
        path: 'M 100 500 L 200 550 L 600 550 L 700 500 Z',
        defaultColor: '#D2B48C',
      },
      {
        id: 'window',
        name: 'Raam',
        type: 'window',
        path: 'M 300 200 L 500 200 L 500 400 L 300 400 Z M 400 200 L 400 400 M 300 300 L 500 300',
        defaultColor: '#87CEEB',
        stroke: '#4682B4',
        strokeWidth: 2,
      },
      {
        id: 'door',
        name: 'Deur',
        type: 'door',
        path: 'M 520 350 L 580 350 L 580 550 L 520 550 Z M 520 380 Q 550 380 550 410',
        defaultColor: '#8B4513',
        stroke: '#654321',
        strokeWidth: 2,
      },
    ],
  },
  {
    id: 'bedroom',
    name: 'Slaapkamer',
    category: 'Slaapruimte',
    viewBox: '0 0 800 600',
    elements: [
      {
        id: 'ceiling',
        name: 'Plafond',
        type: 'ceiling',
        path: 'M 100 50 L 700 50 L 600 150 L 200 150 Z',
        defaultColor: '#FFFFFF',
      },
      {
        id: 'wall-left',
        name: 'Linker Muur',
        type: 'wall',
        path: 'M 100 50 L 200 150 L 200 550 L 100 500 Z',
        defaultColor: '#E6E6FA',
      },
      {
        id: 'wall-right',
        name: 'Rechter Muur',
        type: 'wall',
        path: 'M 700 50 L 600 150 L 600 550 L 700 500 Z',
        defaultColor: '#E6E6FA',
      },
      {
        id: 'wall-back',
        name: 'Achtermuur',
        type: 'wall',
        path: 'M 200 150 L 600 150 L 600 550 L 200 550 Z',
        defaultColor: '#D8BFD8',
      },
      {
        id: 'floor',
        name: 'Vloer',
        type: 'floor',
        path: 'M 100 500 L 200 550 L 600 550 L 700 500 Z',
        defaultColor: '#DEB887',
      },
      {
        id: 'window',
        name: 'Raam',
        type: 'window',
        path: 'M 250 180 L 400 180 L 400 350 L 250 350 Z M 325 180 L 325 350 M 250 265 L 400 265',
        defaultColor: '#B0E0E6',
        stroke: '#4682B4',
        strokeWidth: 2,
      },
      {
        id: 'door',
        name: 'Deur',
        type: 'door',
        path: 'M 160 350 L 220 350 L 220 550 L 160 550 Z M 165 380 Q 190 380 190 410',
        defaultColor: '#FFFFFF',
        stroke: '#C0C0C0',
        strokeWidth: 2,
      },
      {
        id: 'bed',
        name: 'Bed (decoratie)',
        type: 'furniture',
        path: 'M 420 380 L 580 380 L 580 520 L 420 520 Z M 420 380 L 420 360 L 580 360 L 580 380',
        defaultColor: '#8B7D6B',
        stroke: '#654321',
        strokeWidth: 1,
      },
    ],
  },
  {
    id: 'kitchen',
    name: 'Keuken',
    category: 'Keukenruimte',
    viewBox: '0 0 800 600',
    elements: [
      {
        id: 'ceiling',
        name: 'Plafond',
        type: 'ceiling',
        path: 'M 100 50 L 700 50 L 600 150 L 200 150 Z',
        defaultColor: '#FFFFFF',
      },
      {
        id: 'wall-left',
        name: 'Linker Muur',
        type: 'wall',
        path: 'M 100 50 L 200 150 L 200 550 L 100 500 Z',
        defaultColor: '#FFF8DC',
      },
      {
        id: 'wall-right',
        name: 'Rechter Muur',
        type: 'wall',
        path: 'M 700 50 L 600 150 L 600 550 L 700 500 Z',
        defaultColor: '#FFF8DC',
      },
      {
        id: 'wall-back',
        name: 'Achtermuur',
        type: 'wall',
        path: 'M 200 150 L 600 150 L 600 550 L 200 550 Z',
        defaultColor: '#FAEBD7',
      },
      {
        id: 'floor',
        name: 'Vloer',
        type: 'floor',
        path: 'M 100 500 L 200 550 L 600 550 L 700 500 Z',
        defaultColor: '#696969',
      },
      {
        id: 'window',
        name: 'Raam',
        type: 'window',
        path: 'M 450 180 L 580 180 L 580 320 L 450 320 Z M 515 180 L 515 320 M 450 250 L 580 250',
        defaultColor: '#E0FFFF',
        stroke: '#4682B4',
        strokeWidth: 2,
      },
      {
        id: 'door',
        name: 'Deur',
        type: 'door',
        path: 'M 540 350 L 600 350 L 600 550 L 540 550 Z M 545 380 Q 570 380 570 410',
        defaultColor: '#F5F5F5',
        stroke: '#A9A9A9',
        strokeWidth: 2,
      },
      {
        id: 'cabinets',
        name: 'Keukenkastjes',
        type: 'furniture',
        path: 'M 220 300 L 380 300 L 380 400 L 220 400 Z M 300 300 L 300 400 M 220 350 L 380 350',
        defaultColor: '#8B4513',
        stroke: '#654321',
        strokeWidth: 1,
      },
      {
        id: 'counter',
        name: 'Aanrecht',
        type: 'furniture',
        path: 'M 220 400 L 380 400 L 380 430 L 220 430 Z',
        defaultColor: '#D3D3D3',
        stroke: '#808080',
        strokeWidth: 1,
      },
    ],
  },
];

export const getRoomTemplate = (id) => {
  return roomTemplates.find((room) => room.id === id) || null;
};

export const getRoomCategories = () => {
  const categories = [...new Set(roomTemplates.map((room) => room.category))];
  return categories;
};

export default roomTemplates;
