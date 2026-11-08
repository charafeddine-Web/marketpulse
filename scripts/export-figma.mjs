import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const output = path.resolve('design/marketpulse-figma')
const W = 1440
const H = 1024
const C = {
  ink: '#20283a', muted: '#8490a2', line: '#e8edf4', paper: '#f6f8fc',
  white: '#ffffff', blue: '#3563e9', paleBlue: '#edf2ff', green: '#159b72',
  paleGreen: '#eaf8f2', violet: '#826bdd', paleViolet: '#f3efff',
  orange: '#e69a3c', paleOrange: '#fff5e7', red: '#dd6870',
}
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const rect = (x, y, w, h, fill = C.white, radius = 9, stroke = 'none') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`
const text = (x, y, value, size = 12, fill = C.ink, weight = 400, anchor = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="${weight}">${escape(value)}</text>`
const line = (x1, y1, x2, y2, color = C.line, width = 1) =>
  `<path d="M${x1} ${y1}H${x2}" stroke="${color}" stroke-width="${width}"/>`
const circle = (cx, cy, r, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`
const button = (x, y, label, primary = false, width = null) => {
  const w = width ?? Math.max(82, label.length * 7 + 27)
  return `${rect(x, y, w, 34, primary ? C.blue : C.white, 7, primary ? C.blue : C.line)}${text(x + w / 2, y + 22, label, 11, primary ? C.white : '#596477', 600, 'middle')}`
}
const cardTitle = (x, y, title, sub = '') => `${text(x, y, title, 14, C.ink, 700)}${sub ? text(x, y + 19, sub, 10, C.muted) : ''}`

function frame(title, subtitle, section, content, active = title) {
  const nav = [
    ['◫', 'Vue d’ensemble'], ['▦', 'Catalogue produits'], ['↗', 'Tendances du marché'],
    ['◉', 'Analyse des sentiments'], ['⌁', 'Prévisions des prix'], ['◇', 'Opportunités'],
    ['▤', 'Gestion des données'], ['♧', 'Alertes & notifications'], ['▧', 'Rapports'],
  ]
  let sidebar = `${rect(0, 0, 252, H, C.white, 0)}<path d="M251 0V1024" stroke="${C.line}"/>`
  sidebar += `${rect(22, 21, 31, 31, C.blue, 9)}${text(37.5, 42, '↗', 18, C.white, 700, 'middle')}${text(64, 39, 'market', 18, C.ink, 800)}${text(128, 39, 'pulse', 18, C.blue, 800)}${text(64, 52, 'INTELLIGENCE MAROC', 7, C.muted, 700)}`
  sidebar += `${rect(17, 74, 218, 48, C.white, 8, C.line)}${rect(26, 83, 30, 30, '#e9edff', 8)}${text(41, 103, 'A', 13, '#5264ae', 700, 'middle')}${text(66, 94, 'Équipe Atlas', 11, C.ink, 700)}${text(66, 109, 'Offre Business', 9, C.muted)}`
  sidebar += text(25, 151, 'ESPACE DE TRAVAIL', 8, '#9aa2b1', 700)
  nav.forEach(([icon, label], index) => {
    const y = 164 + index * 39
    const selected = label === active || (active === 'Vue d’ensemble' && index === 0)
    if (selected) sidebar += rect(17, y, 218, 34, C.paleBlue, 7)
    sidebar += text(30, y + 22, icon, 15, selected ? C.blue : '#7b8595', 600)
    sidebar += text(57, y + 21, label, 10, selected ? C.blue : '#727d8e', selected ? 650 : 500)
    if (label === 'Alertes & notifications') sidebar += `${rect(207, y + 8, 18, 18, C.paleBlue, 5)}${text(216, y + 21, '3', 9, C.blue, 700, 'middle')}`
  })
  sidebar += text(25, 536, 'VOTRE ESPACE', 8, '#9aa2b1', 700)
  sidebar += text(31, 568, '⚙', 14, '#7b8595', 600) + text(57, 568, 'Paramètres', 10, '#727d8e')
  sidebar += `${rect(18, 592, 218, 37, '#f7f6ff', 7, '#eeebfa')}${text(32, 616, '✦', 15, C.violet, 700)}${text(57, 615, 'Assistant MarketPulse', 10, '#7265be', 600)}`
  sidebar += `${rect(18, 821, 218, 117, '#fafaff', 9, C.line)}${text(30, 842, 'VOTRE ESPACE', 8, C.muted, 600)}${rect(192, 830, 30, 18, '#e9edff', 5)}${text(207, 842, 'PRO', 8, '#5469d8', 700, 'middle')}${text(30, 866, 'Le marché, en clair.', 11, C.ink, 700)}${rect(30, 879, 185, 4, '#e5e9f2', 4)}${rect(30, 879, 122, 4, '#8294ee', 4)}${text(30, 899, 'Votre essai se termine dans 12 jours', 8, C.muted)}${text(30, 923, 'Découvrir les offres  →', 9, C.blue, 600)}`
  sidebar += `${line(18, 958, 234, 958)}${circle(38, 985, 15, '#8a9ce0')}${text(38, 989, 'SB', 8, C.white, 700, 'middle')}${text(61, 982, 'Salma Benali', 10, C.ink, 700)}${text(61, 997, 'Administratrice', 8, C.muted)}`

  let top = `${rect(252, 0, W - 252, 64, C.white, 0)}<path d="M252 63H1440" stroke="${C.line}"/>`
  top += `${text(281, 38, 'MarketPulse', 10, '#9aa2b0')}${text(344, 38, '›', 12, '#aab2bf')}${text(362, 38, title, 10, C.ink, 600)}`
  top += `${rect(1002, 15, 236, 33, C.white, 7, C.line)}${text(1016, 36, '⌕', 17, '#9aa2b0')}${text(1040, 36, 'Rechercher un produit...', 9, '#9aa2b0')}${rect(1192, 22, 35, 18, '#fafbfe', 4, C.line)}${text(1209, 35, '⌘ K', 8, '#929aaa', 500, 'middle')}`
  top += `${text(1268, 37, '☾', 17, '#818a9b')}${circle(1310, 28, 2.8, C.red)}${text(1310, 37, '♧', 16, '#818a9b')}${circle(1360, 31, 15, '#8a9ce0')}${text(1360, 34, 'SB', 8, C.white, 700, 'middle')}${text(1385, 35, '⌄', 12, C.muted)}`
  const bodyX = 284
  let heading = text(bodyX, 92, section.toUpperCase(), 8, '#8d97aa', 700)
  heading += text(bodyX, 125, title, 25, C.ink, 750)
  if (subtitle) heading += text(bodyX, 148, subtitle, 11, C.muted)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${C.paper}"/>${sidebar}${top}${heading}${content}</svg>`
}

function metric(x, y, label, value, delta, color = C.blue, width = 263) {
  const soft = color === C.green ? C.paleGreen : color === C.orange ? C.paleOrange : color === C.violet ? C.paleViolet : C.paleBlue
  return `${rect(x, y, width, 102)}${text(x + 16, y + 24, label, 10, '#7c8698', 500)}${rect(x + width - 46, y + 12, 29, 29, soft, 8)}${text(x + width - 31.5, y + 32, '↗', 15, color, 600, 'middle')}${text(x + 16, y + 57, value, 21, C.ink, 750)}${rect(x + 16, y + 69, 54, 18, C.paleGreen, 4)}${text(x + 43, y + 82, delta, 8, C.green, 700, 'middle')}${text(x + 77, y + 82, 'vs. période précédente', 8, '#9aa2b1')}`
}

function chartCard(x, y, w, h, title, subtitle, mode = 'line') {
  let out = `${rect(x, y, w, h)}${cardTitle(x + 17, y + 25, title, subtitle)}`
  const left = x + 49, right = x + w - 20, top = y + 73, bottom = y + h - 32
  for (let i = 0; i < 4; i++) out += line(left, top + i * (bottom - top) / 3, right, '#edf0f5')
  const labels = ['Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov']
  labels.forEach((label, index) => { out += text(left + index * (right - left) / 6, bottom + 19, label, 8, '#9299a8', 400, 'middle') })
  if (mode === 'bar') {
    const heights = [64, 89, 73, 118, 102, 143, 166]
    heights.forEach((height, index) => { const bx = left + 10 + index * ((right - left - 35) / 7); out += rect(bx, bottom - height, 23, height, index === 6 ? C.blue : '#dfe7ff', 4) })
  } else {
    const points = [117, 101, 111, 76, 86, 51, 62]
    const path = points.map((point, index) => `${index ? 'L' : 'M'}${left + index * (right - left) / 6} ${top + point}`).join(' ')
    const path2 = points.map((point, index) => `${index ? 'L' : 'M'}${left + index * (right - left) / 6} ${top + point + 34}`).join(' ')
    out += `<path d="${path}" fill="none" stroke="${C.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
    out += `<path d="${path2}" fill="none" stroke="${C.violet}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`
  }
  return out
}

function rowsCard(x, y, w, title, subtitle, rows, columns = ['PRODUIT', 'PRIX MOYEN', 'POPULARITÉ', 'ÉVOLUTION']) {
  let out = `${rect(x, y, w, 290)}${cardTitle(x + 17, y + 25, title, subtitle)}`
  out += text(x + w - 82, y + 25, 'Tout voir →', 9, C.blue, 600)
  out += line(x + 15, y + 57, x + w - 15)
  const xs = [x + 17, x + w * .56, x + w * .74, x + w * .87]
  columns.forEach((column, index) => { out += text(xs[index] ?? x + w - 20, y + 76, column, 7, '#9aa3b1', 700) })
  rows.forEach((row, index) => {
    const yy = y + 93 + index * 48
    out += circle(x + 29, yy + 11, 13, ['#edf2ff', '#f3efff', '#eaf8f2', '#fff5e7'][index % 4])
    out += text(x + 29, yy + 14, `${index + 1}`, 8, C.blue, 700, 'middle')
    out += text(x + 50, yy + 8, row[0], 9, C.ink, 600)
    out += text(x + 50, yy + 23, row[1], 8, C.muted)
    out += text(x + w * .56, yy + 14, row[2], 9, C.ink, 600)
    out += rect(x + w * .74, yy + 7, 58, 5, '#eef1f6', 3)
    out += rect(x + w * .74, yy + 7, 42 + (index % 3) * 5, 5, '#6592ef', 3)
    out += text(x + w * .87, yy + 14, row[3], 9, index === 1 ? C.red : C.green, 650)
    if (index < rows.length - 1) out += line(x + 16, yy + 35, x + w - 16)
  })
  return out
}

const products = [
  ['Samsung Galaxy S24 Ultra', 'Smartphones · Jumia', '12 499 DH', '−3,8 %'],
  ['Apple MacBook Air M3', 'Informatique · Jumia', '14 990 DH', '−3,2 %'],
  ['PlayStation 5 Slim', 'Électronique · Jumia', '6 490 DH', '−7,2 %'],
  ['Nike Air Max Pulse', 'Mode · Jumia', '1 199 DH', '−7,7 %'],
  ['Sony WH-1000XM5', 'Électronique · Avito', '3 290 DH', '−8,4 %'],
]

const screens = [
  {
    file: '01-dashboard.svg', title: 'Vue d’ensemble', section: 'Jeudi 5 novembre 2026', active: 'Vue d’ensemble',
    subtitle: 'Voici ce qui se passe sur le marché marocain aujourd’hui.',
    render: () => {
      let out = `${rect(284, 168, 1104, 60, '#f2f5ff', 9, '#e5e9fb')}${rect(300, 181, 32, 32, '#e7eaff', 8)}${text(316, 202, '✦', 16, C.violet, 700, 'middle')}${text(345, 190, 'Votre marché bouge.', 10, C.ink, 700)}${text(345, 207, 'Les recherches pour les smartphones milieu de gamme ont progressé de 18 % cette semaine.', 9, C.muted)}${text(1267, 203, 'Explorer l’insight →', 9, C.blue, 600)}`
      const m = [['Produits suivis', '2 846', '+12,8 %', C.blue], ['Prix moyen du marché', '1 284 DH', '+3,2 %', C.violet], ['Produits tendance', '124', '+8,4 %', C.orange], ['Opportunités détectées', '38', '+6 nouvelles', C.green], ['Note moyenne clients', '4,6 / 5', '+0,2', C.blue]]
      m.forEach((item, index) => { out += metric(284 + index * 223, 242, ...item, 211) })
      out += chartCard(284, 359, 706, 333, 'Évolution des prix', 'Prix moyen observé sur les plateformes')
      out += `${rect(1004, 359, 384, 333)}${cardTitle(1021, 384, 'Répartition du marché', 'Par catégorie de produits')}`
      out += `<circle cx="1195" cy="505" r="65" fill="none" stroke="#edf2ff" stroke-width="20"/><circle cx="1195" cy="505" r="65" fill="none" stroke="${C.blue}" stroke-width="20" stroke-dasharray="138 270" transform="rotate(-90 1195 505)"/><circle cx="1195" cy="505" r="65" fill="none" stroke="${C.violet}" stroke-width="20" stroke-dasharray="95 313" stroke-dashoffset="-143" transform="rotate(-90 1195 505)"/>${text(1195, 503, '2 846', 17, C.ink, 750, 'middle')}${text(1195, 521, 'produits', 9, C.muted, 400, 'middle')}`
      ;[['Électronique','34%',C.blue],['Maison','24%',C.violet],['Mode','18%',C.green],['Smartphones','15%',C.orange]].forEach((item, index) => { const xx = 1024 + (index % 2) * 170, yy = 596 + Math.floor(index / 2) * 24; out += circle(xx, yy - 3, 4, item[2]) + text(xx + 10, yy, item[0], 8, C.muted) + text(xx + 143, yy, item[1], 8, C.ink, 650, 'end') })
      out += rowsCard(284, 708, 706, 'Produits tendance', 'Les produits les plus consultés cette semaine', products.slice(0, 4))
      out += `${rect(1004, 708, 384, 290)}${cardTitle(1021, 733, 'À surveiller', 'Signaux détectés par MarketPulse')}`
      ;[['Baisse de prix notable','Galaxy S24 Ultra · −3,8 % sur Jumia',C.green],['Forte demande détectée','Accessoires gaming · Casablanca',C.orange],['Nouvelle tendance','Sneakers rétro · +24 % de recherches',C.blue]].forEach((item, index) => { const yy = 779 + index * 62; out += circle(1038, yy - 3, 14, item[2] === C.green ? C.paleGreen : item[2] === C.orange ? C.paleOrange : C.paleBlue) + text(1062, yy - 4, item[0], 9, C.ink, 600) + text(1062, yy + 12, item[1], 8, C.muted) + text(1347, yy - 3, `${12 + index * 34} min`, 7, C.muted, 400, 'end') })
      return out
    },
  },
  {
    file: '02-catalogue-produits.svg', title: 'Catalogue produits', section: 'Exploration du marché', active: 'Catalogue produits',
    subtitle: 'Explorez, filtrez et comparez les prix des produits suivis au Maroc.',
    render: () => {
      let out = `${button(1130, 107, '♡  Favoris (12)')}${button(1260, 107, '+  Suivre un produit', true, 128)}`
      out += `${rect(284, 169, 1104, 89)}${rect(298, 182, 322, 32, C.white, 6, C.line)}${text(311, 203, '⌕', 15, C.muted)}${text(334, 202, 'Nom du produit, marque…', 9, C.muted)}`
      ;[['Toutes les catégories', 630, 161],['Toutes les villes', 815, 150],['Toutes les plateformes', 980, 170]].forEach(([label, x, width]) => { out += rect(x, 182, width, 32, C.white, 6, C.line) + text(x + 9, 202, label, 9, '#687286') + text(x + width - 14, 202, '⌄', 11, C.muted) })
      out += text(300, 240, '⌕  Filtres avancés', 9, C.blue, 600) + text(299, 251, '12 produits trouvés', 8, C.muted) + text(1070, 240, 'Trier par  Plus populaires  ⌄', 9, C.muted)
      const cards = products
      cards.forEach((p, index) => {
        const col = index % 4, row = Math.floor(index / 4), x = 284 + col * 278, y = 274 + row * 332
        out += rect(x, y, 263, 315, C.white, 10, C.line)
        out += rect(x, y, 263, 155, ['#edf1f8','#f2efff','#f3f5f8','#fff3e8'][index % 4], 9)
        out += `${circle(x + 226, y + 20, 13, C.white)}${text(x + 226, y + 24, '♡', 14, '#9098a7', 400, 'middle')}`
        out += `${rect(x + 12, y + 12, 45, 19, C.white, 5)}${text(x + 34, y + 25, index % 2 ? 'AVITO' : 'JUMIA', 7, '#657084', 700, 'middle')}`
        out += text(x + 13, y + 179, p[0], 10, C.ink, 650) + text(x + 13, y + 197, p[1], 8, C.muted)
        out += text(x + 13, y + 232, p[2], 14, C.ink, 750) + text(x + 223, y + 232, p[3], 9, C.green, 650, 'end')
        out += line(x + 13, y + 252, x + 250) + text(x + 14, y + 278, '★  4,8  ·  284 avis', 8, '#778194') + text(x + 247, y + 278, `↗  ${96 - index * 4}`, 8, C.blue, 650, 'end')
        out += `${rect(x + 158, y + 288, 91, 20, '#ffffff', 5, C.line)}${text(x + 203, y + 302, '□  Comparer', 8, '#657084', 500, 'middle')}`
      })
      return out
    },
  },
  {
    file: '03-detail-produit.svg', title: 'Détail du produit', section: 'Smartphones · Jumia', active: 'Catalogue produits',
    subtitle: 'Samsung Galaxy S24 Ultra · Suivi du marché à Casablanca, Maroc',
    render: () => {
      let out = text(284, 174, '←  Retour au catalogue', 9, C.muted)
      out += `${rect(284, 198, 538, 323, '#eef1f5')}${rect(300, 483, 205, 22, C.white, 5)}${text(310, 498, 'Jumia · Données de démonstration', 8, '#687286')}`
      out += `${rect(839, 198, 549, 323)}${text(860, 224, 'MEILLEUR PRIX OBSERVÉ', 8, C.muted, 700)}${text(860, 266, '12 499 DH', 30, C.ink, 750)}${text(860, 289, '↘  −3,8 %   sur 30 jours', 10, C.green, 650)}${line(860, 307, 1367)}`
      ;[['Prix précédent','12 999 DH'],['Plateforme','Jumia'],['Note clients','★  4,8 / 5']].forEach((row, i) => { out += text(860, 334 + i * 27, row[0], 9, C.muted) + text(1363, 334 + i * 27, row[1], 9, C.ink, 650, 'end') })
      out += `${button(860, 438, 'Voir l’offre  ↗', true, 485)}${rect(839, 534, 549, 100, '#f8f8ff', 9, '#e7e8fb')}${text(856, 559, '✦  Analyse MarketPulse', 10, C.violet, 700)}${text(856, 582, 'La demande reste soutenue et le prix moyen est inférieur de 4,2 % au mois dernier.', 9, C.muted)}${text(856, 602, 'Analyse basée sur des données de démonstration.', 8, '#9ba3b1')}`
      out += chartCard(284, 652, 705, 293, 'Historique des prix', 'Évolution du prix moyen estimé sur 7 mois')
      out += `${rect(1004, 652, 384, 293)}${cardTitle(1021, 678, 'Avis clients', 'Analyse de 284 avis')}${text(1021, 731, '4,8', 31, C.ink, 750)}${text(1083, 723, '★★★★★', 15, C.orange, 700)}${text(1083, 740, 'Note moyenne', 8, C.muted)}${rect(1021, 769, 347, 8, '#fff0d0', 5)}${rect(1021, 769, 270, 8, '#38b88b', 5)}${text(1021, 799, 'Positifs   78 %', 8, C.green, 600)}${text(1138, 799, 'Neutres   16 %', 8, C.orange, 600)}${text(1270, 799, 'Négatifs   6 %', 8, C.red, 600)}${rect(1021, 823, 347, 77, C.paper, 7)}${text(1033, 847, '« Très bon rapport qualité-prix, conforme', 9, '#667187')}${text(1033, 865, 'à mes attentes. »', 9, '#667187')}${text(1033, 884, 'Avis client · Casablanca', 8, C.muted)}`
      return out
    },
  },
  {
    file: '04-tendances.svg', title: 'Tendances du marché', section: 'Comprendre le marché', active: 'Tendances du marché',
    subtitle: 'Repérez les mouvements qui façonnent la demande au Maroc.',
    render: () => {
      let out = metric(284, 169, 'Indice de demande', '78,4', '+6,8 %', C.blue, 350) + metric(652, 169, 'Catégories en hausse', '8', '+2 nouvelles', C.green, 350) + metric(1020, 169, 'Produits émergents', '42', '+14,2 %', C.violet, 368)
      out += chartCard(284, 286, 705, 326, 'Activité du marché', 'Indice de recherches et intérêt produit', 'bar')
      out += `${rect(1004, 286, 384, 326)}${cardTitle(1021, 311, 'Demande par ville', 'Indice d’intérêt observé')}`
      ;[['Casablanca',86],['Rabat',72],['Marrakech',65],['Tanger',58],['Fès',51],['Agadir',44]].forEach((row, i) => { const yy = 363 + i * 34; out += text(1023, yy, row[0], 9, '#788295') + rect(1103, yy - 8, 212, 6, '#eef1f6', 4) + rect(1103, yy - 8, 212 * row[1] / 100, 6, '#7594eb', 4) + text(1363, yy, row[1], 9, C.ink, 600, 'end') })
      out += rowsCard(284, 630, 705, 'Les produits qui montent', 'Popularité en progression cette semaine', products.slice(0, 4))
      out += `${rect(1004, 630, 384, 290)}${text(1021, 658, '✦  À RETENIR', 9, C.violet, 700)}${text(1021, 695, 'La tech reste', 17, C.ink, 750)}${text(1021, 718, 'en tête.', 17, C.ink, 750)}${text(1021, 749, 'Les accessoires et smartphones', 9, C.muted)}${text(1021, 766, 'abordables concentrent la plus forte', 9, C.muted)}${text(1021, 783, 'progression de la demande.', 9, C.muted)}${line(1021, 808, 1367)}${text(1021, 832, 'Catégorie en hausse', 9, C.muted)}${text(1367, 832, '+18,6 %', 9, C.green, 700, 'end')}${text(1021, 861, 'Ville la plus dynamique', 9, C.muted)}${text(1367, 861, 'Casablanca', 9, C.ink, 650, 'end')}`
      return out
    },
  },
  {
    file: '05-sentiments.svg', title: 'Analyse des sentiments', section: 'Voix des clients', active: 'Analyse des sentiments',
    subtitle: 'Comprenez ce que vos clients pensent des produits et des marques.',
    render: () => {
      let out = metric(284, 169, 'Avis analysés', '12 486', '+1 284', C.blue, 263) + metric(560, 169, 'Sentiment positif', '72 %', '+4,6 pts', C.green, 263) + metric(836, 169, 'Sentiment neutre', '19 %', '−1,2 pts', C.orange, 263) + metric(1112, 169, 'Sentiment négatif', '9 %', '−3,4 pts', C.red, 276)
      out += chartCard(284, 286, 706, 337, 'Évolution du sentiment', 'Répartition des avis clients dans le temps')
      out += `${rect(1004, 286, 384, 337)}${cardTitle(1021, 311, 'Vue d’ensemble', 'Sur l’ensemble des avis analysés')}`
      out += `<circle cx="1196" cy="454" r="62" fill="none" stroke="#eaf8f2" stroke-width="20"/><circle cx="1196" cy="454" r="62" fill="none" stroke="#34b889" stroke-width="20" stroke-dasharray="280 110" transform="rotate(-90 1196 454)"/>${text(1196, 456, '72%', 22, C.ink, 750, 'middle')}${text(1196, 474, 'positifs', 9, C.muted, 400, 'middle')}`
      ;[['Positif','72%',C.green],['Neutre','19%',C.orange],['Négatif','9%',C.red]].forEach((row, i) => { const yy = 541 + i * 23; out += circle(1026, yy - 3, 4, row[2]) + text(1038, yy, row[0], 9, C.muted) + text(1366, yy, row[1], 9, C.ink, 650, 'end') })
      out += `${rect(284, 641, 537, 280)}${cardTitle(301, 666, 'Les mots qui reviennent', 'Termes les plus fréquents dans les avis')}`
      ;[['Qualité',20,C.paleBlue,C.blue],['Prix',18,C.paleGreen,'#628e75'],['Livraison',15,C.paleViolet,C.violet],['Conforme',16,C.paleOrange,C.orange],['Rapide',13,C.paleBlue,C.blue],['Emballage',12,C.paleGreen,'#628e75'],['Service',14,C.paleViolet,C.violet],['Autonomie',11,C.paleOrange,C.orange]].forEach((item, index) => { const xx = 332 + (index % 3) * 147, yy = 748 + Math.floor(index / 3) * 54; out += rect(xx, yy - 22, 120, 35, item[2], 7) + text(xx + 12, yy, item[0], item[1] - 4, item[3], 700) })
      out += `${rect(836, 641, 552, 280)}${cardTitle(853, 666, 'Avis récents', 'Retours clients représentatifs')}`
      ;[['★★★★★','Excellent rapport qualité-prix, livraison rapide et produit conforme.','Meryem A. · Samsung Galaxy S24'],['★★★★☆','Le produit est bien, mais l’emballage mériterait d’être amélioré.','Youssef K. · MacBook Air M3'],['★★★★★','La qualité est au rendez-vous, je recommande.','Imane B. · Nike Air Max Pulse']].forEach((row, i) => { const yy = 718 + i * 62; out += text(853, yy, row[0], 10, C.orange, 700) + text(853, yy + 17, row[1], 8, '#697488') + text(853, yy + 34, row[2], 8, C.muted); if (i < 2) out += line(853, yy + 46, 1370) })
      return out
    },
  },
  {
    file: '06-previsions.svg', title: 'Prévisions des prix', section: 'Anticiper les mouvements', active: 'Prévisions des prix',
    subtitle: 'Anticipez l’évolution des prix et ajustez votre stratégie au bon moment.',
    render: () => {
      let out = `${rect(284, 169, 1104, 59, '#f7f7ff', 9, '#e7e8fb')}${text(302, 194, '✦  Analyse prédictive MarketPulse', 10, C.violet, 700)}${text(302, 212, 'Modèle basé sur l’historique simulé. Les prévisions sont indicatives.', 9, C.muted)}${rect(1240, 184, 130, 24, C.paleGreen, 6)}${text(1305, 200, 'Confiance élevée · 87 %', 8, C.green, 650, 'middle')}`
      out += metric(284, 242, 'Prix actuel', '12 499 DH', '−3,8 %', C.blue, 350) + metric(652, 242, 'Prix estimé dans 30 j.', '12 890 DH', '+3,1 %', C.green, 350) + metric(1020, 242, 'Indice de confiance', '87 %', 'Élevé', C.violet, 368)
      out += chartCard(284, 359, 1104, 417, 'Historique & prévision du prix', 'Samsung Galaxy S24 Ultra · 6 mois + prévision')
      out += `<path d="M1080 432L1112 452L1144 439L1176 458" fill="none" stroke="${C.violet}" stroke-width="3" stroke-dasharray="7 5"/>${text(306, 740, '■ Historique observé', 8, C.blue, 600)}${text(442, 740, '╌ Prévision indicative · données simulées', 8, C.violet, 600)}`
      out += `${rect(284, 794, 537, 146)}${text(302, 820, '✦  CE QUE PRÉDIT MARKETPULSE', 9, C.violet, 700)}${text(302, 851, 'Une hausse modérée attendue.', 14, C.ink, 700)}${text(302, 873, 'Le prix pourrait progresser légèrement, porté par une demande', 9, C.muted)}${text(302, 891, 'stable et une offre moins abondante.', 9, C.muted)}${text(302, 922, 'Évolution attendue', 8, C.muted)}${text(802, 922, '+3,1 %', 9, C.green, 700, 'end')}`
      out += `${rect(836, 794, 552, 146)}${text(854, 820, '◌  PRÉVISION DE LA DEMANDE', 9, C.blue, 700)}${text(854, 851, 'Demande soutenue', 14, C.ink, 700)}${text(854, 873, 'L’intérêt devrait rester au-dessus de la moyenne des', 9, C.muted)}${text(854, 891, 'six derniers mois.', 9, C.muted)}${text(854, 922, 'Indice de demande estimé', 8, C.muted)}${text(1366, 922, '82 / 100', 9, C.ink, 700, 'end')}`
      return out
    },
  },
  {
    file: '07-opportunites.svg', title: 'Opportunités commerciales', section: 'Détecter la valeur', active: 'Opportunités',
    subtitle: 'Des signaux de marché transformés en pistes concrètes pour votre activité.',
    render: () => {
      let out = `${rect(284, 169, 1104, 108, '#f3f6ff', 10, '#dfe8ff')}${rect(302, 190, 43, 43, '#e5ebff', 10)}${text(323, 218, '◇', 19, C.blue, 700, 'middle')}${text(362, 196, 'OPPORTUNITÉ À SAISIR', 8, '#6478d7', 700)}${text(362, 220, 'Les smartphones milieu de gamme accélèrent.', 14, C.ink, 700)}${text(362, 242, 'Demande en hausse à Casablanca et Rabat, avec un écart de prix intéressant.', 9, C.muted)}${circle(1345, 222, 28, C.white)}<circle cx="1345" cy="222" r="26" fill="none" stroke="#6f8aef" stroke-width="2"/>${text(1345, 222, '94', 15, C.blue, 750, 'middle')}${text(1345, 234, 'SCORE', 6, C.muted, 700, 'middle')}`
      out += metric(284, 293, 'Opportunités actives', '38', '+6 cette semaine', C.blue, 350) + metric(652, 293, 'Potentiel moyen', '72 / 100', '+8 pts', C.green, 350) + metric(1020, 293, 'Demande en hausse', '24 produits', '+12,4 %', C.violet, 368)
      out += `${rect(284, 410, 1104, 516)}${cardTitle(302, 436, 'Opportunités détectées', 'Classement par potentiel commercial estimé')}${text(1216, 435, 'Trier par  Score d’opportunité  ⌄', 9, C.muted)}${line(300, 457, 1372)}`
      const headers = [['PRODUIT',302],['DEMANDE',614],['PRIX MOYEN',756],['CROISSANCE',899],['SCORE',1025],['RECOMMANDATION',1110]]
      headers.forEach(([label,x]) => { out += text(x, 478, label, 7, '#9aa3b1', 700) })
      products.slice(0, 7).forEach((p, i) => { const yy = 507 + i * 56; out += circle(314, yy - 5, 14, ['#edf2ff','#f3efff','#eaf8f2'][i%3]) + text(314, yy - 2, `${i+1}`, 8, C.blue, 700, 'middle') + text(339, yy - 8, p[0], 9, C.ink, 600) + text(339, yy + 8, p[1].split(' · ')[0], 8, C.muted) + text(615, yy, i < 3 ? '● ● ● ●  Forte' : '● ● ●  Modérée', 8, C.green, 600) + text(756, yy, p[2], 9, C.ink, 600) + text(900, yy, `↗ +${32-i*3}%`, 9, C.green, 650) + rect(1025, yy - 16, 33, 25, '#f2f5ff', 5, '#dce5ff') + text(1041, yy, `${94-i*4}`, 9, C.blue, 700, 'middle') + rect(1110, yy - 17, 93, 26, C.white, 5, C.line) + text(1156, yy, '✦  Explorer', 8, C.violet, 600, 'middle'); if (i < 6) out += line(302, yy + 25, 1370) })
      return out
    },
  },
  {
    file: '08-gestion-donnees.svg', title: 'Gestion des données', section: 'Qualité & sources', active: 'Gestion des données',
    subtitle: 'Suivez vos sources de données et gérez les imports de votre espace.',
    render: () => {
      let out = metric(284, 169, 'Enregistrements', '24 680', '+1 284', C.blue, 263) + metric(560, 169, 'Qualité des données', '96,4 %', '+1,2 pts', C.green, 263) + metric(836, 169, 'Doublons détectés', '184', '−12,4 %', C.orange, 263) + metric(1112, 169, 'Prix manquants', '2,1 %', 'Stable', C.violet, 276)
      out += `${rect(284, 286, 530, 326)}${cardTitle(301, 312, 'Sources de données', 'État des connecteurs de collecte')}${rect(709, 299, 89, 21, C.paleGreen, 5)}${text(753, 313, '● Opérationnel', 8, C.green, 650, 'middle')}`
      ;[['J','Jumia Maroc','Produits, prix et avis clients','18 420 produits','Synchronisé il y a 14 min',C.orange],['A','Avito Maroc','Annonces et prix du marché','6 260 produits','Synchronisé il y a 32 min',C.blue]].forEach((r, i) => { const yy = 370 + i * 78; out += `${rect(302, yy - 22, 34, 34, r[5] === C.orange ? '#fff0e4' : C.paleBlue, 8)}${text(319, yy, r[0], 13, r[5], 700, 'middle')}${text(348, yy - 6, r[1], 10, C.ink, 650)}${text(348, yy + 10, r[2], 8, C.muted)}${text(637, yy - 6, r[3], 8, C.ink, 600)}${text(637, yy + 10, r[4], 7, C.muted)}${text(783, yy, '● Actif', 8, C.green, 600, 'end')}`; if (i === 0) out += line(302, yy + 35, 797) })
      out += `${rect(284, 630, 530, 276, C.white, 10, C.line)}${rect(500, 666, 68, 61, '#edf2ff', 15)}${text(534, 703, '⇧', 28, C.blue, 400, 'middle')}${text(549, 757, 'Importer vos données', 14, C.ink, 700, 'middle')}${text(549, 777, 'Glissez votre fichier CSV ici, ou parcourez vos fichiers.', 9, C.muted, 400, 'middle')}${button(486, 797, 'Choisir un fichier', false, 126)}${text(549, 850, 'CSV uniquement · 20 Mo maximum', 8, C.muted, 400, 'middle')}${text(549, 881, 'Lancer l’import', 9, C.blue, 600, 'middle')}`
      out += `${rect(836, 286, 552, 620)}${cardTitle(853, 312, 'Historique des imports', 'Dernières opérations effectuées')}${text(1345, 312, 'Tous les imports  ⌄', 8, C.muted, 400, 'end')}${line(852, 338, 1370)}`
      ;[['catalogue_octobre.csv','Aujourd’hui, 09:42','1 284','98,2 %'],['Jumia Maroc · sync','Aujourd’hui, 09:28','842','96,8 %'],['Avito Maroc · sync','Aujourd’hui, 09:10','426','94,1 %'],['import_produits_sept.csv','29 oct. 2026, 16:08','2 140','97,5 %']].forEach((r,i) => { const yy = 376 + i * 51; out += text(853, yy, '▧', 13, C.blue, 600) + text(876, yy, r[0], 8, C.ink, 600) + text(853, yy + 19, r[1], 7, C.muted) + text(1164, yy, r[2], 8, C.ink, 500) + text(1242, yy, r[3], 8, C.green, 600) + text(1357, yy, '✓ Terminé', 8, C.green, 600, 'end'); out += line(853, yy + 31, 1370) })
      return out
    },
  },
  {
    file: '09-alertes-notifications.svg', title: 'Alertes & notifications', section: 'Rester informé', active: 'Alertes & notifications',
    subtitle: 'Les signaux importants du marché, réunis au même endroit.',
    render: () => {
      let out = button(1225, 107, '✓  Tout marquer comme lu', false, 163)
      out += `${rect(284, 169, 675, 472)}${cardTitle(301, 196, 'Récemment', '3 nouvelles alertes à consulter')}`
      ;[['Baisse de prix détectée','Le Samsung Galaxy S24 Ultra a baissé de 3,8 % sur Jumia.','Il y a 12 min',C.blue],['Nouvelle opportunité','La demande pour les accessoires gaming progresse à Casablanca.','Il y a 1 h',C.green],['Tendance en hausse','Les sneakers rétro gagnent en popularité cette semaine.','Il y a 3 h',C.orange]].forEach((r,i) => { const yy = 265 + i * 112; out += `${rect(302, yy - 22, 34, 34, r[3] === C.blue ? C.paleBlue : r[3] === C.green ? C.paleGreen : C.paleOrange, 8)}${text(319, yy, i===0?'↘':i===1?'◇':'↗', 15, r[3], 700, 'middle')}${text(349, yy - 8, r[0], 10, C.ink, 650)}${text(936, yy - 8, r[2], 8, C.muted, 400, 'end')}${text(349, yy + 12, r[1], 8, C.muted)}${text(349, yy + 34, 'Voir le détail  →', 8, C.blue, 600)}`; if(i<2) out += line(302, yy + 55, 940) })
      out += `${rect(981, 169, 407, 472)}${cardTitle(998, 196, 'Préférences d’alertes', 'Choisissez les signaux à suivre')}`
      ;[['Alertes par e-mail','Recevoir un résumé dans votre boîte mail'],['Variations de prix','Quand un prix varie de plus de 5 %'],['Nouvelles tendances','Produits et catégories en hausse'],['Opportunités commerciales','Détection de pistes à fort potentiel']].forEach((r,i)=>{const yy=256+i*68;out+=text(998,yy,r[0],9,C.ink,650)+text(998,yy+15,r[1],7,C.muted)+rect(1340,yy-12,31,17,i===0?'#dfe3eb':C.blue,10)+circle(i===0?1350:1361,yy-3,6,C.white)+line(998,yy+32,1370)})
      out += button(998, 544, 'Enregistrer les préférences', true, 373)
      out += `${rect(284, 661, 1104, 280)}${cardTitle(301, 688, 'Historique des alertes', 'Vos notifications des 30 derniers jours')}`
      ;[['Baisse de prix détectée','Galaxy S24 Ultra · −3,8 % sur Jumia','Il y a 12 min',C.blue],['Nouvelle opportunité','Demande accessoires gaming à Casablanca','Il y a 1 h',C.green],['Tendance en hausse','Sneakers rétro · +24 % de recherches','Il y a 3 h',C.orange],['Baisse de prix détectée','Casque audio · prix moyen en baisse','Hier, 14:32',C.blue]].forEach((r,i)=>{const yy=744+i*43;out+=circle(307,yy-3,4,r[3])+text(322,yy,r[0],8,C.ink,600)+text(550,yy,r[1],8,C.muted)+text(1365,yy,r[2],8,C.muted,400,'end');if(i<3)out+=line(301,yy+15,1370)})
      return out
    },
  },
  {
    file: '10-rapports.svg', title: 'Rapports & analyses', section: 'Vos données, en clair', active: 'Rapports',
    subtitle: 'Créez des rapports utiles et partagez vos analyses de marché.',
    render: () => {
      let out = `${rect(284, 169, 1104, 108, '#f2f5ff', 10, '#e0e7fd')}${rect(302, 190, 43, 43, '#e4eaff', 10)}${text(323, 218, '▧', 20, C.blue, 700, 'middle')}${text(362, 196, 'RAPPORT HEBDOMADAIRE', 8, '#7480d0', 700)}${text(362, 220, 'Le marché marocain en un regard.', 15, C.ink, 700)}${text(362, 242, 'Prix, tendances et opportunités · semaine du 2 au 8 novembre.', 9, C.muted)}${button(1213, 204, '↓  Télécharger le rapport', true, 157)}`
      out += `${text(284, 315, 'Générer un rapport', 14, C.ink, 700)}${text(284, 334, 'Choisissez une analyse à exporter', 9, C.muted)}`
      ;[['↗','Évolution des prix','Suivez les variations de prix par produit et plateforme.',C.paleBlue,C.blue],['⇄','Comparaison de produits','Comparez prix, notes et popularités du marché.',C.paleViolet,C.violet],['◉','Analyse des sentiments','Synthèse des retours et avis clients par catégorie.',C.paleGreen,C.green],['⌁','Tendances du marché','Signaux clés et évolutions par secteur.',C.paleOrange,C.orange]].forEach((r,i)=>{const x=284+i*278;out+=`${rect(x,353,263,164)}${rect(x+14,369,33,33,r[3],8)}${text(x+30,391,r[0],16,r[4],700,'middle')}${text(x+14,425,r[1],10,C.ink,700)}${text(x+14,446,r[2].slice(0,36),8,C.muted)}${text(x+14,461,r[2].slice(36),8,C.muted)}${text(x+14,494,'Créer un rapport  →',8,C.blue,600)}`})
      out += `${rect(284, 541, 1104, 400)}${cardTitle(301, 568, 'Rapports récents', 'Vos dernières analyses exportées')}${line(300, 593, 1370)}`
      ;[['Analyse prix · Smartphones','Évolution des prix','Aujourd’hui, 09:24'],['Marché marocain · Semaine 44','Tendances du marché','Hier, 16:48'],['Sentiment · Électronique','Analyse des sentiments','30 oct. 2026'],['Comparatif · Ordinateurs','Comparaison de produits','28 oct. 2026']].forEach((r,i)=>{const yy=629+i*62;out+=text(302,yy,'▧',14,C.blue,600)+text(327,yy,r[0],9,C.ink,600)+text(751,yy,r[1],8,C.muted)+text(985,yy,r[2],8,C.muted)+`${rect(1168,yy-13,35,20,'#fff0f0',4)}${text(1185,yy,'PDF',7,C.red,700,'middle')}${text(1357,yy,'↓  Télécharger',8,C.blue,600,'end')}`;if(i<3)out+=line(302,yy+23,1370)})
      return out
    },
  },
  {
    file: '11-parametres.svg', title: 'Paramètres', section: 'Votre espace de travail', active: 'Paramètres',
    subtitle: 'Gérez votre profil, vos préférences et votre espace MarketPulse.',
    render: () => {
      let out = `${rect(284, 169, 175, 253, C.white)}`
      ;['Profil','Préférences','Notifications','Équipe','Facturation'].forEach((label,i)=>{const y=184+i*40;if(i===0)out+=rect(294,y-16,155,32,C.paleBlue,6);out+=text(308,y+5,label,10,i===0?C.blue:'#788396',i===0?650:500)})
      out += `${rect(477, 169, 911, 653)}${text(500, 203, 'Profil', 14, C.ink, 700)}${text(500, 224, 'Modifiez les informations de votre espace MarketPulse.', 9, C.muted)}${line(500, 241, 1365)}`
      out += `${circle(525, 284, 23, '#8a9ce0')}${text(525, 288, 'SB', 11, C.white, 700, 'middle')}${text(560, 280, 'Photo de profil', 9, C.ink, 650)}${text(560, 297, 'JPG ou PNG · 2 Mo maximum', 8, C.muted)}${button(1271, 269, 'Modifier', false, 85)}${line(500, 317, 1365)}`
      ;[['Nom complet','Salma Benali'],['Adresse e-mail','salma@marketpulse.ma'],['Nom de l’espace','Équipe Atlas']].forEach((r,i)=>{const y=344+i*91;out+=text(500,y,r[0],9,'#687387',600)+rect(500,y+12,865,36,C.white,6,C.line)+text(512,y+35,r[1],9,C.ink,500)})
      out += line(500, 633, 1365) + button(1165, 655, 'Enregistrer les modifications', true, 200)
      return out
    },
  },
  {
    file: '12-assistant-ia.svg', title: 'Assistant MarketPulse', section: 'Votre analyste de marché', active: 'Assistant MarketPulse',
    subtitle: 'Posez une question et explorez les signaux du marché marocain.',
    render: () => {
      let out = `${rect(284, 169, 1104, 772)}${circle(836, 266, 24, C.paleViolet)}${text(836, 272, '✦', 20, C.violet, 700, 'middle')}${text(836, 315, 'Comment puis-je vous aider ?', 17, C.ink, 700, 'middle')}${text(836, 338, 'Explorez les tendances et opportunités du marché marocain.', 10, C.muted, 400, 'middle')}`
      ;[['Quels sont les produits les plus populaires au Maroc ?',282,371],['Compare les prix des smartphones sur Jumia et Avito.',836,371],['Quelles sont les meilleures opportunités commerciales ?',282,421]].forEach(([label,x,y])=>{out+=`${rect(x,y,530,39,C.white,7,C.line)}${text(x+13,y+24,label,9,'#68748a')}${text(x+508,y+24,'→',12,C.blue,600,'middle')}`})
      out += `${rect(307, 863, 1058, 44, C.white, 8, C.line)}${text(323, 890, 'Posez votre question sur le marché…', 9, C.muted)}${rect(1317, 868, 38, 34, C.blue, 6)}${text(1336, 890, '➤', 13, C.white, 600, 'middle')}${text(836, 925, 'Réponses simulées · données de démonstration', 8, C.muted, 400, 'middle')}`
      return out
    },
  },
]

function authScreen(file, title, subtitle, fields, action, footer, selected) {
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${C.white}"/>`
  out += `${rect(68, 36, 31, 31, C.blue, 9)}${text(84, 57, '↗', 18, C.white, 700, 'middle')}${text(110, 54, 'market', 18, C.ink, 800)}${text(174, 54, 'pulse', 18, C.blue, 800)}${text(110, 67, 'INTELLIGENCE MAROC', 7, C.muted, 700)}`
  out += `${text(92, 281, 'LE RADAR DU MARCHÉ MAROCAIN', 8, '#8d97aa', 700)}${text(92, 326, title, 31, C.ink, 750)}${text(92, 354, subtitle, 10, C.muted)}`
  fields.forEach((field, i) => { const y = 408 + i * 77; out += text(92, y, field, 9, '#5f6b7e', 600) + rect(92, y + 11, 424, 39, C.white, 6, C.line) + text(105, y + 36, field === 'Mot de passe' ? '••••••••••' : field === 'Adresse e-mail' ? 'vous@entreprise.ma' : 'Ex. Salma Benali', 9, '#a2aab6') })
  const actionY = 408 + fields.length * 77 + 3
  out += `${rect(92, actionY, 424, 40, C.blue, 7)}${text(304, actionY+25, action, 10, C.white, 650, 'middle')}${text(304, actionY+87, footer, 9, C.blue, 600, 'middle')}`
  out += `${line(92, 833, 516)}${text(304, 859, 'En continuant, vous acceptez nos Conditions d’utilisation', 8, '#a1a8b4', 400, 'middle')}${text(304, 875, 'et notre Politique de confidentialité.', 8, '#a1a8b4', 400, 'middle')}${text(92, 982, '© 2026 MarketPulse', 8, '#a2aab6')}${text(516, 982, '◇  Vos données restent privées et sécurisées', 8, '#a2aab6', 400, 'end')}`
  out += `${rect(680, 0, 760, 1024, '#172441', 0)}${text(724, 42, '●  Données du marché marocain', 9, '#c0c9dd')}${text(1398, 42, 'Casablanca · Rabat · Marrakech', 9, '#c0c9dd', 400, 'end')}`
  out += `${text(755, 344, 'VOTRE AVANTAGE COMMENCE ICI', 8, '#9fafcf', 700)}${text(755, 411, 'Le bon signal.', 42, C.white, 750)}${text(755, 463, 'Au bon moment.', 42, C.white, 750)}${text(755, 495, 'Transformez les données du marché en décisions plus justes.', 10, '#b6c1d7')}`
  out += `${rect(755, 543, 600, 263, '#ffffff0b', 10, '#ffffff20')}${text(779, 573, 'Indice de demande', 9, '#b6c0d3')}${text(1331, 573, '●  En hausse', 9, '#79d8ad', 600, 'end')}${text(779, 621, '78,4', 28, C.white, 750)}${text(866, 617, '+12,8 %', 9, '#83dcb7', 650)}`
  out += `<path d="M779 727 C820 703 838 730 873 688 S918 709 955 676 S1000 690 1036 652 S1082 672 1118 635 S1163 655 1200 619 S1256 639 1290 599 S1320 609 1331 590" fill="none" stroke="#77a2ff" stroke-width="3"/>`
  ;['Mai','Juin','Juil','Août','Sept','Oct','Nov'].forEach((label,i)=>{out+=text(779+i*88,768,label,7,'#8593ae')})
  out += `${rect(755, 826, 600, 62, '#ffffff0a', 8, '#ffffff19')}${circle(780, 857, 14, '#8b74e82b')}${text(780, 861, '✦', 12, '#b6a7ff', 700, 'middle')}${text(805, 851, 'Nouvelle opportunité détectée', 9, C.white, 650)}${text(805, 868, 'Électronique · croissance de la demande de 18 %', 8, '#a9b5ca')}${text(1332, 861, '↗', 15, C.white, 600, 'end')}${text(724, 985, 'MarketPulse Intelligence', 9, '#c0c9dd')}${text(1398, 985, 'Une lecture plus claire du marché.', 9, '#c0c9dd', 400, 'end')}`
  out += '</svg>'
  return { file, content: out, selected }
}

const authScreens = [
  authScreen('13-connexion.svg', 'Ravi de vous revoir.', 'Connectez-vous pour retrouver vos analyses, vos alertes et vos opportunités.', ['Adresse e-mail', 'Mot de passe'], 'Se connecter  →', 'Pas encore de compte ?  Créer un compte', false),
  authScreen('14-inscription.svg', 'Votre marché. Votre avance.', 'Créez votre espace et prenez une longueur d’avance sur votre marché.', ['Nom complet', 'Adresse e-mail', 'Mot de passe'], 'Créer mon compte  →', 'Déjà un compte ?  Se connecter', false),
  authScreen('15-mot-de-passe-oublie.svg', 'Réinitialisez votre mot de passe.', 'Nous vous enverrons un lien sécurisé pour choisir un nouveau mot de passe.', ['Adresse e-mail'], 'Envoyer le lien  →', '←  Retour à la connexion', false),
]

await mkdir(output, { recursive: true })
for (const screen of screens) {
  await writeFile(path.join(output, screen.file), frame(screen.title, screen.subtitle, screen.section, screen.render(), screen.active), 'utf8')
}
for (const screen of authScreens) {
  await writeFile(path.join(output, screen.file), screen.content, 'utf8')
}
await writeFile(path.join(output, 'README.md'), `# MarketPulse · Maquettes Figma\n\nCe dossier contient 15 écrans vectoriels SVG (1440 × 1024), un fichier par frame, prêts à être importés comme éléments éditables dans Figma.\n\n## Importer dans Figma\n\n1. Décompressez l’archive \`marketpulse-figma.zip\`.\n2. Dans Figma, créez un fichier et glissez-déposez un ou plusieurs SVG sur la page, ou utilisez **File → Place image**.\n3. Les textes, formes, cartes, graphiques et contrôles sont vectoriels et peuvent être réorganisés et recolorés dans Figma.\n4. Les zones de visuels produit des cartes sont des placeholders de maquette. Les données de marché affichées sont fictives.\n\nLes SVG peuvent aussi être modifiés directement dans un éditeur vectoriel. Ils couvrent le tableau de bord, le catalogue, le détail produit, tendances, sentiment, prévisions, opportunités, gestion des données, alertes, rapports, paramètres, assistant IA et les trois écrans d’authentification.\n`, 'utf8')
console.log(`Exported ${screens.length + authScreens.length} editable SVG screens to ${output}`)
