import { Shield, ShieldCheck, Lock } from "./Icons";

interface HeaderProps {
  isUnlocked: boolean;
  onLock: () => void;
}

export function Header({ isUnlocked, onLock }: HeaderProps) {
  return (
    <header className="h-16 bg-[#1a1f36] border-b border-[#334155] flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#10b981] flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#f8fafc]">
            CryptoSeed Vault
          </h1>
          <p className="text-xs text-[#94a3b8]">Gestor de Semillas Seguro</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e293b] border border-[#334155]">
          {isUnlocked ? (
            <>
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span className="text-sm text-[#10b981]">Desbloqueado</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-sm text-[#f59e0b]">Bloqueado</span>
            </>
          )}
        </div>

        {isUnlocked && (
          <button
            onClick={onLock}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#334155] hover:bg-[#475569] transition-colors text-[#f8fafc] text-sm"
          >
            <Lock className="w-4 h-4" />
            Bloquear
          </button>
        )}
      </div>
    </header>
  );
}
