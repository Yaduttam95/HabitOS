import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IndianRupee, TrendingUp, Calendar, ChevronLeft, ChevronRight, History, ShoppingBag, Tag, List } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

const FinanceTracker = () => {
  const { logs, addExpense } = useData();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Form State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  
  // State for navigating months
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get current log for selected date
  const currentLog = logs[selectedDate];
  
  // Calculate expenses for selected date
  const todaysExpenses = useMemo(() => {
    const raw = currentLog?.moneySpent;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'number' && raw > 0) return [{ id: 'legacy', item: 'Legacy Entry', amount: raw, category: 'General' }];
    return [];
  }, [currentLog]);

  const todaysTotal = todaysExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    await addExpense(selectedDate, description, numAmount, category);
    
    // Reset form
    setAmount('');
    setDescription('');
    // Keep category
  };

  // Navigate months
  const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
  const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));

  // Calculate monthly stats for the viewable month
  const monthlyStats = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    let total = 0;
    const dailyData = days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const log = logs[dateStr];
      const raw = log?.moneySpent;
      
      let dayTotal = 0;
      let items = [];

      if (Array.isArray(raw)) {
        dayTotal = raw.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        items = raw;
      } else if (typeof raw === 'number') {
        dayTotal = raw;
      }

      total += dayTotal;

      return {
        date: format(day, 'd'),
        fullDate: dateStr,
        dayName: format(day, 'EEE'),
        amount: dayTotal,
        items
      };
    });

    // Filter for history list (days with spending)
    // We flatten the list to show individual transactions
    const history = [];
    dailyData.forEach(day => {
      if (day.items.length > 0) {
        day.items.forEach(item => {
          history.push({
            ...item,
            date: day.fullDate,
            dayName: day.dayName
          });
        });
      } else if (day.amount > 0) {
        history.push({
          id: 'legacy-' + day.fullDate,
          item: 'Legacy Entry',
          amount: day.amount,
          category: 'General',
          date: day.fullDate,
          dayName: day.dayName
        });
      }
    });

    // Sort by date descending
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    return { total, data: dailyData, history };
  }, [logs, currentMonth]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-base)]">Finance Tracker</h2>
          <p className="text-[var(--text-muted)]">Track your daily expenses</p>
        </div>
        
        <div className="flex items-center gap-4 bg-[var(--bg-card)] p-2 rounded-xl border border-[var(--border-base)] shadow-sm">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-base)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 min-w-[140px] justify-center font-semibold text-[var(--text-base)]">
            <Calendar className="w-4 h-4 text-primary-500" />
            {format(currentMonth, 'MMMM yyyy')}
          </div>

          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-base)] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-base)]">
          <h3 className="text-lg font-semibold text-[var(--text-base)] flex items-center gap-2 mb-6">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-primary-500" />
            </div>
            New Expense
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-base)] focus:ring-2 focus:ring-primary-500/50 text-[var(--text-base)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Amount (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-base)] focus:ring-2 focus:ring-primary-500/50 text-[var(--text-base)]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-base)] focus:ring-2 focus:ring-primary-500/50 text-[var(--text-base)] appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Description</label>
              <input
                type="text"
                placeholder="What did you buy?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-base)] focus:ring-2 focus:ring-primary-500/50 text-[var(--text-base)]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20 active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              Add Expense
            </button>
          </form>
        </div>

        {/* Daily Summary */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-base)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-base)] flex items-center gap-2">
              <div className="p-2 bg-primary-500/10 rounded-lg">
                <List className="w-5 h-5 text-primary-500" />
              </div>
              Expenses for {format(new Date(selectedDate), 'MMM d')}
            </h3>
            <span className="text-xl font-bold text-primary-500">₹{todaysTotal.toFixed(2)}</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-[200px] max-h-[300px]">
             {todaysExpenses.length > 0 ? (
               todaysExpenses.map((expense, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-base)]">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg bg-[var(--bg-subtle)] flex items-center justify-center text-xl">
                       {/* Simple emoji mapping based on category */}
                       {expense.category === 'Food' ? '🍔' : 
                        expense.category === 'Transport' ? '🚕' : 
                        expense.category === 'Shopping' ? '🛍️' : 
                        expense.category === 'Entertainment' ? '🎬' : 
                        expense.category === 'Bills' ? '🧾' : '💸' 
                       }
                     </div>
                     <div>
                       <p className="font-medium text-[var(--text-base)]">{expense.item}</p>
                       <p className="text-xs text-[var(--text-muted)]">{expense.category}</p>
                     </div>
                   </div>
                   <span className="font-bold text-[var(--text-base)]">₹{expense.amount}</span>
                 </div>
               ))
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)]">
                 <p>No expenses logged for this day.</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stat Card */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-xl shadow-primary-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-primary-100 text-sm font-medium mb-1 opacity-80">Total Spent</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₹{monthlyStats.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-primary-100 text-sm py-2 px-3 bg-black/20 rounded-lg w-fit backdrop-blur-sm">
              <Calendar className="w-4 h-4" />
              <span>{format(currentMonth, 'MMMM yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-base)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-base)]">Spending Trend</h3>
          </div>
          
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  dy={10}
                  interval={0}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis
                  hide
                />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-hover)', opacity: 0.5 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[var(--bg-popover)] border border-[var(--border-base)] text-[var(--text-base)] text-xs px-3 py-2 rounded-lg shadow-xl">
                          <p className="font-semibold mb-0.5">₹{payload[0].value.toFixed(2)}</p>
                          <p className="text-[var(--text-muted)]">{format(new Date(payload[0].payload.fullDate), 'MMM d, yyyy')}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" radius={[4, 4, 4, 4]} maxBarSize={40}>
                  {monthlyStats.data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.amount > 0 ? 'var(--color-primary-500)' : 'var(--bg-subtle)'} 
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-base)]">
        <h3 className="text-lg font-semibold text-[var(--text-base)] flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-primary-500" />
          Transaction History
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthlyStats.history.length > 0 ? (
            monthlyStats.history.map((item, idx) => (
              <div 
                key={`${item.date}-${idx}`} 
                onClick={() => {
                  setSelectedDate(item.date);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-app)] border border-transparent hover:border-[var(--border-base)] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-card)] border border-[var(--border-base)] flex flex-col items-center justify-center text-[var(--text-muted)] font-medium">
                    <span className="text-xs uppercase">{item.dayName}</span>
                    <span className="text-lg font-bold leading-none text-[var(--text-base)]">{format(new Date(item.date), 'd')}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--text-base)]">{item.item}</h4>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                       <span className="px-1.5 py-0.5 rounded bg-[var(--bg-subtle)]">{item.category}</span>
                       <span>{format(new Date(item.date), 'MMMM yyyy')}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[var(--text-base)] group-hover:text-primary-500 transition-colors">
                    ₹{parseFloat(item.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          ) : (
             <div className="col-span-full py-12 text-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border-base)] rounded-xl">
               <p>No transactions found for this month.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceTracker;
