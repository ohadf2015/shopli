import type { ComparisonSide } from './comparisons';

type Localized = NonNullable<ComparisonSide['localized']>;

export const localizedSides: Record<string, { product1: Localized; product2: Localized }> = {
  "gaming-chair-vs-office-chair": {
    "product1": {
      "es": {
        "name": "Silla gaming",
        "pros": [
          "Diseño deportivo tipo racing",
          "Respaldo alto con reposacabezas completo",
          "Reposabrazos regulables (4D en los modelos premium)",
          "Se reclina hasta 180° para descansar",
          "Incluye cojín lumbar y cojín cervical",
          "Estructura de acero reforzado (más de 135 kg de carga)"
        ],
        "cons": [
          "Acolchado firme, no es para todos",
          "No permite regular la profundidad del asiento",
          "El cuero sintético se pela con el tiempo",
          "Cojín lumbar poco consistente frente a un soporte integrado",
          "Sin mecanismo de inclinación hacia delante",
          "Poco transpirable, da calor"
        ]
      },
      "fr": {
        "name": "Fauteuil gamer",
        "pros": [
          "Design racing très affirmé",
          "Dossier haut avec appui-tête intégral",
          "Accoudoirs réglables (4D sur les modèles haut de gamme)",
          "Inclinable jusqu'à 180° pour se détendre",
          "Coussin lombaire et coussin de nuque fournis",
          "Structure en acier renforcé (charge max. 135 kg et plus)"
        ],
        "cons": [
          "Assise ferme, qui ne convient pas à tout le monde",
          "Profondeur d'assise non réglable",
          "Le simili cuir s'écaille avec le temps",
          "Coussin lombaire peu efficace face à un soutien intégré",
          "Pas de bascule avant",
          "Peu respirant, on transpire vite"
        ]
      },
      "de": {
        "name": "Gaming-Stuhl",
        "pros": [
          "Auffälliges Racing-Design",
          "Hohe Rückenlehne mit integrierter Kopfstütze",
          "Verstellbare Armlehnen (4D bei Premium-Modellen)",
          "Neigbar bis 180° zum Entspannen",
          "Lordosen- und Nackenkissen im Lieferumfang",
          "Robuster Stahlrahmen (über 135 kg belastbar)"
        ],
        "cons": [
          "Feste Polsterung, nicht jedermanns Sache",
          "Keine Sitztiefenverstellung",
          "Kunstleder blättert mit der Zeit ab",
          "Lordosenkissen weniger stabil als eine integrierte Stütze",
          "Keine Vorneigung der Sitzfläche",
          "Nicht atmungsaktiv, man schwitzt schnell"
        ]
      },
      "it": {
        "name": "Sedia gaming",
        "pros": [
          "Design aggressivo in stile racing",
          "Schienale alto con poggiatesta integrato",
          "Braccioli regolabili (4D sui modelli top)",
          "Si reclina fino a 180° per rilassarsi",
          "Cuscino lombare e cuscino cervicale inclusi",
          "Struttura in acciaio robusta (portata oltre 135 kg)"
        ],
        "cons": [
          "Imbottitura rigida, non per tutti",
          "Profondità del sedile non regolabile",
          "L'ecopelle si scrosta con il tempo",
          "Il cuscino lombare è meno valido di un supporto integrato",
          "Niente inclinazione in avanti",
          "Poco traspirante, si suda"
        ]
      },
      "ru": {
        "name": "Игровое кресло",
        "pros": [
          "Агрессивный гоночный дизайн",
          "Высокая спинка с полноценным подголовником",
          "Регулируемые подлокотники (4D в премиум-моделях)",
          "Наклон спинки до 180° для отдыха",
          "В комплекте подушки под поясницу и шею",
          "Прочный стальной каркас (нагрузка от 135 кг)"
        ],
        "cons": [
          "Жёсткое сиденье, подходит не всем",
          "Нет регулировки глубины сиденья",
          "Экокожа со временем трескается и облезает",
          "Подушка под поясницу слабо заменяет встроенную опору",
          "Нет наклона сиденья вперёд",
          "Не дышит, в нём потеют"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Silla de oficina",
        "pros": [
          "Soporte lumbar regulable integrado",
          "Respaldo de malla transpirable, sin sudor",
          "Profundidad de asiento regulable (buen apoyo para los muslos)",
          "Inclinación hacia delante para escribir con buena postura",
          "Borde del asiento curvo que reduce la presión en las piernas",
          "Reposacabezas opcional (aspecto más sobrio)"
        ],
        "cons": [
          "Estilo menos llamativo",
          "Suele venir sin montar",
          "Respaldo más bajo en los modelos económicos",
          "Reposabrazos menos acolchados que en una silla gaming",
          "Reclinación limitada a unos 135°",
          "Puede desentonar en una sala gaming"
        ]
      },
      "fr": {
        "name": "Chaise de bureau",
        "pros": [
          "Soutien lombaire réglable intégré",
          "Dossier en maille respirante, pas de transpiration",
          "Profondeur d'assise réglable (cuisses bien soutenues)",
          "Bascule avant pour une bonne posture de frappe",
          "Bord d'assise arrondi qui soulage les jambes",
          "Appui-tête en option (look plus sobre)"
        ],
        "cons": [
          "Style moins spectaculaire",
          "Souvent à monter soi-même",
          "Dossier plus bas sur les modèles d'entrée de gamme",
          "Accoudoirs moins rembourrés que sur un fauteuil gamer",
          "Inclinaison limitée à environ 135°",
          "Peut faire terne dans une pièce de gamer"
        ]
      },
      "de": {
        "name": "Bürostuhl",
        "pros": [
          "Integrierte, verstellbare Lordosenstütze",
          "Atmungsaktive Netzrückenlehne, kein Schwitzen",
          "Sitztiefenverstellung (gute Oberschenkelauflage)",
          "Vorneigung für eine gesunde Tippposition",
          "Abgerundete Sitzkante entlastet die Beine",
          "Kopfstütze optional (dezentere Optik)"
        ],
        "cons": [
          "Weniger auffälliges Design",
          "Muss meist selbst aufgebaut werden",
          "Niedrigere Rückenlehne bei günstigen Modellen",
          "Armlehnen weniger gepolstert als beim Gaming-Stuhl",
          "Neigung auf etwa 135° begrenzt",
          "Wirkt im Gaming-Zimmer schnell langweilig"
        ]
      },
      "it": {
        "name": "Sedia da ufficio",
        "pros": [
          "Supporto lombare regolabile integrato",
          "Schienale in rete traspirante, niente sudore",
          "Profondità del sedile regolabile (sostegno corretto per le cosce)",
          "Inclinazione in avanti per una postura ideale mentre scrivi",
          "Bordo sedile arrotondato che riduce la pressione sulle gambe",
          "Poggiatesta opzionale (look più pulito)"
        ],
        "cons": [
          "Stile meno scenografico",
          "Di solito va montata",
          "Schienale più basso sui modelli economici",
          "Braccioli meno imbottiti rispetto alle sedie gaming",
          "Reclinabile solo fino a circa 135°",
          "Può sembrare anonima in una gaming room"
        ]
      },
      "ru": {
        "name": "Офисное кресло",
        "pros": [
          "Встроенная регулируемая поддержка поясницы",
          "Дышащая сетчатая спинка, спина не потеет",
          "Регулировка глубины сиденья (бёдра получают нужную опору)",
          "Наклон вперёд для правильной посадки при наборе текста",
          "Скруглённый передний край снижает давление на ноги",
          "Подголовник по желанию (выглядит аккуратнее)"
        ],
        "cons": [
          "Менее эффектный вид",
          "Обычно нужно собирать самому",
          "Невысокая спинка у бюджетных моделей",
          "Подлокотники менее мягкие, чем в игровых креслах",
          "Наклон спинки около 135°",
          "В игровой комнате может смотреться скучно"
        ]
      }
    }
  },
  "french-press-vs-drip": {
    "product1": {
      "es": {
        "name": "Prensa francesa",
        "pros": [
          "Sabor más intenso y con más cuerpo",
          "Diseño sencillo, sin filtros",
          "Fácil de limpiar",
          "Precio asequible",
          "Cómoda para viajar"
        ],
        "cons": [
          "Posos en la taza",
          "El café se enfría antes",
          "Preparación manual",
          "Menor capacidad"
        ]
      },
      "fr": {
        "name": "Cafetière à piston",
        "pros": [
          "Saveur plus riche et corsée",
          "Conception simple, sans filtre",
          "Facile à nettoyer",
          "Prix abordable",
          "Pratique en voyage"
        ],
        "cons": [
          "Dépôt de marc dans la tasse",
          "Le café refroidit plus vite",
          "Préparation manuelle",
          "Petites quantités"
        ]
      },
      "de": {
        "name": "French Press",
        "pros": [
          "Vollmundiger, kräftiger Geschmack",
          "Einfaches Design, keine Filter nötig",
          "Leicht zu reinigen",
          "Günstig in der Anschaffung",
          "Praktisch für unterwegs"
        ],
        "cons": [
          "Kaffeesatz in der Tasse",
          "Kaffee wird schneller kalt",
          "Aufwendigere Zubereitung von Hand",
          "Nur kleine Mengen möglich"
        ]
      },
      "it": {
        "name": "Caffettiera a stantuffo",
        "pros": [
          "Sapore più ricco e corposo",
          "Design semplice, senza filtri",
          "Facile da pulire",
          "Prezzo accessibile",
          "Pratica da portare in viaggio"
        ],
        "cons": [
          "Residui nella tazza",
          "Il caffè si raffredda più in fretta",
          "Preparazione manuale",
          "Quantità ridotte"
        ]
      },
      "ru": {
        "name": "Френч-пресс",
        "pros": [
          "Более насыщенный вкус с плотным телом",
          "Простая конструкция, фильтры не нужны",
          "Легко мыть",
          "Доступная цена",
          "Удобно брать в поездки"
        ],
        "cons": [
          "Осадок в чашке",
          "Кофе быстрее остывает",
          "Всё делается вручную",
          "Небольшой объём за раз"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Cafetera de goteo",
        "pros": [
          "Programas y te olvidas",
          "Temporizador programable",
          "Mayor capacidad",
          "Resultados constantes",
          "Mantiene el café caliente"
        ],
        "cons": [
          "Ocupa espacio en la encimera",
          "Hay que comprar filtros de papel",
          "Extrae menos sabor",
          "Más difícil de limpiar a fondo"
        ]
      },
      "fr": {
        "name": "Cafetière filtre",
        "pros": [
          "Pratique, on lance et on oublie",
          "Minuteur programmable",
          "Grandes quantités",
          "Résultat constant",
          "Garde le café au chaud"
        ],
        "cons": [
          "Prend de la place sur le plan de travail",
          "Filtres papier à racheter",
          "Extraction moins aromatique",
          "Nettoyage plus délicat"
        ]
      },
      "de": {
        "name": "Filterkaffeemaschine",
        "pros": [
          "Einschalten und fertig",
          "Programmierbare Zeitschaltuhr",
          "Größere Mengen",
          "Gleichbleibendes Ergebnis",
          "Hält den Kaffee warm"
        ],
        "cons": [
          "Braucht Platz auf der Arbeitsplatte",
          "Laufende Kosten für Papierfilter",
          "Weniger Aroma im Ergebnis",
          "Gründliche Reinigung aufwendiger"
        ]
      },
      "it": {
        "name": "Macchina da caffè americano",
        "pros": [
          "Comoda, parte e non ci pensi più",
          "Timer programmabile",
          "Quantità maggiori",
          "Risultato sempre uguale",
          "Mantiene il caffè caldo"
        ],
        "cons": [
          "Occupa spazio sul piano di lavoro",
          "Costo dei filtri di carta",
          "Estrae meno aroma",
          "Più difficile da pulire a fondo"
        ]
      },
      "ru": {
        "name": "Капельная кофеварка",
        "pros": [
          "Поставил и забыл",
          "Таймер запуска",
          "Можно варить больше за раз",
          "Стабильный результат",
          "Подогрев поддерживает кофе горячим"
        ],
        "cons": [
          "Занимает место на столешнице",
          "Бумажные фильтры стоят денег",
          "Вкус раскрывается слабее",
          "Тяжелее тщательно мыть"
        ]
      }
    }
  },
  "resistance-bands-vs-dumbbells": {
    "product1": {
      "es": {
        "name": "Bandas de resistencia",
        "pros": [
          "Ultraligeras y portátiles",
          "No ocupan nada de espacio",
          "Muy económicas (10-30 $)",
          "Resistencia variable",
          "Cuidan las articulaciones"
        ],
        "cons": [
          "Es más difícil medir el progreso",
          "Menos eficaces para fuerza máxima",
          "Riesgo de rotura en las bandas baratas",
          "No dan sensación de carga progresiva"
        ]
      },
      "fr": {
        "name": "Bandes élastiques",
        "pros": [
          "Ultra transportables",
          "Aucun encombrement",
          "Très abordables (10-30 $)",
          "Résistance variable",
          "Ménagent les articulations"
        ],
        "cons": [
          "Progression plus difficile à suivre",
          "Moins efficaces pour la force maximale",
          "Risque de rupture avec les bandes bas de gamme",
          "Pas de sensation de charge progressive"
        ]
      },
      "de": {
        "name": "Fitnessbänder",
        "pros": [
          "Extrem leicht zu transportieren",
          "Braucht praktisch keinen Platz",
          "Sehr günstig (10-30 $)",
          "Variabler Widerstand",
          "Gelenkschonend"
        ],
        "cons": [
          "Fortschritt schwerer messbar",
          "Weniger geeignet für maximalen Kraftaufbau",
          "Riss-Gefahr bei billigen Bändern",
          "Kein echtes Gefühl für steigende Lasten"
        ]
      },
      "it": {
        "name": "Elastici da allenamento",
        "pros": [
          "Ultra portatili",
          "Non occupano spazio",
          "Molto economici (10-30 $)",
          "Resistenza variabile",
          "Delicati sulle articolazioni"
        ],
        "cons": [
          "Più difficile monitorare i progressi",
          "Meno efficaci per la forza massima",
          "Rischio di rottura con gli elastici scadenti",
          "Non danno la sensazione di carico progressivo"
        ]
      },
      "ru": {
        "name": "Резиновые эспандеры",
        "pros": [
          "Очень компактные",
          "Не занимают места",
          "Очень недорогие ($10-30)",
          "Переменное сопротивление",
          "Щадят суставы"
        ],
        "cons": [
          "Сложнее отслеживать прогресс",
          "Хуже подходят для максимальной силы",
          "Дешёвые эспандеры могут порваться",
          "Нет ощущения прогрессивной нагрузки"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Mancuernas",
        "pros": [
          "Incrementos de peso precisos",
          "Lo mejor para ganar fuerza",
          "Duraderas, te duran toda la vida",
          "Sensación natural",
          "Mayor variedad de ejercicios"
        ],
        "cons": [
          "Caras (100-500 $ o más)",
          "Ocupan bastante espacio",
          "Pesadas de mover",
          "Hay que comprar más peso con el tiempo"
        ]
      },
      "fr": {
        "name": "Haltères",
        "pros": [
          "Charges précises",
          "Idéaux pour la prise de force",
          "Robustes, ils durent toute une vie",
          "Sensation naturelle",
          "Plus grande variété d'exercices"
        ],
        "cons": [
          "Chers (100-500 $ et plus)",
          "Très encombrants",
          "Lourds à déplacer",
          "Il faut racheter plus lourd avec le temps"
        ]
      },
      "de": {
        "name": "Kurzhanteln",
        "pros": [
          "Exakt abgestufte Gewichte",
          "Ideal für den Muskelaufbau",
          "Langlebig, halten ein Leben lang",
          "Natürliches Trainingsgefühl",
          "Größte Übungsvielfalt"
        ],
        "cons": [
          "Teuer (100-500 $ und mehr)",
          "Benötigt viel Platz",
          "Schwer zu transportieren",
          "Mit der Zeit müssen schwerere Gewichte her"
        ]
      },
      "it": {
        "name": "Manubri",
        "pros": [
          "Incrementi di peso precisi",
          "Il massimo per aumentare la forza",
          "Resistenti, durano una vita",
          "Sensazione naturale",
          "La maggiore varietà di esercizi"
        ],
        "cons": [
          "Costosi (100-500 $ e oltre)",
          "Occupano parecchio spazio",
          "Pesanti da spostare",
          "Col tempo bisogna comprarne di più pesanti"
        ]
      },
      "ru": {
        "name": "Гантели",
        "pros": [
          "Точный вес с понятным шагом",
          "Лучший выбор для набора силы",
          "Прочные, служат десятилетиями",
          "Естественные ощущения",
          "Самый широкий выбор упражнений"
        ],
        "cons": [
          "Дорого ($100-500+)",
          "Занимают много места",
          "Тяжело переносить",
          "Со временем придётся докупать тяжелее"
        ]
      }
    }
  },
  "ring-light-vs-softbox": {
    "product1": {
      "es": {
        "name": "Aro de luz",
        "pros": [
          "Crea el reflejo luminoso en los ojos",
          "Iluminación uniforme del rostro, sin sombras",
          "Compacto y portátil",
          "Temperatura de color regulable",
          "Ideal para selfis y primeros planos"
        ],
        "cons": [
          "Marca mucho la textura de la piel",
          "Solo sirve para rostro y retratos",
          "Reflejo circular en los ojos",
          "Menos control sobre la dirección de la luz"
        ]
      },
      "fr": {
        "name": "Ring light",
        "pros": [
          "Crée un reflet lumineux dans les yeux",
          "Éclairage du visage uniforme, sans ombres",
          "Compacte et transportable",
          "Température de couleur variable",
          "Parfaite pour les selfies et les gros plans"
        ],
        "cons": [
          "Accentue la texture de la peau",
          "Limitée aux portraits et gros plans",
          "Reflet circulaire dans les yeux",
          "Moins de contrôle sur la direction"
        ]
      },
      "de": {
        "name": "Ringlicht",
        "pros": [
          "Erzeugt Lichtreflexe in den Augen",
          "Gleichmäßiges, schattenfreies Gesichtslicht",
          "Kompakt und mobil",
          "Dimmbar mit einstellbarer Farbtemperatur",
          "Ideal für Selfies und Nahaufnahmen"
        ],
        "cons": [
          "Betont Hautunreinheiten",
          "Nur für Gesichts- und Porträtaufnahmen geeignet",
          "Ringförmiger Reflex in den Augen",
          "Lichtrichtung kaum steuerbar"
        ]
      },
      "it": {
        "name": "Ring light",
        "pros": [
          "Crea il riflesso negli occhi",
          "Luce uniforme sul viso, senza ombre",
          "Compatta e portatile",
          "Temperatura colore regolabile",
          "Ottima per selfie e primi piani"
        ],
        "cons": [
          "Mette in risalto la texture della pelle",
          "Adatta solo a viso e mezzo busto",
          "Riflesso circolare negli occhi",
          "Meno controllo sulla direzione della luce"
        ]
      },
      "ru": {
        "name": "Кольцевая лампа",
        "pros": [
          "Даёт блик в глазах",
          "Ровный свет на лице без теней",
          "Компактная и лёгкая в переноске",
          "Регулировка яркости и цветовой температуры",
          "Отлично подходит для селфи и крупных планов"
        ],
        "cons": [
          "Подчёркивает текстуру кожи",
          "Годится только для портретов лица",
          "Блик в глазах получается кольцом",
          "Меньше контроля над направлением света"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Softbox",
        "pros": [
          "Luz suave de aspecto profesional",
          "Luz amplia y envolvente",
          "Iluminación de cuerpo entero",
          "Admite distintos accesorios",
          "Lo mejor para fotos de producto"
        ],
        "cons": [
          "Voluminoso y pesado",
          "Lleva tiempo montarlo",
          "Más caro",
          "Necesita espacio para colocarlo"
        ]
      },
      "fr": {
        "name": "Softbox",
        "pros": [
          "Lumière douce professionnelle",
          "Éclairage large et enveloppant",
          "Éclairage en pied possible",
          "Nombreux accessoires de modelage de la lumière",
          "Idéale pour les photos de produits"
        ],
        "cons": [
          "Encombrante et lourde",
          "Installation plus longue",
          "Plus chère",
          "Demande de la place pour se positionner"
        ]
      },
      "de": {
        "name": "Softbox",
        "pros": [
          "Professionelles, weiches Licht",
          "Großflächiges, umhüllendes Licht",
          "Ausleuchtung des ganzen Körpers",
          "Viele Lichtformer erhältlich",
          "Beste Wahl für Produktfotos"
        ],
        "cons": [
          "Sperrig und schwer",
          "Aufbau dauert länger",
          "Teurer",
          "Braucht Platz zum Positionieren"
        ]
      },
      "it": {
        "name": "Softbox",
        "pros": [
          "Luce morbida professionale",
          "Luce ampia e avvolgente",
          "Illumina tutta la figura",
          "Molti modificatori di luce",
          "Il top per le foto di prodotto"
        ],
        "cons": [
          "Ingombrante e pesante",
          "Richiede tempo per il montaggio",
          "Più costoso",
          "Serve spazio per posizionarlo"
        ]
      },
      "ru": {
        "name": "Софтбокс",
        "pros": [
          "Профессиональный мягкий свет",
          "Большая площадь, свет обволакивает",
          "Подходит для съёмки в полный рост",
          "Много насадок для света",
          "Лучший вариант для предметной съёмки"
        ],
        "cons": [
          "Громоздкий и тяжёлый",
          "Долго собирать и настраивать",
          "Стоит дороже",
          "Нужно место для установки"
        ]
      }
    }
  },
  "standing-desk-vs-converter": {
    "product1": {
      "es": {
        "name": "Escritorio elevable completo",
        "pros": [
          "Estabilidad total a cualquier altura",
          "Amplio rango de altura (60-127 cm)",
          "Memorias de altura (sentado y de pie)",
          "Gestión de cables integrada",
          "Mayor capacidad de carga (más de 90 kg)",
          "Aspecto limpio y ordenado"
        ],
        "cons": [
          "300-800 $ o más",
          "Requiere montaje (30-60 min)",
          "Pesado, difícil de mover",
          "Sustituye todo tu escritorio",
          "Necesita enchufe"
        ]
      },
      "fr": {
        "name": "Bureau assis-debout complet",
        "pros": [
          "Stabilité à toute épreuve, quelle que soit la hauteur",
          "Large plage de hauteur (24-50\")",
          "Positions mémorisées (assis/debout)",
          "Passe-câbles intégré",
          "Charge supérieure (90 kg et plus)",
          "Esthétique épurée"
        ],
        "cons": [
          "300-800 $ et plus",
          "Montage nécessaire (30-60 min)",
          "Lourd et difficile à déplacer",
          "Remplace tout votre bureau",
          "Nécessite une prise électrique"
        ]
      },
      "de": {
        "name": "Höhenverstellbarer Schreibtisch",
        "pros": [
          "Bombenfest in jeder Höhe",
          "Großer Verstellbereich (61-127 cm)",
          "Memory-Tasten für Sitzen und Stehen",
          "Integrierte Kabelführung",
          "Höhere Tragkraft (über 90 kg)",
          "Aufgeräumte Optik"
        ],
        "cons": [
          "300-800 $ und mehr",
          "Aufbau nötig (30-60 Min.)",
          "Schwer, kaum zu verschieben",
          "Ersetzt den kompletten Schreibtisch",
          "Braucht eine Steckdose"
        ]
      },
      "it": {
        "name": "Scrivania regolabile in altezza",
        "pros": [
          "Stabilità a prova di bomba a qualsiasi altezza",
          "Ampia escursione in altezza (60-127 cm)",
          "Memorie preimpostate (seduto/in piedi)",
          "Gestione cavi integrata",
          "Portata maggiore (oltre 90 kg)",
          "Estetica pulita"
        ],
        "cons": [
          "300-800 $ e oltre",
          "Va montata (30-60 min)",
          "Pesante, difficile da spostare",
          "Sostituisce tutta la tua scrivania",
          "Serve una presa di corrente"
        ]
      },
      "ru": {
        "name": "Стол с регулировкой высоты",
        "pros": [
          "Надёжная устойчивость на любой высоте",
          "Широкий диапазон высоты (61-127 см)",
          "Память положений (сидя и стоя)",
          "Встроенная организация кабелей",
          "Большая грузоподъёмность (от 90 кг)",
          "Аккуратный внешний вид"
        ],
        "cons": [
          "От $300 до $800 и выше",
          "Нужна сборка (30-60 минут)",
          "Тяжёлый, трудно переставлять",
          "Заменяет весь ваш стол",
          "Нужна розетка"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Elevador de escritorio",
        "pros": [
          "100-300 $",
          "Sin montaje, lo colocas y listo",
          "Conservas tu escritorio actual",
          "Fácil de llevar de un sitio a otro",
          "No necesita electricidad (manual)",
          "Para probar trabajar de pie sin compromiso"
        ],
        "cons": [
          "Se tambalea a la altura de pie",
          "Rango de altura limitado",
          "Reduce la superficie del escritorio",
          "Manivela manual o muelle de gas",
          "Menor capacidad de carga (16-23 kg)",
          "La bandeja del teclado suele quedarse pequeña"
        ]
      },
      "fr": {
        "name": "Rehausseur de bureau",
        "pros": [
          "100-300 $",
          "Aucun montage, il suffit de le poser",
          "Vous gardez votre bureau actuel",
          "Se déplace d'une pièce à l'autre",
          "Sans électricité (manuel)",
          "Pour essayer le travail debout sans s'engager"
        ],
        "cons": [
          "Instable en position debout",
          "Plage de hauteur limitée",
          "Réduit la surface du bureau",
          "Manivelle ou vérin à gaz manuel",
          "Charge maximale plus faible (16-23 kg)",
          "Plateau clavier souvent étroit"
        ]
      },
      "de": {
        "name": "Sitz-Steh-Aufsatz",
        "pros": [
          "100-300 $",
          "Kein Aufbau, einfach hinstellen",
          "Der vorhandene Schreibtisch bleibt",
          "Leicht an einen anderen Ort mitzunehmen",
          "Kein Strom nötig (manuell)",
          "Stehen ausprobieren ohne große Investition"
        ],
        "cons": [
          "Wackelt in Stehhöhe",
          "Begrenzter Höhenbereich",
          "Verkleinert die Arbeitsfläche",
          "Kurbel oder Gasfeder, nur manuell",
          "Geringere Traglast (16-23 kg)",
          "Tastaturablage oft zu eng"
        ]
      },
      "it": {
        "name": "Convertitore da scrivania",
        "pros": [
          "100-300 $",
          "Nessun montaggio, appoggi e usi",
          "Tieni la scrivania che hai già",
          "Si sposta facilmente da un posto all'altro",
          "Non serve corrente (manuale)",
          "Provi a lavorare in piedi senza impegno"
        ],
        "cons": [
          "Traballa in posizione alta",
          "Escursione in altezza limitata",
          "Riduce il piano di lavoro",
          "Manovella o molla a gas manuale",
          "Portata inferiore (16-23 kg)",
          "Il ripiano per la tastiera spesso è stretto"
        ]
      },
      "ru": {
        "name": "Надстройка на стол",
        "pros": [
          "$100-300",
          "Без сборки, поставил и пользуйся",
          "Остаётся ваш обычный стол",
          "Можно переставлять с места на место",
          "Не нужно питание (ручная)",
          "Можно попробовать работать стоя без больших затрат"
        ],
        "cons": [
          "Шатается на высоте стоя",
          "Ограниченный диапазон высоты",
          "Уменьшает рабочую поверхность стола",
          "Ручная регулировка или газлифт",
          "Малая грузоподъёмность (16-23 кг)",
          "Полка для клавиатуры часто тесная"
        ]
      }
    }
  },
  "mechanical-vs-membrane-keyboard": {
    "product1": {
      "es": {
        "name": "Teclado mecánico",
        "pros": [
          "Respuesta táctil muy marcada",
          "Vida útil de 50-100 millones de pulsaciones",
          "Interruptores reemplazables (hot-swap)",
          "Teclas personalizables",
          "N-key rollover",
          "Sonido satisfactorio (o silencioso)"
        ],
        "cons": [
          "Más ruidoso (switches clicky)",
          "Precio más alto (40-200 $ o más)",
          "Más pesado",
          "Cuesta elegir entre tipos de switch",
          "Puede quedar demasiado alto sin reposamuñecas"
        ]
      },
      "fr": {
        "name": "Clavier mécanique",
        "pros": [
          "Retour tactile bien marqué",
          "Durée de vie de 50 à 100 M de frappes",
          "Switchs remplaçables (hot-swap)",
          "Keycaps personnalisables",
          "N-key rollover",
          "Son agréable (ou silencieux)"
        ],
        "cons": [
          "Plus bruyant (switchs clicky)",
          "Prix plus élevé (40-200 $ et plus)",
          "Plus lourd",
          "Choix des switchs pas évident au début",
          "Peut être trop haut sans repose-poignets"
        ]
      },
      "de": {
        "name": "Mechanische Tastatur",
        "pros": [
          "Deutliches, taktiles Feedback",
          "50-100 Mio. Anschläge Lebensdauer",
          "Austauschbare Switches (Hot-Swap)",
          "Individuelle Tastenkappen",
          "N-Key-Rollover",
          "Befriedigender Klang (oder leise Varianten)"
        ],
        "cons": [
          "Lauter (klickende Switches)",
          "Höherer Preis (40-200 $ und mehr)",
          "Schwerer",
          "Einarbeitung in die Switch-Typen nötig",
          "Ohne Handballenauflage oft zu hoch"
        ]
      },
      "it": {
        "name": "Tastiera meccanica",
        "pros": [
          "Feedback tattile ben definito",
          "Durata da 50 a 100 milioni di battute",
          "Switch sostituibili (hot-swap)",
          "Keycap personalizzabili",
          "N-key rollover",
          "Suono appagante (o silenzioso)"
        ],
        "cons": [
          "Più rumorosa (switch clicky)",
          "Prezzo più alto (40-200 $ e oltre)",
          "Più pesante",
          "Serve un po' di pratica per scegliere gli switch",
          "Può risultare troppo alta senza poggiapolsi"
        ]
      },
      "ru": {
        "name": "Механическая клавиатура",
        "pros": [
          "Чёткий тактильный отклик",
          "Ресурс 50-100 млн нажатий",
          "Сменные переключатели (hot-swap)",
          "Можно менять кейкапы",
          "N-key rollover",
          "Приятный звук (или бесшумные модели)"
        ],
        "cons": [
          "Громче (щёлкающие свитчи)",
          "Дороже ($40-200+)",
          "Тяжелее",
          "Нужно разбираться в типах переключателей",
          "Без подставки под запястья может быть слишком высокой"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Teclado de membrana",
        "pros": [
          "Silencioso",
          "Ligero y portátil",
          "Económico (10-40 $)",
          "Perfil bajo, cómodo para las muñecas",
          "Resistente a salpicaduras (a menudo)",
          "Sin tener que informarte sobre switches"
        ],
        "cons": [
          "Tacto blando e impreciso",
          "Vida útil de 5-10 millones de pulsaciones",
          "No se pueden cambiar teclas sueltas",
          "Ghosting con 3 o más teclas",
          "Se desgasta con el tiempo",
          "Difícil de limpiar bajo las teclas"
        ]
      },
      "fr": {
        "name": "Clavier à membrane",
        "pros": [
          "Ultra silencieux",
          "Léger et transportable",
          "Petit prix (10-40 $)",
          "Profil bas, confortable pour les poignets",
          "Souvent résistant aux éclaboussures",
          "Pas besoin de se renseigner sur les switchs"
        ],
        "cons": [
          "Frappe molle et imprécise",
          "Durée de vie de 5 à 10 M de frappes",
          "Impossible de remplacer une touche seule",
          "Ghosting à partir de 3 touches",
          "Se dégrade avec le temps",
          "Difficile à nettoyer sous les touches"
        ]
      },
      "de": {
        "name": "Rubberdome-Tastatur",
        "pros": [
          "Flüsterleise",
          "Leicht und mobil",
          "Preiswert (10-40 $)",
          "Flaches Profil, schonend für die Handgelenke",
          "Oft spritzwassergeschützt",
          "Keine Switch-Recherche nötig"
        ],
        "cons": [
          "Schwammiges, unpräzises Tippgefühl",
          "5-10 Mio. Anschläge Lebensdauer",
          "Einzelne Tasten nicht austauschbar",
          "Ghosting ab 3 gleichzeitigen Tasten",
          "Lässt mit der Zeit nach",
          "Schwer zu reinigen unter den Tasten"
        ]
      },
      "it": {
        "name": "Tastiera a membrana",
        "pros": [
          "Silenziosissima",
          "Leggera e portatile",
          "Economica (10-40 $)",
          "Profilo basso, comoda per i polsi",
          "Spesso resistente agli schizzi",
          "Nessuna ricerca sugli switch"
        ],
        "cons": [
          "Feedback spugnoso e poco preciso",
          "Durata da 5 a 10 milioni di battute",
          "Non si possono sostituire i singoli tasti",
          "Ghosting con 3 o più tasti premuti",
          "Si deteriora col tempo",
          "Difficile pulire sotto i tasti"
        ]
      },
      "ru": {
        "name": "Мембранная клавиатура",
        "pros": [
          "Практически бесшумная",
          "Лёгкая и удобная для переноски",
          "Бюджетная ($10-40)",
          "Низкий профиль, удобна для запястий",
          "Часто защищена от пролитой жидкости",
          "Не нужно разбираться в переключателях"
        ],
        "cons": [
          "Мягкий, нечёткий отклик",
          "Ресурс 5-10 млн нажатий",
          "Отдельные клавиши не заменить",
          "Ghosting при нажатии 3 и более клавиш",
          "Со временем изнашивается",
          "Сложно чистить под клавишами"
        ]
      }
    }
  },
  "portable-monitor-vs-tablet-second-screen": {
    "product1": {
      "es": {
        "name": "Monitor portátil",
        "pros": [
          "Plug and play real (USB-C/HDMI)",
          "Sin drivers ni software",
          "Mejor precisión de color (sRGB 100 % o más)",
          "Menor latencia",
          "Funciona con cualquier dispositivo (consola, móvil)",
          "Sin batería que cargar"
        ],
        "cons": [
          "Un dispositivo más que llevar",
          "Necesita USB-C con Power Delivery o enchufe",
          "Soportes endebles en los modelos baratos",
          "Solo sirve para una cosa",
          "El de 15,6\" es el más común y abulta en la mochila"
        ]
      },
      "fr": {
        "name": "Écran portable",
        "pros": [
          "Vrai plug-and-play (USB-C/HDMI)",
          "Aucun pilote ni logiciel à installer",
          "Meilleure précision des couleurs (sRGB 100 % et plus)",
          "Latence plus faible",
          "Compatible avec tous les appareils (console, téléphone)",
          "Pas de batterie à recharger"
        ],
        "cons": [
          "Un appareil de plus à transporter",
          "Nécessite l'alimentation USB-C ou une prise secteur",
          "Pieds fragiles sur les modèles bon marché",
          "Usage unique",
          "Le format 15,6\" est le plus courant, encombrant dans un sac"
        ]
      },
      "de": {
        "name": "Portabler Monitor",
        "pros": [
          "Echtes Plug-and-play (USB-C/HDMI)",
          "Keine Treiber oder Software nötig",
          "Bessere Farbgenauigkeit (über 100 % sRGB)",
          "Geringere Latenz",
          "Funktioniert mit jedem Gerät (Konsole, Smartphone)",
          "Kein Akku, der geladen werden muss"
        ],
        "cons": [
          "Zusätzliches Gerät im Gepäck",
          "Braucht USB-C Power Delivery oder Netzteil",
          "Wackelige Ständer bei günstigen Modellen",
          "Nur ein Einsatzzweck",
          "15,6 Zoll am gängigsten, sperrig im Rucksack"
        ]
      },
      "it": {
        "name": "Monitor portatile",
        "pros": [
          "Vero plug-and-play (USB-C/HDMI)",
          "Nessun driver o software da installare",
          "Colori più precisi (sRGB 100% e oltre)",
          "Latenza più bassa",
          "Funziona con qualsiasi dispositivo (console, smartphone)",
          "Nessuna batteria da ricaricare"
        ],
        "cons": [
          "Un dispositivo in più da portare",
          "Serve alimentazione USB-C Power Delivery o presa di corrente",
          "Supporti fragili sui modelli economici",
          "Serve a una cosa sola",
          "Il formato più diffuso da 15,6\" ingombra nello zaino"
        ]
      },
      "ru": {
        "name": "Портативный монитор",
        "pros": [
          "Настоящий plug-and-play (USB-C/HDMI)",
          "Не нужны драйверы и программы",
          "Лучшая цветопередача (100%+ sRGB)",
          "Меньшая задержка",
          "Работает с любым устройством (приставка, телефон)",
          "Не нужно заряжать батарею"
        ],
        "cons": [
          "Ещё одно устройство в сумке",
          "Нужно питание по USB-C или от розетки",
          "Хлипкие подставки у дешёвых моделей",
          "Узкое назначение",
          "Самый ходовой размер 15,6\" занимает много места в сумке"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Tablet como monitor",
        "pros": [
          "Un dispositivo que ya tienes",
          "Pantalla táctil como extra",
          "Muy buen color (iPad/Android OLED)",
          "Sirve para otras cosas cuando no es monitor",
          "Opciones inalámbricas (Sidecar, Spacedesk)",
          "Soporte integrado (en las fundas)"
        ],
        "cons": [
          "Latencia en modo inalámbrico (20-100 ms)",
          "La gestión del color varía",
          "Gasta mucha batería de la tablet",
          "Requiere configurar software",
          "Limitado a ciertos ecosistemas (Sidecar = Mac + iPad)"
        ]
      },
      "fr": {
        "name": "Tablette en écran secondaire",
        "pros": [
          "Un appareil que vous avez déjà",
          "Écran tactile en prime",
          "Très belles couleurs (iPad/Android OLED)",
          "Reste utile quand elle ne sert pas d'écran",
          "Options sans fil (Sidecar, Spacedesk)",
          "Support intégré (avec une housse)"
        ],
        "cons": [
          "Latence en sans fil (20-100 ms)",
          "Gestion des couleurs variable",
          "Vide vite la batterie de la tablette",
          "Configuration logicielle nécessaire",
          "Limité à certains écosystèmes (Sidecar = Mac + iPad)"
        ]
      },
      "de": {
        "name": "Tablet als Monitor",
        "pros": [
          "Gerät, das man schon besitzt",
          "Touch-Bedienung als Bonus",
          "Tolle Farben (iPad/OLED-Android)",
          "Vielseitig nutzbar, auch ohne Monitor-Funktion",
          "Kabellos möglich (Sidecar, Spacedesk)",
          "Ständer in der Hülle integriert"
        ],
        "cons": [
          "Latenz bei Funkverbindung (20-100 ms)",
          "Farbdarstellung schwankt je nach Gerät",
          "Entleert den Tablet-Akku schnell",
          "Software-Einrichtung nötig",
          "Auf bestimmte Systeme beschränkt (Sidecar = Mac + iPad)"
        ]
      },
      "it": {
        "name": "Tablet come monitor",
        "pros": [
          "Lo hai già",
          "Touch come extra",
          "Ottimi colori (iPad/Android OLED)",
          "Multiuso quando non fa da monitor",
          "Opzioni wireless (Sidecar, Spacedesk)",
          "Supporto integrato (con le custodie)"
        ],
        "cons": [
          "Latenza in wireless (20-100 ms)",
          "Resa dei colori variabile",
          "Scarica in fretta la batteria del tablet",
          "Richiede una configurazione software",
          "Limitato a determinati ecosistemi (Sidecar = Mac + iPad)"
        ]
      },
      "ru": {
        "name": "Планшет вместо монитора",
        "pros": [
          "Устройство уже есть",
          "Бонус: сенсорный ввод",
          "Отличные цвета (iPad и Android с OLED)",
          "Пригодится и без роли монитора",
          "Беспроводные варианты (Sidecar, Spacedesk)",
          "Подставка в чехле"
        ],
        "cons": [
          "Задержка по беспроводному соединению (20-100 мс)",
          "Цветопередача зависит от модели",
          "Быстро разряжает батарею планшета",
          "Нужна настройка программ",
          "Привязка к экосистеме (Sidecar работает только с Mac и iPad)"
        ]
      }
    }
  },
  "instant-pot-vs-air-fryer": {
    "product1": {
      "es": {
        "name": "Instant Pot (olla a presión)",
        "pros": [
          "Cuece legumbres y carnes un 70 % más rápido",
          "Platos de una sola olla (sopa, guiso, yogur)",
          "Cocción a presión programable",
          "Olla interior de acero inoxidable",
          "Más de 10 funciones en un solo aparato",
          "Ideal para cocinar por adelantado (meal prep)"
        ],
        "cons": [
          "No dora ni gratina (salvo con tapa de freidora de aire)",
          "Tarda 10-15 min en alcanzar la presión",
          "Voluminosa (6-8 l)",
          "Cuesta aprender a liberar la presión",
          "No se puede ver la comida mientras se cocina"
        ]
      },
      "fr": {
        "name": "Instant Pot (autocuiseur)",
        "pros": [
          "Cuit légumineuses et viandes 70 % plus vite",
          "Plats complets en un seul pot (soupe, ragoût, yaourt)",
          "Cuisson sous pression, sans surveillance",
          "Cuve en inox",
          "Plus de 10 fonctions en un seul appareil",
          "Idéal pour le batch cooking"
        ],
        "cons": [
          "Ne croustille pas (sauf avec un couvercle air fryer)",
          "10 à 15 min pour monter en pression",
          "Encombrant (5,7 à 7,6 L)",
          "Libération de la pression à apprivoiser",
          "Impossible de vérifier la cuisson en cours"
        ]
      },
      "de": {
        "name": "Instant Pot (Schnellkochtopf)",
        "pros": [
          "Bohnen und Fleisch 70 % schneller gar",
          "Eintopfgerichte (Suppe, Eintopf, Joghurt)",
          "Druckgaren ohne Aufsicht",
          "Innentopf aus Edelstahl",
          "Über 10 Funktionen in einem Gerät",
          "Ideal fürs Meal Prep"
        ],
        "cons": [
          "Kein Knusprig-Garen (außer mit Heißluft-Deckel)",
          "10-15 Min. bis der Druck aufgebaut ist",
          "Sperrig (5,7-7,6 l)",
          "Druckablassen will gelernt sein",
          "Garstand lässt sich nicht zwischendurch prüfen"
        ]
      },
      "it": {
        "name": "Instant Pot (pentola a pressione)",
        "pros": [
          "Cuoce legumi e carne il 70% più in fretta",
          "Piatti unici (zuppe, stufati, yogurt)",
          "Cottura a pressione automatica",
          "Pentola interna in acciaio inox",
          "Oltre 10 funzioni in uno",
          "Ottima per il meal prep"
        ],
        "cons": [
          "Non rosola (a meno di avere il coperchio friggitrice ad aria)",
          "Servono 10-15 min per andare in pressione",
          "Ingombrante (5,7-7,6 litri)",
          "Serve pratica per rilasciare la pressione",
          "Non puoi controllare il cibo durante la cottura"
        ]
      },
      "ru": {
        "name": "Instant Pot (мультиварка-скороварка)",
        "pros": [
          "Бобовые и мясо готовятся на 70% быстрее",
          "Блюда в одной кастрюле (суп, рагу, йогурт)",
          "Готовка под давлением без присмотра",
          "Внутренняя чаша из нержавейки",
          "Больше 10 функций в одном приборе",
          "Отлично подходит для заготовок на неделю"
        ],
        "cons": [
          "Не делает хрустящую корочку (без крышки для аэрогриля)",
          "10-15 минут набирает давление",
          "Громоздкая (5,7-7,6 л)",
          "Нужно привыкнуть к сбросу давления",
          "Нельзя проверить блюдо во время готовки"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Freidora de aire",
        "pros": [
          "Resultado crujiente con un 90 % menos de aceite",
          "Se precalienta en 2-3 min",
          "Cocción rápida (10-20 min)",
          "Fácil de limpiar (cesta)",
          "Perfecta para congelados",
          "Compacta"
        ],
        "cons": [
          "No cocina a presión",
          "Poca capacidad",
          "No sirve para sopas, guisos ni yogur",
          "Solo cocina con calor seco",
          "La cesta bloquea el aire si se llena demasiado"
        ]
      },
      "fr": {
        "name": "Air fryer",
        "pros": [
          "Résultat croustillant avec 90 % d'huile en moins",
          "Préchauffage en 2-3 min",
          "Cuissons rapides (10-20 min)",
          "Nettoyage facile (panier)",
          "Parfait pour les produits surgelés",
          "Compact"
        ],
        "cons": [
          "Pas de cuisson sous pression",
          "Petite capacité",
          "Impossible de faire soupes, ragoûts ou yaourts",
          "Uniquement de la chaleur sèche",
          "Le panier gêne la circulation de l'air s'il est trop rempli"
        ]
      },
      "de": {
        "name": "Heißluftfritteuse",
        "pros": [
          "Knusprig mit 90 % weniger Öl",
          "In 2-3 Min. vorgeheizt",
          "Kurze Garzeiten (10-20 Min.)",
          "Einfache Reinigung (Korb)",
          "Super für Tiefkühlkost",
          "Kompakt"
        ],
        "cons": [
          "Kein Druckgaren",
          "Kleines Fassungsvermögen",
          "Keine Suppen, Eintöpfe oder Joghurt",
          "Nur trockene Hitze",
          "Bei voll beladenem Korb staut sich die Luft"
        ]
      },
      "it": {
        "name": "Friggitrice ad aria",
        "pros": [
          "Croccantezza con il 90% di olio in meno",
          "Si preriscalda in 2-3 min",
          "Cotture veloci (10-20 min)",
          "Pulizia facile (cestello)",
          "Ottima per i surgelati",
          "Compatta"
        ],
        "cons": [
          "Non cuoce a pressione",
          "Capacità ridotta",
          "Niente zuppe, stufati o yogurt",
          "Solo cottura a calore secco",
          "Il cestello blocca l'aria se troppo pieno"
        ]
      },
      "ru": {
        "name": "Аэрогриль",
        "pros": [
          "Хрустящая корочка на 90% меньше масла",
          "Разогревается за 2-3 минуты",
          "Быстро готовит (10-20 минут)",
          "Легко мыть (корзина)",
          "Отлично подходит для замороженных продуктов",
          "Компактный"
        ],
        "cons": [
          "Не готовит под давлением",
          "Небольшой объём",
          "Не сварить суп, рагу или йогурт",
          "Только сухой жар",
          "Если загрузить плотно, корзина мешает потоку воздуха"
        ]
      }
    }
  },
  "air-fryer-vs-oven": {
    "product1": {
      "es": {
        "name": "Freidora de aire",
        "pros": [
          "Se precalienta en 2-3 minutos",
          "Cocción muy rápida",
          "Tamaño compacto para la encimera",
          "Fácil para cocinar para una persona",
          "Cesta apta para lavavajillas"
        ],
        "cons": [
          "Capacidad limitada (2-6 l)",
          "No cabe comida grande",
          "La cesta bloquea el aire si se llena demasiado",
          "Otro electrodoméstico que guardar"
        ]
      },
      "fr": {
        "name": "Air fryer",
        "pros": [
          "Préchauffage en 2-3 minutes",
          "Cuisson très rapide",
          "Format compact pour le plan de travail",
          "Pratique pour un repas en solo",
          "Panier compatible lave-vaisselle"
        ],
        "cons": [
          "Capacité limitée (2 à 6 L)",
          "Impossible de cuire de grosses pièces",
          "Le panier gêne la circulation de l'air s'il est trop rempli",
          "Un appareil de plus à ranger"
        ]
      },
      "de": {
        "name": "Heißluftfritteuse",
        "pros": [
          "In 2-3 Minuten vorgeheizt",
          "Sehr schnelles Garen",
          "Kompakt für die Arbeitsplatte",
          "Perfekt für Single-Portionen",
          "Spülmaschinenfester Korb"
        ],
        "cons": [
          "Begrenztes Volumen (2-6 l)",
          "Große Gerichte passen nicht hinein",
          "Bei zu voller Beladung zirkuliert die Luft schlecht",
          "Noch ein Gerät, das verstaut werden muss"
        ]
      },
      "it": {
        "name": "Friggitrice ad aria",
        "pros": [
          "Si preriscalda in 2-3 minuti",
          "Cottura rapidissima",
          "Compatta, sta sul piano di lavoro",
          "Perfetta per i pasti da single",
          "Cestello lavabile in lavastoviglie"
        ],
        "cons": [
          "Capacità limitata (2-6 litri)",
          "Non cuoce pezzi grandi",
          "Il cestello blocca l'aria se troppo pieno",
          "Un altro elettrodomestico da riporre"
        ]
      },
      "ru": {
        "name": "Аэрогриль",
        "pros": [
          "Разогревается за 2-3 минуты",
          "Очень быстрая готовка",
          "Компактный, помещается на столешнице",
          "Удобно готовить на одного",
          "Корзину можно мыть в посудомойке"
        ],
        "cons": [
          "Небольшой объём (1,9-5,7 л)",
          "Крупные блюда не приготовить",
          "При переполнении корзина мешает потоку воздуха",
          "Ещё один прибор, который надо где-то хранить"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Horno de convección",
        "pros": [
          "Mucha más capacidad",
          "Cabe un pollo entero o una pizza de 30 cm",
          "Cocción en varias bandejas a la vez",
          "Sustituye al tostador y al horno",
          "Mejor para hornear"
        ],
        "cons": [
          "Tarda más de 10 min en precalentarse",
          "Ocupa mucho espacio en la encimera",
          "Tiempos de cocción más largos",
          "Más difícil de limpiar por dentro"
        ]
      },
      "fr": {
        "name": "Four à chaleur tournante",
        "pros": [
          "Bien plus grande capacité",
          "Accueille un poulet entier ou une pizza de 30 cm",
          "Cuisson sur plusieurs niveaux",
          "Remplace le grille-pain et le four",
          "Meilleur pour la pâtisserie"
        ],
        "cons": [
          "Plus de 10 min de préchauffage",
          "Prend beaucoup de place sur le plan de travail",
          "Cuissons plus longues",
          "Intérieur plus difficile à nettoyer"
        ]
      },
      "de": {
        "name": "Heißluftofen",
        "pros": [
          "Deutlich mehr Platz",
          "Ganzes Hähnchen oder 30-cm-Pizza passen hinein",
          "Garen auf mehreren Ebenen",
          "Ersetzt Toaster und Backofen",
          "Besser zum Backen"
        ],
        "cons": [
          "Über 10 Min. Vorheizzeit",
          "Nimmt viel Platz auf der Arbeitsplatte ein",
          "Längere Garzeiten",
          "Innenraum schwerer zu reinigen"
        ]
      },
      "it": {
        "name": "Forno ventilato",
        "pros": [
          "Capacità molto maggiore",
          "Ci sta un pollo intero o una pizza da 30 cm",
          "Cottura su più livelli",
          "Sostituisce tostapane e forno",
          "Meglio per i dolci e il pane"
        ],
        "cons": [
          "Servono oltre 10 min per preriscaldarlo",
          "Ingombra molto sul piano di lavoro",
          "Tempi di cottura più lunghi",
          "L'interno è più difficile da pulire"
        ]
      },
      "ru": {
        "name": "Духовка с конвекцией",
        "pros": [
          "Намного больше объём",
          "Поместится целая курица или пицца 30 см",
          "Готовка сразу на нескольких уровнях",
          "Заменяет тостер и духовку",
          "Лучше подходит для выпечки"
        ],
        "cons": [
          "Нагревается больше 10 минут",
          "Занимает много места на столешнице",
          "Готовит дольше",
          "Сложнее мыть внутри"
        ]
      }
    }
  },
  "robot-vacuum-vs-stick-vacuum": {
    "product1": {
      "es": {
        "name": "Robot aspirador",
        "pros": [
          "Funciona solo con horario programado",
          "Mapea las habitaciones y esquiva obstáculos",
          "Hay modelos con vaciado automático",
          "Limpia mientras no estás en casa",
          "Llega fácilmente bajo los muebles"
        ],
        "cons": [
          "Mayor coste inicial",
          "No puede con las escaleras",
          "Le cuestan las alfombras gruesas",
          "Depósito pequeño (salvo con vaciado automático)",
          "Hay que prepararle el terreno (cables, calcetines)"
        ]
      },
      "fr": {
        "name": "Robot aspirateur",
        "pros": [
          "Se lance tout seul selon un programme",
          "Cartographie les pièces et évite les obstacles",
          "Modèles à vidage automatique disponibles",
          "Nettoie pendant votre absence",
          "Passe facilement sous les meubles"
        ],
        "cons": [
          "Prix d'achat plus élevé",
          "Ne gère pas les escaliers",
          "Peine sur les tapis épais",
          "Petit bac à poussière (hors vidage automatique)",
          "Demande un peu de rangement (câbles, chaussettes)"
        ]
      },
      "de": {
        "name": "Saugroboter",
        "pros": [
          "Saugt automatisch nach Zeitplan",
          "Erstellt Raumkarten und umfährt Hindernisse",
          "Modelle mit automatischer Entleerung erhältlich",
          "Reinigt, während Sie unterwegs sind",
          "Kommt problemlos unter Möbel"
        ],
        "cons": [
          "Höhere Anschaffungskosten",
          "Schafft keine Treppen",
          "Tut sich mit dicken Teppichen schwer",
          "Kleiner Staubbehälter (außer mit Absaugstation)",
          "Vorab aufräumen nötig (Kabel, Socken)"
        ]
      },
      "it": {
        "name": "Robot aspirapolvere",
        "pros": [
          "Parte in automatico all'ora programmata",
          "Mappa le stanze ed evita gli ostacoli",
          "Disponibile con svuotamento automatico",
          "Pulisce mentre sei fuori casa",
          "Passa facilmente sotto i mobili"
        ],
        "cons": [
          "Costo iniziale più alto",
          "Non fa le scale",
          "Fatica sui tappeti spessi",
          "Contenitore piccolo (senza svuotamento automatico)",
          "Serve un po' di preparazione (cavi, calzini)"
        ]
      },
      "ru": {
        "name": "Робот-пылесос",
        "pros": [
          "Убирается сам по расписанию",
          "Строит карту комнат и объезжает препятствия",
          "Есть модели с самоочисткой",
          "Убирает, пока вас нет дома",
          "Легко заезжает под мебель"
        ],
        "cons": [
          "Выше цена при покупке",
          "Не справится с лестницами",
          "Плохо справляется с ворсистыми коврами",
          "Маленький контейнер для пыли (если нет самоочистки)",
          "Нужна подготовка (убрать провода, носки)"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Aspirador escoba",
        "pros": [
          "Succión potente (más de 150 AW)",
          "Limpia escaleras, tapicerías y el coche",
          "Lo coges y listo",
          "No hay que programarlo",
          "Se convierte en aspirador de mano"
        ],
        "cons": [
          "Requiere esfuerzo manual",
          "La batería limita la autonomía (30-60 min)",
          "Hay que vaciar el depósito en cada uso",
          "No funciona mientras estás fuera",
          "Pesado para limpiar en alto"
        ]
      },
      "fr": {
        "name": "Aspirateur balai",
        "pros": [
          "Forte aspiration (150 AW et plus)",
          "Nettoie escaliers, canapés et voiture",
          "Toujours à portée de main",
          "Aucune programmation à prévoir",
          "Se transforme en aspirateur à main"
        ],
        "cons": [
          "Demande un effort manuel",
          "Autonomie limitée par la batterie (30-60 min)",
          "Bac à vider après chaque usage",
          "Ne tourne pas quand vous êtes sorti",
          "Lourd à bout de bras pour nettoyer en hauteur"
        ]
      },
      "de": {
        "name": "Akkustaubsauger",
        "pros": [
          "Starke Saugkraft (über 150 AW)",
          "Reinigt Treppen, Polster und Auto",
          "Sofort griffbereit",
          "Keine Planung nötig",
          "Lässt sich zum Handstaubsauger umbauen"
        ],
        "cons": [
          "Muss selbst geführt werden",
          "Akku begrenzt die Laufzeit (30-60 Min.)",
          "Behälter nach jeder Nutzung leeren",
          "Saugt nicht, wenn Sie außer Haus sind",
          "Zu schwer für Arbeiten über Kopf"
        ]
      },
      "it": {
        "name": "Scopa elettrica senza fili",
        "pros": [
          "Aspirazione potente (oltre 150 AW)",
          "Pulisce scale, divani e auto",
          "La prendi e vai",
          "Nessuna programmazione",
          "Si trasforma in aspirabriciole"
        ],
        "cons": [
          "Richiede il tuo impegno",
          "La batteria limita l'autonomia (30-60 min)",
          "Il serbatoio va svuotato a ogni uso",
          "Non lavora mentre sei fuori",
          "Pesante da usare in alto"
        ]
      },
      "ru": {
        "name": "Вертикальный пылесос",
        "pros": [
          "Мощная тяга (150+ AW)",
          "Чистит лестницы, мебель и салон авто",
          "Взял и сразу пользуешься",
          "Не нужно ставить расписание",
          "Превращается в ручной"
        ],
        "cons": [
          "Нужно убираться самому",
          "Батарея ограничивает время работы (30-60 минут)",
          "Контейнер нужно опустошать после каждой уборки",
          "Не уберёт, пока вас нет дома",
          "Тяжело держать на весу над головой"
        ]
      }
    }
  },
  "kindle-vs-tablet": {
    "product1": {
      "es": {
        "name": "Kindle (tinta electrónica)",
        "pros": [
          "Sin reflejos, se lee como el papel",
          "Semanas de batería",
          "Ligero (160-230 g)",
          "Hay modelos resistentes al agua",
          "Biblioteca sincronizada entre dispositivos"
        ],
        "cons": [
          "Pasar de página es lento",
          "Sin color (en su mayoría)",
          "Pocas aplicaciones",
          "Los PDF se leen mal",
          "Es un dispositivo aparte"
        ]
      },
      "fr": {
        "name": "Liseuse Kindle (e-ink)",
        "pros": [
          "Aucun reflet, une lecture proche du papier",
          "Des semaines d'autonomie",
          "Légère (160-230 g)",
          "Modèles étanches disponibles",
          "Bibliothèque synchronisée entre appareils"
        ],
        "cons": [
          "Changement de page lent",
          "Pas de couleur (en général)",
          "Applications limitées",
          "Lecture des PDF peu confortable",
          "Un appareil de plus à avoir"
        ]
      },
      "de": {
        "name": "Kindle (E-Ink)",
        "pros": [
          "Keine Spiegelungen, liest sich wie Papier",
          "Wochenlange Akkulaufzeit",
          "Leicht (160-230 g)",
          "Wasserdichte Modelle erhältlich",
          "Bibliothek auf allen Geräten synchron"
        ],
        "cons": [
          "Langsames Umblättern",
          "Meist keine Farbe",
          "Kaum Apps",
          "PDFs lassen sich schlecht lesen",
          "Zusätzliches Gerät nötig"
        ]
      },
      "it": {
        "name": "Kindle (E-Ink)",
        "pros": [
          "Zero riflessi, si legge come su carta",
          "Batteria che dura settimane",
          "Leggero (160-230 g)",
          "Disponibile anche impermeabile",
          "Libreria sincronizzata tra i dispositivi"
        ],
        "cons": [
          "Cambio pagina lento",
          "Niente colori (quasi sempre)",
          "Poche app",
          "I PDF si leggono male",
          "È un dispositivo in più"
        ]
      },
      "ru": {
        "name": "Kindle (электронные чернила)",
        "pros": [
          "Нет бликов, читается как бумага",
          "Заряда хватает на недели",
          "Лёгкий (160-230 г)",
          "Есть водонепроницаемые модели",
          "Библиотека синхронизируется между устройствами"
        ],
        "cons": [
          "Медленно листает страницы",
          "Почти всегда чёрно-белый",
          "Мало приложений",
          "С PDF работает плохо",
          "Ещё одно отдельное устройство"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Tablet (LCD/OLED)",
        "pros": [
          "Color completo, ideal para cómics y revistas",
          "Multiusos (vídeo, web, apps)",
          "Rápida y fluida",
          "Los PDF se ven perfectos",
          "Un solo dispositivo para todo"
        ],
        "cons": [
          "Cansa la vista tras 30-60 min",
          "Reflejos con el sol",
          "Batería de 4-10 horas",
          "Pesada (400-600 g)",
          "Notificaciones constantes"
        ]
      },
      "fr": {
        "name": "Tablette (LCD/OLED)",
        "pros": [
          "Couleurs complètes, idéal pour BD et magazines",
          "Polyvalente (vidéo, web, applications)",
          "Rapide et réactive",
          "PDF parfaitement affichés",
          "Un seul appareil pour tout faire"
        ],
        "cons": [
          "Fatigue visuelle après 30-60 min",
          "Reflets en plein soleil",
          "4 à 10 heures d'autonomie",
          "Lourde (400-600 g)",
          "Notifications incessantes"
        ]
      },
      "de": {
        "name": "Tablet (LCD/OLED)",
        "pros": [
          "Volle Farbe für Comics und Magazine",
          "Vielseitig (Video, Web, Apps)",
          "Schnell und reaktionsfreudig",
          "PDFs werden perfekt dargestellt",
          "Ein Gerät für alles"
        ],
        "cons": [
          "Ermüdete Augen nach 30-60 Min.",
          "Spiegelt in der Sonne",
          "Nur 4-10 Stunden Akkulaufzeit",
          "Schwer (400-600 g)",
          "Ständige Benachrichtigungen"
        ]
      },
      "it": {
        "name": "Tablet (LCD/OLED)",
        "pros": [
          "Colori pieni, ideale per fumetti e riviste",
          "Multiuso (video, web, app)",
          "Veloce e reattivo",
          "I PDF si vedono alla perfezione",
          "Un solo dispositivo per tutto"
        ],
        "cons": [
          "Occhi affaticati dopo 30-60 min",
          "Riflessi alla luce del sole",
          "Batteria da 4-10 ore",
          "Pesante (400-600 g)",
          "Notifiche continue"
        ]
      },
      "ru": {
        "name": "Планшет (LCD/OLED)",
        "pros": [
          "Полноцветный экран для комиксов и журналов",
          "Подходит для видео, сайтов и приложений",
          "Быстрый и отзывчивый",
          "PDF отображаются идеально",
          "Одно устройство на все случаи"
        ],
        "cons": [
          "Глаза устают через 30-60 минут",
          "Блики на солнце",
          "Батареи хватает на 4-10 часов",
          "Тяжёлый (400-600 г)",
          "Постоянные уведомления"
        ]
      }
    }
  },
  "smart-plug-vs-smart-bulb": {
    "product1": {
      "es": {
        "name": "Enchufe inteligente",
        "pros": [
          "Funciona con cualquier aparato (lámpara, ventilador, cafetera)",
          "Sin obras ni bombillas nuevas",
          "Medición de consumo en algunos modelos",
          "Más barato por dispositivo (3-8 €)",
          "Automatiza electrodomésticos, no solo luces",
          "Compatible con tus lámparas actuales"
        ],
        "cons": [
          "Solo enciende y apaga, sin regulación de intensidad",
          "Voluminoso, puede tapar el enchufe de al lado",
          "Limitado a lo que se enchufa a él",
          "Sin control de color ni de temperatura"
        ]
      },
      "fr": {
        "name": "Prise connectée",
        "pros": [
          "Fonctionne avec n'importe quel appareil (lampe, ventilateur, cafetière)",
          "Pas de câblage ni d'ampoule à changer",
          "Suivi de la consommation sur certains modèles",
          "Moins chère par appareil (3-8 €)",
          "Permet d'automatiser des appareils, pas seulement l'éclairage",
          "Compatible avec vos lampes et luminaires actuels"
        ],
        "cons": [
          "Simple marche/arrêt, pas de variation",
          "Encombrante, elle peut bloquer la prise voisine",
          "Limitée aux appareils branchés dessus",
          "Pas de réglage de couleur ni de température"
        ]
      },
      "de": {
        "name": "Smarte Steckdose",
        "pros": [
          "Passt zu jedem Gerät (Lampe, Ventilator, Kaffeemaschine)",
          "Kein Umbau und keine neuen Leuchtmittel nötig",
          "Energieverbrauchsmessung bei einigen Modellen",
          "Günstiger pro Gerät (3-8 €)",
          "Automatisiert auch Haushaltsgeräte, nicht nur Licht",
          "Funktioniert mit vorhandenen Lampen und Leuchten"
        ],
        "cons": [
          "Nur Ein/Aus, kein Dimmen",
          "Sperrig, blockiert oft die Nachbarsteckdose",
          "Nur für angeschlossene Geräte",
          "Keine Farb- oder Temperatursteuerung"
        ]
      },
      "it": {
        "name": "Presa smart",
        "pros": [
          "Funziona con qualsiasi dispositivo (lampada, ventilatore, macchina del caffè)",
          "Niente impianto da toccare, niente lampadine da cambiare",
          "Monitoraggio dei consumi su alcuni modelli",
          "Costa meno per dispositivo (3-8 €)",
          "Automatizza anche gli elettrodomestici, non solo le luci",
          "Si abbina alle lampade che hai già"
        ],
        "cons": [
          "Solo acceso/spento, niente regolazione dell'intensità",
          "Ingombrante, può coprire la presa accanto",
          "Limitata ai dispositivi collegati alla presa",
          "Nessun controllo di colore o temperatura"
        ]
      },
      "ru": {
        "name": "Умная розетка",
        "pros": [
          "Работает с любым прибором (лампа, вентилятор, кофеварка)",
          "Не нужно ничего перепаивать и менять лампочки",
          "В некоторых моделях есть учёт энергопотребления",
          "Дешевле в расчёте на прибор (€3-8)",
          "Автоматизирует любую технику, а не только свет",
          "Подходит к вашим обычным лампам и светильникам"
        ],
        "cons": [
          "Только включение и выключение, без диммера",
          "Громоздкая, может перекрыть соседнюю розетку",
          "Управляет только тем, что включено в неё",
          "Нельзя менять цвет и температуру света"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Bombilla inteligente",
        "pros": [
          "Luz blanca regulable y 16 millones de colores",
          "Iluminación ambiental para cualquier estancia",
          "Sin hub (modelos Wi-Fi)",
          "Programación y automatización",
          "Compatible con control por voz",
          "Crea ambiente, no solo luz"
        ],
        "cons": [
          "Más cara por bombilla (5-15 €)",
          "El interruptor debe estar siempre encendido",
          "Hacen falta 2-3 bombillas para lograr el efecto en una estancia",
          "No todas las lámparas admiten bombillas inteligentes",
          "No controla aparatos que no sean de luz"
        ]
      },
      "fr": {
        "name": "Ampoule connectée",
        "pros": [
          "Blanc variable et 16 millions de couleurs",
          "Ambiance lumineuse pour toutes les pièces",
          "Pas de box nécessaire (modèles Wi-Fi)",
          "Programmation et automatisations",
          "Compatible commande vocale",
          "Crée une ambiance, pas seulement de la lumière"
        ],
        "cons": [
          "Plus chère à l'unité (5-15 €)",
          "L'interrupteur doit toujours rester allumé",
          "Il faut 2-3 ampoules pour un effet dans la pièce",
          "Tous les luminaires ne sont pas compatibles",
          "Ne pilote pas les appareils autres que l'éclairage"
        ]
      },
      "de": {
        "name": "Smarte Glühbirne",
        "pros": [
          "Dimmbares Weiß und 16 Mio. Farben",
          "Stimmungslicht für jeden Raum",
          "Keine Bridge nötig (WLAN-Modelle)",
          "Zeitpläne und Automatisierung",
          "Mit Sprachsteuerung kompatibel",
          "Schafft Atmosphäre, nicht nur Licht"
        ],
        "cons": [
          "Teurer pro Leuchtmittel (5-15 €)",
          "Der Schalter muss immer an bleiben",
          "Für einen Raumeffekt braucht man 2-3 Lampen",
          "Nicht jede Leuchte eignet sich für smarte Lampen",
          "Steuert keine Geräte außer Licht"
        ]
      },
      "it": {
        "name": "Lampadina smart",
        "pros": [
          "Luce bianca dimmerabile e 16 milioni di colori",
          "Luci d'atmosfera per ogni stanza",
          "Non serve il hub (modelli Wi-Fi)",
          "Programmazione e automazioni",
          "Compatibile con i comandi vocali",
          "Crea atmosfera, non solo luce"
        ],
        "cons": [
          "Costa di più per lampadina (5-15 €)",
          "L'interruttore deve restare sempre acceso",
          "Ne servono 2-3 per ottenere l'effetto in una stanza",
          "Non tutti i portalampada sono compatibili",
          "Non controlla dispositivi diversi dalle luci"
        ]
      },
      "ru": {
        "name": "Умная лампочка",
        "pros": [
          "Диммируемый белый свет и 16 млн цветов",
          "Настроение в любой комнате",
          "Хаб не нужен (модели с Wi-Fi)",
          "Расписание и автоматизация",
          "Совместима с голосовым управлением",
          "Создаёт атмосферу, а не просто свет"
        ],
        "cons": [
          "Дороже за штуку (€5-15)",
          "Выключатель должен всегда быть включён",
          "Для эффекта в комнате нужно 2-3 лампы",
          "Не все светильники подходят для умных ламп",
          "Не управляет приборами, которые не светят"
        ]
      }
    }
  },
  "usb-c-hub-vs-docking-station": {
    "product1": {
      "es": {
        "name": "Hub USB-C",
        "pros": [
          "Compacto y portátil",
          "Económico (15-40 $)",
          "Plug and play, sin drivers",
          "Genial para viajar",
          "La mayoría trae HDMI, USB-A y lector SD"
        ],
        "cons": [
          "Power Delivery limitado (60-85 W)",
          "Sin Ethernet en los modelos baratos",
          "Puede calentarse con un uso intensivo",
          "Cable corto (10-20 cm)",
          "Sin DisplayPort en la mayoría de modelos"
        ]
      },
      "fr": {
        "name": "Hub USB-C",
        "pros": [
          "Compact et transportable",
          "Abordable (15-40 $)",
          "Plug-and-play, sans pilote",
          "Idéal en déplacement",
          "La plupart ont HDMI, USB-A et lecteur SD"
        ],
        "cons": [
          "Puissance de charge limitée (60-85 W)",
          "Pas d'Ethernet sur les modèles bon marché",
          "Peut chauffer en usage intensif",
          "Câble court (10-20 cm)",
          "Pas de DisplayPort sur la plupart des modèles"
        ]
      },
      "de": {
        "name": "USB-C-Hub",
        "pros": [
          "Kompakt und mobil",
          "Günstig (15-40 $)",
          "Plug-and-play, keine Treiber",
          "Ideal für die Reise",
          "Meist mit HDMI, USB-A und SD-Kartenleser"
        ],
        "cons": [
          "Begrenzte Ladeleistung (60-85 W)",
          "Bei günstigen Modellen kein Ethernet",
          "Kann bei starker Nutzung heiß werden",
          "Kurzes Kabel (10-20 cm)",
          "Meist ohne DisplayPort"
        ]
      },
      "it": {
        "name": "Hub USB-C",
        "pros": [
          "Compatto e portatile",
          "Economico (15-40 $)",
          "Plug-and-play, senza driver",
          "Ideale per viaggiare",
          "La maggior parte ha HDMI, USB-A e lettore SD"
        ],
        "cons": [
          "Alimentazione limitata (60-85 W)",
          "Niente Ethernet sui modelli economici",
          "Può surriscaldarsi con un uso intenso",
          "Cavo corto (10-20 cm)",
          "Niente DisplayPort sulla maggior parte dei modelli"
        ]
      },
      "ru": {
        "name": "USB-C хаб",
        "pros": [
          "Компактный и лёгкий в переноске",
          "Недорогой ($15-40)",
          "Plug-and-play, драйверы не нужны",
          "Отлично подходит для поездок",
          "У большинства есть HDMI, USB-A и слот для SD-карт"
        ],
        "cons": [
          "Ограниченная мощность зарядки (60-85 Вт)",
          "В дешёвых моделях нет Ethernet",
          "При большой нагрузке может перегреваться",
          "Короткий кабель (10-20 см)",
          "У большинства моделей нет DisplayPort"
        ]
      }
    },
    "product2": {
      "es": {
        "name": "Docking station",
        "pros": [
          "Power Delivery completo (100 W o más)",
          "Compatible con dos o tres monitores",
          "Ethernet Gigabit integrado",
          "Más puertos (USB-A, USB-C, audio)",
          "Se queda en el escritorio, un solo cable al portátil",
          "Mejor refrigeración y calidad de construcción"
        ],
        "cons": [
          "Cara (60-200 $)",
          "Voluminosa, no es portátil",
          "Necesita fuente de alimentación externa",
          "Excesiva para un solo monitor",
          "Puede requerir drivers específicos"
        ]
      },
      "fr": {
        "name": "Station d'accueil",
        "pros": [
          "Charge à pleine puissance (100 W et plus)",
          "Prend en charge deux ou trois écrans",
          "Ethernet Gigabit intégré",
          "Plus de ports (USB-A, USB-C, audio)",
          "Reste sur le bureau, un seul câble vers le portable",
          "Meilleur refroidissement et meilleure finition"
        ],
        "cons": [
          "Chère (60-200 $)",
          "Encombrante, pas transportable",
          "Bloc d'alimentation externe nécessaire",
          "Superflue avec un seul écran",
          "Peut demander des pilotes spécifiques"
        ]
      },
      "de": {
        "name": "Dockingstation",
        "pros": [
          "Volle Ladeleistung (100 W und mehr)",
          "Zwei bis drei Monitore anschließbar",
          "Eingebautes Gigabit-Ethernet",
          "Mehr Anschlüsse (USB-A, USB-C, Audio)",
          "Bleibt auf dem Schreibtisch, nur ein Kabel zum Laptop",
          "Bessere Kühlung und Verarbeitung"
        ],
        "cons": [
          "Teuer (60-200 $)",
          "Sperrig und nicht mobil",
          "Externes Netzteil nötig",
          "Überdimensioniert für einen einzelnen Monitor",
          "Eventuell spezielle Treiber nötig"
        ]
      },
      "it": {
        "name": "Docking station",
        "pros": [
          "Alimentazione completa (100 W e oltre)",
          "Supporta due o tre monitor",
          "Ethernet Gigabit integrato",
          "Più porte (USB-A, USB-C, audio)",
          "Resta sulla scrivania, un solo cavo al portatile",
          "Migliore dissipazione e qualità costruttiva"
        ],
        "cons": [
          "Costosa (60-200 $)",
          "Ingombrante, non si porta in giro",
          "Serve un alimentatore esterno",
          "Esagerata per un solo monitor",
          "Potrebbe richiedere driver specifici"
        ]
      },
      "ru": {
        "name": "Док-станция",
        "pros": [
          "Полная мощность зарядки (100 Вт и больше)",
          "Поддержка двух-трёх мониторов",
          "Встроенный Ethernet (гигабитный)",
          "Больше портов (USB-A, USB-C, аудио)",
          "Стоит на столе, к ноутбуку идёт один кабель",
          "Лучше охлаждение и качество сборки"
        ],
        "cons": [
          "Дорого ($60-200)",
          "Громоздкая, для переноски не подходит",
          "Нужен внешний блок питания",
          "Избыточна для одного монитора",
          "Могут понадобиться отдельные драйверы"
        ]
      }
    }
  }
};
