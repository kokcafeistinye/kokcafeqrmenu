const fs=require("fs");
const S=JSON.parse(fs.readFileSync("data.json","utf8"));

/* ---- içindekiler: kaynakta olmayan ürünler için standart bileşim (mutfak teyidi gerekir) ---- */
const ING={
"Espresso":["Çekirdek kahve","Espresso coffee"],
"Double Espresso":["Çift shot espresso","Double shot espresso"],
"Macchiato":["Espresso, az süt köpüğü","Espresso, a touch of milk foam"],
"Americano":["Espresso, sıcak su","Espresso, hot water"],
"Cafe Latte":["Espresso, süt, süt köpüğü","Espresso, milk, milk foam"],
"Cappuccino":["Espresso, süt, bol süt köpüğü","Espresso, milk, thick milk foam"],
"Mocha":["Espresso, süt, çikolata sosu","Espresso, milk, chocolate sauce"],
"Karamel Mocha":["Espresso, süt, çikolata sosu, karamel","Espresso, milk, chocolate sauce, caramel"],
"White Mocha":["Espresso, süt, beyaz çikolata","Espresso, milk, white chocolate"],
"Bardak Çay":["Demlenmiş siyah çay","Brewed black tea"],
"Fincan Çay":["Demlenmiş siyah çay","Brewed black tea"],
"Türk Kahvesi":["Türk kahvesi, su (şeker tercihe göre)","Turkish coffee, water (sugar to taste)"],
"Double Türk Kahvesi":["Çift porsiyon Türk kahvesi, su","Double portion Turkish coffee, water"],
"Damla Sakızlı Türk Kahvesi":["Türk kahvesi, damla sakızı, su","Turkish coffee, mastic gum, water"],
"Dibek Kahvesi":["Dibekte dövülmüş kahve karışımı","Stone-ground dibek coffee blend"],
"Menengiç Kahvesi":["Menengiç çekirdeği, süt","Terebinth seed, milk"],
"Nescafe":["Hazır kahve, süt, sıcak su","Instant coffee, milk, hot water"],
"Filtre Kahve":["Filtre kahve, su","Filter coffee, water"],
"Sahlep":["Süt, sahlep, tarçın","Milk, salep, cinnamon"],
"Süt":["Süt","Milk"],
"Karadut Çayı":["Karadut aroması, sıcak su","Black mulberry infusion, hot water"],
"Kivi Çayı":["Kivi aroması, sıcak su","Kiwi infusion, hot water"],
"Elma Çayı":["Elma aroması, sıcak su","Apple infusion, hot water"],
"Yeşil Çay":["Yeşil çay yaprağı","Green tea leaves"],
"Ada Çayı":["Adaçayı yaprağı","Sage leaves"],
"Ihlamur":["Ihlamur çiçeği","Linden blossom"],
"Papatya Çayı":["Papatya çiçeği","Chamomile flowers"],
"Melisa Çayı":["Melisa (oğul otu) yaprağı","Lemon balm leaves"],
"Taze Zencefil Çayı":["Taze zencefil, limon, bal","Fresh ginger, lemon, honey"],
"Kış Çayı":["Karışık kış bitkileri, tarçın, karanfil, limon","Winter herb blend, cinnamon, clove, lemon"],
"Ice Latte":["Espresso, soğuk süt, buz","Espresso, cold milk, ice"],
"Ice Mocha":["Espresso, soğuk süt, çikolata sosu, buz","Espresso, cold milk, chocolate sauce, ice"],
"Ice Caramel Latte":["Espresso, soğuk süt, karamel, buz","Espresso, cold milk, caramel, ice"],
"Ice White Mocha":["Espresso, soğuk süt, beyaz çikolata, buz","Espresso, cold milk, white chocolate, ice"],
"Ice Americano":["Espresso, soğuk su, buz","Espresso, cold water, ice"],
"Portakal":["Taze sıkılmış portakal","Freshly squeezed orange"],
"Nar":["Taze sıkılmış nar","Freshly squeezed pomegranate"],
"Limonata":["Limon, su, şeker, nane","Lemon, water, sugar, mint"],
"Çilekli Naneli":["Çilek, nane, limon, su","Strawberry, mint, lemon, water"],
"Coca Cola":["Gazlı içecek, kutu","Carbonated soft drink, can"],
"Coca Cola Zero":["Şekersiz gazlı içecek, kutu","Sugar-free carbonated soft drink, can"],
"Sprite":["Limon aromalı gazlı içecek, kutu","Lemon-lime soft drink, can"],
"Fanta":["Portakal aromalı gazlı içecek, kutu","Orange soft drink, can"],
"Ice Tea Şeftali":["Şeftali aromalı soğuk çay","Peach flavoured iced tea"],
"Ice Tea Limon":["Limon aromalı soğuk çay","Lemon flavoured iced tea"],
"Sade Soda":["Maden suyu","Sparkling mineral water"],
"Limonlu Soda":["Limon aromalı maden suyu","Lemon flavoured mineral water"],
"Elmalı Soda":["Elma aromalı maden suyu","Apple flavoured mineral water"],
"Çilekli Soda":["Çilek aromalı maden suyu","Strawberry flavoured mineral water"],
"Ayran":["Yoğurt, su, tuz","Yoghurt, water, salt"],
"Naneli Ayran":["Yoğurt, su, tuz, nane","Yoghurt, water, salt, mint"],
"Su":["Doğal kaynak suyu","Natural spring water"],
"Red Bull":["Enerji içeceği, kutu","Energy drink, can"],
"Love 66":["Karpuz, passion meyvesi, çiçekler, kavun, çilek, mentol","Watermelon, passion fruit, flowers, melon, strawberry, menthol"],
"Lady Killer":["Mango, kavun, çilek, nane","Mango, melon, strawberry, mint"],
"Pişmiş Şeftali":["Fırınlanmış şeftali aroması","Baked peach flavour"],
"Bakü Night":["Oryantal meyveler, ice","Oriental fruits, ice"],
"İzmir Romantik":["Kavun, karpuz, nane","Melon, watermelon, mint"],
"Marilyn Monroe":["Gül, yeşil limon, ice","Rose, lime, ice"],
"Karışık Meyve":["Karışık meyve aroması","Mixed fruit flavour"],
"Moskova Night":["Muz, orman meyveleri, mentol","Banana, forest fruits, menthol"],
"Dejavu":["Kavun, karpuz, nane, vanilya","Melon, watermelon, mint, vanilla"],
"Plombir":["Buzlu çikolatalı dondurma aroması","Iced chocolate ice cream flavour"],
"Sahanda Tereyağlı Göz Yumurta":["Yumurta, tereyağı","Egg, butter"],
"Kavurmalı Yumurta":["Yumurta, et kavurma, tereyağı","Egg, roasted meat, butter"],
"Sucuklu Yumurta":["Yumurta, sucuk, tereyağı","Egg, sucuk, butter"],
"Sahanda Sucuk":["Sucuk, tereyağı","Sucuk, butter"],
"Sade Menemen":["Yumurta, domates, sivri biber, tereyağı","Egg, tomato, green pepper, butter"],
"Karışık Menemen":["Yumurta, domates, sivri biber, sucuk, kaşar peyniri, tereyağı","Egg, tomato, green pepper, sucuk, cheddar, butter"],
"Mıhlama":["Mısır unu, tereyağı, kolot/dil peyniri","Corn flour, butter, kolot cheese"],
"Sade Omlet":["Yumurta, tereyağı","Egg, butter"],
"Peynir Tabağı":["Beyaz peynir, kaşar peyniri, çeçil peyniri","White cheese, cheddar, chechil cheese"],
"Bal Kaymak":["Bal, kaymak","Honey, clotted cream"],
"Yeşil–Siyah Zeytin Tabağı":["Yeşil zeytin, siyah zeytin, zeytinyağı","Green olives, black olives, olive oil"],
"Domates Salatalık Söğüş":["Domates, salatalık, maydanoz","Tomato, cucumber, parsley"],
"Günün Çorbası":["Günlük değişir — servis ekibimize danışınız","Changes daily — please ask our team"],
"Elma Dilim Patates":["Patates, baharat","Potato, spices"],
"Parmak Patates":["Patates, tuz","Potato, salt"],
"Paçanga Böreği":["Yufka, pastırma, kaşar peyniri, biber, domates","Yufka pastry, pastırma, cheddar, pepper, tomato"],
"Sigara Böreği":["Yufka, beyaz peynir, maydanoz","Yufka pastry, white cheese, parsley"],
"Tereyağlı Karides":["Karides, tereyağı, sarımsak, limon","Shrimp, butter, garlic, lemon"],
"Çıtır Tavuk Sepeti":["Tavuk göğsü, galeta unu, baharat, patates","Chicken breast, breadcrumbs, spices, potato"],
"Mevsim Salata":["Marul, domates, salatalık, havuç, mısır, zeytinyağı, limon","Lettuce, tomato, cucumber, carrot, corn, olive oil, lemon"],
"Çoban Salata":["Domates, salatalık, soğan, biber, maydanoz, zeytinyağı","Tomato, cucumber, onion, pepper, parsley, olive oil"],
"Peynirli Roka Salatası":["Roka, beyaz peynir, çeri domates, zeytinyağı, nar ekşisi","Arugula, white cheese, cherry tomato, olive oil, pomegranate molasses"],
"Sıcak Sezar Salata":["Marul, ızgara tavuk, parmesan, kruton, sezar sos","Lettuce, grilled chicken, parmesan, croutons, Caesar dressing"],
"Sıcak Hellim Salatası":["Hellim peyniri, karışık yeşillik, çeri domates, zeytinyağı","Halloumi, mixed greens, cherry tomato, olive oil"],
"Ton Balıklı Salata":["Ton balığı, marul, mısır, kırmızı soğan, zeytin, limon","Tuna, lettuce, corn, red onion, olives, lemon"],
"Sıcak Çıtır Tavuk Salatası":["Çıtır tavuk, karışık yeşillik, çeri domates, sos","Crispy chicken, mixed greens, cherry tomato, dressing"],
"Çökertme Kebabı":["Dana bonfile, kibrit patates, yoğurt, tereyağlı domates sos","Beef tenderloin, straw potatoes, yoghurt, buttered tomato sauce"],
"Karides Güveç":["Karides, mantar, kaşar peyniri, tereyağlı domates sos","Shrimp, mushroom, cheddar, buttered tomato sauce"],
"Fettuccine Alfredo":["Fettuccine, krema, parmesan, tereyağı","Fettuccine, cream, parmesan, butter"],
"Spaghetti Bolognese":["Spagetti, dana kıyma, domates sos, parmesan","Spaghetti, minced beef, tomato sauce, parmesan"],
"Penne Arrabbiata":["Penne, domates sos, sarımsak, acı biber","Penne, tomato sauce, garlic, chilli"],
"Köri Soslu Tavuklu Penne":["Penne, tavuk, köri, krema","Penne, chicken, curry, cream"],
"Penne Chicken Mushroom":["Penne, tavuk, mantar, krema","Penne, chicken, mushroom, cream"],
"Pesto Chicken Penne":["Penne, tavuk, fesleğen pesto, parmesan","Penne, chicken, basil pesto, parmesan"],
"Hamburger":["Dana köfte, burger ekmeği, marul, domates, soğan, turşu, sos","Beef patty, burger bun, lettuce, tomato, onion, pickle, sauce"],
"Cheeseburger":["Dana köfte, cheddar peyniri, burger ekmeği, marul, domates, soğan, turşu","Beef patty, cheddar, burger bun, lettuce, tomato, onion, pickle"],
"Çıtır Tavuk Burger":["Çıtır tavuk, burger ekmeği, marul, domates, mayonez","Crispy chicken, burger bun, lettuce, tomato, mayonnaise"],
"Barbekü Soslu Burger":["Dana köfte, barbekü sos, cheddar, burger ekmeği, marul, soğan","Beef patty, BBQ sauce, cheddar, burger bun, lettuce, onion"],
"Et Dürüm":["Dana et, lavaş, domates, soğan, maydanoz, sos","Beef, lavash, tomato, onion, parsley, sauce"],
"Tavuk Dürüm":["Tavuk, lavaş, domates, soğan, maydanoz, sos","Chicken, lavash, tomato, onion, parsley, sauce"],
"Köfte Dürüm":["Köfte, lavaş, domates, soğan, maydanoz, sos","Meatballs, lavash, tomato, onion, parsley, sauce"],
"Etli Quesadilla":["Tortilla, dana et, cheddar peyniri, renkli biber, soğan","Tortilla, beef, cheddar, bell peppers, onion"],
"Tavuklu Quesadilla":["Tortilla, tavuk, cheddar peyniri, renkli biber, soğan","Tortilla, chicken, cheddar, bell peppers, onion"],
"Cheesecake Çeşitleri":["Bisküvi tabanı, labne/krem peynir, krema, meyve veya çikolata sosu","Biscuit base, cream cheese, cream, fruit or chocolate sauce"],
"Sufle":["Çikolata, yumurta, un, tereyağı, şeker","Chocolate, egg, flour, butter, sugar"],
"Tiramisu":["Kedidili bisküvi, mascarpone, kahve, kakao, yumurta","Ladyfingers, mascarpone, coffee, cocoa, egg"],
"Fırın Sütlaç":["Süt, pirinç, şeker, nişasta","Milk, rice, sugar, starch"],
"Trileçe":["Kek, süt, krema, karamel sos","Sponge cake, milk, cream, caramel sauce"],
"Kazandibi":["Süt, şeker, nişasta, pirinç unu","Milk, sugar, starch, rice flour"],
"Dilim Pastalar":["Kek, krema, çikolata veya meyve","Sponge cake, cream, chocolate or fruit"],
"Mozaik Pasta":["Bisküvi, kakao, tereyağı, süt","Biscuit, cocoa, butter, milk"],
"Brownie":["Çikolata, un, yumurta, tereyağı, ceviz","Chocolate, flour, egg, butter, walnut"],
"Magnolia Çeşitleri":["Bisküvi, süt, krema, muz/çilek/Oreo","Biscuit, milk, cream, banana/strawberry/Oreo"],
"Katmer":["Yufka, kaymak, Antep fıstığı, tereyağı","Katmer pastry, clotted cream, pistachio, butter"],
"Künefe":["Kadayıf, dil peyniri, tereyağı, şerbet, Antep fıstığı","Kadayıf, cheese, butter, syrup, pistachio"],
"Meyve Tabağı":["Mevsim meyveleri","Seasonal fruits"],
"Çerez Tabağı":["Karışık kuruyemiş ve kuru meyve","Mixed nuts and dried fruit"],
"1 Top Dondurma":["Süt, krema, şeker","Milk, cream, sugar"],
"4 Top Dondurma":["Süt, krema, şeker","Milk, cream, sugar"]
};
/* pide / tost / gözleme / omlet grupları için kısa bileşimler */
const GRP_ING={
"Meyveli Çaylar":{"Nane Limon":["Nane limon aroması, sıcak su","Mint & lemon infusion, hot water"]},
"Bitki Çayları":{"Nane Limon":["Taze nane, limon","Fresh mint, lemon"]},
"Klasik Nargileler":{"Üzüm":["Üzüm aromalı nargile tütünü","Grape flavoured shisha tobacco"],"Karpuz":["Karpuz aromalı nargile tütünü","Watermelon flavoured shisha tobacco"],"Çilek":["Çilek aromalı nargile tütünü","Strawberry flavoured shisha tobacco"],"Çift Elma":["Çift elma aromalı nargile tütünü","Double apple flavoured shisha tobacco"],"Cappuccino":["Cappuccino aromalı nargile tütünü","Cappuccino flavoured shisha tobacco"],"Çikolata":["Çikolata aromalı nargile tütünü","Chocolate flavoured shisha tobacco"],"Nane":["Nane aromalı nargile tütünü","Mint flavoured shisha tobacco"],"Damla Sakızı":["Damla sakızı aromalı nargile tütünü","Mastic gum flavoured shisha tobacco"],"Vanilya Kavun":["Vanilya ve kavun aromalı nargile tütünü","Vanilla & melon flavoured shisha tobacco"]},
"Pideler":{"Kaşarlı":["Pide hamuru, kaşar peyniri","Pide dough, cheddar"],"Sucuklu":["Pide hamuru, sucuk, kaşar peyniri","Pide dough, sucuk, cheddar"],"Kıymalı":["Pide hamuru, dana kıyma, biber, domates","Pide dough, minced beef, pepper, tomato"],"Kavurmalı":["Pide hamuru, et kavurma, kaşar peyniri","Pide dough, roasted meat, cheddar"],"Karışık Pide":["Pide hamuru, kıyma, sucuk, kaşar peyniri, yumurta","Pide dough, mince, sucuk, cheddar, egg"]},
"Tostlar":{"Kaşarlı":["Tost ekmeği, kaşar peyniri, tereyağı","Toast bread, cheddar, butter"],"Kavurmalı":["Tost ekmeği, et kavurma, kaşar peyniri","Toast bread, roasted meat, cheddar"],"Sucuklu":["Tost ekmeği, sucuk, kaşar peyniri","Toast bread, sucuk, cheddar"],"Karışık":["Tost ekmeği, sucuk, salam, kaşar peyniri","Toast bread, sucuk, salami, cheddar"],"Beyaz Peynirli":["Tost ekmeği, beyaz peynir, domates","Toast bread, white cheese, tomato"]},
"Gözleme Çeşitleri":{"Kaşarlı":["Gözleme hamuru, kaşar peyniri","Gözleme dough, cheddar"],"Beyaz Peynirli":["Gözleme hamuru, beyaz peynir, maydanoz","Gözleme dough, white cheese, parsley"],"Patatesli":["Gözleme hamuru, patates, baharat","Gözleme dough, potato, spices"],"Kaşarlı Kavurmalı":["Gözleme hamuru, kaşar peyniri, et kavurma","Gözleme dough, cheddar, roasted meat"],"Kaşarlı Sucuklu":["Gözleme hamuru, kaşar peyniri, sucuk","Gözleme dough, cheddar, sucuk"]},
"Omlet Çeşitleri":{"Peynirli":["Yumurta, beyaz peynir, tereyağı","Egg, white cheese, butter"],"Karışık":["Yumurta, kaşar peyniri, sucuk, mantar, biber","Egg, cheddar, sucuk, mushroom, pepper"],"Peynirli Maydanozlu":["Yumurta, beyaz peynir, maydanoz","Egg, white cheese, parsley"],"Kaşar Mantarlı":["Yumurta, kaşar peyniri, mantar","Egg, cheddar, mushroom"],"Mantarlı":["Yumurta, mantar, tereyağı","Egg, mushroom, butter"],"Sebzeli":["Yumurta, biber, domates, mantar, soğan","Egg, pepper, tomato, mushroom, onion"]},
"Sıcak Çikolata":{"Sıcak Çikolata":["Süt, çikolata","Milk, chocolate"],"Caramel":["Süt, beyaz çikolata, karamel","Milk, white chocolate, caramel"],"Çilek":["Süt, beyaz çikolata, çilek","Milk, white chocolate, strawberry"],"White":["Süt, beyaz çikolata","Milk, white chocolate"]},
"Milkshake":{"*":["Süt, dondurma, aroma","Milk, ice cream, flavouring"]},
"Smoothie":{"*":["Meyve, yoğurt, buz","Fruit, yoghurt, ice"]},
"Frozen":{"*":["Meyve püresi, buz, şeker şurubu","Fruit purée, ice, sugar syrup"]}
};

/* ---- alerjen çıkarımı ---- */
const RULES=[
 ["G",/ekmek|pide|pizza|makarna|penne|spagetti|spaghetti|fettuccine|tost|gözleme|börek|katmer|künefe|kadayıf|brownie|bisküvi|kedidili|sufle|magnolia|mozaik|burger|dürüm|lavaş|tortilla|quesadilla|nugget|kroket|soğan halkası|şinitzel|pişi|trileçe|yufka|kruton|galeta|\bun\b|kek\b|cheesecake|çıtır|hamur|pastırma|paçanga|kadayif|sütlaç|kazandibi|nişasta|köfte|arpa|buğday/i],
 ["M",/peynir|kaşar|mozzarella|mozarella|parmesan|cheddar|hellim|labne|mascarpone|krema|\bsüt|tereyağ|kaymak|dondurma|milkshake|latte|cappuccino|mocha|macchiato|frappe|sahlep|çikolata|magnolia|cheesecake|tiramisu|sütlaç|kazandibi|trileçe|künefe|katmer|ayran|yoğurt|mıhlama|nutella|\bkek|brownie|sufle|mozaik|ekşi krema|sezar|beşamel|nescafe/i],
 ["Y",/yumurta|omlet|menemen|mayonez|sufle|tiramisu|magnolia|\bkek|brownie|şinitzel|çıtır|kroket|nugget|trileçe|cheesecake|sezar|pasta\b|köfte|dilim pasta/i],
 ["B",/balık|hamsi|somon|ançüez|sezar/i],
 ["K",/karides|istakoz|yengeç/i],
 ["S",/\bsoya/i],
 ["SS",/susam|tahin/i],
 ["N",/nutella|fıstık|ceviz|badem|fındık|antep|kuruyemiş|çerez|pesto|mozaik|brownie|katmer|künefe|menengiç/i],
 ["H",/hardal|mayonez/i]
];
const OVERRIDE={ // yanlış pozitifleri temizle
 "Su":[], "Sade Soda":[], "Limonlu Soda":[], "Elmalı Soda":[], "Çilekli Soda":[],
 "Coca Cola":[], "Coca Cola Zero":[], "Sprite":[], "Fanta":[], "Red Bull":[],
 "Ice Tea Şeftali":[], "Ice Tea Limon":[], "Portakal":[], "Nar":[], "Limonata":[],
 "Çilekli Naneli":[], "KÖK ATO MIX":[], "Bardak Çay":[], "Fincan Çay":[],
 "Espresso":[], "Double Espresso":[], "Americano":[], "Türk Kahvesi":[], "Double Türk Kahvesi":[],
 "Damla Sakızlı Türk Kahvesi":[], "Dibek Kahvesi":[], "Filtre Kahve":[], "Ice Americano":[],
 "Ayran":["M"], "Naneli Ayran":["M"], "Süt":["M"], "Menengiç Kahvesi":["N"],
 "Yeşil–Siyah Zeytin Tabağı":[], "Domates Salatalık Söğüş":[], "Meyve Tabağı":[],
 "Elma Dilim Patates":[], "Parmak Patates":[], "Bal Kaymak":["M"],
 "Çoban Salata":[], "Mevsim Salata":[], "Günün Çorbası":null
};

/* ---- görsel anahtarı ---- */
function icon(sec,grp,name,desc){
 const t=(name+" "+(desc||"")).toLocaleLowerCase("tr");
 const G=grp.toLocaleLowerCase("tr");
 if(sec==="nargile") return "shisha";
 if(/nargile/.test(G)) return "shisha";
 if(/kahvaltı tabak/.test(G)) return "plate";
 if(/sahanda/.test(G)) return /menemen|mıhlama/.test(t)?"menemen":"egg";
 if(/omlet/.test(G)) return "omelette";
 if(/gözleme/.test(G)) return "gozleme";
 if(/seçme kahvaltılık/.test(G)) return /peynir/.test(t)?"cheeseplate":(/bal/.test(t)?"honey":"olive");
 if(/çorba/.test(G)) return "soup";
 if(/ara sıcak/.test(G)) return /patates/.test(t)?"fries":(/karides/.test(t)?"shrimp":(/börek|paçanga/.test(t)?"borek":(/tavuk/.test(t)?"chicken":"combo")));
 if(/salata/.test(G)) return "salad";
 if(/ızgara/.test(G)) return /köfte/.test(t)?"meatball":(/tavuk/.test(t)?"chicken":"steak");
 if(/güveç|fajita/.test(G)) return /fajita/.test(t)?"fajita":"pot";
 if(/tavuk & et|tavuk & beef/.test(G)) return /kebab|çökertme/.test(t)?"kebab":(/tavuk/.test(t)?"chicken":"steak");
 if(/deniz/.test(G)) return "shrimp";
 if(/makarna|pasta/.test(G)) return "pasta";
 if(/hamburger|burger/.test(G)) return "burger";
 if(/dürüm|wrap/.test(G)) return "wrap";
 if(/quesadilla/.test(G)) return "quesadilla";
 if(/pizza/.test(G)) return "pizza";
 if(/pide/.test(G)) return "pide";
 if(/tost/.test(G)) return "toast";
 if(/dondurma/.test(G)) return /meyve/.test(t)?"fruit":(/çerez/.test(t)?"nuts":"icecream");
 if(sec==="tatli") return /künefe|katmer/.test(t)?"kunefe":(/dondurma/.test(t)?"icecream":"cake");
 if(/sıcak kahve/.test(G)) return "coffee";
 if(/türk kahve/.test(G)) return /çay/.test(t)?"tea":(/süt/.test(t)?"mug":(/sahlep/.test(t)?"mug":"turkishcoffee"));
 if(/sıcak çikolata/.test(G)) return "mug";
 if(/çay/.test(G)) return "tea";
 if(/soğuk kahve/.test(G)) return "icedcoffee";
 if(/kokteyl|cocktail/.test(G)) return "cocktail";
 if(/meyve su|juice/.test(G)) return "juice";
 if(/smoothie|milkshake|frozen/.test(G)) return "shake";
 if(/şişe|bottle/.test(G)) return /ayran/.test(t)?"ayran":(/su$/.test(t)?"water":"bottle");
 return "plate";
}

let stats={};
for(const s of S) for(const g of s.g) for(const it of g.i){
  // içindekiler
  if(!it.d){
    let e=(GRP_ING[g.tr]&&(GRP_ING[g.tr][it.n]||GRP_ING[g.tr]["*"])) || ING[it.n];
    if(e){ it.ing=e[0]; it.inge=e[1]; }
  } else { it.ing=it.d; it.inge=it.de; }
  // alerjenler
  const hay=[it.n,it.ne,it.ing||"",it.inge||"",g.tr].join(" ");
  let al=[];
  for(const [code,re] of RULES) if(re.test(hay)) al.push(code);
  if(Object.prototype.hasOwnProperty.call(OVERRIDE,it.n)) al=OVERRIDE[it.n];
  if(al===null) al=undefined;
  if(al&&al.length) it.a=al;
  // görsel
  it.ic=icon(s.id,g.tr,it.n,it.d);
  stats[it.ic]=(stats[it.ic]||0)+1;
}
fs.writeFileSync("data.json",JSON.stringify(S,null,1));
console.log("görsel anahtarları:",Object.keys(stats).length);
console.log(Object.entries(stats).sort((a,b)=>b[1]-a[1]).map(x=>x[0]+":"+x[1]).join("  "));
let noIng=0,noAl=0,tot=0;
for(const s of S)for(const g of s.g)for(const it of g.i){tot++;if(!it.ing)noIng++;if(!it.a)noAl++}
console.log(`toplam ${tot} | içerik yok: ${noIng} | alerjen yok: ${noAl}`);
