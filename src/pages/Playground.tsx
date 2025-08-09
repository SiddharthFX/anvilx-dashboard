import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAnvil } from "@/contexts/AnvilContext";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import AbiInteractor from "@/components/AbiInteractor";
import { ethers } from "ethers";
import wrapper from "solc/wrapper";

// Load solc from official CDN and wrap it for use
async function loadSolc() {
  if ((window as any).__solc) return (window as any).__solc;
  await new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = "https://binaries.soliditylang.org/wasm/soljson-latest.js";
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("Failed to load Solidity compiler"));
    document.body.appendChild(el);
  });
  const solc = wrapper((window as any).Module);
  (window as any).__solc = solc;
  return solc;
}

const SAMPLE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private value;

    function set(uint256 _value) public {
        value = _value;
    }

    function get() public view returns (uint256) {
        return value;
    }
}`;

const Playground = () => {
  const { state } = useAnvil();
  const { toast } = useToast();
  const [source, setSource] = useState<string>(SAMPLE);
  const [compiling, setCompiling] = useState(false);
  const [abi, setAbi] = useState<any[] | null>(null);
  const [bytecode, setBytecode] = useState<string | null>(null);
  const [contractName, setContractName] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [constructorInputs, setConstructorInputs] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const deploymentsKey = "anvilx_playground_deployments";

  const provider = state.provider as ethers.JsonRpcProvider | null;
  const signer = state.signer;

  useEffect(() => {
    document.title = "Smart Contract Playground | AnvilX";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = 'Compile, deploy, and interact with Solidity contracts on your local blockchain in the AnvilX Playground.';
      document.head.appendChild(m);
    } else {
      metaDesc.setAttribute('content', 'Compile, deploy, and interact with Solidity contracts on your local blockchain in the AnvilX Playground.');
    }
    const link = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.origin + '/playground');
    if (!link.parentElement) document.head.appendChild(link);
  }, []);

  const handleFile = async (file: File) => {
    const text = await file.text();
    setSource(text);
  };

  const compile = async () => {
    setCompiling(true);
    try {
      const solc = await loadSolc();
      const input = {
        language: "Solidity",
        sources: {
          "Contract.sol": { content: source },
        },
        settings: {
          outputSelection: {
            "*": { "*": ["abi", "evm.bytecode"] },
          },
        },
      };
      const output = JSON.parse(solc.compile(JSON.stringify(input)));
      if (output.errors?.length) {
        const err = output.errors.find((e: any) => e.severity === 'error');
        if (err) throw new Error(err.formattedMessage || err.message);
      }
      const fileContracts = output.contracts?.["Contract.sol"] || {};
      const names = Object.keys(fileContracts);
      if (names.length === 0) throw new Error("No contracts found");
      const name = names[0];
      const c = fileContracts[name];
      setAbi(c.abi);
      setBytecode(c.evm?.bytecode?.object ? (c.evm.bytecode.object.startsWith('0x') ? c.evm.bytecode.object : `0x${c.evm.bytecode.object}`) : null);
      setContractName(name);
      const ctor = c.abi.find((f: any) => f.type === 'constructor');
      setConstructorInputs(ctor?.inputs || []);
      toast({ title: "Compiled successfully", description: `${name} ready to deploy` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Compilation failed", description: e?.message || "Unknown error", variant: "destructive" });
    } finally {
      setCompiling(false);
    }
  };

  const deploy = async (form: HTMLFormElement) => {
    form.preventDefault?.();
    if (!provider || !signer) {
      toast({ title: "Connect required", description: "Please connect to a node with a signer.", variant: "destructive" });
      return;
    }
    if (!abi || !bytecode) return;
    try {
      setDeploying(true);
      const data = new FormData(form);
      const args = constructorInputs.map((i, idx) => data.get(i.name || `arg${idx}`));
      const factory = new ethers.ContractFactory(abi, bytecode, signer);
      const contract = await factory.deploy(...args as any);
      toast({ title: "Deploying…", description: `Tx: ${contract.deploymentTransaction()?.hash}` });
      await contract.waitForDeployment();
      const addr = await contract.getAddress();
      toast({ title: "Deployed", description: `Address: ${addr}` });
      setSelectedAddress(addr);
      // persist
      const prev = JSON.parse(localStorage.getItem(deploymentsKey) || "[]");
      prev.unshift({ name: contractName, address: addr, ts: Date.now(), abi });
      localStorage.setItem(deploymentsKey, JSON.stringify(prev.slice(0, 50)));
    } catch (e: any) {
      console.error(e);
      toast({ title: "Deployment failed", description: e?.message || "Unknown error", variant: "destructive" });
    } finally {
      setDeploying(false);
    }
  };

  const redeploy = async () => {
    if (!abi || !bytecode) return;
    const dummyForm = document.createElement('form');
    await deploy(dummyForm);
  };

  const saved = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(deploymentsKey) || "[]"); } catch { return []; }
  }, [selectedAddress]);

  return (
    <div className="min-h-screen bg-background">
      <AnvilXNavbar />
      <div className="flex">
        <AnvilXSidebar />
        <main className="flex-1 transition-all duration-300 p-8 space-y-6" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
          <header>
            <h1 className="text-3xl font-bold font-mono text-foreground">Smart Contract Playground</h1>
            <p className="text-muted-foreground mt-1">Compile, deploy, and interact with contracts on your local blockchain</p>
          </header>

          <Tabs defaultValue="editor">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="deploy" disabled={!abi || !bytecode}>Deploy</TabsTrigger>
              <TabsTrigger value="interact" disabled={!selectedAddress || !abi}>Interact</TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <Card className="p-4 space-y-4 glass-card">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Input type="file" accept=".sol" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
                    <Button variant="outline" onClick={() => setSource(SAMPLE)}>Load sample</Button>
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={compile} disabled={compiling}>
                    {compiling ? "Compiling…" : "Compile"}
                  </Button>
                </div>
                <Textarea value={source} onChange={(e) => setSource(e.target.value)} className="font-mono min-h-[300px]" placeholder="Paste Solidity code here" />
                {contractName && (
                  <div className="text-sm text-muted-foreground">Compiled: {contractName}</div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="deploy">
              <Card className="p-4 space-y-4 glass-card">
                <form onSubmit={(e) => deploy(e.currentTarget)} className="space-y-4">
                  {constructorInputs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {constructorInputs.map((i, idx) => (
                        <div key={idx} className="space-y-1">
                          <Label htmlFor={`ctor-${i.name || idx}`}>{i.name || `arg${idx}`}</Label>
                          <Input id={`ctor-${i.name || idx}`} name={i.name || `arg${idx}`} placeholder={i.type} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No constructor parameters</div>
                  )}
                  <div className="flex items-center gap-2">
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={deploying || !signer}>
                      {deploying ? "Deploying…" : "Deploy"}
                    </Button>
                    <Button type="button" variant="outline" onClick={redeploy} disabled={!abi || !bytecode || !signer}>One-click Re-deploy</Button>
                  </div>
                </form>
              </Card>

              <Card className="p-4 glass-card">
                <h3 className="font-semibold mb-2">Recent deployments</h3>
                <div className="space-y-2">
                  {saved.length === 0 && <div className="text-sm text-muted-foreground">No deployments yet</div>}
                  {saved.map((d: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{d.name || 'Contract'}</span>
                        <span className="text-muted-foreground">{new Date(d.ts).toLocaleString()}</span>
                      </div>
                      <button className="text-primary underline" onClick={() => setSelectedAddress(d.address)}>{d.address}</button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="interact">
              {selectedAddress && abi && provider ? (
                <AbiInteractor abi={abi} address={selectedAddress} provider={provider} signer={signer} />
              ) : (
                <Card className="p-6 glass-card text-sm text-muted-foreground">Select a deployed address above to interact.</Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Playground;
