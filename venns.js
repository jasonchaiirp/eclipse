// =====================================================================
// ECLIPSE: BACKUP PUZZLES
// The game reads its puzzles from your Google Sheet (see config.js).
// This file is only used if the sheet can't be reached, so the game never breaks.
// =====================================================================

// How many Venns each day.
const VENNS_PER_DAY = 3;

// The Venns, played in order: the first 3 on day 1, the next 3 on day 2, and so on.
// When the list runs out, the game starts again from the top, so keep adding to the end.
//
// Each answer is ["Answer", "Tier"] or ["Answer", "Tier", "Other spellings; separated; by semicolons"].
//   "C" = Common (+10%)   "H" = Good (+25%)   "T" = Rare (+50%)
// Capitals, punctuation, "the/a/an" and simple plurals are matched automatically.
// Each day is 3 Venns in the order Easy, Medium, Hard. Keep to that pattern when adding new days.
// "level" is a note for you; the game plays them in list order.

const VENNS = [
  // ---- Day 1: Easy, Medium, Hard ----
  { a: "Fruit", b: "Colour", level: "Easy", answers: [
    ["Orange", "C"], ["Lemon", "C"], ["Lime", "C"], ["Peach", "C"], ["Cherry", "C"], ["Plum", "H"],
    ["Apricot", "H"], ["Raspberry", "H"], ["Tangerine", "H"], ["Mango", "H"], ["Grape", "H"], ["Melon", "H"],
    ["Blueberry", "H"], ["Cranberry", "H"], ["Watermelon", "H"], ["Strawberry", "H"], ["Banana", "H"], ["Pumpkin", "T"],
    ["Olive", "T"], ["Avocado", "T"], ["Damson", "T"], ["Persimmon", "T"], ["Mulberry", "T"], ["Cantaloupe", "T"],
    ["Coconut", "T"],
  ]},
  { a: "Has teeth", b: "Object", level: "Medium", answers: [
    ["Comb", "C"], ["Saw", "C"], ["Zip", "C", "Zipper"], ["Key", "C"], ["Gear", "H", "Cog"], ["Rake", "H"],
    ["Chainsaw", "H"], ["Bread knife", "H", "Serrated knife"], ["Skull", "H", "Skeleton"], ["Dentures", "H", "False teeth"], ["Hacksaw", "H"], ["Nutcracker", "H"],
    ["Fork", "H"], ["Fossil", "H"], ["Sprocket", "T"], ["Pinking shears", "T"], ["Crocodile clip", "T", "Alligator clip"], ["Bear trap", "T"],
    ["Tape dispenser", "T"], ["Claw clip", "T", "Hair claw"], ["Staple remover", "T"], ["Ratchet", "T"], ["Grater", "T", "Cheese grater"],
  ]},
  { a: "Car make or model", b: "Animal", level: "Hard", answers: [
    ["Jaguar", "C"], ["Mustang", "C"], ["Beetle", "C"], ["Puma", "C"], ["Panda", "H"], ["Viper", "H"],
    ["Impala", "H"], ["Cougar", "H"], ["Stingray", "H"], ["Bronco", "H"], ["Ram", "H"], ["Robin", "H", "Reliant Robin"],
    ["Rabbit", "T"], ["Barracuda", "T"], ["Pony", "T"], ["Tiger", "T", "Sunbeam Tiger"], ["Eagle", "T"], ["Road Runner", "T", "Roadrunner"],
    ["Falcon", "T"], ["Cobra", "T"], ["Stag", "T"], ["Bluebird", "T"], ["Fox", "T"],
  ]},

  // ---- Day 2: Easy, Medium, Hard ----
  { a: "Job", b: "Surname", level: "Easy", answers: [
    ["Smith", "C"], ["Baker", "C"], ["Butcher", "C"], ["Taylor", "C", "Tailor"], ["Farmer", "C"], ["Carpenter", "H"],
    ["Cooper", "H"], ["Fisher", "H", "Fisherman"], ["Mason", "H"], ["Potter", "H"], ["Miller", "H"], ["Hunter", "H"],
    ["Gardner", "H", "Gardener"], ["Porter", "H"], ["Archer", "H"], ["Shepherd", "H"], ["Barber", "H"], ["Turner", "H"],
    ["Thatcher", "T"], ["Weaver", "T"], ["Fletcher", "T"], ["Chandler", "T"], ["Clark", "T", "Clerk"], ["Wright", "T"],
    ["Tanner", "T"], ["Cartwright", "T"], ["Sawyer", "T"],
  ]},
  { a: "Has wings", b: "Can't fly", level: "Medium", answers: [
    ["Penguin", "C"], ["Ostrich", "C"], ["Emu", "C"], ["Chicken wing", "C", "Buffalo wings;Hot wings"], ["Kiwi", "H"], ["Dodo", "H"],
    ["Chicken", "H"], ["Turkey", "H"], ["Hospital", "H"], ["Theatre", "H", "Theater;Stage"], ["Political party", "H", "Left wing;Right wing"], ["Wingback chair", "H", "Armchair"],
    ["Car", "H"], ["Stately home", "H", "Mansion;House"], ["Building", "H"], ["Kakapo", "T"], ["Cassowary", "T"], ["Rhea", "T"],
    ["Takahe", "T"], ["Weka", "T"], ["Great auk", "T", "Auk"], ["Nose", "T"], ["Winger", "T"], ["Steamer duck", "T"],
  ]},
  { a: "Dog breed", b: "Named after a place", level: "Hard", answers: [
    ["Labrador", "C"], ["Dalmatian", "C"], ["Chihuahua", "C"], ["Yorkshire Terrier", "C", "Yorkie"], ["Pomeranian", "H"], ["Maltese", "H"],
    ["Great Dane", "H", "Dane"], ["Afghan Hound", "H", "Afghan"], ["Rottweiler", "H"], ["Newfoundland", "H"], ["Saint Bernard", "H", "St Bernard"], ["Pekingese", "H"],
    ["Boston Terrier", "H"], ["Border Terrier", "H"], ["Weimaraner", "T"], ["Airedale Terrier", "T", "Airedale"], ["Leonberger", "T"], ["Bedlington Terrier", "T", "Bedlington"],
    ["Akita", "T"], ["Havanese", "T"], ["Bernese Mountain Dog", "T", "Bernese"], ["Norfolk Terrier", "T"], ["Skye Terrier", "T"], ["Shetland Sheepdog", "T", "Sheltie"],
  ]},

  // ---- Day 3: Easy, Medium, Hard ----
  { a: "Animal", b: "Has stripes", level: "Easy", answers: [
    ["Zebra", "C"], ["Tiger", "C", "Bengal tiger;Siberian tiger"], ["Bee", "C", "Bumblebee;Honeybee;Bumble bee"], ["Wasp", "C"], ["Skunk", "H"], ["Badger", "H"],
    ["Raccoon", "H", "Racoon"], ["Chipmunk", "H"], ["Clownfish", "H", "Clown fish"], ["Tabby cat", "H", "Tabby"], ["Hornet", "H"], ["Okapi", "T"],
    ["Numbat", "T"], ["Bongo", "T"], ["Thylacine", "T", "Tasmanian tiger"], ["Zebra finch", "T"], ["Striped hyena", "T"], ["Ring-tailed lemur", "T", "Lemur"],
    ["Mackerel", "T"], ["Garter snake", "T"], ["Coral snake", "T"],
  ]},
  { a: "Has keys", b: "Not a door", level: "Medium", answers: [
    ["Piano", "C"], ["Keyboard", "C"], ["Laptop", "C", "Computer"], ["Map", "C"], ["Typewriter", "H"], ["Calculator", "H"],
    ["Accordion", "H"], ["Organ", "H"], ["Synthesiser", "H", "Synth;Synthesizer"], ["Florida", "H", "Florida Keys"], ["Janitor", "H", "Caretaker"], ["Prison guard", "H", "Jailer;Warder"],
    ["Cash register", "H", "Till"], ["Harpsichord", "T"], ["Flute", "T"], ["Clarinet", "T"], ["Saxophone", "T", "Sax"], ["Oboe", "T"],
    ["Bassoon", "T"], ["Cipher", "T", "Code"],
  ]},
  { a: "Country", b: "Has a cross on its flag", level: "Hard", answers: [
    ["Switzerland", "C"], ["United Kingdom", "C", "UK;Britain;Great Britain"], ["Denmark", "C"], ["Sweden", "C"], ["Norway", "C"], ["Finland", "H"],
    ["Iceland", "H"], ["Greece", "H"], ["Australia", "H"], ["New Zealand", "H"], ["Jamaica", "H"], ["Georgia", "H"],
    ["England", "H"], ["Scotland", "H"], ["Fiji", "T"], ["Tuvalu", "T"], ["Tonga", "T"], ["Dominican Republic", "T"],
    ["Dominica", "T"], ["Burundi", "T"], ["Malta", "T"],
  ]},

  // ---- Day 4: Easy, Medium, Hard ----
  { a: "Tree", b: "Girl's name", level: "Easy", answers: [
    ["Holly", "C"], ["Hazel", "C"], ["Willow", "C"], ["Olive", "C"], ["Rowan", "H"], ["Laurel", "H"],
    ["Aspen", "H"], ["Cherry", "H"], ["Maple", "H"], ["Magnolia", "H"], ["Juniper", "H"], ["Myrtle", "T"],
    ["Acacia", "T"], ["Linden", "T"], ["Sequoia", "T"], ["Clementine", "T"], ["Lilac", "T"],
  ]},
  { a: "Has a shell", b: "Found in a kitchen", level: "Medium", answers: [
    ["Egg", "C"], ["Nut", "C"], ["Taco", "C", "Taco shell"], ["Prawn", "C", "Shrimp"], ["Pistachio", "H"], ["Peanut", "H"],
    ["Walnut", "H"], ["Coconut", "H"], ["Almond", "H"], ["Crab", "H"], ["Lobster", "H"], ["Mussel", "H"],
    ["Oyster", "H"], ["Clam", "H"], ["Hazelnut", "H"], ["Pecan", "H"], ["Scallop", "T"], ["Snail", "T", "Escargot"],
    ["Pie crust", "T", "Pie shell;Tart case"], ["Pasta shells", "T", "Conchiglie"], ["Brazil nut", "T"], ["Vol-au-vent", "T"],
  ]},
  { a: "Food or drink", b: "Named after a place", level: "Hard", answers: [
    ["Hamburger", "C", "Burger"], ["Cheddar", "C"], ["Champagne", "C"], ["Frankfurter", "C"], ["Parmesan", "H"], ["Dijon mustard", "H", "Dijon"],
    ["Brie", "H"], ["Camembert", "H"], ["Bolognese", "H"], ["Stilton", "H"], ["Tequila", "H"], ["Brussels sprout", "H", "Brussels sprouts"],
    ["Cornish pasty", "H"], ["Peking duck", "H"], ["Bakewell tart", "H"], ["Eccles cake", "T"], ["Wensleydale", "T"], ["Chelsea bun", "T"],
    ["Tabasco", "T"], ["Jaffa Cake", "T"], ["Worcestershire sauce", "T"], ["Gorgonzola", "T"], ["Port", "T"], ["Cognac", "T"],
    ["Bourbon", "T"], ["Buffalo wings", "T"],
  ]},

  // ---- Day 5: Easy, Medium, Hard ----
  { a: "Food", b: "Yellow", level: "Easy", answers: [
    ["Banana", "C"], ["Lemon", "C"], ["Cheese", "C"], ["Sweetcorn", "C", "Corn;Corn on the cob"], ["Butter", "C"], ["Custard", "H"],
    ["Pineapple", "H"], ["Mustard", "H"], ["Egg yolk", "H", "Yolk;Egg"], ["Yellow pepper", "H", "Pepper"], ["Popcorn", "H"], ["Grapefruit", "H"],
    ["Lemon curd", "T"], ["Saffron", "T"], ["Turmeric", "T"], ["Starfruit", "T", "Star fruit;Carambola"], ["Quince", "T"], ["Polenta", "T"],
    ["Piccalilli", "T"], ["Durian", "T"],
  ]},
  { a: "Has rings", b: "Not a planet", level: "Medium", answers: [
    ["Tree", "C"], ["Onion", "C"], ["Olympics", "C", "Olympic flag"], ["Phone", "C"], ["Boxing", "H"], ["Circus", "H"],
    ["Doughnut", "H", "Donut"], ["Bell", "H", "Doorbell"], ["Hob", "H", "Cooker"], ["Keyring", "H"], ["Ring binder", "H"], ["Pineapple", "H"],
    ["Target", "H", "Dartboard"], ["Wedding", "H"], ["Calamari", "T", "Squid"], ["Bathtub", "T"], ["Wrestling", "T"], ["Gymnastics", "T"],
    ["Coffee table", "T"], ["Tired eyes", "T", "Dark circles"],
  ]},
  { a: "Colour", b: "Named after a place", level: "Hard", answers: [
    ["Burgundy", "C"], ["Champagne", "C"], ["Magenta", "C"], ["Indigo", "C"], ["Sienna", "H"], ["Turquoise", "H"],
    ["Prussian blue", "H"], ["Oxford blue", "H"], ["Cambridge blue", "H"], ["Bordeaux", "H"], ["Persian blue", "H"], ["Aegean blue", "H", "Aegean"],
    ["Chartreuse", "T"], ["Lincoln green", "T"], ["Naples yellow", "T"], ["Venetian red", "T"], ["Havana", "T", "Havana brown"], ["Capri blue", "T"],
    ["Tyrian purple", "T"], ["Paris green", "T"],
  ]},

  // ---- Day 6: Easy, Medium, Hard ----
  { a: "Gemstone", b: "Colour", level: "Easy", answers: [
    ["Ruby", "C"], ["Emerald", "C"], ["Sapphire", "C"], ["Amber", "C"], ["Jade", "H"], ["Amethyst", "H"],
    ["Turquoise", "H"], ["Pearl", "H"], ["Coral", "H"], ["Topaz", "H"], ["Opal", "H"], ["Aquamarine", "H"],
    ["Garnet", "T"], ["Onyx", "T"], ["Jet", "T"], ["Citrine", "T"], ["Peridot", "T"], ["Lapis lazuli", "T", "Lapis"],
    ["Rose quartz", "T"],
  ]},
  { a: "Has a tail", b: "Not an animal", level: "Medium", answers: [
    ["Kite", "C"], ["Plane", "C", "Aeroplane;Airplane"], ["Comet", "C"], ["Coin", "C"], ["Tailcoat", "H", "Tails"], ["Ponytail", "H"],
    ["Pigtail", "H"], ["Helicopter", "H"], ["Shirt", "H", "Shirt-tail"], ["Mermaid", "H"], ["Dragon", "H"], ["Queue", "H", "Traffic jam"],
    ["Letter Q", "T", "Q"], ["Oxtail", "T", "Oxtail soup"], ["Horsetail", "T"], ["Cattail", "T", "Bulrush"], ["Foxtail", "T"],
  ]},
  { a: "Fabric", b: "Named after a place", level: "Hard", answers: [
    ["Denim", "C"], ["Jersey", "C"], ["Cashmere", "C"], ["Tweed", "C"], ["Muslin", "H"], ["Calico", "H"],
    ["Damask", "H"], ["Paisley", "H"], ["Madras", "H"], ["Angora", "H"], ["Jeans", "H"], ["Duffel", "H", "Duffle"],
    ["Gauze", "T"], ["Cambric", "T"], ["Tulle", "T"], ["Worsted", "T"], ["Chambray", "T"], ["Shantung", "T"],
    ["Satin", "T"], ["Lawn", "T"], ["Nankeen", "T"],
  ]},

  // ---- Day 7: Easy, Medium, Hard ----
  { a: "Board game", b: "Everyday word", level: "Easy", answers: [
    ["Monopoly", "C"], ["Risk", "C"], ["Trouble", "C"], ["Operation", "C"], ["Twister", "C"], ["Sorry", "H", "Sorry!"],
    ["Life", "H", "Game of Life"], ["Scrabble", "H"], ["Battleship", "H", "Battleships"], ["Mousetrap", "H", "Mouse Trap"], ["Taboo", "H"], ["Boggle", "H"],
    ["Draughts", "H", "Checkers"], ["Go", "T"], ["Frustration", "T"], ["Articulate", "T"], ["Downfall", "T"], ["Mastermind", "T"],
    ["Diplomacy", "T"], ["Pandemic", "T"], ["Scythe", "T"],
  ]},
  { a: "Bird", b: "Surname", level: "Medium", answers: [
    ["Swan", "C"], ["Robin", "C", "Robbins"], ["Martin", "C"], ["Drake", "C"], ["Bird", "C"], ["Finch", "H"],
    ["Sparrow", "H"], ["Crane", "H"], ["Swift", "H"], ["Nightingale", "H"], ["Wren", "H"], ["Hawk", "H", "Hawke;Hawkes"],
    ["Peacock", "H"], ["Dove", "H"], ["Jay", "H"], ["Partridge", "T"], ["Starling", "T"], ["Bunting", "T"],
    ["Heron", "T"], ["Woodcock", "T"], ["Raven", "T"],
  ]},
  { a: "Chemical element", b: "Named after a place", level: "Hard", answers: [
    ["Americium", "C"], ["Germanium", "C"], ["Francium", "C"], ["Polonium", "C"], ["Europium", "C"], ["Californium", "H"],
    ["Scandium", "H"], ["Gallium", "H"], ["Magnesium", "H"], ["Berkelium", "H"], ["Copper", "H"], ["Ruthenium", "H"],
    ["Moscovium", "H"], ["Nihonium", "H"], ["Strontium", "T"], ["Ytterbium", "T"], ["Yttrium", "T"], ["Terbium", "T"],
    ["Erbium", "T"], ["Hafnium", "T"], ["Holmium", "T"], ["Lutetium", "T"], ["Rhenium", "T"], ["Darmstadtium", "T"],
    ["Hassium", "T"], ["Dubnium", "T"], ["Tennessine", "T"],
  ]},
];

// Spare Venns, not played yet. Move one into VENNS when you add a new day.
// Note: Shakespeare ∩ Moon of Uranus is very hard; best saved for a themed special.
const SPARE_VENNS = [
  { a: "Colour", b: "Animal", level: "Medium", answers: [
    ["Salmon", "C"], ["Canary", "C", "Canary yellow"], ["Flamingo", "C", "Flamingo pink"], ["Coral", "C"], ["Camel", "H"], ["Fawn", "H"],
    ["Mink", "H"], ["Peacock", "H", "Peacock blue"], ["Raven", "H", "Raven black"], ["Dove", "H", "Dove grey"], ["Mouse", "H", "Mouse grey"], ["Elephant", "H", "Elephant grey"],
    ["Cardinal", "T", "Cardinal red"], ["Sable", "T"], ["Ermine", "T"], ["Oyster", "T"], ["Seal", "T", "Seal brown"],
  ]},
  { a: "Has a crown", b: "Not royalty", level: "Medium", answers: [
    ["Tooth", "C"], ["Tree", "C"], ["Hat", "C"], ["Pineapple", "C"], ["Head", "C"], ["Watch", "H"],
    ["Bottle cap", "H", "Crown cap"], ["Burger King", "H"], ["Statue of Liberty", "H"], ["Anchor", "H"], ["Beauty queen", "H", "Pageant winner"], ["Rolex", "H"],
    ["Bowling green", "T", "Crown green"], ["Crown-of-thorns starfish", "T"], ["Crowned crane", "T"], ["Corona", "T"], ["Crown Paints", "T"],
  ]},
  { a: "Brand or product", b: "Found in space", level: "Medium", answers: [
    ["Mars", "C"], ["Galaxy", "C", "Samsung Galaxy"], ["Milky Way", "C"], ["Starburst", "C"], ["Orbit", "H"], ["Eclipse", "H"],
    ["The Sun", "H", "Sun"], ["Mercury", "H", "Mercury Prize"], ["Sky", "H"], ["Venus", "H"], ["Comet", "H"], ["Moon Pie", "H"],
    ["Starbar", "T"], ["Subaru", "T"], ["Polaris", "T"], ["Sirius", "T", "SiriusXM"], ["Saturn", "T"], ["Pluto", "T", "Pluto TV"],
  ]},
  { a: "Shakespeare character", b: "Moon of Uranus", level: "Hard", answers: [
    ["Juliet", "C"], ["Ophelia", "C"], ["Miranda", "C"], ["Puck", "C"], ["Oberon", "C"], ["Titania", "H"],
    ["Portia", "H"], ["Desdemona", "H"], ["Cordelia", "H"], ["Ariel", "H"], ["Prospero", "H"], ["Caliban", "H"],
    ["Rosalind", "H"], ["Bianca", "T"], ["Cressida", "T"], ["Perdita", "T"], ["Cupid", "T"], ["Stephano", "T"],
    ["Trinculo", "T"], ["Francisco", "T"], ["Ferdinand", "T"], ["Margaret", "T"], ["Sycorax", "T"],
  ]},
];
