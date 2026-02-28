import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { AddressCard } from "./components/AddressCard";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { UnlockScreen } from "./components/UnlockScreen";
import { Network, AddressInfo, SUPPORTED_NETWORKS } from "./types";
import { encryptSeed, decryptSeed, deriveAddresses } from "./services/crypto";
import {
  saveEncryptedSeed,
  getEncryptedSeed,
  saveMasterPasswordHash,
  getMasterPasswordHash,
  clearSession,
} from "./services/storage";

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasSeed, setHasSeed] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<Network | null>(null);
  const [addresses, setAddresses] = useState<AddressInfo[]>([]);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored seed on mount
  useEffect(() => {
    const checkStoredSeed = () => {
      const stored = getEncryptedSeed();
      setHasSeed(stored !== null);
      setLoading(false);
    };
    checkStoredSeed();
  }, []);

  // Lock on mount/unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearSession();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearSession();
    };
  }, []);

  const handleImportSeed = useCallback(
    async (mnemonicString: string, password: string): Promise<boolean> => {
      try {
        // Encrypt and store
        const encryptedData = await encryptSeed(mnemonicString, password);
        saveEncryptedSeed(encryptedData);

        // Store password hash for verification
        const passwordHash = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(password),
        );
        const hashArray = Array.from(new Uint8Array(passwordHash));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        saveMasterPasswordHash(hashHex);

        setMnemonic(mnemonicString);
        setHasSeed(true);
        setIsUnlocked(true);

        return true;
      } catch (error) {
        console.error("Error importing seed:", error);
        return false;
      }
    },
    [],
  );

  const handleUnlock = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        const storedData = getEncryptedSeed();
        if (!storedData) return false;

        // Verify password
        const passwordHash = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(password),
        );
        const hashArray = Array.from(new Uint8Array(passwordHash));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        const storedHash = getMasterPasswordHash();
        if (storedHash !== hashHex) {
          return false;
        }

        // Decrypt seed
        const decryptedMnemonic = await decryptSeed(storedData, password);
        setMnemonic(decryptedMnemonic);
        setIsUnlocked(true);

        return true;
      } catch (error) {
        console.error("Error unlocking:", error);
        return false;
      }
    },
    [],
  );

  const handleLock = useCallback(() => {
    setMnemonic(null);
    setIsUnlocked(false);
    setCurrentNetwork(null);
    setAddresses([]);
    clearSession();
  }, []);

  // Derive addresses when network changes
  useEffect(() => {
    const derive = async () => {
      if (!currentNetwork || !mnemonic) return;

      try {
        const derived = await deriveAddresses(mnemonic, currentNetwork, 0, 10);
        setAddresses(derived);
      } catch (error) {
        console.error("Error deriving addresses:", error);
        setAddresses([]);
      }
    };

    derive();
  }, [currentNetwork, mnemonic]);

  const handleSelectNetwork = useCallback((network: Network) => {
    setCurrentNetwork(network);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#94a3b8]">Cargando...</div>
      </div>
    );
  }

  if (!hasSeed) {
    return <WelcomeScreen onImportSeed={handleImportSeed} />;
  }

  if (!isUnlocked) {
    return <UnlockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <Header isUnlocked={isUnlocked} onLock={handleLock} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          networks={SUPPORTED_NETWORKS}
          selectedNetwork={currentNetwork}
          onSelectNetwork={handleSelectNetwork}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {currentNetwork ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#f8fafc] mb-2">
                  {currentNetwork.name}
                </h2>
                <p className="text-[#94a3b8]">
                  {addresses.length} direcciones • Ruta: {currentNetwork.path}
                </p>
              </div>

              <div className="grid gap-4">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.index}
                    addressInfo={addr}
                    networkColor={currentNetwork.color}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e293b] flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">
                  Selecciona una Red
                </h3>
                <p className="text-[#94a3b8]">
                  Elige una red del panel lateral para ver tus direcciones
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="h-12 bg-[#1a1f36] border-t border-[#334155] flex items-center justify-between px-6">
        <span className="text-xs text-[#94a3b8]">CryptoSeed Vault v1.0.0</span>
        <span className="text-xs text-[#10b981]">🔒 Encriptado localmente</span>
      </footer>
    </div>
  );
}

export default App;
