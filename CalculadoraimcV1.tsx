import React, { useState, useMemo } from 'react';
import { Activity, Info, Scale, Ruler, User, ArrowRight, ArrowLeft, Utensils, AlertTriangle, BookOpen, ChevronRight } from 'lucide-react';

// ==========================================
// CONFIGURAÇÃO DE CONTEÚDO DE SAÚDE
// Baseado em: OMS, Guia Alimentar para a População Brasileira (MS) e ABESO.
// ==========================================
interface HealthGuideline {
  label: string;
  risks: string[];
  guidelines: string[];
  colorClass: string;
  bgColor: string;
}

const HEALTH_GUIDELINES: Record<string, HealthGuideline> = {
  'Magreza': {
    label: 'Magreza',
    colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
    bgColor: 'bg-blue-50',
    risks: [
      'Deficiências nutricionais (vitaminas e minerais)',
      'Enfraquecimento do sistema imunológico',
      'Perda de massa muscular (sarcopenia)',
      'Maior fragilidade óssea e risco de osteoporose',
      'Fadiga e cansaço crônico'
    ],
    guidelines: [
      'Priorizar alimentos com alta densidade nutritiva (castanhas, sementes, ovos, azeite)',
      'Fracionar as refeições em porções menores e mais frequentes ao longo do dia',
      'Aumentar a ingestão de proteínas de boa qualidade (carnes magras, leguminosas)',
      'Combinar exercícios de resistência (musculação) para ganho de massa magra',
      'Evitar o consumo excessivo de líquidos durante as refeições para não saciar precocemente'
    ]
  },
  'Normal': {
    label: 'Normal',
    colorClass: 'text-green-700 bg-green-50 border-green-200',
    bgColor: 'bg-green-50',
    risks: [
      'Embora o IMC seja normal, é importante monitorar a circunferência abdominal',
      'Manutenção de hábitos saudáveis para evitar a transição para o sobrepeso',
      'Atenção a exames laboratoriais (colesterol e glicemia) independentemente do peso'
    ],
    guidelines: [
      'Basear a alimentação em alimentos in natura ou minimamente processados',
      'Limitar o consumo de ultraprocessados (bebidas açucaradas, salgadinhos, embutidos)',
      'Manter a hidratação adequada (água como bebida principal)',
      'Praticar atividades físicas regularmente (pelo menos 150 min/semana)',
      'Priorizar frutas, legumes e verduras em todas as refeições principais'
    ]
  },
  'Sobrepeso': {
    label: 'Sobrepeso',
    colorClass: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    bgColor: 'bg-yellow-50',
    risks: [
      'Aumento do risco de desenvolvimento de hipertensão arterial',
      'Maior propensão a desenvolver diabetes tipo 2',
      'Sobrecarga nas articulações (especialmente joelhos e tornozelos)',
      'Aumento da probabilidade de evolução para obesidade'
    ],
    guidelines: [
      'Reduzir gradualmente o consumo de açúcares refinados e farinhas brancas',
      'Aumentar o consumo de fibras (aveia, chia, linhaça, vegetais folhosos)',
      'Substituir frituras por preparações grelhadas, assadas ou cozidas',
      'Aumentar a ingestão de água antes das refeições para auxiliar na saciedade',
      'Adotar caminhadas diárias ou atividades aeróbicas leves'
    ]
  },
  'Obesidade grau I': {
    label: 'Obesidade grau I',
    colorClass: 'text-orange-700 bg-orange-50 border-orange-200',
    bgColor: 'bg-orange-50',
    risks: [
      'Risco moderado de doenças cardiovasculares',
      'Aumento significativo da resistência à insulina',
      'Possível apneia do sono e roncos',
      'Maior risco de gordura no fígado (esteatose hepática)',
      'Impacto na mobilidade e qualidade do sono'
    ],
    guidelines: [
      'Focar no consumo de proteínas magras e vegetais para preservar massa muscular',
      'Evitar o consumo de calorias líquidas (sucos industrializados e refrigerantes)',
      'Planejar as refeições para evitar escolhas impulsivas por fome excessiva',
      'Incorporar exercícios de força combinados com atividades aeróbicas',
      'Buscar apoio profissional para ajuste calórico seguro e sustentável'
    ]
  },
  'Obesidade grau II': {
    label: 'Obesidade grau II',
    colorClass: 'text-red-700 bg-red-50 border-red-200',
    bgColor: 'bg-red-50',
    risks: [
      'Alto risco de hipertensão e doenças coronárias',
      'Risco elevado de diabetes tipo 2 e síndrome metabólica',
      'Problemas respiratórios e fadiga rápida ao esforço',
      'Inflamação sistêmica crônica de baixa intensidade',
      'Sobrecarga severa nas articulações e coluna'
    ],
    guidelines: [
      'Priorizar alimentos naturais e evitar rigorosamente ultraprocessados',
      'Aumentar a ingestão de fibras para melhorar a saciedade e a saúde intestinal',
      'Controlar a ingestão de sal para auxiliar no controle da pressão arterial',
      'Iniciar atividades físicas de baixo impacto (hidroginástica, natação, caminhada lenta)',
      'Acompanhamento rigoroso com nutricionista e endocrinologista'
    ]
  },
  'Obesidade grau III': {
    label: 'Obesidade grau III',
    colorClass: 'text-red-900 bg-red-100 border-red-300',
    bgColor: 'bg-red-100',
    risks: [
      'Risco muito elevado de eventos cardiovasculares graves (AVC, Infarto)',
      'Diabetes tipo 2 com maior dificuldade de controle',
      'Limitações severas de mobilidade e independência física',
      'Risco aumentado de complicações respiratórias graves',
      'Impacto significativo na saúde mental e bem-estar psicossocial'
    ],
    guidelines: [
      'Focar em pequenas mudanças sustentáveis para evitar frustrações',
      'Priorizar a qualidade nutricional acima de restrições calóricas severas',
      'Consumo rigoroso de água e redução de sódio e açúcares',
      'Atividade física prescrita e supervisionada por profissional de saúde',
      'Equipe multidisciplinar indispensável (médico, nutri, psicólogo, fisio)'
    ]
  }
};

const SOURCES = [
  { name: 'Organização Mundial da Saúde (OMS)', url: 'https://www.who.int' },
  { name: 'Ministério da Saúde - Guia Alimentar para a População Brasileira', url: 'https://www.gov.br/saude' },
  { name: 'ABESO (Associação Brasileira para o Estudo da Obesidade)', url: 'https://abeso.org.br' }
];

export default function App() {
  // Estado para navegação entre telas
  const [screen, setScreen] = useState('home');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Estados para as entradas do usuário
  const [gender, setGender] = useState('male');
  const [weightStr, setWeightStr] = useState('');
  const [heightStr, setHeightStr] = useState('');

  // 1. VALIDAÇÃO E CÁLCULO
  const weight = parseFloat(weightStr);
  const height = parseFloat(heightStr);

  let errors = { weight: '', height: '' };
  let isValid = true;

  if (weightStr !== '') {
    if (isNaN(weight) || weight < 2 || weight > 400) {
      errors.weight = 'O peso deve estar entre 2 e 400 kg.';
      isValid = false;
    }
  } else {
    isValid = false;
  }

  if (heightStr !== '') {
    if (isNaN(height) || height < 50 || height > 250) {
      errors.height = 'A altura deve estar entre 50 e 250 cm.';
      isValid = false;
    }
  } else {
    isValid = false;
  }

  // 2. LÓGICA DE CLASSIFICAÇÃO DA OMS
  let results = null;
  if (isValid) {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    const minIdeal = 18.5 * (heightM * heightM);
    const maxIdeal = 24.9 * (heightM * heightM);

    let category = '';
    let colorClass = '';
    let diffAmount = 0;
    let diffType = '';

    if (bmi < 18.5) {
      category = 'Magreza';
      colorClass = 'text-blue-700 bg-blue-50 border-blue-200';
      diffAmount = minIdeal - weight;
      diffType = 'ganhar';
    } else if (bmi < 25) {
      category = 'Normal';
      colorClass = 'text-green-700 bg-green-50 border-green-200';
    } else if (bmi < 30) {
      category = 'Sobrepeso';
      colorClass = 'text-yellow-700 bg-yellow-50 border-yellow-200';
      diffAmount = weight - maxIdeal;
      diffType = 'perder';
    } else if (bmi < 35) {
      category = 'Obesidade grau I';
      colorClass = 'text-orange-700 bg-orange-50 border-orange-200';
      diffAmount = weight - maxIdeal;
      diffType = 'perder';
    } else if (bmi < 40) {
      category = 'Obesidade grau II';
      colorClass = 'text-red-700 bg-red-50 border-red-200';
      diffAmount = weight - maxIdeal;
      diffType = 'perder';
    } else {
      category = 'Obesidade grau III';
      colorClass = 'text-red-900 bg-red-100 border-red-300';
      diffAmount = weight - maxIdeal;
      diffType = 'perder';
    }

    results = {
      bmi,
      category,
      colorClass,
      minIdeal: minIdeal.toFixed(1),
      maxIdeal: maxIdeal.toFixed(1),
      diffAmount: diffAmount > 0 ? diffAmount.toFixed(1) : 0,
      diffType
    };
  }

  // 3. PARÂMETROS VISUAIS DO BONECO
  const visualParams = useMemo(() => {
    const vBmi = results ? Math.max(15, Math.min(45, results.bmi)) : 22;
    const diff = vBmi - 22;
    const isMale = gender === 'male';

    let color = '#CBD5E1';
    if (results) {
      if (vBmi < 18.5) color = '#60A5FA';
      else if (vBmi < 25) color = '#4ADE80';
      else if (vBmi < 30) color = '#FACC15';
      else if (vBmi < 35) color = '#FB923C';
      else color = '#F87171';
    }

    const shoulderW = isMale ? 38 + diff * 1.2 : 28 + diff * 1.0;
    const hipW      = isMale ? 28 + diff * 1.5 : 36 + diff * 1.8;
    const armW      = 8 + diff * 0.3;
    const legW      = 10 + diff * 0.4;
    const headR     = 14 + diff * 0.1;

    return {
      color,
      headR,
      armW,
      legW,
      diff,
      shoulderL: 50 - shoulderW / 2,
      shoulderR: 50 + shoulderW / 2,
      hipL: 50 - hipW / 2,
      hipR: 50 + hipW / 2,
      scaleY: results && height ? Math.max(0.85, Math.min(1.15, height / 170)) : 1
    };
  }, [results, gender, height]);

  const { color, headR, armW, legW, shoulderL, shoulderR, hipL, hipR, diff, scaleY } = visualParams;

  const bmiTableData = [
    { range: 'Menor que 18,5', label: 'Magreza' },
    { range: '18,5 a 24,9', label: 'Normal' },
    { range: '25 a 29,9', label: 'Sobrepeso' },
    { range: '30 a 34,9', label: 'Obesidade grau I' },
    { range: '35 a 39,9', label: 'Obesidade grau II' },
    { range: 'Maior que 40', label: 'Obesidade grau III' },
  ];

  // ==========================================
  // TELA DE ORIENTAÇÕES DE SAÚDE
  // ==========================================
  if (screen === 'guidelines') {
    const currentCat = activeCategory || (results ? results.category : 'Normal');
    const content = HEALTH_GUIDELINES[currentCat] || HEALTH_GUIDELINES['Normal'];

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4 sm:p-8 font-sans text-gray-800">
        <div className="max-w-4xl w-full bg-white shadow-2xl rounded-[2rem] overflow-hidden flex flex-col border border-orange-100">

          <div className="p-6 md:p-10 bg-white border-b border-gray-100">
            <button
              onClick={() => setScreen('calculator')}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-orange-600 transition-colors mb-6"
            >
              <ArrowLeft size={16} /> Voltar para Calculadora
            </button>

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-orange-950 flex items-center gap-3">
                  <BookOpen className="text-orange-500" size={32} />
                  Orientações de Saúde
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Informações educativas baseadas em diretrizes de saúde pública.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200 overflow-x-auto">
                {Object.keys(HEALTH_GUIDELINES).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                      currentCat === cat
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </header>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${content.colorClass} flex items-center gap-4`}>
              <div className="p-3 bg-white/50 rounded-full">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black">{content.label}</h3>
                <p className="text-sm opacity-80 font-medium">Informações específicas para esta faixa de IMC</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2 pl-2">
                  <AlertTriangle className="text-red-500" size={20} />
                  Riscos Associados
                </h4>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3">
                  {content.risks.map((risk, i) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-600 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2 pl-2">
                  <Utensils className="text-green-500" size={20} />
                  Como se alimentar melhor
                </h4>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3">
                  {content.guidelines.map((guide, i) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-600 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                      <span>{guide}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex gap-4">
              <Info className="text-orange-500 shrink-0" size={24} />
              <div className="text-sm text-orange-800 leading-relaxed">
                <strong className="block font-bold mb-1 text-orange-900">Importante:</strong>
                Este conteúdo é meramente informativo. O IMC é uma medida geral e não substitui a avaliação de um profissional.
                <strong className="block mt-1"> Nunca inicie dietas restritivas ou use medicamentos sem a prescrição de um médico ou nutricionista.</strong>
              </div>
            </div>
          </div>

          <footer className="p-6 md:p-10 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col items-center text-center gap-4">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fontes Consultadas</h5>
              <div className="flex flex-wrap justify-center gap-3">
                {SOURCES.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-gray-500 hover:text-orange-600 bg-white px-3 py-1.5 rounded-full border border-gray-200 transition-colors flex items-center gap-1"
                  >
                    {source.name} <ChevronRight size={12} />
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4 font-sans text-gray-800">
        <div className="max-w-2xl w-full bg-white p-10 md:p-14 rounded-[2rem] shadow-2xl text-center border border-orange-100 transform transition-all hover:scale-[1.01]">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Activity className="text-orange-500" size={48} />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-orange-950 mb-6 tracking-tight">
            Descubra seu IMC
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            O <strong className="text-orange-800">Índice de Massa Corporal (IMC)</strong> é uma métrica simples usada pela Organização Mundial da Saúde (OMS) para classificar se o seu peso está adequado para sua altura.
          </p>

          <div className="bg-orange-50 rounded-2xl p-6 mb-10 text-left text-sm text-gray-600 border border-orange-100/50">
            <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <Info size={18} className="text-orange-500" />
              Por que é importante?
            </h3>
            <p>
              Manter o IMC dentro da faixa "Normal" ajuda a prevenir doenças relacionadas ao sobrepeso, como problemas cardíacos e diabetes, além de alertar sobre riscos associados à magreza excessiva.
            </p>
          </div>

          <button
            onClick={() => setScreen('calculator')}
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all focus:outline-none focus:ring-4 focus:ring-orange-500/30"
          >
            Começar a calcular
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4 sm:p-8 font-sans text-gray-800">
      <div className="max-w-7xl w-full bg-white shadow-2xl rounded-[2rem] overflow-hidden flex flex-col lg:flex-row border border-orange-100">
        <div className="w-full lg:w-5/12 p-6 md:p-10 flex flex-col relative z-10 bg-white">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-orange-600 transition-colors mb-6 self-start"
          >
            <ArrowLeft size={16} /> Voltar ao Início
          </button>

          <header className="mb-8">
            <h2 className="text-3xl font-extrabold text-orange-950 mb-2 flex items-center gap-3">
              Calculadora
            </h2>
            <p className="text-gray-500 text-sm">
              Preencha os dados abaixo para visualizar sua silhueta e análise.
            </p>
          </header>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Sexo Biológico</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                    gender === 'male'
                    ? 'bg-orange-50 border-orange-400 text-orange-800 shadow-sm'
                    : 'bg-white border-gray-100 text-gray-400 hover:border-orange-200 hover:text-orange-600'
                  }`}
                >
                  <User size={18} /> Masculino
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                    gender === 'female'
                    ? 'bg-orange-50 border-orange-400 text-orange-800 shadow-sm'
                    : 'bg-white border-gray-100 text-gray-400 hover:border-orange-200 hover:text-orange-600'
                  }`}
                >
                  <User size={18} /> Feminino
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Scale size={16} className="text-orange-400"/> Peso (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 70.5"
                  value={weightStr}
                  onChange={(e) => setWeightStr(e.target.value)}
                  aria-invalid={!!errors.weight}
                  className={`w-full p-4 rounded-xl border-2 bg-gray-50 focus:bg-white focus:outline-none transition-all ${
                    errors.weight ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-orange-400'
                  }`}
                />
                <div aria-live="polite" className="min-h-[20px] mt-1 text-xs text-red-500 font-semibold">
                  {errors.weight}
                </div>
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Ruler size={16} className="text-orange-400"/> Altura (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  step="1"
                  placeholder="Ex: 175"
                  value={heightStr}
                  onChange={(e) => setHeightStr(e.target.value)}
                  aria-invalid={!!errors.height}
                  className={`w-full p-4 rounded-xl border-2 bg-gray-50 focus:bg-white focus:outline-none transition-all ${
                    errors.height ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-orange-400'
                  }`}
                />
                <div aria-live="polite" className="min-h-[20px] mt-1 text-xs text-red-500 font-semibold">
                  {errors.height}
                </div>
              </div>
            </div>
          </form>

          <div aria-live="polite" className="mt-6 flex-grow flex flex-col justify-end gap-4">
            {results ? (
              <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${results.colorClass}`}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Seu IMC</p>
                    <div className="text-4xl font-black">{results.bmi.toFixed(1)}</div>
                  </div>
                  <div className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-lg font-bold text-sm shadow-sm">
                    {results.category}
                  </div>
                </div>

                <div className="space-y-1 text-sm font-medium opacity-90 mt-4 border-t border-current pt-4">
                  <p>Peso ideal: <span className="font-extrabold">{results.minIdeal} kg a {results.maxIdeal} kg</span></p>
                  {results.diffAmount !== 0 && (
                    <p>
                      Para atingir a faixa normal, você precisa {results.diffType} <span className="font-extrabold">{results.diffAmount} kg</span>.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setActiveCategory(results.category);
                    setScreen('guidelines');
                  }}
                  className="w-full mt-6 py-3 bg-white/70 hover:bg-white transition-all rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm border border-current/20"
                >
                  <BookOpen size={16} />
                  Ver orientações de saúde
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-center text-gray-400 font-medium">
                Insira peso e altura válidos para visualizar seu resultado.
              </div>
            )}

            <div className="flex gap-3 text-xs text-gray-500 bg-orange-50/50 p-4 rounded-xl">
              <Info size={18} className="shrink-0 text-orange-400" />
              <p>
                <strong>Aviso:</strong> O IMC não distingue massa muscular de gordura e não substitui uma avaliação médica.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-7/12 bg-gray-50/80 relative p-6 md:p-10 border-l border-gray-100 flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-12">
          <div
            className="relative w-full max-w-[260px] h-[380px] flex justify-center items-end"
            style={{
              opacity: results ? 1 : 0.3,
              transition: 'opacity 0.5s ease',
              transform: `scaleY(${scaleY})`,
              transformOrigin: 'bottom'
            }}
          >
            <svg
              viewBox="0 0 100 200"
              className="w-full h-full overflow-visible z-10"
              style={{ filter: 'drop-shadow(0px 15px 20px rgba(0,0,0,0.15))' }}
            >
              <g fill={color} stroke={color} style={{ transition: 'fill 0.5s ease, stroke 0.5s ease' }}>
                <circle cx="50" cy="22" r={headR} stroke="none" style={{ transition: 'all 0.5s ease' }} />
                <path
                  d={`
                    M ${shoulderL} 45
                    C ${shoulderL} 35, ${shoulderR} 35, ${shoulderR} 45
                    L ${hipR} 105
                    C ${hipR} 115, ${hipL} 115, ${hipL} 105
                    Z
                  `}
                  stroke="none"
                  style={{ transition: 'all 0.5s ease' }}
                />
                <line
                  x1={shoulderL + armW * 0.4} y1={48}
                  x2={shoulderL - 5 - diff * 0.2} y2={95}
                  strokeWidth={armW} strokeLinecap="round" style={{ transition: 'all 0.5s ease' }}
                />
                <line
                  x1={shoulderR - armW * 0.4} y1={48}
                  x2={shoulderR + 5 + diff * 0.2} y2={95}
                  strokeWidth={armW} strokeLinecap="round" style={{ transition: 'all 0.5s ease' }}
                />
                <line
                  x1={hipL + legW * 0.6} y1={108}
                  x2={hipL + legW * 0.2} y2={185}
                  strokeWidth={legW} strokeLinecap="round" style={{ transition: 'all 0.5s ease' }}
                />
                <line
                  x1={hipR - legW * 0.6} y1={108}
                  x2={hipR - legW * 0.2} y2={185}
                  strokeWidth={legW} strokeLinecap="round" style={{ transition: 'all 0.5s ease' }}
                />
              </g>
            </svg>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/5 rounded-[100%] blur-sm pointer-events-none" />
          </div>

          <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden z-10">
            <div className="bg-orange-50/50 px-4 py-3 border-b border-orange-100 text-center">
              <h3 className="text-sm font-bold text-orange-900">Tabela de Classificação IMC</h3>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 border-b border-gray-100 w-1/2">IMC</th>
                  <th scope="col" className="px-4 py-3 border-b border-gray-100">Classificação</th>
                </tr>
              </thead>
              <tbody>
                {bmiTableData.map((row, index) => {
                  const isActive = results && results.category === row.label;
                  return (
                    <tr
                      key={index}
                      className={`
                        transition-colors duration-300 border-b border-gray-50 last:border-0
                        ${isActive
                          ? 'bg-orange-100/60 font-bold text-orange-950 shadow-inner'
                          : 'bg-white text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      <td className="px-4 py-3 relative">
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-full"></div>
                        )}
                        {row.range}
                      </td>
                      <td className="px-4 py-3">{row.label}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
