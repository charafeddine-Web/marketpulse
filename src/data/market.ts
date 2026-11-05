export type Product = {
  id: number
  name: string
  category: string
  price: number
  previousPrice: number
  platform: 'Jumia' | 'Avito'
  city: string
  rating: number
  reviews: number
  popularity: number
  image: string
  description: string
  daysAgo: number
}

export const products: Product[] = [
  { id: 1, name: 'Samsung Galaxy S24 Ultra', category: 'Smartphones', price: 12499, previousPrice: 12999, platform: 'Jumia', city: 'Casablanca', rating: 4.8, reviews: 284, popularity: 96, daysAgo: 2, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=85', description: 'Un smartphone premium avec un écran immersif, un appareil photo haute résolution et des performances conçues pour le quotidien.' },
  { id: 2, name: 'Apple MacBook Air M3', category: 'Informatique', price: 14990, previousPrice: 15490, platform: 'Jumia', city: 'Rabat', rating: 4.9, reviews: 176, popularity: 91, daysAgo: 8, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=85', description: 'Ordinateur portable fin et léger, apprécié pour son autonomie et ses performances.' },
  { id: 3, name: 'Machine à café DeLonghi', category: 'Maison', price: 1890, previousPrice: 1699, platform: 'Avito', city: 'Marrakech', rating: 4.5, reviews: 93, popularity: 82, daysAgo: 16, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=85', description: 'Une machine élégante pour préparer un café riche et équilibré à la maison.' },
  { id: 4, name: 'Nike Air Max Pulse', category: 'Mode', price: 1199, previousPrice: 1299, platform: 'Jumia', city: 'Tanger', rating: 4.6, reviews: 142, popularity: 88, daysAgo: 5, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85', description: 'Une sneaker polyvalente au confort durable et au design contemporain.' },
  { id: 5, name: 'Sony WH-1000XM5', category: 'Électronique', price: 3290, previousPrice: 3590, platform: 'Avito', city: 'Casablanca', rating: 4.7, reviews: 218, popularity: 85, daysAgo: 26, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=85', description: 'Casque sans fil à réduction de bruit pour une écoute confortable et immersive.' },
  { id: 6, name: 'Dyson V12 Detect Slim', category: 'Maison', price: 5790, previousPrice: 5990, platform: 'Jumia', city: 'Agadir', rating: 4.6, reviews: 88, popularity: 74, daysAgo: 45, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=85', description: 'Aspirateur sans fil puissant, léger et facile à utiliser au quotidien.' },
  { id: 7, name: 'Xiaomi Redmi Note 13 Pro', category: 'Smartphones', price: 2899, previousPrice: 2799, platform: 'Jumia', city: 'Fès', rating: 4.4, reviews: 312, popularity: 93, daysAgo: 3, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=85', description: 'Un smartphone accessible avec un écran lumineux et une excellente polyvalence.' },
  { id: 8, name: 'Sérum visage niacinamide', category: 'Beauté', price: 189, previousPrice: 219, platform: 'Avito', city: 'Rabat', rating: 4.3, reviews: 64, popularity: 68, daysAgo: 11, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85', description: 'Soin quotidien formulé pour unifier le teint et améliorer l’apparence de la peau.' },
  { id: 9, name: 'PlayStation 5 Slim', category: 'Électronique', price: 6490, previousPrice: 6990, platform: 'Jumia', city: 'Casablanca', rating: 4.9, reviews: 527, popularity: 97, daysAgo: 1, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=85', description: 'Console de jeu nouvelle génération au format compact et aux performances immersives.' },
  { id: 10, name: 'Robot pâtissier Moulinex', category: 'Maison', price: 2499, previousPrice: 2399, platform: 'Avito', city: 'Marrakech', rating: 4.2, reviews: 76, popularity: 61, daysAgo: 34, image: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=800&q=85', description: 'Robot polyvalent pour accompagner les préparations culinaires maison.' },
  { id: 11, name: 'Lenovo IdeaPad Slim 5', category: 'Informatique', price: 7290, previousPrice: 7690, platform: 'Avito', city: 'Tanger', rating: 4.5, reviews: 109, popularity: 79, daysAgo: 19, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85', description: 'Un ordinateur fiable et équilibré pour le travail et les études.' },
  { id: 12, name: 'Adidas Samba OG', category: 'Mode', price: 1090, previousPrice: 999, platform: 'Jumia', city: 'Fès', rating: 4.7, reviews: 191, popularity: 89, daysAgo: 6, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=85', description: 'Une silhouette iconique qui associe style rétro et confort moderne.' },
]

export const marketActivity = [
  { month: 'Mai', jumia: 1280, avito: 1180, activity: 46 },
  { month: 'Juin', jumia: 1320, avito: 1210, activity: 58 },
  { month: 'Juil', jumia: 1290, avito: 1250, activity: 52 },
  { month: 'Août', jumia: 1370, avito: 1290, activity: 68 },
  { month: 'Sept', jumia: 1410, avito: 1320, activity: 61 },
  { month: 'Oct', jumia: 1380, avito: 1350, activity: 75 },
  { month: 'Nov', jumia: 1490, avito: 1390, activity: 88 },
]

export const categoryShare = [
  { name: 'Électronique', value: 34, color: '#3563e9' },
  { name: 'Maison', value: 24, color: '#8b74e8' },
  { name: 'Mode', value: 18, color: '#35b89b' },
  { name: 'Smartphones', value: 15, color: '#f5a623' },
  { name: 'Autres', value: 9, color: '#cbd5e1' },
]

export const notifications = [
  { title: 'Baisse de prix détectée', body: 'Le Samsung Galaxy S24 Ultra a baissé de 3,8 % sur Jumia.', time: 'Il y a 12 min', color: 'blue' },
  { title: 'Nouvelle opportunité', body: 'La demande pour les accessoires gaming progresse à Casablanca.', time: 'Il y a 1 h', color: 'green' },
  { title: 'Tendance en hausse', body: 'Les sneakers rétro gagnent en popularité cette semaine.', time: 'Il y a 3 h', color: 'orange' },
]

export const formatMAD = (price: number) => `${new Intl.NumberFormat('fr-MA').format(price)} DH`
