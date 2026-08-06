/**
 * Contenuto della pagina /strumenti/famag-grilletta/.
 *
 * Le informazioni sono le stesse della scheda «Strumenti del Mestiere» in
 * homepage (index.html, sezione #strumenti): questa pagina le estende senza
 * contraddirle. Niente numeri nuovi senza fonte.
 */

export const CONTENUTO = {
  slug: 'famag-grilletta',
  nome: 'Famag Grilletta IM 5/230 HH',
  categoria: 'Impastatrice a spirale',
  intro: [
    'Impastatrice a spirale professionale con motore brushless e tecnologia inverter: dieci velocità selezionabili, capacità di 5 kg di impasto in una vasca da 7 litri. È la macchina su cui sono tarati tutti i lievitati di questo sito — pane, pizza, focacce e grandi lievitati.',
    'La versione HH (High Hydration) è progettata per gli impasti ad alta idratazione, fino al 95%: la spirale incorda anche le masse più idratate senza scaldarle, dove una planetaria casalinga si ferma. Made in Italy.',
  ],
  specifiche: [
    { voce: 'Motore', valore: 'Brushless 0,5 HP con inverter' },
    { voce: 'Velocità', valore: '10 selezionabili (90–320 giri/min)' },
    { voce: 'Capacità', valore: '5 kg di impasto — vasca da 7 litri' },
    { voce: 'Idratazione', valore: 'Fino al 95% (versione HH)' },
  ],
  lame: [],
  // Le ricette pensate per questa macchina sono intere famiglie del
  // ricettario: si linkano le categorie, non le singole ricette.
  categorieCollegate: ['pane', 'pizza', 'lievitati', 'focaccia'],
  manutenzione: [],
  sicurezza: [],
  fonti: [],
};
