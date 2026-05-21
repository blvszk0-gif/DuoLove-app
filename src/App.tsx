import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Book, Shield, Heart, Trophy, Flame, Play, CheckCircle, RefreshCw, Sparkles, Volume2 } from 'lucide-react';
import { COURSES, Level, Lesson } from './lessonsData';
import { speakLeon } from './ttsHelper';
import CuteLeon from './components/CuteLeon';
import LessonView, { playSound } from './components/LessonView';

export default function App() {
  // --- STATE ---
  const [selectedCourse, setSelectedCourse] = useState<'es' | 'en'>('es');
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(3); // start with cute default streak
  const [hearts, setHearts] = useState<number>(5);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'learn' | 'vocab' | 'agent'>('learn');

  // Interactive Level Selection
  const [expandedLevelId, setExpandedLevelId] = useState<string | null>('es_level_1');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // --- LOCAL STORAGE SYNC ---
  useEffect(() => {
    // Load progress
    const savedXp = localStorage.getItem('duolove_xp');
    const savedStreak = localStorage.getItem('duolove_streak');
    const savedHearts = localStorage.getItem('duolove_hearts');
    const savedCompleted = localStorage.getItem('duolove_completed_lessons');

    if (savedXp) setXp(parseInt(savedXp));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedHearts) setHearts(parseInt(savedHearts));
    if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));

    // Handle initial expanded level based on course
    setExpandedLevelId(selectedCourse === 'es' ? 'es_level_1' : 'en_level_1');
  }, [selectedCourse]);

  const saveProgress = (newXp: number, newCompleted: string[]) => {
    localStorage.setItem('duolove_xp', newXp.toString());
    localStorage.setItem('duolove_completed_lessons', JSON.stringify(newCompleted));
    setXp(newXp);
    setCompletedLessons(newCompleted);
  };

  // --- REFILL HEARTS ---
  const refillHearts = () => {
    // Trigger sweet chime
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch(e){}

    setHearts(5);
    localStorage.setItem('duolove_hearts', '5');
  };

  // --- COMPLETE LESSON ---
  const handleLessonFinish = (xpEarned: number) => {
    if (!activeLesson) return;
    
    const newXp = xp + xpEarned;
    const isCompletedAlready = completedLessons.includes(activeLesson.id);
    const nextCompleted = isCompletedAlready 
      ? completedLessons 
      : [...completedLessons, activeLesson.id];
    
    // Add streak by 1 if not done today (simplified cute logic)
    const newStreak = streak + (isCompletedAlready ? 0 : 1);
    setStreak(newStreak);
    localStorage.setItem('duolove_streak', newStreak.toString());

    saveProgress(newXp, nextCompleted);
    
    // Close lesson
    setActiveLesson(null);
  };

  const course = COURSES.find(c => c.language === selectedCourse) || COURSES[0];

  // List of all vocabularies for selected course
  const getAllVocab = () => {
    const list: { prompt: string; foreign: string; type: string }[] = [];
    course.levels.forEach(level => {
      level.lessons.forEach(lesson => {
        lesson.questions.forEach(q => {
          if (q.type === 'match' && q.pairs) {
            q.pairs.forEach(p => {
              if (!list.some(item => item.foreign === p.right)) {
                list.push({ prompt: p.left, foreign: p.right, type: 'Słówko' });
              }
            });
          } else if (q.audioText && q.type !== 'listening') {
            const promptText = q.prompt.length > 30 ? q.prompt.slice(0, 30) + '...' : q.prompt;
            if (!list.some(item => item.foreign === q.audioText)) {
              list.push({ prompt: promptText, foreign: q.audioText, type: 'Zwrot' });
            }
          }
        });
      });
    });
    return list;
  };

  // Agent Leon's special sounds list
  const LEON_MEMO_QUOTES = [
    { text: "Kocham Cię, kochanie.", english: "I love you, baby.", context: "Romantyczne wyznanie Leona" },
    { text: "Jesteś najpiękniejszą dziewczyną na imprezie.", english: "You are the prettiest girl at the party.", context: "Leon prawi komplementy" },
    { text: "Uwielbiam Twoje oczy.", english: "I love your eyes.", context: "Leon patrzy głęboko w oczy" },
    { text: "Nie ma mowy, brachu!", english: "No thanks, bro!", context: "Kultowy tekst Leona z Resident Evil 4" },
    { text: "Dobra robota, baby. Wiedziałem, że dasz radę.", english: "Good job, baby. I knew you could do it.", context: "Leon gratuluje sukcesu" },
    { text: "Osłaniam Cię. Wracajmy do bazy.", english: "I've got you covered. Let's head back to base.", context: "Leon dba o bezpieczeństwo" },
    { text: "Czas na zieloną roślinkę.", english: "Time for a green herb.", context: "Leon odnawia punkty życia" }
  ];

  if (activeLesson) {
    return (
      <div className="app-container">
        <LessonView
          lesson={activeLesson}
          lang={selectedCourse}
          onClose={() => setActiveLesson(null)}
          onFinish={handleLessonFinish}
          hearts={hearts}
          setHearts={setHearts}
        />
      </div>
    );
  }

  return (
    <div className="app-container shadow-2xl">
      
      {/* HEADER SECTION */}
      <div className="bg-white border-b-2 border-[#F4C0D0] px-4 pt-3 pb-3 flex flex-col gap-1 z-10 shrink-0">
        
        {/* TOP STATUS BAR: FLAGS AND STATS */}
        <div className="flex justify-between items-center">
          {/* FLAG & LANGUAGE TOGGLE */}
          <div className="relative">
            <button 
              onClick={() => {
                setSelectedCourse(prev => prev === 'es' ? 'en' : 'es');
              }}
              className="flex items-center gap-1.5 bg-[#FFEBF0] hover:bg-pink-100 border border-[#FF88AC] py-1 px-3.5 rounded-full text-sm font-bold text-[#d81b60]"
            >
              <span>{course.flag}</span>
              <span className="font-didact text-xs font-semibold uppercase">{selectedCourse === 'es' ? 'Hiszpański' : 'Angielski'}</span>
            </button>
          </div>

          {/* APP TITLE */}
          <span className="font-caveat text-xl font-bold text-[#d81b60] tracking-wide">DuoLove 💖</span>

          {/* DYNAMIC METERS (STREAK, XP, HEARTS) */}
          <div className="flex items-center gap-2">
            
            {/* Streak */}
            <div className="badge-container flex items-center" title="Twój płomień nauki!">
              <Flame className="w-4 h-4 fill-current text-orange-500 stroke-orange-600 animate-bounce" />
              <span className="font-courier font-bold text-xs">{streak}</span>
            </div>

            {/* XP Badge */}
            <div className="badge-container text-yellow-600 border-yellow-400 bg-yellow-50/50 flex items-center" title="Punkty doświadczenia">
              <Trophy className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-courier font-bold text-xs">{xp}</span>
            </div>

            {/* Hearts Badge */}
            <div className="badge-container flex items-center bg-red-50/50" title="Życia">
              <Heart className="w-4 h-4 fill-current text-red-500 animate-heart" />
              <span className="font-courier font-bold text-xs">{hearts}</span>
              {hearts < 5 && (
                <button 
                  onClick={refillHearts}
                  className="ml-1 p-0.5 bg-[#FF88AC] hover:bg-[#FE8DAF] rounded-full text-white text-[10px]"
                  title="Użyj Green Herb, by odnowić życia!"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CORE CONTENT SCROLLING BODY */}
      <div className="flex-1 overflow-y-auto hide-scrollbar level-path p-4 flex flex-col items-center">
        
        {/* 1. LEARNING TAB (Duolingo level map) */}
        {activeTab === 'learn' && (
          <div className="w-full flex flex-col items-center py-2 space-y-6">
            
            {/* Mascot Banner Greeting */}
            <CuteLeon 
              state={hearts === 5 ? "happy" : "serious"} 
              speechBubbleText="Witaj w bazie, baby. Wybierz poziom i ruszajmy do akcji. Osłaniam Cię!" 
            />

            {/* vertical levels map list */}
            <div className="w-full flex flex-col items-center space-y-8 relative">
              {/* Connecting line between dots */}
              <div className="absolute top-10 bottom-10 w-2.5 bg-gradient-to-b from-[#FF88AC] to-[#F4C0D0] rounded-full left-1/2 -translate-x-1/2 opacity-60 z-0" />

              {course.levels.map((lvl, index) => {
                const isExpanded = expandedLevelId === lvl.id;
                
                // Calculate completion stats for level
                const totalLessons = lvl.lessons.length;
                const completedCount = lvl.lessons.filter(l => completedLessons.includes(l.id)).length;
                const isFullyCompleted = completedCount === totalLessons && totalLessons > 0;

                // Alternate left/right offset for Duolingo snake effect
                const snakeAlign = index % 3 === 0 
                  ? 'translate-x-0' 
                  : index % 3 === 1 
                    ? '-translate-x-8' 
                    : 'translate-x-8';

                return (
                  <div key={lvl.id} className="w-full flex flex-col items-center z-10 relative">
                    
                    {/* Level Circular Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        playSound('click');
                        setExpandedLevelId(isExpanded ? null : lvl.id);
                      }}
                      className={`w-18 h-18 rounded-full border-4 shadow-lg flex items-center justify-center relative cursor-pointer ${snakeAlign} ${
                        isFullyCompleted 
                          ? 'bg-gradient-to-br from-green-400 to-green-500 border-green-200 text-white'
                          : isExpanded
                            ? 'bg-gradient-to-br from-[#FF88AC] to-[#EA76DF] border-white text-white scale-110 animate-pulse'
                            : 'bg-white border-[#F4C0D0] text-[#d81b60]'
                      }`}
                    >
                      {/* Floating sparkle icon if active level */}
                      {isExpanded && !isFullyCompleted && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 p-1 rounded-full text-white">
                          <Sparkles className="w-3.5 h-3.5 fill-current animate-spin" />
                        </div>
                      )}
                      
                      {isFullyCompleted ? (
                        <CheckCircle className="w-8 h-8 fill-current" />
                      ) : lvl.icon === 'Heart' ? (
                        <Heart className="w-8 h-8 fill-current text-red-400 animate-heart" />
                      ) : lvl.icon === 'Shield' ? (
                        <Shield className="w-8 h-8 fill-current" />
                      ) : (
                        <Sparkles className="w-8 h-8 fill-current" />
                      )}

                      {/* Small badge of completed lesson counts */}
                      <span className="absolute -bottom-1.5 bg-[#FF88AC] text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm border border-white">
                        {completedCount}/{totalLessons}
                      </span>
                    </motion.button>

                    {/* Level Expansion Details Card */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className="w-full max-w-sm mt-3.5 bg-white p-4 rounded-3xl border-2 border-[#F4C0D0] shadow-md z-20 overflow-hidden"
                        >
                          <h4 className="font-bold text-center text-[#d81b60] text-base font-didact mb-1">{lvl.title}</h4>
                          <p className="text-gray-500 text-center text-xs font-didact leading-relaxed mb-4">{lvl.description}</p>
                          
                          {/* Lessons inside level */}
                          <div className="space-y-3.5">
                            {lvl.lessons.map(lsn => {
                              const isLsnCompleted = completedLessons.includes(lsn.id);
                              return (
                                <div key={lsn.id} className="bg-[#FFEBF0]/55 p-3 rounded-2xl border border-[#FFF5F7] flex items-center justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <h5 className="font-bold text-xs text-gray-800 font-didact">{lsn.title}</h5>
                                      {isLsnCompleted && <CheckCircle className="w-3.5 h-3.5 text-green-500 fill-current" />}
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-didact leading-tight mt-0.5">{lsn.description}</p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      playSound('click');
                                      setActiveLesson(lsn);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-white font-bold text-xs shadow-sm flex items-center gap-1 border-b-2 active:translate-y-0.5 transition-all ${
                                      isLsnCompleted
                                        ? 'bg-green-500 border-green-600 hover:bg-green-400'
                                        : 'bg-[#FF88AC] border-[#FE8DAF] hover:bg-[#FE8DAF]'
                                    }`}
                                  >
                                    <Play className="w-3 h-3 fill-current" />
                                    <span>{isLsnCompleted ? 'Powtórz' : 'Start'}</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. VOCABULARY TAB (Interactive Dictionary Explorer) */}
        {activeTab === 'vocab' && (
          <div className="w-full flex flex-col py-2 space-y-4">
            <h3 className="text-center font-bold text-[#d81b60] text-lg font-didact">
              Słowniczek agentki ({getAllVocab().length} słów/fraz)
            </h3>
            <p className="text-center text-xs text-gray-500 font-didact leading-relaxed">
              Klikaj na słówka, by usłyszeć ich wymowę głosem Leona Kennedy'ego (niskie męskie tony)!
            </p>

            <div className="space-y-2 max-w-sm mx-auto w-full">
              {getAllVocab().map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => speakLeon(item.foreign, selectedCourse)}
                  className="bg-white p-3.5 rounded-2xl border-2 border-[#F4C0D0] hover:border-[#FF88AC] shadow-sm flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold bg-[#FFEBF0] text-[#d81b60] px-2 py-0.5 rounded-full block w-max mb-1">
                      {item.type}
                    </span>
                    <h4 className="font-bold text-gray-800 text-sm font-didact">„{item.prompt}”</h4>
                    <p className="text-xs text-[#d81b60] font-semibold font-didact mt-0.5">{item.foreign}</p>
                  </div>

                  <div className="p-2.5 bg-[#FFEBF0] rounded-full text-[#d81b60] hover:bg-pink-100">
                    <Volume2 className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 3. AGENT TAB (Special Boyfriend / Resident Evil Fun zone) */}
        {activeTab === 'agent' && (
          <div className="w-full flex flex-col py-2 space-y-5">
            
            {/* Cute chibi portrait */}
            <CuteLeon state="blush" speechBubbleText="Specjalny Agent Leon S. Kennedy gotowy na rozkazy, baby." />

            {/* Tactial profile info cards */}
            <div className="bg-white p-5 rounded-3xl border-2 border-[#F4C0D0] shadow-sm max-w-sm mx-auto w-full space-y-4">
              <h3 className="text-center font-bold text-[#d81b60] text-lg font-didact">
                Profil Agenta RPD
              </h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs font-didact">
                <div className="bg-[#FFEBF0]/50 p-2.5 rounded-xl border border-[#FFEBF0]">
                  <strong className="block text-gray-400 font-bold mb-0.5">Nazwisko:</strong>
                  <span className="font-bold text-gray-700">Leon S. Kennedy</span>
                </div>
                <div className="bg-[#FFEBF0]/50 p-2.5 rounded-xl border border-[#FFEBF0]">
                  <strong className="block text-gray-400 font-bold mb-0.5">Status Relacji:</strong>
                  <span className="font-bold text-[#d81b60] flex items-center gap-0.5">
                    Zakochany <Heart className="w-3 h-3 fill-current text-red-500 animate-heart" />
                  </span>
                </div>
                <div className="bg-[#FFEBF0]/50 p-2.5 rounded-xl border border-[#FFEBF0]">
                  <strong className="block text-gray-400 font-bold mb-0.5">Poziom ochrony:</strong>
                  <span className="font-bold text-gray-700">Maksymalny (100%)</span>
                </div>
                <div className="bg-[#FFEBF0]/50 p-2.5 rounded-xl border border-[#FFEBF0]">
                  <strong className="block text-gray-400 font-bold mb-0.5">Ulubiony lek:</strong>
                  <span className="font-bold text-green-600">Różowy Green Herb</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <h4 className="font-bold text-[#d81b60] text-xs font-didact uppercase tracking-wider mb-2 text-center">
                  Odsłuchaj wiadomości głosowe:
                </h4>
                <div className="space-y-2">
                  {LEON_MEMO_QUOTES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => speakLeon(item.english, 'en')}
                      className="w-full text-left p-2.5 bg-[#FFEBF0]/30 hover:bg-[#FFEBF0] rounded-xl border border-[#F4C0D0]/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="block text-gray-700 font-didact leading-tight">{item.text}</strong>
                        <span className="text-[10px] text-gray-400 font-didact italic block mt-0.5">{item.english}</span>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-[#d81b60] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER TAB BAR (Duolingo style bottom navigation) */}
      <div className="bg-white border-t-2 border-[#F4C0D0] px-6 py-2.5 flex justify-around items-center shrink-0 z-10">
        
        {/* Tabs */}
        <button
          onClick={() => {
            playSound('click');
            setActiveTab('learn');
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer font-bold transition-all ${
            activeTab === 'learn' ? 'text-[#d81b60] scale-105' : 'text-gray-400 hover:text-pink-400'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-didact">Nauka</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTab('vocab');
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer font-bold transition-all ${
            activeTab === 'vocab' ? 'text-[#d81b60] scale-105' : 'text-gray-400 hover:text-pink-400'
          }`}
        >
          <Book className="w-5 h-5" />
          <span className="text-[10px] font-didact">Słowniczek</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTab('agent');
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer font-bold transition-all ${
            activeTab === 'agent' ? 'text-[#d81b60] scale-105' : 'text-gray-400 hover:text-pink-400'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] font-didact">Agent Leon</span>
        </button>
      </div>

    </div>
  );
}
