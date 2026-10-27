/* INRI — Study library: Works of Jesus, Meals, Plants, Study notes, Gift prayers */

const WORKS_OF_JESUS = {
  intro: "A window into the works of Jesus — healings, exorcisms, nature signs, raisings, and major teachings. Each points beyond itself to who He is and the Kingdom He brings.",
  categories: [
    {
      name: "Healings",
      items: [
        { title: "The Leper in Galilee", refs: "Matthew 8:1–4; Mark 1:40–45; Luke 5:12–16", note: "Jesus touches the unclean and purity flows outward. \"I am willing. Be clean.\"" },
        { title: "Ten Lepers", refs: "Luke 17:11–19", note: "Healed as they go; only the Samaritan returns in thanks. Faith and gratitude meet." },
        { title: "Paralytic Through the Roof", refs: "Mark 2:1–12", note: "Forgiveness first, then healing — authority on earth to forgive sins." },
        { title: "Pool of Bethesda", refs: "John 5:1–15", note: "Thirty-eight years of waiting. \"Do you want to get well?\" then \"Get up and walk.\"" },
        { title: "Blind Bartimaeus", refs: "Mark 10:46–52", note: "\"Son of David, have mercy.\" Persistence, faith, and immediate discipleship." },
        { title: "Man Born Blind", refs: "John 9", note: "Mud and Siloam; physical and spiritual sight. Works of God displayed." },
        { title: "Woman with Twelve Years", refs: "Mark 5:25–34", note: "She touches His garment; power goes out. \"Daughter, your faith has healed you.\"" },
        { title: "Withered Hand on the Sabbath", refs: "Mark 3:1–6", note: "Doing good on the Sabbath; life over legalism." }
      ]
    },
    {
      name: "Exorcisms",
      items: [
        { title: "Capernaum Synagogue", refs: "Mark 1:21–28", note: "First Markan miracle. Authority with a word — no formula." },
        { title: "Gerasene Demoniac", refs: "Mark 5:1–20", note: "Legion, the pigs, and restoration to community and mission." },
        { title: "Epileptic Boy", refs: "Mark 9:14–29", note: "\"I believe; help my unbelief.\" Prayer and dependence." }
      ]
    },
    {
      name: "Nature & Provision",
      items: [
        { title: "Water to Wine", refs: "John 2:1–11", note: "First sign at Cana — joy, abundance, and glory revealed." },
        { title: "Feeding the Five Thousand", refs: "All four Gospels", note: "Take, bless, break, give — pattern of the table of the Lord." },
        { title: "Walking on Water", refs: "Matthew 14:22–33", note: "\"It is I\" — ego eimi over the chaos of the sea." },
        { title: "Calming the Storm", refs: "Mark 4:35–41", note: "Who is this, that even wind and sea obey Him?" }
      ]
    },
    {
      name: "Raisings from the Dead",
      items: [
        { title: "Widow's Son at Nain", refs: "Luke 7:11–17", note: "Pure compassion — no request asked; life restored." },
        { title: "Jairus's Daughter", refs: "Mark 5:21–43", note: "Talitha koum — \"Little girl, get up.\"" },
        { title: "Lazarus", refs: "John 11", note: "\"I am the resurrection and the life.\" Jesus wept — then called him forth." }
      ]
    },
    {
      name: "Major Teachings",
      items: [
        { title: "Sermon on the Mount", refs: "Matthew 5–7", note: "Beatitudes, antitheses, Lord's Prayer, narrow way — Kingdom life." },
        { title: "Parable of the Prodigal", refs: "Luke 15:11–32", note: "The Father who runs; grace that restores the lost." },
        { title: "Good Samaritan", refs: "Luke 10:25–37", note: "Neighbor love that crosses boundaries." },
        { title: "Bread of Life", refs: "John 6", note: "\"I am the bread of life\" — food that endures to eternal life." },
        { title: "High Priestly Prayer", refs: "John 17", note: "Jesus prays for His own — unity, protection, glory." }
      ]
    }
  ]
};

const BIBLICAL_MEALS = {
  intro: "Meals from Scripture — simple reconstructions you can prepare today. Food in the Bible is covenant, hospitality, and hope.",
  recipes: [
    {
      title: "Jacob's Red Lentil Stew",
      refs: "Genesis 25:29–34",
      note: "The ordinary bowl for which Esau sold a birthright.",
      ingredients: [
        "2 cups red lentils",
        "1 large onion, diced",
        "4–6 cloves garlic",
        "2 tbsp olive oil",
        "1 tbsp cumin, 1 tsp coriander, 1 tsp turmeric",
        "6 cups water or light broth",
        "Salt, lemon juice",
        "Flatbread for serving"
      ],
      method: "Sauté onion in oil until golden. Add garlic and spices. Stir in rinsed lentils and liquid. Simmer 20–25 minutes until thick. Season with salt and lemon. Serve with bread."
    },
    {
      title: "Abraham's Hospitality Flatbreads",
      refs: "Genesis 18:6–8",
      note: "Cakes of fine flour for unexpected guests under the oaks of Mamre.",
      ingredients: [
        "3 cups whole-wheat flour",
        "1 tsp salt",
        "1 tbsp olive oil",
        "About 1 cup warm water"
      ],
      method: "Mix flour and salt, rub in oil, add water to a firm dough. Knead 8–10 minutes; rest 20 minutes. Flatten into thin rounds; cook on a hot dry pan 2–3 minutes per side until spotted."
    },
    {
      title: "Garden Bowl (Eden-style)",
      refs: "Genesis 1:29; 2:9",
      note: "Fruits, nuts, and honey — the first table of Scripture.",
      ingredients: [
        "Figs (fresh or rehydrated)",
        "Pomegranate arils",
        "Dates",
        "Raisins",
        "Almonds or walnuts",
        "Honey or date syrup",
        "Cinnamon, optional mint"
      ],
      method: "Arrange fruits in a bowl, scatter nuts, drizzle honey, dust with cinnamon. Serve with bread if desired."
    },
    {
      title: "Passover Elements (simplified)",
      refs: "Exodus 12:8–11",
      note: "Roast, unleavened bread, bitter herbs — remembrance of deliverance.",
      ingredients: [
        "Roasted lamb or lamb shoulder",
        "Unleavened flatbread (flour, water, salt — baked quickly)",
        "Bitter herbs (horseradish or romaine)",
        "Optional: fruit-nut paste (dates, nuts, wine)"
      ],
      method: "Roast seasoned lamb. Mix flour, water, salt; roll thin and bake under 18 minutes for matzah-style bread. Serve with bitter herbs."
    },
    {
      title: "Honey from the Rock Plate",
      refs: "1 Samuel 14:27; Psalm 81:16",
      note: "Strength for the weary — honeycomb, cheese, and bread.",
      ingredients: [
        "Raw honeycomb or good honey",
        "Fresh cheese or labneh",
        "Almonds or walnuts",
        "Figs",
        "Warm flatbread"
      ],
      method: "Arrange on a board. Eat bread with cheese and honey. Optional: warm water with honey and a pinch of cinnamon."
    },
    {
      title: "Nehemiah's Joy Feast Bread",
      refs: "Nehemiah 8:10",
      note: "\"Eat the fat and drink sweet wine… the joy of the LORD is your strength.\"",
      ingredients: [
        "3 cups flour, yeast, salt, olive oil, honey, water",
        "Sesame seeds",
        "Optional sweet wine or grape juice with honey and spice"
      ],
      method: "Make a soft leavened dough; braid or shape loaves; top with seeds; bake until golden. Share portions — joy is not private."
    }
  ]
};

const BIBLICAL_PLANTS = {
  intro: "Fifteen plants of Scripture — biblical context and traditional use. Historical and cultural notes, not medical advice.",
  plants: [
    { name: "Hyssop", hebrew: "Ezov", refs: "Psalm 51:7; Exodus 12:22; John 19:29", note: "Purification and Passover. Likely Syrian oregano (za'atar). Traditional tea for coughs; culinary herb." },
    { name: "Aloe", hebrew: "Ahaloth", refs: "Psalm 45:8; John 19:39", note: "Burial spices with myrrh. Aloe gel traditionally used for burns and skin (inner leaf only)." },
    { name: "Frankincense", hebrew: "Levonah", refs: "Exodus 30:34; Matthew 2:11", note: "Temple incense and Magi gift. Resin of Boswellia; traditional anti-inflammatory use of extract." },
    { name: "Myrrh", hebrew: "Mor", refs: "Exodus 30:23; Mark 15:23; John 19:39", note: "Anointing oil, beauty treatment, burial. Bitter resin; traditional antiseptic and perfume." },
    { name: "Olive", hebrew: "Zayit", refs: "Deuteronomy 8:8; Romans 11", note: "Oil for light, food, anointing. Central to Israel’s diet and worship." },
    { name: "Fig", hebrew: "Te'enah", refs: "Genesis 3:7; Micah 4:4", note: "First clothing; symbol of peace under one’s own fig tree. Fruit and leaves in diet and proverb." },
    { name: "Pomegranate", hebrew: "Rimon", refs: "Exodus 28:33; Deuteronomy 8:8", note: "Priestly robe and Temple decoration. Fruit of abundance; juice rich in traditional use." },
    { name: "Grape / Vine", hebrew: "Gefen", refs: "John 15:1; Psalm 104:15", note: "Wine that gladdens; Jesus the true vine. Fruit, leaves, and seed in food and tradition." },
    { name: "Flax", hebrew: "Pishtan", refs: "Joshua 2:6; Proverbs 31:13", note: "Linen and seed. Ground flaxseed used as food; linen for priestly garments." },
    { name: "Garlic & Onion", hebrew: "Shum / Batzal", refs: "Numbers 11:5", note: "Wilderness craving of Egypt’s kitchen. Staple aromatics of the ancient diet." },
    { name: "Mustard", hebrew: "Hardal", refs: "Matthew 13:31–32", note: "Smallest seed, great growth — Kingdom parable. Culinary and traditional use." },
    { name: "Mint, Dill, Cumin", hebrew: "—", refs: "Matthew 23:23; Isaiah 28:25", note: "Tithed herbs; everyday seasoning and digestion in traditional kitchens." },
    { name: "Cedar", hebrew: "Erez", refs: "1 Kings 6; Psalm 92:12", note: "Temple wood; strength and stature. Not a food plant — symbol of rootedness." },
    { name: "Spikenard", hebrew: "Nerd", refs: "John 12:3; Song 1:12", note: "Costly perfume poured on Jesus’ feet. Worship and devotion." },
    { name: "Wormwood", hebrew: "La'anah", refs: "Revelation 8:11; Lamentations 3:15", note: "Bitterness as judgment image. Traditional bitter; use only with care and knowledge." }
  ]
};

const STUDY_NOTES_EXTRA = {
  intro: "Light study notes on some of Scripture’s hardest books — for honest reading, not easy answers.",
  books: [
    {
      name: "Job",
      refs: "Book of Job",
      points: [
        "Innocent suffering is not always punishment — God vindicates Job’s honesty over the friends’ neat theology (42:7).",
        "God’s whirlwind answer does not explain the why; it relocates Job in the scale of creation and presence.",
        "The epilogue restores relationship and fortune; it does not reduce the book to a simple reward scheme."
      ]
    },
    {
      name: "Revelation",
      refs: "Book of Revelation",
      points: [
        "Apocalyptic genre: symbols (beasts, numbers, Babylon) speak theologically and pastorally to persecuted churches under Rome.",
        "Four common readings: preterist, historicist, futurist, idealist — many readers hold a blend with first-century grounding.",
        "Center: the slain-but-standing Lamb who holds history and will make all things new (chs. 5; 21–22)."
      ]
    },
    {
      name: "Ecclesiastes",
      refs: "Book of Ecclesiastes",
      points: [
        "Hebel (“vanity/breath”) names the limits of wisdom, pleasure, and work under the sun.",
        "Enjoyment passages counsel receiving simple gifts from God within those limits.",
        "Fear of God and keeping His commandments frame the book’s sober wisdom (12:13)."
      ]
    },
    {
      name: "Daniel",
      refs: "Book of Daniel",
      points: [
        "Court tales (1–6) and visions (7–12): faithfulness in empire and hope beyond empires.",
        "Son of Man (7:13–14) becomes central to Jesus’ self-description and future hope.",
        "Read with humility about timelines; the book’s pastoral aim is endurance and trust."
      ]
    },
    {
      name: "Hebrews",
      refs: "Letter to the Hebrews",
      points: [
        "Jesus as High Priest after Melchizedek — once-for-all sacrifice and sitting down (10:12).",
        "Warning passages call for perseverance; traditions differ on how they relate to assurance.",
        "Faith chapter (11) ties Old Testament hope to the better thing God provides in Christ."
      ]
    }
  ]
};

const GIFT_PRAYERS = [
  {
    name: "Word of Wisdom",
    prayer: "Father of wisdom, give me a word of wisdom when decisions exceed my understanding. Let what I speak serve others and honor Christ. Amen."
  },
  {
    name: "Word of Knowledge",
    prayer: "Holy Spirit, if You will, disclose what I could not know on my own — only for building up, healing, and truth in love. Amen."
  },
  {
    name: "Faith",
    prayer: "Lord, increase my faith for the work You assign. Help me trust You for what I cannot yet see. Amen."
  },
  {
    name: "Healing",
    prayer: "Jehovah Rapha, use me as You will for the comfort and healing of body, mind, and spirit. Your will be done. Amen."
  },
  {
    name: "Miracles",
    prayer: "God of wonders, I ask for courage to pray boldly and humility to leave results with You. Amen."
  },
  {
    name: "Prophecy",
    prayer: "Spirit of truth, if You give a word, let it strengthen, encourage, and comfort — tested by Scripture and love. Amen."
  },
  {
    name: "Discernment",
    prayer: "Lord, sharpen discernment of spirits. Guard me from fear and from gullibility; lead me in truth. Amen."
  },
  {
    name: "Tongues & Interpretation",
    prayer: "Holy Spirit, help me pray as You give utterance, and grant interpretation when the body needs to understand. Amen."
  },
  {
    name: "Mercy",
    prayer: "Father of mercies, give me Your eyes for the hurting and strength to stay present without burning out. Amen."
  },
  {
    name: "Helps / Service",
    prayer: "Lord Jesus, who washed feet, give me joy in unseen service and endurance for practical love. Amen."
  },
  {
    name: "Giving",
    prayer: "Generous Father, loosen my grip; make me a cheerful conduit of what You entrust. Amen."
  },
  {
    name: "Hospitality",
    prayer: "Christ who welcomed sinners, open my home and heart to the stranger and the lonely. Amen."
  },
  {
    name: "General",
    prayer: "Holy Spirit, distribute gifts as You will. I open myself to be useful — not impressive — for the building of the body and the glory of Jesus. Amen."
  }
];
