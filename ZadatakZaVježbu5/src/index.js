import express from 'express'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const PORT = 3005

import { connectToDatabase } from './db/mongo.js'
let db = await connectToDatabase()

//znam da pizze imaju iste slike, neke su bile broken od prije pa sam samo copy paste ( nije bitno )
app.put('/reset', async (req, res) => {
    let pizze_collection = db.collection('wa-test')
    const pizzas = [
        {
          naziv: 'Margherita',
          slika_url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
          sastojci: ['rajčica', 'sir', 'bosiljak'],
          cijene: { mala: 6.5, srednja: 8.5, jumbo: 10.5 },
        },
        {
          naziv: 'Napolitana',
          slika_url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
          sastojci: ['rajčica', 'sir', 'crveni luk', 'anchovy'],
          cijene: { mala: 7.0, srednja: 9.0, jumbo: 11.0 },
        },
        {
          naziv: 'Funghi',
          slika_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
          sastojci: ['rajčica', 'sir', 'gljive'],
          cijene: { mala: 7.5, srednja: 9.5, jumbo: 11.5 },
        },
        {
          naziv: 'Capricciosa',
          slika_url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
          sastojci: ['rajčica', 'sir', 'šunka', 'gljive', 'jaja'],
          cijene: { mala: 8.0, srednja: 10.0, jumbo: 12.0 },
        },
        {
          naziv: 'Quattro Stagioni',
          slika_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
          sastojci: ['rajčica', 'sir', 'šunka', 'gljive', 'anchovy'],
          cijene: { mala: 8.5, srednja: 10.5, jumbo: 12.5 },
        },
    ]
        //PRVO SVE OBRIŠI
        pizze_collection.deleteMany({});

        pizze_collection.insertMany(pizzas)
        .then((result) => {
          console.log(`${result.insertedCount} pizza je dodano`)
        })
        .catch((err) => {
          console.error(err)
        })
    
    res.status(200).send("Uspješan reset pizza.");
})

// indeks na naziv za brže pretražživanje
// await db.collection('wa-test').createIndex({ naziv: 1 })

// GET /pizze - filtriranje, pretraživanje i sortiranje
app.get('/pizze', async (req, res) => {
  let pizze_collection = db.collection('wa-test')

  // Dohvati query parametre ako postoje
  const naziv = req.query.naziv
  const cijena_min = req.query.cijena_min ? Number(req.query.cijena_min) : null
  const cijena_max = req.query.cijena_max ? Number(req.query.cijena_max) : null
  const sort = req.query.sort // asc ili desc

  try {
    let filter = {}
    if (naziv) {
      filter.naziv = { $regex: naziv, $options: 'i' } // i = case sensitive
    }
    let pizze = await pizze_collection.find(filter).toArray()

    if (cijena_min !== null || cijena_max !== null) {
      pizze = pizze.filter((pizza) => {
        const minCijenaZaPizzu = Math.min(
          pizza.cijene.mala,
          pizza.cijene.srednja,
          pizza.cijene.jumbo,
        )

        if (cijena_min !== null && minCijenaZaPizzu < cijena_min) return false
        if (cijena_max !== null && minCijenaZaPizzu > cijena_max) return false
        return true
      })
    }

    if (sort) {
      pizze.sort((a, b) => {
        const minA = Math.min(a.cijene.mala, a.cijene.srednja, a.cijene.jumbo)
        const minB = Math.min(b.cijene.mala, b.cijene.srednja, b.cijene.jumbo)

        if (sort === 'asc') {
          return minA - minB 
        } else if (sort === 'desc') {
          return minB - minA 
        }
      })
    }

    res.status(200).json(pizze)
  } catch (error) {
    console.log('Greška pri dohvaćanju pizza:', error)
    res.status(400).json({ error: error.message })
  }
})

// POST /pizze -> push nova pizza
app.post('/pizze', async (req, res) => {
  let pizze_collection = db.collection('wa-test')
    let novaPizza = req.body
    
  const obaveznKljucevi = ['naziv', 'slika_url', 'sastojci', 'cijene']
  if (!obaveznKljucevi.every((kljuc) => kljuc in novaPizza)) {
    return res.status(400).json({
      error: 'Nedostaju obavezni ključevi. Treba poslati: naziv, slika_url, sastojci, cijene',
    })
  }

  
  if (typeof novaPizza.naziv !== 'string' || novaPizza.naziv.trim() === '') {
    return res.status(400).json({
      error: 'Naziv mora biti neprazan string',
    })
  }

  
  if (typeof novaPizza.slika_url !== 'string' || novaPizza.slika_url.trim() === '') {
    return res.status(400).json({
      error: 'slika_url mora biti neprazan string',
    })
  }

  if (!Array.isArray(novaPizza.sastojci)) {
    return res.status(400).json({
      error: 'Sastojci moraju biti niz',
    })
  }

  
  if (!novaPizza.sastojci.every((s) => typeof s === 'string')) {
    return res.status(400).json({
      error: 'Svaki sastojak mora biti string',
    })
  }

  if (typeof novaPizza.cijene !== 'object' || !novaPizza.cijene) {
    return res.status(400).json({
      error: 'Cijene moraju biti objekt sa poljima: mala, srednja, jumbo',
    })
  }

  if (
    !('mala' in novaPizza.cijene) ||
    !('srednja' in novaPizza.cijene) ||
    !('jumbo' in novaPizza.cijene)
  ) {
    return res.status(400).json({
      error: 'Cijene moraju sadržavati: mala, srednja, jumbo',
    })
  }

  if (
    typeof novaPizza.cijene.mala !== 'number' ||
    typeof novaPizza.cijene.srednja !== 'number' ||
    typeof novaPizza.cijene.jumbo !== 'number'
  ) {
    return res.status(400).json({
      error: 'Sve cijene moraju biti brojevi',
    })
  }

  try {
    let result = await pizze_collection.insertOne(novaPizza)
    res.status(201).json({
      message: 'Uspješno dodana nova pizza',
      insertedId: result.insertedId,
    })
  } catch (error) {
    res.status(400).json({ error: 'Greška pri dodavanju pizze' })
  }
})

// -> POST /narudzba 
app.post('/narudzba', async (req, res) => {
  const novaNarudzba = req.body
  let narudzbe_collection = db.collection('narudzbe')

  // obavezni ključevi
  const obaveznKljucevi = ['ime', 'adresa', 'telefon', 'narucene_pizze']

  if (!obaveznKljucevi.every((kljuc) => kljuc in novaNarudzba)) {
    return res.status(400).json({
      error: `Nedostaju obavezni ključevi. Trebam: ${obaveznKljucevi.join(', ')}`,
    })
  }

  // tip telefona - mora biti string ili broj
  if (typeof novaNarudzba.telefon !== 'string' && typeof novaNarudzba.telefon !== 'number') {
    return res.status(400).json({
      error: 'Telefon mora biti broj ili string sa brojevima',
    })
  }

  //  'narucene_pizze' je niz
  if (!Array.isArray(novaNarudzba.narucene_pizze)) {
    return res.status(400).json({
      error: 'narucene_pizze mora biti niz',
    })
  }

  if (novaNarudzba.narucene_pizze.length === 0) {
    return res.status(400).json({
      error: 'Narudžba mora sadržavati najmanje jednu pizzu',
    })
  }

  // provjeri svaku stavku u nizu
  const obaveznKljuceviStavke = ['naziv', 'kolicina', 'velicina']
  for (let stavka of novaNarudzba.narucene_pizze) {
    if (!obaveznKljuceviStavke.every((kljuc) => kljuc in stavka)) {
      return res.status(400).json({
        error: `Svaka stavka mora imati: ${obaveznKljuceviStavke.join(', ')}`,
      })
    }
  }

  try {
    // calc cijene
    let ukupnaCijena = 0
    let pizze_collection = db.collection('wa-test')

    for (let stavka of novaNarudzba.narucene_pizze) {
      const pizza = await pizze_collection.findOne({ naziv: stavka.naziv })

      if (!pizza) {
        return res.status(400).json({
          error: `Pizza "${stavka.naziv}" nije pronađena `,
        })
      }
      const cijena = pizza.cijene[stavka.velicina]

      if (!cijena) {
        return res.status(400).json({
          error: `Veličina "${stavka.velicina}" nije dostupna za pizzu "${stavka.naziv}"`,
        })
      }

      ukupnaCijena += cijena * stavka.kolicina
    }

    novaNarudzba.ukupna_cijena = ukupnaCijena
    novaNarudzba.datumNarudzbe = new Date()

    let result = await narudzbe_collection.insertOne(novaNarudzba)
    res.status(201).json({
      message: 'Narudžba uspješno primljena',
      insertedId: result.insertedId,
      ukupna_cijena: ukupnaCijena,
    })
  } catch (error) {
    console.log('Greška pri dodavanju narudžbe:', error)
    res.status(400).json({ error: 'Greška pri dodavanju narudžbe' })
  }
})


app.listen(PORT, (error) => {
  if (error) {
    console.log('Greška prilikom pokretanja servera: ', error)
  } else {
    console.log(`Server je pokrenuo na portu ${PORT}`)
  }
})
