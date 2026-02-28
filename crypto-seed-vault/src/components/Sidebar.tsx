import { Network } from "../types";
import { Wallet, NetworkIcon, ChevronRight } from "./Icons";

interface SidebarProps {
  networks: Network[];
  selectedNetwork: Network | null;
  onSelectNetwork: (network: Network) => void;
}

export function Sidebar({
  networks,
  selectedNetwork,
  onSelectNetwork,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col">
      <div className="p-4 border-b border-[#334155]">
        <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
          Redes Soportadas
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {networks.map((network) => (
          <button
            key={network.id}
            onClick={() => onSelectNetwork(network)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
              selectedNetwork?.id === network.id
                ? "bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30"
                : "text-[#94a3b8] hover:bg-[#334155] hover:text-[#f8fafc] border border-transparent"
            }`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${network.color}20` }}
            >
              <Wallet className="w-4 h-4" style={{ color: network.color }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{network.name}</p>
              <p className="text-xs opacity-60">{network.symbol}</p>
            </div>
            <ChevronRight className="w-4 h-4 opacity-40" />
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#334155]">
        <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
          <NetworkIcon className="w-4 h-4" />
          <span>{networks.length} redes disponibles</span>
        </div>
      </div>
    </aside>
  );
}
