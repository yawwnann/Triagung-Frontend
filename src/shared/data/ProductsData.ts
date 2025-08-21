// src/data/productsData.ts

export const products = [
    {
        id: 1,
        name: 'Semen Portland Komposit',
        description: 'Semen berkualitas tinggi untuk semua jenis konstruksi, daya rekat kuat dan hasil halus. Cocok untuk pondasi, plester, dan acian.',
        price: 'Rp 55.000',
        image: '/semen.png',
        category: 'Semen',
        details: 'Berat: 50kg, Standar: SNI, Keunggulan: Cepat kering, tahan retak'
    },
    {
        id: 2,
        name: 'Besi Beton Ulir SNI',
        description: 'Besi beton ulir standar SNI, kuat dan kokoh untuk struktur bangunan bertingkat. Tersedia berbagai ukuran.',
        price: 'Rp 75.000 (per batang)',
        image: '/gambar1.jpg',
        category: 'Besi',
        details: 'Diameter: 10mm, 12mm, 16mm, Panjang: 12m, Material: Baja karbon tinggi'
    },
    {
        id: 3,
        name: 'Cat Tembok Anti Jamur',
        description: 'Cat tembok interior dan eksterior dengan formula anti jamur dan lumut. Warna tahan lama dan mudah dibersihkan.',
        price: 'Rp 120.000 (per galon)',
        image: '/gambar1.jpg',
        category: 'Cat',
        details: 'Ukuran: 5kg, 25kg, Pilihan Warna: Tersedia 20+ warna, Fitur: Anti-UV, Cepat kering'
    },
    {
        id: 4,
        name: 'Pasir Beton Kualitas Premium',
        description: 'Pasir pilihan dengan kadar lumpur rendah, ideal untuk adukan beton dan plesteran yang kuat dan padat.',
        price: 'Rp 250.000 (per meter kubik)',
        image: '/gambar1.jpg',
        category: 'Pasir',
        details: 'Asal: Sungai pilihan, Kandungan: Bebas lumpur, Kegunaan: Campuran beton, plester'
    },
    {
        id: 5,
        name: 'Keramik Lantai Motif Kayu',
        description: 'Keramik lantai motif kayu untuk tampilan alami dan elegan. Tahan gores dan mudah dibersihkan.',
        price: 'Rp 85.000 (per meter persegi)',
        image: '/gambar1.jpg',
        category: 'Keramik',
        details: 'Ukuran: 60x60cm, Motif: Kayu, Daya Tahan: Tinggi'
    },
    {
        id: 6,
        name: 'Pipa PVC AW',
        description: 'Pipa PVC AW berkualitas tinggi untuk saluran air bersih dan pembuangan. Kuat dan tidak mudah pecah.',
        price: 'Rp 45.000 (per batang)',
        image: '/gambar1.jpg',
        category: 'Pipa',
        details: 'Diameter: 1/2 inci - 4 inci, Panjang: 4m, Material: PVC'
    },
];

export const categories = Array.from(new Set(products.map(p => p.category)));