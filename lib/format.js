// Formatiranje brojeva za hrvatski jezik. Tvrdi razmak ( ) sprječava lomljenje broja i jedinice.
const nf0 = new Intl.NumberFormat('hr-HR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('hr-HR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const n0 = (v) => nf0.format(Math.round(v));
export const n1 = (v) => nf1.format(v);
export const eur = (v) => `${n0(v)} €`;
export const pct = (v) => `${n0(v)} %`;
