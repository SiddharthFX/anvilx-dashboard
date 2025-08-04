import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock } from "lucide-react";

interface Block {
  number: number;
  timestamp: string;
  txCount: number;
  miner: string;
  gasUsed: string;
  gasLimit: string;
  hash: string;
}

const mockBlocks: Block[] = [
  {
    number: 18429571,
    timestamp: "2 mins ago",
    txCount: 142,
    miner: "0x1f9090aa...e5bb8ab6",
    gasUsed: "12.5M",
    gasLimit: "30M",
    hash: "0x7d1afe...91cb2"
  },
  {
    number: 18429570,
    timestamp: "14 mins ago",
    txCount: 98,
    miner: "0x95222290...dd40c661",
    gasUsed: "8.2M",
    gasLimit: "30M",
    hash: "0x9a8b4f...3de91"
  },
  {
    number: 18429569,
    timestamp: "26 mins ago",
    txCount: 203,
    miner: "0x1f9090aa...e5bb8ab6",
    gasUsed: "18.7M",
    gasLimit: "30M",
    hash: "0x3c7b2a...8f4e5"
  },
  {
    number: 18429568,
    timestamp: "38 mins ago",
    txCount: 156,
    miner: "0x52bc44d5...91e5e7",
    gasUsed: "15.3M",
    gasLimit: "30M",
    hash: "0x8f2d1c...7a9b3"
  },
  {
    number: 18429567,
    timestamp: "50 mins ago",
    txCount: 89,
    miner: "0x95222290...dd40c661",
    gasUsed: "6.8M",
    gasLimit: "30M",
    hash: "0x4e9a7b...2c8f1"
  }
];

const BlocksTable = () => {
  return (
    <Card className="glass-card hover-glass">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold font-space-grotesk text-foreground">
              Latest Blocks
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Recent blocks on the Ethereum network
            </p>
          </div>
          <Button variant="outline" size="sm" className="glass-card hover:glass-primary transition-all duration-300">
            View All Blocks
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-sm font-semibold text-foreground">Block</th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Age
                </div>
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">Txns</th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">Miner</th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">Gas Used</th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">Hash</th>
            </tr>
          </thead>
          <tbody>
            {mockBlocks.map((block) => (
              <tr 
                key={block.number} 
                className="border-b border-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer backdrop-blur-sm"
              >
                <td className="p-4">
                  <div className="font-mono text-sm font-medium text-primary">
                    {block.number.toLocaleString()}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{block.timestamp}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium">{block.txCount}</span>
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-muted-foreground">
                    {block.miner}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{block.gasUsed}</span>
                    <span className="text-xs text-muted-foreground">of {block.gasLimit}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-muted-foreground">
                    {block.hash}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default BlocksTable;