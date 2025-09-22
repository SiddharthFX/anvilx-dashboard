import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  Hash, 
  Wallet, 
  ArrowRightLeft, 
  Copy,
  RefreshCw,
  Check,
  AlertTriangle,
  Binary,
  Clock,
  FileText,
  Zap,
  Code,
  Fuel,
  Key,
  Sparkles,
  Eye,
  EyeOff,
  Download,
  RotateCcw,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

const ToolsPage = () => {
  const [selectedTool, setSelectedTool] = useState<string>("hex-converter");
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Developer Tools | AnvilX";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = 'Essential blockchain development tools: hex converter, address formatter, unit converter, ABI decoder, gas calculator, and more.';
      document.head.appendChild(m);
    } else {
      metaDesc.setAttribute('content', 'Essential blockchain development tools: hex converter, address formatter, unit converter, ABI decoder, gas calculator, and more.');
    }
    const link = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.origin + '/tools');
    if (!link.parentElement) document.head.appendChild(link);
  }, []);

  // Hex Converter State
  const [hexInput, setHexInput] = useState("");
  const [decimalOutput, setDecimalOutput] = useState("");
  const [binaryOutput, setBinaryOutput] = useState("");

  // Address Formatter State
  const [addressInput, setAddressInput] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [checksumAddress, setChecksumAddress] = useState("");

  // Unit Converter State
  const [unitInput, setUnitInput] = useState("");
  const [unitFrom, setUnitFrom] = useState("wei");
  const [unitTo, setUnitTo] = useState("ether");
  const [unitOutput, setUnitOutput] = useState("");

  // Keccak256 Hash State
  const [hashInput, setHashInput] = useState("");
  const [hashOutput, setHashOutput] = useState("");

  // Timestamp Converter State
  const [timestampInput, setTimestampInput] = useState("");
  const [timestampOutput, setTimestampOutput] = useState("");

  // ABI Decoder State
  const [abiInput, setAbiInput] = useState("");
  const [dataInput, setDataInput] = useState("");
  const [decodedOutput, setDecodedOutput] = useState("");
  const [decodedParams, setDecodedParams] = useState<any[]>([]);

  // Gas Calculator State
  const [gasPrice, setGasPrice] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const [gasCost, setGasCost] = useState("");
  const [gasCostUSD, setGasCostUSD] = useState("");
  const [ethPrice, setEthPrice] = useState("");

  // Private Key Generator State
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState("");
  const [generatedAddress, setGeneratedAddress] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [mnemonic, setMnemonic] = useState("");

  // Copy to clipboard function
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  // Hex Converter
  useEffect(() => {
    if (hexInput) {
      try {
        const cleanHex = hexInput.replace(/^0x/i, '').trim();
        if (cleanHex.match(/^[0-9a-fA-F]+$/) && cleanHex.length > 0) {
          const decimal = BigInt(`0x${cleanHex}`).toString();
          setDecimalOutput(decimal);
          
          const binary = BigInt(`0x${cleanHex}`).toString(2);
          setBinaryOutput(binary);
        } else {
          setDecimalOutput("");
          setBinaryOutput("");
        }
      } catch (error) {
        setDecimalOutput("");
        setBinaryOutput("");
      }
    } else {
      setDecimalOutput("");
      setBinaryOutput("");
    }
  }, [hexInput]);

  // Address Formatter
  useEffect(() => {
    if (addressInput) {
      try {
        const address = addressInput.trim();
        if (ethers.isAddress(address)) {
          setFormattedAddress(address.toLowerCase());
          setChecksumAddress(ethers.getAddress(address));
        } else {
          setFormattedAddress("");
          setChecksumAddress("");
        }
      } catch (error) {
        setFormattedAddress("");
        setChecksumAddress("");
      }
    } else {
      setFormattedAddress("");
      setChecksumAddress("");
    }
  }, [addressInput]);

  // Unit Converter
  useEffect(() => {
    if (unitInput && unitFrom && unitTo) {
      try {
        const value = parseFloat(unitInput);
        if (!isNaN(value) && value >= 0) {
          const weiValue = ethers.parseUnits(value.toString(), unitFrom);
          const convertedValue = ethers.formatUnits(weiValue, unitTo);
          setUnitOutput(convertedValue);
        } else {
          setUnitOutput("");
        }
      } catch (error) {
        setUnitOutput("");
      }
    } else {
      setUnitOutput("");
    }
  }, [unitInput, unitFrom, unitTo]);

  // Keccak256 Hash
  useEffect(() => {
    if (hashInput && hashInput.trim()) {
      try {
        const hash = ethers.keccak256(ethers.toUtf8Bytes(hashInput.trim()));
        setHashOutput(hash);
      } catch (error) {
        setHashOutput("");
      }
    } else {
      setHashOutput("");
    }
  }, [hashInput]);

  // Timestamp Converter
  useEffect(() => {
    if (timestampInput) {
      try {
        const timestamp = parseInt(timestampInput);
        if (!isNaN(timestamp) && timestamp >= 0) {
          const date = new Date(timestamp * 1000);
          if (date.getTime() > 0) {
            setTimestampOutput(date.toISOString());
          } else {
            setTimestampOutput("");
          }
        } else {
          setTimestampOutput("");
        }
      } catch (error) {
        setTimestampOutput("");
      }
    } else {
      setTimestampOutput("");
    }
  }, [timestampInput]);

  // Gas Calculator
  useEffect(() => {
    if (gasPrice && gasLimit) {
      try {
        const price = parseFloat(gasPrice);
        const limit = parseFloat(gasLimit);
        if (!isNaN(price) && !isNaN(limit) && price >= 0 && limit >= 0) {
          const costWei = price * limit;
          const costEth = costWei / 1e18;
          setGasCost(costEth.toFixed(8));
          
          const ethPriceValue = parseFloat(ethPrice);
          if (!isNaN(ethPriceValue) && ethPriceValue >= 0) {
            const costUSD = costEth * ethPriceValue;
            setGasCostUSD(costUSD.toFixed(2));
          } else {
            setGasCostUSD("");
          }
        } else {
          setGasCost("");
          setGasCostUSD("");
        }
      } catch (error) {
        setGasCost("");
        setGasCostUSD("");
      }
    } else {
      setGasCost("");
      setGasCostUSD("");
    }
  }, [gasPrice, gasLimit, ethPrice]);

  const tools = [
    {
      id: "hex-converter",
      name: "Hex Converter",
      description: "Convert between hex, decimal, and binary",
      icon: Calculator,
      color: "bg-blue-500/10 text-blue-500",
      borderColor: "border-blue-500/20",
    },
    {
      id: "address-formatter",
      name: "Address Formatter",
      description: "Format and validate Ethereum addresses",
      icon: Wallet,
      color: "bg-green-500/10 text-green-500",
      borderColor: "border-green-500/20",
    },
    {
      id: "unit-converter",
      name: "Unit Converter",
      description: "Convert between Ethereum units (wei, gwei, ether)",
      icon: ArrowRightLeft,
      color: "bg-purple-500/10 text-purple-500",
      borderColor: "border-purple-500/20",
    },
    {
      id: "keccak256",
      name: "Keccak256 Hash",
      description: "Generate Keccak256 hash of text",
      icon: Hash,
      color: "bg-orange-500/10 text-orange-500",
      borderColor: "border-orange-500/20",
    },
    {
      id: "timestamp-converter",
      name: "Timestamp Converter",
      description: "Convert Unix timestamps to readable dates",
      icon: Clock,
      color: "bg-pink-500/10 text-pink-500",
      borderColor: "border-pink-500/20",
    },
    {
      id: "abi-decoder",
      name: "ABI Decoder",
      description: "Decode transaction data using ABI",
      icon: Code,
      color: "bg-indigo-500/10 text-indigo-500",
      borderColor: "border-indigo-500/20",
    },
    {
      id: "gas-calculator",
      name: "Gas Calculator",
      description: "Calculate gas costs and estimates",
      icon: Fuel,
      color: "bg-red-500/10 text-red-500",
      borderColor: "border-red-500/20",
    },
    {
      id: "private-key-generator",
      name: "Private Key Generator",
      description: "Generate secure private keys and addresses",
      icon: Key,
      color: "bg-teal-500/10 text-teal-500",
      borderColor: "border-teal-500/20",
    },
  ];

  // ABI Decoder function
  const decodeABI = () => {
    try {
      if (!abiInput || !dataInput) {
        setDecodedOutput("Please provide both ABI and data");
        return;
      }

      const abi = JSON.parse(abiInput);
      const iface = new ethers.Interface(abi);
      const decoded = iface.parseTransaction({ data: dataInput });
      
      setDecodedOutput(JSON.stringify(decoded, null, 2));
      setDecodedParams(decoded.args || []);
    } catch (error) {
      setDecodedOutput(`Error: ${error instanceof Error ? error.message : 'Invalid ABI or data'}`);
      setDecodedParams([]);
    }
  };

  // Generate Private Key
  const generatePrivateKey = () => {
    try {
      const wallet = ethers.Wallet.createRandom();
      setGeneratedPrivateKey(wallet.privateKey);
      setGeneratedAddress(wallet.address);
      setMnemonic(wallet.mnemonic?.phrase || "");
      setShowPrivateKey(false);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate private key",
        variant: "destructive",
      });
    }
  };

  const renderToolInterface = () => {
    switch (selectedTool) {
      case "hex-converter":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="hex-input" className="text-sm font-medium text-muted-foreground">Input Hex Value</Label>
              <Input 
                id="hex-input"
                placeholder="Enter hex value (e.g., 0x1a or 1a)" 
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                className="font-mono h-11 text-base border-2 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>
            
            <div className="grid gap-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Decimal</Label>
                <div className="flex gap-2">
                  <Input 
                    value={decimalOutput}
                    readOnly
                    className="font-mono h-11 text-base bg-muted/30 border-2"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(decimalOutput, "Decimal value")}
                    disabled={!decimalOutput || decimalOutput === "Invalid hex" || decimalOutput === "Error"}
                    className="h-11 px-3 border-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Binary</Label>
                <div className="flex gap-2">
                  <Input 
                    value={binaryOutput}
                    readOnly
                    className="font-mono h-11 text-base bg-muted/30 border-2"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(binaryOutput, "Binary value")}
                    disabled={!binaryOutput || binaryOutput === "Invalid hex" || binaryOutput === "Error"}
                    className="h-11 px-3 border-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "address-formatter":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="address-input" className="text-sm font-medium text-muted-foreground">Ethereum Address</Label>
              <Input 
                id="address-input"
                placeholder="Enter Ethereum address (e.g., 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6)" 
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                className="font-mono h-11 text-base border-2 focus:border-green-500/50 focus:ring-green-500/20"
              />
            </div>
            
            <div className="grid gap-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Lowercase Format</Label>
                <div className="flex gap-2">
                  <Input 
                    value={formattedAddress}
                    readOnly
                    className="font-mono h-11 text-base bg-muted/30 border-2"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(formattedAddress, "Lowercase address")}
                    disabled={!formattedAddress || formattedAddress === "Invalid address" || formattedAddress === "Error"}
                    className="h-11 px-3 border-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Checksum Format</Label>
                <div className="flex gap-2">
                  <Input 
                    value={checksumAddress}
                    readOnly
                    className="font-mono h-11 text-base bg-muted/30 border-2"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(checksumAddress, "Checksum address")}
                    disabled={!checksumAddress || checksumAddress === "Invalid address" || checksumAddress === "Error"}
                    className="h-11 px-3 border-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "unit-converter":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-3">
                <Label htmlFor="unit-input" className="text-sm font-medium text-muted-foreground">Value</Label>
                <Input 
                  id="unit-input"
                  type="number"
                  placeholder="1.0" 
                  value={unitInput}
                  onChange={(e) => setUnitInput(e.target.value)}
                  className="h-11 text-base border-2 focus:border-purple-500/50 focus:ring-purple-500/20"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="unit-from" className="text-sm font-medium text-muted-foreground">From Unit</Label>
                <select 
                  id="unit-from"
                  value={unitFrom}
                  onChange={(e) => setUnitFrom(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-input bg-background rounded-md text-base focus:border-purple-500/50 focus:ring-purple-500/20"
                >
                  <option value="wei">Wei</option>
                  <option value="kwei">Kwei</option>
                  <option value="mwei">Mwei</option>
                  <option value="gwei">Gwei</option>
                  <option value="szabo">Szabo</option>
                  <option value="finney">Finney</option>
                  <option value="ether">Ether</option>
                </select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="unit-to" className="text-sm font-medium text-muted-foreground">To Unit</Label>
                <select 
                  id="unit-to"
                  value={unitTo}
                  onChange={(e) => setUnitTo(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-input bg-background rounded-md text-base focus:border-purple-500/50 focus:ring-purple-500/20"
                >
                  <option value="wei">Wei</option>
                  <option value="kwei">Kwei</option>
                  <option value="mwei">Mwei</option>
                  <option value="gwei">Gwei</option>
                  <option value="szabo">Szabo</option>
                  <option value="finney">Finney</option>
                  <option value="ether">Ether</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">Converted Result</Label>
              <div className="flex gap-2">
                <Input 
                  value={unitOutput}
                  readOnly
                  className="font-mono h-11 text-base bg-muted/30 border-2"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(unitOutput, "Converted value")}
                  disabled={!unitOutput || unitOutput === "Invalid input" || unitOutput === "Error"}
                  className="h-11 px-3 border-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case "keccak256":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="hash-input" className="text-sm font-medium text-muted-foreground">Text to Hash</Label>
              <Textarea 
                id="hash-input"
                placeholder="Enter text to generate Keccak256 hash..." 
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                className="font-mono min-h-[120px] text-base border-2 focus:border-orange-500/50 focus:ring-orange-500/20 resize-none"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">Keccak256 Hash</Label>
              <div className="flex gap-2">
                <Input 
                  value={hashOutput}
                  readOnly
                  className="font-mono h-11 text-base bg-muted/30 border-2"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(hashOutput, "Hash")}
                  disabled={!hashOutput || hashOutput === "Error"}
                  className="h-11 px-3 border-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case "timestamp-converter":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="timestamp-input" className="text-sm font-medium text-muted-foreground">Unix Timestamp</Label>
              <Input 
                id="timestamp-input"
                placeholder="Enter Unix timestamp (e.g., 1640995200)" 
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                className="font-mono h-11 text-base border-2 focus:border-pink-500/50 focus:ring-pink-500/20"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">Date & Time (ISO)</Label>
              <div className="flex gap-2">
                <Input 
                  value={timestampOutput}
                  readOnly
                  className="font-mono h-11 text-base bg-muted/30 border-2"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(timestampOutput, "Date")}
                  disabled={!timestampOutput || timestampOutput === "Invalid timestamp" || timestampOutput === "Error"}
                  className="h-11 px-3 border-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setTimestampInput(Math.floor(Date.now() / 1000).toString())}
              className="w-full h-11 border-2"
            >
              <Clock className="mr-2 h-4 w-4" />
              Use Current Time
            </Button>
          </div>
        );

      case "abi-decoder":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="abi-input" className="text-sm font-medium text-muted-foreground">Contract ABI (JSON)</Label>
              <Textarea 
                id="abi-input"
                placeholder='[{"type":"function","name":"transfer","inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}]}]' 
                value={abiInput}
                onChange={(e) => setAbiInput(e.target.value)}
                className="font-mono min-h-[120px] text-base border-2 focus:border-indigo-500/50 focus:ring-indigo-500/20 resize-none"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="data-input" className="text-sm font-medium text-muted-foreground">Transaction Data</Label>
              <Input 
                id="data-input"
                placeholder="Enter transaction data (0x...)" 
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                className="font-mono h-11 text-base border-2 focus:border-indigo-500/50 focus:ring-indigo-500/20"
              />
            </div>
            
            <Button 
              onClick={decodeABI}
              className="w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
            >
              <Code className="mr-2 h-4 w-4" />
              Decode Transaction Data
            </Button>
            
            {decodedOutput && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Decoded Result</Label>
                <div className="flex gap-2">
                  <Textarea 
                    value={decodedOutput}
                    readOnly
                    className="font-mono min-h-[120px] text-base bg-muted/30 border-2 resize-none"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(decodedOutput, "Decoded data")}
                    className="h-11 px-3 border-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case "gas-calculator":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="gas-price" className="text-sm font-medium text-muted-foreground">Gas Price (Gwei)</Label>
                <Input 
                  id="gas-price"
                  type="number"
                  placeholder="Enter gas price in Gwei" 
                  value={gasPrice}
                  onChange={(e) => setGasPrice(e.target.value)}
                  className="h-11 text-base border-2 focus:border-red-500/50 focus:ring-red-500/20"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="gas-limit" className="text-sm font-medium text-muted-foreground">Gas Limit</Label>
                <Input 
                  id="gas-limit"
                  type="number"
                  placeholder="Enter gas limit" 
                  value={gasLimit}
                  onChange={(e) => setGasLimit(e.target.value)}
                  className="h-11 text-base border-2 focus:border-red-500/50 focus:ring-red-500/20"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="eth-price" className="text-sm font-medium text-muted-foreground">ETH Price (USD)</Label>
              <Input 
                id="eth-price"
                type="number"
                placeholder="Enter ETH price in USD" 
                value={ethPrice}
                onChange={(e) => setEthPrice(e.target.value)}
                className="h-11 text-base border-2 focus:border-red-500/50 focus:ring-red-500/20"
              />
            </div>
            
            <div className="grid gap-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Gas Cost (ETH)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={gasCost}
                    readOnly
                    className="font-mono h-11 text-base bg-muted/30 border-2"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(gasCost, "Gas cost")}
                    disabled={!gasCost || gasCost === "Error"}
                    className="h-11 px-3 border-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Gas Cost (USD)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={gasCostUSD}
                    readOnly
                    className="font-mono h-11 text-base bg-muted/30 border-2"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(gasCostUSD, "Gas cost USD")}
                    disabled={!gasCostUSD || gasCostUSD === "Error"}
                    className="h-11 px-3 border-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "private-key-generator":
        return (
          <div className="space-y-6">
            <Button 
              onClick={generatePrivateKey}
              className="w-full h-11 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white border-0"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate New Key Pair
            </Button>
            
            {generatedPrivateKey && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">Private Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      type={showPrivateKey ? "text" : "password"}
                      value={generatedPrivateKey}
                      readOnly
                      className="font-mono h-11 text-base bg-muted/30 border-2"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="h-11 px-3 border-2"
                    >
                      {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(generatedPrivateKey, "Private key")}
                      className="h-11 px-3 border-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={generatedAddress}
                      readOnly
                      className="font-mono h-11 text-base bg-muted/30 border-2"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(generatedAddress, "Address")}
                      className="h-11 px-3 border-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {mnemonic && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground">Mnemonic Phrase</Label>
                    <div className="flex gap-2">
                      <Textarea 
                        value={mnemonic}
                        readOnly
                        className="font-mono min-h-[80px] text-base bg-muted/30 border-2 resize-none"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(mnemonic, "Mnemonic")}
                        className="h-11 px-3 border-2"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnvilXNavbar />
      
      <div className="flex">
        <AnvilXSidebar />
        
        <main className="flex-1 transition-all duration-200 p-4 sm:p-6 space-y-4 sm:space-y-6" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-foreground">
                Developer Tools
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Essential utilities for blockchain development and debugging
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 h-[calc(100vh-200px)]">
            {/* Tools Sidebar */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold font-mono">Tools</h2>
                <Badge variant="secondary" className="text-xs">
                  {tools.length} tools
                </Badge>
              </div>
              
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
                {tools.map((tool) => (
                  <Card 
                    key={tool.id} 
                    className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                      selectedTool === tool.id 
                        ? `${tool.borderColor} bg-background shadow-md`
                        : 'border-border hover:border-muted-foreground/30 hover:bg-muted/20'
                    }`}
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tool.color}`}>
                        <tool.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm truncate">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {tool.description}
                        </p>
                      </div>
                      {selectedTool === tool.id && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tool Interface */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tools.find(t => t.id === selectedTool)?.color}`}>
                    {(() => {
                      const selectedToolData = tools.find(t => t.id === selectedTool);
                      if (selectedToolData?.icon) {
                        const IconComponent = selectedToolData.icon;
                        return <IconComponent className="h-5 w-5" />;
                      }
                      return null;
                    })()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-base sm:text-lg">
                      {tools.find(t => t.id === selectedTool)?.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {tools.find(t => t.id === selectedTool)?.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <Card className="p-4 sm:p-6 border-2 bg-background shadow-sm">
                <div className="space-y-6">
                  {renderToolInterface()}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ToolsPage;