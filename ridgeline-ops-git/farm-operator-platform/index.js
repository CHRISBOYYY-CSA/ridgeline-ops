const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// ---- Simulated in-memory data ----

const machines = [
  { id: 'tractor', name: 'Tractor', icon: 'photo-tractor.png', desc: 'General-purpose ploughing, tilling and haulage.', rentRate: 75000, trainFee: 100000 },
  { id: 'harvester', name: 'Combine Harvester', icon: 'photo-harvester.png', desc: 'Fast, large-scale grain and rice harvesting.', rentRate: 190000, trainFee: 250000 },
  { id: 'plough', name: 'Plough', icon: 'photo-plough.png', desc: 'Tractor-drawn land preparation and turning of soil.', rentRate: 40000, trainFee: 65000 },
  { id: 'sprayer', name: 'Boom Sprayer', icon: 'sprayer.svg', desc: 'Even coverage for fertiliser and pest control.', rentRate: 50000, trainFee: 75000 },
  { id: 'transplanter', name: 'Rice Transplanter', icon: 'transplanter.svg', desc: 'Precision seedling spacing for paddy fields.', rentRate: 85000, trainFee: 130000 },
  { id: 'tiller', name: 'Power Tiller', icon: 'tiller.svg', desc: 'Compact tilling for smaller plots.', rentRate: 28000, trainFee: 45000 },
];

let operators = [
  { id: 1, name: 'Musa Bello', location: 'Kano', machine: 'Tractor', experience: 6, rate: 12000 },
  { id: 2, name: 'Chidinma Okafor', location: 'Enugu', machine: 'Combine Harvester', experience: 4, rate: 25000 },
  { id: 3, name: 'Ibrahim Sule', location: 'Kaduna', machine: 'Boom Sprayer', experience: 3, rate: 8000 },
  { id: 4, name: 'Grace Adeyemi', location: 'Oyo', machine: 'Power Tiller', experience: 5, rate: 6000 },
];

let hireRequests = [];
let trainingSignups = [];
let rentRequests = [];
let nextOperatorId = operators.length + 1;

function findMachine(id) {
  return machines.find((m) => m.id === id);
}

// ---- Routes ----

app.get('/', (req, res) => {
  res.render('index', { machines });
});

app.get('/hire', (req, res) => {
  res.render('hire', { operators, confirmed: req.query.confirmed });
});

app.post('/hire', (req, res) => {
  const { farmerName, location, operatorId } = req.body;
  const operator = operators.find((o) => o.id === parseInt(operatorId, 10));
  hireRequests.push({ farmerName, location, operator: operator ? operator.name : 'Unknown' });
  res.redirect('/hire?confirmed=1');
});

app.get('/register-operator', (req, res) => {
  res.render('register-operator', { machines, confirmed: req.query.confirmed });
});

app.post('/register-operator', (req, res) => {
  const { name, location, machine, experience, rate } = req.body;
  operators.push({
    id: nextOperatorId++,
    name,
    location,
    machine,
    experience: parseInt(experience, 10) || 0,
    rate: parseInt(rate, 10) || 0,
  });
  res.redirect('/register-operator?confirmed=1');
});

app.get('/training', (req, res) => {
  const confirmedFee = req.query.fee ? parseInt(req.query.fee, 10) : null;
  res.render('training', { machines, confirmedFee });
});

app.post('/training', (req, res) => {
  const { name, phone, machine } = req.body;
  const selected = findMachine(machine);
  const fee = selected ? selected.trainFee : 0;
  trainingSignups.push({ name, phone, machine: selected ? selected.name : machine, fee });
  res.redirect(`/training?fee=${fee}`);
});

app.get('/rent', (req, res) => {
  res.render('rent', { machines, confirmed: req.query.confirmed });
});

app.post('/rent', (req, res) => {
  const { farmerName, location, machine, days } = req.body;
  const selected = findMachine(machine);
  rentRequests.push({
    farmerName,
    location,
    machine: selected ? selected.name : machine,
    days: parseInt(days, 10) || 1,
  });
  res.redirect('/rent?confirmed=1');
});

app.get('/how-it-works', (req, res) => {
  res.render('how-it-works');
});

app.listen(PORT, () => {
  console.log(`Ridgeline Ops server running on port ${PORT}`);
});
