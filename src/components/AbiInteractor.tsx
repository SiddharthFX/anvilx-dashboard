import { useMemo, useState } from "react";
import { ethers } from "ethers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface AbiInteractorProps {
  abi: any[];
  address: string;
  provider: ethers.Provider;
  signer?: ethers.Signer | null;
}

const AbiInteractor = ({ abi, address, provider, signer }: AbiInteractorProps) => {
  const { toast } = useToast();
  const contract = useMemo(() => new ethers.Contract(address, abi, signer || provider), [abi, address, provider, signer]);
  const [pending, setPending] = useState<string | null>(null);
  const [callResults, setCallResults] = useState<Record<string, string>>({});

  const functions = useMemo(() => abi.filter((f: any) => f.type === "function"), [abi]);

  const handleSubmit = async (fn: any, form: HTMLFormElement) => {
    form.preventDefault?.();
    const data = new FormData(form);
    const args = fn.inputs?.map((i: any) => {
      const v = data.get(i.name || "arg") as string;
      if (i.type.startsWith("uint") || i.type.startsWith("int")) return v === "" ? 0 : v;
      if (i.type === "address") return v;
      if (i.type === "bool") return v === "true" || v === "1" || v === "on";
      if (i.type === "string") return v;
      if (i.type.endsWith("[]")) {
        try { return JSON.parse(v); } catch { return []; }
      }
      return v;
    }) || [];

    try {
      if (fn.stateMutability === "view" || fn.stateMutability === "pure") {
        setPending(fn.name);
        const res = await (contract as any)[fn.name](...args);
        setCallResults((prev) => ({ ...prev, [fn.name]: Array.isArray(res) ? JSON.stringify(res) : String(res) }));
        setPending(null);
      } else {
        if (!signer) {
          toast({ title: "Signer required", description: "Connect a signer to send transactions.", variant: "destructive" });
          return;
        }
        setPending(fn.name);
        const valueEth = (data.get("__payable_value__") as string) || "0";
        const overrides = fn.stateMutability === "payable" ? { value: ethers.parseEther(valueEth || "0") } : {};
        const tx = await (contract.connect(signer) as any)[fn.name](...args, overrides);
        toast({ title: "Transaction sent", description: `Hash: ${tx.hash}` });
        const receipt = await tx.wait();
        toast({ title: "Transaction confirmed", description: `Block: ${receipt.blockNumber}` });
        setPending(null);
      }
    } catch (err: any) {
      console.error(err);
      toast({ title: "Call failed", description: err?.message || "Unknown error", variant: "destructive" });
      setPending(null);
    }
  };

  return (
    <div className="space-y-6">
      {functions.map((fn: any) => (
        <Card key={fn.name + fn.inputs?.length} className="p-4 glass-card">
          <form onSubmit={(e) => handleSubmit(fn, e.currentTarget)} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono font-semibold">{fn.name}({fn.inputs?.map((i: any) => i.type).join(', ')})</div>
                <div className="text-xs text-muted-foreground">{fn.stateMutability}</div>
              </div>
              {pending === fn.name ? (
                <span className="text-xs text-muted-foreground">Processing…</span>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fn.inputs?.map((input: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <Label htmlFor={`${fn.name}-${input.name || idx}`}>{input.name || `arg${idx}`}</Label>
                  <Input id={`${fn.name}-${input.name || idx}`} name={input.name || `arg${idx}`} placeholder={input.type} />
                </div>
              ))}

              {fn.stateMutability === "payable" && (
                <div className="space-y-1">
                  <Label htmlFor={`${fn.name}-value`}>ETH Value</Label>
                  <Input id={`${fn.name}-value`} name="__payable_value__" placeholder="0.0" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {fn.stateMutability === "view" || fn.stateMutability === "pure" ? "Read" : "Write"}
              </Button>
            </div>

            {(fn.stateMutability === "view" || fn.stateMutability === "pure") && callResults[fn.name] && (
              <>
                <Separator className="my-2" />
                <div className="text-xs text-muted-foreground break-all">
                  Result: {callResults[fn.name]}
                </div>
              </>
            )}
          </form>
        </Card>
      ))}
    </div>
  );
};

export default AbiInteractor;
