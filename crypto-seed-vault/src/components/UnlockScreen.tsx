import { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, Shield } from "./Icons";

interface UnlockScreenProps {
  onUnlock: (password: string) => Promise<boolean>;
}

export function UnlockScreen({ onUnlock }: UnlockScreenProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    setError("");

    if (!password) {
      setError("Ingresa tu contraseña");
      return;
    }

    setLoading(true);
    try {
      const success = await onUnlock(password);
      if (!success) {
        setError("Contraseña incorrecta");
      }
    } catch (err) {
      setError("Error al desbloquear");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-[#0f172a] p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#10b981] flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#f8fafc] mb-2">
            CryptoSeed Vault
          </h1>
          <p className="text-[#94a3b8]">Ingresa tu contraseña para acceder</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña maestra"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-12 py-4 bg-[#1e293b] border border-[#334155] rounded-xl text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] text-lg"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#f8fafc]"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[#ef4444]">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleUnlock}
            disabled={loading}
            className="w-full py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-lg"
          >
            {loading ? "Desbloqueando..." : "Desbloquear"}
          </button>
        </div>
      </div>
    </div>
  );
}
