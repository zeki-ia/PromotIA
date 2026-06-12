import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { C, DISP, BODY, MES } from '../lib/tokens'

function npsCalc(responses) {
  if (!responses?.length) return null
  const p = responses.filter(r => r.e >= 9).length
  const d = responses.filter(r => r.e <= 6).length
  return Math.round(((p - d) / responses.length) * 100)
}

function npsBandColor(s) {
  if (s >= 50) return C.exc
  if (s >= 30) return C.primary
  if (s >= 0) return C.mejorar
  return C.critico
}

function Kpi({ title, value, sub, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: `1px solid ${C.line}` }}>
      <div style={{ fontSize: 12, color: C.tx3, fontWeight: 600, marginBottom: 6, fontFamily: DISP }}>{title}</div>
      <div style={{ fontSize: 30, fontWeight: 700, fontFamily: DISP, color: color || C.tx, lineHeight: 1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: 12, color: C.tx3, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default function ClientPortal({ clientId, clientName, onLogout }) {
  const [months, setMonths] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/client-portal?clientId=${clientId}`)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(d => { if (d.error) throw new Error(d.error); if (d.months) setMonths(d.months); setLoading(false) })
      .catch(e => { setError('Error al cargar los datos: ' + e.message); setLoading(false) })
  }, [clientId])

  // Todos los datos combinados
  const allResponses = months.flatMap(m => m.responses || [])
  const nps = npsCalc(allResponses)
  const promotores = allResponses.filter(r => r.e >= 9).length
  const detractores = allResponses.filter(r => r.e <= 6).length
  const pasivos = allResponses.filter(r => r.e >= 7 && r.e <= 8).length
  const npsColor = nps !== null ? npsBandColor(nps) : C.tx3

  // Serie mensual para el gráfico
  const chartData = months.map(m => {
    const [y, mm] = m.month.split('-')
    return { label: MES[+mm] + " '" + y.slice(2), nps: npsCalc(m.responses) }
  }).filter(d => d.nps !== null)

  // Últimos comentarios
  const comments = allResponses
    .filter(r => r.c)
    .slice(0, 10)
    .map(r => ({ text: r.c, score: r.e }))

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: C.surface, fontFamily: BODY }}>
      <div style={{ textAlign: 'center', color: C.tx2 }}>Cargando datos…</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: C.surface, fontFamily: BODY }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Archivo:wght@400;500;600;700&display=swap');*{box-sizing:border-box}`}</style>

      {/* Header */}
      <div style={{ background: C.grad, padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11, color: 'rgba(255,255,255,.7)', letterSpacing: 1, marginBottom: 2 }}>PORTAL NPS</div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, color: '#fff' }}>{clientName || 'Mi empresa'}</div>
        </div>
        <button onClick={onLogout} style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', borderRadius: 9, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: DISP }}>Salir</button>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px' }}>
        {error && <div style={{ background: C.criticoBg, color: C.critico, padding: '12px 16px', borderRadius: 12, marginBottom: 20, fontSize: 13 }}>{error}</div>}

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
          <Kpi title="NPS ACTUAL" value={nps !== null ? (nps > 0 ? '+' : '') + nps : '—'} sub="Net Promoter Score" color={npsColor}/>
          <Kpi title="RESPUESTAS" value={allResponses.length} sub="total acumulado"/>
          <Kpi title="PROMOTORES" value={promotores} sub={allResponses.length ? Math.round(promotores/allResponses.length*100) + '%' : ''}/>
          <Kpi title="DETRACTORES" value={detractores} sub={allResponses.length ? Math.round(detractores/allResponses.length*100) + '%' : ''}/>
        </div>

        {/* Gráfico tendencia */}
        {chartData.length > 1 && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 20px 10px', border: `1px solid ${C.line}`, marginBottom: 20 }}>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: C.tx, marginBottom: 16 }}>Evolución mensual del NPS</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.line}/>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: C.tx3 }}/>
                <YAxis domain={[-100,100]} tick={{ fontSize: 11, fill: C.tx3 }}/>
                <Tooltip formatter={v => [(v > 0 ? '+' : '') + v, 'NPS']}/>
                <Line type="monotone" dataKey="nps" stroke={C.primary} strokeWidth={2.5} dot={{ fill: C.primary, r: 4 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Distribución */}
        {allResponses.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: `1px solid ${C.line}`, marginBottom: 20 }}>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: C.tx, marginBottom: 14 }}>Distribución de respuestas</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Promotores (9-10)', count: promotores, color: C.exc },
                { label: 'Pasivos (7-8)', count: pasivos, color: C.tx3 },
                { label: 'Detractores (0-6)', count: detractores, color: C.critico },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ flex: 1, minWidth: 120, background: C.surface, borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, color }}>{count}</div>
                  <div style={{ fontSize: 12, color: C.tx2 }}>{label}</div>
                  <div style={{ height: 4, borderRadius: 2, background: C.line, marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: allResponses.length ? count/allResponses.length*100+'%' : '0%', background: color, borderRadius: 2 }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comentarios */}
        {comments.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: `1px solid ${C.line}` }}>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: C.tx, marginBottom: 14 }}>Últimas voces</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {comments.map((c, i) => (
                <div key={i} style={{ background: C.surface, borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 13, background: (c.score >= 9 ? C.excBg : c.score >= 7 ? C.lila4 : C.criticoBg), color: (c.score >= 9 ? C.exc : c.score >= 7 ? C.primary : C.critico), padding: '2px 8px', borderRadius: 8, flexShrink: 0 }}>{c.score}</span>
                  <span style={{ fontSize: 13.5, color: C.tx2, lineHeight: 1.5 }}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {allResponses.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.tx3 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: C.tx2, marginBottom: 6 }}>Aún no hay respuestas</div>
            <div style={{ fontSize: 13 }}>Las respuestas del link de encuesta aparecerán aquí automáticamente.</div>
          </div>
        )}
      </div>
    </div>
  )
}
