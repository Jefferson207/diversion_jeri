const rawProducts = [
  [4,'3018',2200,'Kiddie Ride Mini Flor','Kiddie Ride'],[4,'2111',2300,'Safari Musical','Kiddie Ride'],
  [5,'2306',1900,'Kiddie Adventure','Kiddie Ride'],[5,'2395',2700,'Kiddie Premium','Kiddie Ride'],
  [6,'2189',2200,'Mini Ride Classic','Kiddie Ride'],[6,'2362',2500,'Kiddie Fantasía','Kiddie Ride'],
  [7,'2463',2400,'Kiddie LED','Kiddie Ride'],[7,'3106',2000,'Mini Ride Compacto','Kiddie Ride'],
  [8,'2401',2400,'Kiddie Interactivo','Kiddie Ride'],[8,'3095',2700,'Moto Simulador Kids','Simuladores'],
  [9,'2457',2500,'Avión Aventurero','Kiddie Ride'],[9,'2467',2400,'Avión Mini Ride','Kiddie Ride'],
  [10,'6087',4700,'Bee Carousel','Kiddie Ride'],[10,'3069',1800,'Kiddie Compact','Kiddie Ride'],
  [11,'3117',2700,'Moto Futuristic Police','Simuladores'],[11,'2425',2500,'Kiddie Moto LED','Kiddie Ride'],
  [12,'2485',2100,'Kiddie Color','Kiddie Ride'],[12,'2452',2400,'Kiddie Music','Kiddie Ride'],
  [13,'6253C',4200,'SunFlowers Basketball','Basket'],[13,'6245',5000,'Space Carousel','Kiddie Ride'],
  [14,'6089',4300,'Tren Carrusel','Kiddie Ride'],[14,'6088',3500,'Bee Carrusel','Kiddie Ride'],
  [15,'6240',7200,'Carrusel Familiar','Kiddie Ride'],[15,'2514',1800,'Mini Ride Musical','Kiddie Ride'],
  [16,'6204-A',4400,'Kiddie Doble A','Kiddie Ride'],[16,'6204-B',4400,'Kiddie Doble B','Kiddie Ride'],
  [17,'CAT-17A',2500,'Kiddie Comercial','Kiddie Ride'],[17,'6043',3400,'Kiddie Deluxe','Kiddie Ride'],
  [18,'681',8800,'Carrusel Gran Formato','Kiddie Ride','p18-2.png'],[18,'2523',2400,'Kiddie Compact LED','Kiddie Ride','p18-1.png'],
  [19,'623',4100,'Kiddie Premium LED','Kiddie Ride'],[19,'6022',3200,'Kiddie Ride Plus','Kiddie Ride'],
  [20,'6207',2600,'Kiddie Mini Plus','Kiddie Ride'],[20,'2524',2500,'Kiddie Ride Pro','Kiddie Ride'],
  [21,'3055',2000,'Kiddie Inicio','Kiddie Ride'],[21,'6015',4400,'Kiddie Family','Kiddie Ride'],
  [22,'632',7100,'Kiddie Gran Aventura','Kiddie Ride'],[22,'2477',1800,'Mini Ride Económico','Kiddie Ride'],
  [23,'2478',1800,'Mini Ride Comercial','Kiddie Ride'],[23,'0020',7200,'Simulador Infantil','Simuladores'],
  [24,'2587',2400,'Kiddie New Generation','Kiddie Ride'],[24,'0045',2500,'Arcade Infantil','Arcade'],
  [25,'0046',4500,'Disparo Cyber','Disparo'],[25,'0018',32000,'Simulador VR Racing','Simuladores'],
  [26,'0023',8800,'Basket Arcade Pro','Basket'],[26,'0027',8200,'Máquina de Premios Box','Premio'],
  [27,'0026',14000,'Carrera Doble','Carrera'],[27,'CAT-27B',2700,'Arcade Space X','Arcade'],
  [28,'CAT-28A',11000,'High Striker Man','Premio'],[28,'CAT-28B',12000,'Boxing Challenge','Premio'],
  [29,'CAT-29A',13500,'Moto Racing Pro','Carrera'],[29,'CAT-29B',5800,'Disparo Duck Duo','Disparo'],
  [30,'CAT-30A',16000,'Disparo Zombie Duo','Disparo'],[30,'CAT-30B',10000,'Air Hockey Neon','Arcade'],
  [31,'CAT-31A',2800,'Alien Strike','Disparo'],[31,'CAT-31B',2800,'Arctic Shooter','Disparo'],
  [32,'CAT-32A',5700,'Disparo Wild West','Disparo'],
]

const pageCounts = new Map()
export const products = rawProducts.map(([page, code, price, name, category, customImage], index) => {
  const count = (pageCounts.get(page) || 0) + 1
  pageCounts.set(page, count)
  return { id: `${page}-${count}`, code, price, name, category,
    image: `/catalog/${customImage || `p${String(page).padStart(2, '0')}-${count}.png`}`,
    popularity: 100 - index + (index % 7) * 8 }
})

export const categories = ['Todos','Kiddie Ride','Simuladores','Basket','Premio','Arcade','Carrera','Disparo']
export const money = value => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(value)
export const whatsappUrl = message => `https://wa.me/51946562627?text=${encodeURIComponent(message)}`
