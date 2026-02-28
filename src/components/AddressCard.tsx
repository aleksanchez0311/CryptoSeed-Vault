import { useState } from "react";
import { AddressInfo } from "../types";
import { Copy, Check } from "./Icons";

interface AddressCardProps {
  addressInfo: AddressInfo;
  networkColor: string;
}

export function AddressCard({ addressInfo, networkColor }: AddressCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(addressInfo.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 hover:border-[#475569] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-medium px-2 py-1 rounded"
            style={{
              backgroundColor: `${networkColor}20`,
              color: networkColor,
            }}
          >
            #{addressInfo.index}
          </span>
          <span className="text-xs text-[#94a3b8] font-mono">
            {addressInfo.path}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className={`p-2 rounded-lg transition-all ${
            copied
              ? "bg-[#10b981]/20 text-[#10b981]"
              : "bg-[#334155] hover:bg-[#475569] text-[#94a3b8]"
          }`}
          title="Copiar dirección"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="font-mono text-sm text-[#f8fafc] break-all bg-[#0f172a] p-3 rounded-lg">
        {addressInfo.address}
      </div>

      {copied && (
        <p className="text-xs text-[#10b981] mt-2 text-center">
          ¡Copiado al portapapeles!
        </p>
      )}
    </div>
  );
}
