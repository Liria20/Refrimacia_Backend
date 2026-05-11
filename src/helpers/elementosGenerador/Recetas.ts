// utils/generadorComida.ts

export const misRecetasReales = [
    // ----------------- DESAYUNO (10) -----------------
    {
        titulo: "Tostadas con Aguacate y Huevo",
        descripcion: "Tuesta las rebanadas de pan integral hasta que queden doradas y crujientes.\n\nMientras tanto, corta el aguacate por la mitad, retira el hueso y machaca la pulpa en un bol con un tenedor. Añade sal, pimienta y un chorrito de aceite de oliva al gusto, y mezcla bien.\n\nEn un cazo con agua caliente (sin que llegue a hervir fuerte), añade un chorrito de vinagre y cocina el huevo poché durante unos 3 minutos, hasta que la clara esté cuajada pero la yema quede cremosa.\n\nUnta el aguacate sobre las tostadas, coloca el huevo encima con cuidado y añade un poco más de sal y pimienta si lo deseas. Sirve inmediatamente.",
        ingredientes: "2 rebanadas de pan integral, 1 aguacate, 1 huevo, 1 pizca de sal, 1 pizca de pimienta, 1 cucharada de aceite de oliva",
        imagen: "https://www.schaer.com/sites/default/files/styles/panoramic_xxl/public/2017-07/1820_Avocado-Sandwich%20mit%20Spiegelei%20und%20Tabasco.jpg.webp",
        tipo: "Desayuno",
        tiempo_preparacion: 10,
        kcal: 420,
        proteinas: 13,
        carbohidratos: 28,
        fibra: 11,
        grasas: 29,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal para desayunos o cenas saludables entre 3 y 5 veces por semana.",
        dificultad: "Media"
    },
    {
        titulo: "Tortitas de Avena y Plátano",
        descripcion: "En un bol, machaca el plátano maduro con un tenedor hasta obtener un puré suave y sin grumos.\n\nAñade el huevo y mezcla bien hasta que quede una masa homogénea. Incorpora la avena, una pizca de canela al gusto y un chorrito de leche para aligerar la mezcla.\n\nRemueve todos los ingredientes hasta conseguir una masa ligeramente espesa pero manejable.\n\nCalienta una sartén antiadherente a fuego medio y añade unas gotas de aceite o mantequilla.\n\nVierte pequeñas porciones de la masa formando tortitas y cocina durante unos 2-3 minutos por cada lado, hasta que estén doradas.\n\nRetira del fuego y sirve calientes. Puedes acompañarlas con fruta, miel o yogur si lo deseas.",
        ingredientes: "80g de avena, 1 plátano maduro, 1 huevo, 1 pizca de canela, 50ml de leche",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRChtVRlodVdYq_2jcz_K3qciRsJ10DTUrfrA&s",
        tipo: "Desayuno",
        tiempo_preparacion: 15,
        kcal: 320,
        proteinas: 12,
        carbohidratos: 45,
        fibra: 8,
        grasas: 10,
        semaforo: "verde_oscuro",
        consumo_habitual: "Consumo habitual recomendado, ideal para desayunos o cenas saludables entre 3 y 5 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Porridge de Avena con Frutos Rojos",
        descripcion: "En un cazo, añade la avena junto con la leche y calienta a fuego medio.\n\nRemueve constantemente para evitar que se pegue y cocina durante unos 5-7 minutos, hasta que la mezcla espese y tenga una textura cremosa.\n\nSi lo prefieres más líquido, puedes añadir un poco más de leche durante la cocción.\n\nUna vez listo, retira del fuego y vierte el porridge en un bol.\n\nAñade por encima las frambuesas y los arándanos frescos.\n\nFinaliza con un chorrito de miel al gusto y sirve caliente.",
        ingredientes: "60g de avena, 200ml de leche, 50g de frambuesas, 50g de arándanos, 1 cucharada de miel",
        imagen: "https://www.nutricienta.com/imagenes/recetas/receta-nutricienta-porridge-de-avena-y-frutos-rojos.jpg",
        tipo: "Desayuno",
        tiempo_preparacion: 10,
        kcal: 340,
        proteinas: 12,
        carbohidratos: 52,
        fibra: 9,
        grasas: 8,
        semaforo: "verde_oscuro",
        consumo_habitual: "Consumo habitual recomendado, ideal para desayunos equilibrados y saciantes entre 4 y 6 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Huevos Revueltos con Espinacas",
        descripcion: "Lava bien las espinacas y escúrrelas para eliminar el exceso de agua.\n\nPela y pica finamente el ajo. En una sartén, añade un chorrito de aceite de oliva y sofríe el ajo a fuego medio hasta que esté ligeramente dorado.\n\nIncorpora las espinacas y saltéalas durante unos minutos hasta que reduzcan su tamaño y estén tiernas.\n\nMientras tanto, bate los huevos en un bol con una pizca de sal.\n\nAñade los huevos batidos a la sartén junto con las espinacas y cocina a fuego medio-bajo, removiendo constantemente para que queden cremosos.\n\nRetira del fuego cuando estén en su punto y sirve inmediatamente.",
        ingredientes: "2 huevos, 100g de espinacas, 1 diente de ajo, 1 pizca de sal, 1 cucharada de aceite de oliva",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxvc-I67PPl3IK5eXOGOR6xuUkh9TkqjaZtA&s",
        tipo: "Desayuno",
        tiempo_preparacion: 10,
        kcal: 260,
        proteinas: 15,
        carbohidratos: 4,
        fibra: 2,
        grasas: 20,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal para desayunos o cenas ligeras entre 4 y 6 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Batido Verde Energético",
        descripcion: "Lava bien las espinacas, la manzana y el apio para eliminar cualquier impureza.\n\nCorta la manzana en trozos, retirando el corazón, y trocea el apio en partes más pequeñas.\n\nExprime el zumo de medio limón y pela un pequeño trozo de jengibre.\n\nIntroduce todos los ingredientes en una batidora o licuadora.\n\nAñade un poco de agua si deseas una textura más ligera y bate hasta obtener una mezcla homogénea y sin grumos.\n\nSirve frío y consume al momento para aprovechar todas sus propiedades.",
        ingredientes: "50g de espinacas, 1 manzana verde, 1 rama de apio, 1/2 limón, 10g de jengibre, 100ml de agua",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKoCC3mTwrf9i5jSCBgBDdS9iLVxcP3oZoNQ&s",
        tipo: "Desayuno",
        tiempo_preparacion: 5,
        kcal: 120,
        proteinas: 2,
        carbohidratos: 26,
        fibra: 6,
        grasas: 0,
        semaforo: "verde_oscuro",
        consumo_habitual: "Consumo habitual recomendado, ideal como desayuno ligero o complemento diario de 5 a 7 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Tostadas Francesas con Miel",
        descripcion: "En un bol, bate los huevos junto con la leche hasta obtener una mezcla homogénea.\n\nSumerge las rebanadas de pan de molde en la mezcla, asegurándote de que queden bien empapadas por ambos lados.\n\nCalienta una sartén a fuego medio y añade una pequeña cantidad de mantequilla hasta que se derrita.\n\nColoca las rebanadas de pan en la sartén y cocínalas durante unos 2-3 minutos por cada lado, hasta que estén doradas.\n\nRetira las tostadas del fuego y colócalas en un plato.\n\nAñade miel por encima al gusto y sirve calientes.",
        ingredientes: "2 huevos, 100ml de leche, 2 rebanadas de pan de molde, 1 cucharada de miel, 10g de mantequilla",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVeyaX96mXYa-x_izDgCfa_hm7hL5Zisp1xA&s",
        tipo: "Desayuno",
        tiempo_preparacion: 12,
        kcal: 360,
        proteinas: 12,
        carbohidratos: 42,
        fibra: 2,
        grasas: 16,
        semaforo: "amarillo",
        consumo_habitual: "Consumo ocasional recomendado, ideal para desayunos puntuales 1 a 2 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Churros con Chocolate",
        descripcion: "En un cazo, calienta el agua con una pizca de sal hasta que empiece a hervir.\n\nRetira del fuego y añade la harina de golpe, removiendo rápidamente con una cuchara de madera hasta obtener una masa espesa y sin grumos.\n\nDeja templar la masa durante unos minutos y colócala en una manga pastelera con boquilla rizada.\n\nCalienta abundante aceite en una sartén profunda o freidora.\n\nForma los churros directamente sobre el aceite caliente y fríelos hasta que estén dorados y crujientes por fuera.\n\nRetíralos y colócalos sobre papel absorbente para eliminar el exceso de aceite.\n\nMientras tanto, prepara el chocolate a la taza calentándolo hasta que espese.\n\nSirve los churros calientes acompañados del chocolate.",
        ingredientes: "200g de harina, 250ml de agua, 1 pizca de sal, 500ml de aceite para freír, 200g de chocolate a la taza",
        imagen: "https://www.shutterstock.com/image-photo/crispy-spanish-churros-chocolate-600nw-2519553045.jpg",
        tipo: "Desayuno",
        tiempo_preparacion: 35,
        kcal: 850,
        proteinas: 12,
        carbohidratos: 105,
        fibra: 4,
        grasas: 42,
        semaforo: "rojo",
        consumo_habitual: "Consumo ocasional recomendado, ideal para ocasiones especiales como máximo 1 vez cada una o dos semanas.",
        dificultad: "Media"
    },
    {
        titulo: "Pan con Tomate y Jamón Ibérico",
        descripcion: "Corta el pan rústico en rebanadas y tuéstalo ligeramente hasta que quede crujiente por fuera pero tierno por dentro.\n\nLava los tomates y rállalos hasta obtener una pulpa suave. Añade una pizca de sal al gusto.\n\nUnta el tomate rallado sobre las rebanadas de pan tostado, asegurándote de cubrir bien toda la superficie.\n\nRiega con un chorrito de aceite de oliva virgen extra para potenciar el sabor.\n\nColoca encima las lonchas de jamón ibérico, distribuyéndolas de forma uniforme.\n\nSirve inmediatamente para disfrutar de todo su aroma y textura.",
        ingredientes: "2 rebanadas de pan rústico, 2 tomates, 80g de jamón ibérico, 1 cucharada de aceite de oliva virgen extra, 1 pizca de sal",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7CxuWMgmvzbHwVnxxdyOQ1yEoEJVCXvmeww&s",
        tipo: "Desayuno",
        tiempo_preparacion: 10,
        kcal: 420,
        proteinas: 22,
        carbohidratos: 38,
        fibra: 4,
        grasas: 20,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como desayuno ocasional o brunch 1 a 3 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Bowl de Yogur con Granola",
        descripcion: "Coloca el yogur natural en un bol como base principal.\n\nAñade la granola por encima, distribuyéndola de manera uniforme para aportar textura crujiente.\n\nLava las fresas, retira las hojas y córtalas en rodajas o en mitades según prefieras.\n\nIncorpora las fresas sobre el yogur y la granola, añadiéndolas de forma decorativa.\n\nEspolvorea las semillas de chía por encima para aportar un extra de nutrientes.\n\nSirve inmediatamente o deja reposar unos minutos si prefieres que la granola se ablande ligeramente.",
        ingredientes: "200g de yogur natural, 40g de granola, 100g de fresas, 10g de semillas de chía",
        imagen: "https://aleaorigen.com/wp-content/uploads/2021/07/Foto-Video-Receta-Bowl-scaled.jpg",
        tipo: "Desayuno",
        tiempo_preparacion: 5,
        kcal: 310,
        proteinas: 14,
        carbohidratos: 38,
        fibra: 6,
        grasas: 10,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal para desayunos o meriendas equilibradas entre 4 y 6 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Bizcocho Casero de Yogur",
        descripcion: "En un bol grande, utiliza el vasito del yogur como medida para añadir el yogur de limón, los huevos y el azúcar. Bate bien hasta obtener una mezcla homogénea.\n\nAñade el aceite de girasol y mezcla de nuevo hasta integrarlo completamente.\n\nIncorpora la harina tamizada junto con la levadura poco a poco, removiendo hasta obtener una masa suave y sin grumos.\n\nPrecalienta el horno a 180ºC y engrasa un molde con un poco de mantequilla o aceite.\n\nVierte la masa en el molde y hornea durante unos 30-40 minutos, o hasta que al pinchar con un palillo este salga limpio.\n\nDeja enfriar antes de desmoldar y servir.",
        ingredientes: "1 yogur de limón (125g), 3 huevos, 3 vasos de harina, 2 vasos de azúcar, 1 vaso de aceite de girasol, 1 sobre de levadura (16g)",
        imagen: "https://eltigre.es/admeltigre/wp-content/uploads/2016/05/bizcocho-clasico-yogur-el-tigre-2.jpg",
        tipo: "Desayuno",
        tiempo_preparacion: 45,
        kcal: 290,
        proteinas: 6,
        carbohidratos: 45,
        fibra: 1,
        grasas: 10,
        semaforo: "amarillo",
        consumo_habitual: "Consumo ocasional recomendado, ideal para desayunos o meriendas puntuales 1 a 2 veces por semana.",
        dificultad: "Media"
    },

    // ----------------- ALMUERZO (10) -----------------
    {
        titulo: "Bocadillo de Calamares",
        descripcion: "Limpia los calamares y córtalos en anillas de tamaño uniforme.\n\nPásalos por harina, sacudiendo el exceso para que el rebozado sea ligero y crujiente.\n\nCalienta abundante aceite de oliva en una sartén profunda o freidora hasta que esté bien caliente.\n\nFríe las anillas de calamar en pequeñas tandas hasta que estén doradas y crujientes, evitando que se apelmacen.\n\nRetíralas y colócalas sobre papel absorbente para eliminar el exceso de aceite.\n\nAbre el pan de baguette y rellénalo con los calamares recién hechos.\n\nAñade unas gotas de limón al gusto antes de servir para potenciar el sabor.",
        ingredientes: "200g de calamares, 1 baguette, 100g de harina, 300ml de aceite de oliva, 1/2 limón",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlMxEhxkTfl0_ccf2q__07dtO3zHSf0sBF2Q&s",
        tipo: "Almuerzo",
        tiempo_preparacion: 25,
        kcal: 780,
        proteinas: 28,
        carbohidratos: 85,
        fibra: 4,
        grasas: 32,
        semaforo: "rojo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como comida puntual o capricho gastronómico 1 vez cada 2 semanas o menos.",
        dificultad: "Media"
    },
    {
        titulo: "Empanadas de Atún",
        descripcion: "Pica finamente la cebolla y sofríela en una sartén con un chorrito de aceite de oliva hasta que esté transparente y ligeramente dorada.\n\nAñade el atún escurrido y mezcla bien con la cebolla para que se integren los sabores.\n\nIncorpora el tomate frito y cocina unos minutos a fuego medio, removiendo para obtener un relleno jugoso pero no líquido.\n\nCorta el huevo duro en trozos pequeños y añádelo a la mezcla, integrándolo suavemente.\n\nRellena las obleas de empanada con la mezcla, ciérralas bien sellando los bordes con un tenedor.\n\nColócalas en una bandeja de horno y hornéalas a 180ºC hasta que estén doradas y crujientes.",
        ingredientes: "12 obleas de empanada, 2 latas de atún (160g), 150g de tomate frito, 2 huevos, 1 cebolla, 2 cucharadas de aceite de oliva",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYDnRsg76AkrL32mZF9k9RMxyt-OvoHb8esw&s",
        tipo: "Almuerzo",
        tiempo_preparacion: 35,
        kcal: 520,
        proteinas: 24,
        carbohidratos: 58,
        fibra: 4,
        grasas: 20,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como comida principal 1 a 3 veces por semana.",
        dificultad: "Media"
    },
    {
        titulo: "Pintxo de Tortilla de Patatas",
        descripcion: "Pela las patatas y córtalas en láminas finas. Si usas cebolla, pícala en juliana fina.\n\nEn una sartén con abundante aceite, fríe las patatas junto con la cebolla a fuego medio-bajo hasta que estén tiernas, sin que lleguen a dorarse en exceso.\n\nEscurre bien el exceso de aceite y mezcla las patatas con los huevos previamente batidos en un bol con una pizca de sal.\n\nCuaja la mezcla en una sartén con un poco de aceite, cocinando a fuego medio hasta que la tortilla esté dorada por fuera y jugosa por dentro.\n\nDeja reposar unos minutos y corta la tortilla en pequeños trozos.\n\nColoca cada porción sobre una rebanada de pan de pueblo ligeramente tostado y sirve como pintxo.",
        ingredientes: "3 patatas medianas (400g), 4 huevos, 1 cebolla, 200ml de aceite de oliva, 4 rebanadas de pan de pueblo",
        imagen: "https://static.vueling.com/blog/media/city/1111/tortillas_patata_bilbao_brass27_medium.jpg",
        tipo: "Almuerzo",
        tiempo_preparacion: 45,
        kcal: 610,
        proteinas: 20,
        carbohidratos: 52,
        fibra: 5,
        grasas: 36,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, ideal como comida o tapa 1 vez por semana o menos.",
        dificultad: "Media"
    },
    {
        titulo: "Montaditos de Lomo y Queso",
        descripcion: "Corta los panecillos por la mitad y, si lo prefieres, tuéstalos ligeramente para que queden más crujientes.\n\n" +
            "Calienta una sartén con un chorrito de aceite y cocina la cinta de lomo a fuego medio hasta que esté bien dorada por ambos lados.\n\n" +
            "Cuando la carne esté casi lista, coloca encima una loncha de queso para que se funda con el calor.\n\n" +
            "Retira el lomo con el queso y colócalo dentro de los panecillos abiertos.\n\n" +
            "Presiona ligeramente para que el montadito quede bien montado y sirve caliente para disfrutar del queso fundido.",
        ingredientes: "4 panecillos, 200g de cinta de lomo, 4 lonchas de queso, 1 cucharada de aceite de oliva",
        imagen: "https://e586196ebd.cbaul-cdnwnd.com/fe613981cde9efff7999412aa1d1dc27/system_preview_detail_200000042-d512fd7074-public/montaditos%20de%20lomo%20con%20queso.jpg",
        tipo: "Almuerzo",
        tiempo_preparacion: 20,
        kcal: 540,
        proteinas: 32,
        carbohidratos: 46,
        fibra: 2,
        grasas: 26,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como comida o tapa ocasional 1 a 3 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Patatas Bravas",
        descripcion: "Pela las patatas y córtalas en dados medianos, intentando que sean de tamaño similar para que se cocinen de forma uniforme.\n\n" +
            "Fríelas en abundante aceite caliente hasta que estén doradas por fuera y tiernas por dentro. Retíralas y déjalas escurrir sobre papel absorbente.\n\n" +
            "Para la salsa brava, sofríe el ajo picado en un poco de aceite hasta que esté ligeramente dorado.\n\n" +
            "Añade una cucharada de harina y remueve bien para cocinarla y formar una base espesa.\n\n" +
            "Incorpora el pimentón picante con cuidado de que no se queme, y rápidamente añade el caldo poco a poco mientras remueves hasta obtener una salsa homogénea.\n\n" +
            "Cocina unos minutos hasta que espese al gusto.\n\n" +
            "Sirve las patatas calientes y cúbrelas con la salsa brava por encima.",
        ingredientes: "4 patatas grandes (600g), 1 diente de ajo, 1 cucharada de harina, 1 cucharada de pimentón picante, 250ml de caldo, 300ml de aceite de oliva",
        imagen: "https://www.pequerecetas.com/wp-content/uploads/2018/06/patatas-bravas-madrid-autenticas-800x599.jpg",
        tipo: "Almuerzo",
        tiempo_preparacion: 45,
        kcal: 620,
        proteinas: 6,
        carbohidratos: 78,
        fibra: 7,
        grasas: 30,
        semaforo: "rojo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como tapa o acompañamiento puntual 1 vez cada 2 semanas o menos.",
        dificultad: "Media"
    },
    {
        titulo: "Tapa de Ensaladilla Rusa",
        descripcion: "Pela las patatas y las zanahorias, córtalas en trozos medianos y cuécelas en agua con sal hasta que estén tiernas.\n\n" +
            "En los últimos minutos de cocción, añade los guisantes para que se cocinen ligeramente.\n\n" +
            "Escurre bien todas las verduras y deja que se enfríen por completo.\n\n" +
            "En un bol grande, desmenuza el atún escurrido y añade las verduras cocidas ya frías.\n\n" +
            "Incorpora el huevo duro picado y mezcla todo con mayonesa hasta obtener una textura cremosa y uniforme.\n\n" +
            "Rectifica de sal si es necesario y deja reposar en la nevera antes de servir bien fresquita.",
        ingredientes: "3 patatas, 2 zanahorias, 100g de guisantes, 2 huevos, 2 latas de atún (160g), 150g de mayonesa",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVY4vOXQxh5dwsVgl0wWihuNUNq7tR-Lk97Q&s",
        tipo: "Almuerzo",
        tiempo_preparacion: 50,
        kcal: 430,
        proteinas: 18,
        carbohidratos: 28,
        fibra: 5,
        grasas: 26,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como tapa o entrante 1 a 3 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Croquetas de Jamón Ibérico",
        descripcion: "Pica finamente el jamón ibérico en trocitos pequeños y resérvalo.\n\n" +
            "En una sartén, derrite la mantequilla a fuego medio y añade la harina, removiendo constantemente para cocinarla y formar un roux sin grumos.\n\n" +
            "Ve incorporando la leche poco a poco sin dejar de remover, hasta obtener una bechamel espesa y cremosa.\n\n" +
            "Añade el jamón picado y mezcla bien para repartirlo de forma uniforme en la masa.\n\n" +
            "Cocina unos minutos más hasta que la masa se despegue de las paredes de la sartén.\n\n" +
            "Vierte la masa en una bandeja y deja enfriar completamente, preferiblemente en la nevera durante varias horas.\n\n" +
            "Forma las croquetas, pásalas por pan rallado y fríelas en aceite caliente hasta que estén doradas y crujientes por fuera.",
        ingredientes: "500ml de leche, 50g de mantequilla, 60g de harina, 150g de jamón ibérico, 100g de pan rallado",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQi61UPJMHHk8cbliePVPHoKps-0oHYdR_UQ&s",
        tipo: "Almuerzo",
        tiempo_preparacion: 90,
        kcal: 680,
        proteinas: 22,
        carbohidratos: 48,
        fibra: 2,
        grasas: 42,
        semaforo: "rojo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como tapa o comida puntual 1 vez cada 2 semanas o menos.",
        dificultad: "Difícil"
    },
    {
        titulo: "Tostada de Sobrasada y Miel",
        descripcion: "Corta el pan de cristal en rebanadas y tuéstalo ligeramente hasta que quede crujiente por fuera y aireado por dentro.\n\n" +
            "Si lo deseas, puedes calentar ligeramente la sobrasada en una sartén o unos segundos en el pan caliente para que sea más fácil de untar.\n\n" +
            "Unta una capa generosa de sobrasada sobre la tostada aún templada.\n\n" +
            "Añade un hilo de miel por encima, distribuyéndola de forma uniforme para equilibrar el sabor salado.\n\n" +
            "Sirve inmediatamente para disfrutar del contraste entre lo dulce y lo salado.",
        ingredientes: "2 rebanadas de pan de cristal, 80g de sobrasada, 1 cucharada de miel",
        imagen: "https://webosfritos.es/wp-content/uploads/2008/05/6419600861_53704f2151_o1-1200x900.jpg",
        tipo: "Almuerzo",
        tiempo_preparacion: 10,
        kcal: 460,
        proteinas: 12,
        carbohidratos: 34,
        fibra: 2,
        grasas: 30,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, ideal como tapa o capricho 1 vez por semana o menos.",
        dificultad: "Fácil"
    },
    {
        titulo: "Pulpo a la Gallega",
        descripcion: "Si el pulpo no está ya cocido, cuécelo en agua hirviendo con sal asustándolo tres veces (sumergiéndolo y sacándolo) antes de dejarlo cocer hasta que esté tierno.\n\n" +
            "Mientras tanto, pela las patatas y córtalas en rodajas gruesas. Cuécelas en agua con sal hasta que estén tiernas pero sin deshacerse.\n\n" +
            "Corta el pulpo en rodajas con unas tijeras de cocina.\n\n" +
            "Coloca una base de patatas cocidas en un plato de madera o fuente.\n\n" +
            "Encima, distribuye el pulpo cortado de forma uniforme.\n\n" +
            "Espolvorea sal gruesa, pimentón dulce y un poco de pimentón picante al gusto.\n\n" +
            "Finalmente, riega con un buen chorro de aceite de oliva virgen extra y sirve templado.",
        ingredientes: "1 pulpo (1.5kg), 3 patatas, 1 cucharada de pimentón dulce, 1 cucharadita de pimentón picante, sal gruesa, 3 cucharadas de aceite de oliva",
        imagen: "https://imag.bonviveur.com/pulpo-a-la-gallega-recien-hecho.jpg",
        tipo: "Almuerzo",
        tiempo_preparacion: 70,
        kcal: 520,
        proteinas: 38,
        carbohidratos: 42,
        fibra: 5,
        grasas: 22,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo moderado recomendado, ideal como plato principal 1 a 3 veces por semana.",
        dificultad: "Difícil"
    },
    {
        titulo: "Bocadillo de Jamón y Queso",
        descripcion: "Corta el pan por la mitad y tuéstalo ligeramente si prefieres una textura más crujiente por fuera.\n\n" +
            "Lava el tomate y rállalo o córtalo en rodajas finas, según tu preferencia.\n\n" +
            "Unta una capa de tomate sobre el pan y añade un chorrito de aceite de oliva virgen extra.\n\n" +
            "Coloca las lonchas de queso semicurado sobre la base del pan.\n\n" +
            "Añade el jamón serrano repartido de forma uniforme para que cada bocado tenga buen equilibrio de sabores.\n\n" +
            "Cierra el bocadillo, presiona ligeramente y sirve al momento.",
        ingredientes: "1 pan (barra), 80g de jamón serrano, 60g de queso semicurado, 1 tomate, 1 cucharada de aceite de oliva",
        imagen: "https://cdn3.myrealfood.app/recipes%2FicUz6hhx6HPqiHUII7Xq%2Fmain_0_1739226611651.jpg?alt=media&token=8ca13d17-d5da-4d09-8875-9e44feb65551",
        tipo: "Almuerzo",
        tiempo_preparacion: 8,
        kcal: 510,
        proteinas: 28,
        carbohidratos: 52,
        fibra: 3,
        grasas: 22,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como comida rápida o almuerzo 1 a 3 veces por semana.",
        dificultad: "Fácil"
    },

    // ----------------- COMIDA (10) -----------------
    {
        titulo: "Paella Valenciana",
        descripcion: "Calienta un buen chorro de aceite de oliva en la paellera y dora el pollo y el conejo troceados hasta que estén bien sellados por todos lados.\n\n" +
            "Añade la judía verde y el garrofón, y sofríe unos minutos hasta que las verduras estén ligeramente tiernas.\n\n" +
            "Incorpora el tomate rallado y cocina hasta que se reduzca y se concentre el sabor.\n\n" +
            "Añade el arroz bomba y rehógalo ligeramente para que absorba todos los sabores del sofrito.\n\n" +
            "Agrega el agua caliente junto con el azafrán y ajusta de sal. Reparte bien los ingredientes de forma uniforme en la paellera.\n\n" +
            "Cocina a fuego fuerte unos minutos y luego baja el fuego hasta que el arroz absorba el caldo por completo.\n\n" +
            "Deja reposar la paella unos minutos antes de servir para que los sabores se asienten.",
        ingredientes: "Arroz bomba (300 g), Pollo (300 g), Conejo (300 g), Garrofón (100 g), Judía verde (150 g), Azafrán (0,2 g), Tomate (200 g)",
        imagen: "https://www.expogourmetmagazine.com/uploads/fotos_noticias/2019/09/w800px_20089-160599-hacemos-la-tradicional-paella-valenciana.jpg",
        tipo: "Comida",
        tiempo_preparacion: 90,
        kcal: 720,
        proteinas: 42,
        carbohidratos: 78,
        fibra: 6,
        grasas: 28,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo moderado recomendado, ideal como plato principal 1 a 3 veces por semana.",
        dificultad: "Difícil"
    },
    {
        titulo: "Macarrones a la Boloñesa",
        descripcion: "Pica finamente la cebolla y la zanahoria. Sofríelas en una sartén con un chorrito de aceite de oliva a fuego medio hasta que estén tiernas.\n\n" +
            "Añade la carne picada y cocínala hasta que esté bien dorada, separándola con una cuchara para que no queden grumos.\n\n" +
            "Incorpora el tomate frito y mezcla bien. Cocina a fuego lento durante unos minutos para que la salsa espese y los sabores se integren.\n\n" +
            "Mientras tanto, cuece los macarrones en abundante agua con sal hasta que estén al dente. Escúrrelos bien.\n\n" +
            "Mezcla la pasta con la salsa boloñesa hasta que quede bien integrada.\n\n" +
            "Coloca todo en una bandeja de horno, espolvorea queso rallado por encima y gratina hasta que esté dorado y burbujeante.",
        ingredientes: "Macarrones (200 g), Carne picada (250 g), Tomate frito (200 g), Cebolla (1 ud), Zanahoria (1 ud), Queso rallado (80 g)",
        imagen: "https://laurelnatural.es/wp-content/uploads/2022/11/PASTA003.jpg",
        tipo: "Comida",
        tiempo_preparacion: 50,
        kcal: 780,
        proteinas: 38,
        carbohidratos: 82,
        fibra: 6,
        grasas: 30,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como plato principal 1 a 3 veces por semana.",
        dificultad: "Media"
    },
    {
        titulo: "Lentejas con Chorizo",
        descripcion: "Lava las lentejas si es necesario y déjalas en remojo previamente si así lo requiere la variedad.\n\n" +
            "En una olla grande, añade un chorrito de aceite de oliva y sofríe el pimiento, la zanahoria y la patata troceados durante unos minutos.\n\n" +
            "Incorpora el chorizo cortado en rodajas y rehógalo ligeramente para que suelte su sabor.\n\n" +
            "Añade las lentejas junto con una o dos hojas de laurel y cubre todo con agua o caldo caliente.\n\n" +
            "Cocina a fuego medio durante aproximadamente 30-40 minutos, removiendo de vez en cuando para evitar que se peguen.\n\n" +
            "Si es necesario, añade más agua durante la cocción hasta que las lentejas estén tiernas y el guiso tenga una textura cremosa.\n\n" +
            "Rectifica de sal y deja reposar unos minutos antes de servir.",
        ingredientes: "Lentejas pardinas (250 g), Chorizo (150 g), Patata (1 ud), Zanahoria (1 ud), Pimiento (1 ud), Laurel (2 hojas)",
        imagen: "https://medias.blogosferathermomix.es/media/Posts/attachments/f1d99dccd4551999a6d1bbb5b9bc4b5f.jpg",
        tipo: "Comida",
        tiempo_preparacion: 60,
        kcal: 690,
        proteinas: 32,
        carbohidratos: 64,
        fibra: 12,
        grasas: 28,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, ideal como plato único 1 vez por semana o menos.",
        dificultad: "Media"
    },
    {
        titulo: "Pollo Asado con Patatas",
        descripcion: "Precalienta el horno a 200ºC mientras preparas el pollo.\n\n" +
            "Limpia el pollo y colócalo en una bandeja de horno. Salpimienta bien por dentro y por fuera.\n\n" +
            "Unta el pollo con aceite de oliva y añade ajo picado, tomillo y el zumo de limón, masajeando la piel para que se impregnen los sabores.\n\n" +
            "Pela las patatas y córtalas en trozos grandes. Colócalas alrededor del pollo en la bandeja.\n\n" +
            "Añade un vaso de cerveza a la bandeja para aportar jugosidad durante la cocción.\n\n" +
            "Hornea durante aproximadamente 60-75 minutos, regando el pollo con sus propios jugos de vez en cuando para que quede dorado y jugoso.\n\n" +
            "Deja reposar unos minutos antes de cortar y servir junto con las patatas.",
        ingredientes: "Pollo entero (1,5 kg), Patatas (600 g), Ajo (4 dientes), Limón (1 ud), Tomillo (1 cdita), Aceite de oliva (3 cdas), Cerveza (330 ml)",
        imagen: "https://cdn3.myrealfood.app/recipes%2FqeA0c2wFA1KCbhdRfj13%2Fmain.jpg?alt=media&token=f071056a-1d38-4624-bc5e-c59100dd87ed",
        tipo: "Comida",
        tiempo_preparacion: 90,
        kcal: 820,
        proteinas: 65,
        carbohidratos: 58,
        fibra: 6,
        grasas: 38,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo moderado recomendado, ideal como plato principal 1 a 3 veces por semana.",
        dificultad: "Media"
    },
    {
        titulo: "Fabada Asturiana",
        descripcion: "Deja las fabes en remojo la noche anterior para que se hidraten correctamente.\n\n" +
            "En una olla grande, coloca las fabes escurridas junto con el chorizo, la morcilla y la panceta troceada.\n\n" +
            "Cubre con agua fría hasta que todo quede bien sumergido y lleva a fuego medio.\n\n" +
            "Cuando empiece a hervir, retira la espuma que se forme en la superficie para limpiar el caldo.\n\n" +
            "Añade una cucharadita de pimentón y unas hebras de azafrán, removiendo suavemente la olla sin romper las fabes.\n\n" +
            "Cocina a fuego lento durante varias horas, añadiendo un poco de agua fría de vez en cuando para asustar las fabes y mantener su textura cremosa.\n\n" +
            "Cuando las fabes estén tiernas y el caldo espeso, ajusta de sal y deja reposar antes de servir.",
        ingredientes: "Fabes (500 g), Chorizo (150 g), Morcilla (150 g), Panceta (200 g), Azafrán (0,2 g), Pimentón (1 cda)",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqgxmmDH2ncqHUylJCuIKY337ia-8CVT1t_w&s",
        tipo: "Comida",
        tiempo_preparacion: 200,
        kcal: 920,
        proteinas: 42,
        carbohidratos: 68,
        fibra: 14,
        grasas: 52,
        semaforo: "rojo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como plato único contundente 1 vez cada 2 semanas o menos.",
        dificultad: "Difícil"
    },
    {
        titulo: "Cocido Madrileño",
        descripcion: "Deja los garbanzos en remojo la noche anterior para que se hidraten bien.\n\n" +
            "En una olla grande con agua, añade el morcillo, el tocino y el chorizo. Lleva a ebullición y ve retirando la espuma que aparezca en la superficie.\n\n" +
            "Incorpora los garbanzos escurridos y cocina a fuego medio-bajo durante varias horas hasta que estén tiernos.\n\n" +
            "Durante la cocción, añade sal y ajusta el caldo según sea necesario, manteniendo siempre suficiente líquido para que no se sequen los ingredientes.\n\n" +
            "En otra olla, cuece el repollo aparte con un poco de sal hasta que esté tierno.\n\n" +
            "Cuando todo esté listo, separa el caldo para servirlo primero como sopa con fideos.\n\n" +
            "Sirve después los garbanzos con las carnes y el repollo como segundo vuelco.",
        ingredientes: "Garbanzos (300 g), Fideos (100 g), Morcillo de ternera (300 g), Tocino (150 g), Chorizo (150 g), Repollo (200 g)",
        imagen: "https://www.laespanolaaceites.com/wp-content/uploads/2019/06/cocido-madrileno-1080x671.jpg",
        tipo: "Comida",
        tiempo_preparacion: 210,
        kcal: 980,
        proteinas: 55,
        carbohidratos: 72,
        fibra: 12,
        grasas: 58,
        semaforo: "rojo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como plato único contundente 1 vez cada 2 semanas o menos.",
        dificultad: "Difícil"
    },
    {
        titulo: "Salmón al Horno con Espárragos",
        descripcion: "Precalienta el horno a 200ºC mientras preparas los ingredientes.\n\n" +
            "Lava los espárragos trigueros y córtales la parte más dura del tallo.\n\n" +
            "Colócalos en una bandeja de horno junto con los lomos de salmón.\n\n" +
            "Salpimienta el salmón y los espárragos al gusto, y añade un chorrito de aceite de oliva por encima.\n\n" +
            "Corta unas rodajas de limón y colócalas sobre el salmón para aportar aroma y frescura.\n\n" +
            "Espolvorea un poco de eneldo por encima para potenciar el sabor.\n\n" +
            "Hornea durante unos 12-15 minutos, hasta que el salmón esté jugoso y en su punto.\n\n" +
            "Sirve inmediatamente recién salido del horno.",
        ingredientes: "Lomos de salmón (300 g), Espárragos trigueros (200 g), Limón (1 ud), Eneldo (1 cdita), Sal (al gusto), Pimienta (al gusto)",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTICyYULF9BgcC8XjTVbnNbiocuPCd37KZ8aw&s",
        tipo: "Comida",
        tiempo_preparacion: 25,
        kcal: 410,
        proteinas: 34,
        carbohidratos: 10,
        fibra: 4,
        grasas: 26,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como plato principal saludable 3 a 5 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Estofado de Ternera",
        descripcion: "Corta la ternera en trozos medianos y salpimiéntala al gusto.\n\n" +
            "En una cazuela grande, añade un chorrito de aceite de oliva y dora la carne a fuego fuerte hasta que esté bien sellada por todos lados.\n\n" +
            "Retira la carne y, en la misma cazuela, sofríe la cebolla picada hasta que esté transparente.\n\n" +
            "Añade las zanahorias en rodajas y cocina unos minutos más para que se ablanden ligeramente.\n\n" +
            "Incorpora la carne de nuevo y añade un vaso de vino tinto, dejando que reduzca el alcohol.\n\n" +
            "Cubre con agua o caldo y cocina a fuego lento durante al menos 1,5 o 2 horas, hasta que la carne esté muy tierna.\n\n" +
            "Añade las patatas en trozos y los guisantes en los últimos 20-25 minutos de cocción.\n\n" +
            "Rectifica de sal y deja reposar unos minutos antes de servir.",
        ingredientes: "Ternera para guisar (500 g), Patatas (300 g), Zanahorias (2 ud), Guisantes (150 g), Vino tinto (150 ml), Cebolla (1 ud)",
        imagen: "https://e00-xlk-cooking-elmundo.uecdn.es/files/article_main_microformat_4_3/uploads/2023/03/01/63fe9b16e9189.jpeg",
        tipo: "Comida",
        tiempo_preparacion: 140,
        kcal: 760,
        proteinas: 48,
        carbohidratos: 54,
        fibra: 7,
        grasas: 38,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como plato principal 1 a 3 veces por semana.",
        dificultad: "Difícil"
    },
    {
        titulo: "Risotto de Setas",
        descripcion: "Pica finamente la cebolla y sofríela en una cazuela con mantequilla a fuego medio hasta que esté transparente.\n\n" +
            "Añade las setas troceadas y cocínalas hasta que suelten su agua y empiecen a dorarse.\n\n" +
            "Incorpora el arroz arborio y rehógalo durante un par de minutos para que absorba los sabores.\n\n" +
            "Añade el caldo de pollo caliente poco a poco, removiendo constantemente para que el arroz suelte el almidón y quede cremoso.\n\n" +
            "Continúa añadiendo caldo a medida que se va absorbiendo, durante unos 18-20 minutos aproximadamente.\n\n" +
            "Cuando el arroz esté en su punto, retira del fuego y añade el queso parmesano rallado y una nuez de mantequilla.\n\n" +
            "Remueve bien hasta obtener una textura cremosa y brillante.\n\n" +
            "Deja reposar un minuto y sirve inmediatamente.",
        ingredientes: "Arroz arborio (250 g), Setas variadas (200 g), Caldo de pollo (1 L), Queso parmesano (80 g), Mantequilla (30 g), Cebolla (1 ud)",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK6F34P0van1U0jiuDuk0thAK4p8D7mURREw&s",
        tipo: "Comida",
        tiempo_preparacion: 30,
        kcal: 650,
        proteinas: 18,
        carbohidratos: 78,
        fibra: 4,
        grasas: 28,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como plato principal 1 a 3 veces por semana.",
        dificultad: "Media"
    },
    {
        titulo: "Lasaña de Carne",
        descripcion: "Pica la cebolla (si deseas añadirla) y sofríela en una sartén con un poco de aceite de oliva hasta que esté transparente.\n\n" +
            "Añade la carne picada y cocínala a fuego medio hasta que esté bien dorada y suelta.\n\n" +
            "Incorpora el tomate y cocina a fuego lento durante unos 10-15 minutos hasta obtener una salsa espesa y sabrosa.\n\n" +
            "Prepara la salsa bechamel o caliéntala si ya la tienes lista.\n\n" +
            "Cuece las placas de lasaña si así lo requiere el fabricante y resérvalas.\n\n" +
            "En una fuente de horno, monta la lasaña alternando capas de pasta, salsa de carne y bechamel.\n\n" +
            "Repite el proceso hasta terminar los ingredientes, finalizando con bechamel y queso para gratinar.\n\n" +
            "Hornea a 180ºC durante unos 25-30 minutos hasta que esté dorada y burbujeante por encima.\n\n" +
            "Deja reposar unos minutos antes de cortar y servir.",
        ingredientes: "Placas de lasaña (12 ud), Carne picada (400 g), Tomate (300 g), Salsa bechamel (300 ml), Queso para gratinar (100 g)",
        imagen: "https://www.annarecetasfaciles.com/files/lasana-de-carne-2-1-815x458.jpg",
        tipo: "Comida",
        tiempo_preparacion: 60,
        kcal: 840,
        proteinas: 44,
        carbohidratos: 72,
        fibra: 6,
        grasas: 42,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, ideal como plato único contundente 1 vez por semana o menos.",
        dificultad: "Media"
    },

    // ----------------- MERIENDA (10) -----------------
    {
        titulo: "Tostada con Tomate y Aceite",
        descripcion: "Tuesta el pan y frota el tomate maduro sobre la superficie. Añade aceite de oliva y una pizca de sal.",
        ingredientes: "Pan (1 rebanada), Tomate maduro (1 ud), Aceite de oliva (1 cda), Sal",
        imagen: "https://s2.elespanol.com/2021/08/09/ciencia/nutricion/602951376_200200854_1706x960.jpg",
        tipo: "Merienda",
        tiempo_preparacion: 5,
        kcal: 220,
        proteinas: 4,
        carbohidratos: 25,
        fibra: 2,
        grasas: 11,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como desayuno o merienda ligera entre 3 y 6 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Leche con Galletas",
        descripcion: "Sirve un vaso de leche y acompaña con galletas María para mojar, una merienda clásica de toda la vida.",
        ingredientes: "Leche (250 ml), Galletas María (6-8 ud)",
        imagen: "https://www.dicyt.com/data/39/25539.jpg",
        tipo: "Merienda",
        tiempo_preparacion: 1,
        kcal: 310,
        proteinas: 9,
        carbohidratos: 42,
        fibra: 1,
        grasas: 12,
        semaforo: "amarillo",
        consumo_habitual: "Consumo ocasional o moderado, recomendable no exceder varias veces por semana por su aporte de azúcares simples.",
        dificultad: "Fácil"
    },
    {
        titulo: "Magdalenas Caseras",
        descripcion: "Bate los ingredientes, rellena moldes y hornea hasta que estén doradas y esponjosas.",
        ingredientes: "Harina (200 g), Azúcar (150 g), Huevos (2 ud), Aceite de girasol (100 ml), Levadura (1 sobre)",
        imagen: "https://recetasdecocina.elmundo.es/wp-content/uploads/2024/09/receta-de-magdalenas.jpg",
        tipo: "Merienda",
        tiempo_preparacion: 35,
        kcal: 420,
        proteinas: 8,
        carbohidratos: 58,
        fibra: 2,
        grasas: 18,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, ideal como dulce de merienda 1 vez por semana o menos.",
        dificultad: "Media"
    },
    {
        titulo: "Tostada con Nutella",
        descripcion: "Tuesta el pan ligeramente y unta una capa generosa de Nutella sobre la superficie. Ideal como merienda dulce rápida y clásica.",
        ingredientes: "Pan (1 rebanada), Nutella (2-3 cdas)",
        imagen: "https://www.nocilla.es/bundles/nocillaweb/img_new/nocilleator/TOSTADAS.jpg",
        tipo: "Merienda",
        tiempo_preparacion: 5,
        kcal: 380,
        proteinas: 6,
        carbohidratos: 45,
        fibra: 2,
        grasas: 20,
        semaforo: "rojo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como capricho dulce 1 vez por semana o menos.",
        dificultad: "Fácil"
    },
    {
        titulo: "Ensaimada Mallorquina",
        descripcion: "Masa fermentada en espiral horneada hasta quedar ligera y esponjosa.",
        ingredientes: "Harina (300 g), Azúcar (80 g), Huevos (2 ud), Manteca de cerdo (50 g)",
        imagen: "https://imag.bonviveur.com/ensaimada-de-mallorca-casera.jpg",
        tipo: "Merienda",
        tiempo_preparacion: 120,
        kcal: 520,
        proteinas: 10,
        carbohidratos: 70,
        fibra: 2,
        grasas: 22,
        semaforo: "rojo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como dulce tradicional de merienda o desayuno 1 vez por semana o menos.",
        dificultad: "Media"
    },
    {
        titulo: "Rosquillas Caseras",
        descripcion: "Forma las rosquillas con la masa, fríelas u hornéalas y espolvorea azúcar al final.",
        ingredientes: "Harina (250 g), Huevos (2 ud), Azúcar (100 g), Aceite para freír, Anís (10 ml)",
        imagen: "https://imag.bonviveur.com/rosquillas-fritas.jpg",
        tipo: "Merienda",
        tiempo_preparacion: 90,
        kcal: 460,
        proteinas: 8,
        carbohidratos: 62,
        fibra: 2,
        grasas: 20,
        semaforo: "rojo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como dulce tradicional de merienda 1 vez por semana o menos.",
        dificultad: "Media"
    },
    {
        titulo: "Sándwich Mixto",
        descripcion: "Rellena el pan con jamón cocido y queso, unta mantequilla y tuesta hasta dorar.",
        ingredientes: "Pan de molde (2 rebanadas), Jamón cocido (2 lonchas), Queso (2 lonchas), Mantequilla (10 g)",
        imagen: "https://recetasdecocina.elmundo.es/wp-content/uploads/2024/01/sandwich-mixto.jpg",
        tipo: "Merienda",
        tiempo_preparacion: 10,
        kcal: 350,
        proteinas: 18,
        carbohidratos: 30,
        fibra: 2,
        grasas: 18,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como merienda o cena ligera 2 a 4 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Yogur con Miel y Nueces",
        descripcion: "Yogur natural con miel y nueces troceadas por encima.",
        ingredientes: "Yogur natural (125 g), Miel (1 cda), Nueces (20 g)",
        imagen: "https://antojoentucocina.com/wp-content/uploads/2020/08/mousse-yogur-miel-4.jpg",
        tipo: "Merienda",
        tiempo_preparacion: 5,
        kcal: 240,
        proteinas: 8,
        carbohidratos: 18,
        fibra: 2,
        grasas: 15,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como merienda ligera o postre saludable 3 a 6 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Mona",
        descripcion: "Disuelve la levadura en la leche templada. En un bol mezcla la harina con el azúcar y una pizca de sal. Añade los huevos, la mantequilla derretida y la leche con la levadura. Amasa hasta conseguir una masa suave y elástica. Deja reposar tapada hasta que doble su volumen. Forma bollos redondos o ligeramente alargados y colócalos en una bandeja de horno. Hornea a 180ºC durante 20-25 minutos hasta que estén dorados. Deja enfriar.",
        ingredientes: "Harina (500 g), Levadura fresca (25 g), Leche (200 ml), Huevos (2 ud), Azúcar (100 g), Mantequilla (80 g), Sal (1 pizca)",
        imagen: "https://pedroacostacocinero.wordpress.com/wp-content/uploads/2018/02/dsc_0309.jpg?w=816",
        tipo: "Merienda",
        tiempo_preparacion: 120,
        kcal: 480,
        proteinas: 10,
        carbohidratos: 78,
        fibra: 2,
        grasas: 14,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, ideal como dulce tradicional en celebraciones o fines de semana.",
        dificultad: "Media"
    },
    {
        titulo: "Pan con Mantequilla y Mermelada de Fresa",
        descripcion: "Tuesta ligeramente el pan si lo deseas y unta una capa de mantequilla. Añade mermelada de fresa por encima para una merienda dulce y clásica.",
        ingredientes: "Pan (1 rebanada), Mantequilla (15 g), Mermelada de fresa (1-2 cdas)",
        imagen: "https://app.nutrium.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTUyMDIwMiwicHVyIjoiYmxvYl9pZCJ9fQ==--f72faa549588dc51b5178d36bea71f7de5abb420/molletes-dulces-con-mermelada.jpg",
        tipo: "Merienda",
        tiempo_preparacion: 5,
        kcal: 330,
        proteinas: 4,
        carbohidratos: 40,
        fibra: 1,
        grasas: 16,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como merienda dulce ocasional 1 a 3 veces por semana.",
        dificultad: "Fácil"
    },

    // ----------------- CENA (10) -----------------
    {
        titulo: "Crema de Calabacín",
        descripcion: "Comienza pelando y troceando la cebolla, el calabacín y la patata en trozos medianos para facilitar la cocción. En una olla grande, añade un chorrito de aceite de oliva y sofríe la cebolla a fuego medio hasta que esté transparente y ligeramente dorada. Incorpora el calabacín y la patata, rehoga todo junto durante unos minutos para potenciar el sabor. Cubre con caldo de verduras caliente y cocina a fuego medio durante unos 20-25 minutos, hasta que las verduras estén muy tiernas. Tritura todo con una batidora hasta obtener una crema fina y homogénea. Ajusta de sal y sirve caliente con un chorrito de aceite de oliva por encima si lo deseas.",
        ingredientes: "Calabacín (2 ud), Cebolla (1 ud), Patata (1 ud), Caldo de verduras (700 ml), Aceite de oliva",
        imagen: "https://danzadefogones.com/wp-content/uploads/2025/04/crema-de-calabacin.jpg",
        tipo: "Cena",
        tiempo_preparacion: 35,
        kcal: 180,
        proteinas: 4,
        carbohidratos: 28,
        fibra: 5,
        grasas: 6,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como cena ligera entre 4 y 6 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Revuelto de Champiñones",
        descripcion: "Limpia y lamina los champiñones, asegurándote de retirar cualquier resto de tierra. En una sartén amplia, añade un chorrito de aceite de oliva y sofríe el ajo picado a fuego medio hasta que desprenda aroma sin llegar a quemarse. Incorpora los champiñones y cocínalos hasta que suelten el agua y se doren ligeramente. Mientras tanto, bate los huevos con una pizca de sal. Reduce el fuego y añade los huevos a la sartén, removiendo suavemente hasta que cuajen pero mantengan una textura jugosa y cremosa.",
        ingredientes: "Huevos (3 ud), Champiñones (200 g), Ajo (1 diente), Aceite de oliva, Sal",
        imagen: "https://es-mycooktouch.group-taurus.com/image/recipe/540x391/revuelto-de-champinones-con-bacon",
        tipo: "Cena",
        tiempo_preparacion: 15,
        kcal: 260,
        proteinas: 20,
        carbohidratos: 6,
        fibra: 2,
        grasas: 18,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como cena ligera y proteica entre 3 y 6 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Merluza a la Plancha",
        descripcion: "Sazona los lomos de merluza con sal por ambos lados y deja reposar unos minutos para que cojan sabor. Calienta una sartén con un chorrito de aceite de oliva a fuego medio-alto. Coloca la merluza y cocínala durante unos minutos por cada lado, hasta que esté dorada por fuera y jugosa por dentro. Evita moverla demasiado para que no se rompa. Justo antes de servir, añade unas gotas de limón para potenciar su sabor natural.",
        ingredientes: "Merluza (2 lomos), Aceite de oliva, Sal, Limón",
        imagen: "https://comedera.com/wp-content/uploads/sites/9/2019/05/merluza-a-la-plancha.jpg",
        tipo: "Cena",
        tiempo_preparacion: 10,
        kcal: 190,
        proteinas: 32,
        carbohidratos: 1,
        fibra: 0,
        grasas: 7,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como cena ligera o plato principal saludable 3 a 6 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Ensalada Mixta",
        descripcion: "Lava cuidadosamente la lechuga y trocéala en un bol grande junto con el tomate y la cebolla cortados al gusto. Añade el atún bien escurrido y los huevos cocidos cortados en cuartos. Prepara un aliño sencillo con aceite de oliva, vinagre y sal, y mézclalo todo justo antes de servir para mantener la frescura y la textura crujiente de los ingredientes.",
        ingredientes: "Lechuga, Tomate (2 ud), Cebolla, Atún (1 lata), Huevos (2 ud), Aceite de oliva, Vinagre, Sal",
        imagen: "https://www.recipesfromeurope.com/wp-content/uploads/2022/12/ensalada-mixta-recipe-og.jpg",
        tipo: "Cena",
        tiempo_preparacion: 15,
        kcal: 320,
        proteinas: 22,
        carbohidratos: 12,
        fibra: 4,
        grasas: 20,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como cena ligera y saludable 3 a 6 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Ensalada Mixta",
        descripcion: "Lava cuidadosamente la lechuga y trocéala en un bol grande junto con el tomate y la cebolla cortados al gusto. Añade el atún bien escurrido y los huevos cocidos cortados en cuartos. Prepara un aliño sencillo con aceite de oliva, vinagre y sal, y mézclalo todo justo antes de servir para mantener la frescura y la textura crujiente de los ingredientes.",
        ingredientes: "Lechuga, Tomate (2 ud), Cebolla, Atún (1 lata), Huevos (2 ud), Aceite de oliva, Vinagre, Sal",
        imagen: "https://www.recipesfromeurope.com/wp-content/uploads/2022/12/ensalada-mixta-recipe-og.jpg",
        tipo: "Cena",
        tiempo_preparacion: 15,
        kcal: 320,
        proteinas: 22,
        carbohidratos: 12,
        fibra: 5,
        grasas: 20,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como cena ligera o plato principal saludable 4 a 7 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Sopa",
        descripcion: "Calienta el caldo de pollo en una olla hasta que empiece a hervir suavemente. Añade los fideos finos y cocina durante unos minutos siguiendo las indicaciones del fabricante, removiendo de vez en cuando para evitar que se peguen. Ajusta de sal si es necesario y sirve la sopa bien caliente, ideal para una cena ligera y reconfortante.",
        ingredientes: "Caldo de pollo (1 L), Fideos finos (80 g), Sal",
        imagen: "https://lacocinadefrabisa.lavozdegalicia.es/wp-content/uploads/2023/02/sopa-de-fideos-con-sustancia-500x500.jpg",
        tipo: "Cena",
        tiempo_preparacion: 15,
        kcal: 210,
        proteinas: 7,
        carbohidratos: 32,
        fibra: 1,
        grasas: 6,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como cena ligera o reconfortante 4 a 7 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Pisto Manchego",
        descripcion: "Lava y corta todas las verduras en trozos pequeños y regulares. En una sartén amplia, añade aceite de oliva y sofríe lentamente las verduras a fuego medio-bajo, comenzando por las más duras para que se cocinen de forma uniforme. Cocina durante unos 30-40 minutos hasta que todo esté bien pochado y con textura melosa. Puedes servirlo solo o acompañado de un huevo frito o escalfado por encima.",
        ingredientes: "Calabacín, Berenjena, Pimiento, Tomate, Aceite de oliva, Sal",
        imagen: "https://recetasdecocina.elmundo.es/wp-content/uploads/2025/03/pisto-receta.jpg",
        tipo: "Cena",
        tiempo_preparacion: 40,
        kcal: 260,
        proteinas: 5,
        carbohidratos: 18,
        fibra: 7,
        grasas: 18,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como cena ligera o guarnición saludable 4 a 7 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Tortilla de Patatas",
        descripcion: "Pela las patatas y córtalas en láminas finas junto con la cebolla. Fríelas lentamente en abundante aceite de oliva hasta que estén tiernas sin llegar a dorarse demasiado. Escurre el exceso de aceite y mezcla las patatas con los huevos batidos con sal. Vierte la mezcla en una sartén caliente y cuaja la tortilla por ambos lados hasta conseguir el punto deseado, más o menos jugosa según preferencia.",
        ingredientes: "Patatas (500 g), Huevos (4 ud), Cebolla (1 ud), Aceite de oliva, Sal",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsMcTmjAgVQgwId2TvCa4eUjk_DfZ4Qbn8Mg&s",
        tipo: "Cena",
        tiempo_preparacion: 45,
        kcal: 690,
        proteinas: 24,
        carbohidratos: 52,
        fibra: 5,
        grasas: 42,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como cena o plato principal 1 a 3 veces por semana.",
        dificultad: "Media"
    },
    {
        titulo: "Croquetas Caseras de Cocido",
        descripcion: "Prepara una base de bechamel derritiendo mantequilla en una sartén y añadiendo harina hasta formar una pasta. Incorpora la leche poco a poco sin dejar de remover hasta obtener una crema espesa y sin grumos. Añade la carne del cocido bien picada y mezcla hasta integrarla completamente. Deja enfriar la masa en la nevera durante varias horas. Después, forma las croquetas, pásalas por huevo y pan rallado y fríelas en aceite caliente hasta que estén doradas y crujientes por fuera.",
        ingredientes: "Leche (500 ml), Harina (60 g), Mantequilla (60 g), Carne de cocido (pollo, ternera, jamón) (150 g), Huevo (1-2 ud), Pan rallado, Aceite para freír",
        imagen: "https://i.ytimg.com/vi/fqtDnJw4FXU/maxresdefault.jpg",
        tipo: "Cena",
        tiempo_preparacion: 180,
        kcal: 520,
        proteinas: 22,
        carbohidratos: 42,
        fibra: 2,
        grasas: 28,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, ideal como cena o tapa 1 vez por semana o menos.",
        dificultad: "Difícil"
    },
    {
        titulo: "Bacalao al Horno con Patatas",
        descripcion: "Precalienta el horno y prepara una base con patatas cortadas en rodajas finas junto con cebolla, todo bien distribuido en una bandeja. Aliña con aceite de oliva y sal y hornea unos minutos para que las patatas comiencen a ablandarse. Coloca encima los lomos de bacalao desalado y continúa la cocción hasta que el pescado esté tierno y ligeramente dorado. Termina con un poco de perejil fresco y un chorrito de aceite de oliva antes de servir.",
        ingredientes: "Bacalao (2 lomos), Patatas (400 g), Cebolla (1 ud), Aceite de oliva, Perejil, Sal",
        imagen: "https://imag.bonviveur.com/bacalao-al-horno-con-patatas-y-cebolla.jpg",
        tipo: "Cena",
        tiempo_preparacion: 45,
        kcal: 410,
        proteinas: 38,
        carbohidratos: 28,
        fibra: 4,
        grasas: 16,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como cena saludable 3 a 5 veces por semana.",
        dificultad: "Media"
    },

    // ----------------- POSTRE (10) -----------------
    {
        titulo: "Tarta de Queso Viña",
        descripcion: "Precalienta el horno a 200ºC para conseguir una superficie bien tostada.\n\nEn un bol grande, bate el queso crema junto con el azúcar hasta obtener una mezcla suave y sin grumos.\n\nAñade los huevos uno a uno, mezclando bien después de cada incorporación.\n\nIncorpora la nata líquida y una pizca de sal, y mezcla hasta que la masa quede completamente homogénea.\n\nVierte la mezcla en un molde forrado con papel de horno.\n\nHornea durante 35-45 minutos hasta que la superficie esté bien dorada y el interior aún ligeramente tembloroso.\n\nDeja enfriar a temperatura ambiente y después refrigera varias horas antes de servir para que tome cuerpo.",
        ingredientes: "Queso crema (500g), Nata líquida (200ml), Huevos (4 unidades), Azúcar (150g), Sal (1 pizca)",
        imagen: "https://lacocinadefrabisa.lavozdegalicia.es/wp-content/uploads/2023/04/TARTA-LA-VINA-2.jpg",
        tipo: "Postre",
        tiempo_preparacion: 60,
        kcal: 420,
        proteinas: 9,
        carbohidratos: 28,
        fibra: 0,
        grasas: 30,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, ideal como postre 1 vez por semana o en ocasiones especiales.",
        dificultad: "Media"
    },
    {
        titulo: "Flan de Huevo Casero",
        descripcion: "Precalienta el horno a 180ºC y prepara una bandeja apta para baño maría.\n\nEn un bol, bate los huevos junto con el azúcar hasta que estén bien integrados, sin llegar a espumar en exceso.\n\nAñade la leche poco a poco mientras sigues mezclando para obtener una crema suave y homogénea.\n\nColoca caramelo líquido en el fondo de los moldes individuales o del molde grande.\n\nVierte la mezcla sobre el caramelo con cuidado.\n\nColoca los moldes dentro de la bandeja con agua caliente (baño maría) y hornea durante 40-50 minutos.\n\nComprueba la cocción pinchando con un palillo; debe salir limpio.\n\nDeja enfriar completamente y refrigera varias horas antes de desmoldar.",
        ingredientes: "Leche (500ml), Huevos (4 unidades), Azúcar (120g), Caramelo líquido (al gusto)",
        imagen: "https://yhoyquecomemos.com/wp-content/uploads/2020/05/flan-de-huevo-receta.jpg",
        tipo: "Postre",
        tiempo_preparacion: 60,
        kcal: 280,
        proteinas: 8,
        carbohidratos: 32,
        fibra: 0,
        grasas: 12,
        semaforo: "amarillo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como postre 1 vez por semana o en celebraciones.",
        dificultad: "Media"
    },
    {
        titulo: "Arroz con Leche",
        descripcion: "En una cazuela, añade la leche junto con la canela en rama y la piel de limón, y caliéntalo a fuego medio hasta que empiece a humear sin llegar a hervir.\n\nAñade el arroz y cocina a fuego lento, removiendo de vez en cuando para evitar que se pegue.\n\nContinúa la cocción durante unos 35-40 minutos, hasta que el arroz esté tierno y la mezcla haya espesado.\n\nRetira la canela y la piel de limón una vez que el arroz esté en su punto.\n\nIncorpora el azúcar y mezcla bien hasta que se disuelva completamente.\n\nCocina unos minutos más para integrar los sabores.\n\nDeja enfriar a temperatura ambiente y después refrigera.\n\nAntes de servir, espolvorea canela en polvo al gusto si lo deseas.",
        ingredientes: "Arroz (100g), Leche (1L), Azúcar (120g), Canela en rama (1 unidad), Piel de limón (1 tira)",
        imagen: "https://danzadefogones.com/wp-content/uploads/2025/02/como-hacer-arroz-con-leche.jpg",
        tipo: "Postre",
        tiempo_preparacion: 50,
        kcal: 310,
        proteinas: 7,
        carbohidratos: 58,
        fibra: 1,
        grasas: 8,
        semaforo: "amarillo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como postre 1 vez por semana o en ocasiones especiales.",
        dificultad: "Fácil"
    },
    {
        titulo: "Coulant de Chocolate",
        descripcion: "Precalienta el horno a 200ºC y engrasa ligeramente los moldes individuales.\n\nDerrite el chocolate fondant junto con la mantequilla al baño maría o en el microondas en intervalos cortos, mezclando hasta obtener una crema lisa.\n\nEn un bol aparte, bate los huevos con el azúcar hasta que la mezcla esté espumosa.\n\nIncorpora el chocolate derretido a la mezcla de huevos y remueve suavemente.\n\nAñade la harina tamizada y mezcla lo justo hasta integrar todos los ingredientes.\n\nRellena los moldes hasta 3/4 de su capacidad.\n\nHornea durante 8-10 minutos, lo justo para que el exterior cuaje pero el interior quede líquido.\n\nDesmolda con cuidado y sirve inmediatamente para que el corazón de chocolate siga fundido.",
        ingredientes: "Chocolate fondant (150g), Mantequilla (100g), Huevos (3 unidades), Azúcar (80g), Harina (40g)",
        imagen: "https://www.eladerezo.com/wp-content/uploads/2016/03/coulant-de-chocolate-3-600x400.jpg",
        tipo: "Postre",
        tiempo_preparacion: 25,
        kcal: 480,
        proteinas: 7,
        carbohidratos: 38,
        fibra: 2,
        grasas: 32,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, ideal como postre 1 vez por semana o en celebraciones.",
        dificultad: "Media"
    },
    {
        titulo: "Tiramisú Italiano",
        descripcion: "Separa las claras y las yemas de los huevos.\n\nBate las yemas con el azúcar hasta obtener una crema suave y ligeramente espesa.\n\nAñade el queso mascarpone y mezcla hasta integrar completamente.\n\nMonta las claras a punto de nieve y añádelas suavemente a la crema con movimientos envolventes.\n\nPrepara el café y déjalo enfriar a temperatura ambiente.\n\nMoja ligeramente los bizcochos de soletilla en el café sin empaparlos en exceso.\n\nEn una fuente, coloca una capa de bizcochos y cúbrelos con una capa de crema de mascarpone.\n\nRepite el proceso alternando capas hasta terminar los ingredientes.\n\nRefrigera durante al menos 4 horas.\n\nAntes de servir, espolvorea cacao puro por encima.",
        ingredientes: "Queso Mascarpone (250g), Bizcochos de soletilla (200g), Café (200ml), Cacao puro (al gusto), Huevos (3 unidades), Azúcar (100g)",
        imagen: "https://recetasdecocina.elmundo.es/wp-content/uploads/2022/08/tiramisu-postre-italiano.jpg",
        tipo: "Postre",
        tiempo_preparacion: 30,
        kcal: 390,
        proteinas: 8,
        carbohidratos: 42,
        fibra: 1,
        grasas: 22,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, ideal como postre 1 vez por semana o en celebraciones.",
        dificultad: "Media"
    },
    {
        titulo: "Helado Casero de Vainilla",
        descripcion: "Monta la nata bien fría hasta textura firme.\n\nMezcla la leche condensada con el extracto de vainilla.\n\nIncorpora la nata montada con movimientos envolventes.\n\nVierte en un recipiente apto para congelador.\n\nCongela al menos 6 horas.\n\nDeja reposar unos minutos antes de servir.",
        ingredientes: "Nata para montar (400ml), Leche condensada (300g), Extracto de vainilla (1 cucharadita)",
        imagen: "https://gourmet.iprospect.cl/wp-content/uploads/2016/09/Helado_Vainilla-web.jpg",
        tipo: "Postre",
        tiempo_preparacion: 15,
        kcal: 320,
        proteinas: 5,
        carbohidratos: 28,
        fibra: 0,
        grasas: 22,
        semaforo: "amarillo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como postre en verano o celebraciones.",
        dificultad: "Fácil"
    },
    {
        titulo: "Torrijas Tradicionales",
        descripcion: "Calienta la leche con canela y azúcar sin hervir.\n\nCorta el pan en rebanadas gruesas.\n\nEmpapa el pan en la leche aromatizada.\n\nPasa por huevo batido.\n\nFríe en aceite caliente hasta dorar.\n\nReboza en azúcar y canela.",
        ingredientes: "Pan duro (1 barra), Leche (500ml), Huevos (3 unidades), Azúcar (100g), Canela (1 cucharadita), Aceite (para freír)",
        imagen: "https://www.petitchef.es/imgupl/recipe/torrijas-tradicionales-caseras--lg-463304p733448.webp",
        tipo: "Postre",
        tiempo_preparacion: 25,
        kcal: 410,
        proteinas: 10,
        carbohidratos: 58,
        fibra: 2,
        grasas: 16,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, especialmente en celebraciones o temporadas tradicionales.",
        dificultad: "Media"
    },
    {
        titulo: "Crema Catalana",
        descripcion: "Calienta la leche con limón y canela sin hervir.\n\nMezcla yemas, azúcar y maicena.\n\nIncorpora la leche caliente poco a poco.\n\nCocina hasta espesar sin hervir.\n\nEnfría y refrigera.\n\nQuema azúcar antes de servir.",
        ingredientes: "Leche (500ml), Yemas de huevo (4 unidades), Azúcar (120g), Maicena (20g), Piel de limón (1), Canela (1 rama)",
        imagen: "https://www.cuina.cat/uploads/s1/20/97/21/0/crema-catalana-2.jpeg",
        tipo: "Postre",
        tiempo_preparacion: 20,
        kcal: 290,
        proteinas: 7,
        carbohidratos: 34,
        fibra: 0,
        grasas: 14,
        semaforo: "amarillo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como postre tradicional en celebraciones.",
        dificultad: "Media"
    },
    {
        titulo: "Mousse de Limón",
        descripcion: "Monta la nata fría.\n\nMezcla leche condensada con zumo de limón.\n\nIncorpora la nata suavemente.\n\nRefrigera hasta que cuaje.",
        ingredientes: "Zumo de limón (100ml), Leche condensada (200g), Nata para montar (300ml)",
        imagen: "https://i.ytimg.com/vi/7u8jJUHW-_o/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDjIFxXLr7AON0TNAETrIwpJXGv2w",
        tipo: "Postre",
        tiempo_preparacion: 15,
        kcal: 260,
        proteinas: 5,
        carbohidratos: 30,
        fibra: 0,
        grasas: 14,
        semaforo: "amarillo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como postre fresco en verano o celebraciones.",
        dificultad: "Fácil"
    },
    {
        titulo: "Natillas con Galleta",
        descripcion: "Calienta la leche con vainilla.\n\nMezcla yemas, azúcar y maicena.\n\nIncorpora la leche caliente.\n\nCocina hasta espesar.\n\nSirve con galleta encima.",
        ingredientes: "Leche (500ml), Yemas (3 unidades), Azúcar (100g), Maicena (20g), Vainilla (1 cucharadita), Galletas María (al gusto)",
        imagen: "https://okdiario.com/img/recetas/2017/05/16/natillas-caseras.jpg",
        tipo: "Postre",
        tiempo_preparacion: 20,
        kcal: 270,
        proteinas: 7,
        carbohidratos: 38,
        fibra: 0,
        grasas: 10,
        semaforo: "amarillo",
        consumo_habitual: "Consumo ocasional recomendado, ideal como postre tradicional 1 vez por semana.",
        dificultad: "Fácil"
    },

    // ----------------- SNACK (10) -----------------
    {
        titulo: "Hummus con Zanahoria",
        descripcion: "Escurre bien los garbanzos cocidos para eliminar el exceso de líquido.\n\nIntroduce los garbanzos en una batidora junto con el tahini, el ajo, el zumo de limón, el comino y un chorrito de aceite de oliva.\n\nTritura todo hasta obtener una pasta suave y cremosa.\n\nSi la mezcla queda demasiado espesa, añade un poco de agua o el líquido de cocción de los garbanzos hasta conseguir la textura deseada.\n\nPrueba y ajusta de sal, limón o comino al gusto.\n\nSirve el hummus en un bol, haciendo un pequeño hueco en el centro y añadiendo un chorrito de aceite de oliva por encima.\n\nAcompaña con las zanahorias cortadas en tiras para mojar.",
        ingredientes: "400g garbanzos cocidos, 2 cucharadas de tahini (30g), 1 diente de ajo, zumo de 1 limón, 1/2 cucharadita de comino, 2 zanahorias medianas",
        imagen: "https://recetasdecocina.elmundo.es/wp-content/uploads/2024/04/hummus-de-zanahoria.jpg",
        tipo: "Snack",
        tiempo_preparacion: 10,
        kcal: 260,
        proteinas: 9,
        carbohidratos: 28,
        fibra: 9,
        grasas: 12,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como snack saludable o entrante 3 a 6 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Guacamole con Nachos",
        descripcion: "Corta el aguacate maduro por la mitad, retira el hueso y saca la pulpa con una cuchara.\n\nMachaca el aguacate en un bol con un tenedor hasta obtener una textura cremosa pero con algún tropezón si te gusta más rústico.\n\nPica finamente la cebolla morada y el cilantro fresco, e incorpóralos al aguacate.\n\nAñade el zumo de lima y una pizca de sal, mezclando todo suavemente para integrar los sabores.\n\nPrueba y ajusta de sal o lima al gusto según prefieras un toque más ácido o suave.\n\nSirve inmediatamente acompañado de nachos de maíz para mantener su textura crujiente.",
        ingredientes: "2 aguacates maduros, 1/2 cebolla morada (50g), 10g cilantro fresco, zumo de 1 lima, 150g nachos de maíz",
        imagen: "https://petramora.com/cdn/shop/articles/14018_26ed8669-c5d8-4960-929b-4f5f54b22b18.jpg?v=1772111703&width=550",
        tipo: "Snack",
        tiempo_preparacion: 10,
        kcal: 520,
        proteinas: 9,
        carbohidratos: 48,
        fibra: 12,
        grasas: 32,
        semaforo: "naranja",
        consumo_habitual: "Consumo ocasional recomendado, ideal como snack o entrante 1 a 2 veces por semana debido a su densidad calórica.",
        dificultad: "Fácil"
    },
    {
        titulo: "Palomitas de Maíz Caseras",
        descripcion: "Cubre el fondo de una sartén grande con un chorrito de aceite y caliéntalo a fuego medio-alto.\n\nAñade unos pocos granos de maíz y tapa la sartén para comprobar que el aceite está a la temperatura adecuada.\n\nCuando los primeros granos empiecen a explotar, incorpora el resto del maíz en una sola capa.\n\nTapa de nuevo la sartén y agita suavemente de vez en cuando para evitar que se quemen.\n\nEspera a que los estallidos disminuyan casi por completo antes de retirar del fuego.\n\nDestapa con cuidado para evitar el vapor caliente.\n\nAñade sal fina al gusto y mezcla bien para repartirla de forma uniforme.\n\nSirve inmediatamente para disfrutar de su textura crujiente.",
        ingredientes: "100g granos de maíz para palomitas, 1 cucharada de aceite de oliva (10ml), 1 cucharadita de sal fina",
        imagen: "https://imag.bonviveur.com/palomitas-de-maiz-dulces.jpg",
        tipo: "Snack",
        tiempo_preparacion: 10,
        kcal: 430,
        proteinas: 8,
        carbohidratos: 58,
        fibra: 7,
        grasas: 18,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como snack ocasional o para ver películas 2 a 4 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Chips de Boniato al Horno",
        descripcion: "Precalienta el horno a 200ºC para que esté bien caliente antes de hornear.\n\nPela el boniato y córtalo en láminas muy finas para que queden crujientes.\n\nColoca las láminas en un bol y añade un chorrito de aceite de oliva, pimentón dulce y sal gruesa.\n\nMezcla bien para que todas las rodajas queden ligeramente impregnadas.\n\nDistribuye los chips en una bandeja de horno con papel vegetal, sin que se monten unas sobre otras.\n\nHornea durante 20-25 minutos, dándoles la vuelta a mitad de cocción para que se doren de forma uniforme.\n\nVigila los últimos minutos para evitar que se quemen, ya que pueden dorarse rápido.\n\nDeja enfriar ligeramente antes de servir para que queden más crujientes.",
        ingredientes: "1 boniato grande (300g), 2 cucharadas de aceite de oliva (20ml), 1 cucharadita de pimentón dulce, 1 cucharadita de sal gruesa",
        imagen: "https://www.divinacocina.es/wp-content/uploads/2024/09/chips-de-boniato-horno-1.jpg",
        tipo: "Snack",
        tiempo_preparacion: 35,
        kcal: 240,
        proteinas: 3,
        carbohidratos: 38,
        fibra: 6,
        grasas: 10,
        semaforo: "verde_claro",
        consumo_habitual: "Consumo habitual recomendado, ideal como snack saludable o guarnición 3 a 6 veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Mix de Frutos Secos Tostados",
        descripcion: "Calienta una sartén amplia a fuego medio sin añadir aceite.\n\nIncorpora los frutos secos (almendras, nueces y anacardos) y tuéstalos ligeramente, removiendo constantemente para que no se quemen.\n\nMantén el fuego bajo si es necesario para evitar que se doren demasiado rápido.\n\nCuando empiecen a soltar aroma y adquieran un color ligeramente dorado, retíralos del fuego.\n\nAñade una pizca de sal y pimentón al gusto mientras aún están calientes para que se adhieran mejor.\n\nRemueve bien para repartir las especias de forma uniforme.\n\nDeja enfriar completamente antes de servir para que queden crujientes.",
        ingredientes: "150g almendras, 150g nueces, 150g anacardos, 1/2 cucharadita de pimentón, 1 cucharadita de sal",
        imagen: "https://www.nutnutshop.com/cdn/shop/files/36_MIX_TOSTADO_PREMIUMjul._14_2025.jpg?v=1752663123&width=2048",
        tipo: "Snack",
        tiempo_preparacion: 15,
        kcal: 2680,
        proteinas: 90,
        carbohidratos: 90,
        fibra: 45,
        grasas: 225,
        semaforo: "amarillo",
        consumo_habitual: "Consumo moderado recomendado, ideal como snack energético o aporte ocasional de grasas saludables (1 a 3 veces por semana).",
        dificultad: "Fácil"
    },
    {
        titulo: "Edamame con Sal en Escamas",
        descripcion: "Hierve agua en una olla grande con una pizca de sal.\n\nAñade el edamame congelado directamente sin descongelar previamente.\n\nCocina durante 4-5 minutos hasta que las vainas estén tiernas pero firmes.\n\nEscurre bien el edamame y pásalo a un bol.\n\nAñade un chorrito de aceite de sésamo y mezcla ligeramente para aromatizar.\n\nEspolvorea sal en escamas por encima al gusto.\n\nSirve caliente o templado y disfruta sacando los granos directamente de la vaina.",
        ingredientes: "250g edamame congelado, 1 cucharadita de sal en escamas, 1 cucharadita de aceite de sésamo",
        imagen: "https://img.freepik.com/fotos-premium/bowl-cristal-filo-metalico-lleno-edamame-escamas-sal-semillas-inmaduras-soja-sobre-bambu_449839-2867.jpg?w=360",
        tipo: "Snack",
        tiempo_preparacion: 10,
        kcal: 190,
        proteinas: 17,
        carbohidratos: 15,
        fibra: 8,
        grasas: 8,
        semaforo: "verde_oscuro",
        consumo_habitual: "Consumo habitual recomendado, excelente como snack proteico ligero o aperitivo saludable varias veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Bolitas de Coco y Almendra",
        descripcion: "En un bol, mezcla el coco rallado con la leche condensada hasta obtener una masa densa y pegajosa.\n\nDeja reposar la mezcla unos minutos para que el coco absorba parte de la humedad y sea más fácil de manejar.\n\nCon las manos ligeramente humedecidas, toma pequeñas porciones de masa y forma bolitas compactas.\n\nIntroduce una almendra entera en el centro de cada bolita si quieres un relleno crujiente.\n\nTermina de dar forma asegurándote de que la almendra quede bien cubierta.\n\nSi lo deseas, puedes rebozar las bolitas en más coco rallado para un acabado extra.\n\nRefrigera durante al menos 1 hora para que adquieran más consistencia antes de servir.",
        ingredientes: "200g coco rallado, 200g leche condensada, 10-12 almendras enteras",
        imagen: "https://www.elrecetariodenachef.com/wp-content/uploads/2019/05/bolitas-calabaza-almendra-coco-1024x768.jpg",
        tipo: "Snack",
        tiempo_preparacion: 20,
        kcal: 1650,
        proteinas: 22,
        carbohidratos: 140,
        fibra: 18,
        grasas: 95,
        semaforo: "rojo",
        consumo_habitual: "Consumo ocasional recomendado, alto en azúcares y grasas. Ideal como capricho dulce puntual (1 vez por semana o menos).",
        dificultad: "Fácil"
    },
    {
        titulo: "Pudin de Semillas de Chía",
        descripcion: "En un bol o tarro, mezcla las semillas de chía con la leche de almendras y el extracto de vainilla.\n\nRemueve bien para que las semillas no se aglutinen y queden bien repartidas.\n\nDeja reposar la mezcla durante unos 10 minutos y vuelve a remover para evitar que se formen grumos.\n\nTapa el recipiente y refrigera durante al menos 4 horas, o mejor toda la noche, hasta que espese y adquiera textura de pudin.\n\nAntes de servir, vuelve a mezclar ligeramente para homogeneizar la textura.\n\nAñade arándanos por encima como topping fresco y ligeramente ácido.\n\nSirve frío directamente del frigorífico.",
        ingredientes: "3 cucharadas de semillas de chía (30g), 250ml leche de almendras, 1 cucharadita de extracto de vainilla, 50g arándanos",
        imagen: "https://www.gzrecipes.com/content/uploads/sites/5/2025/12/Pudin-con-semillas-de-chia-7-692cfca143e658-23268402.jpg",
        tipo: "Snack",
        tiempo_preparacion: 10,
        kcal: 280,
        proteinas: 9,
        carbohidratos: 22,
        fibra: 18,
        grasas: 14,
        semaforo: "verde_oscuro",
        consumo_habitual: "Consumo habitual recomendado, ideal como desayuno ligero o snack saludable diario.",
        dificultad: "Fácil"
    },
    {
        titulo: "Rollitos de Fiambre y Queso Crema",
        descripcion: "Extiende las lonchas de pavo sobre una superficie plana asegurándote de que no se rompan.\n\nUnta una capa fina y uniforme de queso de untar sobre cada loncha.\n\nEspolvorea cebollino picado por encima para aportar frescor y sabor.\n\nEnrolla cada loncha con cuidado formando pequeños cilindros compactos.\n\nSi lo deseas, puedes envolverlos en film transparente y refrigerarlos unos minutos para que mantengan mejor la forma.\n\nCorta en pequeños bocados si quieres servirlos como aperitivo.\n\nSirve fríos directamente como snack proteico.",
        ingredientes: "8 lonchas de pavo (120g), 100g queso crema, 10g cebollino picado",
        imagen: "https://www.wisdomlib.org/uploads/recipes/ham-and-cream-cheese-rollups-19839.jpg",
        tipo: "Snack",
        tiempo_preparacion: 10,
        kcal: 260,
        proteinas: 22,
        carbohidratos: 3,
        fibra: 0,
        grasas: 18,
        semaforo: "verde_oscuro",
        consumo_habitual: "Consumo habitual recomendado, ideal como snack proteico bajo en carbohidratos o aperitivo ligero varias veces por semana.",
        dificultad: "Fácil"
    },
    {
        titulo: "Bastones de Apio con Crema de Cacahuete",
        descripcion: "Lava bien los troncos de apio bajo el grifo para eliminar cualquier resto de suciedad.\n\nRetira las hebras más duras del apio si lo prefieres para una textura más suave.\n\nCorta los tallos en bastones de tamaño medio, fáciles de manipular y comer.\n\nRemueve la crema de cacahuete para que tenga una textura más homogénea y fácil de untar.\n\nUnta o rellena la parte cóncava del apio con la crema de cacahuete de forma generosa.\n\nSi quieres, puedes añadir un toque extra con semillas o frutos secos picados por encima.\n\nSirve inmediatamente como snack fresco y crujiente.",
        ingredientes: "3 tallos de apio, 3 cucharadas de crema de cacahuete (45g)",
        imagen: "https://liverfoundation.org/wp-content/uploads/2024/09/Celery-Sticks-Peanut-Butter.jpg",
        tipo: "Snack",
        tiempo_preparacion: 5,
        kcal: 220,
        proteinas: 8,
        carbohidratos: 10,
        fibra: 4,
        grasas: 16,
        semaforo: "verde_oscuro",
        consumo_habitual: "Consumo habitual recomendado, buen snack saciante rico en grasas saludables y proteína.",
        dificultad: "Fácil"
    }
];

export const getRandomReceta = () => {
    return misRecetasReales[Math.floor(Math.random() * misRecetasReales.length)];
};