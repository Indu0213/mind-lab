// Science content used to build the card decks.
// Each category has 15 elements so the hardest grid (15 pairs) is always filled.
// Every element has a Lucide icon (shown on the card), a name, and a short fact
// shown in the popup once the pair is matched.

import {
  Dna, Brain, HeartPulse, Bone, Microscope, Bug, Eye, Leaf, Sprout, Egg, Fish, Feather, Stethoscope, Syringe, TreeDeciduous,
  Atom, Magnet, Zap, Lightbulb, Rainbow, Battery, Thermometer, Cog, Timer, Volume2, Scale, RadioTower, Plug, Apple, Waves,
  TestTube, FlaskConical, Droplet, Flame, Gem, Snowflake, Citrus, Radiation, Beaker, Pipette, Fuel, Coins, Hexagon, Cylinder, Droplets,
  Orbit, Rocket, Satellite, SatelliteDish, Telescope, Moon, Sun, Earth, Star, Sparkles, Aperture, Navigation, Cloud, Disc, MoonStar,
} from 'lucide-react'

export const CATEGORIES = [
  { id: 'biology', code: 'BIO', name: 'Biology', tagline: 'Cells, organs & living things', icon: Dna, color: '#059669', colorSoft: '#ecfdf5' },
  { id: 'physics', code: 'PHY', name: 'Physics', tagline: 'Forces, energy & matter', icon: Atom, color: '#2563eb', colorSoft: '#eff6ff' },
  { id: 'chemistry', code: 'CHM', name: 'Chemistry', tagline: 'Elements, reactions & compounds', icon: FlaskConical, color: '#d97706', colorSoft: '#fffbeb' },
  { id: 'space', code: 'SPC', name: 'Space', tagline: 'Planets, stars & the cosmos', icon: Orbit, color: '#7c3aed', colorSoft: '#f5f3ff' },
]

export const ELEMENTS = {
  biology: [
    { id: 'dna', name: 'DNA', icon: Dna, fact: 'DNA stores the genetic instructions for every living thing. Stretched out, the DNA in one human body would reach the Sun and back many times.' },
    { id: 'brain', name: 'Brain', icon: Brain, fact: 'The human brain has about 86 billion neurons and uses roughly 20% of the body\'s energy, even though it is only 2% of its weight.' },
    { id: 'heart', name: 'Heart', icon: HeartPulse, fact: 'The heart beats about 100,000 times a day, pumping roughly 7,500 litres of blood through the body.' },
    { id: 'bone', name: 'Bone', icon: Bone, fact: 'Babies are born with about 300 bones. Many fuse together as they grow, leaving adults with 206.' },
    { id: 'microscope', name: 'Microscope', icon: Microscope, fact: 'Using a microscope in 1665, Robert Hooke saw tiny box-like structures in cork and named them "cells".' },
    { id: 'insect', name: 'Insect', icon: Bug, fact: 'Insects are the most diverse group of animals. Over a million species are known, and they all have six legs and three body parts.' },
    { id: 'eye', name: 'Eye', icon: Eye, fact: 'The human eye can distinguish around 10 million different colours and focuses using a flexible lens.' },
    { id: 'leaf', name: 'Leaf', icon: Leaf, fact: 'Leaves perform photosynthesis, turning sunlight, water and carbon dioxide into sugar and the oxygen we breathe.' },
    { id: 'seedling', name: 'Seedling', icon: Sprout, fact: 'A seed can stay dormant for years. Once water and warmth arrive, it germinates and grows its first root and shoot.' },
    { id: 'egg', name: 'Egg', icon: Egg, fact: 'An ostrich egg is the largest single cell you can see with the naked eye. Its shell is strong enough to hold an adult\'s weight.' },
    { id: 'fish', name: 'Fish', icon: Fish, fact: 'Fish breathe by passing water over their gills, which pull dissolved oxygen out of the water.' },
    { id: 'feather', name: 'Feather', icon: Feather, fact: 'Feathers are made of keratin, the same protein as your hair and nails. Birds are the only living animals that have them.' },
    { id: 'stethoscope', name: 'Stethoscope', icon: Stethoscope, fact: 'The stethoscope was invented in 1816 by René Laennec, who first used a rolled-up paper tube to listen to a patient\'s chest.' },
    { id: 'vaccine', name: 'Vaccine', icon: Syringe, fact: 'Vaccines train the immune system to recognise a germ before infection. Edward Jenner created the first one, against smallpox, in 1796.' },
    { id: 'tree', name: 'Tree', icon: TreeDeciduous, fact: 'A single mature tree can absorb about 22 kg of carbon dioxide a year. Tree rings record one year of growth each.' },
  ],
  physics: [
    { id: 'atom', name: 'Atom', icon: Atom, fact: 'An atom is the smallest unit of an element. It has a tiny dense nucleus of protons and neutrons, surrounded by electrons.' },
    { id: 'magnet', name: 'Magnet', icon: Magnet, fact: 'Every magnet has a north and a south pole. Cut one in half and you get two smaller magnets, each with both poles.' },
    { id: 'lightning', name: 'Lightning', icon: Zap, fact: 'A lightning bolt can heat the air around it to about 30,000 °C, five times hotter than the surface of the Sun.' },
    { id: 'bulb', name: 'Light Bulb', icon: Lightbulb, fact: 'An incandescent bulb glows because electric current heats a thin filament until it emits light. Most of its energy is lost as heat.' },
    { id: 'rainbow', name: 'Rainbow', icon: Rainbow, fact: 'A rainbow forms when sunlight is refracted, reflected and dispersed inside raindrops, splitting white light into its colours.' },
    { id: 'battery', name: 'Battery', icon: Battery, fact: 'A battery converts stored chemical energy into electrical energy. The first true battery was built by Alessandro Volta in 1800.' },
    { id: 'thermometer', name: 'Thermometer', icon: Thermometer, fact: 'Temperature measures the average kinetic energy of particles. Absolute zero, -273.15 °C, is the point where motion nearly stops.' },
    { id: 'gear', name: 'Gear', icon: Cog, fact: 'Gears transfer motion and force. A small gear turning a large one increases torque but reduces speed.' },
    { id: 'pendulum', name: 'Pendulum', icon: Timer, fact: 'Galileo used his own pulse to time a swinging lamp and found that a pendulum\'s period does not depend on how wide it swings.' },
    { id: 'sound', name: 'Sound', icon: Volume2, fact: 'Sound is a vibration that travels through matter. It moves about 343 m/s in air and cannot travel through the vacuum of space.' },
    { id: 'balance', name: 'Balance', icon: Scale, fact: 'Mass stays the same everywhere, but weight changes with gravity. On the Moon you would weigh about one sixth of your Earth weight.' },
    { id: 'radio', name: 'Radio Waves', icon: RadioTower, fact: 'Radio waves are a form of light with very long wavelengths. They travel at the speed of light, about 300,000 km every second.' },
    { id: 'plug', name: 'Electricity', icon: Plug, fact: 'Electric current is the flow of electrons through a conductor. Copper is used in wires because it conducts electricity extremely well.' },
    { id: 'gravity', name: 'Gravity', icon: Apple, fact: 'Gravity pulls every object toward every other object. Near Earth\'s surface things accelerate downward at about 9.8 m/s².' },
    { id: 'waves', name: 'Waves', icon: Waves, fact: 'Waves carry energy without carrying matter. Ocean waves, sound and light are all described by wavelength, frequency and amplitude.' },
  ],
  chemistry: [
    { id: 'testtube', name: 'Test Tube', icon: TestTube, fact: 'Test tubes are made of borosilicate glass, which can be heated and cooled quickly without cracking.' },
    { id: 'flask', name: 'Flask', icon: FlaskConical, fact: 'The conical flask was designed by Emil Erlenmeyer in 1860. Its sloped sides let you swirl liquids without spilling.' },
    { id: 'water', name: 'Water', icon: Droplet, fact: 'Water is H₂O: two hydrogen atoms bonded to one oxygen atom. It is the only common substance found naturally as solid, liquid and gas.' },
    { id: 'fire', name: 'Combustion', icon: Flame, fact: 'Fire is a chemical reaction called combustion. It needs fuel, heat and oxygen, known as the fire triangle.' },
    { id: 'diamond', name: 'Diamond', icon: Gem, fact: 'Diamond and pencil graphite are both pure carbon. Only the way the atoms are arranged makes one the hardest natural material.' },
    { id: 'ice', name: 'Ice', icon: Snowflake, fact: 'Ice floats because water expands when it freezes. Solid water is about 9% less dense than liquid water.' },
    { id: 'acid', name: 'Acid', icon: Citrus, fact: 'Lemons are acidic because of citric acid, with a pH of around 2. Acids taste sour and turn blue litmus paper red.' },
    { id: 'radioactive', name: 'Radioactivity', icon: Radiation, fact: 'Radioactive elements have unstable nuclei that decay over time. Marie Curie discovered polonium and radium and won two Nobel Prizes.' },
    { id: 'beaker', name: 'Beaker', icon: Beaker, fact: 'Beakers are for mixing and heating, not precise measuring. Their printed scale can be off by as much as 10%.' },
    { id: 'pipette', name: 'Pipette', icon: Pipette, fact: 'A pipette transfers exact volumes of liquid. Micropipettes used in labs can measure as little as a millionth of a litre.' },
    { id: 'petroleum', name: 'Petroleum', icon: Fuel, fact: 'Crude oil is a mixture of hydrocarbons. Refineries separate it into petrol, diesel and other products by fractional distillation.' },
    { id: 'gold', name: 'Gold', icon: Coins, fact: 'Gold is so unreactive that it never rusts or tarnishes. One gram can be hammered into a sheet covering a square metre.' },
    { id: 'molecule', name: 'Molecule', icon: Hexagon, fact: 'Benzene is a ring of six carbon atoms. Its shape was famously proposed by Kekulé, who said he dreamed of a snake biting its own tail.' },
    { id: 'gas', name: 'Gas', icon: Cylinder, fact: 'Gases have no fixed shape or volume. Helium is so light and unreactive that it escapes Earth\'s atmosphere into space.' },
    { id: 'solution', name: 'Solution', icon: Droplets, fact: 'A solution forms when a solute dissolves in a solvent. Seawater is a solution of salts in water, about 3.5% salt by weight.' },
  ],
  space: [
    { id: 'saturn', name: 'Saturn', icon: Orbit, fact: 'Saturn\'s rings are made mostly of ice and rock. Saturn is so light it would float in a bathtub big enough to hold it.' },
    { id: 'rocket', name: 'Rocket', icon: Rocket, fact: 'To escape Earth\'s gravity a rocket must reach about 11.2 km/s, which is known as escape velocity.' },
    { id: 'satellite', name: 'Satellite', icon: Satellite, fact: 'Sputnik 1, launched in 1957, was the first artificial satellite. Today thousands of satellites orbit Earth.' },
    { id: 'radiotelescope', name: 'Radio Telescope', icon: SatelliteDish, fact: 'Radio telescopes detect radio waves from space. In 2019 a network of them captured the first ever image of a black hole.' },
    { id: 'telescope', name: 'Telescope', icon: Telescope, fact: 'Galileo pointed a telescope at the sky in 1609 and discovered four moons orbiting Jupiter.' },
    { id: 'moon', name: 'Moon', icon: Moon, fact: 'The Moon is slowly drifting away from Earth at about 3.8 cm per year, roughly the speed your fingernails grow.' },
    { id: 'sun', name: 'Sun', icon: Sun, fact: 'The Sun is a star made mostly of hydrogen and helium. Light from it takes about 8 minutes and 20 seconds to reach Earth.' },
    { id: 'earth', name: 'Earth', icon: Earth, fact: 'Earth is the only known planet with liquid water on its surface. It spins at about 1,670 km/h at the equator.' },
    { id: 'star', name: 'Star', icon: Star, fact: 'Stars shine by fusing hydrogen into helium in their cores. Many stars you see at night are bigger and brighter than the Sun.' },
    { id: 'meteor', name: 'Meteor', icon: Sparkles, fact: 'A shooting star is not a star at all. It is a small piece of rock burning up as it enters Earth\'s atmosphere.' },
    { id: 'blackhole', name: 'Black Hole', icon: Aperture, fact: 'A black hole\'s gravity is so strong that nothing, not even light, can escape once it crosses the event horizon.' },
    { id: 'probe', name: 'Space Probe', icon: Navigation, fact: 'Voyager 1, launched in 1977, is the farthest human-made object. It is now travelling through interstellar space.' },
    { id: 'nebula', name: 'Nebula', icon: Cloud, fact: 'A nebula is a giant cloud of gas and dust. New stars are born inside them, which is why they are called stellar nurseries.' },
    { id: 'galaxy', name: 'Galaxy', icon: Disc, fact: 'Our galaxy, the Milky Way, contains over 100 billion stars and takes about 230 million years to spin once.' },
    { id: 'constellation', name: 'Constellation', icon: MoonStar, fact: 'Astronomers recognise 88 constellations. The stars in each only look close together; they can be hundreds of light years apart.' },
  ],
}

// `columns` is the board width on phones, `columnsWide` on desktop layouts.
export const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', pairs: 6, columns: 4, columnsWide: 4, peekMs: 3000, parSeconds: 45, multiplier: 1 },
  { id: 'medium', name: 'Medium', pairs: 8, columns: 4, columnsWide: 4, peekMs: 2500, parSeconds: 75, multiplier: 1.5 },
  { id: 'hard', name: 'Hard', pairs: 15, columns: 5, columnsWide: 6, peekMs: 2000, parSeconds: 150, multiplier: 2 },
]

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id)
export const getDifficulty = (id) => DIFFICULTIES.find((d) => d.id === id)
