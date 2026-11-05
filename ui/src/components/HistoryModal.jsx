import { Trash2 } from 'lucide-react'
import Modal from './Modal'

export default function HistoryModal({ open, onClose, items, onPick, onClear }) {
  return (
    <Modal open={open} onClose={onClose} title='Scan history'>
      {items.length === 0 ? (
        <p className='text-sm text-slate-400'>No scans yet. Finished scans are saved here, in your browser only.</p>
      ) : (
        <>
          <ul className='space-y-2'>
            {items.map((h) => (
              <li key={h.id}>
                <button
                  type='button'
                  onClick={() => onPick(h)}
                  className='w-full rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-left transition hover:border-indigo-400/40 hover:bg-white/[0.06]'
                >
                  <div className='truncate text-sm font-medium'>{h.target}</div>
                  <div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500'>
                    <span>{new Date(h.date).toLocaleString()}</span>
                    <span className='text-orange-300'>{(h.summary.critical || 0) + (h.summary.high || 0)} high</span>
                    <span className='text-amber-300'>{h.summary.medium || 0} medium</span>
                    <span className='text-sky-300'>{h.summary.low || 0} low</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <button
            type='button'
            onClick={onClear}
            className='mt-4 flex items-center gap-2 text-xs text-slate-500 transition hover:text-red-300'
          >
            <Trash2 size={14} /> Clear history
          </button>
        </>
      )}
    </Modal>
  )
}