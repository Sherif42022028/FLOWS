// data.js — الأكواد الآن مطابقة للملفات الموجودة فعلياً في مجلد PICS الخاص بك.

const PRODUCTS_DATA = [
  {
    id: 1,
    name: 'Oversized Bolivar T-Shirt',
    category: 'tshirts',
    price: 450,
    basePrice: 450,
    oldPrice: 550,
    badge: 'الأكثر مبيعاً',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    desc: 'تيشيرت مصنوع من أجود أنواع القطن المصري، ناعم على البشرة ومناسب للصيف.',
    colors: [
      {
        name: 'أسود فحم', val: '#121212', code: '#121212',
        images: [
          'PICS/t-shirts/black/1.png',
          'PICS/t-shirts/black/2.png',
          'PICS/t-shirts/black/3.png',
          'PICS/t-shirts/black/4.png',
          'PICS/t-shirts/black/5.png'
        ]
      },
      {
        name: 'أبيض لؤلؤي', val: '#F9F9F9', code: '#F9F9F9',
        images: [
          'PICS/t-shirts/white/1.webp',
          'PICS/t-shirts/white/2.webp',
          'PICS/t-shirts/white/3.webp',
          'PICS/t-shirts/white/4.webp',
          'PICS/t-shirts/white/5.webp'
        ]
      },
      {
        name: 'بوردو ملكي', val: '#631313', code: '#631313',
        images: [
          'PICS/t-shirts/marron/1.webp',
          'PICS/t-shirts/marron/2.webp',
          'PICS/t-shirts/marron/3.webp',
          'PICS/t-shirts/marron/4.jpg',
          'PICS/t-shirts/marron/5.webp'
        ]
      },
      {
        name: 'أخضر زيتي', val: '#3D4A3D', code: '#3D4A3D',
        images: [
          'PICS/t-shirts/olive/1.webp',
          'PICS/t-shirts/olive/2.webp',
          'PICS/t-shirts/olive/3.webp',
          'PICS/t-shirts/olive/4.webp',
          'PICS/t-shirts/olive/5.webp'
        ]
      }
    ],
    specs: [['الخامة', 'قطن 100%'], ['القصة', 'Over-sized'], ['الصناعة', 'صنع في مصر']]
  },
  {
    id: 2,
    name: 'Wide Leg Sweatpants',
    category: 'pants',
    price: 550,
    basePrice: 550,
    oldPrice: 650,
    badge: 'جديد',
    sizes: ['30', '32', '34', '36'],
    desc: 'بنطلون كارجو بجيوب جانبية وتصميم عصري مريح جداً للتحرك.',
    colors: [
      {
        name: 'اسود', val: '#000000', code: '#000000',
        images: [
          'PICS/pants/black/1.jpeg',
          'PICS/pants/black/3.jpeg',
          'PICS/pants/black/4.jpeg',
          'PICS/pants/black/6.jpeg',
          'PICS/pants/black/9.jpeg'
        ]
      },
      {
        name: 'رمادى', val: '#c5c5c5', code: '#c5c5c5',
        images: [
          'PICS/pants/gray/2.jpeg',
          'PICS/pants/gray/3.jpeg',
          'PICS/pants/gray/4.jpeg',
          'PICS/pants/gray/6.jpeg',
          'PICS/pants/gray/7.jpeg'
        ]
      }
    ],
    specs: [['الخامة', 'جابردين ليكرا'], ['القصة', 'Loose Fit'], ['الجيوب', '6 جيوب حقيقية']]
  }
];
