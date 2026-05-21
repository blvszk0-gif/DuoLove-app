export interface Question {
  id: string;
  type: 'translate' | 'match' | 'choice' | 'listening' | 'scene';
  instruction: string;
  prompt: string; // The text presented to user (e.g. "Kocham Cię")
  audioText: string; // The text spoken by Leon (e.g. "Te amo")
  correctAnswer: string | string[]; // Correct answer or sorted elements
  options?: string[]; // Word pool for sentence builder or multiple choices
  pairs?: { left: string; right: string }[]; // For matching type
  leonDialogue?: {
    imageState: 'happy' | 'combat' | 'blush' | 'serious';
    text: string;
    choices: { text: string; isCorrect: boolean; reply: string }[];
  }; // For narrative interactive scenes
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xp: number;
  questions: Question[];
}

export interface Level {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface Course {
  language: 'es' | 'en';
  title: string;
  flag: string;
  levels: Level[];
}

export const COURSES: Course[] = [
  // ==========================================
  // JĘZYK HISZPAŃSKI 🇪🇸
  // ==========================================
  {
    language: 'es',
    title: 'Hiszpański z Leonem',
    flag: '🇪🇸',
    levels: [
      {
        id: 'es_level_1',
        title: 'Podstawowe przetrwanie',
        description: 'Podstawy hiszpańskiego: przywitania, jedzenie i pierwsze słówka, które przydadzą się w podróży (i przy ratowaniu świata).',
        icon: 'Sparkles',
        lessons: [
          {
            id: 'es_lesson_1_1',
            title: 'Pierwsze powitania',
            description: 'Naucz się witać, żegnać i przedstawiać.',
            xp: 20,
            questions: [
              {
                id: 'es_q_1_1_1',
                type: 'choice',
                instruction: 'Wybierz poprawne tłumaczenie słowa "Dzień dobry":',
                prompt: 'Dzień dobry / Cześć',
                audioText: 'Hola, buenos días',
                correctAnswer: 'Hola, buenos días',
                options: ['Hola, buenos días', 'Adiós, buenas noches', 'Gracias, por favor']
              },
              {
                id: 'es_q_1_1_2',
                type: 'translate',
                instruction: 'Ułóż zdanie po hiszpańsku:',
                prompt: 'Dziękuję bardzo',
                audioText: 'Muchas gracias',
                correctAnswer: 'Muchas gracias',
                options: ['Muchas', 'gracias', 'hola', 'adiós', 'amor', 'amigo']
              },
              {
                id: 'es_q_1_1_3',
                type: 'match',
                instruction: 'Połącz słówka w pary:',
                prompt: 'Dopasuj polskie słowa do hiszpańskich odpowiedników',
                audioText: '',
                correctAnswer: '',
                pairs: [
                  { left: 'Cześć', right: 'Hola' },
                  { left: 'Do widzenia', right: 'Adiós' },
                  { left: 'Dziękuję', right: 'Gracias' },
                  { left: 'Proszę', right: 'Por favor' },
                  { left: 'Przyjaciel', right: 'Amigo' }
                ]
              },
              {
                id: 'es_q_1_1_4',
                type: 'listening',
                instruction: 'Odsłuchaj Leona i ułóż to, co słyszysz:',
                prompt: 'Kliknij głośnik i ułóż zdanie',
                audioText: 'Hola amigo cómo estás',
                correctAnswer: 'Hola amigo cómo estás',
                options: ['cómo', 'Hola', 'amigo', 'estás', 'gracias', 'adiós', 'cerveza']
              }
            ]
          },
          {
            id: 'es_lesson_1_2',
            title: 'Kawiarnia i Przetrwanie',
            description: 'Jak zamówić coś do picia i przetrwać w obcym miejscu.',
            xp: 25,
            questions: [
              {
                id: 'es_q_1_2_1',
                type: 'choice',
                instruction: 'Co oznacza zwrot "Una cerveza, por favor"?',
                prompt: 'Una cerveza, por favor',
                audioText: 'Una cerveza por favor',
                correctAnswer: 'Jedno piwo, poproszę',
                options: ['Jedną kawę, poproszę', 'Jedno piwo, poproszę', 'Gdzie jest łazienka?']
              },
              {
                id: 'es_q_1_2_2',
                type: 'translate',
                instruction: 'Przetłumacz na hiszpański:',
                prompt: 'Kawa z mlekiem',
                audioText: 'Café con leche',
                correctAnswer: 'Café con leche',
                options: ['Café', 'con', 'leche', 'cerveza', 'agua', 'por favor']
              },
              {
                id: 'es_q_1_2_3',
                type: 'choice',
                instruction: 'Jak zapytasz o drogę do bezpiecznego miejsca/łazienki?',
                prompt: 'Gdzie jest łazienka?',
                audioText: 'Dónde está el baño',
                correctAnswer: '¿Dónde está el baño?',
                options: ['¿Dónde está el baño?', '¿Qué hora es?', 'Me gusta el café']
              }
            ]
          }
        ]
      },
      {
        id: 'es_level_2',
        title: 'Różane wyznania (Słodka lekcja)',
        description: 'Romantyczne słówka i spersonalizowane zwroty. Dowiedz się, jak wyrazić swoje uczucia po hiszpańsku.',
        icon: 'Heart',
        lessons: [
          {
            id: 'es_lesson_2_1',
            title: 'Słodkie Wyznania',
            description: 'Powiedz jej coś uroczego po hiszpańsku.',
            xp: 30,
            questions: [
              {
                id: 'es_q_2_1_1',
                type: 'choice',
                instruction: 'Jak powiesz po hiszpańsku „Kocham Cię”? (Głos Leona zabrzmi bardzo romantycznie!)',
                prompt: 'Kocham Cię',
                audioText: 'Te amo mi amor',
                correctAnswer: 'Te amo, mi amor',
                options: ['Te amo, mi amor', 'Hola mi amigo', 'Eres muy feo']
              },
              {
                id: 'es_q_2_1_2',
                type: 'translate',
                instruction: 'Ułóż słodkie zdanie:',
                prompt: 'Jesteś bardzo piękna',
                audioText: 'Eres muy hermosa',
                correctAnswer: 'Eres muy hermosa',
                options: ['Eres', 'muy', 'hermosa', 'feo', 'amigo', 'gracias']
              },
              {
                id: 'es_q_2_1_3',
                type: 'match',
                instruction: 'Dopasuj urocze słówka w pary:',
                prompt: 'Połącz polskie i hiszpańskie słówka uczuć',
                audioText: '',
                correctAnswer: '',
                pairs: [
                  { left: 'Kochanie', right: 'Cariño' },
                  { left: 'Moje życie', right: 'Mi vida' },
                  { left: 'Serce', right: 'Corazón' },
                  { left: 'Pocałunek', right: 'Beso' },
                  { left: 'Uśmiech', right: 'Sonrisa' }
                ]
              },
              {
                id: 'es_q_2_1_4',
                type: 'listening',
                instruction: 'Leon ma dla Ciebie intymną wiadomość. Odsłuchaj go uważnie:',
                prompt: 'Odsłuchaj i ułóż romantyczne wyznanie',
                audioText: 'Tú eres todo mi mundo',
                correctAnswer: 'Tú eres todo mi mundo',
                options: ['Tú', 'eres', 'todo', 'mi', 'mundo', 'cerveza', 'hola']
              }
            ]
          },
          {
            id: 'es_lesson_2_2',
            title: 'Tęsknota i Czułość',
            description: 'Urocze zwroty, które sprawią, że serduszko zabije mocniej.',
            xp: 35,
            questions: [
              {
                id: 'es_q_2_2_1',
                type: 'choice',
                instruction: 'Co oznacza zwrot „Te extraño mucho”?',
                prompt: 'Te extraño mucho',
                audioText: 'Te extraño mucho',
                correctAnswer: 'Bardzo za Tobą tęsknię',
                options: ['Bardzo za Tobą tęsknię', 'Lubię Twoje oczy', 'Jesteś moją bułeczką']
              },
              {
                id: 'es_q_2_2_2',
                type: 'translate',
                instruction: 'Ułóż zdanie o jej oczach:',
                prompt: 'Uwielbiam Twoje oczy',
                audioText: 'Me encantan tus ojos',
                correctAnswer: 'Me encantan tus ojos',
                options: ['Me', 'encantan', 'tus', 'ojos', 'hermosa', 'cariño', 'café']
              },
              {
                id: 'es_q_2_2_3',
                type: 'choice',
                instruction: 'A jak nazwiesz ją po hiszpańsku „słodką bułeczką cynamonową”? (Uroczy komplement z kalkulatora!)',
                prompt: 'Moja cynamonowa bułeczko',
                audioText: 'Mi rollito de canela',
                correctAnswer: 'Mi rollito de canela',
                options: ['Mi rollito de canela', 'Un monstruo grande', 'Adiós mi amigo']
              }
            ]
          }
        ]
      },
      {
        id: 'es_level_3',
        title: 'Scenki z agentem Leonem',
        description: 'Interaktywne dialogi fabularne z Resident Evil. Pomóż Leonowi w misjach dyplomatycznych i sercowych!',
        icon: 'Shield',
        lessons: [
          {
            id: 'es_lesson_3_1',
            title: 'Misja w Raccoon City',
            description: 'Leon spotyka potwora... albo Twoje spojrzenie. Wybierz dobre kwestie!',
            xp: 40,
            questions: [
              {
                id: 'es_q_3_1_1',
                type: 'scene',
                instruction: 'Pomóż Leonowi przejść przez zainfekowane hiszpańskie miasteczko!',
                prompt: 'Interaktywna scenka z Leonem',
                audioText: '',
                correctAnswer: '2',
                leonDialogue: {
                  imageState: 'serious',
                  text: 'Witaj, szeryfie. Droga przede mną jest zablokowana przez dziwnych ludzi krzyczących: „¡Un forastero!”. Jak powinienem grzecznie zapytać ich po hiszpańsku, kim są?',
                  choices: [
                    { 
                      text: 'Krzyknąć: „¿Quién eres?” (Kim jesteś?)', 
                      isCorrect: false, 
                      reply: 'Leon strzela ostrzegawczo w powietrze. „Trochę zbyt agresywnie, kochanie. Spróbujmy łagodniej.”' 
                    },
                    { 
                      text: 'Powiedzieć spokojnie: „¿Disculpe, quién es usted?” (Przepraszam, kim pan/pani jest?)', 
                      isCorrect: true, 
                      reply: 'Leon uśmiecha się, poprawiając grzywkę. „Idealnie. Prawdziwa dyplomacja. Masz klasę, baby.”' 
                    },
                    { 
                      text: 'Zapytać: „¿Quieres comer una manzana?” (Chcesz zjeść jabłko?)', 
                      isCorrect: false, 
                      reply: 'Leon marszczy brwi. „Nie sądzę, żeby zombie mieli apetyt na owoce... Ale doceniam uroczy gest!”' 
                    }
                  ]
                }
              },
              {
                id: 'es_q_3_1_2',
                type: 'scene',
                instruction: 'Chwila wytchnienia po walce.',
                prompt: 'Leon potrzebuje zielonej roślinki i dobrego słowa!',
                audioText: '',
                correctAnswer: '1',
                leonDialogue: {
                  imageState: 'blush',
                  text: 'Uff, to było blisko. Straciłem trochę punktów zdrowia... Och, rumienię się, bo Twoja obecność leczy mnie lepiej niż Green Herb. Jak powiesz mi czule po hiszpańsku „Wszystko będzie dobrze, mój bohaterze”? ',
                  choices: [
                    { 
                      text: '„Todo va a estar bien, mi héroe”', 
                      isCorrect: true, 
                      reply: 'Leon chowa pistolet i lekko się czerwieni. „Dzięki Tobie czuję się jak milion dolarów. Jesteś najwspanialszą dziewczyną na świecie.”' 
                    },
                    { 
                      text: '„Adiós y buena suerte” (Żegnaj i powodzenia)', 
                      isCorrect: false, 
                      reply: 'Leon wygląda na zasmuconego. „Zostawiasz mnie samego z tymi wszystkimi potworami? Auć, moje serce...”' 
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  },
  
  // ==========================================
  // JĘZYK ANGIELSKI 🇬🇧
  // ==========================================
  {
    language: 'en',
    title: 'Angielski z Leonem',
    flag: '🇬🇧',
    levels: [
      {
        id: 'en_level_1',
        title: 'Daily Survival Kit',
        description: 'Podstawowe angielskie frazy, które uratują Cię w każdej sytuacji za granicą.',
        icon: 'Sparkles',
        lessons: [
          {
            id: 'en_lesson_1_1',
            title: 'Greetings & Coffee',
            description: 'Przedstaw się i zamów kawę (lub dwie).',
            xp: 20,
            questions: [
              {
                id: 'en_q_1_1_1',
                type: 'choice',
                instruction: 'Wybierz poprawne tłumaczenie na angielski zwrotu „Dzień dobry, jak się masz?”:',
                prompt: 'Dzień dobry, jak się masz?',
                audioText: 'Good morning how are you',
                correctAnswer: 'Good morning, how are you?',
                options: ['Good morning, how are you?', 'Goodbye, nice to meet you', 'I would like a coffee']
              },
              {
                id: 'en_q_1_1_2',
                type: 'translate',
                instruction: 'Ułóż zdanie po angielsku:',
                prompt: 'Poproszę czarną kawę',
                audioText: 'Black coffee please',
                correctAnswer: 'Black coffee please',
                options: ['Black', 'coffee', 'please', 'tea', 'milk', 'sugar']
              },
              {
                id: 'en_q_1_1_3',
                type: 'match',
                instruction: 'Dopasuj podstawowe angielskie słówka:',
                prompt: 'Połącz słówka w pary',
                audioText: '',
                correctAnswer: '',
                pairs: [
                  { left: 'Dzień dobry', right: 'Good morning' },
                  { left: 'Przepraszam (zaczepiając)', right: 'Excuse me' },
                  { left: 'Proszę bardzo (podając coś)', right: 'Here you go' },
                  { left: 'Miłego dnia', right: 'Have a nice day' },
                  { left: 'Dziękuję', right: 'Thank you' }
                ]
              },
              {
                id: 'en_q_1_1_4',
                type: 'listening',
                instruction: 'Posłuchaj Leona i ułóż zdanie:',
                prompt: 'Odsłuchaj i ułóż zdanie',
                audioText: 'Excuse me where is the station',
                correctAnswer: 'Excuse me where is the station',
                options: ['Excuse', 'me', 'where', 'is', 'the', 'station', 'airport', 'hotel']
              }
            ]
          }
        ]
      },
      {
        id: 'en_level_2',
        title: 'Sweet Action Hero (Dla Zakochanych)',
        description: 'Wyznania miłosne po angielsku z ust Agenta Specjalnego. Bardzo słodkie zwroty ze słynnymi powiedzonkami z kalkulatora!',
        icon: 'Heart',
        lessons: [
          {
            id: 'en_lesson_2_1',
            title: 'Romantyczny Agent',
            description: 'Urocze komplementy, które Leon (lub Twój chłopak) szepcze Ci do ucha.',
            xp: 30,
            questions: [
              {
                id: 'en_q_2_1_1',
                type: 'choice',
                instruction: 'Który zwrot oznacza: „Jesteś najładniejszą dziewczyną na imprezie”? (Kultowe hasło z Twojego kalkulatora!)',
                prompt: 'Jesteś najładniejszą dziewczyną na imprezie',
                audioText: 'You are the prettiest girl at the party',
                correctAnswer: 'You are the prettiest girl at the party',
                options: [
                  'You are the prettiest girl at the party',
                  'I am very tired today',
                  'Leon is fighting zombies'
                ]
              },
              {
                id: 'en_q_2_1_2',
                type: 'translate',
                instruction: 'Ułóż słodkie zdanie:',
                prompt: 'Jesteś najsłodszą rzeczą na świecie',
                audioText: 'You are the cutest thing on the whole world',
                correctAnswer: 'You are the cutest thing on the whole world',
                options: ['You', 'are', 'the', 'cutest', 'thing', 'on', 'the', 'whole', 'world', 'ugly', 'bad']
              },
              {
                id: 'en_q_2_1_3',
                type: 'match',
                instruction: 'Połącz romantyczne zwroty:',
                prompt: 'Dopasuj pary słówek i uczuć',
                audioText: '',
                correctAnswer: '',
                pairs: [
                  { left: 'Tęsknię za Tobą', right: 'I miss you' },
                  { left: 'Jesteś śliczna', right: 'You look beautiful' },
                  { left: 'Moje serce', right: 'My heart' },
                  { left: 'Uwielbiam Cię', right: 'I adore you' },
                  { left: 'Słodkich snów', right: 'Sweet dreams' }
                ]
              },
              {
                id: 'en_q_2_1_4',
                type: 'listening',
                instruction: 'Posłuchaj, co Leon ma do powiedzenia o Twojej wyjątkowości:',
                prompt: 'Odsłuchaj i ułóż komplement',
                audioText: 'You make my heart skip a beat',
                correctAnswer: 'You make my heart skip a beat',
                options: ['You', 'make', 'my', 'heart', 'skip', 'a', 'beat', 'zombie', 'gun', 'fight']
              }
            ]
          }
        ]
      },
      {
        id: 'en_level_3',
        title: 'Resident Love Scenes',
        description: 'Scenki z Leonem ratującym świat i prawiącym urocze komplementy.',
        icon: 'Shield',
        lessons: [
          {
            id: 'en_lesson_3_1',
            title: 'Ashley Who? (Tylko Ty)',
            description: 'Leon musi ocalić prezydencką córkę, ale myśli tylko o Tobie.',
            xp: 40,
            questions: [
              {
                id: 'en_q_3_1_1',
                type: 'scene',
                instruction: 'Leon rozmawia z Tobą przez krótkofalówkę!',
                prompt: 'Interaktywna scenka z Agentem Kennedym',
                audioText: '',
                correctAnswer: '1',
                leonDialogue: {
                  imageState: 'happy',
                  text: 'Hunnigan twierdzi, że misja jest zbyt niebezpieczna. Ale ja powiedziałem jej: „Sorry, but following a lady’s lead just isn’t my style... unless it is my beautiful girlfriend’s lead.” Jak powiesz mi po angielsku „Uważaj na siebie, Leon”? ',
                  choices: [
                    { 
                      text: '„Take care of yourself, Leon”', 
                      isCorrect: true, 
                      reply: 'Leon uśmiecha się szeroko przez radio. „Zawsze, baby. Twój głos to najlepszy pancerz, jaki mam.”' 
                    },
                    { 
                      text: '„No thanks, bro!”', 
                      isCorrect: false, 
                      reply: 'Leon śmieje się cicho. „Hej, to moja kwestia! Używasz moich własnych żartów przeciwko mnie? Sprytna jesteś.”' 
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
