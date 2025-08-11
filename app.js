// ImunoPlay – JS principal
// Conteúdo didático + interações. Progresso salvo em localStorage.

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ======= Dados =======
const flashcards = [
  // Inato x Adaptativo
  {q:"Funções do sistema imune (3)?", a:"Defesa, homeostase (equilíbrio) e manutenção da identidade bioquímica."},
  {q:"Órgãos linfóides primários x secundários?", a:"Primários: medula óssea e timo. Secundários/periféricos: linfonodos, baço e tecidos linfoides associados às mucosas."},
  {q:"Imunidade inata: 2 características-chave + exemplos celulares?", a:"Resposta rápida sem memória; reconhecimento de padrões (PAMPs/DAMPs). Células: neutrófilos, monócitos/macrófagos, mastócitos, eosinófilos, basófilos, NK; componentes humorais: complemento."},
  {q:"Imunidade adaptativa: traços maiores?", a:"Alta especificidade, diversidade, memória, especialização, amplificação (expansão clonal), auto-limitação e auto-tolerância. Eixo celular (T CD4/CD8) e humoral (anticorpos B)."},
  // MHC
  {q:"Onde ficam os genes do MHC (HLA) nos humanos? Classes?", a:"Cromossomo 6. Classe I (HLA-A, -B, -C); Classe II (HLA-DQ, -DR, -DP; HLA-DM auxilia montagem). Classe III: genes de citocinas/complemento."},
  {q:"Quem expressa MHC I x MHC II?", a:"MHC I: todas as células nucleadas (apresenta peptídeos endógenos). MHC II: principalmente APCs (DC, macrófagos, linfócitos B) para antígenos exógenos."},
  {q:"O que aumenta a expressão de MHC em infecção?", a:"Citocinas, especialmente interferons: IFN-α/β ↑ MHC I; IFN-γ ↑ MHC II (e I)."},
  // Hipersensibilidade
  {q:"Hipersensibilidade tipo I: base e exemplos?", a:"Mediada por IgE, imediata; mastócitos/basófilos, histamina, leucotrienos; exemplos: rinite, asma atópica, alergia a alimentos/latéx."},
  {q:"Tipo II x III em uma frase?", a:"Ambas por IgG/IgM; II: antígeno fixo em célula/tecido (ex.: reação transfusional, Graves, Miastenia). III: antígeno solúvel → imunocomplexos e deposição (ex.: lúpus, GN pós-estreptococo)."},
  {q:"Tipo IV: mecanismo e exemplos?", a:"Mediada por linfócitos T (tardia). Ex.: contato com metais/PPD, DM1, rejeição de transplante."},
  // Tumores
  {q:"Exemplos de antígenos tumorais relevantes?", a:"Produtos oncogênicos superexpressos; proteínas virais (HPV E6/E7 inibem p53/Rb); antígenos de genes antes silenciados; proteínas aberrantes (neoantígenos)."},
  {q:"Como NK evita matar células normais?", a:"Equilíbrio KAR/KIR; presença de MHC I (HLA-I) vazio ativa receptor inibitório (KIR) e bloqueia citotoxicidade; ‘missing self’ remove freio → NK ataca."}
];

const quiz = [
  { q:"Qual cenário indica predominância de resposta TH2?",
    options:["Infecção por vírus","Helmintíase","Bactéria extracelular pequena","Infecção fúngica sistêmica"],
    answer:1, why:"Helmintos são grandes; resposta TH2 favorece IgE/IgA e eosinófilos." },
  { q:"Quem expressa MHC II de forma típica?",
    options:["Todas as células nucleadas","Somente neurônios","APCs (DC, macrófagos e LB)","Somente hepatócitos"],
    answer:2, why:"MHC II é característico de APCs para antígenos exógenos." },
  { q:"Tipo de hipersensibilidade da miastenia grave:",
    options:["I","II","III","IV"],
    answer:1, why:"Anticorpos contra receptores de ACh (mecanismo do tipo II)." },
  { q:"Citocina que mais aumenta MHC I em células não-imunes:",
    options:["IL-4","IFN-α/β","IL-1","TNF-β"],
    answer:1, why:"IFN-α/β (tipo I) ↑ expressão de MHC I." },
  { q:"Marcador de 'missing self' na vigilância tumoral:",
    options:["Ausência de MHC I","Excesso de MHC II","CD28 elevado","IgM baixo"],
    answer:0, why:"Células tumorais que perdem MHC I são alvos de NK." },
  { q:"Antígeno solúvel formando imunocomplexos que se depositam em rins. Classifique:",
    options:["Tipo I","Tipo II","Tipo III","Tipo IV"],
    answer:2, why:"Imunocomplexos circulantes = tipo III." },
  { q:"MHC I apresenta peptídeos principalmente:",
    options:["Exógenos","Endógenos","Carboidratos","Lipídeos"],
    answer:1, why:"Vem do citosol (endógeno), reconhecido por CD8+." },
  { q:"Principal célula fagocítica mais abundante no sangue:",
    options:["Eosinófilo","Basófilo","Neutrófilo","Linfócito B"],
    answer:2, why:"Neutrófilo domina a resposta aguda." },
  { q:"Reação transfusional aguda é exemplo de:", options:["I","II","III","IV"],
    answer:1, why:"Anticorpos contra antígenos eritrocitários fixos (tipo II)." },
  { q:"HLA-A, -B e -C pertencem a:", options:["MHC II","MHC III","MHC I","Classe Hiper"],
    answer:2, why:"HLA-A/B/C são loci de MHC I no cromossomo 6." }
];

const dragItems = [
  {text:"Neutrófilos", bucket:"inata"},
  {text:"Macrófagos", bucket:"inata"},
  {text:"Mastócitos", bucket:"inata"},
  {text:"NK", bucket:"inata"},
  {text:"Complemento", bucket:"inata"},
  {text:"Linfócito B", bucket:"adaptativa"},
  {text:"Linfócito T CD4", bucket:"adaptativa"},
  {text:"Linfócito T CD8", bucket:"adaptativa"},
];

const mhcItems = [
  {text:"Expressa-se em todas as células nucleadas", bucket:"I"},
  {text:"Principalmente em APCs (DC, macrófagos, LB)", bucket:"II"},
  {text:"Apresenta antígenos endógenos (citossólicos)", bucket:"I"},
  {text:"Apresenta antígenos exógenos (endossomais)", bucket:"II"},
  {text:"Reconhecida por T CD8+", bucket:"I"},
  {text:"Reconhecida por T CD4+", bucket:"II"},
  {text:"Aumenta com IFN-α/β", bucket:"I"},
  {text:"Aumenta com IFN-γ", bucket:"II"},
];

const hypers = [
  {case:"Rinite com prurido e espirros minutos após exposição a poeira.", answer:"I", why:"IgE + mastócito/basófilo; imediata."},
  {case:"Hemólise após transfusão ABO incompatível.", answer:"II", why:"Anticorpos contra antígenos fixos na hemácia (IgG/IgM)."},
  {case:"Proteinúria por depósito de imunocomplexos em glomérulos.", answer:"III", why:"Antígeno solúvel + Ig → deposição tecidual."},
  {case:"PPD positivo (induração) 48–72h.", answer:"IV", why:"Resposta T tardia."},
  {case:"Miastenia gravis com fraqueza por autoanticorpos anti-AChR.", answer:"II", why:"Autoanticorpos contra receptor (tipo II)."},
  {case:"Lúpus eritematoso sistêmico com lesão renal.", answer:"III", why:"Imunocomplexos sistêmicos."},
  {case:"Dermatite de contato por níquel.", answer:"IV", why:"T de memória cutânea; reação tardia."}
];

const tumorCards = [
  {title:"Antígenos tumorais", text:"Superexpressos, aberrantes (neoantígenos), virais (HPV E6/E7) e genes antes silenciados.", tag:"alvos"},
  {title:"P53/Rb", text:"Perda de p53 piora prognóstico; E6/E7 do HPV inibem p53/Rb favorecendo oncogênese.", tag:"controle"},
  {title:"NK: ‘missing self’", text:"Perda de MHC I remove inibição via KIR → NK libera grânulos e mata.", tag:"vigilância"},
  {title:"Interferons", text:"IFN-α/β ↑ MHC I; IFN-γ ↑ MHC II (e I) — melhora apresentação ao T.", tag:"citocinas"}
];

// Vacinas
const vacItems = [
  {text:"BCG — viva atenuada", bucket:"aten"},
  {text:"Tríplice viral (SCR) — atenuada", bucket:"aten"},
  {text:"Varicela — atenuada", bucket:"aten"},
  {text:"Influenza inativada", bucket:"inativ"},
  {text:"Hepatite A — inativada", bucket:"inativ"},
  {text:"Hepatite B (HBsAg) — subunidade", bucket:"sub"},
  {text:"dT (difteria/tétano) — toxoide", bucket:"sub"},
  {text:"Pneumo 10/13 — conjugada", bucket:"sub"},
  {text:"Meningo ACWY — conjugada", bucket:"sub"},
  {text:"COVID-19 (Pfizer/Moderna) — mRNA", bucket:"mrna"},
  {text:"COVID-19 (AstraZeneca/J&J) — vetor viral", bucket:"vetor"},
  {text:"HPV — VLP", bucket:"vlp"}
];

// Tolerância
const tolCases = [
  {case:"Linfócito T autoreativo encontra antígeno no timo com alta afinidade.", answer:"central", why:"Seleção negativa no timo elimina T fortemente autoreativos."},
  {case:"Linfócito B autoreativo altera cadeia leve e se torna não autoreativo.", answer:"central", why:"Edição de receptor ocorre na medula óssea (central)."},
  {case:"Reconhecimento de antígeno sem coestímulo leva a T anérgico.", answer:"periferica", why:"Anergia por ausência de B7/CD28 é mecanismo periférico."},
  {case:"Tregs FOXP3+ secretam IL-10 e TGF-β inibindo T efetores.", answer:"periferica", why:"Supressão por Tregs é tolerância periférica."},
  {case:"Expressão de PD-L1 em tecido desliga T via PD-1.", answer:"periferica", why:"Checkpoint PD-1/PD-L1 é periférico."},
  {case:"Célula T autoreativa sofre apoptose via Fas/FasL após ativação repetida.", answer:"periferica", why:"Deleção periférica por via apoptótica."}
];

// Autoimunidade
const autoItems = [
  {text:"Doença de Graves", bucket:"orgao"},
  {text:"Tireoidite de Hashimoto", bucket:"orgao"},
  {text:"Diabetes mellitus tipo 1", bucket:"orgao"},
  {text:"Miastenia gravis", bucket:"orgao"},
  {text:"Esclerose múltipla", bucket:"orgao"},
  {text:"Anemia perniciosa", bucket:"orgao"},
  {text:"Lúpus eritematoso sistêmico (LES)", bucket:"sist"},
  {text:"Artrite reumatoide (AR)", bucket:"sist"},
  {text:"Esclerodermia", bucket:"sist"},
  {text:"Síndrome de Sjögren", bucket:"sist"}
];

// Transplantes — casos para classificar
const txCases = [
  {case:"Rim transplantado torna-se cianótico minutos após reperfusão; biópsia: trombose difusa e necrose hemorrágica.", answer:"hiperaguda", why:"Anticorpos pré-formados (ABO/anti-HLA) ativam complemento → trombose imediata."},
  {case:"Após 10 dias do transplante, creatinina sobe; biópsia: endotelite e infiltrado linfocitário.", answer:"aguda", why:"Resposta T e/ou anticorpos de novo contra HLA do doador."},
  {case:"Meses após o transplante, perda lenta da função; biópsia: fibrose íntima e atrofia intersticial.", answer:"cronica", why:"Rejeição crônica com arteriopatia obliterante."},
  {case:"Fígado transplante: queda abrupta de fluxo biliar em horas com trombose microvascular generalizada.", answer:"hiperaguda", why:"Anticorpos pré-existentes contra antígenos do doador."},
  {case:"Rejeição controlada com pulsoterapia, melhora em poucos dias; padrão compatível com infiltração T.", answer:"aguda", why:"Padrão clássico de rejeição celular aguda."},
  {case:"Estenose progressiva da artéria do enxerto + proteinúria baixa, sem resposta a esteroide.", answer:"cronica", why:"Lesão crônica mediada por remodelação vascular e imunidade de baixo grau."}
];

// ======= Estado & Progresso =======
const state = {
  fcIdx: 0,
  qIdx: 0,
  ddPlaced: [],
  mhcPlaced: [],
  hsIdx: 0,
  tolIdx: 0,
  txIdx: 0,
  score: {quiz:0, dd:0, mhc:0, hs:0, vac:0, tol:0, auto:0, tx:0, comp:0, cyto:0, tact:0, pid:0, drugs:0 }
};

function save(){ localStorage.setItem("imunoPlay", JSON.stringify(state)); renderProgress(); }
function load(){ const s = localStorage.getItem("imunoPlay"); if (s) Object.assign(state, JSON.parse(s)); }

// ======= Navegação por abas =======
$$('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    $$('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const tgt = btn.dataset.target;
    $$('.view').forEach(v=>v.classList.remove('active'));
    $('#'+tgt).classList.add('active');
  });
});

// ======= Flashcards =======
function renderFlashcards(){
  $('#fcTotal').textContent = flashcards.length;
  const card = flashcards[state.fcIdx % flashcards.length];
  $('#fcIndex').textContent = (state.fcIdx % flashcards.length)+1;
  $('#fcFront').textContent = card.q;
  $('#fcBack').textContent = card.a;
  $('#flashcard').classList.remove('flipped');
  $('#fcBack').style.display = 'none';
}
$('#showBack').addEventListener('click', ()=>{
  const b = $('#fcBack'); b.style.display = (b.style.display==='none')?'block':'none';
});
$('#knowBtn').addEventListener('click', ()=>{
  state.fcIdx = (state.fcIdx+1)%flashcards.length; save(); renderFlashcards();
});
$('#dontBtn').addEventListener('click', ()=>{
  const idx = state.fcIdx % flashcards.length;
  const [card] = flashcards.splice(idx,1);
  flashcards.splice((idx+2)% (flashcards.length+1),0,card);
  save(); renderFlashcards();
});
document.addEventListener('keydown', (e)=>{
  if (e.code==='Space' && $('#cards').classList.contains('active')) {
    e.preventDefault(); $('#showBack').click();
  }
});

// ======= Quiz =======
function renderQuiz(){
  $('#qTotal').textContent = quiz.length;
  const item = quiz[state.qIdx];
  $('#qNum').textContent = state.qIdx+1;
  $('#qText').textContent = item.q;
  const box = $('#qOptions'); box.innerHTML = '';
  item.options.forEach((op,i)=>{
    const b=document.createElement('button'); b.textContent=op;
    b.addEventListener('click', ()=>{
      const ok = i===item.answer;
      if (ok) { state.score.quiz++; b.classList.add('correct'); }
      else { b.classList.add('wrong'); }
      $('#qFeedback').textContent = (ok?'Correto! ':'Quase. ')+item.why;
      $$('#quiz .options button').forEach(x=>x.disabled=true);
      save();
    });
    box.appendChild(b);
  });
  $('#qFeedback').textContent='';
}
$('#nextQ').addEventListener('click', ()=>{
  state.qIdx = (state.qIdx+1)%quiz.length; save(); renderQuiz();
});

// ======= Drag & Drop genérico =======
function makeChip(text){
  const li=document.createElement('li'); li.textContent=text; li.className='chip'; li.setAttribute('draggable','true'); li.tabIndex=0;
  li.addEventListener('dragstart', (e)=> e.dataTransfer.setData('text/plain', text));
  li.addEventListener('keydown',(e)=>{ if(e.key==='Enter'){ li.parentElement.classList.contains('bucket')? $('#ddItems').appendChild(li):null; }});
  return li;
}
function setupDrag(){
  $('#ddItems').innerHTML=''; state.ddPlaced=[];
  dragItems.forEach(it=>$('#ddItems').appendChild(makeChip(it.text)));
  $('#ddTotal').textContent = dragItems.length;
  $$('.droptarget').forEach(dst=>{
    dst.addEventListener('dragover', (e)=> e.preventDefault());
    dst.addEventListener('drop', (e)=>{
      e.preventDefault();
      const t = e.dataTransfer.getData('text/plain');
      const chip = [...$$('.chip')].find(c=>c.textContent===t);
      dst.querySelector('.bucket').appendChild(chip);
    });
  });
}
$('#ddCheck').addEventListener('click', ()=>{
  let score=0;
  dragItems.forEach(it=>{
    const inInata = [...$('#bucketInata').children].some(li=>li.textContent===it.text);
    const inAdapt = [...$('#bucketAdapt').children].some(li=>li.textContent===it.text);
    const ok = (it.bucket==='inata' && inInata) || (it.bucket==='adaptativa' && inAdapt);
    if (ok) score++;
  });
  state.score.dd = score; $('#ddScore').textContent = score; save();
});
$('#ddReset').addEventListener('click', setupDrag);

// ======= MHC (drag) =======
function setupMHC(){
  $('#mhcItems').innerHTML=''; state.mhcPlaced=[];
  mhcItems.forEach(it=>$('#mhcItems').appendChild(makeChip(it.text)));
  $('#mhcTotal').textContent = mhcItems.length;
  ['I','II'].forEach(k=>{
    const dst = document.querySelector(`[data-bucket="${k}"]`);
    dst.addEventListener('dragover', (e)=> e.preventDefault());
    dst.addEventListener('drop', (e)=>{
      e.preventDefault();
      const t = e.dataTransfer.getData('text/plain');
      const chip = [...$$('.chip')].find(c=>c.textContent===t);
      dst.querySelector('.bucket').appendChild(chip);
    });
  });
}
$('#mhcCheck').addEventListener('click', ()=>{
  let score=0;
  mhcItems.forEach(it=>{
    const inI = [...$('#bucketI').children].some(li=>li.textContent===it.text);
    const inII = [...$('#bucketII').children].some(li=>li.textContent===it.text);
    const ok = (it.bucket==='I' && inI) || (it.bucket==='II' && inII);
    if (ok) score++;
  });
  state.score.mhc = score; $('#mhcScore').textContent = score; save();
});
$('#mhcReset').addEventListener('click', setupMHC);

// ======= Hipersensibilidade =======
function renderHyper(){
  $('#hsTotal').textContent = hypers.length;
  const h = hypers[state.hsIdx];
  $('#hsNum').textContent = state.hsIdx+1;
  $('#hsCase').textContent = h.case;
  const box = $('#hsOptions'); box.innerHTML='';
  ["I","II","III","IV"].forEach((tipo)=>{
    const b=document.createElement('button'); b.textContent='Tipo '+tipo;
    b.addEventListener('click', ()=>{
      const ok = (tipo===h.answer);
      if (ok){ state.score.hs++; b.classList.add('correct'); }
      else b.classList.add('wrong');
      $('#hsFeedback').textContent = (ok?'Correto! ':'Não exatamente. ')+h.why;
      $$('#hyper .options button').forEach(x=>x.disabled=true);
      save();
    });
    box.appendChild(b);
  });
  $('#hsFeedback').textContent='';
}
$('#hsNext').addEventListener('click', ()=>{
  state.hsIdx = (state.hsIdx+1)%hypers.length; save(); renderHyper();
});

// ======= Vacinas =======
function setupVac(){
  const list = $('#vacItems'); if(!list) return;
  list.innerHTML='';
  vacItems.forEach(it=> list.appendChild(makeChip(it.text)) );
  $('#vacTotal').textContent = vacItems.length;

  ['aten','inativ','sub','mrna','vetor','vlp'].forEach(k=>{
    const dst = document.querySelector(`[data-bucket="${k}"]`);
    if(!dst) return;
    dst.addEventListener('dragover', e=>e.preventDefault());
    dst.addEventListener('drop', e=>{
      e.preventDefault();
      const t = e.dataTransfer.getData('text/plain');
      const chip = [...$$('.chip')].find(c=>c.textContent===t);
      dst.querySelector('.bucket').appendChild(chip);
    });
  });
}
$('#vacCheck')?.addEventListener('click', ()=>{
  let score = 0;
  vacItems.forEach(it=>{
    const bucketId = {aten:'#bucketAten', inativ:'#bucketInativ', sub:'#bucketSub', mrna:'#bucketMrna', vetor:'#bucketVetor', vlp:'#bucketVlp'}[it.bucket];
    const inRight = [...document.querySelector(bucketId).children].some(li=>li.textContent===it.text);
    if (inRight) score++;
  });
  state.score.vac = score; $('#vacScore').textContent = score; save();
});
$('#vacReset')?.addEventListener('click', setupVac);

// Simulador de títulos
let vacTiterVal = 0; let anim = null;
function animateTiter(target){
  const bar = $('#vacTiter'); if(!bar) return;
  clearInterval(anim);
  anim = setInterval(()=>{
    vacTiterVal += (target - vacTiterVal) * 0.15;
    if (Math.abs(target - vacTiterVal) < 0.5){ vacTiterVal = target; clearInterval(anim); }
    bar.style.width = Math.max(0, Math.min(100, vacTiterVal)) + '%';
  }, 60);
}
function applyDose(mult){
  const adju = $('#adjuvante')?.checked ? 1.4 : 1.0;
  const delta = 28 * mult * adju;
  const target = Math.min(100, vacTiterVal + delta);
  animateTiter(target);
}
$('#dose1')?.addEventListener('click', ()=> applyDose(1));
$('#dose2')?.addEventListener('click', ()=> applyDose(2));

// ======= Tolerância =======
function renderTol(){
  if (!$('#tolCase')) return;
  $('#tolTotal').textContent = tolCases.length;
  const item = tolCases[state.tolIdx % tolCases.length];
  $('#tolNum').textContent = (state.tolIdx % tolCases.length)+1;
  $('#tolCase').textContent = item.case;
  const box = $('#tolOptions'); box.innerHTML='';
  [['Central','central'], ['Periférica','periferica']].forEach(([label,val])=>{
    const b = document.createElement('button'); b.textContent = label;
    b.addEventListener('click', ()=>{
      const ok = (val===item.answer);
      if(ok){ state.score.tol++; b.classList.add('correct'); }
      else { b.classList.add('wrong'); }
      $('#tolFeedback').textContent = (ok?'Correto! ':'Quase. ')+item.why;
      $$('#tol .options button').forEach(x=>x.disabled=true);
      $('#tolScore').textContent = state.score.tol;
      save();
    });
    box.appendChild(b);
  });
  $('#tolFeedback').textContent='';
}
$('#tolNext')?.addEventListener('click', ()=>{
  state.tolIdx = (state.tolIdx+1)%tolCases.length; save(); renderTol();
});
let tolStep = 0;
$('#tolAnim')?.addEventListener('click', ()=>{
  const steps = [...$('#tolFlow')?.children || []];
  steps.forEach(li=>li.classList.remove('glow'));
  if (steps.length===0) return;
  steps[tolStep % steps.length].classList.add('glow');
  tolStep++;
});

// ======= Autoimunidade =======
function setupAuto(){
  const list = $('#autoItems'); if(!list) return;
  list.innerHTML = '';
  autoItems.forEach(it=> list.appendChild(makeChip(it.text)) );
  $('#autoTotal').textContent = autoItems.length;

  ['orgao','sist'].forEach(k=>{
    const dst = document.querySelector(`[data-bucket="${k}"]`);
    if(!dst) return;
    dst.addEventListener('dragover', e=>e.preventDefault());
    dst.addEventListener('drop', e=>{
      e.preventDefault();
      const t = e.dataTransfer.getData('text/plain');
      const chip = [...$$('.chip')].find(c=>c.textContent===t);
      dst.querySelector('.bucket').appendChild(chip);
    });
  });
}
$('#autoCheck')?.addEventListener('click', ()=>{
  let score=0;
  autoItems.forEach(it=>{
    const bucketId = it.bucket==='orgao' ? '#bucketOrgao' : '#bucketSist';
    const ok = [...document.querySelector(bucketId).children].some(li=>li.textContent===it.text);
    if (ok) score++;
  });
  state.score.auto = score; $('#autoScore').textContent = score; save();
});
$('#autoReset')?.addEventListener('click', setupAuto);

// ======= Transplantes =======
function renderTx(){
  if (!$('#txCase')) return;
  $('#txTotal').textContent = txCases.length;
  const item = txCases[state.txIdx % txCases.length];
  $('#txNum').textContent = (state.txIdx % txCases.length)+1;
  $('#txCase').textContent = item.case;
  const box = $('#txOptions'); box.innerHTML='';
  [["Hiperaguda","hiperaguda"],["Aguda","aguda"],["Crônica","cronica"]].forEach(([label,val])=>{
    const b=document.createElement('button'); b.textContent=label;
    b.addEventListener('click', ()=>{
      const ok = (val===item.answer);
      if (ok){ state.score.tx++; b.classList.add('correct'); }
      else { b.classList.add('wrong'); }
      $('#txFeedback').textContent = (ok?'Correto! ':'Quase. ')+item.why;
      $$('#tx .options button').forEach(x=>x.disabled=true);
      $('#txScore').textContent = state.score.tx;
      save();
    });
    box.appendChild(b);
  });
  $('#txFeedback').textContent='';
}
$('#txNext')?.addEventListener('click', ()=>{
  state.txIdx = (state.txIdx+1)%txCases.length; save(); renderTx();
});

// crossmatch simples
$('#txSim')?.addEventListener('click', ()=>{
  const abo = $('#txABO')?.checked;
  const anti = $('#txAntiHLA')?.checked;
  const risk = (abo || anti) ? "Crossmatch POSITIVO → alto risco de rejeição hiperaguda." : "Crossmatch NEGATIVO → procede (ainda precisa compatibilidade HLA e imunossupressão).";
  $('#txRisk').textContent = risk;
});

// ======= Tumores (cards) =======
function renderTumors(){
  const grid = $('#tumorGrid'); grid.innerHTML='';
  tumorCards.forEach(c=>{
    const div = document.createElement('div');
    div.className='card';
    div.innerHTML = `<h3>${c.title}</h3><p>${c.text}</p><span class="pill">${c.tag}</span>`;
    grid.appendChild(div);
  });
}

// ======= Progresso =======
function renderProgress(){
 const totals = {
  quiz: quiz.length,
  dd: dragItems.length,
  mhc: mhcItems.length,
  hs: hypers.length,
  vac: vacItems.length,
  tol: tolCases.length,
  auto: autoItems.length,
  tx: txCases.length,
  comp: typeof compItems!=='undefined' ? compItems.length : 0,
  cyto: typeof cytoItems!=='undefined' ? cytoItems.length : 0,
  tact: typeof tactCases!=='undefined' ? tactCases.length : 0,
  pid: typeof pidItems!=='undefined' ? pidItems.length : 0,
  drugs: typeof drugsItems!=='undefined' ? drugsItems.length : 0
};
  const parts = Object.keys(totals);
  const sum = parts.reduce((acc,k)=>{
    const num = (state.score[k]||0);
    return acc + (num / totals[k]);
  }, 0);
  const percent = Math.round(100 * (sum / parts.length));
  $('#progressBar').style.width = Math.max(0, Math.min(100, percent)) + '%';
  $('#progressText').textContent = `${percent}% concluído`;
}

// ======= Preferências de acessibilidade =======
$('#contrastBtn').addEventListener('click', ()=>{
  const pressed = $('body').classList.toggle('contrast');
  $('#contrastBtn').setAttribute('aria-pressed', pressed);
});
$('#fontsizeBtn').addEventListener('click', ()=>{
  const pressed = $('body').classList.toggle('bigfont');
  $('#fontsizeBtn').setAttribute('aria-pressed', pressed);
});
$('#resetBtn').addEventListener('click', ()=>{
  localStorage.removeItem('imunoPlay');
  location.reload();
});

// ======= Inicialização =======
function init(){
  load();
  renderFlashcards();
  renderQuiz();
  setupDrag();
  setupMHC();
  renderHyper();
  setupVac();
  renderTol();
  setupAuto();
  renderTx();
  renderTumors();
  renderProgress();
  setupComp();
setupCyto();
renderTact();
setupPID();
setupDrugs();

$('#compScore').textContent = state.score.comp||0;
$('#cytoScore').textContent = state.score.cyto||0;
$('#tactScore').textContent = state.score.tact||0;
$('#pidScore').textContent = state.score.pid||0;
$('#drugsScore').textContent = state.score.drugs||0;
  // pré-exibir pontuações
  $('#ddScore').textContent = state.score.dd||0;
  $('#mhcScore').textContent = state.score.mhc||0;
  $('#vacScore').textContent = state.score.vac||0;
  $('#tolScore').textContent = state.score.tol||0;
  $('#autoScore').textContent = state.score.auto||0;
  $('#txScore').textContent = state.score.tx||0;
}
document.addEventListener('DOMContentLoaded', init);

// Complemento
const compItems = [
  {text:"C1qrs", bucket:"clas"},
  {text:"C4", bucket:"clas"},
  {text:"C2", bucket:"clas"},
  {text:"MBL (lectina)", bucket:"lect"},
  {text:"MASP-1/2", bucket:"lect"},
  {text:"Fator B", bucket:"alt"},
  {text:"Fator D", bucket:"alt"},
  {text:"Properdina (P)", bucket:"alt"},
  {text:"C3 convertase (C4b2a)", bucket:"clas"},
  {text:"C3 convertase (C3bBb)", bucket:"alt"},
  {text:"C5 convertase (C4b2a3b)", bucket:"clas"},
  {text:"C5 convertase (C3bBb3b)", bucket:"alt"}
];

// Citocinas & Perfis Th
const cytoItems = [
  {text:"IFN-γ", bucket:"th1"},
  {text:"IL-12", bucket:"th1"},
  {text:"IL-4", bucket:"th2"},
  {text:"IL-5", bucket:"th2"},
  {text:"IL-13", bucket:"th2"},
  {text:"IL-17A", bucket:"th17"},
  {text:"IL-22", bucket:"th17"},
  {text:"IL-23", bucket:"th17"},
  {text:"TGF-β", bucket:"treg"},
  {text:"IL-10", bucket:"treg"},
  {text:"IL-2", bucket:"treg"}
];

// Ativação T (Sinais 1–3)
const tactCases = [
  {case:"TCR reconhece peptídeo-MHC sem B7 na APC.", answer:"anergia", why:"Sinal 1 sem Sinal 2 (CD28–B7) leva a anergia."},
  {case:"Interação CD28 (T) – B7 (APC).", answer:"s2", why:"É o Sinal 2 (coestímulo)."},
  {case:"Citocinas polarizadoras (IL-12/IL-4/IL-6+TGF-β) dirigem o destino Th.", answer:"s3", why:"É o Sinal 3."},
  {case:"Ipilimumabe (anti-CTLA-4) remove freio no priming em linfonodo.", answer:"s2", why:"Modula o eixo do coestímulo (Sinal 2)."},
  {case:"PD-1/PD-L1 reduz função efetora em tecido inflamadado.", answer:"anergia", why:"Checkpoint/exaustão funcional em periferia."},
  {case:"Superexpressão de B7 pela APC aumenta ativação T.", answer:"s2", why:"Mais coestímulo = Sinal 2 mais forte."}
];

// Imunodeficiências
const pidItems = [
  {text:"XLA — Agamaglobulinemia de Bruton (BTK)", bucket:"bcell"},
  {text:"Síndrome Hiper-IgM (def. CD40L)", bucket:"bcell"},
  {text:"SCID por deficiência de ADA", bucket:"tcell"},
  {text:"Síndrome de DiGeorge", bucket:"tcell"},
  {text:"CGD — Doença granulomatosa crônica (NADPH)", bucket:"phago"},
  {text:"LAD-1 — Def. adesão leucocitária (CD18)", bucket:"phago"},
  {text:"Deficiência de C5–C9 (MAC)", bucket:"comp"},
  {text:"Deficiência de C3", bucket:"comp"},
  {text:"HIV/AIDS", bucket:"sec"},
  {text:"Imunossupressão por quimioterapia/corticoide", bucket:"sec"}
];

// Imunossupressores
const drugsItems = [
  {text:"Tacrolimo", bucket:"cni"},
  {text:"Ciclosporina", bucket:"cni"},
  {text:"Sirolimo", bucket:"mtor"},
  {text:"Everolimo", bucket:"mtor"},
  {text:"Micofenolato mofetil (MMF)", bucket:"antimeta"},
  {text:"Azatioprina", bucket:"antimeta"},
  {text:"Prednisona", bucket:"cort"},
  {text:"Abatacepte (CTLA4-Ig)", bucket:"coest"},
  {text:"Rituximabe", bucket:"antiCD20"},
  {text:"Infliximabe", bucket:"antiTNF"},
  {text:"Adalimumabe", bucket:"antiTNF"}
];
// ======= Complemento (drag) =======
function setupComp(){
  const list = $('#compItems'); if(!list) return;
  list.innerHTML='';
  compItems.forEach(it=> list.appendChild(makeChip(it.text)) );
  $('#compTotal').textContent = compItems.length;
  ['clas','lect','alt'].forEach(k=>{
    const dst = document.querySelector(`[data-bucket="${k}"]`);
    if(!dst) return;
    dst.addEventListener('dragover', e=>e.preventDefault());
    dst.addEventListener('drop', e=>{
      e.preventDefault();
      const t = e.dataTransfer.getData('text/plain');
      const chip = [...$$('.chip')].find(c=>c.textContent===t);
      dst.querySelector('.bucket').appendChild(chip);
    });
  });
}
$('#compCheck')?.addEventListener('click', ()=>{
  let score = 0;
  compItems.forEach(it=>{
    const bucketId = {clas:'#bucketClas', lect:'#bucketLect', alt:'#bucketAlt'}[it.bucket];
    const ok = [...document.querySelector(bucketId).children].some(li=>li.textContent===it.text);
    if (ok) score++;
  });
  state.score.comp = score; $('#compScore').textContent = score; save();
});
$('#compReset')?.addEventListener('click', setupComp);

// ======= Citocinas (drag) =======
function setupCyto(){
  const list = $('#cytoItems'); if(!list) return;
  list.innerHTML='';
  cytoItems.forEach(it=> list.appendChild(makeChip(it.text)) );
  $('#cytoTotal').textContent = cytoItems.length;
  ['th1','th2','th17','treg'].forEach(k=>{
    const dst = document.querySelector(`[data-bucket="${k}"]`);
    if(!dst) return;
    dst.addEventListener('dragover', e=>e.preventDefault());
    dst.addEventListener('drop', e=>{
      e.preventDefault();
      const t = e.dataTransfer.getData('text/plain');
      const chip = [...$$('.chip')].find(c=>c.textContent===t);
      dst.querySelector('.bucket').appendChild(chip);
    });
  });
}
$('#cytoCheck')?.addEventListener('click', ()=>{
  let score = 0;
  cytoItems.forEach(it=>{
    const bucketId = {th1:'#bucketTh1', th2:'#bucketTh2', th17:'#bucketTh17', treg:'#bucketTreg'}[it.bucket];
    const ok = [...document.querySelector(bucketId).children].some(li=>li.textContent===it.text);
    if (ok) score++;
  });
  state.score.cyto = score; $('#cytoScore').textContent = score; save();
});
$('#cytoReset')?.addEventListener('click', setupCyto);

// ======= Ativação T (quiz) =======
function renderTact(){
  if (!$('#tactCase')) return;
  $('#tactTotal').textContent = tactCases.length;
  const item = tactCases[state.tactIdx % tactCases.length];
  $('#tactNum').textContent = (state.tactIdx % tactCases.length)+1;
  $('#tactCase').textContent = item.case;
  const box = $('#tactOptions'); box.innerHTML='';
  [["Sinal 1","s1"], ["Sinal 2 (coestímulo)","s2"], ["Sinal 3 (citocinas)","s3"], ["Anergia/Exaustão","anergia"]].forEach(([label,val])=>{
    const b=document.createElement('button'); b.textContent=label;
    b.addEventListener('click', ()=>{
      const ok = (val===item.answer);
      if (ok){ state.score.tact++; b.classList.add('correct'); }
      else { b.classList.add('wrong'); }
      $('#tactFeedback').textContent = (ok?'Boa! ':'Quase. ')+item.why;
      $$('#tact .options button').forEach(x=>x.disabled=true);
      $('#tactScore').textContent = state.score.tact;
      save();
    });
    box.appendChild(b);
  });
  $('#tactFeedback').textContent='';
}
$('#tactNext')?.addEventListener('click', ()=>{
  state.tactIdx = (state.tactIdx+1)%tactCases.length; save(); renderTact();
});

// ======= Imunodeficiências (drag) =======
function setupPID(){
  const list = $('#pidItems'); if(!list) return;
  list.innerHTML='';
  pidItems.forEach(it=> list.appendChild(makeChip(it.text)) );
  $('#pidTotal').textContent = pidItems.length;
  ['bcell','tcell','phago','comp','sec'].forEach(k=>{
    const dst = document.querySelector(`[data-bucket="${k}"]`);
    if(!dst) return;
    dst.addEventListener('dragover', e=>e.preventDefault());
    dst.addEventListener('drop', e=>{
      e.preventDefault();
      const t = e.dataTransfer.getData('text/plain');
      const chip = [...$$('.chip')].find(c=>c.textContent===t);
      dst.querySelector('.bucket').appendChild(chip);
    });
  });
}
$('#pidCheck')?.addEventListener('click', ()=>{
  let score=0;
  pidItems.forEach(it=>{
    const bucketId = {
      bcell:'#bucketPidB', tcell:'#bucketPidT', phago:'#bucketPidFag',
      comp:'#bucketPidComp', sec:'#bucketPidSec'
    }[it.bucket];
    const ok = [...document.querySelector(bucketId).children].some(li=>li.textContent===it.text);
    if (ok) score++;
  });
  state.score.pid = score; $('#pidScore').textContent = score; save();
});
$('#pidReset')?.addEventListener('click', setupPID);

// ======= Imunossupressores (drag) =======
function setupDrugs(){
  const list = $('#drugsItems'); if(!list) return;
  list.innerHTML='';
  drugsItems.forEach(it=> list.appendChild(makeChip(it.text)) );
  $('#drugsTotal').textContent = drugsItems.length;
  ['cni','mtor','antimeta','cort','coest','antiCD20','antiTNF'].forEach(k=>{
    const dst = document.querySelector(`[data-bucket="${k}"]`);
    if(!dst) return;
    dst.addEventListener('dragover', e=>e.preventDefault());
    dst.addEventListener('drop', e=>{
      e.preventDefault();
      const t = e.dataTransfer.getData('text/plain');
      const chip = [...$$('.chip')].find(c=>c.textContent===t);
      dst.querySelector('.bucket').appendChild(chip);
    });
  });
}
$('#drugsCheck')?.addEventListener('click', ()=>{
  let score=0;
  drugsItems.forEach(it=>{
    const bucketId = {
      cni:'#bucketCni', mtor:'#bucketMtor', antimeta:'#bucketAntiMeta',
      cort:'#bucketCort', coest:'#bucketCoest', antiCD20:'#bucketAntiCD20', antiTNF:'#bucketAntiTNF'
    }[it.bucket];
    const ok = [...document.querySelector(bucketId).children].some(li=>li.textContent===it.text);
    if (ok) score++;
  });
  state.score.drugs = score; $('#drugsScore').textContent = score; save();
});
$('#drugsReset')?.addEventListener('click', setupDrugs);

