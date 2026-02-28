import { useState } from "react";
import { Shield, Key, Eye, EyeOff, Refresh, Check, AlertCircle } from "./Icons";

interface WelcomeScreenProps {
  onImportSeed: (mnemonic: string, password: string) => Promise<boolean>;
}

export function WelcomeScreen({ onImportSeed }: WelcomeScreenProps) {
  const [mode, setMode] = useState<"choice" | "import" | "create">("choice");
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedMnemonic, setGeneratedMnemonic] = useState<string[]>([]);
  const [confirmedBackup, setConfirmedBackup] = useState(false);

  const wordCount = 12;
  const words = mnemonic.trim().split(/\s+/);

  const validateAndImport = async () => {
    setError("");

    if (words.length !== 12 && words.length !== 24) {
      setError("La semilla debe tener 12 o 24 palabras");
      return;
    }

    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const success = await onImportSeed(mnemonic, password);
      if (!success) {
        setError("Error al guardar la semilla. Intenta de nuevo.");
      }
    } catch (err) {
      setError("Error al procesar la semilla");
    } finally {
      setLoading(false);
    }
  };

  const generateNew = async () => {
    setError("");

    // Generate random words (simplified for demo)
    const wordList = [
      "abandon",
      "ability",
      "able",
      "about",
      "above",
      "absent",
      "absorb",
      "abstract",
      "absurd",
      "abuse",
      "access",
      "accident",
      "account",
      "accuse",
      "achieve",
      "acid",
      "acoustic",
      "acquire",
      "across",
      "act",
    ];
    const newWords: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      newWords.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    setGeneratedMnemonic(newWords);
    setMode("create");
  };

  const saveGenerated = async () => {
    setError("");

    if (!confirmedBackup) {
      setError("Debes confirmar que has guardado tu semilla");
      return;
    }

    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const success = await onImportSeed(generatedMnemonic.join(" "), password);
      if (!success) {
        setError("Error al guardar la semilla. Intenta de nuevo.");
      }
    } catch (err) {
      setError("Error al procesar la semilla");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "choice") {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f172a] p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#10b981] flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#f8fafc] mb-2">
              CryptoSeed Vault
            </h1>
            <p className="text-[#94a3b8]">
              Gestiona tus semillas de criptomonedas de forma segura
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode("import")}
              className="w-full flex items-center gap-4 p-6 bg-[#1e293b] border border-[#334155] rounded-xl hover:border-[#3b82f6] hover:bg-[#1e293b]/80 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/20 flex items-center justify-center group-hover:bg-[#3b82f6]/30 transition-colors">
                <Key className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[#f8fafc]">
                  Importar Semilla
                </h3>
                <p className="text-sm text-[#94a3b8]">
                  Ya tengo una frase seed
                </p>
              </div>
            </button>

            <button
              onClick={generateNew}
              className="w-full flex items-center gap-4 p-6 bg-[#1e293b] border border-[#334155] rounded-xl hover:border-[#10b981] hover:bg-[#1e293b]/80 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#10b981]/20 flex items-center justify-center group-hover:bg-[#10b981]/30 transition-colors">
                <Refresh className="w-6 h-6 text-[#10b981]" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[#f8fafc]">
                  Crear Nueva
                </h3>
                <p className="text-sm text-[#94a3b8]">
                  Generar nueva frase seed
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f172a] p-8">
        <div className="max-w-2xl w-full">
          <button
            onClick={() => setMode("choice")}
            className="text-[#94a3b8] hover:text-[#f8fafc] mb-6 flex items-center gap-2"
          >
            ← Volver
          </button>

          <h2 className="text-2xl font-bold text-[#f8fafc] mb-2">
            Nueva Semilla Generada
          </h2>
          <p className="text-[#94a3b8] mb-6">
            Guarda estas palabras en orden. Son tu clave maestra.
          </p>

          <div
            className={`bg-[#1e293b] border border-[#334155] rounded-xl p-6 mb-6 ${!showMnemonic ? "blur-md" : ""}`}
          >
            <div className="grid grid-cols-3 gap-3">
              {generatedMnemonic.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-[#0f172a] p-2 rounded-lg"
                >
                  <span className="text-xs text-[#94a3b8] w-6">
                    {index + 1}.
                  </span>
                  <span className="font-mono text-sm text-[#f8fafc]">
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowMnemonic(!showMnemonic)}
            className="flex items-center gap-2 text-[#3b82f6] mb-6"
          >
            <Eye className="w-4 h-4" />
            {showMnemonic ? "Ocultar" : "Mostrar"} semilla
          </button>

          <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-[#f59e0b]">
              ⚠️ Importante: Guarda estas palabras en un lugar seguro. Si las
              pierdes, perderás acceso a tus fondos.
            </p>
          </div>

          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmedBackup}
              onChange={(e) => setConfirmedBackup(e.target.checked)}
              className="w-5 h-5 rounded border-[#334155] bg-[#1e293b] text-[#3b82f6] focus:ring-[#3b82f6]"
            />
            <span className="text-sm text-[#94a3b8]">
              He guardado mi semilla en un lugar seguro
            </span>
          </label>

          <div className="space-y-4 mb-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña maestra"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[#ef4444] mb-4">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={saveGenerated}
            disabled={loading}
            className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar y Continuar"}
          </button>
        </div>
      </div>
    );
  }

  // Import mode
  return (
    <div className="flex-1 flex items-center justify-center bg-[#0f172a] p-8">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => setMode("choice")}
          className="text-[#94a3b8] hover:text-[#f8fafc] mb-6 flex items-center gap-2"
        >
          ← Volver
        </button>

        <h2 className="text-2xl font-bold text-[#f8fafc] mb-2">
          Importar Semilla
        </h2>
        <p className="text-[#94a3b8] mb-6">
          Ingresa tu frase seed de 12 o 24 palabras
        </p>

        <div className="relative mb-6">
          <textarea
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            placeholder="word1 word2 word3 ..."
            rows={4}
            className="w-full px-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] font-mono resize-none"
          />
          <div className="absolute right-3 top-3 text-xs text-[#94a3b8]">
            {words.length} palabras
          </div>
        </div>

        {(words.length === 12 || words.length === 24) && (
          <div className="flex items-center gap-2 text-[#10b981] mb-6">
            <Check className="w-4 h-4" />
            <span className="text-sm">
              Semilla válida ({words.length} palabras)
            </span>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña maestra"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6]"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-[#ef4444] mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          onClick={validateAndImport}
          disabled={loading || words.length < 12}
          className="w-full py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Semilla"}
        </button>
      </div>
    </div>
  );
}
