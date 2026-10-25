// Odgovori koje dijele kartica u heroju i upit za ponudu.

export const CUSTOMERS = [
  { value: 'Kućanstvo', icon: 'home', objekt: 'Obiteljska kuća' },
  { value: 'Tvrtka', icon: 'building', objekt: 'Tvrtka' },
];

export const NOT_SURE = 'Ne znam točno';

export const BILLS = {
  Kućanstvo: ['do 50 €', '50–100 €', '100–150 €', '150–250 €', 'iznad 250 €', NOT_SURE],
  Tvrtka: ['do 500 €', '500–2.000 €', '2.000–5.000 €', '5.000–10.000 €', 'iznad 10.000 €', NOT_SURE],
};

/** Objekt koji odgovara odabiru „Kućanstvo“ ili „Tvrtka“. */
export const objectFor = (kupac) => CUSTOMERS.find((c) => c.value === kupac)?.objekt;
