'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';

interface Position {
  id: number;
  market: string;
  url: string;
  direction: 'YES' | 'NO';
  entryPrice: number;
  shares: number;
  cost: number;
  entryDate: string;
  thesis: string;
  status: 'open' | 'closed';
  targetExit: number;
  stopLoss: number;
  currentPrice?: number;
  exitPrice?: number;
  exitDate?: string;
  pnl?: number;
}

interface Portfolio {
  meta: {
    created: string;
    startingCapital: number;
    currency: string;
    strategy: string;
  };
  positions: Position[];
  cash: number;
  totalInvested: number;
  history: Position[];
  performance: {
    realizedPnL: number;
    unrealizedPnL: number;
  };
}

export default function TradingPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/trading');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPortfolio(data);
    } catch (err) {
      setError('Failed to load portfolio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (price: number) => {
    return `${(price * 100).toFixed(0)}¢`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDirectionColor = (direction: string) => {
    return direction === 'YES' 
      ? 'text-emerald-500 bg-emerald-500/10' 
      : 'text-rose-500 bg-rose-500/10';
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-zinc-500">Loading portfolio...</div>
        </div>
      </AppShell>
    );
  }

  if (error || !portfolio) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-rose-500">{error || 'No portfolio data'}</div>
        </div>
      </AppShell>
    );
  }

  const openPositions = portfolio.positions.filter(p => p.status === 'open');
  const totalValue = portfolio.cash + portfolio.totalInvested;
  const pnlPercent = ((totalValue - portfolio.meta.startingCapital) / portfolio.meta.startingCapital) * 100;

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📈</span>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              Paper Trading
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-500 rounded-full">
              SIMULATION
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {portfolio.meta.strategy}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Portfolio Value
            </p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-white">
              {formatCurrency(totalValue)}
            </p>
            <p className={`text-xs mt-1 ${pnlPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {pnlPercent >= 0 ? '↑' : '↓'} {Math.abs(pnlPercent).toFixed(2)}%
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Cash
            </p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-white">
              {formatCurrency(portfolio.cash)}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {((portfolio.cash / totalValue) * 100).toFixed(0)}% of portfolio
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Invested
            </p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-white">
              {formatCurrency(portfolio.totalInvested)}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {openPositions.length} open positions
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Realized P&L
            </p>
            <p className={`text-2xl font-semibold ${portfolio.performance.realizedPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatCurrency(portfolio.performance.realizedPnL)}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {portfolio.history.length} closed trades
            </p>
          </div>
        </div>

        {/* Open Positions */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-sky-500">●</span>
              Open Positions
            </h2>
          </div>
          
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {openPositions.length === 0 ? (
              <div className="px-5 py-8 text-center text-zinc-500">
                No open positions
              </div>
            ) : (
              openPositions.map((position) => (
                <div key={position.id} className="px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <a 
                          href={position.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-zinc-900 dark:text-white hover:text-sky-500 dark:hover:text-sky-400 transition-colors truncate"
                        >
                          {position.market}
                        </a>
                        <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${getDirectionColor(position.direction)}`}>
                          {position.direction}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-2">
                        {position.thesis}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <span>Entry: {formatPercent(position.entryPrice)}</span>
                        <span>Target: {formatPercent(position.targetExit)}</span>
                        <span>Stop: {formatPercent(position.stopLoss)}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {formatCurrency(position.cost)}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {position.shares} shares
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        {formatDate(position.entryDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Strategy Notes */}
        <div className="bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
            <span>🎯</span> Strategy
          </h3>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-sky-500 mt-0.5">•</span>
              Focus on AI/tech markets where research depth beats speed
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500 mt-0.5">•</span>
              Max 10% per position, always set stops
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500 mt-0.5">•</span>
              Document thesis before every trade
            </li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs text-zinc-400 text-center">
          Portfolio started {formatDate(portfolio.meta.created)} • Managed by Umbra
        </p>
      </div>
    </AppShell>
  );
}
