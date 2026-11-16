/* Fault Lines: Boundary Survey Lab (AP Human Geography 4.4 and 4.5)
   All lab content lives in this file. Edit text here; the page in index.html reads it.
   Story text: wrap a key term in [[double brackets]] so students can tap it. The term must be in that stop's "terms".
   Map grids: each letter is one hex; "regions" says what each letter means. */

const SCALE = [
  { n: 1, label: "Stable", desc: "People cross or live beside it without fear; any arguments are small and legal" },
  { n: 2, label: "Tremors", desc: "Arguments, standoffs, or small incidents, but no war" },
  { n: 3, label: "Moderate", desc: "Real disputes: rules change, protests break out, or checks come back" },
  { n: 4, label: "Strong", desc: "Violence or uprisings; groups pushed out or cut off" },
  { n: 5, label: "Major Quake", desc: "War or mass displacement" }
];
const PRESSURE = [
  { key: "Low", desc: "The line fits the land and the people; little stress is building" },
  { key: "Building", desc: "The line works now, but rules or conditions are shifting" },
  { key: "High", desc: "The line cuts across the land or the people; stress is large" },
  { key: "Locked fault", desc: "High pressure held shut by force; quiet only because of guards and walls" }
];
const SOURCES = [
  { key: "Unclear definition", term: "definitional dispute" },
  { key: "Who owns the land", term: "locational (territorial) dispute" },
  { key: "How it works", term: "operational (functional) dispute" },
  { key: "Resources", term: "allocational (resource) dispute" },
  { key: "Cultural mismatch", term: "cultural boundaries" },
  { key: "Outside power", term: "superimposed boundary" }
];

const MATCHUPS = {
  W: { title: "Warm-up", compare: null },
  A: { title: "A · Who drew the line?", compare: "Both of these lines were set by people far from the land. Why did the Andes line settle down while the lines drawn in Berlin stored pressure for a century?" },
  B: { title: "B · Lines and culture", compare: "The 49th parallel ignored culture and stayed calm. Partition followed culture and exploded. Explain why, using your readings from both stops." },
  C: { title: "C · Who gets to cross?", compare: "One of these borders is closed and one is open. What kind of instability does each one face? Which would you rather live next to, and why?" },
  D: { title: "D · Within and below", compare: "Compare pressure from within (the Caucasus) to pressure from below (Iraq and Kuwait). Which is harder to fix with a treaty? Explain." }
};

const STOPS = [
  /* ------------------------------------------------------------ WARM-UP */
  {
    id: "s0", num: 0, roman: "Warm-up", matchup: "W", short: "The relic line",
    title: "The relic line", place: "Berlin, 1961 to today",
    steps: ["brief", "read"],
    bg: { a: "img/bg_s0_relic.png", c: "img/bg_s0_relic.png" },
    bgLabel: { a: "Night city, one half orange and one half white" },
    heading: "The border that disappeared, and didn't",
    story: [
      "From 1961 to 1989, a guarded wall split Berlin, and a fortified [[militarized boundary]] split Germany in two.",
      "Germany reunified in 1990, and the line stopped being a border. Yet from space at night, the old East still glows a different color, because its street lamps are different. Incomes and voting patterns still differ on each side too.",
      "A border that no longer exists but can still be seen on the landscape is a [[relic boundary]]."
    ],
    terms: {
      "militarized boundary": "A heavily guarded border that discourages people from crossing.",
      "relic boundary": "A boundary that no longer exists as a border, but can still be seen on the landscape."
    },
    facts: [["1961", "The Berlin Wall goes up"], ["1989", "The Wall falls"], ["15 → ~75", "Border walls in the world, 1989 to 2020 (AMSCO)"]],
    voices: [
      { id: "lena", name: "Lena", age: 16, side: "One city", where: "Berlin, Germany", img: "img/portrait_s0_lena.png",
        quote: "My grandparents grew up a few streets apart, on opposite sides of the Wall. They still argue about which side had better bread." }
    ],
    hq: { surface: 1, pressure: "Low", source: "Cultural mismatch", note: "Quiet today, with aftershocks: the economic gap still follows the old line." },
    think: "How can a boundary that no longer exists still shape the landscape?"
  },

  /* ------------------------------------------------------------ 1 ANDES */
  {
    id: "s1", num: 1, roman: "1", matchup: "A", short: "The Andes",
    title: "The Andes", place: "Chile and Argentina, 1881 to 1902",
    steps: ["brief", "map", "scene", "read"],
    bg: { a: "img/bg_s1_a.png", b: "img/bg_s1_b.png", c: "img/bg_s1_c.png" },
    bgLabel: { a: "High Andes pass, survey camp, stone marker", b: "Aerial view of the southern Andes", c: "The pass at dusk, seismograph tent" },
    heading: "One sentence, two borders",
    story: [
      "The 1881 treaty put the border on the Andes' “highest crests that divide the waters.” Mountains are a [[physical geographic boundary]], and because almost no one lived there yet, this was an [[antecedent boundary]].",
      "In the far south, the highest peaks and the watershed (the line where rivers split toward different oceans) don't line up, and no one had mapped the land. Argentina said the line meant the highest peaks. Chile said it meant the watershed. The same sentence pointed to two different borders: a [[definitional boundary dispute]].",
      "A British arbitration in 1902 split the difference, giving the border the form of a [[physical consequent boundary]] along the mountains. In 1904, the two countries placed a statue of Christ on a mountain pass as a symbol of peace."
    ],
    terms: {
      "physical geographic boundary": "A boundary formed by a natural barrier such as an ocean, desert, or mountain range.",
      "antecedent boundary": "A boundary drawn before many people lived in the area, often along physical features.",
      "definitional boundary dispute": "A disagreement over how to read the treaty or map that sets a border.",
      "physical consequent boundary": "A boundary that follows natural features such as rivers or mountains."
    },
    facts: [["1881", "Treaty puts the line on the Andes crests"], ["1902", "British arbitration settles most of it"], ["1978", "Near war over Beagle Channel islands; papal mediation ends it in 1984"]],
    voices: [
      { id: "camila", name: "Camila", age: 16, side: "Side A", where: "Punta Arenas, Chile", img: "img/portrait_s1_camila.png",
        quote: "My grandfather says the treaty told everyone where the line was. The mountains disagreed." },
      { id: "tomas", name: "Tomás", age: 16, side: "Side B", where: "Ushuaia, Argentina", img: "img/portrait_s1_tomas.png",
        quote: "We studied the same treaty sentence in school. We just learned a different answer." }
    ],
    map: {
      grid: [
        "SCCPAAAAAA",
        "SCCPAAAAAA",
        "SCCPdeAAAA",
        "SCCPddeAAA",
        "SCCPdeeAAA",
        "SSCPddeeAA",
        "SSCPdeeeAA"
      ],
      regions: {
        S: { name: "Pacific Ocean", country: "sea" },
        C: { name: "Chilean lowlands", country: "Chile" },
        P: { name: "Highest peaks", country: "Chile" },
        d: { name: "Disputed valleys (given to Chile)", country: "Chile" },
        e: { name: "Disputed valleys (given to Argentina)", country: "Argentina" },
        A: { name: "Argentine steppe", country: "Argentina" }
      },
      layers: [
        { key: "phys", name: "Physical", values: { S: "Ocean", C: "Pacific slope", P: "Highest peaks", d: "East of the peaks, but rivers drain west", e: "East of the peaks, but rivers drain west", A: "Atlantic slope" } },
        { key: "pop", name: "Population (1881)", values: { S: "Ocean", C: "Towns and farms", P: "Empty", d: "Almost empty", e: "Almost empty", A: "Scattered ranches" } }
      ],
      faults: [["d", "e"]],
      faultNote: "The 1902 line runs through valleys where the peaks and the watershed disagree.",
      question: {
        q: "Where the highest peaks and the watershed split apart, what happens to the border?",
        opts: [
          ["The border follows the river valleys to the east.", false],
          ["The treaty's words now point to two lines.", true],
          ["Both countries agree to use the highest peaks.", false],
          ["The line switches to a straight geometric border.", false]
        ],
        why: "One sentence described two different lines once surveyors mapped the south. That gap is a definitional dispute, and it is why antecedent lines through unmapped land can still cause trouble."
      }
    },
    source: {
      img: "img/source_s1.png", title: "Boundary Treaty of 1881, Article 1 (abridged)",
      excerpt: "The boundary between Chile and Argentina runs north to south along the Andes, following the highest crests that divide the waters.",
      who: "Diplomats from Chile and Argentina, meeting in Buenos Aires", when: "1881, before the far south was surveyed",
      why: "To settle a border through land almost no one lived in yet, so neither country would start a war over it"
    },
    scene: {
      img: "img/scene_s1.png", label: "Andes pass: marker, river, statue, warships",
      clues: [
        { label: "A stone marker on a high pass", img: "img/clue_s1_1.png", expect: "s", why: "Once a line is demarcated on the ground, people know exactly where it is." },
        { label: "A river that starts east of the highest peaks but flows west", img: "img/clue_s1_2.png", expect: "p", why: "Here the peaks and the watershed disagree. Which one did the treaty mean?" },
        { label: "Christ of the Andes statue, 1904", img: "img/clue_s1_3.png", expect: "s", why: "Both countries chose to mark the settlement with a shared symbol of peace." },
        { label: "Navy ships near the Beagle Channel, 1978", img: "img/clue_s1_4.png", expect: "p", why: "The old definitional gap flared up again over islands at the southern tip." }
      ]
    },
    hq: { surface: 2, pressure: "Low", source: "Unclear definition", note: "Real tremors, but arbitration and demarcation let the pressure out." },
    think: "Why are antecedent boundaries in unmapped places likely to cause definitional disputes?"
  },

  /* ------------------------------------------------------------ 2 BERLIN 1884 */
  {
    id: "s2", num: 2, roman: "2", matchup: "A", short: "Berlin, 1884",
    title: "Berlin, 1884", place: "Then Africa today: Kenya, Tanzania, and Lesotho",
    steps: ["brief", "map", "scene", "read"],
    bg: { a: "img/bg_s2_a.png", b: "img/bg_s2_b.png", c: "img/bg_s2_c.png" },
    bgLabel: { a: "Savanna near Kilimanjaro, straight line of survey posts", b: "Overhead: 1884 conference table with a map of Africa", c: "Lesotho highlands at dusk" },
    heading: "Lines drawn by people who never saw the land",
    story: [
      "In 1884 and 1885, fourteen countries met at the [[Berlin Conference]] to set rules for claiming Africa. No Africans were invited, and about 80% of the continent was still under local rule.",
      "Lines were drawn on maps with little knowledge of the land or the people. Many were [[superimposed boundary|superimposed boundaries]], and many were straight [[geometric boundary|geometric boundaries]].",
      "Jump ahead to today. The Maasai live on both sides of a straight line between Kenya and Tanzania. Lesotho is a [[landlocked state]] completely surrounded by South Africa, which also makes it a [[political enclave]]."
    ],
    terms: {
      "Berlin Conference": "The 1884 to 1885 meeting where European powers set rules for claiming Africa.",
      "superimposed boundary": "A boundary drawn by outside powers, often ignoring the cultures already there.",
      "geometric boundary": "A straight line or arc that does not follow physical features.",
      "landlocked state": "A country with no coastline.",
      "political enclave": "A state or territory completely surrounded by another state."
    },
    facts: [["14 · 0", "Countries at the Berlin Conference · African delegates"], ["~80%", "Share of Africa still under local control in 1884 (AMSCO)"], ["16 of 32", "Landlocked developing countries in the world that are in Africa"]],
    voices: [
      { id: "naserian", name: "Naserian", age: 15, side: "Side A", where: "near Namanga, Kenya", img: "img/portrait_s2_naserian.png",
        quote: "My cousin lives an hour away. On the map, that hour is a different country." },
      { id: "lemayian", name: "Lemayian", age: 16, side: "Side B", where: "across the line in Tanzania", img: "img/portrait_s2_lemayian.png",
        quote: "Our cattle don't carry passports. The grass doesn't either." },
      { id: "thabo", name: "Thabo", age: 15, side: "Caught in between", where: "Maseru, Lesotho", img: "img/portrait_s2_thabo.png",
        quote: "Every road out of Lesotho goes through South Africa. Every single one." }
    ],
    map: {
      grid: [
        "lllKKKKKKK",
        "lllKKmmKKK",
        "lllTKmmmKK",
        "LLLTTnnmKS",
        "LLLTTnnnKS",
        "TTTTTTnnTS",
        "TTTTTTTTTS"
      ],
      regions: {
        l: { name: "Lake Victoria (north part)", country: "Kenya" },
        L: { name: "Lake Victoria (south part)", country: "Tanzania" },
        K: { name: "Kenya", country: "Kenya" },
        m: { name: "Maasai land in Kenya", country: "Kenya" },
        n: { name: "Maasai land in Tanzania", country: "Tanzania" },
        T: { name: "Tanzania", country: "Tanzania" },
        S: { name: "Indian Ocean", country: "sea" }
      },
      layers: [
        { key: "eth", name: "Ethnic groups", values: { l: "Lake", L: "Lake", K: "Many other groups", m: "Maasai", n: "Maasai", T: "Many other groups", S: "Ocean" } },
        { key: "col", name: "Colonial claims (1890s)", values: { l: "British", L: "German", K: "British", m: "British", n: "German", T: "German", S: "Ocean" } },
        { key: "phys", name: "Physical", values: { l: "Lake", L: "Lake", K: "Highlands", m: "Savanna", n: "Savanna", T: "Plains", S: "Ocean" } }
      ],
      faults: [["m", "n"], ["l", "L"]],
      faultNote: "The straight line cuts through Maasai grazing land and straight across a lake.",
      question: {
        q: "Turn on the ethnic layer. What does the straight Kenya-Tanzania line do to the Maasai?",
        opts: [
          ["It follows the outer edge of where the Maasai live.", false],
          ["It runs only across the empty lake.", false],
          ["It splits Maasai land into two countries.", true],
          ["It keeps every Maasai family in Kenya.", false]
        ],
        why: "The line was drawn by outsiders between British and German claims. It ignores where the Maasai graze their herds, so one group ends up in two countries."
      }
    },
    source: {
      img: "img/source_s2.png", title: "General Act of the Berlin Conference, 1885, Article 35 (abridged)",
      excerpt: "Powers that take possession of land on the coasts of Africa must establish enough authority there to protect existing rights and, where agreed, freedom of trade.",
      who: "Diplomats from 14 countries, none of them African", when: "February 1885",
      why: "To keep European powers from going to war with each other while they claimed Africa"
    },
    scene: {
      img: "img/scene_s2.png", label: "East Africa: straight posts into a lake, market, railway, border trucks",
      clues: [
        { label: "A ruler-straight line of posts running into Lake Victoria", img: "img/clue_s2_1.png", expect: "p", why: "A line that ignores land and water is a superimposed, geometric line." },
        { label: "A Maasai market where people from both sides trade every day", img: "img/clue_s2_2.png", expect: "s", why: "Daily trade across the line holds communities together." },
        { label: "A rail line from a mine straight to a port and nowhere else", img: "img/clue_s2_3.png", expect: "p", why: "Colonial railroads moved resources out, not people between regions." },
        { label: "Lesotho trucks waiting at a South African checkpoint", img: "img/clue_s2_4.png", expect: "p", why: "A landlocked enclave depends on its neighbor for every route to the sea." }
      ]
    },
    hq: { surface: 4, pressure: "High", source: "Outside power", note: "Calm at the table in 1884, but the pressure was stored for a century." },
    think: "How did superimposed boundaries create landlocked states and enclaves? Use Lesotho."
  },

  /* ------------------------------------------------------------ 3 49TH PARALLEL */
  {
    id: "s3", num: 3, roman: "3", matchup: "B", short: "The 49th parallel",
    title: "The 49th parallel", place: "United States and Canada, 1818 to today",
    steps: ["brief", "map", "scene", "read"],
    bg: { a: "img/bg_s3_a.png", b: "img/bg_s3_b.png", c: "img/bg_s3_c.png" },
    bgLabel: { a: "Forest with a straight clear-cut strip and a monument", b: "Aerial: one straight line across forest and coast", c: "Point Roberts at dusk" },
    heading: "A straight line that cut through almost no one",
    story: [
      "Treaties in 1818 and 1846 set much of the US-Canada border along the 49th parallel, a line of latitude. That makes it a [[geometric boundary]].",
      "First the line was a [[defined boundary]], described in the words of a treaty. Then it became a [[delimited boundary]], drawn on maps. Finally it became a [[demarcated boundary]], marked with monuments and a cleared strip through the forest.",
      "The line cut off the tip of a peninsula. Point Roberts, Washington, is an [[exclave]]: to reach the rest of the United States by land, you have to drive through Canada."
    ],
    terms: {
      "geometric boundary": "A straight line or arc that does not follow physical features.",
      "defined boundary": "A boundary set by a legal document, such as a treaty.",
      "delimited boundary": "A boundary drawn on a map by a cartographer.",
      "demarcated boundary": "A boundary marked on the landscape with physical objects such as monuments, fences, or walls.",
      "exclave": "Part of a state that is separated from the main territory by another country."
    },
    facts: [["5,525 mi", "The longest border between two countries"], ["8,000+", "Boundary monuments and markers"], ["20 ft", "The cleared “vista” strip kept along the line"]],
    voices: [
      { id: "maya", name: "Maya", age: 16, side: "Side A", where: "Point Roberts, Washington", img: "img/portrait_s3_maya.png",
        quote: "To get to my own high school, I cross into Canada and back into the US. Four border checks a day." },
      { id: "arjun", name: "Arjun", age: 16, side: "Side B", where: "Surrey, British Columbia", img: "img/portrait_s3_arjun.png",
        quote: "My uncle lives in Washington. The line is invisible until you reach the booth." }
    ],
    map: {
      grid: [
        "NNNNNNNNSS",
        "NNNNNNNNNS",
        "NNNNNNNNSS",
        "UUUUUUSpSS",
        "UUUUUUSSSS",
        "UUUUUUUSSS",
        "UUUUUUUUSS"
      ],
      regions: {
        N: { name: "British Columbia, Canada", country: "Canada" },
        U: { name: "Washington, United States", country: "United States" },
        p: { name: "Point Roberts (US exclave)", country: "United States" },
        S: { name: "Salish Sea", country: "sea" }
      },
      layers: [
        { key: "phys", name: "Physical", values: { N: "Forest and hills", U: "Forest and hills", p: "Forest and hills", S: "Sea" } },
        { key: "pop", name: "Settlement (1846)", values: { N: "Very few settlers", U: "Very few settlers", p: "Very few settlers", S: "Sea" } },
        { key: "today", name: "Today", values: { N: "Canadian towns", U: "US towns", p: "US town cut off by the line", S: "Sea" } }
      ],
      faults: [],
      faultNote: "No fault lines: the line crossed land where almost no one lived yet, so it split no community.",
      question: {
        q: "Does the 49th parallel follow any physical feature?",
        opts: [
          ["Yes, it follows a mountain ridge.", false],
          ["Yes, it follows a major river.", false],
          ["No, it is a line of latitude.", true],
          ["No, it follows where languages change.", false]
        ],
        why: "It is a geometric line. It worked anyway because very few people lived there in 1846, so it cut through almost no one."
      }
    },
    source: {
      img: "img/source_s3.png", title: "Oregon Treaty, 1846, Article 1 (abridged)",
      excerpt: "The line along the 49th parallel of north latitude shall continue west to the middle of the channel that separates the continent from Vancouver's Island.",
      who: "US and British negotiators", when: "1846",
      why: "To end a dispute over the Oregon Country without a war"
    },
    scene: {
      img: "img/scene_s3.png", label: "US-Canada border: monument, Peace Arch, school bus, booths",
      clues: [
        { label: "An obelisk monument in a forest clearing", img: "img/clue_s3_1.png", expect: "s", why: "A demarcated line leaves no doubt about where the border is." },
        { label: "Peace Arch Park, where families from both sides picnic", img: "img/clue_s3_2.png", expect: "s", why: "A shared park shows a friendly, low-pressure border." },
        { label: "Point Roberts teens crossing four times a day for school", img: "img/clue_s3_3.png", expect: "p", why: "Small pressure: an exclave makes daily life harder, even on a calm border." },
        { label: "Passport booths at the Blaine crossing", img: "img/clue_s3_4.png", expect: "p", why: "Small pressure: a controlled border slows trade and travel." }
      ]
    },
    hq: { surface: 1, pressure: "Low", source: "How it works", note: "Stable ground. The only pressure is small and practical." },
    think: "Explain the difference between defined, delimited, and demarcated using this border."
  },

  /* ------------------------------------------------------------ 4 PARTITION */
  {
    id: "s4", num: 4, roman: "4", matchup: "B", short: "Partition",
    title: "Partition", place: "India and Pakistan, 1947",
    steps: ["brief", "map", "scene", "read"],
    bg: { a: "img/bg_s4_a.png", b: "img/bg_s4_b.png", c: "img/bg_s4_c.png" },
    bgLabel: { a: "Punjab plains: fields, canals, a village of neighbors", b: "Aerial: Punjab with a wandering pencil line", c: "Railway station at dusk, 1947" },
    heading: "A line drawn to follow culture",
    story: [
      "When Britain left India in 1947, it split the colony into a Hindu-majority India and a Muslim-majority Pakistan. The new border was meant to be a [[cultural consequent boundary]], drawn to follow religion. It was also a [[subsequent boundary]], drawn after the cultural landscape was already full of people.",
      "Cyril Radcliffe, a lawyer who had never been to India, had about five weeks to draw lines through Punjab and Bengal. Hindus, Muslims, and Sikhs lived mixed together village by village, so no line could separate them cleanly.",
      "The line was made public two days after independence. Millions moved in both directions, and violence followed. Kashmir, in the north, is still claimed by both countries: a [[locational boundary dispute]]."
    ],
    terms: {
      "cultural consequent boundary": "A boundary drawn to follow cultural divisions such as religion, language, or ethnicity.",
      "subsequent boundary": "A boundary drawn while the cultural landscape is developing or after it is in place; often based on culture (ethnographic).",
      "locational boundary dispute": "A disagreement over where a border should be and who owns the land. Also called a territorial dispute."
    },
    facts: [["~5 weeks", "Time Radcliffe had to draw the lines"], ["Aug 17, 1947", "The line is made public, 2 days after independence"], ["10 to 20 million", "People estimated to have been displaced"]],
    voices: [
      { id: "harpreet", name: "Harpreet", age: 16, side: "Side A", where: "Lahore (now Pakistan), 1947", img: "img/portrait_s4_harpreet.png",
        quote: "We heard the line would put Lahore in Pakistan. My father packed only what we could carry." },
      { id: "yusuf", name: "Yusuf", age: 16, side: "Side B", where: "Amritsar (now India), 1947", img: "img/portrait_s4_yusuf.png",
        quote: "Amritsar was home. In August, home ended at a line nobody showed us." }
    ],
    map: {
      grid: [
        "KKKKKKKKKK",
        "PPPPPqIIII",
        "PPPPqqjIII",
        "PPPPqjjIII",
        "PPPPPjjIII",
        "PPPPPPjIII",
        "PPPPPPIIII"
      ],
      regions: {
        K: { name: "Kashmir (claimed by both)", country: "Disputed" },
        P: { name: "West Punjab", country: "Pakistan" },
        q: { name: "Lahore area", country: "Pakistan" },
        j: { name: "Amritsar area", country: "India" },
        I: { name: "East Punjab", country: "India" }
      },
      layers: [
        { key: "rel", name: "Religion (1947)", values: { K: "Muslim majority, Hindu ruler", P: "Muslim majority", q: "Mixed: many Hindus and Sikhs", j: "Mixed: many Muslims", I: "Hindu and Sikh majority" } },
        { key: "lang", name: "Language", values: { K: "Kashmiri and others", P: "Punjabi", q: "Punjabi", j: "Punjabi", I: "Punjabi" } },
        { key: "canal", name: "Rivers and canals", values: { K: "Mountain rivers", P: "Canals", q: "Shared canal system", j: "Shared canal system", I: "Canals" } }
      ],
      faults: [["q", "j"], ["P", "I"], ["K", "P"], ["K", "I"]],
      faultNote: "The line cuts through mixed communities, a shared language, and one canal system.",
      question: {
        q: "Turn on the religion layer. Why couldn't any single line separate the communities in Punjab?",
        opts: [
          ["Most of Punjab was empty desert land.", false],
          ["Communities were mixed village by village.", true],
          ["The rivers kept moving the line every year.", false],
          ["Each religion lived in its own separate province.", false]
        ],
        why: "A cultural consequent line only works when groups live apart. In Punjab they lived side by side, so any line left millions on the wrong side."
      }
    },
    source: {
      img: "img/source_s4.png", title: "A 1947 newspaper map of the new Punjab line",
      excerpt: "[The newspaper prints the Boundary Commission's line across Punjab, showing which districts go to each country.]",
      who: "The Punjab Boundary Commission, led by Cyril Radcliffe", when: "August 1947",
      why: "To divide British India into a Hindu-majority state and a Muslim-majority state"
    },
    scene: {
      img: "img/scene_s4.png", label: "Partition: refugee train, split village, border ceremony, two maps",
      clues: [
        { label: "Overcrowded refugee trains", img: "img/clue_s4_1.png", expect: "p", why: "Mass displacement is the strongest surface reading on the scale." },
        { label: "A village where the line runs between the fields and the houses", img: "img/clue_s4_2.png", expect: "p", why: "A rushed line cut people off from their own land." },
        { label: "The Wagah border ceremony: a daily rivalry show", img: "img/clue_s4_3.png", expect: "p", why: "The rivalry is turned into a ritual, but it is still a rivalry." },
        { label: "Kashmir drawn differently on Indian and Pakistani maps", img: "img/clue_s4_4.png", expect: "p", why: "A locational dispute that has never been settled." }
      ]
    },
    hq: { surface: 5, pressure: "High", source: "Cultural mismatch", note: "A major quake: a culture-based line drawn through mixed communities." },
    think: "The 49th parallel ignored culture and stayed calm. Partition followed culture and exploded. Why?"
  },

  /* ------------------------------------------------------------ 5 DMZ */
  {
    id: "s5", num: 5, roman: "5", matchup: "C", short: "The Korean DMZ",
    title: "The Korean DMZ", place: "1953 to today",
    steps: ["brief", "map", "scene", "read"],
    bg: { a: "img/bg_s5_a.png", b: "img/bg_s5_b.png", c: "img/bg_s5_c.png" },
    bgLabel: { a: "Misty valley, fence line, cranes", b: "Aerial: a band of wild forest coast to coast", c: "Observation deck at dusk" },
    heading: "Quiet only because it is held shut",
    story: [
      "In 1945, the United States and the Soviet Union split Korea at the 38th parallel, a geometric line. The Korean War ended in 1953 with a cease-fire, not a peace treaty.",
      "The two sides created a buffer zone 160 miles long and 2.5 miles wide. It is a [[militarized boundary]] and a [[demarcated boundary]], with fences, mines, and guard posts. As an [[administered boundary]], it allows almost no people or trade to cross.",
      "The surface is quiet. But the quiet comes from force, not agreement."
    ],
    terms: {
      "militarized boundary": "A heavily guarded border that discourages people from crossing.",
      "demarcated boundary": "A boundary marked on the landscape with physical objects such as signs, fences, or walls.",
      "administered boundary": "How a border is maintained, and what people and goods are allowed to cross it."
    },
    facts: [["160 × 2.5 mi", "Length and width of the DMZ (AMSCO)"], ["1953", "Cease-fire, with no peace treaty since"], ["28,000+", "US troops in South Korea (2020, AMSCO)"]],
    voices: [
      { id: "jiwoo", name: "Ji-woo", age: 16, side: "Side A", where: "Paju, South Korea", img: "img/portrait_s5_jiwoo.png",
        quote: "My grandfather has a sister he hasn't seen since 1950. She lives two hours away." },
      { id: "north", name: "North Korea", age: null, side: "Side B", where: "No voice", img: "img/portrait_s5_empty.png", noVoice: true,
        quote: "No one on this side can speak to us freely. That silence is part of the reading." }
    ],
    map: {
      grid: [
        "NNNNNNNNNN",
        "NNNNNNzzss",
        "NNNzzzyyss",
        "nzzyyySSSS",
        "zyySSSSSSS",
        "SSSSSSSSSS",
        "SSSSSSSSSS"
      ],
      regions: {
        N: { name: "North Korea", country: "North Korea" },
        n: { name: "North-held land south of the 38th", country: "North Korea" },
        z: { name: "DMZ, north half", country: "North Korea" },
        y: { name: "DMZ, south half", country: "South Korea" },
        s: { name: "South-held land north of the 38th", country: "South Korea" },
        S: { name: "South Korea", country: "South Korea" }
      },
      layers: [
        { key: "line45", name: "1945 line (38th parallel)", grid: ["NNNNNNNNNN", "NNNNNNNNNN", "NNNNNNNNNN", "SSSSSSSSSS", "SSSSSSSSSS", "SSSSSSSSSS", "SSSSSSSSSS"], values: { N: "North of the 38th parallel", S: "South of the 38th parallel" } },
        { key: "dmz", name: "DMZ today", values: { N: "North Korea", n: "North Korea", z: "Buffer zone, no one lives here", y: "Buffer zone, no one lives here", s: "South Korea", S: "South Korea" } },
        { key: "fam", name: "Families (1950)", values: { N: "One Korean people", n: "One Korean people", z: "One Korean people", y: "One Korean people", s: "One Korean people", S: "One Korean people" } }
      ],
      faults: [["z", "y"]],
      faultNote: "One people on both sides, held apart by force: a locked fault.",
      question: {
        q: "Compare the 1945 line to today's DMZ. What changed?",
        opts: [
          ["The DMZ follows the 38th parallel exactly.", false],
          ["A geometric line became a militarized zone.", true],
          ["The border was moved far into the north.", false],
          ["The line was erased and the zone is open now.", false]
        ],
        why: "The 38th parallel began as a superimposed, geometric line. After the war it became a demarcated, militarized buffer zone that bends across the old line."
      }
    },
    source: {
      img: "img/source_s5.png", title: "Korean Armistice Agreement, 1953, Article I (abridged)",
      excerpt: "A Military Demarcation Line shall be fixed, and both sides shall pull back two kilometers from it to create a Demilitarized Zone as a buffer between the forces.",
      who: "The UN Command, North Korea, and China", when: "July 1953",
      why: "To stop the fighting without settling the war"
    },
    scene: {
      img: "img/scene_s5.png", label: "DMZ: fence, family notes, cranes, loudspeakers",
      clues: [
        { label: "Double fences and guard posts", img: "img/clue_s5_1.png", expect: "p", why: "The fences hold pressure in. Remove them and the stress is still there." },
        { label: "Lists of families waiting for a reunion visit", img: "img/clue_s5_2.png", expect: "p", why: "Separated families are pressure that builds every year." },
        { label: "Cranes and rare wildlife thriving in the empty zone", img: "img/clue_s5_3.png", expect: "x", why: "Either answer works: it looks peaceful, but it is empty because people are kept out." },
        { label: "Loudspeakers aimed across the line", img: "img/clue_s5_4.png", expect: "p", why: "Both sides still treat the line as a front line." }
      ]
    },
    hq: { surface: 2, pressure: "Locked fault", source: "Outside power", note: "A low surface reading, but the stored pressure is high." },
    think: "The surface reading is low but the stored pressure is high. How can a border be quiet and unstable at the same time?"
  },

  /* ------------------------------------------------------------ 6 SCHENGEN */
  {
    id: "s6", num: 6, roman: "6", matchup: "C", short: "Schengen",
    title: "Schengen", place: "Europe, 1985 to 2020",
    steps: ["brief", "map", "scene", "read"],
    bg: { a: "img/bg_s6_a.png", b: "img/bg_s6_b.png", c: "img/bg_s6_c.png" },
    bgLabel: { a: "Highway through an abandoned customs station", b: "Aerial: Europe with faint old borders", c: "Schengen village on the Moselle at dusk" },
    heading: "The lines didn't move. How they worked did.",
    story: [
      "In 1985, five countries signed an agreement in the village of Schengen, Luxembourg, to drop border checks. It grew to cover most of Europe. Its borders became [[open boundary|open boundaries]]: you can drive from Portugal to Finland without showing a passport.",
      "Then in 2015, more than a million asylum seekers arrived, and in 2020 COVID hit. Countries argued about how open the borders should be. That is an [[operational boundary dispute]].",
      "Some countries put checks back, turning open borders into [[controlled boundary|controlled boundaries]] again, at least for a while."
    ],
    terms: {
      "open boundary": "A border that is unguarded, so people cross easily.",
      "operational boundary dispute": "A disagreement over how a border works: trade, migration, or transportation. Also called a functional dispute.",
      "controlled boundary": "A border with checkpoints where a passport or visa is required."
    },
    facts: [["1985", "Agreement signed in Schengen, Luxembourg"], ["29", "Countries in the Schengen Area today"], ["~1.3 million", "Asylum applications in the EU in 2015"]],
    voices: [
      { id: "lea", name: "Léa", age: 16, side: "Side A", where: "Thionville, France", img: "img/portrait_s6_lea.png",
        quote: "I cross into Luxembourg for school every morning. Most days I forget it's a border." },
      { id: "bence", name: "Bence", age: 16, side: "Side B", where: "Szeged, Hungary", img: "img/portrait_s6_bence.png",
        quote: "In 2015 they built a fence near my town. Before that, the border was just a field." },
      { id: "rami", name: "Rami", age: 17, side: "Caught in between", where: "from Syria, seeking asylum", img: "img/portrait_s6_rami.png",
        quote: "Every border I crossed had different rules. Some had none, and then suddenly they did." }
    ],
    map: {
      grid: [
        "FFFLDDDDDD",
        "FFFLDDDDAA",
        "FFFFDDDAAA",
        "FFFFDDAAHH",
        "FFFFFAAHHH",
        "FFFFFAHHRR",
        "FFFFFAHRRR"
      ],
      regions: {
        F: { name: "France", country: "France" },
        L: { name: "Luxembourg", country: "Luxembourg" },
        D: { name: "Germany", country: "Germany" },
        A: { name: "Austria", country: "Austria" },
        H: { name: "Hungary", country: "Hungary" },
        R: { name: "Serbia", country: "Serbia" }
      },
      layers: [
        { key: "mem", name: "Schengen members", values: { F: "Member", L: "Member", D: "Member", A: "Member", H: "Member", R: "Not a member" } },
        { key: "route", name: "2015 migration route", values: { F: "Few arrivals", L: "Few arrivals", D: "Main destination", A: "Route", H: "Route", R: "Main route in" } },
        { key: "checks", name: "Checks 2016 to 2020", values: { F: "Checks returned for a time", L: "Open", D: "Checks returned at the Austrian border", A: "Checks returned", H: "Fence on the Serbian border", R: "Outside the area" } }
      ],
      faults: [["H", "R"], ["D", "A"]],
      faultNote: "Pressure built where the main migration route crossed borders.",
      question: {
        q: "Turn on “Checks 2016 to 2020.” Where did border checks come back?",
        opts: [
          ["Only on Luxembourg's borders.", false],
          ["On main routes that migrants used.", true],
          ["Everywhere outside of the European Union.", false],
          ["Nowhere, because Schengen bans all checks.", false]
        ],
        why: "The lines stayed where they were, but along the busiest migration route, countries changed how the border worked. That is an operational dispute."
      }
    },
    source: {
      img: "img/source_s6.png", title: "Schengen Agreement, 1985 (abridged)",
      excerpt: "The parties will gradually remove checks at their shared borders and make it easier for people and goods to move between their countries.",
      who: "Belgium, France, West Germany, Luxembourg, and the Netherlands", when: "June 1985",
      why: "To let people and goods move freely"
    },
    scene: {
      img: "img/scene_s6.png", label: "Europe: empty customs booth, commuters, fence, checkpoint",
      clues: [
        { label: "An empty, abandoned customs booth on a highway", img: "img/clue_s6_1.png", expect: "s", why: "An open border: nobody needs the booth anymore." },
        { label: "Commuters crossing every day for work", img: "img/clue_s6_2.png", expect: "s", why: "Daily crossing ties both sides together." },
        { label: "A razor-wire fence on the Hungary-Serbia border, 2015", img: "img/clue_s6_3.png", expect: "p", why: "An open system closing at its edge under migration pressure." },
        { label: "A temporary police checkpoint, 2020", img: "img/clue_s6_4.png", expect: "p", why: "Open borders became controlled again, at least for a while." }
      ]
    },
    hq: { surface: 3, pressure: "Building", source: "How it works", note: "Stable in 1985; moderate by 2015 to 2020 as rules changed." },
    think: "One border in this matchup is open and one is closed. What kind of instability does each one face?"
  },

  /* ------------------------------------------------------------ 7 CAUCASUS */
  {
    id: "s7", num: 7, roman: "7", matchup: "D", short: "The Caucasus",
    title: "The Caucasus", place: "Armenia, Azerbaijan, and Nagorno-Karabakh, 1988 to today",
    steps: ["brief", "map", "scene", "read"],
    bg: { a: "img/bg_s7_a.png", b: "img/bg_s7_b.png", c: "img/bg_s7_c.png" },
    bgLabel: { a: "Valley with a church and a mosque", b: "Aerial: the South Caucasus between two seas", c: "Mountain road checkpoint at dusk" },
    heading: "Lines that fit no one",
    story: [
      "The Caucasus sits between Russia, Turkey, and Iran. It is a [[shatterbelt]]: a region caught between rival powers and cultures.",
      "Under the Soviet Union, Nagorno-Karabakh, an Armenian-majority region, was placed inside Azerbaijan. Nakhchivan, part of Azerbaijan, became an [[exclave]], cut off from the rest of the country by Armenia.",
      "When the USSR fell, Armenians in Karabakh wanted to join Armenia ([[irredentism]]), and a [[locational boundary dispute]] became war. After wars from 1988 to 1994 and in 2020, Azerbaijan retook the region in 2023 and nearly all of its Armenians fled. In 2025 the two countries initialed a peace deal that includes a route linking Azerbaijan to Nakhchivan. It has not been signed yet."
    ],
    terms: {
      "shatterbelt": "A region caught between very different, rival regions or powers; prone to instability.",
      "exclave": "Part of a state that is separated from the main territory by another country.",
      "irredentism": "A push to annex land where a country has cultural ties to the people or a historical claim.",
      "locational boundary dispute": "A disagreement over where a border should be and who owns the land. Also called a territorial dispute."
    },
    facts: [["~30,000", "Deaths before the 1994 cease-fire (AMSCO)"], ["~100,000", "Ethnic Armenians who fled Nagorno-Karabakh in 2023"], ["Aug 2025", "Peace deal initialed in Washington, not yet signed"]],
    voices: [
      { id: "anahit", name: "Anahit", age: 16, side: "Side A", where: "from Stepanakert, now in Yerevan", img: "img/portrait_s7_anahit.png",
        quote: "My family left Stepanakert in 2023 with one car and almost no warning. Now I live in Yerevan." },
      { id: "elnur", name: "Elnur", age: 16, side: "Side B", where: "Nakhchivan, Azerbaijan", img: "img/portrait_s7_elnur.png",
        quote: "To visit Baku, my family flies over Armenia or drives through Iran. A new road might change that." }
    ],
    map: {
      grid: [
        "GGGGGGGGGG",
        "TTAAAzzzzC",
        "TTAAAkzzzC",
        "TxAAAkkzzC",
        "TxxAAzzzzC",
        "TIxxAIIIIC",
        "IIIIIIIIII"
      ],
      regions: {
        G: { name: "Georgia", country: "Georgia" },
        T: { name: "Turkey", country: "Turkey" },
        A: { name: "Armenia", country: "Armenia" },
        z: { name: "Azerbaijan", country: "Azerbaijan" },
        k: { name: "Nagorno-Karabakh", country: "Azerbaijan" },
        x: { name: "Nakhchivan (Azerbaijani exclave)", country: "Azerbaijan" },
        I: { name: "Iran", country: "Iran" },
        C: { name: "Caspian Sea", country: "sea" }
      },
      layers: [
        { key: "rel", name: "Religion", values: { G: "Christian (Georgian Orthodox)", T: "Muslim", A: "Christian (Armenian Apostolic)", z: "Muslim", k: "Christian until 2023", x: "Muslim", I: "Muslim", C: "Sea" } },
        { key: "eth", name: "Ethnic majority", values: { G: "Georgian", T: "Turkish", A: "Armenian", z: "Azerbaijani", k: "Armenian until 2023", x: "Azerbaijani", I: "Persian and others", C: "Sea" } },
        { key: "sov", name: "Soviet-era lines", values: { G: "Georgian SSR", T: "Outside the USSR", A: "Armenian SSR", z: "Azerbaijani SSR", k: "Azerbaijani SSR", x: "Azerbaijani SSR", I: "Outside the USSR", C: "Sea" } }
      ],
      faults: [["k", "A"], ["k", "z"], ["x", "A"]],
      faultNote: "Soviet lines put an Armenian region inside Azerbaijan and cut Nakhchivan off by land.",
      question: {
        q: "Find Nakhchivan. What does someone there have to cross to reach the rest of Azerbaijan?",
        opts: [
          ["The Caspian Sea", false],
          ["Georgia", false],
          ["Armenia, or a detour through Iran", true],
          ["Nothing, because it shares a long land border.", false]
        ],
        why: "Nakhchivan is an exclave. The planned transit route through southern Armenia is meant to connect it, which is why it is part of the 2025 peace deal."
      }
    },
    source: {
      img: "img/source_s7.png", title: "A 1920s Soviet map of the Armenian and Azerbaijani republics",
      excerpt: "[The map shows Soviet internal borders. Nagorno-Karabakh is drawn inside the Azerbaijani republic, and Nakhchivan is separated from it by Armenia.]",
      who: "Soviet leaders in Moscow", when: "The 1920s",
      why: "To organize the region under Soviet rule. The lines did not match where each group lived."
    },
    scene: {
      img: "img/scene_s7.png", label: "Caucasus: church and mosque, two maps, checkpoint, surveyors",
      clues: [
        { label: "An Armenian church and a mosque in the same valley", img: "img/clue_s7_1.png", expect: "p", why: "Two communities, one valley, and a line that fits neither." },
        { label: "The same city marked two different ways on two maps", img: "img/clue_s7_2.png", expect: "p", why: "When each side names and claims the same place, the dispute is locational." },
        { label: "A checkpoint on the only road in", img: "img/clue_s7_3.png", expect: "p", why: "Controlling one road can cut a whole region off." },
        { label: "Surveyors marking the planned Nakhchivan transit route", img: "img/clue_s7_4.png", expect: "s", why: "A corridor agreement could ease the pressure on the exclave." }
      ]
    },
    hq: { surface: 5, pressure: "High", source: "Cultural mismatch", note: "Major quakes from 1988 to 2023. Pressure is easing now, but the deal is not yet signed." },
    think: "Why are shatterbelts more likely to produce irredentism than a place like the US-Canada border?"
  },

  /* ------------------------------------------------------------ 8 IRAQ KUWAIT */
  {
    id: "s8", num: 8, roman: "8", matchup: "D", short: "Iraq and Kuwait",
    title: "Iraq and Kuwait", place: "1990",
    steps: ["brief", "map", "scene", "read"],
    bg: { a: "img/bg_s8_a.png", b: "img/bg_s8_b.png", c: "img/bg_s8_c.png" },
    bgLabel: { a: "Desert oil field with border pillars", b: "Cutaway: oil under both sides of the line", c: "Desert at dusk, distant oil fires" },
    heading: "The fight was underground",
    story: [
      "The Rumaila oil field lies mostly under Iraq but reaches across the border into Kuwait. Iraq accused Kuwait of slant drilling: angling wells under the line to pump Iraqi oil. That is an [[allocational boundary dispute]].",
      "A border is a [[vertical plane]]: it runs down into the ground and up into the sky. So oil under the line is part of the border too.",
      "In August 1990, Iraq invaded and declared Kuwait its 19th province, an [[irredentism|irredentist]] claim. A US-led coalition pushed Iraq out in 1991, and a UN commission then demarcated the border on the ground."
    ],
    terms: {
      "allocational boundary dispute": "A disagreement over resources that cross a border, such as oil or water. Also called a resource dispute.",
      "vertical plane": "Borders extend down into the ground and up into the sky, not just across the surface.",
      "irredentism": "A push to annex land where a country has cultural ties to the people or a historical claim."
    },
    facts: [["Aug 2, 1990", "Iraq invades Kuwait"], ["600+", "Kuwaiti oil wells set on fire by retreating Iraqi troops"], ["1993", "A UN commission demarcates the border"]],
    voices: [
      { id: "fatima", name: "Fatima", age: 16, side: "Side A", where: "Kuwait City, Kuwait", img: "img/portrait_s8_fatima.png",
        quote: "In August 1990, my city woke up inside someone else's country." },
      { id: "haider", name: "Haider", age: 16, side: "Side B", where: "Basra, Iraq", img: "img/portrait_s8_haider.png",
        quote: "People in Basra said the oil was ours. Then the war came, and nobody won." }
    ],
    map: {
      grid: [
        "QQQQQQQQQQ",
        "QQQQQQQQQQ",
        "QQQQooQQGG",
        "QQQQoppWGG",
        "SSQQppWWWG",
        "SSSSWWWWWG",
        "SSSSSSWWGG"
      ],
      regions: {
        Q: { name: "Iraq", country: "Iraq" },
        o: { name: "Rumaila field (Iraq side)", country: "Iraq" },
        p: { name: "Rumaila field (Kuwait side)", country: "Kuwait" },
        W: { name: "Kuwait", country: "Kuwait" },
        S: { name: "Saudi Arabia", country: "Saudi Arabia" },
        G: { name: "Persian Gulf", country: "sea" }
      },
      layers: [
        { key: "oil", name: "Oil underground", values: { Q: "No major field here", o: "Rumaila oil field", p: "Rumaila oil field", W: "Other Kuwaiti fields", S: "No major field here", G: "Sea" } },
        { key: "surf", name: "Surface", values: { Q: "Flat desert", o: "Flat desert", p: "Flat desert", W: "Flat desert", S: "Flat desert", G: "Sea" } }
      ],
      faults: [["o", "p"]],
      faultNote: "The surface is the same on both sides. The pressure is underground, where one oil field crosses the line.",
      question: {
        q: "Switch to “Oil underground.” Where is the Rumaila oil field?",
        opts: [
          ["Only under Kuwait", false],
          ["Mostly in Iraq, reaching into Kuwait", true],
          ["Only under Saudi Arabia", false],
          ["Offshore in the Gulf, past both coastlines", false]
        ],
        why: "The field crosses the line underground. Because borders are vertical planes, whoever drills near the line can reach oil on the other side."
      }
    },
    source: {
      img: "img/source_s8.png", title: "Directional drilling diagram (AMSCO p. 225), with Iraq's 1990 complaint",
      excerpt: "[Iraq's government claimed that Kuwait was drilling slanted wells under the border to take oil from the Iraqi part of the Rumaila field.]",
      who: "Iraq's government", when: "July 1990",
      why: "To justify a move against Kuwait"
    },
    scene: {
      img: "img/scene_s8.png", label: "Iraq-Kuwait: slant well, oil prices, UN pillars, oil fires",
      clues: [
        { label: "A cross-section showing a slanted well under the line", img: "img/clue_s8_1.png", expect: "p", why: "The dispute is about resources below the surface." },
        { label: "Falling oil prices in 1990 hurting Iraq's war-debt payments", img: "img/clue_s8_2.png", expect: "p", why: "Money trouble raised the stakes of every barrel." },
        { label: "New UN border pillars in the desert, 1993", img: "img/clue_s8_3.png", expect: "s", why: "Demarcation by a neutral commission makes the line clear." },
        { label: "A black sky over burning oil wells", img: "img/clue_s8_4.png", expect: "p", why: "The stored pressure released in war." }
      ]
    },
    hq: { surface: 5, pressure: "High", source: "Resources", note: "A major quake: an allocational dispute that became an invasion." },
    think: "Why is a resource under a line harder to divide than land on top of it?"
  }
];

/* -------------------------------------------------- THE NEW CONTINENT */
/* Terrain: . sea  L land  M mountain  D desert  R river  I island */
const CONTINENT = {
  terrain: [
    "................",
    "...LLLLLLLLL....",
    "..LMLLLLLLLLL...",
    "..LMLLLDDLLLRL..",
    ".LLMLLDDDLLRLL..",
    ".LLMLLLDLLRLLL.I",
    ".LLMLLLLLRLLLL.I",
    "..LMLLLLRLLLL..I",
    "..LMLLLRLLLL....",
    "...LLLRLLLL.....",
    "....LLRLL.......",
    "................"
  ],
  oil: [[10, 5], [9, 6], [9, 5], [10, 6]],
  water: [[12, 3], [13, 4]],
  mines: [[5, 6], [5, 7]],
  pocket: [[10, 3]],
  oldLine: 8,
  lang: function (c, r) {
    if (CONTINENT.pocket.some(p => p[0] === c && p[1] === r)) return 3;
    if (c >= 15) return 4;
    if (c <= 4) return 1;
    if (r <= 4 && c <= 10) return 2;
    if (c >= 10) return 4;
    return 3;
  },
  rel: function (c, r) { return (r <= 5 && c < 15) ? "A" : "B"; },
  langNames: { 1: "Group 1 (Highland)", 2: "Group 2 (Northern)", 3: "Group 3 (Southern)", 4: "Group 4 (Eastern)" },
  relNames: { A: "Religion A", B: "Religion B" }
};

const STATE_COLORS = ["#2F7FC1", "#E07B39", "#3BA275", "#9A5BC2", "#C9A227"];

const BORDER_TYPES = [
  "Antecedent", "Subsequent", "Superimposed", "Physical consequent", "Cultural consequent", "Geometric"
];
const BORDER_FUNCTIONS = ["Open", "Controlled", "Militarized"];
const BORDER_STATUS = ["Defined only", "Defined and delimited", "Fully demarcated"];

const AGREEMENTS = [
  { key: "oil", label: "Joint drilling deal for the oil field" },
  { key: "water", label: "River water-sharing treaty" },
  { key: "refugee", label: "Shared plan for refugees at open borders" },
  { key: "pact", label: "Security pact among neighbors" },
  { key: "port", label: "Port-access treaty for any landlocked state" },
  { key: "corridor", label: "Corridor deal for any exclave" }
];

const AFTERSHOCKS = [
  { n: 1, title: "Oil is found deeper in the field under the river", year: 10, type: "Allocational (resource)", img: "img/event_01.png", up: "A line splits the oil field and there is no joint drilling deal: +2", down: "The field sits in one state, or there is a joint drilling deal: 0" },
  { n: 2, title: "Drought: the upstream state builds a dam", year: 15, type: "Allocational (resource)", img: "img/event_02.png", up: "The river runs through more than one state and there is no water treaty: +2 on borders that cross the river", down: "A water treaty is in place, or one state holds the whole river: 0" },
  { n: 3, title: "A refugee wave arrives from the northern power", year: 20, type: "Operational (functional)", img: "img/event_03.png", up: "Open borders with no shared refugee plan: +1 on every open border", down: "A shared plan is in place, or borders are controlled: 0" },
  { n: 4, title: "A language group split by a line demands to join its kin", year: 25, type: "Locational; irredentism", img: "img/event_04.png", up: "A border splits a language group: +2 on that border", down: "Borders follow the language edges: 0" },
  { n: 5, title: "Surveyors find two “highest ridges”", year: 30, type: "Definitional", img: "img/event_05.png", up: "A border in the mountains is defined only: +2", down: "Mountain borders were delimited or demarcated: 0" },
  { n: 6, title: "An outside power offers to build a military base", year: 35, type: "Shatterbelt pressure", img: "img/event_06.png", up: "The northeast state has no security pact: +2 on its borders", down: "A security pact is in place: +1" },
  { n: 7, title: "Fishing fleets clash near the islands", year: 40, type: "Allocational (EEZ)", img: "img/event_07.png", up: "The islands are held by a different state than the nearest coast, or the strait was split unfairly: +2 on the sea zones", down: "Zones were drawn and the strait was split at the midpoint: 0" },
  { n: 8, title: "A neighbor closes its port to a landlocked state", year: 45, type: "Operational (functional)", img: "img/event_08.png", up: "A state has no coast and no port-access treaty: +2 on its borders", down: "A port-access treaty is in place: +1" },
  { n: 9, title: "A neighbor closes the road to an exclave", year: 50, type: "Operational (functional)", img: "img/event_09.png", up: "A state is split into separate pieces with no corridor deal: +2 on its borders", down: "A corridor deal is in place: 0" },
  { n: 10, title: "A regional trade bloc forms and border checks drop", year: 50, type: "Stabilizing", img: "img/event_10.png", up: "(none)", down: "Every open or controlled border: subtract 1, down to a minimum of 1" }
];
