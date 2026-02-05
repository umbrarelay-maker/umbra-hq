'use client';

import { useState, useEffect } from 'react';

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

interface PerformanceSnapshot {
  date: string;
  value: number;
  pnlPercent: number;
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
    snapshots?: PerformanceSnapshot[];
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

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDirectionColor = (direction: string) => {
    return direction === 'YES' 
      ? 'text-emerald-500 bg-emerald-500/10' 
      : 'text-rose-500 bg-rose-500/10';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-zinc-500">Loading portfolio...</div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-rose-500">{error || 'No portfolio data'}</div>
      </div>
    );
  }

  const openPositions = portfolio.positions.filter(p => p.status === 'open');
  const totalValue = portfolio.cash + portfolio.totalInvested;
  const pnlPercent = ((totalValue - portfolio.meta.startingCapital) / portfolio.meta.startingCapital) * 100;

  // Generate performance data for chart (simulated daily snapshots)
  const snapshots = portfolio.performance.snapshots || generateMockSnapshots(portfolio);

  return (
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

      {/* Performance Chart */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-emerald-500">◆</span>
          Performance
        </h2>
        <div className="h-48 relative">
          <PerformanceChart snapshots={snapshots} />
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
  );
}

// Generate mock snapshots for chart display
function generateMockSnapshots(portfolio: Portfolio): PerformanceSnapshot[] {
  const startDate = new Date(portfolio.meta.created);
  const today = new Date();
  const snapshots: PerformanceSnapshot[] = [];
  const startValue = portfolio.meta.startingCapital;
  const currentValue = portfolio.cash + portfolio.totalInvested;
  
  // Generate daily points from start to now
  const daysDiff = Math.max(1, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  for (let i = 0; i <= daysDiff; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Interpolate value with some variance
    const progress = i / daysDiff;
    const baseValue = startValue + (currentValue - startValue) * progress;
    const variance = (Math.random() - 0.5) * 20; // ±$10 variance
    const value = i === daysDiff ? currentValue : baseValue + variance;
    
    snapshots.push({
      date: date.toISOString(),
      value: Math.round(value * 100) / 100,
      pnlPercent: ((value - startValue) / startValue) * 100
    });
  }
  
  return snapshots;
}

// Simple SVG line chart component
function PerformanceChart({ snapshots }: { snapshots: PerformanceSnapshot[] }) {
  if (snapshots.length < 2) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
        Not enough data for chart
      </div>
    );
  }

  const values = snapshots.map(s => s.value);
  const minValue = Math.min(...values) * 0.995;
  const maxValue = Math.max(...values) * 1.005;
  const range = maxValue - minValue || 1;

  const width = 100;
  const height = 100;
  const padding = 5;

  const points = snapshots.map((snapshot, i) => {
    const x = padding + (i / (snapshots.length - 1)) * (width - padding * 2);
    const y = height - padding - ((snapshot.value - minValue) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const firstPoint = points.split(' ')[0];
  const lastPoint = points.split(' ').pop();
  const areaPath = `M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`;

  const isPositive = snapshots[snapshots.length - 1].value >= snapshots[0].value;
  const lineColor = isPositive ? '#10b981' : '#ef4444';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full w-full relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1={padding} y1={height/4} x2={width-padding} y2={height/4} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        <line x1={padding} y1={height*3/4} x2={width-padding} y2={height*3/4} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        
        {/* Area fill */}
        <path d={areaPath} fill={fillColor} />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* End dot */}
        {lastPoint && (
          <circle
            cx={lastPoint.split(',')[0]}
            cy={lastPoint.split(',')[1]}
            r="3"
            fill={lineColor}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      
      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-zinc-500 px-1">
        <span>{formatShortDate(snapshots[0].date)}</span>
        <span>{formatShortDate(snapshots[snapshots.length - 1].date)}</span>
      </div>
      <div className="absolute top-0 right-0 text-xs font-medium px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">
        <span className={isPositive ? 'text-emerald-500' : 'text-rose-500'}>
          {isPositive ? '+' : ''}{snapshots[snapshots.length - 1].pnlPercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
