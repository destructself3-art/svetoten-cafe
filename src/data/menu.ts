// Menu content. Seeded into the database by prisma/seed.ts; the site reads it from the database
// so the stop-list in the admin panel works.

export type LayerKind =
  | "espresso"
  | "crema"
  | "americano"
  | "milk"
  | "foam"
  | "raf"
  | "caramel"
  | "filter"
  | "tonic"
  | "coldbrew";

export type Vessel = "demitasse" | "gibraltar" | "cup" | "small-cup" | "glass" | "highball" | "carafe";

export type Anatomy = {
  vessel: Vessel;
  cold?: boolean;
  /** Bottom to top */
  layers: { kind: LayerKind; ml: number }[];
};

export type CategorySeed = {
  slug: string;
  title: string;
  subtitle: string;
  daypart: "morning" | "day" | "evening" | "allday";
  serves: string;
  items: ItemSeed[];
};

export type ItemSeed = {
  slug: string;
  title: string;
  description: string;
  price: number;
  priceAlt?: number;
  unit?: string;
  unitAlt?: string;
  tags?: string[];
  photo?: string;
  anatomy?: Anatomy;
};

export const MENU: CategorySeed[] = [
  {
    slug: "coffee",
    title: "Кофе",
    subtitle: "Обжариваем сами по вторникам. Зерно недели: Эфиопия, Иргачеффе, мытая обработка.",
    daypart: "allday",
    serves: "весь день",
    items: [
      {
        slug: "espresso",
        title: "Эспрессо",
        description: "Двойной шот на зерне недели. Плотный, с нотами абрикоса и какао.",
        price: 190,
        unit: "40 мл",
        photo: "menu-espresso",
        anatomy: { vessel: "demitasse", layers: [{ kind: "espresso", ml: 34 }, { kind: "crema", ml: 8 }] },
      },
      {
        slug: "americano",
        title: "Американо",
        description: "Эспрессо поверх горячей воды, чтобы сохранить крему. Молоко по желанию.",
        price: 230,
        unit: "200 мл",
        anatomy: { vessel: "cup", layers: [{ kind: "americano", ml: 150 }, { kind: "espresso", ml: 40 }, { kind: "crema", ml: 8 }] },
      },
      {
        slug: "cortado",
        title: "Кортадо",
        description: "Эспрессо и равная доля тёплого молока. Коротко и мягко.",
        price: 250,
        unit: "110 мл",
        anatomy: { vessel: "gibraltar", layers: [{ kind: "espresso", ml: 40 }, { kind: "milk", ml: 55 }, { kind: "foam", ml: 12 }] },
      },
      {
        slug: "cappuccino",
        title: "Капучино",
        description: "Эспрессо, молоко и плотная бархатная пена. Альтернативное молоко +60 ₽.",
        price: 290,
        priceAlt: 350,
        unit: "250 мл",
        unitAlt: "350 мл",
        photo: "menu-cappuccino",
        anatomy: { vessel: "cup", layers: [{ kind: "espresso", ml: 40 }, { kind: "milk", ml: 120 }, { kind: "foam", ml: 85 }] },
      },
      {
        slug: "flat-white",
        title: "Флэт уайт",
        description: "Двойной эспрессо и тонкий слой микропены. Кофе чувствуется сильнее, чем в капучино.",
        price: 320,
        unit: "180 мл",
        photo: "menu-flat-white",
        anatomy: { vessel: "small-cup", layers: [{ kind: "espresso", ml: 60 }, { kind: "milk", ml: 105 }, { kind: "foam", ml: 15 }] },
      },
      {
        slug: "latte",
        title: "Латте",
        description: "Много молока и немного пены. Самый мягкий кофе в меню.",
        price: 310,
        priceAlt: 370,
        unit: "300 мл",
        unitAlt: "400 мл",
        photo: "menu-latte",
        anatomy: { vessel: "glass", layers: [{ kind: "espresso", ml: 40 }, { kind: "milk", ml: 215 }, { kind: "foam", ml: 45 }] },
      },
      {
        slug: "raf",
        title: "Раф «Светотень»",
        description: "Эспрессо, сливки и жжёная карамель, взбитые вместе. Сверху карамельная крошка и морская соль.",
        price: 420,
        unit: "300 мл",
        tags: ["signature"],
        photo: "menu-raf",
        anatomy: { vessel: "glass", layers: [{ kind: "raf", ml: 255 }, { kind: "foam", ml: 38 }, { kind: "caramel", ml: 7 }] },
      },
      {
        slug: "v60",
        title: "Фильтр V60",
        description: "Зерно недели вручную через воронку: чисто, ярко, с кислинкой. Подаём в графине.",
        price: 380,
        unit: "300 мл",
        photo: "menu-v60",
        anatomy: { vessel: "carafe", layers: [{ kind: "filter", ml: 300 }] },
      },
      {
        slug: "espresso-tonic",
        title: "Эспрессо-тоник",
        description: "Тоник, лёд, апельсиновая цедра и шот эспрессо сверху. Освежает лучше лимонада.",
        price: 390,
        unit: "300 мл",
        photo: "menu-espresso-tonic",
        anatomy: { vessel: "highball", cold: true, layers: [{ kind: "tonic", ml: 200 }, { kind: "espresso", ml: 40 }] },
      },
      {
        slug: "cold-brew",
        title: "Колд брю",
        description: "Настаиваем 18 часов в холоде. Подаём со льдом, без горечи.",
        price: 350,
        unit: "300 мл",
        anatomy: { vessel: "highball", cold: true, layers: [{ kind: "coldbrew", ml: 250 }] },
      },
    ],
  },
  {
    slug: "tea",
    title: "Чай и не кофе",
    subtitle: "Листовой чай чайниками на двоих, какао и матча.",
    daypart: "allday",
    serves: "весь день",
    items: [
      { slug: "sea-buckthorn-tea", title: "Облепиховый чай", description: "Облепиха, апельсин, чабрец и мёд. Чайник на двоих.", price: 460, unit: "600 мл", photo: "menu-sea-buckthorn-tea", tags: ["signature"] },
      { slug: "ivan-tea", title: "Иван-чай с чабрецом", description: "Ферментированный кипрей из Карелии. Мягкий, с медовыми нотами.", price: 320, unit: "600 мл" },
      { slug: "milk-oolong", title: "Молочный улун", description: "Тайваньский улун со сливочным послевкусием.", price: 380, unit: "600 мл" },
      { slug: "cacao", title: "Какао на овсяном", description: "Тёмный шоколад 70% и овсяное молоко. Густое, почти как десерт.", price: 360, unit: "300 мл", tags: ["vegan"], photo: "menu-cacao" },
      { slug: "matcha", title: "Айс-матча латте", description: "Церемониальная матча, молоко и лёд.", price: 390, unit: "300 мл", photo: "menu-matcha" },
    ],
  },
  {
    slug: "breakfast",
    title: "Завтраки",
    subtitle: "Подаём до 16:00, в выходные до 17:00.",
    daypart: "morning",
    serves: "08:00–16:00",
    items: [
      { slug: "syrniki", title: "Сырники", description: "Из фермерского творога, со сметаной и ягодным соусом. Жарим на топлёном масле.", price: 490, unit: "4 шт.", tags: ["signature", "veg"], photo: "menu-syrniki" },
      { slug: "eggs-benedict", title: "Яйца бенедикт с лососем", description: "Бриошь, два яйца пашот, слабосолёный лосось и голландский соус.", price: 720, unit: "270 г", photo: "menu-eggs-benedict" },
      { slug: "shakshuka", title: "Шакшука с фетой", description: "Томаты, сладкий перец и копчёная паприка, два яйца, хлеб на закваске.", price: 590, unit: "350 г", tags: ["veg", "spicy"], photo: "menu-shakshuka" },
      { slug: "ricotta-toast", title: "Тост с рикоттой и инжиром", description: "Хлеб на закваске, взбитая рикотта, свежий инжир, мёд и фисташки.", price: 540, unit: "220 г", tags: ["veg"], photo: "menu-ricotta-toast" },
      { slug: "porridge", title: "Овсянка с печёной грушей", description: "На кокосовом молоке, с корицей, миндалём и кленовым сиропом.", price: 420, unit: "300 г", tags: ["vegan"], photo: "menu-porridge" },
      { slug: "granola", title: "Гранола с облепихой", description: "Домашняя гранола, греческий йогурт, облепиховое пюре и ягоды.", price: 450, unit: "280 г", tags: ["veg"], photo: "menu-granola" },
      { slug: "croque", title: "Круассан с ветчиной и сыром", description: "Тёплый, с ветчиной, грюйером и соусом бешамель.", price: 460, unit: "180 г" },
    ],
  },
  {
    slug: "bakery",
    title: "Из печи",
    subtitle: "Круассаны выходят каждые 40 минут. К полудню печём канеле.",
    daypart: "morning",
    serves: "с открытия",
    items: [
      { slug: "croissant", title: "Круассан", description: "На сливочном масле 82%, слоёный до хруста.", price: 240, unit: "80 г", tags: ["veg"], photo: "menu-croissant" },
      { slug: "cardamom-bun", title: "Кардамоновая булочка", description: "Шведская, завязанная узелком, с жемчужным сахаром.", price: 260, unit: "90 г", tags: ["veg"], photo: "menu-cardamom-bun" },
      { slug: "pain-au-chocolat", title: "Пен-о-шоколя", description: "Слоёное тесто и две палочки тёмного шоколада.", price: 270, unit: "85 г", tags: ["veg"] },
      { slug: "canele", title: "Канеле", description: "Карамельная корочка и ром-ванильная мякоть.", price: 190, unit: "1 шт.", tags: ["veg"], photo: "menu-canele" },
    ],
  },
  {
    slug: "lunch",
    title: "Обеды",
    subtitle: "Суп дня, салаты и паста. В будни с 12 до 16 ланч за 690 ₽.",
    daypart: "day",
    serves: "12:00–18:00",
    items: [
      { slug: "weekday-lunch", title: "Ланч по будням", description: "Суп дня и салат или паста, морс. С 12 до 16 часов.", price: 690, tags: ["new"] },
      { slug: "pumpkin-soup", title: "Тыквенный крем-суп", description: "С копчёной паприкой, тыквенными семечками и хлебом на закваске.", price: 450, unit: "300 г", tags: ["veg"], photo: "menu-pumpkin-soup" },
      { slug: "borscht", title: "Борщ с говяжьей щекой", description: "Томлёная щека, сметана, укроп и ржаной хлеб.", price: 520, unit: "350 г", photo: "menu-borscht" },
      { slug: "beet-salad", title: "Салат с печёной свёклой", description: "Две свёклы, козий сыр, фундук, апельсин и руккола.", price: 590, unit: "240 г", tags: ["veg", "gf"], photo: "menu-beet-salad" },
      { slug: "pasta", title: "Тальятелле с цукини", description: "Цукини, лимонная цедра, пармезан и сливочное масло.", price: 690, unit: "300 г", tags: ["veg"], photo: "menu-pasta" },
      { slug: "focaccia", title: "Фокачча с моцареллой", description: "Томаты, моцарелла и песто из базилика. Разрезаем пополам, чтобы удобно делиться.", price: 560, unit: "260 г", tags: ["veg"], photo: "menu-focaccia" },
      { slug: "salmon-bowl", title: "Боул с лососем терияки", description: "Рис жасмин, эдамаме, огурец, авокадо, маринованный имбирь.", price: 790, unit: "380 г", photo: "menu-salmon-bowl" },
    ],
  },
  {
    slug: "desserts",
    title: "Десерты",
    subtitle: "Весь день. Фондан готовим 12 минут, закажите заранее.",
    daypart: "allday",
    serves: "весь день",
    items: [
      { slug: "basque-cheesecake", title: "Баскский чизкейк", description: "Подпечённый сверху, кремовый внутри.", price: 420, unit: "140 г", tags: ["veg"], photo: "menu-basque-cheesecake" },
      { slug: "medovik", title: "Медовик с солёной карамелью", description: "Двенадцать коржей на гречишном мёде.", price: 390, unit: "150 г", tags: ["signature", "veg"], photo: "menu-medovik" },
      { slug: "tiramisu", title: "Тирамису", description: "Маскарпоне, савоярди и наш эспрессо.", price: 450, unit: "160 г", tags: ["veg"], photo: "menu-tiramisu" },
      { slug: "fondant", title: "Шоколадный фондан", description: "С жидкой серединой и ванильным мороженым.", price: 490, unit: "150 г", tags: ["veg"], photo: "menu-fondant" },
    ],
  },
  {
    slug: "plates",
    title: "Маленькие тарелки",
    subtitle: "Берите несколько на стол: так и задумано.",
    daypart: "evening",
    serves: "с 18:00",
    items: [
      { slug: "burrata", title: "Буррата с томатами", description: "Черри трёх цветов, базиликовое масло, крупная соль.", price: 890, unit: "250 г", tags: ["veg", "gf"], photo: "menu-burrata" },
      { slug: "tartare", title: "Тартар из говядины", description: "Вырезка, желток, каперсы, шалот и хрустящие тосты.", price: 890, unit: "180 г", photo: "menu-tartare" },
      { slug: "cheese-board", title: "Сырная доска", description: "Три сыра тверской сыроварни, мёд, орехи и инжир.", price: 1150, unit: "300 г", tags: ["veg"], photo: "menu-cheese-board" },
      { slug: "bruschetta", title: "Брускетты, три вкуса", description: "Паштет из печени с вишней, томаты с базиликом, рикотта с мёдом.", price: 590, unit: "3 шт.", photo: "menu-bruschetta" },
      { slug: "scallop-crudo", title: "Крудо из гребешка", description: "Магаданский гребешок, цитрусы, фенхель и укропное масло.", price: 990, unit: "140 г", tags: ["gf"], photo: "menu-scallop-crudo" },
      { slug: "olives", title: "Оливки и хлеб на закваске", description: "Тёплые оливки с цедрой и розмарином.", price: 390, unit: "200 г", tags: ["vegan"] },
    ],
  },
  {
    slug: "mains",
    title: "Горячее",
    subtitle: "Кухня принимает заказы до 23:00, в пятницу и субботу до полуночи.",
    daypart: "evening",
    serves: "с 18:00",
    items: [
      { slug: "duck", title: "Утиная грудка с вишней", description: "Розовая внутри, с вишнёвым соусом и пюре из сельдерея.", price: 1290, unit: "280 г", tags: ["gf"], photo: "menu-duck" },
      { slug: "zander", title: "Судак с беурбланом", description: "Волжский судак, соус беурблан и печёный порей.", price: 1190, unit: "260 г", tags: ["gf", "signature"], photo: "menu-zander" },
      { slug: "risotto", title: "Ризотто с белыми грибами", description: "Белые грибы, пармезан и тимьян.", price: 890, unit: "300 г", tags: ["veg", "gf"], photo: "menu-risotto" },
    ],
  },
  {
    slug: "wine",
    title: "Вино",
    subtitle: "Бокал 125 мл или бутылка. Натуральные вина и классика.",
    daypart: "evening",
    serves: "с 18:00",
    items: [
      { slug: "pet-nat", title: "Пет-нат, шардоне", description: "Кубань, 2024. Лёгкое игристое: груша и дрожжевая корочка.", price: 750, priceAlt: 3900, unit: "бокал", unitAlt: "бутылка" },
      { slug: "riesling", title: "Рислинг", description: "Кубань, 2023. Лайм, мокрый камень, лёгкая сладость.", price: 690, priceAlt: 3600, unit: "бокал", unitAlt: "бутылка" },
      { slug: "rkatsiteli", title: "Ркацители квеври", description: "Кахетия, 2021. Оранжевое вино: абрикос, чай, грецкий орех.", price: 850, priceAlt: 4400, unit: "бокал", unitAlt: "бутылка", tags: ["signature"] },
      { slug: "rose", title: "Розе", description: "Прованс, 2024. Сухое: клубника и розовый перец.", price: 850, priceAlt: 4400, unit: "бокал", unitAlt: "бутылка" },
      { slug: "krasnostop", title: "Красностоп", description: "Дон, 2021. Вишня, фиалка, чёрный перец.", price: 850, priceAlt: 4400, unit: "бокал", unitAlt: "бутылка" },
      { slug: "pinot-noir", title: "Пино нуар", description: "Бургундия, 2021. Малина, лесная подстилка, шёлковые танины.", price: 1350, priceAlt: 6900, unit: "бокал", unitAlt: "бутылка" },
      { slug: "nero-davola", title: "Неро д’Авола", description: "Сицилия, 2022. Спелая слива и специи.", price: 790, priceAlt: 3900, unit: "бокал", unitAlt: "бутылка" },
    ],
  },
  {
    slug: "cocktails",
    title: "Коктейли",
    subtitle: "С 18:00. Безалкогольные версии есть у каждого.",
    daypart: "evening",
    serves: "с 18:00",
    items: [
      { slug: "espresso-martini", title: "Эспрессо-мартини «Светотень»", description: "Водка, наш колд брю, кофейный ликёр и пена. Коктейль, где встречаются день и вечер.", price: 790, unit: "100 мл", tags: ["signature"], photo: "menu-espresso-martini" },
      { slug: "negroni", title: "Негрони", description: "Джин, вермут россо, биттер. Классические пропорции.", price: 750, unit: "90 мл", photo: "menu-negroni" },
      { slug: "sea-buckthorn-spritz", title: "Облепиховый спритц", description: "Облепиха, просекко и розмарин.", price: 690, unit: "250 мл", photo: "menu-spritz" },
      { slug: "cold-brew-tonic", title: "Колд брю тоник", description: "Без алкоголя: колд брю, тоник и апельсин.", price: 420, unit: "300 мл", tags: ["vegan"] },
    ],
  },
];

export const TAG_LABELS: Record<string, string> = {
  signature: "Фирменное",
  veg: "Вегетарианское",
  vegan: "Веганское",
  gf: "Без глютена",
  spicy: "Острое",
  new: "Новое",
};

/** Items featured in "Сейчас в меню" on the home page, per daypart. */
export const FEATURED: Record<"morning" | "day" | "evening", string[]> = {
  morning: ["syrniki", "croissant", "raf", "ricotta-toast"],
  day: ["borscht", "pumpkin-soup", "beet-salad", "pasta"],
  evening: ["burrata", "duck", "espresso-martini", "cheese-board"],
};
