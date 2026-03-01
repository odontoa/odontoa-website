"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  loadPredracunById,
  calcMedjuzbir,
  calcPopustAmount,
  calcUkupno,
  formatDate,
  formatRSD,
  type Predracun,
} from "../shared";

// ─── Dummy ordinacija data ────────────────────────────────

const ORDINACIJA = {
  naziv: "Stomatološka ordinacija \"Dental Studio\"",
  adresa: "Bulevar Mihajla Pupina 10",
  grad: "11000 Beograd",
  telefon: "011/222-3344",
  maticniBroj: "12345678",
  sifraDelatnosti: "8623",
  ziroRacun: "160-123456789-78",
  pib: "987654321",
};

const DISCLAIMER =
  "Ovaj predračun važi 30 dana od datuma izdavanja. Cene su izražene u dinarima (RSD) i uključuju PDV. " +
  "Predračun nije fiskalni račun. Za pitanja kontaktirajte ordinaciju.";

// ─── Component ────────────────────────────────────────────

export default function PredracunPrintTemplate({ predracunId }: { predracunId: string }) {
  const searchParams = useSearchParams();
  const autoprint = searchParams.get("autoprint") === "1";
  const printFired = useRef(false);

  const [pred, setPred] = useState<Predracun | null | "loading">("loading");

  useEffect(() => {
    setPred(loadPredracunById(predracunId));
  }, [predracunId]);

  useEffect(() => {
    if (!autoprint || pred === "loading" || pred === null || printFired.current) return;
    printFired.current = true;
    const timer = setTimeout(() => { window.print(); }, 200);
    return () => clearTimeout(timer);
  }, [autoprint, pred]);

  if (pred === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
        <p style={{ color: "#666" }}>Učitavanje...</p>
      </div>
    );
  }

  if (pred === null) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif", gap: "16px" }}>
        <p style={{ fontSize: "16px", color: "#333" }}>Predračun nije pronađen.</p>
        <p style={{ fontSize: "13px", color: "#888" }}>Vratite se nazad ili proverite da li je predračun obrisan.</p>
        <button
          onClick={() => window.history.back()}
          style={{ padding: "9px 20px", borderRadius: "8px", background: "#f0f0f0", border: "1px solid #ccc", cursor: "pointer", fontSize: "13px" }}
        >
          ← Nazad
        </button>
      </div>
    );
  }

  const medjuzbir    = calcMedjuzbir(pred.stavke);
  const popustAmount = calcPopustAmount(medjuzbir, pred.popust);
  const ukupno       = calcUkupno(pred.stavke, pred.popust);
  const printUrl     = typeof window !== "undefined" ? window.location.href.replace(/\?.*$/, "") : "";

  const popustLabel = pred.popust
    ? pred.popust.type === "procenat"
      ? `Popust (${pred.popust.value}%)`
      : "Popust"
    : "";

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          .no-print { display: none !important; }
          body { margin: 0; background: #fff; }
        }
        body { background: #e8e8e8; margin: 0; }
        .print-document {
          background: #fff;
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 15mm 18mm 15mm 18mm;
          box-sizing: border-box;
          font-family: 'Arial', 'Helvetica Neue', sans-serif;
          font-size: 11px;
          color: #111;
          line-height: 1.45;
        }
        table.stavke-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
        }
        table.stavke-table th,
        table.stavke-table td {
          border: 1px solid #333;
          padding: 5px 7px;
          font-size: 10.5px;
          text-align: left;
        }
        table.stavke-table th {
          background: #f4f4f4;
          font-weight: 700;
          text-align: center;
        }
        table.stavke-table td.num { text-align: right; }
        table.stavke-table td.center { text-align: center; }
        .header-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          margin-bottom: 14px;
        }
        .ordinacija-right {
          text-align: right;
          font-size: 10.5px;
          color: #333;
        }
        .ordinacija-right .label {
          color: #888;
          font-size: 9.5px;
        }
        .ordinacija-left .naziv {
          font-size: 13px;
          font-weight: 700;
          color: #111;
          margin-bottom: 3px;
        }
        .doc-title {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.3px;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 2px solid #111;
        }
        .section-label {
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #555;
          margin-bottom: 3px;
        }
        .pacijent-block {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 7px 10px;
          margin-bottom: 12px;
          font-size: 11px;
        }
        .summary-block {
          width: 220px;
          margin-left: auto;
          margin-top: 10px;
          font-size: 11px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
        }
        .summary-row.total {
          border-top: 1.5px solid #111;
          margin-top: 4px;
          padding-top: 6px;
          font-weight: 700;
          font-size: 12px;
        }
        .napomena-block {
          margin-top: 14px;
          padding: 7px 10px;
          background: #f9f9f9;
          border-left: 3px solid #888;
          font-size: 10.5px;
          color: #333;
        }
        .footer-disclaimer {
          margin-top: 20px;
          padding-top: 8px;
          border-top: 1px solid #ccc;
          font-size: 9px;
          color: #888;
          line-height: 1.5;
        }
        .logo-placeholder {
          width: 56px;
          height: 56px;
          border: 2px solid #ccc;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #aaa;
          margin-bottom: 8px;
          text-align: center;
          line-height: 1.3;
        }
        .toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: #f5f5f5;
          border-bottom: 1px solid #ddd;
        }
        .toolbar button {
          padding: 7px 16px;
          border-radius: 6px;
          border: 1px solid #ccc;
          background: #fff;
          cursor: pointer;
          font-size: 13px;
        }
        .toolbar button.primary {
          background: #1a56db;
          color: #fff;
          border-color: #1a56db;
          font-weight: 600;
        }
        .toolbar .info {
          font-size: 12px;
          color: #555;
          margin-left: 8px;
        }
      `}</style>

      {/* Toolbar — hidden on print */}
      <div className="no-print toolbar">
        <button onClick={() => window.history.back()}>← Nazad</button>
        <button className="primary" onClick={() => window.print()}>Štampaj / Sačuvaj PDF</button>
        <span className="info">
          Predračun br. {pred.brojPredracuna ?? pred.id} · {pred.pacijent}
        </span>
      </div>

      {/* A4 document */}
      <div className="print-document">

        {/* Header */}
        <div className="header-grid">
          <div className="ordinacija-left">
            <div className="logo-placeholder">Logo<br />ordinacije</div>
            <div className="naziv">{ORDINACIJA.naziv}</div>
            <div>{ORDINACIJA.adresa}</div>
            <div>{ORDINACIJA.grad}</div>
            <div>Tel: {ORDINACIJA.telefon}</div>
          </div>
          <div className="ordinacija-right">
            <div><span className="label">Matični br.: </span>{ORDINACIJA.maticniBroj}</div>
            <div><span className="label">Šifra del.: </span>{ORDINACIJA.sifraDelatnosti}</div>
            <div><span className="label">Žiro račun: </span>{ORDINACIJA.ziroRacun}</div>
            <div><span className="label">PIB: </span>{ORDINACIJA.pib}</div>
            <div style={{ marginTop: "8px" }}><span className="label">Datum: </span>{formatDate(pred.datum)}</div>
          </div>
        </div>

        {/* Title */}
        <div className="doc-title">
          PREDRAČUN br. {pred.brojPredracuna ?? pred.id}
        </div>

        {/* Pacijent */}
        <div className="section-label">Pacijent</div>
        <div className="pacijent-block">
          <strong>{pred.pacijent}</strong>
        </div>

        {/* Stavke table */}
        <div className="section-label">Stavke</div>
        <table className="stavke-table">
          <thead>
            <tr>
              <th style={{ width: "36px" }}>Rbr</th>
              <th>Vrsta usluge</th>
              <th style={{ width: "56px" }}>Zubi</th>
              <th style={{ width: "46px" }}>Kol.</th>
              <th style={{ width: "96px" }}>Cena (RSD)</th>
              <th style={{ width: "96px" }}>Ukupno (RSD)</th>
            </tr>
          </thead>
          <tbody>
            {pred.stavke.map((s, i) => {
              const qty     = s.poZubu && s.brojZuba ? s.brojZuba : s.kolicina;
              const lineSum = qty * s.cena;
              const zubiCell = s.poZubu && s.brojZuba ? `×${s.brojZuba}` : "";
              return (
                <tr key={s.id}>
                  <td className="center">{i + 1}</td>
                  <td>{s.naziv}</td>
                  <td className="center">{zubiCell}</td>
                  <td className="center">{s.poZubu ? 1 : s.kolicina}</td>
                  <td className="num">{formatRSD(s.cena)}</td>
                  <td className="num">{formatRSD(lineSum)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Summary */}
        <div className="summary-block">
          <div className="summary-row">
            <span>Međuzbir</span>
            <span>{formatRSD(medjuzbir)}</span>
          </div>
          {pred.popust && popustAmount > 0 && (
            <div className="summary-row">
              <span>{popustLabel}</span>
              <span>−{formatRSD(popustAmount)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>UKUPNO</span>
            <span>{formatRSD(ukupno)}</span>
          </div>
        </div>

        {/* Napomena */}
        {pred.napomena && (
          <div className="napomena-block">
            <strong>Napomena:</strong> {pred.napomena}
          </div>
        )}

        {/* Footer disclaimer */}
        <div className="footer-disclaimer">
          {DISCLAIMER}
          {autoprint && (
            <span style={{ display: "none" }} data-print-src={printUrl} />
          )}
        </div>
      </div>
    </>
  );
}
