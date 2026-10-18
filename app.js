/* Tempo de Viver 360X — interações (estado só em memória) */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ---------- Header / navegação ---------- */
  const header = document.querySelector('.header');
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');

  const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && nav) {
    const setMenuOpen = (open) => {
      nav.setAttribute('data-open', String(open));
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };

    setMenuOpen(false);
    toggle.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === 'true';
      setMenuOpen(!open);
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => setMenuOpen(false))
    );
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        setMenuOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100) setMenuOpen(false);
    }, { passive: true });
  }

  /* Seção atual no menu */
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            navLinks.forEach((a) =>
              a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false')
            );
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* Reveal progressivo */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            ro.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Bússola do viver ---------- */
  // Catálogo de experiências. cost: 0 = grátis, 1 = até R$ 50, 2 = até R$ 200, 3 = acima.
  // energy: 1 baixa, 2 média, 3 alta. company: 'solo' | 'group' | 'both'. minutes: duração típica.
  const CATALOG = [
    { t: 'Dez minutos de música que você escolhe, sem fazer mais nada', d: 'Fones ou caixa de som, luz baixa, uma faixa inteira do começo ao fim. Sem celular na mão.', tags: ['musica', 'descanso'], minutes: 10, cost: 0, energy: 1, company: 'solo', prep: 'Nenhuma' },
    { t: 'Caminhada curta prestando atenção em três coisas vivas', d: 'Uma árvore, um pássaro, uma planta no muro. Volte quando perder o interesse.', tags: ['natureza', 'movimento', 'descanso'], minutes: 20, cost: 0, energy: 2, company: 'both', prep: 'Calçado confortável' },
    { t: 'Jogo que já está no seu celular ou videogame, com fim definido', d: 'Uma partida ou uma fase. O limite é o que transforma o jogo em descanso, e não em fuga.', tags: ['jogos', 'descanso'], minutes: 30, cost: 0, energy: 1, company: 'solo', prep: 'Nenhuma' },
    { t: 'Noite de jogos de mesa com duas ou três pessoas próximas', d: 'Um jogo simples que todos já conhecem. Quem chega cansado pode só assistir e conversar.', tags: ['jogos', 'conversa'], minutes: 120, cost: 0, energy: 2, company: 'group', prep: 'Convite com um dia de antecedência' },
    { t: 'Ligação de voz de quinze minutos para alguém de quem você sente falta', d: 'Sem pauta. Começa com “lembrei de você” e termina quando terminar.', tags: ['conversa'], minutes: 15, cost: 0, energy: 1, company: 'group', prep: 'Nenhuma' },
    { t: 'Café ou lanche fora de casa com uma pessoa só', d: 'Lugar perto, horário curto, conversa sem compromisso de resolver nada.', tags: ['conversa', 'comida'], minutes: 60, cost: 1, energy: 2, company: 'group', prep: 'Combinar lugar e hora' },
    { t: 'Capítulo de um livro que você começou e abandonou', d: 'Retomar de onde parou, sem releitura. Se não prender em dez páginas, trocar sem culpa.', tags: ['leitura', 'descanso'], minutes: 30, cost: 0, energy: 1, company: 'solo', prep: 'Nenhuma' },
    { t: 'Escrever uma história curta do Reaverso', d: 'Um personagem, um lugar, um pequeno problema. Pode ditar por voz. Não precisa mostrar a ninguém.', tags: ['criar', 'descanso'], minutes: 30, cost: 0, energy: 2, company: 'solo', prep: 'Papel ou aplicativo de notas' },
    { t: 'Cozinhar uma receita simples com música ligada', d: 'Algo que você já sabe fazer, sem pressa. O prato é desculpa; o processo é a experiência.', tags: ['comida', 'criar', 'musica'], minutes: 60, cost: 1, energy: 2, company: 'both', prep: 'Ingredientes da despensa' },
    { t: 'Trinta minutos de sol em praça, parque ou calçada', d: 'Sentar, observar, não produzir nada. Levar água.', tags: ['natureza', 'descanso'], minutes: 30, cost: 0, energy: 1, company: 'both', prep: 'Protetor solar e água' },
    { t: 'Aula experimental de algo que você nunca tentou', d: 'Dança, cerâmica, escalada, instrumento. Uma aula só, sem matrícula, para ver se a curiosidade continua.', tags: ['aprender', 'movimento', 'criar'], minutes: 90, cost: 2, energy: 3, company: 'group', prep: 'Procurar turma experimental perto de casa' },
    { t: 'Trilha leve ou banho de rio/mar em grupo', d: 'Percurso conhecido, saída cedo, volta antes do cansaço. Combinar quem leva o quê.', tags: ['natureza', 'movimento'], minutes: 240, cost: 1, energy: 3, company: 'group', prep: 'Transporte, água, lanche' },
    { t: 'Sessão de alongamento ou movimento livre com uma playlist', d: 'Dez a vinte minutos no chão da sala. Sem meta de desempenho.', tags: ['movimento', 'musica', 'descanso'], minutes: 20, cost: 0, energy: 2, company: 'solo', prep: 'Espaço no chão' },
    { t: 'Tarde em biblioteca, livraria ou centro cultural', d: 'Entrar sem lista. Folhear, sentar, sair quando quiser.', tags: ['leitura', 'aprender', 'descanso'], minutes: 120, cost: 0, energy: 2, company: 'both', prep: 'Conferir horário de funcionamento' },
    { t: 'Documentário ou vídeo longo sobre um assunto que você adia', d: 'Escolher antes de sentar, para não gastar o tempo rolando catálogo.', tags: ['aprender', 'descanso'], minutes: 60, cost: 0, energy: 1, company: 'both', prep: 'Escolher o título com antecedência' },
    { t: 'Desenhar, pintar ou montar algo com as mãos', d: 'Papel sulfite e caneta bastam. O objetivo é a atenção ocupada, não o resultado.', tags: ['criar', 'descanso'], minutes: 40, cost: 0, energy: 2, company: 'solo', prep: 'Material que já existe em casa' },
    { t: 'Show, peça ou cinema com uma pessoa', d: 'Programa com hora para começar e terminar, o que facilita encaixar na agenda.', tags: ['musica', 'conversa', 'criar'], minutes: 180, cost: 2, energy: 2, company: 'group', prep: 'Ingresso e deslocamento' },
    { t: 'Tocar ou cantar algo, mesmo mal', d: 'Instrumento guardado, aplicativo de piano ou só a voz. Cinco minutos já contam.', tags: ['musica', 'criar'], minutes: 15, cost: 0, energy: 2, company: 'solo', prep: 'Nenhuma' },
    { t: 'Almoço de domingo com família ou amigos, sem celular na mesa', d: 'Pode ser simples. A regra do celular é o que muda a qualidade da conversa.', tags: ['comida', 'conversa'], minutes: 150, cost: 1, energy: 2, company: 'group', prep: 'Combinar com antecedência' },
    { t: 'Viagem curta de um dia para uma cidade ou praia próxima', d: 'Sair cedo, voltar à noite. Um roteiro só: um lugar para comer e um para ficar.', tags: ['natureza', 'conversa', 'comida'], minutes: 600, cost: 3, energy: 3, company: 'both', prep: 'Transporte e um ponto de parada escolhido' },
    { t: 'Cochilo de vinte minutos com alarme', d: 'Descanso também é experiência. Deitar, alarme em vinte minutos, sem culpa.', tags: ['descanso'], minutes: 20, cost: 0, energy: 1, company: 'solo', prep: 'Nenhuma' },
    { t: 'Aprender uma habilidade pequena com um tutorial curto', d: 'Um nó, uma receita, um acorde, uma função de planilha. Praticar uma vez e parar.', tags: ['aprender', 'criar'], minutes: 30, cost: 0, energy: 2, company: 'solo', prep: 'Escolher o tutorial antes' },
  ];

  const TAG_LABEL = {
    natureza: 'natureza', jogos: 'jogos', musica: 'música', leitura: 'leitura', criar: 'criar',
    conversa: 'conversa', movimento: 'movimento', descanso: 'descanso', aprender: 'aprender', comida: 'comida',
  };
  const COST_LABEL = ['R$ 0', 'até R$ 50', 'até R$ 200', 'acima de R$ 200'];
  const ENERGY_LABEL = { 1: 'energia baixa', 2: 'energia média', 3: 'energia alta' };

  function fmtMinutes(m) {
    if (m < 60) return m + ' min';
    const h = Math.floor(m / 60), r = m % 60;
    return r ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`;
  }

  const compassForm = document.getElementById('compass-form');
  if (compassForm) {
    const results = document.getElementById('compass-results');
    const list = document.getElementById('compass-list');
    const note = document.getElementById('compass-note');

    compassForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fd = new FormData(compassForm);
      const minutes = Number(fd.get('minutes'));
      const budget = Number(fd.get('budget'));
      const energy = Number(fd.get('energy'));
      const company = fd.get('company');
      const interests = fd.getAll('interest');

      const scored = CATALOG.map((item) => {
        let s = 0;
        // Interesses: peso principal
        const matches = item.tags.filter((t) => interests.includes(t)).length;
        s += matches * 3;
        if (interests.length && matches === 0) s -= 2;
        // Tempo: precisa caber
        if (item.minutes <= minutes) s += 2; else if (item.minutes <= minutes * 1.5) s -= 1; else return null;
        // Orçamento: nunca sugerir acima
        if (item.cost <= budget) s += 1; else s -= 8;
        // Energia: não exigir mais do que a pessoa tem
        if (item.energy <= energy) s += 1; else s -= 4;
        // Companhia
        if (company === 'both' || item.company === 'both' || item.company === company) s += 1; else s -= 3;
        // Pequena variação para evitar empates idênticos
        s += Math.random() * 0.5;
        return { item, s };
      })
        .filter((x) => x && x.s > -2)
        .sort((a, b) => b.s - a.s)
        .slice(0, 3);

      list.innerHTML = '';
      if (!scored.length) {
        list.innerHTML = '<p class="muted small">Nenhuma opção coube nesses limites. Tente aumentar o tempo ou marcar outros interesses. Descansar também conta.</p>';
      } else {
        scored.forEach(({ item }, i) => {
          const el = document.createElement('article');
          el.className = 'suggestion';
          el.innerHTML = `
            <div class="suggestion__idx">${i + 1}</div>
            <div>
              <h4>${item.t}</h4>
              <p>${item.d}</p>
              <div class="suggestion__meta">
                <span>${fmtMinutes(item.minutes)}</span>
                <span>${COST_LABEL[item.cost]}</span>
                <span>${ENERGY_LABEL[item.energy]}</span>
                <span>preparo: ${item.prep}</span>
                <span>${item.tags.map((t) => TAG_LABEL[t]).join(', ')}</span>
              </div>
            </div>`;
          list.appendChild(el);
        });
      }
      note.textContent = 'Sugestões geradas aqui mesmo, no seu navegador, a partir do que você marcou. Nada é enviado nem guardado. Escolha uma, ignore as outras ou peça de novo.';
      results.hidden = false;
      results.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'nearest',
      });
    });

    document.getElementById('compass-again')?.addEventListener('click', () => {
      compassForm.requestSubmit();
    });
  }

  /* ---------- Calculadora capital → tempo ---------- */
  const calc = document.getElementById('calc');
  if (calc) {
    const price = calc.querySelector('#calc-price');
    const income = calc.querySelector('#calc-income');
    const hours = calc.querySelector('#calc-hours');
    const big = calc.querySelector('#calc-big');
    const txt = calc.querySelector('#calc-text');
    const checks = calc.querySelectorAll('.check input');
    const verdict = calc.querySelector('#calc-verdict');

    const fmtBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

    function update() {
      const p = Number(price.value) || 0;
      const inc = Number(income.value) || 0;
      const h = Number(hours.value) || 0;
      const perHour = inc > 0 && h > 0 ? inc / h : 0;
      if (!p || !perHour) {
        big.innerHTML = '—';
        txt.textContent = 'Preencha os três campos para ver quantas horas de trabalho esse valor representa.';
      } else {
        const workHours = p / perHour;
        const days = workHours / (h / 22);
        big.innerHTML = `${workHours.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}<small>horas de trabalho</small>`;
        txt.textContent = `Com renda líquida de ${fmtBRL(perHour)} por hora, ${fmtBRL(p)} equivalem a cerca de ${workHours.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} horas trabalhadas (aproximadamente ${days.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} dias úteis). O cálculo mostra o esforço envolvido; não mede o seu valor nem precisa ser aplicado a cada minuto de descanso.`;
      }
      const okCount = Array.from(checks).filter((c) => c.checked).length;
      if (okCount === 3) {
        verdict.dataset.ok = 'true';
        verdict.textContent = 'As três verificações passaram. Se o valor for alto, dê um intervalo de reflexão antes de decidir e compare com o que você já tem.';
      } else if (okCount === 0) {
        verdict.dataset.ok = 'false';
        verdict.textContent = 'Marque as verificações que se aplicam. Uma compra que falha em qualquer uma delas merece esperar.';
      } else {
        verdict.dataset.ok = 'false';
        verdict.textContent = `${okCount} de 3 verificações. Falta pelo menos uma: provavelmente é sinal de adiar, reduzir ou trocar por algo já disponível.`;
      }
    }
    [price, income, hours].forEach((el) => el.addEventListener('input', update));
    checks.forEach((c) => c.addEventListener('change', update));
    update();
  }

  /* ---------- Revisão semanal ---------- */
  const weekly = document.getElementById('weekly');
  if (weekly) {
    const HINTS = {
      tempo: ['Pouco tempo que pareceu seu. Vale olhar a agenda da semana que vem e proteger um bloco pequeno.', 'Houve algum espaço. Dá para repetir o que o criou.', 'Tempo seu apareceu com regularidade. Mantenha o que já funciona.'],
      prazer: ['Pouca coisa fez bem. Troque a experiência, não a si mesmo.', 'Algo fez bem. Anote o que foi para repetir.', 'Boas experiências. Cuidado só para não virarem obrigação.'],
      vinculos: ['Pouco acolhimento. Uma ligação curta já conta para a próxima semana.', 'Houve contato bom. Repetir é mais fácil que começar.', 'Vínculos presentes. Preserve-os sem transformar em compromisso pesado.'],
      sustent: ['Pesou nos recursos ou nas responsabilidades. Voltar às opções gratuitas é parte do método.', 'Coube com algum aperto. Vale ajustar o custo ou a frequência.', 'Coube bem. Esse é o nível para manter.'],
      carga: ['Organizar virou mais uma obrigação. Simplifique o registro ou pause.', 'A organização ajudou em parte. Retire o que não serve.', 'A organização ajudou. Continue leve.'],
    };
    weekly.querySelectorAll('input[type="range"]').forEach((r) => {
      const out = weekly.querySelector(`[data-out="${r.name}"]`);
      const hint = weekly.querySelector(`[data-hint="${r.name}"]`);
      const upd = () => {
        const v = Number(r.value);
        out.textContent = v;
        const idx = v <= 3 ? 0 : v <= 7 ? 1 : 2;
        hint.textContent = HINTS[r.name][idx];
      };
      r.addEventListener('input', upd);
      upd();
    });
  }

  /* ---------- Copiar prompt ---------- */
  const copyBtn = document.getElementById('copy-prompt');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const txt = document.getElementById('prompt-text').textContent;
      try {
        await navigator.clipboard.writeText(txt);
        copyBtn.textContent = 'Copiado';
      } catch (e) {
        const range = document.createRange();
        range.selectNodeContents(document.getElementById('prompt-text'));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        copyBtn.textContent = 'Selecionado — use Ctrl/Cmd+C';
      }
      setTimeout(() => (copyBtn.textContent = 'Copiar prompt'), 2500);
    });
  }

  /* Ano no rodapé */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
