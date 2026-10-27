/* INRI — Study library: Works, Meals, Plants, Study, Christ, Beyond the Canon */

const WORKS_OF_JESUS = {
  intro: "A window into the works of Jesus — healings, exorcisms, nature signs, raisings, teachings, the cross, and appearances. Each points beyond itself to who He is and the Kingdom He brings.",
  categories: [
    {
      name: "Healings",
      items: [
        { title: "The Leper in Galilee", refs: "Matthew 8:1–4; Mark 1:40–45; Luke 5:12–16", note: "Jesus touches the unclean; purity flows outward. \"I am willing. Be clean.\"" },
        { title: "Ten Lepers", refs: "Luke 17:11–19", note: "Healed as they go; only the Samaritan returns. Faith and gratitude meet." },
        { title: "Paralytic Through the Roof", refs: "Mark 2:1–12", note: "Forgiveness first, then healing — authority on earth to forgive sins." },
        { title: "Pool of Bethesda", refs: "John 5:1–15", note: "Thirty-eight years. \"Do you want to get well?\" then \"Get up and walk.\"" },
        { title: "Blind Bartimaeus", refs: "Mark 10:46–52", note: "\"Son of David, have mercy.\" Persistence, faith, immediate discipleship." },
        { title: "Man Born Blind", refs: "John 9", note: "Mud and Siloam; physical and spiritual sight. Works of God displayed." },
        { title: "Woman with Twelve Years", refs: "Mark 5:25–34", note: "She touches His garment; power goes out. \"Daughter, your faith has healed you.\"" },
        { title: "Withered Hand on the Sabbath", refs: "Mark 3:1–6", note: "Doing good on the Sabbath; life over legalism." },
        { title: "Peter's Mother-in-Law", refs: "Mark 1:29–31", note: "Fever rebuked; she rises and serves — complete restoration." },
        { title: "Centurion's Servant", refs: "Matthew 8:5–13", note: "Healing at a distance; great faith of a Gentile officer." },
        { title: "Canaanite Woman's Daughter", refs: "Matthew 15:21–28", note: "Persistent, humble faith beyond Israel's borders." },
        { title: "Deaf-Mute (Ephphatha)", refs: "Mark 7:31–37", note: "\"Be opened!\" — intimate touch; Isaiah's restoration enacted." },
        { title: "Crippled Woman (18 Years)", refs: "Luke 13:10–17", note: "Daughter of Abraham set free on the Sabbath from Satan's bond." },
        { title: "Man with Dropsy", refs: "Luke 14:1–6", note: "Healing at a Pharisee's table; mercy over rigid rule-keeping." },
        { title: "Royal Official's Son", refs: "John 4:46–54", note: "\"Go, your son will live\" — word alone, at a distance, believed." }
      ]
    },
    {
      name: "Exorcisms",
      items: [
        { title: "Capernaum Synagogue", refs: "Mark 1:21–28", note: "Authority with a word — no formula. First Markan miracle." },
        { title: "Gerasene Demoniac", refs: "Mark 5:1–20", note: "Legion, the pigs, restoration to community and mission." },
        { title: "Epileptic Boy", refs: "Mark 9:14–29", note: "\"I believe; help my unbelief.\" Prayer and dependence." },
        { title: "Mary Magdalene", refs: "Luke 8:2; Mark 16:9", note: "Seven demons; she becomes first witness of the risen Lord." },
        { title: "Mute Demoniac / Beelzebul Charge", refs: "Matthew 12:22–30", note: "Kingdom of God has come upon you — by the Spirit of God." }
      ]
    },
    {
      name: "Nature & Provision",
      items: [
        { title: "Water to Wine", refs: "John 2:1–11", note: "First sign at Cana — joy, abundance, glory revealed." },
        { title: "Feeding the Five Thousand", refs: "All four Gospels", note: "Take, bless, break, give — pattern of the Lord's table." },
        { title: "Feeding the Four Thousand", refs: "Mark 8:1–10", note: "Compassion on the crowd; baskets leftover for Jew and Gentile." },
        { title: "Walking on Water", refs: "Matthew 14:22–33", note: "\"It is I\" — ego eimi over the chaos of the sea." },
        { title: "Calming the Storm", refs: "Mark 4:35–41", note: "Who is this, that even wind and sea obey Him?" },
        { title: "Miraculous Catch of Fish", refs: "Luke 5:1–11; John 21", note: "Call of the disciples — and restoration breakfast after resurrection." },
        { title: "Coin in the Fish's Mouth", refs: "Matthew 17:24–27", note: "Temple tax provided — sovereignty in the ordinary." },
        { title: "Withered Fig Tree", refs: "Mark 11:12–21", note: "Judgment on fruitless religion; faith that moves mountains." }
      ]
    },
    {
      name: "Raisings from the Dead",
      items: [
        { title: "Widow's Son at Nain", refs: "Luke 7:11–17", note: "Pure compassion — no request; life restored to the only son." },
        { title: "Jairus's Daughter", refs: "Mark 5:21–43", note: "Talitha koum — \"Little girl, get up.\"" },
        { title: "Lazarus", refs: "John 11", note: "\"I am the resurrection and the life.\" Jesus wept — then called him forth." }
      ]
    },
    {
      name: "Parables (selected)",
      items: [
        { title: "Sower", refs: "Mark 4:1–20", note: "The word goes out; reception depends on the heart's soil." },
        { title: "Mustard Seed & Leaven", refs: "Matthew 13:31–33", note: "Kingdom starts small and transforms the whole." },
        { title: "Hidden Treasure & Pearl", refs: "Matthew 13:44–46", note: "The Kingdom is worth everything." },
        { title: "Wheat and Tares", refs: "Matthew 13:24–30, 36–43", note: "Judgment waits until the harvest; patience with the mixed field." },
        { title: "Prodigal Son", refs: "Luke 15:11–32", note: "The Father who runs; grace that restores the lost." },
        { title: "Good Samaritan", refs: "Luke 10:25–37", note: "Neighbor love that crosses boundaries." },
        { title: "Rich Fool", refs: "Luke 12:13–21", note: "Life is not in abundance of possessions." },
        { title: "Great Banquet", refs: "Luke 14:15–24", note: "Invite the poor and the outsider; the table is for those who come." },
        { title: "Unforgiving Servant", refs: "Matthew 18:21–35", note: "Forgiven people forgive; mercy received must flow." },
        { title: "Ten Virgins", refs: "Matthew 25:1–13", note: "Watchful readiness for the Bridegroom." },
        { title: "Talents", refs: "Matthew 25:14–30", note: "Faithful stewardship until the Master returns." },
        { title: "Sheep and Goats", refs: "Matthew 25:31–46", note: "As you did it to the least, you did it to Me." }
      ]
    },
    {
      name: "Major Teachings",
      items: [
        { title: "Sermon on the Mount", refs: "Matthew 5–7", note: "Beatitudes, antitheses, Lord's Prayer, narrow way — Kingdom life." },
        { title: "Bread of Life Discourse", refs: "John 6", note: "\"I am the bread of life\" — food that endures to eternal life." },
        { title: "Good Shepherd", refs: "John 10", note: "The shepherd lays down His life; \"I and the Father are one.\"" },
        { title: "Farewell Discourse", refs: "John 14–16", note: "Spirit as Paraclete; peace, abiding, and coming trial." },
        { title: "High Priestly Prayer", refs: "John 17", note: "Jesus prays for His own — unity, protection, glory." },
        { title: "Olivet Discourse", refs: "Matthew 24–25", note: "Jerusalem's fall and the end — watch, endure, be ready." }
      ]
    },
    {
      name: "Seven Last Words",
      items: [
        { title: "Father, forgive them", refs: "Luke 23:34", note: "Intercession for executioners — grace at the height of violence." },
        { title: "Today you will be with me in paradise", refs: "Luke 23:43", note: "The most compressed Gospel: a guilty man receives everything." },
        { title: "Woman, behold your son", refs: "John 19:26–27", note: "Care for Mary; new family formed from the cross." },
        { title: "My God, my God, why have you forsaken me?", refs: "Matthew 27:46", note: "Psalm 22 — real God-forsakenness borne so we need not bear it alone." },
        { title: "I thirst", refs: "John 19:28", note: "The Lord of living water thirsts — full cost of incarnation." },
        { title: "It is finished", refs: "John 19:30", note: "Tetelestai — paid in full; the work of atonement complete." },
        { title: "Father, into your hands I commit my spirit", refs: "Luke 23:46", note: "Psalm 31:5 — voluntary surrender; death as gift, not defeat." }
      ]
    },
    {
      name: "Post-Resurrection Appearances",
      items: [
        { title: "Mary Magdalene", refs: "John 20:11–18", note: "Called by name; sent to announce the risen Lord." },
        { title: "Road to Emmaus", refs: "Luke 24:13–35", note: "Scripture opened, bread broken — Christ recognized." },
        { title: "The Ten (Thomas absent)", refs: "John 20:19–23", note: "Peace; wounds shown; Spirit breathed; forgiveness entrusted." },
        { title: "Thomas", refs: "John 20:24–29", note: "\"My Lord and my God!\" — blessed are those who believe without seeing." },
        { title: "Breakfast by the Sea", refs: "John 21", note: "Miraculous catch; charcoal fire; Peter restored three times." },
        { title: "Great Commission", refs: "Matthew 28:16–20", note: "All authority; make disciples; I am with you always." },
        { title: "Ascension", refs: "Acts 1:6–11", note: "Lifted up; promise of return; mission begins." }
      ]
    }
  ]
};

const BIBLICAL_MEALS = {
  intro: "Meals from Scripture — simple reconstructions you can prepare today. Food in the Bible is covenant, hospitality, and hope.",
  recipes: [
    { title: "Jacob's Red Lentil Stew", refs: "Genesis 25:29–34", note: "The ordinary bowl for which Esau sold a birthright.", ingredients: ["2 cups red lentils", "1 large onion, diced", "4–6 cloves garlic", "2 tbsp olive oil", "1 tbsp cumin, 1 tsp coriander, 1 tsp turmeric", "6 cups water or light broth", "Salt, lemon juice", "Flatbread"], method: "Sauté onion in oil until golden. Add garlic and spices. Stir in rinsed lentils and liquid. Simmer 20–25 minutes until thick. Season with salt and lemon. Serve with bread." },
    { title: "Abraham's Hospitality Flatbreads", refs: "Genesis 18:6–8", note: "Cakes of fine flour for unexpected guests under the oaks of Mamre.", ingredients: ["3 cups whole-wheat flour", "1 tsp salt", "1 tbsp olive oil", "About 1 cup warm water"], method: "Mix flour and salt, rub in oil, add water to a firm dough. Knead 8–10 minutes; rest 20 minutes. Flatten into thin rounds; cook on a hot dry pan 2–3 minutes per side." },
    { title: "Garden Bowl (Eden-style)", refs: "Genesis 1:29; 2:9", note: "Fruits, nuts, and honey — the first table of Scripture.", ingredients: ["Figs", "Pomegranate arils", "Dates", "Raisins", "Almonds or walnuts", "Honey or date syrup", "Cinnamon, optional mint"], method: "Arrange fruits in a bowl, scatter nuts, drizzle honey, dust with cinnamon. Serve with bread if desired." },
    { title: "Passover Elements (simplified)", refs: "Exodus 12:8–11", note: "Roast, unleavened bread, bitter herbs — remembrance of deliverance.", ingredients: ["Roasted lamb or lamb shoulder", "Unleavened flatbread (flour, water, salt)", "Bitter herbs (horseradish or romaine)", "Optional fruit-nut paste"], method: "Roast seasoned lamb. Mix flour, water, salt; roll thin and bake quickly. Serve with bitter herbs." },
    { title: "Honey from the Rock Plate", refs: "1 Samuel 14:27; Psalm 81:16", note: "Strength for the weary — honeycomb, cheese, and bread.", ingredients: ["Honey or honeycomb", "Fresh cheese or labneh", "Almonds or walnuts", "Figs", "Warm flatbread"], method: "Arrange on a board. Eat bread with cheese and honey. Optional: warm water with honey and cinnamon." },
    { title: "Nehemiah's Joy Feast Bread", refs: "Nehemiah 8:10", note: "\"Eat the fat and drink sweet wine… the joy of the LORD is your strength.\"", ingredients: ["3 cups flour, yeast, salt, olive oil, honey, water", "Sesame seeds", "Optional sweet wine or grape juice"], method: "Make soft leavened dough; shape loaves; top with seeds; bake until golden. Share portions — joy is not private." },
    { title: "Elijah's Cake under the Broom Tree", refs: "1 Kings 19:5–8", note: "Angel-provided bread and water for a prophet on the run.", ingredients: ["1 cup whole-wheat flour", "2 tbsp olive oil", "Pinch salt", "Water to make a firm dough", "Optional: a little honey"], method: "Mix into a simple dough; form a small cake. Bake or pan-cook until set. Serve with water." },
    { title: "Ruth's Field Lunch", refs: "Ruth 2:14", note: "Roasted grain, bread dipped in vinegar — kindness in the harvest field.", ingredients: ["Roasted grain or cooked freekeh/barley", "Flatbread", "Wine vinegar or diluted grape vinegar", "Optional olives or cheese"], method: "Warm the grain; tear bread and dip lightly in vinegar. Share as Boaz shared with Ruth." },
    { title: "Daniel's Pulse and Water", refs: "Daniel 1:12–15", note: "Vegetables and water — faithful simplicity in a foreign court.", ingredients: ["Lentils, beans, or chickpeas", "Vegetables (onion, greens, cucumber)", "Water", "Olive oil, salt, herbs"], method: "Cook legumes until soft; prepare vegetables; dress with oil and herbs." },
    { title: "Boy's Lunch — Loaves and Fish", refs: "John 6:9", note: "Five barley loaves and two fish — given into Jesus' hands.", ingredients: ["Barley or whole-grain rolls", "Sardines or simple cooked fish", "Optional herbs and oil"], method: "Simple packed lunch. The miracle is not the recipe but the surrender of what little we have." },
    { title: "Resurrection Breakfast", refs: "John 21:9–13", note: "Charcoal fire, fish, and bread on the shore — restored fellowship.", ingredients: ["Fish fillets", "Bread", "Olive oil", "Salt, lemon, herbs"], method: "Cook fish over heat. Serve with warm bread. The risen Lord cooks breakfast for failures He loves." },
    { title: "Last Supper Table (elements)", refs: "Mark 14:22–25; Luke 22:19–20", note: "Bread and cup — new covenant in His blood.", ingredients: ["Unleavened or simple bread", "Grape juice or wine"], method: "In remembrance: take, give thanks, break, share. \"Do this in remembrance of Me.\"" },
    { title: "Manna Meditation Bowl", refs: "Exodus 16; John 6:31–35", note: "Daily bread from heaven — trust for today, not hoarding for tomorrow.", ingredients: ["Cooked wheat berries or soft porridge", "Honey", "Optional coriander seed"], method: "Serve a modest bowl with honey. Pray for daily bread. Christ is the true bread from heaven." },
    { title: "Canaan Gift Basket", refs: "Genesis 43:11", note: "Balm, honey, pistachios, almonds — the finest of the land.", ingredients: ["Almonds", "Pistachios", "Figs or dates", "Honey or date syrup", "Optional raisins"], method: "Arrange nuts and dried fruit on a board; small dish of honey." }
  ]
};

const BIBLICAL_PLANTS = {
  intro: "Fifteen plants of Scripture — biblical context and traditional use. Historical and cultural notes, not medical advice.",
  plants: [
    { name: "Hyssop", hebrew: "Ezov", refs: "Psalm 51:7; Exodus 12:22; John 19:29", note: "Purification and Passover. Likely Syrian oregano (za'atar). Traditional tea for coughs; culinary herb." },
    { name: "Aloe", hebrew: "Ahaloth", refs: "Psalm 45:8; John 19:39", note: "Burial spices with myrrh. Aloe gel traditionally used for burns and skin (inner leaf only)." },
    { name: "Frankincense", hebrew: "Levonah", refs: "Exodus 30:34; Matthew 2:11", note: "Temple incense and Magi gift. Resin of Boswellia; traditional anti-inflammatory use of extract." },
    { name: "Myrrh", hebrew: "Mor", refs: "Exodus 30:23; Mark 15:23; John 19:39", note: "Anointing oil, beauty treatment, burial. Bitter resin; traditional antiseptic and perfume." },
    { name: "Olive", hebrew: "Zayit", refs: "Deuteronomy 8:8; Romans 11", note: "Oil for light, food, anointing. Central to Israel's diet and worship." },
    { name: "Fig", hebrew: "Te'enah", refs: "Genesis 3:7; Micah 4:4", note: "First clothing; symbol of peace under one's own fig tree." },
    { name: "Pomegranate", hebrew: "Rimon", refs: "Exodus 28:33; Deuteronomy 8:8", note: "Priestly robe and Temple decoration. Fruit of abundance." },
    { name: "Grape / Vine", hebrew: "Gefen", refs: "John 15:1; Psalm 104:15", note: "Wine that gladdens; Jesus the true vine." },
    { name: "Flax", hebrew: "Pishtan", refs: "Joshua 2:6; Proverbs 31:13", note: "Linen and seed. Ground flaxseed as food; linen for priestly garments." },
    { name: "Garlic & Onion", hebrew: "Shum / Batzal", refs: "Numbers 11:5", note: "Wilderness craving of Egypt's kitchen. Staple aromatics." },
    { name: "Mustard", hebrew: "Hardal", refs: "Matthew 13:31–32", note: "Smallest seed, great growth — Kingdom parable." },
    { name: "Mint, Dill, Cumin", hebrew: "—", refs: "Matthew 23:23; Isaiah 28:25", note: "Tithed herbs; everyday seasoning in traditional kitchens." },
    { name: "Cedar", hebrew: "Erez", refs: "1 Kings 6; Psalm 92:12", note: "Temple wood; strength and stature — symbol of rootedness." },
    { name: "Spikenard", hebrew: "Nerd", refs: "John 12:3; Song 1:12", note: "Costly perfume poured on Jesus' feet. Worship and devotion." },
    { name: "Wormwood", hebrew: "La'anah", refs: "Revelation 8:11; Lamentations 3:15", note: "Bitterness as judgment image. Traditional bitter; use only with care." }
  ]
};

const WHO_IS_JESUS = {
  intro: "Short Christology for the heart and mind — who He is, what He has done, and why it matters.",
  sections: [
    { title: "Eternal Son", body: "Before creation, the Word was with God and was God (John 1:1–3). All things were made through Him. He is not a creature but the eternal Son who entered history for us." },
    { title: "Fully God and Fully Human", body: "One person, two natures — without confusion or separation (Chalcedon). He grew tired, wept, and died as true man; He forgave sins, commanded nature, and received worship as true God." },
    { title: "Key Titles", body: "Messiah, Son of God, Son of Man, Lord (Kyrios), Lamb of God, Word, High Priest, Good Shepherd, Bread of Life, Alpha and Omega — each title is a claim about identity and mission." },
    { title: "The Cross", body: "He bore sin, defeated the powers, satisfied justice, and revealed love. \"It is finished\" is not defeat but completion. Theories of atonement describe facets of one saving work." },
    { title: "Risen and Reigning", body: "Bodily resurrection is the Father's vindication and the firstfruits of new creation. He ascended; a human life sits at the Father's right hand. He intercedes and will return." },
    { title: "With Us Always", body: "By the Spirit He builds His church, distributes gifts, and keeps His promise: \"I am with you always, to the end of the age\" (Matthew 28:20)." }
  ]
};

const STUDY_NOTES_EXTRA = {
  intro: "Light study notes on some of Scripture's hardest books — for honest reading, not easy answers.",
  books: [
    { name: "Job", refs: "Book of Job", points: ["Innocent suffering is not always punishment — God vindicates Job's honesty over the friends' neat theology (42:7).", "God's whirlwind answer does not explain the why; it relocates Job in the scale of creation and presence.", "The epilogue restores relationship and fortune; it does not reduce the book to a simple reward scheme."] },
    { name: "Revelation", refs: "Book of Revelation", points: ["Apocalyptic genre: symbols speak theologically to persecuted churches under Rome.", "Four common readings: preterist, historicist, futurist, idealist — many hold a blend with first-century grounding.", "Center: the slain-but-standing Lamb who holds history and will make all things new (chs. 5; 21–22)."] },
    { name: "Ecclesiastes", refs: "Book of Ecclesiastes", points: ["Hebel (\"vanity/breath\") names the limits of wisdom, pleasure, and work under the sun.", "Enjoyment passages counsel receiving simple gifts from God within those limits.", "Fear of God and keeping His commandments frame the book's sober wisdom (12:13)."] },
    { name: "Daniel", refs: "Book of Daniel", points: ["Court tales (1–6) and visions (7–12): faithfulness in empire and hope beyond empires.", "Son of Man (7:13–14) becomes central to Jesus' self-description and future hope.", "Read with humility about timelines; the pastoral aim is endurance and trust."] },
    { name: "Hebrews", refs: "Letter to the Hebrews", points: ["Jesus as High Priest after Melchizedek — once-for-all sacrifice and sitting down (10:12).", "Warning passages call for perseverance; traditions differ on how they relate to assurance.", "Faith chapter (11) ties Old Testament hope to the better thing God provides in Christ."] },
    { name: "Song of Songs", refs: "Song of Solomon", points: ["Hebrew love poetry with almost no explicit mention of God — and fully in the canon.", "Read as human covenant love, as allegory of God and His people, or both together.", "Its presence declares that embodied love is not shameful but can reflect divine love."] },
    { name: "Ezekiel", refs: "Book of Ezekiel", points: ["Throne-chariot visions (chs. 1, 10) fuel later apocalyptic and mystical tradition.", "Valley of dry bones (ch. 37): hope for a people who feel finished.", "Hard oracles and symbolic acts demand careful, humble reading."] },
    { name: "James", refs: "Letter of James", points: ["Faith without works is dead — not earning salvation, but living faith that acts (2:14–26).", "Strongest New Testament voice on economic justice and the exploitation of workers (5:1–6).", "Complements Paul: different errors, same gospel of transforming grace."] }
  ]
};

const BEYOND_THE_CANON = {
  intro: "Historical writings that circulated near the Bible — helpful for background, not part of the Protestant 66-book canon. Read with discernment.",
  disclaimer: "INRI's daily readings and Bible use the public-domain King James text. This section is for learning history and context only.",
  groups: [
    {
      name: "Deuterocanonical (Catholic/Orthodox)",
      items: [
        { title: "Tobit", note: "Pious exile, Raphael, and healing; strong on almsgiving and marriage prayer." },
        { title: "Judith", note: "Widow who saves her people — courage and holy-war irony." },
        { title: "1–2 Maccabees", note: "History of the revolt; Hanukkah; clear hope of resurrection in 2 Maccabees." },
        { title: "Wisdom of Solomon", note: "Greek-Jewish wisdom; immortality language; critique of idolatry." },
        { title: "Sirach (Ecclesiasticus)", note: "Ben Sira's wisdom; Praise of Famous Men; Torah as wisdom." }
      ]
    },
    {
      name: "Cited in the New Testament",
      items: [
        { title: "1 Enoch", note: "Quoted in Jude 14–15; Watchers, Son of Man, and judgment imagery that shaped Second Temple hope." },
        { title: "Assumption of Moses", note: "Background to Jude 9 (Michael and the devil disputing about Moses' body)." }
      ]
    },
    {
      name: "Lost books named in Scripture",
      items: [
        { title: "Book of the Wars of the LORD", note: "Cited in Numbers 21:14 — early victory poetry; contents otherwise lost." },
        { title: "Book of Jashar", note: "Cited in Joshua 10:13 and 2 Samuel 1:18 — heroic poems; only fragments survive in the canon." },
        { title: "Acts of Solomon / Royal Chronicles", note: "Sources the biblical writers point to for \"the rest of the acts\" of the kings." },
        { title: "Paul's other letters", note: "A prior Corinthian letter (1 Cor 5:9) and a letter to Laodicea (Col 4:16) are mentioned but not preserved." }
      ]
    },
    {
      name: "Early Christian (near-canon)",
      items: [
        { title: "Didache", note: "Early church manual: two ways, baptism, prayer, Eucharist, itinerant teachers." },
        { title: "1 Clement", note: "Rome to Corinth on order and humility; widely read in the second century." },
        { title: "Shepherd of Hermas", note: "Visions and repentance; in Codex Sinaiticus; valued but not finally canonical in the West." },
        { title: "Protevangelium of James", note: "Infancy traditions about Mary — source of later names and stories; not apostolic." }
      ]
    },
    {
      name: "Discoveries that illuminate the world of Jesus",
      items: [
        { title: "Dead Sea Scrolls", note: "Jewish community texts and biblical manuscripts — diversity of Second Temple faith and practice." },
        { title: "Nag Hammadi", note: "Gnostic library (1945); shows rival interpretations the early church rejected." }
      ]
    }
  ]
};

const GIFT_PRAYERS = [
  { name: "Word of Wisdom", prayer: "Father of wisdom, give me a word of wisdom when decisions exceed my understanding. Let what I speak serve others and honor Christ. Amen." },
  { name: "Word of Knowledge", prayer: "Holy Spirit, if You will, disclose what I could not know on my own — only for building up, healing, and truth in love. Amen." },
  { name: "Faith", prayer: "Lord, increase my faith for the work You assign. Help me trust You for what I cannot yet see. Amen." },
  { name: "Healing", prayer: "Jehovah Rapha, use me as You will for the comfort and healing of body, mind, and spirit. Your will be done. Amen." },
  { name: "Miracles", prayer: "God of wonders, I ask for courage to pray boldly and humility to leave results with You. Amen." },
  { name: "Prophecy", prayer: "Spirit of truth, if You give a word, let it strengthen, encourage, and comfort — tested by Scripture and love. Amen." },
  { name: "Discernment", prayer: "Lord, sharpen discernment of spirits. Guard me from fear and from gullibility; lead me in truth. Amen." },
  { name: "Tongues & Interpretation", prayer: "Holy Spirit, help me pray as You give utterance, and grant interpretation when the body needs to understand. Amen." },
  { name: "Mercy", prayer: "Father of mercies, give me Your eyes for the hurting and strength to stay present without burning out. Amen." },
  { name: "Helps / Service", prayer: "Lord Jesus, who washed feet, give me joy in unseen service and endurance for practical love. Amen." },
  { name: "Giving", prayer: "Generous Father, loosen my grip; make me a cheerful conduit of what You entrust. Amen." },
  { name: "Hospitality", prayer: "Christ who welcomed sinners, open my home and heart to the stranger and the lonely. Amen." },
  { name: "General", prayer: "Holy Spirit, distribute gifts as You will. I open myself to be useful — not impressive — for the building of the body and the glory of Jesus. Amen." }
];
